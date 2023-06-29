---
title: "Replacing Google Workspaces"
date: 2022-02-23T11:11:37-08:00
draft: false
usePageBundles: true
categories:
  - "Hosting"
tags:
  - "Mail"
  - "Mailcow"
# featureImage: "mailcow.png"
---
![:left](mailcow.png)

So with the announcement that my freeloading for email hosting on Google is [coming to an end](https://support.google.com/a/answer/2855120?product_name=UnuFlow&hl=en&visit_id=637812405048408439-1951323816&rd=1&src=supportwidget0&hl=en) I decided to go down the road of setting up my own email server as I figured since I was going to have to pay for email going forward why not just host it. Is this a good idea? I'm not sure, it seems like there are lots of blog posts that tell you not to host your own email but in my situation I have several custom domains that i was feeding into google with around 20 family ~~freeloaders~~ users and cost became an issue.

Most of my cloud expertise is in AWS which made it a pretty easy decision to use their services to host my server. Since mailcow is now dockerized this was fairly easy to create an ASG that has one EC2 server. I hosted the data on EFS which allows me to kill off the EC2 instance and it will rebuild itself within a few minutes. And to top it off I am using SES for outbound emails as this allows me to avoid getting my sent emails trapped in spam filters.

So far there have been very few gotchas, the issues that have come up were my own doing for over thinking the problem. Although once the family starts using the server I'm sure that I'll need to iterate. My only real fear is loosing data and I've been able to test that a few times by completely tearing down the stack and rebuilding and reloading from a backup. 

Next step is I'll be working on importing the families emails into the server and mailcow uses imapsync under the hood and actually getting some real traffic beyond myself and my emails.