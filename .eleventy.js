module.exports = function (eleventyConfig) {
  // Passthrough copy - CSS and static assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("static");

  // Custom filter for date formatting
  eleventyConfig.addFilter("dateDisplay", function (date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  // Strip HTML and truncate for excerpts (e.g. "Read more" previews). Default 150 chars.
  eleventyConfig.addFilter("excerpt", function (html, maxLength = 150) {
    if (!html) return "";
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim().replace(/\s+\S*$/, "") + "…";
  });
  // Same but by word count (e.g. first 25 words when excerpt is missing)
  eleventyConfig.addFilter("excerptWords", function (html, maxWords = 25) {
    if (!html) return "";
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return words.join(" ");
    return words.slice(0, maxWords).join(" ") + "…";
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "md", "njk"],
  };
};
