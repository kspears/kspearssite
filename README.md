# kspearssite

kspears.com - a static site built with [Eleventy](https://11ty.dev/). Deployed on Cloudflare Pages.

## Development

```bash
npm install
npm run dev      # Start dev server with live reload (http://localhost:8080)
npm run build    # Build to _site/
```

## Structure

- `index.njk` - Home page with recent posts
- `about.njk` - About page
- `posts.njk` - All posts listing
- `posts/*.md` - Blog posts (Markdown with front matter)
- `_includes/` - Layouts and partials
- `css/style.css` - Styles
- `static/images/` - Images

## Cloudflare Pages

Build command: `npm run build`  
Output directory: `_site`

## Adding a new post

Create `posts/your-post-slug.md`:

```md
---
title: Your Post Title
date: 2025-01-30
category: Hosting
featuredImage: /static/images/your-image.png  # optional
featuredImageAlt: Description  # optional
---

Your content in Markdown...
```

The post will automatically appear on the home page and posts list.
