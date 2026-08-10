# shayan.one — Personal Website Design

Date: 2026-08-10
Status: Approved by Shayan

## Purpose

Personal website at `https://shayan.one` for Shayan Davari Fard: who he is, career history, current work, and projects. Home page is the showpiece — visually impressive with an interactive 3D hero. Site also demonstrates his DevOps skills through its own build/deploy pipeline.

## Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Scope | Multi-page portfolio: mega Home page + Projects page |
| Hosting | Self-hosted on own Kubernetes cluster |
| Stack | Astro 5 (static output) + vanilla TypeScript/CSS |
| 3D | Three.js interactive WebGL hero, lazy-loaded |
| Animations | GSAP ScrollTrigger for scroll-driven section reveals |
| CI/CD | GitHub Actions: build + push image to ghcr.io (free for public repos) |
| Registry | `ghcr.io/shynfard/shayan-one` |
| Repo | New public repo `shynfard/shayan.one` (profile repo untouched) |

## Site structure

Two pages:

1. **Home (`/`)** — single scrolling page combining hero, about, experience/CV, current focus, tech stack, and contact.
2. **Projects (`/projects`)** — gallery of project cards.

## Repository layout

```
shayan.one/
├── src/
│   ├── pages/
│   │   ├── index.astro          # mega home page
│   │   └── projects.astro       # projects gallery
│   ├── components/
│   │   ├── Hero3D.astro         # WebGL hero (Three.js island, lazy-loaded)
│   │   ├── Timeline.astro       # animated experience timeline
│   │   ├── ProjectCard.astro
│   │   ├── StackGrid.astro
│   │   └── Contact.astro
│   ├── data/
│   │   └── projects.ts          # project content as typed data
│   ├── layouts/
│   │   └── Base.astro           # shared head/nav/footer
│   └── styles/
│       └── global.css           # design tokens, dark theme
├── public/                      # favicon, og-image, CV pdf (optional later)
├── Dockerfile                   # multi-stage: node build → nginx:alpine
├── nginx.conf                   # gzip, cache headers, security headers
├── .github/workflows/deploy.yml # build + push to ghcr.io
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml             # host shayan.one, cert-manager TLS
└── docs/superpowers/specs/      # this spec + implementation plan
```

## Home page design

Dark theme throughout. Sections in scroll order:

### 1. Hero (full viewport)
- Three.js scene: interactive particle network — glowing nodes connected by edges (infrastructure/graph metaphor). Slow ambient drift; nodes react to mouse proximity (repel/attract, edge highlight).
- Overlay: name "Shayan Davari Fard", title "Lead DevOps Engineer · Cloud & Security Architect", scroll hint.
- Loading: three.js lazy-loaded after first paint; static CSS gradient placeholder until ready.
- Fallbacks: no WebGL or `prefers-reduced-motion` → static gradient + subtle CSS-only starfield, no JS animation.

### 2. About
Short intro: DevOps engineer with IT security, cloud architecture, and software engineering background. Based in Germany. Focus: secure, scalable, compliant infrastructure — IaC, GitOps, Kubernetes.

### 3. Experience timeline (animated on scroll, from CV)
Revealed by GSAP ScrollTrigger, newest first:
1. **01.2025 – today · Lead DevOps** (employer name omitted on site; editable in data file) — architecture of a secure, C5-compliant multi-cloud platform with multiple Kubernetes clusters for AI projects, model development, and model hosting. Full IaC (Terraform), GitOps (GitLab CI/CD, ArgoCD), zero-trust networking, Azure AD/RBAC, central secrets management, logging/monitoring for compliance.
2. **01.2023 – 12.2024 · DevOps Engineer, Cegeka** — secure cloud-native architectures for public/private clients (incl. BA, Infineon); GitOps framework for 17+ teams; HA GitLab enterprise on OpenShift; Kubernetes, Istio, observability; secure point-of-sale system.
3. **11.2019 – 12.2022 · Project Manager, Fraunhofer IML** — 3D camera tech for object recognition/tracking in logistics; predictive analytics from sound/vibration sensors; IATA ONE Record NE:ONE program; ML models for airport demand prediction.
4. **12.2018 – 12.2022 · Co-Founder & CEO, Flame (startup)** — end-to-end product: full-stack, cloud, AI, infrastructure, product, business.

### 4. Education, publications & awards (new section, from CV)
- **Education:** M.Sc. IT Security, TU Darmstadt (2021–2025) · B.Sc. Computer Engineering, TU Darmstadt (2017–2021).
- **Publications:**
  - *NetNN: Neural Intrusion Detection System in Programmable Networks* — IEEE ISCC 2024, **2nd Best Paper Award** ([ieeexplore.ieee.org/document/10733725](https://ieeexplore.ieee.org/document/10733725/)).
  - *Guaranteeing democracy: unlinkability and anonymity in e-voting* (2024) — blockchain + homomorphic encryption + zk-SNARKs.
  - *Smart Contract Data feed with Secure Multi-Party Computation* (2020).
- **Awards:** 2nd Best Paper IEEE ISCC 2024 · 1st place ONE Record Hackathon 2022 · 1st place ONE Record Hackathon 2021 · 2nd place Continental Hackathon 2019.
- **Certifications:** CKA – Certified Kubernetes Administrator (2025–2027) · LFS253 Containers Fundamentals (2024).

### 5. Current focus
- Secure multi-cloud platforms for Kubernetes, AI/ML workloads, enterprise apps.
- Building **LogicSpec** — open-source AI-native Application Definition Language ("Define the logic. Generate the software.").

### 6. Tech stack
Grid of grouped badges (condensed from CV "Key areas"):
- Languages: Python, Java, JS/TS, C/C++, Go, SQL/NoSQL, Bash, P4
- Cloud & Platforms: Azure, AWS, GCP, Kubernetes, OpenShift, AKS
- DevOps: Terraform, Ansible, Helm, GitOps, ArgoCD, GitLab CI/CD, Observability (Prometheus, OpenTelemetry, ELK)
- Security: Zero Trust, RBAC/ABAC, Secrets Management, Container Scanning (Trivy, Snyk), Pen Testing, C5 Compliance
- AI/ML: PyTorch, TensorFlow, LLM/RAG, Kubeflow, MLflow

### 7. Contact (footer)
Email (shayandavarifard@yahoo.com), GitHub (shynfard), Twitter (@shyndavfard), Telegram (@shyndavfard). Location: Germany. Phone deliberately NOT published.

## Projects page

Card grid from `src/data/projects.ts`. Each card: name, one-paragraph description, tech tags, GitHub link, hover motion (lift + glow). Initial content:

| Project | Description | Tech |
|---|---|---|
| **LogicSpec** (headline) | Open-source AI-native Application Definition Language — describe software behavior independent of language/framework | TypeScript, MIT |
| **NetNN** | DNN-based intrusion detection running entirely in the data plane of programmable switches — IEEE ISCC 2024, 2nd Best Paper Award. 99% detection accuracy at line rate | P4, IEEE paper link |
| **ONE Record** | IATA ONE Record dashboard + player — 1st place, ONE Record Hackathon 2021 & 2022 | TypeScript |
| **BitVote** | Decentralized e-voting: blockchain + homomorphic encryption + zk-SNARKs (basis of 2024 publication) | Go |
| **postgres-backup-s3-minio** | PostgreSQL Docker companion for periodic backups to S3/MinIO | Shell, Docker |

Headline card (LogicSpec) larger/featured. Data-driven: adding a project = one entry in `projects.ts`.

## Build & deploy

### Docker image
Multi-stage Dockerfile:
1. `node:22-alpine` — `npm ci && npm run build`
2. `nginx:alpine` — copy `dist/`, custom `nginx.conf` (gzip, immutable cache for hashed assets, security headers: CSP, X-Frame-Options, referrer policy)

### GitHub Actions (`deploy.yml`)
On push to `main`:
1. Checkout, setup Node, `npm ci`, `npm run build` (fail fast on build errors)
2. `docker/build-push-action` → push `ghcr.io/shynfard/shayan-one:latest` and `:<git-sha>`
3. Auth via built-in `GITHUB_TOKEN` (`packages: write` permission) — no extra secrets

### Kubernetes (`k8s/`)
Plain manifests, applied by Shayan from cluster side (ArgoCD adoption possible later — manifests kept declarative and self-contained):
- `deployment.yaml` — 1 replica, image `ghcr.io/shynfard/shayan-one:latest`, resource requests/limits, readiness probe on `/`
- `service.yaml` — ClusterIP :80
- `ingress.yaml` — host `shayan.one`, TLS via cert-manager annotation (`cluster-issuer: letsencrypt-prod`), www → apex redirect optional

Deployment of new versions: cluster pulls `:latest` (imagePullPolicy: Always + rollout restart), or Shayan bumps sha tag. v1 keeps this manual; GitOps later.

## Performance & quality

- Three.js loaded dynamically after first paint; hero placeholder is pure CSS. Target ≤ ~160KB gz added by 3D.
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.
- `prefers-reduced-motion` respected for all GSAP + Three.js animation.
- OG meta tags + og-image for link previews; sitemap + robots.txt.
- Responsive: mobile-first; 3D hero degrades to lighter particle count on mobile.

## Error handling

- WebGL unavailable → CSS fallback hero (feature-detect before loading three.js).
- JS disabled → all content still readable (Astro static HTML; animations are enhancement only).
- Image build failure → Action fails, no image pushed, live site unaffected.

## Testing

- `astro build` in CI = type + build check.
- Manual QA pass on desktop + mobile viewport before first deploy (browse-skill QA).
- Post-deploy: verify TLS, headers, Lighthouse run against live shayan.one.

## Out of scope (v1)

- Blog, CMS, analytics, contact form backend, i18n (English only), ArgoCD setup, downloadable CV PDF.
