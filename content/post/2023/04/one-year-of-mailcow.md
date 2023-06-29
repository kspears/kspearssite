---
title: "One Year of Mailcow"
date: 2023-04-23T15:51:00-07:00
Description: "One year of self hosting with Mailcow."
Tags: 
  - "Mailcow"
  - "Mail"
Categories: 
  - "Hosting"
DisableComments: false
---

I've been hosting my personal domain's email on [Mailcow](https://mailcow.email/) for over a year now after Google apps started charging for their service and I have to say it works pretty good. I had an good architecture to start but needed to iterate on the design of the infrastructure. A few things that changed was I did swap out EFS for a 2nd EBS data volume that was dynamically attached at EC2 boot time. I moved my s3 back backups into glacier to reduce costs. And I did end up needing to upgrade my Ec2 to larger instance, I still need to revisit the metrics on this to determine if it was really necessary. But you know how it is when you break something and the family is using it... you hear about it.

## AWS Hosting
I do host this on AWS, my reasoning was just keeping my skills sharp. I had originally spin up the stack with Cloudformation to test out some of the latest changes offered in cloudformation but have since converted those scripts to Terraform. Terraform is so simple... there's no comparison. 
This is not the cheapest solution, I could host this anywhere or at home but I chose to put it here to continue honing my skills in AWS. Also let's be honest, AWS is a really solid host.

## Mailcow Pros:
- It's stupid simple to update, they have a script that will pull the latest changes from git, pull docker images, restart services and then clean up after itself.
- It just works, I've had no real problems other than one's I've created. If you leave it alone it just runs.
- Backup and restore works. I've only done full backups and restores so I can't comment on restoring individual messages but I can spin up a empty ec2 instance and bring up my server quickly with a restore from S3.


## Mailcow Cons:
- It's a bit bloated, there's some included things that may not be really needed. Like for instance I like the activesync for my mobile device but honestly I could probably just use IMAP idle.
- SOGO is ugly and we did have some issues with the calendar. It'd be nice if there was a better solution. I know there is an option to use Nextcloud but I haven't played with that yet.
- Documentation could use some work, there were some places that I had to do some extra research and guessing when I was building out my solution.


## TLDR
If you want to host your own email, Mailcow just works. There are other less resource intensive solutions out there that have good reviews too, I suggest trying them out and pick what works for you. Now with hind sight being 20/20 would I self host email again? I think so? I've learned a lot about email and specifically DKIM and SPF records (I'll do a whole post about those) and so that's been a good growing experience. I haven't lost any email (knock on wood) so that's good. And honestly the server does just work.
