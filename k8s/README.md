# Deploy shayan.one

Prereqs on cluster: ingress-nginx, cert-manager with ClusterIssuer `letsencrypt-prod`.
DNS: point `shayan.one` A/AAAA record at the ingress controller's external IP.

    kubectl apply -f k8s/

New version after CI push:

    kubectl rollout restart deployment/shayan-one

Image is public on ghcr.io — no imagePullSecret needed.
Note: the first CI push creates the ghcr.io package as PRIVATE by default. Make it public once (GitHub → Packages → shayan-one → Package settings → Change visibility) or add an imagePullSecret.
Adjust `ingressClassName` / cluster-issuer name to match your cluster.
