require("dotenv").config();
const { NotionToMarkdown } = require("notion-to-md");
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

// Custom Transformer for Images
n2m.setCustomTransformer("image", async (block) => {
  const { image } = block;
  const imageUrl = image.type === "external" ? image.external.url : image.file.url;
  const caption = image.caption.length ? image.caption[0].plain_text : "";
  
  // Use block ID as filename to ensure uniqueness
  // Determine extension from URL if possible, default to .png if complex
  let ext = ".png";
  if (imageUrl.includes(".jpg") || imageUrl.includes(".jpeg")) ext = ".jpg";
  else if (imageUrl.includes(".png")) ext = ".png";
  else if (imageUrl.includes(".gif")) ext = ".gif";
  else if (imageUrl.includes(".webp")) ext = ".webp";
  
  const filename = `${block.id}${ext}`;
  const localUrl = await downloadImage(imageUrl, filename);

  if (localUrl) {
    return `![${caption}](${localUrl})`;
  } else {
    return `![${caption}](${imageUrl})`; // Fallback to original URL
  }
});

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
                const colorMap = {
                    "gray": "gray", "brown": "brown", "orange": "orange", "yellow": "orange", "green": "green", "blue": "blue", "purple": "purple", "pink": "pink", "red": "red",
                    "gray_background": "background-color: #ebeced", "brown_background": "background-color: #e9e5e3", "orange_background": "background-color: #faebdd", 
                    "yellow_background": "background-color: #fbf3db", "green_background": "background-color: #ddedea", "blue_background": "background-color: #e6f3f7", 
                    "purple_background": "background-color: #f6f3f9", "pink_background": "background-color: #fbf2f5", "red_background": "background-color: #fbe4e4",
                };
                const style = colorMap[text.annotations.color] || text.annotations.color;
                const isBg = text.annotations.color.includes('_background');
                const styleAttr = isBg ? style : `color: ${style}`;
                md = `<span style="${styleAttr}">${md}</span>`;
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
n2m.setCustomTransformer("paragraph", async (block) => {
    return colorize(block.paragraph.rich_text);
});
// Headings
n2m.setCustomTransformer("heading_1", async (block) => {
    return `# ${colorize(block.heading_1.rich_text)}`;
});
n2m.setCustomTransformer("heading_2", async (block) => {
    return `## ${colorize(block.heading_2.rich_text)}`;
});
n2m.setCustomTransformer("heading_3", async (block) => {
    return `### ${colorize(block.heading_3.rich_text)}`;
});
// Lists
n2m.setCustomTransformer("bulleted_list_item", async (block) => {
    return `- ${colorize(block.bulleted_list_item.rich_text)}`;
});
n2m.setCustomTransformer("numbered_list_item", async (block) => {
    return `1. ${colorize(block.numbered_list_item.rich_text)}`;
});
n2m.setCustomTransformer("quote", async (block) => {
    return `> ${colorize(block.quote.rich_text)}`;
});
n2m.setCustomTransformer("callout", async (block) => {
    const icon = block.callout.icon?.emoji || "💡";
    return `> ${icon} ${colorize(block.callout.rich_text)}`;
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
