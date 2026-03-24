---
title: AWS Aurora vs. Redshift for Data Warehousing
date: 2025-03-01
tags: posts
category: AWS
featuredImage: /static/images/aws-databases.svg
featuredImageAlt: Aurora vs Redshift database comparison
---

At work we needed to move from what was essentially a data dumping ground into a real data warehouse. So I went down the rabbit hole of figuring out what we should use. Since we're on AWS the two obvious contenders were Aurora and Redshift.

## The Quick Comparison

| Feature | Aurora | Redshift |
|---------|--------|----------|
| Type | Relational Database (OLTP) | Data Warehouse (OLAP) |
| Workload | Transactional & mixed | Analytical & reporting |
| Data Structure | Row-based | Columnar |
| Query Performance | Small queries, high concurrency | Complex queries over large datasets |
| Scalability | Read replicas, vertical scaling | Massively parallel processing |
| Best For | Transactions, operational data | BI, data lakes, analytics |

On paper Redshift is the "correct" answer for a data warehouse. It's purpose-built for analytical workloads with columnar storage and massively parallel processing. If you're running complex queries over petabytes of data it's the obvious choice.

## What We Actually Did

We went with Aurora (Postgres).

Our dataset is only a few terabytes... large for us but not the kind of scale where Redshift really starts to shine. The bigger factor was that our team already knows Postgres. We didn't have the time to give Redshift a proper MVP, learn its quirks, build out the ETL pipelines, and train the team on a new query engine all at once.

Sometimes the right tool is the one your team can actually operate well. Aurora gave us a real database with proper structure to replace the dumping ground, and we could move fast because everyone already knew how to work with it.

## When Redshift Would Make Sense

If our data grows significantly or we start needing heavy analytical workloads... aggregations across billions of rows, complex joins across huge tables... we'd revisit Redshift. You could even run both, storing operational data in Aurora and ETL-ing it into Redshift for deeper analysis.

But for now Aurora is doing the job and we're not fighting our tooling to get there.
