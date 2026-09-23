import { CareerOption } from '../types';

export const CAREER_OPTIONS: CareerOption[] = [
  {
    id: 'fullstack-dev',
    title: 'Full-Stack Developer',
    category: 'Software Engineering',
    icon: 'Layers',
    description: 'Build complete web applications spanning responsive frontends, scalable REST/GraphQL APIs, and resilient databases.',
    benchmarkCoreSkills: ['JavaScript / TypeScript', 'React / Next.js', 'Node.js', 'PostgreSQL / SQL', 'REST APIs', 'Git'],
    benchmarkImportantSkills: ['Tailwind CSS', 'Docker', 'State Management', 'Testing (Jest/Playwright)', 'CI/CD Pipelines', 'Cloud Deployment'],
    popularRoles: ['Full Stack Engineer', 'Web Application Engineer', 'Product Engineer']
  },
  {
    id: 'frontend-dev',
    title: 'Frontend Engineer',
    category: 'Frontend & UI',
    icon: 'Layout',
    description: 'Design and engineer delightful, accessible, high-performance web applications and design systems.',
    benchmarkCoreSkills: ['HTML5 & CSS3', 'JavaScript / TypeScript', 'React', 'Tailwind CSS', 'Component Architecture', 'Git'],
    benchmarkImportantSkills: ['Next.js', 'Web Performance Optimization', 'State Management (Zustand/Redux)', 'Testing', 'Accessibility (a11y)'],
    popularRoles: ['Frontend Developer', 'UI Engineer', 'Design Systems Engineer']
  },
  {
    id: 'backend-dev',
    title: 'Backend Engineer',
    category: 'Software Engineering',
    icon: 'Server',
    description: 'Architect scalable server-side systems, microservices, databases, authentication, and high-throughput messaging.',
    benchmarkCoreSkills: ['Python or Node.js or Go', 'SQL & Database Design', 'RESTful API Architecture', 'Git', 'System Design Basics'],
    benchmarkImportantSkills: ['Redis / Caching', 'Docker', 'PostgreSQL', 'Message Queues (RabbitMQ/Kafka)', 'Microservices Architecture', 'Authentication (OAuth/JWT)'],
    popularRoles: ['Backend Developer', 'API Engineer', 'Distributed Systems Engineer']
  },
  {
    id: 'aiml-engineer',
    title: 'AI & Machine Learning Engineer',
    category: 'Artificial Intelligence',
    icon: 'Cpu',
    description: 'Develop, fine-tune, and deploy machine learning models, LLM systems, RAG pipelines, and edge AI applications.',
    benchmarkCoreSkills: ['Python', 'PyTorch or TensorFlow', 'Data Analysis (Pandas/NumPy)', 'Machine Learning Fundamentals', 'Git'],
    benchmarkImportantSkills: ['LLMs & Prompt Engineering', 'RAG & Vector Databases', 'Model Fine-Tuning', 'MLOps & Model Deployment', 'API Integration', 'Docker'],
    popularRoles: ['ML Engineer', 'Applied AI Engineer', 'Generative AI Developer']
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    category: 'Data & Analytics',
    icon: 'Database',
    description: 'Construct robust data pipelines, ETL/ELT workflows, data warehouses, and streaming analytics platforms.',
    benchmarkCoreSkills: ['SQL (Advanced)', 'Python', 'Data Warehousing (Snowflake/BigQuery)', 'ETL Pipelines', 'Git'],
    benchmarkImportantSkills: ['Apache Spark', 'Airflow / Orchestration', 'Kafka', 'dbt', 'Data Modeling', 'Cloud Storage (S3/GCS)'],
    popularRoles: ['Data Pipeline Engineer', 'Analytics Engineer', 'Big Data Developer']
  },
  {
    id: 'cloud-devops',
    title: 'DevOps & Cloud Engineer',
    category: 'Infrastructure',
    icon: 'Cloud',
    description: 'Automate deployments, orchestrate Kubernetes clusters, manage infrastructure-as-code, and ensure high reliability.',
    benchmarkCoreSkills: ['Linux & Bash Scripting', 'Docker & Containerization', 'CI/CD Pipelines (GitHub Actions)', 'AWS / GCP / Azure', 'Git'],
    benchmarkImportantSkills: ['Kubernetes (K8s)', 'Terraform (IaC)', 'Observability & Monitoring (Prometheus/Grafana)', 'Networking & Security', 'Serverless'],
    popularRoles: ['DevOps Engineer', 'Site Reliability Engineer (SRE)', 'Cloud Architect']
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Developer',
    category: 'Mobile',
    icon: 'Smartphone',
    description: 'Build native and cross-platform mobile experiences for iOS and Android with smooth interactions and offline support.',
    benchmarkCoreSkills: ['React Native or Flutter or Swift/Kotlin', 'JavaScript / TypeScript', 'Mobile UI/UX Principles', 'REST APIs', 'Git'],
    benchmarkImportantSkills: ['State Management', 'App Store Deployment & CI', 'Local Storage & Offline Sync', 'Push Notifications', 'Native Modules'],
    popularRoles: ['iOS Developer', 'Android Developer', 'React Native Engineer']
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    category: 'Security',
    icon: 'Shield',
    description: 'Protect applications, networks, and cloud infrastructure from threats, perform vulnerability assessments, and implement zero-trust.',
    benchmarkCoreSkills: ['Networking Fundamentals (TCP/IP)', 'Linux Security', 'Vulnerability Assessment', 'Web Application Security (OWASP Top 10)', 'Git'],
    benchmarkImportantSkills: ['Penetration Testing Tools', 'SIEM & Log Analysis', 'Identity & Access Management (IAM)', 'Incident Response', 'Cloud Security'],
    popularRoles: ['Security Analyst', 'AppSec Engineer', 'SOC Analyst']
  }
];

export const SKILL_CATEGORIES: Record<string, string[]> = {
  'Languages': [
    'JavaScript', 'TypeScript', 'Python', 'Go', 'Java', 'C++', 'Rust', 'SQL', 'Bash / Shell', 'HTML5 & CSS3'
  ],
  'Frontend & Frameworks': [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Tailwind CSS', 'Redux', 'Zustand', 'HTML5', 'CSS Modules', 'WebSockets'
  ],
  'Backend & APIs': [
    'Node.js', 'Express.js', 'FastAPI', 'Django', 'GraphQL', 'REST APIs', 'gRPC', 'Microservices', 'OAuth 2.0 / JWT'
  ],
  'Databases & Storage': [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Vector Databases (Pinecone/Milvus)', 'Snowflake', 'BigQuery', 'Prisma / Drizzle'
  ],
  'Cloud & DevOps': [
    'Docker', 'Kubernetes', 'AWS', 'Google Cloud Platform (GCP)', 'Terraform', 'CI/CD (GitHub Actions)', 'Linux', 'Nginx', 'Prometheus'
  ],
  'AI & Data Science': [
    'PyTorch', 'TensorFlow', 'Pandas & NumPy', 'RAG Pipelines', 'LangChain / LlamaIndex', 'Hugging Face', 'Prompt Engineering', 'MLOps'
  ],
  'Mobile & Native': [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Expo', 'Mobile App Architecture'
  ],
  'Security & Testing': [
    'OWASP Top 10', 'Jest / Vitest', 'Cypress / Playwright', 'IAM Security', 'Penetration Testing', 'PenTesting Tools'
  ]
};
