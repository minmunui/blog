---
title: "Understanding Eleventy Collections"
date: 2025-12-29T00:00:00.000Z
description: "How Eleventy handles content organization using collections."
tags: ["eleventy", "coding"]
visible: true
layout: layouts/post.njk
---

Eleventy is a simpler static site generator. One of its best features is **Collections**.

## Grouping Content

You can group content by:
- Tags
- Directory structure
- Custom logic in `.eleventy.js`

For example, this blog uses a custom collection to sort posts by date.

```javascript
eleventyConfig.addCollection("posts", function(collectionApi) {
  return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
    return b.date - a.date;
  });
});
```
