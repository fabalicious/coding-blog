const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
    // Add syntax highlighting plugin
    eleventyConfig.addPlugin(syntaxHighlight, {
        init: ({ Prism }) => {
            Prism.languages.markdown = Prism.languages.extend('markup', {
                'frontmatter': {
                    pattern: /^---[\s\S]*?^---$/m,
                    greedy: true
                }
            });
        }
    });

    // Copy static assets
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/styles");

    // Add collections
    eleventyConfig.addCollection("posts", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/posts/*.md");
    });

    // Add date filter
    eleventyConfig.addFilter("formatDate", function(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    });

    // Add link preview shortcode
    eleventyConfig.addAsyncShortcode("linkPreview", require("./_11ty/shortcodes/link-preview"));

    // Add watch targets
    eleventyConfig.addWatchTarget("./src/css/");
    eleventyConfig.addWatchTarget("./src/js/");
    eleventyConfig.addWatchTarget("./src/css/link-preview.css");

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes"
        },
        pathPrefix: "/",
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
};
