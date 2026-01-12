const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const ogs = require("open-graph-scraper");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);

  // Ignore .gitignore (required since we gitignore the generated posts)
  eleventyConfig.setUseGitIgnore(false);

  // Passthrough Copy
  eleventyConfig.addPassthroughCopy("src/assets");

  // Filters
  eleventyConfig.addFilter("dateIso", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("Asia/Seoul").toISODate();
  });

  eleventyConfig.addFilter("dateReadable", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("Asia/Seoul").toFormat("yyyy. MM. dd");
  });

  // Collections
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(item => item.data.visible !== false) // Default to visible if property is missing, or strictly check for true if preferred
      .sort((a, b) => b.date - a.date);
  });

  // Markdown Library
  const mdLib = markdownIt({


    html: true,
    breaks: true,
    linkify: true,
  });

  // Custom Embed Rule for markdown-it
  // Replaces [embed](url) and [video](url) with responsive iframes
  mdLib.core.ruler.push('embeds', (state) => {
    state.tokens.forEach(token => {
      if (token.type === 'inline' && token.children) {
        token.children.forEach(child => {
          if (child.type === 'link_open') return; // Skip actual links if needed, but we targeting text pattern
        });
        
        // Regex replacement on text content (simple approach for [embed](...))
        // Note: markdown-it parses [embed](url) as a Link token usually. 
        // A better approach is to use a custom renderer for `link_open` or post-process string.
        
        // Let's iterate tokens to find Link nodes that match our specific syntax "embed" or "video" as text?
        // Actually, markdown-it parses [text](url) as:
        // link_open -> text ("embed") -> link_close
      }
    });
    // Simplified: Use a regex replacement on the rendered HTML instead? 
    // No, cleaner to do it as a rule or checking link tokens.
  });
  
  // Alternative: Override the link_open renderer to intercept [embed] links
  const defaultRender = mdLib.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  mdLib.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex('href');
    const href = token.attrs[hrefIndex][1];
    
    // Check key text in the next token (which should be the link text)
    const nextToken = tokens[idx + 1];
    if (nextToken && nextToken.type === 'text') {
        const text = nextToken.content.trim();
        
        // 1. Google Maps
        if (text === 'embed' && (href.includes('maps.app.goo.gl') || href.includes('google.com/maps'))) {
             // We need to consume the next 2 tokens (text + link_close) to not render them
             tokens[idx].hidden = true;     // link_open
             nextToken.hidden = true;       // text "embed" (CRITICAL FIX: this was missing before or not working if processed late)
             tokens[idx+2].hidden = true;   // link_close
             
             let embedUrl = href;
             if (href.includes('maps.app.goo.gl')) {
                 embedUrl = href;
             } else {
                 embedUrl = href;
             }
             
             return `<div class="aspect-video w-full max-w-[600px] mx-auto rounded-xl overflow-hidden shadow-lg my-4"><iframe src="${embedUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe></div>`;
        }
        
        // 2. YouTube
        if (text === 'video' && (href.includes('youtube.com') || href.includes('youtu.be'))) {
             tokens[idx].hidden = true;
             nextToken.hidden = true; 
             nextToken.content = ""; // Ensure content is empty just in case hidden doesn't work for some renderer quirk
             tokens[idx+2].hidden = true;
             
             let videoId = '';
             if (href.includes('youtu.be')) {
                 videoId = href.split('youtu.be/')[1].split('?')[0];
             } else if (href.includes('v=')) {
                 videoId = href.split('v=')[1].split('&')[0];
             }
             
             if (videoId) {
                 return `<div class="aspect-video w-full max-w-[600px] mx-auto rounded-xl overflow-hidden shadow-lg my-8"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
             }
        }
    }

    return defaultRender(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", mdLib);



  // Async Transform for [bookmark](url)
  // Replaces <p><a href="url">[bookmark]</a></p> with a preview card
  eleventyConfig.addTransform("bookmarks", async function(content) {
    if( this.page.outputPath && this.page.outputPath.endsWith(".html") ) {
      const bookmarkRegex = /<p>\s*<a\s+href="([^"]+)">\s*\[?bookmark\]?\s*<\/a>\s*<\/p>/g;
      
      let matches = [];
      let match;
      while ((match = bookmarkRegex.exec(content)) !== null) {
        matches.push({
            fullMatch: match[0],
            url: match[1]
        });
      }
      
      if (matches.length > 0) {
          for (const m of matches) {
              try {
                  const { result } = await ogs({ url: m.url });
                  
                  const title = result.ogTitle || result.twitterTitle || m.url;
                  const description = result.ogDescription || result.twitterDescription || "";
                  const image = result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || "";
                  const siteName = result.ogSiteName || new URL(m.url).hostname;
                  const favicon = result.favicon; // Use ogs favicon if available
                  
                  // New Design: Robust Flexbox Card
                  // Uses internal styles for images to guarantee no margin interference
                  const cardHtml = `
                    <div class="not-prose my-6 w-full">
                        <a href="${m.url}" target="_blank" rel="noopener noreferrer" class="block no-underline group bg-card border rounded-xl overflow-hidden hover:bg-muted/50 transition-colors">
                            <div class="flex flex-col sm:flex-row h-auto sm:h-32">
                                <div class="flex-1 p-4 flex flex-col justify-between overflow-hidden">
                                    <div>
                                        <h3 class="font-semibold text-base truncate m-0 group-hover:text-primary transition-colors">${title}</h3>
                                        <p class="text-sm text-muted-foreground line-clamp-2 mt-1 m-0">${description}</p>
                                    </div>
                                    <div class="flex items-center gap-2 mt-2">
                                        ${favicon ? `<img src="${favicon.startsWith('/') && (process.env.GO_LIVE || process.env.CI) ? '/blog' + favicon : favicon}" alt="" style="width: 16px; height: 16px; margin: 0 !important; display: block;" />` : ''}
                                        <span class="text-xs text-muted-foreground truncate m-0">${siteName}</span>
                                    </div>
                                </div>
                                ${image || ((process.env.GO_LIVE || process.env.CI) ? '/blog/assets/infologo/pusan_univ.png' : '/assets/infologo/pusan_univ.png') ? `
                                <div class="sm:w-40 h-48 sm:h-auto shrink-0 relative border-t sm:border-t-0 sm:border-l bg-muted">
                                    <img src="${image || ((process.env.GO_LIVE || process.env.CI) ? '/blog/assets/infologo/pusan_univ.png' : '/assets/infologo/pusan_univ.png')}" alt="${title}" class="absolute inset-0 w-full h-full object-cover" style="margin: 0 !important; display: block;" />
                                </div>
                                ` : ''}
                            </div>
                        </a>
                    </div>
                  `;
                  
                  content = content.replace(m.fullMatch, cardHtml);
              } catch (e) {
                  // Fallback for YouTube or errors
                  console.error(`Error fetching OG data for ${m.url}:`, e.message);
                  
                   if (m.url.includes('youtube.com') || m.url.includes('youtu.be')) {
                       // Manual construction for YouTube
                       const videoId = m.url.includes('youtu.be') ? m.url.split('youtu.be/')[1].split('?')[0] : (m.url.split('v=')[1] ? m.url.split('v=')[1].split('&')[0] : '');
                       if (videoId) {
                           const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                           const fallbackHtml = `
                            <div class="not-prose my-6 w-full">
                                <a href="${m.url}" target="_blank" rel="noopener noreferrer" class="block no-underline group bg-card border rounded-xl overflow-hidden hover:bg-muted/50 transition-colors">
                                    <div class="flex flex-col sm:flex-row h-auto sm:h-32">
                                        <div class="flex-1 p-4 flex flex-col justify-between overflow-hidden">
                                            <div>
                                                <h3 class="font-semibold text-base truncate m-0 group-hover:text-primary transition-colors">Watch on YouTube</h3>
                                                <p class="text-sm text-muted-foreground line-clamp-2 mt-1 m-0">${m.url}</p>
                                            </div>
                                            <div class="flex items-center gap-2 mt-2">
                                                <img src="https://www.youtube.com/s/desktop/1cd3b66d/img/favicon.ico" alt="" style="width: 16px; height: 16px; margin: 0 !important; display: block;" />
                                                <span class="text-xs text-muted-foreground truncate m-0">YouTube</span>
                                            </div>
                                        </div>
                                        <div class="sm:w-40 h-48 sm:h-auto shrink-0 relative border-t sm:border-t-0 sm:border-l bg-muted">
                                            <img src="${thumb}" alt="YouTube Thumbnail" class="absolute inset-0 w-full h-full object-cover" style="margin: 0 !important; display: block;" />
                                        </div>
                                    </div>
                                </a>
                            </div>
                           `;
                           content = content.replace(m.fullMatch, fallbackHtml);
                           continue;
                       }
                   }
              }
          }
      }
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: (process.env.GO_LIVE || process.env.CI) ? "/blog/" : "/",
  };
};

