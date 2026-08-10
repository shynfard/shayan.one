# shayan.one

Personal website of Shayan Davari Fard — Lead DevOps Engineer.

- **Stack:** Astro 5 · TypeScript · Three.js · GSAP
- **Serving:** nginx:alpine container, built multi-stage
- **CI:** GitHub Actions → `ghcr.io/shynfard/shayan-one`
- **Runtime:** self-hosted Kubernetes (`k8s/`), TLS via cert-manager

## Develop

    npm install
    npm run dev

## Build & run container

    docker build -t shayan-one .
    docker run -p 8080:80 shayan-one

## Deploy

See [k8s/README.md](k8s/README.md).
