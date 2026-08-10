# shayan.one Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and containerize the shayan.one personal portfolio site (mega home page with 3D hero + projects page) with a GitHub Actions pipeline pushing to ghcr.io and k8s manifests for self-hosting.

**Architecture:** Astro 5 static site, two pages. Content lives in typed data files (`src/data/*`); components render it. Three.js particle-network hero loads lazily as a separate chunk with WebGL/reduced-motion fallback; GSAP ScrollTrigger animates section reveals. Output is static files served by nginx:alpine in a multi-stage Docker image.

**Tech Stack:** Astro 5, TypeScript (strict), Three.js, GSAP, @astrojs/sitemap, @fontsource-variable/inter, @fontsource/jetbrains-mono, Docker (node:22-alpine → nginx:1.27-alpine), GitHub Actions, ghcr.io, Kubernetes + cert-manager.

## Global Constraints

- Repo root: `/home/sfard/Codes/Private/shayan.one` (git already initialized, branch `main`; spec + this plan already committed).
- Node 22, npm (no pnpm/yarn). TypeScript strict.
- Site URL: `https://shayan.one`. Image: `ghcr.io/shynfard/shayan-one`. GitHub repo: `shynfard/shayan.one` (public).
- Dark theme only. English only.
- NEVER publish phone number. Current employer name stays empty string in data (user fills in later if wanted).
- All animation (GSAP + Three.js) must be skipped under `prefers-reduced-motion: reduce`. Site fully readable with JS disabled.
- Contact: shayandavarifard@yahoo.com · github.com/shynfard · twitter.com/shyndavfard · t.me/shyndavfard · Germany.
- Every task: verify with `npm run build` (and `npx astro check` where stated) before commit. Commits from repo root.

---

### Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro` (placeholder), `public/robots.txt`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: working `npm run build` → `dist/`; `npm run dev`; commands `build`, `dev`, `preview`, `check` in package.json. Site config `site: 'https://shayan.one'` (sitemap integration added here, used by Task 8).

- [ ] **Step 1: Scaffold project into existing repo**

```bash
cd /home/sfard/Codes/Private/shayan.one
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --yes
npm install
npm install three gsap @astrojs/sitemap @fontsource-variable/inter @fontsource/jetbrains-mono
npm install -D @types/three
```

If `npm create astro` refuses a non-empty directory, scaffold into `/tmp/claude-1000/-home-sfard-Codes-Private-shynfard/d91265ca-644a-4b49-b21f-a52543bc2993/scratchpad/astro-tmp` and `cp -r` everything except `.git` into the repo root, then install.

- [ ] **Step 2: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shayan.one',
  integrations: [sitemap()],
});
```

- [ ] **Step 3: Write placeholder `src/pages/index.astro`**

```astro
---
---
<html lang="en">
  <head><meta charset="utf-8" /><title>Shayan Davari Fard</title></head>
  <body><h1>shayan.one — under construction</h1></body>
</html>
```

- [ ] **Step 4: Write `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://shayan.one/sitemap-index.xml
```

- [ ] **Step 5: Ensure `.gitignore` covers `node_modules/`, `dist/`, `.astro/`**

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: exits 0, `dist/index.html` exists. Also run `npx astro check` → 0 errors.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: scaffold Astro 5 project with sitemap, three, gsap deps"
```

---

### Task 2: Design tokens + Base layout

**Files:**
- Create: `src/styles/global.css`, `src/layouts/Base.astro`
- Modify: `src/pages/index.astro` (use layout)

**Interfaces:**
- Consumes: fonts from @fontsource packages (Task 1).
- Produces: `Base.astro` with props `{ title: string; description: string }`, slots page content, renders nav (Home / Projects) + footer placeholder. CSS custom props used by ALL later tasks: `--bg`, `--bg-raised`, `--text`, `--text-dim`, `--accent`, `--accent-2`, `--border`, `--font-sans`, `--font-mono`. Utility classes `.container`, `.section`, `.reveal` (reveal is animation hook for Task 6 — must be visible by default, JS hides then reveals).

- [ ] **Step 1: Write `src/styles/global.css`**

```css
@import '@fontsource-variable/inter';
@import '@fontsource/jetbrains-mono';

:root {
  --bg: #050810;
  --bg-raised: #0b1120;
  --text: #e6edf7;
  --text-dim: #8b98ad;
  --accent: #22d3ee;   /* cyan */
  --accent-2: #818cf8; /* indigo */
  --border: #1c2740;
  --font-sans: 'Inter Variable', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

* { box-sizing: border-box; margin: 0; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
h1, h2, h3 { line-height: 1.15; letter-spacing: -0.02em; }
h2 { font-size: clamp(1.6rem, 3.5vw, 2.4rem); margin-bottom: 1.5rem; }

.container { max-width: 72rem; margin-inline: auto; padding-inline: 1.25rem; }
.section { padding-block: clamp(4rem, 10vh, 7rem); }
.mono { font-family: var(--font-mono); }
.dim { color: var(--text-dim); }

.tag {
  display: inline-block; padding: 0.15rem 0.6rem; border: 1px solid var(--border);
  border-radius: 999px; font-family: var(--font-mono); font-size: 0.72rem;
  color: var(--text-dim); background: var(--bg-raised);
}

/* nav */
.nav {
  position: fixed; inset-inline: 0; top: 0; z-index: 10;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.9rem 1.25rem;
  background: color-mix(in srgb, var(--bg) 75%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}
.nav a { color: var(--text); font-size: 0.95rem; }
.nav .brand { font-family: var(--font-mono); color: var(--accent); }
.nav ul { display: flex; gap: 1.5rem; list-style: none; padding: 0; }

/* footer */
.footer {
  border-top: 1px solid var(--border);
  padding: 3rem 1.25rem; text-align: center; color: var(--text-dim);
  font-size: 0.9rem;
}
```

- [ ] **Step 2: Write `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
interface Props { title: string; description: string; }
const { title, description } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <nav class="nav">
      <a class="brand" href="/">shayan.one</a>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/projects">Projects</a></li>
      </ul>
    </nav>
    <main><slot /></main>
    <footer class="footer">
      <slot name="footer" />
      <p>© 2026 Shayan Davari Fard · Built with Astro, deployed on my own Kubernetes cluster.</p>
    </footer>
  </body>
</html>
```

- [ ] **Step 3: Update `src/pages/index.astro` to use Base**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Shayan Davari Fard — Lead DevOps Engineer" description="Lead DevOps Engineer · Cloud & Security Architect. Secure multi-cloud Kubernetes platforms, AI/ML infrastructure, security-by-design.">
  <section class="section container"><h1>Placeholder</h1></section>
</Base>
```

- [ ] **Step 4: Verify**

Run: `npm run build && npx astro check`
Expected: 0 errors. `npm run dev`, load http://localhost:4321 → dark page, fixed nav, footer.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: design tokens, dark theme, base layout with nav/footer"
```

---

### Task 3: Content data layer

**Files:**
- Create: `src/data/site.ts`, `src/data/experience.ts`, `src/data/projects.ts`, `src/data/publications.ts`, `src/data/stack.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (exact exports; Tasks 4–7 import these):
  - `site.ts`: `export const site: { name: string; role: string; tagline: string; email: string; github: string; twitter: string; telegram: string; location: string; url: string }`
  - `experience.ts`: `export interface Role { start: string; end: string; title: string; org: string; summary: string; tags: string[] }` · `export const roles: Role[]` (newest first)
  - `projects.ts`: `export interface Project { name: string; description: string; tags: string[]; repo: string; paper?: string; award?: string; featured?: boolean }` · `export const projects: Project[]`
  - `publications.ts`: `export interface Publication { title: string; year: number; venue?: string; award?: string; link?: string; summary: string }` · `export const publications: Publication[]`, `export const awards: string[]`, `export const certifications: string[]`, `export const education: { years: string; degree: string; school: string }[]`
  - `stack.ts`: `export const stackGroups: { label: string; items: string[] }[]`

- [ ] **Step 1: Write `src/data/site.ts`**

```ts
export const site = {
  name: 'Shayan Davari Fard',
  role: 'Lead DevOps Engineer · Cloud & Security Architect',
  tagline: 'I build secure, compliant multi-cloud Kubernetes platforms for AI — automated by default, secure by design.',
  email: 'shayandavarifard@yahoo.com',
  github: 'https://github.com/shynfard',
  twitter: 'https://twitter.com/shyndavfard',
  telegram: 'https://t.me/shyndavfard',
  location: 'Germany',
  url: 'https://shayan.one',
};
```

- [ ] **Step 2: Write `src/data/experience.ts`** (content from CV; current employer org intentionally empty)

```ts
export interface Role {
  start: string; end: string; title: string; org: string;
  summary: string; tags: string[];
}

export const roles: Role[] = [
  {
    start: '2025', end: 'today', title: 'Lead DevOps Engineer', org: '',
    summary: 'Designing and implementing the complete architecture of a secure, C5-compliant multi-cloud platform: multiple Kubernetes clusters for AI projects, model development and model hosting. Fully Infrastructure-as-Code with Terraform and GitOps (GitLab CI/CD, ArgoCD). Encrypted segmented networks, zero-trust security, Azure AD/RBAC, central secrets management, compliance-grade logging and monitoring.',
    tags: ['Multi-Cloud', 'Kubernetes', 'Terraform', 'GitOps', 'ArgoCD', 'Zero Trust', 'C5 Compliance', 'AI/ML Infrastructure'],
  },
  {
    start: '2023', end: '2024', title: 'DevOps Engineer', org: 'Cegeka',
    summary: 'Secure, scalable cloud-native architectures for public and private clients including BA and Infineon. Built a GitOps framework serving 17+ teams, a highly available GitLab enterprise environment on OpenShift, and a secure high-availability point-of-sale system. Kubernetes, Istio and observability integration.',
    tags: ['OpenShift', 'GitLab', 'GitOps', 'Istio', 'DevSecOps', 'High Availability'],
  },
  {
    start: '2019', end: '2022', title: 'Project Manager', org: 'Fraunhofer IML',
    summary: 'Led projects applying 3D camera technology for object recognition, segmentation and tracking in large-scale logistics, and predictive analytics from sound/vibration sensors for early fault detection. Worked on the IATA ONE Record NE:ONE program optimizing air-freight data flows; deployed ML models predicting airport demand.',
    tags: ['Computer Vision', 'Predictive Analytics', 'Kubeflow', 'MLflow', 'PyTorch', 'Project Management'],
  },
  {
    start: '2018', end: '2022', title: 'Co-Founder & CEO', org: 'Flame (startup)',
    summary: 'Founded and ran a tech startup end-to-end: full-stack development, cloud architecture, AI, infrastructure, product and project management, marketing and business development.',
    tags: ['Full-Stack', 'Cloud Architecture', 'AI', 'Product', 'Entrepreneurship'],
  },
];
```

- [ ] **Step 3: Write `src/data/projects.ts`**

```ts
export interface Project {
  name: string; description: string; tags: string[]; repo: string;
  paper?: string; award?: string; featured?: boolean;
}

export const projects: Project[] = [
  {
    name: 'LogicSpec',
    description: 'Open-source, AI-native Application Definition Language: describe how software should behave without tying behavior to a language, framework, or implementation. Define the logic — generate the software.',
    tags: ['TypeScript', 'AI', 'Open Source', 'MIT'],
    repo: 'https://github.com/shynfard/LogicSpec',
    featured: true,
  },
  {
    name: 'NetNN',
    description: 'DNN-based network intrusion detection running entirely in the data plane of programmable switches. Raw-packet processing without feature engineering, DNN computation distributed across switches, implemented in P4 — 99% detection accuracy at line rate.',
    tags: ['P4', 'Deep Learning', 'Network Security', 'IEEE'],
    repo: 'https://github.com/shynfard/netnn',
    paper: 'https://ieeexplore.ieee.org/document/10733725/',
    award: '2nd Best Paper · IEEE ISCC 2024',
  },
  {
    name: 'ONE Record',
    description: 'IATA ONE Record dashboard and player for standardized air-cargo data exchange, built during the ONE Record hackathon series.',
    tags: ['TypeScript', 'Aviation', 'IATA'],
    repo: 'https://github.com/shynfard/one-record-dashboard',
    award: '1st place · ONE Record Hackathon 2021 & 2022',
  },
  {
    name: 'BitVote',
    description: 'Decentralized e-voting: full-node implementation in Go combining blockchain, homomorphic encryption and zk-SNARKs for anonymous yet verifiable elections. Basis of a 2024 study on unlinkability and anonymity in e-voting.',
    tags: ['Go', 'Blockchain', 'zk-SNARKs', 'Cryptography'],
    repo: 'https://github.com/shynfard/BitVote',
  },
  {
    name: 'postgres-backup-s3-minio',
    description: 'PostgreSQL Docker companion for periodic backups to S3-compatible storage (MinIO).',
    tags: ['Shell', 'Docker', 'PostgreSQL', 'S3'],
    repo: 'https://github.com/shynfard/postgres-backup-s3-minio',
  },
];
```

- [ ] **Step 4: Write `src/data/publications.ts`**

```ts
export interface Publication {
  title: string; year: number; venue?: string; award?: string;
  link?: string; summary: string;
}

export const publications: Publication[] = [
  {
    title: 'NetNN: Neural Intrusion Detection System in Programmable Networks',
    year: 2024, venue: 'IEEE ISCC', award: '2nd Best Paper Award',
    link: 'https://ieeexplore.ieee.org/document/10733725/',
    summary: 'A DNN-based IDS running entirely in the data plane of programmable switches: raw-packet processing, DNN computation distributed across switches, P4 implementation, 99% detection accuracy under real-time constraints.',
  },
  {
    title: 'Guaranteeing democracy: unlinkability and anonymity in e-voting',
    year: 2024,
    summary: 'A secure, transparent, decentralized e-voting system built on blockchain, homomorphic encryption and zk-SNARKs — anonymous, verifiable, and manipulation-resistant.',
  },
  {
    title: 'Smart Contract Data Feed with Secure Multi-Party Computation',
    year: 2020,
    summary: 'An oracle framework distributing trust across multiple parties via secure multi-party computation, enabling existing web/API data sources for blockchains without modification.',
  },
];

export const awards: string[] = [
  '2nd Best Paper — 29th IEEE Symposium on Computers and Communications (ISCC 2024)',
  '1st place — ONE Record Hackathon 2022',
  '1st place — ONE Record Hackathon 2021',
  '2nd place — Continental Hackathon 2019',
];

export const certifications: string[] = [
  'CKA: Certified Kubernetes Administrator (2025–2027)',
  'LFS253: Containers Fundamentals (2024)',
];

export const education = [
  { years: '2021 – 2025', degree: 'M.Sc. IT Security', school: 'Technical University of Darmstadt' },
  { years: '2017 – 2021', degree: 'B.Sc. Computer Engineering', school: 'Technical University of Darmstadt' },
];
```

- [ ] **Step 5: Write `src/data/stack.ts`**

```ts
export const stackGroups = [
  { label: 'Languages', items: ['Python', 'Java', 'JS/TS', 'C/C++', 'Go', 'SQL/NoSQL', 'Bash', 'P4'] },
  { label: 'Cloud & Platforms', items: ['Azure', 'AWS', 'GCP', 'Kubernetes', 'OpenShift', 'AKS'] },
  { label: 'DevOps', items: ['Terraform', 'Ansible', 'Helm', 'GitOps', 'ArgoCD', 'GitLab CI/CD', 'Prometheus', 'OpenTelemetry', 'ELK'] },
  { label: 'Security', items: ['Zero Trust', 'RBAC/ABAC', 'Secrets Management', 'Trivy', 'Snyk', 'Pen Testing', 'C5 Compliance'] },
  { label: 'AI/ML', items: ['PyTorch', 'TensorFlow', 'LLM/RAG', 'Kubeflow', 'MLflow'] },
];
```

- [ ] **Step 6: Verify types**

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: typed content data layer from CV (experience, projects, publications, stack)"
```

---

### Task 4: Home page — full static structure + CSS hero fallback

**Files:**
- Create: `src/components/Timeline.astro`, `src/components/StackGrid.astro`, `src/components/Contact.astro`
- Modify: `src/pages/index.astro` (replace placeholder), `src/styles/global.css` (append hero + section styles)

**Interfaces:**
- Consumes: all `src/data/*` exports (Task 3), Base layout + CSS tokens (Task 2).
- Produces: complete readable home page WITHOUT JS animation. Hero markup: `<section id="hero">` containing `<canvas id="hero-canvas">` (empty, absolutely positioned; Task 5 attaches Three.js) and `.hero-overlay` with name/role/tagline. Sections with ids: `hero`, `about`, `experience`, `credentials`, `focus`, `stack`, `contact`. Timeline items have class `timeline-item` and sections have class `reveal` (hooks for Task 6).

- [ ] **Step 1: Append hero + section styles to `src/styles/global.css`**

```css
/* hero */
#hero {
  position: relative; min-height: 100svh;
  display: grid; place-items: center; overflow: hidden;
  background:
    radial-gradient(ellipse 70% 50% at 50% 20%, #0c1a33 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 80% 80%, #101b3a 0%, transparent 60%),
    var(--bg);
}
#hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero-overlay { position: relative; z-index: 1; text-align: center; padding: 1.25rem; }
.hero-overlay h1 { font-size: clamp(2.4rem, 7vw, 4.5rem); }
.hero-overlay .role { color: var(--accent); font-family: var(--font-mono); margin-top: 0.75rem; font-size: clamp(0.85rem, 2vw, 1.1rem); }
.hero-overlay .tagline { color: var(--text-dim); max-width: 38rem; margin: 1.25rem auto 0; }
.scroll-hint { position: absolute; bottom: 1.5rem; left: 50%; translate: -50% 0; color: var(--text-dim); font-size: 1.5rem; z-index: 1; }

/* timeline */
.timeline { position: relative; padding-left: 1.5rem; border-left: 2px solid var(--border); display: grid; gap: 2.5rem; }
.timeline-item { position: relative; }
.timeline-item::before {
  content: ''; position: absolute; left: calc(-1.5rem - 7px); top: 0.4rem;
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 12px var(--accent);
}
.timeline-item .when { font-family: var(--font-mono); color: var(--accent); font-size: 0.85rem; }
.timeline-item h3 { margin: 0.25rem 0 0.5rem; }
.timeline-item .tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }

/* cards & grids */
.card {
  background: var(--bg-raised); border: 1px solid var(--border); border-radius: 12px;
  padding: 1.5rem; transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}
.card:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: 0 8px 30px rgb(34 211 238 / 0.08); }
.grid-2 { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); }
.stack-grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
.contact-links { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin-top: 1.5rem; font-family: var(--font-mono); }
```

- [ ] **Step 2: Write `src/components/Timeline.astro`**

```astro
---
import { roles } from '../data/experience';
---
<div class="timeline">
  {roles.map((r) => (
    <article class="timeline-item">
      <span class="when">{r.start} — {r.end}</span>
      <h3>{r.title}{r.org && ` · ${r.org}`}</h3>
      <p class="dim">{r.summary}</p>
      <div class="tags">{r.tags.map((t) => <span class="tag">{t}</span>)}</div>
    </article>
  ))}
</div>
```

- [ ] **Step 3: Write `src/components/StackGrid.astro`**

```astro
---
import { stackGroups } from '../data/stack';
---
<div class="stack-grid">
  {stackGroups.map((g) => (
    <div class="card">
      <h3 class="mono" style="color: var(--accent); font-size: 0.95rem;">{g.label}</h3>
      <div class="tags" style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.75rem;">
        {g.items.map((i) => <span class="tag">{i}</span>)}
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 4: Write `src/components/Contact.astro`**

```astro
---
import { site } from '../data/site';
---
<div style="text-align:center;">
  <h2>Get in touch</h2>
  <p class="dim">Based in {site.location}. Open to interesting infrastructure, security and AI platform problems.</p>
  <div class="contact-links">
    <a href={`mailto:${site.email}`}>{site.email}</a>
    <a href={site.github}>GitHub</a>
    <a href={site.twitter}>Twitter</a>
    <a href={site.telegram}>Telegram</a>
  </div>
</div>
```

- [ ] **Step 5: Write full `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Timeline from '../components/Timeline.astro';
import StackGrid from '../components/StackGrid.astro';
import Contact from '../components/Contact.astro';
import { site } from '../data/site';
import { publications, awards, certifications, education } from '../data/publications';
---
<Base title={`${site.name} — Lead DevOps Engineer`} description={site.tagline}>
  <section id="hero">
    <canvas id="hero-canvas" aria-hidden="true"></canvas>
    <div class="hero-overlay">
      <h1>{site.name}</h1>
      <p class="role">{site.role}</p>
      <p class="tagline">{site.tagline}</p>
    </div>
    <span class="scroll-hint" aria-hidden="true">↓</span>
  </section>

  <section id="about" class="section container reveal">
    <h2>About</h2>
    <p style="max-width: 46rem;">
      DevOps engineer with an academic background in IT security and years of hands-on work across
      AI architecture, cloud infrastructure, networking and cybersecurity. I design, build and operate
      secure multi-cloud and on-premises platforms from the ground up — platforms that let teams of up
      to thirty professionals develop, train and deploy AI models securely. My core strengths:
      scalable architecture, infrastructure automation, network design, platform engineering and
      security-by-design.
    </p>
  </section>

  <section id="experience" class="section container reveal">
    <h2>Experience</h2>
    <Timeline />
  </section>

  <section id="credentials" class="section container reveal">
    <h2>Education, research & awards</h2>
    <div class="grid-2">
      <div class="card">
        <h3>Education</h3>
        <ul class="dim" style="padding-left: 1.1rem; margin-top: 0.75rem;">
          {education.map((e) => <li><span class="mono">{e.years}</span> — {e.degree}, {e.school}</li>)}
        </ul>
        <h3 style="margin-top: 1.5rem;">Certifications</h3>
        <ul class="dim" style="padding-left: 1.1rem; margin-top: 0.75rem;">
          {certifications.map((c) => <li>{c}</li>)}
        </ul>
      </div>
      <div class="card">
        <h3>Publications</h3>
        <ul class="dim" style="padding-left: 1.1rem; margin-top: 0.75rem;">
          {publications.map((p) => (
            <li style="margin-bottom: 0.6rem;">
              {p.link ? <a href={p.link}>{p.title}</a> : p.title} ({p.year})
              {p.award && <span class="tag" style="margin-left: 0.4rem; color: var(--accent);">{p.award}</span>}
            </li>
          ))}
        </ul>
        <h3 style="margin-top: 1.5rem;">Awards</h3>
        <ul class="dim" style="padding-left: 1.1rem; margin-top: 0.75rem;">
          {awards.map((a) => <li>{a}</li>)}
        </ul>
      </div>
    </div>
  </section>

  <section id="focus" class="section container reveal">
    <h2>Right now</h2>
    <p style="max-width: 46rem;">
      Leading DevOps on a secure, C5-compliant multi-cloud Kubernetes platform for AI model development
      and hosting. On the side I'm building
      <a href="https://github.com/shynfard/LogicSpec">LogicSpec</a> — an open-source, AI-native
      Application Definition Language: define the logic, generate the software.
    </p>
  </section>

  <section id="stack" class="section container reveal">
    <h2>Tech stack</h2>
    <StackGrid />
  </section>

  <section id="contact" class="section container reveal">
    <Contact />
  </section>
</Base>
```

- [ ] **Step 6: Verify**

Run: `npm run build && npx astro check`
Expected: 0 errors. Dev server: all 6 sections render, readable without JS, hero shows gradient (no 3D yet).

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: full home page — hero shell, about, timeline, credentials, focus, stack, contact"
```

---

### Task 5: Three.js particle-network hero

**Files:**
- Create: `src/scripts/hero.ts`
- Modify: `src/pages/index.astro` (add loader script at end of Base slot)

**Interfaces:**
- Consumes: `<canvas id="hero-canvas">` from Task 4.
- Produces: `export function initHero(canvas: HTMLCanvasElement): void`. Loaded ONLY via dynamic `import()` after feature checks → Astro emits it (plus three.js) as a separate lazy chunk.

- [ ] **Step 1: Write `src/scripts/hero.ts`**

```ts
import * as THREE from 'three';

const isMobile = matchMedia('(max-width: 768px)').matches;
const COUNT = isMobile ? 90 : 220;
const RANGE = 14;          // half-extent of node box
const LINK_DIST = 3.2;     // max distance to draw an edge
const MOUSE_R = 4;         // mouse influence radius

export function initHero(canvas: HTMLCanvasElement): void {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 18;

  // nodes
  const pos = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT * 3; i++) {
    pos[i] = (Math.random() - 0.5) * 2 * RANGE;
    vel[i] = (Math.random() - 0.5) * 0.02;
  }
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const nodes = new THREE.Points(
    nodeGeo,
    new THREE.PointsMaterial({ color: 0x22d3ee, size: 0.12, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false })
  );
  scene.add(nodes);

  // edges (rebuilt each frame, capped)
  const MAX_EDGES = COUNT * 6;
  const edgePos = new Float32Array(MAX_EDGES * 6);
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
  const edges = new THREE.LineSegments(
    edgeGeo,
    new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.25,
      blending: THREE.AdditiveBlending, depthWrite: false })
  );
  scene.add(edges);

  // mouse in world space (z=0 plane)
  const mouse = new THREE.Vector3(999, 999, 0);
  const ndc = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  canvas.parentElement!.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    ray.ray.intersectPlane(plane, mouse);
  });
  canvas.parentElement!.addEventListener('pointerleave', () => mouse.set(999, 999, 0));

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  const v = new THREE.Vector3();
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  renderer.setAnimationLoop(() => {
    if (!visible) return;
    // drift + bounce + mouse repel
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3;
      v.set(pos[j] - mouse.x, pos[j + 1] - mouse.y, 0);
      const d = v.length();
      if (d < MOUSE_R) {
        v.normalize().multiplyScalar((MOUSE_R - d) * 0.004);
        vel[j] += v.x; vel[j + 1] += v.y;
      }
      for (let a = 0; a < 3; a++) {
        pos[j + a] += vel[j + a];
        if (Math.abs(pos[j + a]) > RANGE) vel[j + a] *= -1;
        vel[j + a] *= 0.999; // damp
      }
    }
    nodeGeo.attributes.position.needsUpdate = true;

    // rebuild edges
    let e = 0;
    for (let a = 0; a < COUNT && e < MAX_EDGES; a++) {
      for (let b = a + 1; b < COUNT && e < MAX_EDGES; b++) {
        const dx = pos[a * 3] - pos[b * 3], dy = pos[a * 3 + 1] - pos[b * 3 + 1], dz = pos[a * 3 + 2] - pos[b * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST) {
          edgePos.set([pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2], pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]], e * 6);
          e++;
        }
      }
    }
    edgeGeo.setDrawRange(0, e * 2);
    edgeGeo.attributes.position.needsUpdate = true;

    scene.rotation.y += 0.0004;
    renderer.render(scene, camera);
  });
}
```

- [ ] **Step 2: Add loader to `src/pages/index.astro`** (before `</Base>` closing tag, sibling of sections)

```astro
<script>
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasWebGL = (() => {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
    catch { return false; }
  })();
  if (canvas && !reduced && hasWebGL) {
    import('../scripts/hero').then((m) => m.initHero(canvas));
  } else {
    canvas?.remove(); // CSS gradient hero remains
  }
</script>
```

- [ ] **Step 3: Verify chunking + behavior**

Run: `npm run build`
Expected: `dist/_astro/` contains a separate chunk containing three.js (check: `ls -la dist/_astro/` — hero chunk ≈ 150–200 KB gz, NOT in the page's initial script). Dev server: hero shows drifting glowing node network, edges connect nearby nodes, mouse repels nodes. Emulate `prefers-reduced-motion` in devtools → static gradient only.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: lazy-loaded Three.js particle-network hero with WebGL/reduced-motion fallback"
```

---

### Task 6: GSAP scroll animations

**Files:**
- Create: `src/scripts/scroll.ts`
- Modify: `src/pages/index.astro` (init script)

**Interfaces:**
- Consumes: `.reveal` sections and `.timeline-item` elements (Task 4).
- Produces: `export function initScroll(): void` — fade+rise reveals for `.reveal`, staggered slide-in for `.timeline-item`. No-JS/reduced-motion: content stays fully visible (animations set initial state FROM JS, never from CSS).

- [ ] **Step 1: Write `src/scripts/scroll.ts`**

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScroll(): void {
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    gsap.from(el, {
      opacity: 0, y: 40, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });
  gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, x: -30, duration: 0.6, delay: (i % 4) * 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}
```

- [ ] **Step 2: Extend the loader script in `src/pages/index.astro`** (same `<script>` from Task 5; add after the hero block)

```ts
if (!reduced) {
  import('../scripts/scroll').then((m) => m.initScroll());
}
```

- [ ] **Step 3: Verify**

Run: `npm run build` → 0 errors. Dev server: sections fade in on scroll, timeline items slide in staggered. Reduced-motion emulation → no animation, all content visible immediately.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: GSAP ScrollTrigger section reveals and timeline stagger"
```

---

### Task 7: Projects page

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/pages/projects.astro`
- Modify: `src/styles/global.css` (append project-grid styles)

**Interfaces:**
- Consumes: `projects` + `Project` from `src/data/projects.ts` (Task 3), `.card`/`.tag` styles (Task 4), Base layout (Task 2).
- Produces: `/projects` route; `ProjectCard.astro` with `interface Props { project: Project }`.

- [ ] **Step 1: Append to `src/styles/global.css`**

```css
.project-grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr)); }
.project-card.featured { grid-column: 1 / -1; border-color: var(--accent-2); }
.project-card h3 a { color: var(--text); }
.project-card .award { color: var(--accent); font-family: var(--font-mono); font-size: 0.8rem; display: block; margin-top: 0.5rem; }
.project-card .links { margin-top: 1rem; display: flex; gap: 1rem; font-family: var(--font-mono); font-size: 0.85rem; }
```

- [ ] **Step 2: Write `src/components/ProjectCard.astro`**

```astro
---
import type { Project } from '../data/projects';
interface Props { project: Project; }
const { project } = Astro.props;
---
<article class:list={['card', 'project-card', { featured: project.featured }]}>
  <h3><a href={project.repo}>{project.name}</a></h3>
  {project.award && <span class="award">🏆 {project.award}</span>}
  <p class="dim" style="margin-top: 0.6rem;">{project.description}</p>
  <div class="tags" style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.75rem;">
    {project.tags.map((t) => <span class="tag">{t}</span>)}
  </div>
  <div class="links">
    <a href={project.repo}>Code →</a>
    {project.paper && <a href={project.paper}>Paper →</a>}
  </div>
</article>
```

- [ ] **Step 3: Write `src/pages/projects.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { projects } from '../data/projects';
---
<Base title="Projects — Shayan Davari Fard" description="Open-source projects: LogicSpec, NetNN (IEEE ISCC 2024), ONE Record, BitVote, and more.">
  <section class="section container" style="padding-top: 8rem;">
    <h2>Projects</h2>
    <p class="dim" style="max-width: 42rem; margin-bottom: 2rem;">
      Open source, research prototypes, and hackathon wins. More on
      <a href="https://github.com/shynfard">GitHub</a>.
    </p>
    <div class="project-grid">
      {projects.map((p) => <ProjectCard project={p} />)}
    </div>
  </section>
</Base>
```

- [ ] **Step 4: Verify**

Run: `npm run build && npx astro check` → 0 errors. `/projects` renders: LogicSpec full-width featured card, NetNN with award + paper link, hover lift works.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: projects page with featured LogicSpec card"
```

---

### Task 8: SEO — meta/OG, favicon, og-image

**Files:**
- Create: `public/favicon.svg`, `public/og.png`
- Modify: `src/layouts/Base.astro` (OG/Twitter meta, canonical)

**Interfaces:**
- Consumes: Base layout (Task 2); `site` config in `astro.config.mjs` (Task 1) → `Astro.site` for canonical URLs. Sitemap already emitted by @astrojs/sitemap.
- Produces: canonical + OG + Twitter meta on every page; `/favicon.svg`; `/og.png` 1200×630.

- [ ] **Step 1: Write `public/favicon.svg`** (node-network mark, matches hero)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#050810"/>
  <g stroke="#3b82f6" stroke-width="2" opacity="0.7">
    <line x1="18" y1="22" x2="42" y2="16"/>
    <line x1="18" y1="22" x2="30" y2="44"/>
    <line x1="42" y1="16" x2="30" y2="44"/>
    <line x1="42" y1="16" x2="50" y2="38"/>
    <line x1="30" y1="44" x2="50" y2="38"/>
  </g>
  <g fill="#22d3ee">
    <circle cx="18" cy="22" r="5"/>
    <circle cx="42" cy="16" r="4"/>
    <circle cx="30" cy="44" r="5"/>
    <circle cx="50" cy="38" r="4"/>
  </g>
</svg>
```

- [ ] **Step 2: Generate `public/og.png`** (1200×630). Use ImageMagick if present, else screenshot the hero at 1200×630 with the browse skill/chrome-devtools and save as `public/og.png`:

```bash
command -v magick && magick -size 1200x630 -define gradient:angle=135 gradient:'#0c1a33'-'#050810' \
  -font DejaVu-Sans-Bold -pointsize 64 -fill '#e6edf7' -gravity west -annotate +90-40 'Shayan Davari Fard' \
  -font DejaVu-Sans -pointsize 30 -fill '#22d3ee' -annotate +90+30 'Lead DevOps Engineer · Cloud & Security Architect' \
  -pointsize 22 -fill '#8b98ad' -annotate +90+90 'shayan.one' public/og.png
```

- [ ] **Step 3: Add meta to `src/layouts/Base.astro` `<head>`**

```astro
<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={new URL(Astro.url.pathname, Astro.site)} />
<meta property="og:image" content={new URL('/og.png', Astro.site)} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@shyndavfard" />
<meta name="theme-color" content="#050810" />
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: `dist/sitemap-index.xml` exists; `grep -c 'og:' dist/index.html` ≥ 4; favicon + og.png in `dist/`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: SEO meta, OG image, favicon, sitemap"
```

---

### Task 9: Dockerfile + nginx

**Files:**
- Create: `Dockerfile`, `nginx.conf`, `.dockerignore`

**Interfaces:**
- Consumes: `npm run build` → `dist/` (Task 1).
- Produces: image serving site on :80; used by Task 10 (CI push) and Task 11 (k8s image ref). Health endpoint: `/` returns 200.

- [ ] **Step 1: Write `.dockerignore`**

```
node_modules
dist
.git
.astro
docs
k8s
```

- [ ] **Step 2: Write `nginx.conf`**

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  gzip on;
  gzip_types text/html text/css application/javascript image/svg+xml application/json;
  gzip_min_length 1024;

  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self'" always;

  location /_astro/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    try_files $uri $uri/ $uri.html =404;
  }
}
```

- [ ] **Step 3: Write `Dockerfile`**

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

- [ ] **Step 4: Verify locally**

```bash
docker build -t shayan-one:test .
docker run -d --rm -p 8080:80 --name shayan-test shayan-one:test
curl -sI http://localhost:8080/ | head -5          # expect HTTP/1.1 200, X-Frame-Options
curl -s http://localhost:8080/projects | grep -o LogicSpec | head -1  # expect LogicSpec
docker stop shayan-test
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: multi-stage Dockerfile with hardened nginx config"
```

---

### Task 10: GitHub Actions — build + push to ghcr.io

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: Dockerfile (Task 9).
- Produces: on push to `main`, pushes `ghcr.io/shynfard/shayan-one:latest` + `:sha-<git-sha>`. Auth via built-in `GITHUB_TOKEN` — no manual secrets.

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: build-and-push

on:
  push:
    branches: [main]

permissions:
  contents: read
  packages: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Build site (fail fast)
        run: |
          npm ci
          npm run build

      - name: Log in to ghcr.io
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Image metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/shynfard/shayan-one
          tags: |
            type=raw,value=latest
            type=sha

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

- [ ] **Step 2: Validate YAML**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml'))" && echo OK`
Expected: OK

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "ci: build and push image to ghcr.io on main"
```

---

### Task 11: Kubernetes manifests

**Files:**
- Create: `k8s/deployment.yaml`, `k8s/service.yaml`, `k8s/ingress.yaml`, `k8s/README.md`

**Interfaces:**
- Consumes: image `ghcr.io/shynfard/shayan-one:latest` (Task 10).
- Produces: manifests the user applies from cluster side. Labels/selector: `app: shayan-one` everywhere.

- [ ] **Step 1: Write `k8s/deployment.yaml`**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shayan-one
  labels: { app: shayan-one }
spec:
  replicas: 1
  selector:
    matchLabels: { app: shayan-one }
  template:
    metadata:
      labels: { app: shayan-one }
    spec:
      containers:
        - name: web
          image: ghcr.io/shynfard/shayan-one:latest
          imagePullPolicy: Always
          ports:
            - containerPort: 80
          resources:
            requests: { cpu: 10m, memory: 32Mi }
            limits: { cpu: 200m, memory: 128Mi }
          readinessProbe:
            httpGet: { path: /, port: 80 }
            initialDelaySeconds: 2
            periodSeconds: 10
          livenessProbe:
            httpGet: { path: /, port: 80 }
            initialDelaySeconds: 5
            periodSeconds: 30
```

- [ ] **Step 2: Write `k8s/service.yaml`**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: shayan-one
  labels: { app: shayan-one }
spec:
  selector: { app: shayan-one }
  ports:
    - port: 80
      targetPort: 80
```

- [ ] **Step 3: Write `k8s/ingress.yaml`**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shayan-one
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts: [shayan.one]
      secretName: shayan-one-tls
  rules:
    - host: shayan.one
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: shayan-one
                port: { number: 80 }
```

- [ ] **Step 4: Write `k8s/README.md`**

```markdown
# Deploy shayan.one

Prereqs on cluster: ingress-nginx, cert-manager with ClusterIssuer `letsencrypt-prod`.
DNS: point `shayan.one` A/AAAA record at the ingress controller's external IP.

    kubectl apply -f k8s/

New version after CI push:

    kubectl rollout restart deployment/shayan-one

Image is public on ghcr.io — no imagePullSecret needed.
Adjust `ingressClassName` / cluster-issuer name to match your cluster.
```

- [ ] **Step 5: Validate**

Run: `kubectl apply --dry-run=client -f k8s/ 2>/dev/null || python3 -c "import yaml,sys; [yaml.safe_load(open(f)) for f in ['k8s/deployment.yaml','k8s/service.yaml','k8s/ingress.yaml']]" && echo OK`
Expected: OK (kubectl path only if a cluster context exists locally).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: k8s manifests — deployment, service, ingress with cert-manager TLS"
```

---

### Task 12: Project README, GitHub repo, push, QA

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: everything.
- Produces: public repo `shynfard/shayan.one` with CI running; QA verdict.

- [ ] **Step 1: Write `README.md`**

```markdown
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
```

- [ ] **Step 2: Create GitHub repo + push**

```bash
gh auth status   # must be logged in as shynfard
gh repo create shynfard/shayan.one --public --source /home/sfard/Codes/Private/shayan.one --push
```

If repo name with dot is rejected, fall back to `shynfard/shayan-one` and note it.

- [ ] **Step 3: Watch CI**

```bash
gh run watch --repo shynfard/shayan.one --exit-status
```

Expected: workflow green; `gh api /users/shynfard/packages/container/shayan-one/versions --jq '.[0].metadata.container.tags'` lists `latest`.

- [ ] **Step 4: QA pass**

- `npm run preview`, check both pages at 375px and 1440px widths.
- Verify: hero 3D runs, reduced-motion fallback, keyboard navigation of nav/links, no console errors.
- Lighthouse (chrome-devtools MCP or `npx lighthouse http://localhost:4321 --preset=desktop`): Performance ≥ 90, A11y ≥ 95, SEO ≥ 95. Fix regressions before closing.

- [ ] **Step 5: Final commit + push**

```bash
git add -A && git commit -m "docs: project README" && git push
```

User's manual follow-ups (outside this plan): point `shayan.one` DNS at cluster ingress IP, `kubectl apply -f k8s/`, optionally set current employer name in `src/data/experience.ts`.
