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
