---
title: "Tailwind CSS Tips & Tricks"
date: 2025-12-27T00:00:00.000Z
description: "Some cool utility classes I learned recently."
tags: ["css", "tailwind", "design"]
visible: true
layout: layouts/post.njk
---

Tailwind CSS makes styling rapid. Here are some utilities I love:

- `space-x-4`: Adds margin between child elements.
- `ring`: Adds a nice focus ring or border.
- `truncate`: Cuts off long text with an ellipsis.

## Dark Mode

We also implemented dark mode using the `dark:` prefix!

```html
<div class="bg-white dark:bg-black text-black dark:text-white">
  Adaptive Content
</div>
```
