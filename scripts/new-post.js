#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const title = process.argv.slice(2).join(" ");
if (!title) {
  console.error("Usage: npm run new \"My Post Title\"");
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const date = new Date().toISOString().split("T")[0];
const filePath = path.join(__dirname, "..", "posts", `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`Post already exists: ${filePath}`);
  process.exit(1);
}

const content = `---
title: ${title}
date: ${date}
tags: posts
category:
---

`;

fs.writeFileSync(filePath, content);
console.log(`Created: posts/${slug}.md`);
