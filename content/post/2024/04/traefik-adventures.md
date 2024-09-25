---
title: "Traefik Adventures"
date: 2024-04-05T06:12:22-07:00
Description: "Trying out a new reverse proxy"
Tags:
  - "Mailcow"
  - "Docker"
Categories:
  - "Hosting"
DisableComments: false
thumbnail: "images/traefik-logo.jpeg"
---

At work I was looking into ways to decrease our AWS Public IP usage. We, along with the rest of the world were hit with monthly cost of using too many IP addresses. And it was not a total surprise since AWS announced this was coming, the price tag was a bit of shock though as I hadn't realized how many Public IP's we were using.

So I starting thinking through the problem and thought, well what if we routed our traffic through a single load balancer and then hit some sort of internal load balancer to route traffic to our various apps and whatnot. So after a little bit of searching I decided to check out Traefik as it seems to have the features that I think I'll need.

I have never used Traefik before so I decided to try it in my home lab, switching out Nginx Proxy Manager. 

**Full disclaimer:** NPM works well and was simple to use, I'm not bashing it here. I did have some minor issues that annoyed me, like trying to store its config in git. I'm sure there are ways to do it, I tried terraform but it never worked the way I thought it should. But I wanted to try out Traefik prior to talking about it at work, so here we are.

## Traefik Overview
So let me pause a moment here to talk about how Traefik works, there are lots of posts out there about this topic but I will say none of them did a great job of describing the architecture of Traefik. 

### Static Config
The Static Config (traefik.yaml or traefik.toml) describes the global settings like logging and if the dashboard / API are enabled. Ingress is setup here, so if you want 443 or 80 open you do that here and you give them a name like HTTP or web. This is also where you setup lets encrypt settings, in my case I wanted to do DNS verification and so I've got those configs set for Cloudflare.

```
log:
  level: WARN
  filepath: "/etc/traefik/log/traefik.log"
accessLog:
  filePath: "/etc/traefik/log/access.log"
api:
  dashboard: true                             # Enable the dashboard
  #insecure: true

# Certificate Resolvers are responsible for retrieving certificates from an ACME server
# See https://doc.traefik.io/traefik/https/acme/#certificate-resolvers
certificatesResolvers:
  letsencrypt:
    acme:
#      caServer: https://acme-staging-v02.api.letsencrypt.org/directory
      email: "letsencrypt@spearssoftware.com"  # Email address used for registration
      storage: "/etc/traefik/acme/acme.json"    # File or key used for certificates storage
      #tlsChallenge: {}
      dnsChallenge:
        provider: cloudflare



entryPoints:
  http:
    address: ":80"                            # Create the HTTP entrypoint on port 80
    http:
      redirections:                           # HTTPS redirection (80 to 443)
        entryPoint:
          to: "https"                         # The target element
          scheme: "https"                     # The redirection target scheme
  https:
    address: ":443"                           # Create the HTTPS entrypoint on port 443

global:
  checknewversion: true                       # Periodically check if a new version has been released.
  sendanonymoususage: true                    # Periodically send anonymous usage statistics.

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"   # Listen to the UNIX Docker socket
    exposedByDefault: false                   # Only expose container that are explicitly enabled (using label traefik.enabled)
    # network: "traefik-net"                    # Default network to use for connections to all containers.
    # swarmmode: true                           # Activates the Swarm Mode (instead of standalone Docker).
    # swarmModeRefreshSeconds: 15               # Defines the polling interval (in seconds) in Swarm Mode.
    # watch: true                               # Watch Docker Swarm events
  file:
    directory: "/etc/traefik/config"     # Link to the dynamic configuration
    watch: true                               # Watch for modifications
  providersThrottleDuration: 10               # Configuration reload frequency
```

### Dynamic Config

The Dynamic Config (config/file.yaml) is what happens next and is also dynamic in nature, so add a docker container and Traefik adds the routes and grabs a certificate. In my case I was manually configuring services in a file, I do this because not everything I'm running is on docker on the same host (looking at you mailcow!). This did give me a lot of flexibility to route things exactly the way I wanted and my config is stored in GitHub!


```
http:
  # Add the router
  routers:
    dns1:
      entryPoints:
        - https
      tls:
        certresolver: letsencrypt
        options: "modern@file"
      service: dns1
      Rule: "Host(`hostname.mydomain.com`)"
      middlewares:
       - "default@file"
  # Add the service
  services:
    dns1:
      loadBalancer:
        serversTransport: nossl
        servers:
          - url: https://internal.ip
  serversTransports:
    nossl:
      #required if using self signed certs internally
      insecureSkipVerify: true
```

Once I got that lined up it was easy to then expand on this and move my other hosts behind Traefik.

## Conclusion
I've only been running Traefik for a couple days now but I'm impressed with what it can do out of the box. I like that it requires file config rather than a gui which forces me to put things in version control. It's really fast too, which is what I expected since it's a single go binary. I installed it instead of running it in docker as again it's a single binary so docker felt like a lot of overhead for just running a single binary.
Will I be keeping Traefik? At this point yes, I think I like it better. It's a steeper learning curve to get started but now that I kind of get it I think it's going to be a more powerful tool.
Tomorrow I'll be looking into using Traefik at work to see what it would take to setup Traefik as an ingress controller for our Kubernetes cluster. I think that using it could allow us to reduce our need for AWS ALB's and public IPs by having a single load balancer direct all traffic to Traefik.
