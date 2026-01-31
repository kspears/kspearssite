---
title: Migrating K8s From GP2 to GP3
date: 2024-09-25
category: Kubernetes
featuredImage: /static/images/stackgres_logo.jpg
featuredImageAlt: Stackgres
---

At work we have a [Stackgres](https://stackgres.io/) kuberentes cluster that hosts our postgres databases. This allows for high availability, easy data recovery and generally is pretty easy to manage. I admit that when I first started looking at postgres on Kubernetes I was pretty skeptical but it's honestly given me very little to complain about. It does have some issues due to how the cluster was initially configured that I am planning to fix in the future.

The K8s cluster was setup with GP2 as the default storage class and so the topic came up a few months ago to migrate to GP3 to increase our IOPs and also reduce cost.

So I thought that it would be pretty easy to migrate from GP2 to GP3 EBS volumes as I have migrated standard EC2 servers using EBS with a quick CLI script or GUI click. I sent in a ticket to [Ongres](https://ongres.com/), the company behind Stackgres to see if they had any guidance on the process. I was expecting again a simple one liner kubectl command or script.

Instead I received a long procedure and thought I'd document it here...

1. Make the cluster leader pod "0". I'm not 100% sure this is needed but it was in my directions. I didn't test this but I figure it will delete whatever pod is not the leader. But again I didn't test.
   1. `kubectl exec -it -n <<namespace>> <<stackgres_pod_name>> -c patroni -- patronictl list`
   2. If needed switchover: `kubectl exec -it -n <<namespace>> <<stackgres_pod_name>> -c patroni -- patronictl switchover`
2. Take a backup... take a backup... take a backup! Don't start this process without a recent backup as you are going to delete volumes.
3. Set the cluster size to 1, destroying the replica: `kubectl edit sgclusters.stackgres.io -n <<namespace>> <<stackgres_cluster_name>>`
4. Use `kubectl get pvc` to find the volume claim and release it by deleting it.
5. User `kubectl get pv` to find the volume and then delete the volume.
6. Set the cluster size to 2, creating a new replica: `kubectl edit sgclusters.stackgres.io -n <<namespace>> <<stackgres_cluster_name>>`
7. watch for the replica to be rebuilt and sync up with the leader: `kubectl exec -it -n <<namespace>> <<stackgres_pod_name>> -c patroni -- patronictl list`
8. Once the sync is complete, switchover to the replica and then follow the steps to delete the old leader.

I admit that I made a mistake at one point and deleted a PVC that was still in use. Thankfully the Ongres team was able to help me recover from that. I'll document that in a later post.

I'm hoping that going forward we can use GP3 as the default storage class for new clusters.
