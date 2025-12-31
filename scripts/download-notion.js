require("dotenv").config();
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const fs = require("fs");
const path = require("path");

// Initialize Notion Client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Pass custom transformers if needed
const n2m = new NotionToMarkdown({ notionClient: notion });

// Database ID from env
const databaseId = process.env.NOTION_DATABASE_ID;

async function getBlogPosts() {
  console.log("Fetching posts from Notion...");
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Status",
      status: {
        equals: "Published", // Only fetch published posts
      },
    },
  });

  return response.results;
}

async function convertToMarkdown(page) {
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);
    
    // Extract metadata from properties (Adjust these based on your Notion DB schema)
    const title = page.properties.Name?.title[0]?.plain_text || "Untitled";
    // Use ISO string for date to preserve full timestamp info
    const date = page.properties.Date?.date?.start ? new Date(page.properties.Date.date.start).toISOString() : new Date().toISOString();
    const description = page.properties.Description?.rich_text[0]?.plain_text || "";
    const tags = page.properties.Tags?.multi_select?.map(tag => tag.name) || [];
    const category = page.properties.Category?.select?.name || "Uncategorized";
    const lastModified = page.last_edited_time ? new Date(page.last_edited_time).toISOString() : date;
    
    // Create Front Matter
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
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    console.error("Error: NOTION_TOKEN or NOTION_DATABASE_ID is missing in .env file.");
    process.exit(1);
  }

  const posts = await getBlogPosts();
  console.log(`Found ${posts.length} posts.`);

  for (const post of posts) {
    const mdContent = await convertToMarkdown(post);
    const title = post.properties.Name?.title[0]?.plain_text || "Untitled";
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    const fileName = `${slug}.md`;
    const filePath = path.join(__dirname, "../src/posts", fileName);
    
    fs.writeFileSync(filePath, mdContent);
    console.log(`Generated: ${fileName}`);
  }
}

main();
