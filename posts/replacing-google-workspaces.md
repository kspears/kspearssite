---
title: Replacing Google Workspaces
date: 2022-02-23
category: Hosting
featuredImage: /static/images/google-migration.svg
featuredImageAlt: Google Workspace to self-hosted migration
---

So with the announcement that my freeloading for email hosting on Google is [coming to an end](https://support.google.com/a/answer/2855120?product_name=UnuFlow&hl=en&visit_id=637812405048408439-1951323816&rd=1&src=supportwidget0&hl=en) I decided to go down the road of setting up my own email server. I figured since I was going to have to pay for email going forward... why not just host it?

Is this a good idea? I'm not sure. There are lots of blog posts that tell you not to host your own email. But in my situation I have several custom domains that I was feeding into Google with around 20 family ~~freeloaders~~ users and cost became an issue.

## The Setup

Most of my cloud expertise is in AWS which made it a pretty easy decision to use their services. Since mailcow is now dockerized it was fairly easy to create an ASG with one EC2 server. I hosted the data on EFS which allows me to kill off the EC2 instance and it will rebuild itself within a few minutes. And to top it off I'm using SES for outbound emails to avoid getting my sent emails trapped in spam filters.

## So Far So Good

There have been very few gotchas... the issues that have come up were my own doing for overthinking the problem. Although once the family starts using the server I'm sure I'll need to iterate. My only real fear is losing data and I've been able to test that a few times by completely tearing down the stack, rebuilding, and reloading from a backup.

## Next Steps

I'll be working on importing the family's emails into the server. Mailcow uses imapsync under the hood so hopefully that goes smoothly. Time to get some real traffic beyond just myself.
