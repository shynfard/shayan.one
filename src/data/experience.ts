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
  {
    start: '2014', end: '2019', title: 'Full-Stack Developer', org: 'Ariana GmbH',
    summary: 'Built and maintained frontend and backend applications and internal company software. Owned database processing — structured data capture, data modeling, and performance optimization — plus server administration: patch management, firewall configuration, user and access management, backups, and IT security for reliable operations.',
    tags: ['JavaScript/TypeScript', 'Full-Stack', 'SQL', 'Data Modeling', 'Server Administration', 'IT Security'],
  },
];
