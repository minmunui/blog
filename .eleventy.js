const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);

  // Passthrough Copy
  eleventyConfig.addPassthroughCopy("src/assets");

  // Filters
  eleventyConfig.addFilter("dateIso", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toISODate();
  });

  eleventyConfig.addFilter("dateReadable", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
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
  eleventyConfig.setLibrary("md", mdLib);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: process.env.GO_LIVE ? "/blog/" : "/",
  };
};
