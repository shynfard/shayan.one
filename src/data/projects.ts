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
