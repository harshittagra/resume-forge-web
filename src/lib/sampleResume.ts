import { MasterResume } from "@/types/resume";

export const SAMPLE_MASTER_RESUME: MasterResume = {
  contact: {
    name: "Alex Morgan",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan-dev",
    github: "github.com/alexm-ai",
  },
  summary:
    "Senior Full-Stack & AI Systems Engineer with 5+ years of experience architecting distributed cloud applications, LLM agents, and high-throughput real-time pipelines. Proven track record optimizing latency by 45% and driving scalable systems serving over 2M active users.",
  skills: {
    languages: ["TypeScript", "Python", "Go", "SQL", "Rust"],
    frameworks: ["Next.js", "React", "FastAPI", "Node.js", "LangChain", "PyTorch"],
    tools_and_platforms: ["PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "Kafka"],
    concepts: ["Distributed Systems", "RAG Pipelines", "Microservices", "REST & GraphQL", "CI/CD"],
  },
  experience: [
    {
      id: "exp-1",
      role: "Senior AI & Full-Stack Engineer",
      company: "Nexus AI Technologies",
      location: "San Francisco, CA",
      dates: "2023 - Present",
      bullets: [
        "Architected an agentic retrieval-augmented generation (RAG) platform using Next.js, FastAPI, and hybrid vector search, reducing hallucination rates by 38%.",
        "Engineered real-time streaming LLM pipelines with Groq and OpenAI models, achieving sub-400ms TTFT across 1.5M monthly user interactions.",
        "Scaled distributed cache layers with Redis and PostgreSQL connection pooling, handling 25,000 requests/sec with 99.99% uptime.",
        "Mentored a team of 6 engineers on modern React patterns, clean architecture, and automated test coverage.",
      ],
    },
    {
      id: "exp-2",
      role: "Software Engineer",
      company: "CloudScale Systems",
      location: "Austin, TX",
      dates: "2021 - 2023",
      bullets: [
        "Built responsive client portals using React, TypeScript, and Tailwind CSS, increasing enterprise client engagement by 28%.",
        "Designed and deployed microservices in Go and Python containerized on AWS EKS with Terraform infrastructure-as-code.",
        "Reduced database query execution times by 55% through query profiling, indexing strategies, and read-replica offloading in PostgreSQL.",
        "Automated CI/CD pipelines with GitHub Actions and Docker, reducing release cycle times from 2 days to 35 minutes.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Agentic RAG Knowledge Engine",
      technologies: ["Next.js", "Python", "LangGraph", "ChromaDB", "Tailwind CSS"],
      bullets: [
        "Built an autonomous document analysis system that indexes PDFs and financial statements with cross-encoder reranking.",
        "Implemented interactive visualization for semantic chunk relationships and confidence calibration metrics.",
      ],
    },
    {
      id: "proj-2",
      name: "PulseStream Real-Time Analytics",
      technologies: ["TypeScript", "Node.js", "Kafka", "ClickHouse", "Docker"],
      bullets: [
        "Designed high-throughput telemetry ingestion pipeline processing 50M events per day with zero data loss.",
        "Created an intuitive real-time dashboard featuring live latency percentiles and alert thresholds.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      dates: "2017 - 2021",
      details: "Honors Graduate, Focus on Systems and Machine Learning",
    },
  ],
  certifications: [
    "AWS Certified Solutions Architect – Associate",
    "DeepLearning.AI Generative AI Engineering Specialist",
  ],
};
