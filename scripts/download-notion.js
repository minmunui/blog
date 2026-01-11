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

async function convertToMarkdown(page) {
    // notion-to-md uses the customClient we passed
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);
    
    // Extract metadata
    const title = page.properties['이름']?.title[0]?.plain_text || "Untitled";
    const dateProp = page.properties['연동일시']?.date?.start || page.properties['생성 일시']?.created_time || page.created_time;
    const date = new Date(dateProp).toISOString();
    const description = page.properties['요약']?.rich_text[0]?.plain_text || "";
    const tags = page.properties['태그']?.multi_select?.map(tag => tag.name) || [];
    const category = page.properties['카테고리']?.select?.name || "Uncategorized";
    const lastModified = page.last_edited_time ? new Date(page.last_edited_time).toISOString() : date;
    
    const frontmatter = `---
title: "${title}"
date: ${date}
lastModified: ${lastModified}
description: "${description}"
tags: [${tags.map(t => `"${t}"`).join(", ")}]
category: "${category}"
visible: true
layout: layouts/post.njk
---

`;

    return  frontmatter + mdString.parent;
}

async function main() {
  if (!NOTION_TOKEN) {
    console.error("Error: NOTION_TOKEN is missing in .env file.");
    process.exit(1);
  }

  try {
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
      
      fs.writeFileSync(filePath, mdContent);
      console.log(`Generated: ${fileName}`);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
