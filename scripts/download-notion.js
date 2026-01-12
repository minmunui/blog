require("dotenv").config();
const { NotionToMarkdown } = require("notion-to-md");
const md = require('markdown-it')({
    html: true,
    breaks: true,
    linkify: true
});
const fs = require("fs");
const path = require("path");

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Custom Fetch Helper
async function notionFetch(endpoint, method = "GET", body = null) {
  const url = `https://api.notion.com/v1/${endpoint}`;
  const options = {
    method,
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
  };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion API Error ${res.status}: ${text}`);
  }
  return res.json();
}

// Image Download Helper
async function downloadImage(url, filename) {
  const assetsDir = path.join(__dirname, "../src/assets/images");
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const filePath = path.join(assetsDir, filename);

  // If file exists, skip download (build cache optimization)
  // You might want to remove this check if you need to update changed images with same ID
  if (fs.existsSync(filePath)) {
    return `../../assets/images/${filename}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    console.log(`Downloaded image: ${filename}`);
    return `../../assets/images/${filename}`;
  } catch (error) {
    console.error(`Error downloading image ${url}:`, error);
    return null;
  }
}

// Custom Client for notion-to-md
const customClient = {
  blocks: {
    children: {
      list: async ({ block_id }) => {
        return notionFetch(`blocks/${block_id}/children?page_size=100`);
      }
    }
  }
};

// Initialize NotionToMarkdown with custom client
const n2m = new NotionToMarkdown({ notionClient: customClient });



async function getBlogPosts() {
  console.log("Fetching posts from Notion via Custom Fetch...");
  const response = await notionFetch(`databases/${NOTION_DATABASE_ID}/query`, "POST", {
      filter: {
        property: "작성상태",
        status: {
            equals: "작성 완료",
        },
      },
  });
  return response.results;
}



// Re-writing the replacement content block
// Defining a color-aware writer
const colorize = (textArr) => {
    return textArr.map(text => {
        const content = text.plain_text || text.text?.content;
        if (!content) return "";
        
        let md = content;
        
        // Apply logic closely matching n2m's default but adding span
        if (text.annotations) {
            if (text.annotations.code) md = `\`${md}\``;
            if (text.annotations.bold) md = `**${md}**`;
            if (text.annotations.italic) md = `_${md}_`;
            if (text.annotations.strikethrough) md = `~~${md}~~`;
            if (text.annotations.underline) md = `<u>${md}</u>`;
            
            if (text.annotations.color && text.annotations.color !== 'default') {
                const color = text.annotations.color;
                // Notion colors often include _background suffix for bg colors
                // Our CSS classes are .notion-[color] and .notion-[color]-background
                // If it is a background color, Notion sends e.g., "blue_background"
                // Our class is .notion-blue-background.
                // If it is text color, Notion sends "blue"
                // Our class is .notion-blue.
                
                // We can directly map the notion color string to our class name format
                // Notion: "blue" -> Class: "notion-blue"
                // Notion: "blue_background" -> Class: "notion-blue-background"
                
                const className = `notion-${color.replace('_', '-')}`;
                md = `<span class="${className}">${md}</span>`;
            }
        }
        
        // Handle links
        if (text.href) {
            md = `[${md}](${text.href})`;
        }
        
        return md;
    }).join("");
};

// Register transformers
// Paragraph
// Register transformers
// Paragraph
n2m.setCustomTransformer("paragraph", async (block) => {
    const { color } = block.paragraph;
    const text = colorize(block.paragraph.rich_text);
    
    if (color && color !== 'default') {
        const className = `notion-${color.replace('_', '-')}`;
        return `<p class="${className}">${text}</p>`;
    }
    return text;
});

// Image Transformer
n2m.setCustomTransformer("image", async (block) => {
  const { image } = block;
  const imageUrl = image.type === "external" ? image.external.url : image.file.url;
  
  // Fix: Join all plain text parts to ensure we capture the full caption including resize commands
  const rawCaption = image.caption.map(item => item.plain_text).join("");
  
  // Parse width from caption
  const sizeMatch = rawCaption.match(/\|\s*(\d+(?:px|%)?)\s*$/);
  
  let width = null;
  let caption = rawCaption;
  
  if (sizeMatch) {
      width = sizeMatch[1];
      // If no unit provided, assume px if simple number (though html width attr allows unitless, css likes px)
      // Actually standard HTML width attribute is pixels. Style width needs unit.
      // Let's rely on style width. If unitless, append px? 
      // User says "| 300", implies 300px.
      if (!width.endsWith('%') && !width.endsWith('px')) {
          width += 'px';
      }
      
      // Remove the size syntax from the caption text
      caption = rawCaption.replace(sizeMatch[0], "").trim();
  }
  
  // Use block ID as filename to ensure uniqueness
  let ext = ".png";
  if (imageUrl.includes(".jpg") || imageUrl.includes(".jpeg")) ext = ".jpg";
  else if (imageUrl.includes(".png")) ext = ".png";
  else if (imageUrl.includes(".gif")) ext = ".gif";
  else if (imageUrl.includes(".webp")) ext = ".webp";
  
  const filename = `${block.id}${ext}`;
  const localUrl = await downloadImage(imageUrl, filename);
  const finalUrl = localUrl || imageUrl;
  
  // Return HTML for precise control
  // Apply 'mx-auto block' for centering (matching globals.css behavior)
  let styleAttr = "";
  if (width) {
      styleAttr = ` style="width: ${width};"`;
  }
  
  const alt = caption || "image";
  
  // Note: We use <img ...> which is inline-block by default. 
  // We add 'mx-auto block' Tailwind classes to center it.
  // We also put the caption in a figcaption if it exists?
  // Standard markdown `![caption](url)` just puts img. 
  // Let's stick to simple img.
  
  return `<img src="${finalUrl}" alt="${alt}" class="mx-auto block"${styleAttr} />${caption ? `<figcaption class="text-center text-sm text-gray-500 mt-2">${caption}</figcaption>` : ''}`; 
});

// Headings
n2m.setCustomTransformer("heading_1", async (block) => {
    const { color } = block.heading_1;
    const text = colorize(block.heading_1.rich_text);
    if (color && color !== 'default') {
        const className = `notion-${color.replace('_', '-')}`;
        return `<h1 class="${className}">${text}</h1>`;
    }
    return `# ${text}`;
});
n2m.setCustomTransformer("heading_2", async (block) => {
    const { color } = block.heading_2;
    const text = colorize(block.heading_2.rich_text);
    if (color && color !== 'default') {
        const className = `notion-${color.replace('_', '-')}`;
        return `<h2 class="${className}">${text}</h2>`;
    }
    return `## ${text}`;
});
n2m.setCustomTransformer("heading_3", async (block) => {
    const { color } = block.heading_3;
    const text = colorize(block.heading_3.rich_text);
    if (color && color !== 'default') {
        const className = `notion-${color.replace('_', '-')}`;
        return `<h3 class="${className}">${text}</h3>`;
    }
    return `### ${text}`;
});

// Quote
n2m.setCustomTransformer("quote", async (block) => {
    const { color } = block.quote;
    const text = colorize(block.quote.rich_text);
    if (color && color !== 'default') {
        const className = `notion-${color.replace('_', '-')}`;
        return `<blockquote class="${className}">${text}</blockquote>`;
    }
    return `> ${text}`;
});

// Callout
n2m.setCustomTransformer("callout", async (block) => {
    const { color } = block.callout;
    const icon = block.callout.icon?.emoji || "💡";
    const text = colorize(block.callout.rich_text);
    if (color && color !== 'default') {
         const className = `notion-${color.replace('_', '-')}`;
         // Callout in Notion is a block with background.
         // We'll wrap in a div or blockquote with class. 
         // Since standard MD for callout is blockquote, we use that.
         return `<blockquote class="${className}"> ${icon} ${text}</blockquote>`;
    }
    return `> ${icon} ${text}`;
});

// Lists (Leave as is for now to avoid breaking list structure)
n2m.setCustomTransformer("bulleted_list_item", async (block) => {
    return `- ${colorize(block.bulleted_list_item.rich_text)}`;
});
n2m.setCustomTransformer("numbered_list_item", async (block) => {
    return `1. ${colorize(block.numbered_list_item.rich_text)}`;
});

// Column Spprt
n2m.setCustomTransformer("column_list", async (block) => {
    // Get children (columns)
    const { results: columns } = await notionFetch(`blocks/${block.id}/children`);
    
    let html = `<div class="notion-column-list flex flex-col md:flex-row gap-4 w-full my-4">`;
    
    for (const column of columns) {
         // Recursive: Get MD for content inside the column
         const contentBlocks = await n2m.pageToMarkdown(column.id);
         const contentMd = n2m.toMarkdownString(contentBlocks).parent;
         
         // Render markdown to HTML to ensure it displays correctly inside the div
         const contentHtml = md.render(contentMd);
         
         html += `<div class="notion-column flex-1 min-w-0">\n${contentHtml}\n</div>`;
    }
    
    html += `</div>`;
    return html;
});

n2m.setCustomTransformer("column", async (block) => {
    // Should be handled by column_list, but if called directly, return content
    // However, since we handle recursion in column_list, this might not be reached
    // UNLESS n2m traverses it.
    // If we return undefined, n2m uses default.
    // We return empty string because we handle the content in column_list
    return ""; 
});

async function convertToMarkdown(page) {
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);
    
    // Extract metadata
    const title = page.properties['이름']?.title[0]?.plain_text || "Untitled";
    const dateProp = page.properties['연동일시']?.date?.start || page.properties['생성 일시']?.created_time || page.created_time;
    const date = new Date(dateProp).toISOString();
    const description = page.properties['요약']?.rich_text[0]?.plain_text || "";
    // Tags -> 태그
    const tags = page.properties['태그']?.multi_select?.map(tag => tag.name) || [];
    
    // Category -> 카테고리
    const category = page.properties['카테고리']?.select?.name || "Uncategorized";

    // Thumbnail -> 썸네일 (URL type)
    let thumbnail = page.properties['썸네일']?.url || "";
    
    // Download thumbnail if exists
    if (thumbnail) {
        // Use page ID + thumb suffix
        let ext = ".png";
        if (thumbnail.includes(".jpg") || thumbnail.includes(".jpeg")) ext = ".jpg";
        else if (thumbnail.includes(".png")) ext = ".png";
        
        const filename = `thumb-${page.id}${ext}`;
        const localThumb = await downloadImage(thumbnail, filename);
        if (localThumb) thumbnail = localThumb;
    }
    
    const lastModified = page.last_edited_time ? new Date(page.last_edited_time).toISOString() : date;
    
    const frontmatter = `---
title: "${title}"
date: ${date}
lastModified: ${lastModified}
description: "${description}"
tags: [${tags.map(t => `"${t}"`).join(", ")}]
category: "${category}"
thumbnail: "${thumbnail}"
visible: true
layout: layouts/post.njk
---

`;

    return  frontmatter + mdString.parent;
}

async function main() {
  if (!NOTION_TOKEN) {
    console.error("Error: NOTION_TOKEN is missing. Check .env file or GitHub Secrets.");
    process.exit(1);
  }

  try {
    console.log(`Using Database ID: ${NOTION_DATABASE_ID}`);
    const posts = await getBlogPosts();
    console.log(`Found ${posts.length} posts.`);

    for (const post of posts) {
      console.log(`Processing: ${post.id}`);
      const mdContent = await convertToMarkdown(post);
      
      const title = post.properties['이름']?.title[0]?.plain_text || "Untitled";
      // Sanitize filename
      const slug = title.trim().toLowerCase().replace(/[^a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+/g, "-").replace(/(^-|-$)/g, "") || "untitled";
      
      const fileName = `${slug}.md`;
      const filePath = path.join(__dirname, "../src/posts", fileName);
      
      // Ensure directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      
      fs.writeFileSync(filePath, mdContent);
      console.log(`Generated: ${fileName}`);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
