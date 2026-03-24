---
title: Prison Fellowship's Migration to Cloudflare
date: 2025-03-21
tags: posts
category: Hosting
featuredImage: /static/images/cloudflare-migration.svg
featuredImageAlt: Cloudflare CDN network diagram
---

I've been using Cloudflare for my personal domains for a few years now so when the topic came up at work to move Prison Fellowship's DNS I already knew what we were getting into. DNS isn't that complicated... as long as you don't fat finger it.

## The Migration

We put all of our DNS zone info into Terraform which was honestly the most valuable part of the whole project. Going through every record forced us to audit what we actually had. We found several dead domains that nobody was using anymore and a few that needed to be migrated over to our sister organization. That kind of cleanup doesn't happen unless you're forced to look at everything.

We also moved our domain registrar from Network Solutions to Cloudflare. The renewal pricing alone made this worth it... we're paying significantly less now for registration renewals.

## What We Gained

The DNS migration was table stakes. The real wins were everything else Cloudflare gives you once your domains are on their platform:

- **WAF** — We were excited to turn this on. Having a web application firewall in front of our sites without managing it ourselves is a huge improvement to our security posture.
- **Caching** — Immediate performance boost for our public-facing sites with minimal configuration.
- **Security features** — DDoS protection, SSL management, bot detection... all just there once you're on the platform.

## Pro vs Business Plan

I spent some time deciding between Cloudflare's Pro and Business plans. The Business plan has 24/7 support, more WAF rules (50 vs 20), custom SSL certificates, and advanced DDoS protection. All good stuff but overkill for where we are right now.

We went with Pro. It covers our needs and we can always upgrade later if the 20 WAF rules feel limiting or we need the enhanced support. No reason to pay for features we aren't going to use on day one.

## Surprises?

Honestly... not really. Since I'd already done this for my personal domains I knew the process well. The biggest effort was the Terraform work and the domain audit, not the actual migration itself. Sometimes the boring migrations are the best ones.
