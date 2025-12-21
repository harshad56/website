export type ProjectDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type ProjectCategory = "Web App" | "AI/ML" | "Fintech" | "DevOps" | "Mobile" | "Data";

export interface RealProject {
  id: string;
  title: string;
  summary: string;
  description: string;
  priceINR: number;
  level: ProjectDifficulty;
  category: ProjectCategory;
  duration: string;
  techStack: string[];
  deliverables: string[];
  includes: string[];
  repoUrl: string;
  previewUrl: string;
  lastUpdated: string;
  rating: number;
  studentsBuilt: number;
  seller: string;
  verified: boolean;
}

export const realProjects: RealProject[] = [
  {
    id: "rp-001",
    title: "AI Interview Coach SaaS",
    summary: "Browser-based interview practice assistant with GPT prompts, transcripts, and analytics dashboard.",
    description:
      "Build a production-grade SaaS with subscription tiers, usage-based billing, voice recording, and AI-generated feedback. Includes marketing site, onboarding wizard, and admin controls for monitoring usage.",
    priceINR: 4999,
    level: "Advanced",
    category: "AI/ML",
    duration: "3-4 weeks",
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Supabase", "Stripe", "OpenAI"],
    deliverables: [
      "Full Next.js monorepo with API routes",
      "Supabase schema + seed data",
      "AI prompt library and evaluation rubric",
      "Deployment guide for Vercel + Railway",
      "Product analytics dashboard"
    ],
    includes: ["License for commercial reuse", "Figma files", "Database ERD", "Marketing copy kit"],
    repoUrl: "https://github.com/demo/ai-interview-coach",
    previewUrl: "https://ai-interview-coach.demo",
    lastUpdated: "Sep 2025",
    rating: 4.9,
    studentsBuilt: 146,
    seller: "CodeAcademy Pro Labs",
    verified: true
  },
  {
    id: "rp-002",
    title: "UPI Expense Tracker Mobile App",
    summary: "React Native app that reads SMS/Push notifications to auto-tag UPI & card transactions.",
    description:
      "Implements Reserve Bank compliant consent flow, offline cache, budget alerts, and Razorpay subscription for premium insights. Includes mock data scripts and Detox tests.",
    priceINR: 2999,
    level: "Intermediate",
    category: "Fintech",
    duration: "2-3 weeks",
    techStack: ["React Native", "Expo", "Firebase", "Razorpay", "TypeScript"],
    deliverables: [
      "Expo project with modular architecture",
      "Notification ingestion pipeline",
      "Premium paywall + Razorpay integration",
      "On-device encryption utilities",
      "Play Store listing checklist"
    ],
    includes: ["Product requirement doc", "QA test cases", "Marketing creatives"],
    repoUrl: "https://github.com/demo/upi-expense-tracker",
    previewUrl: "https://expo.dev/@demo/upi-expense-tracker",
    lastUpdated: "Aug 2025",
    rating: 4.7,
    studentsBuilt: 212,
    seller: "Indie Dev Studio",
    verified: true
  },
  {
    id: "rp-003",
    title: "Realtime Fleet Monitoring Dashboard",
    summary: "Operational dashboard with MQTT ingestion, map overlays, custom alerts, and SLA reports.",
    description:
      "Built for logistics startups who need to monitor EV fleets. Includes device simulator, geofencing rules, maintenance scheduler, and PDF reporting with wkhtmltopdf.",
    priceINR: 6999,
    level: "Advanced",
    category: "DevOps",
    duration: "4-5 weeks",
    techStack: ["NestJS", "PostgreSQL", "Redis", "MQTT", "Mapbox", "Tailwind"],
    deliverables: [
      "Microservice repo with docker-compose",
      "Infrastructure-as-code templates",
      "Alerting workflows + Slack bot",
      "Automated report generator",
      "Investor pitch deck template"
    ],
    includes: ["Deployment scripts", "KPI dashboard", "Sample contracts"],
    repoUrl: "https://github.com/demo/fleet-monitor",
    previewUrl: "https://fleet-monitor.demo",
    lastUpdated: "Jul 2025",
    rating: 5,
    studentsBuilt: 58,
    seller: "FleetOps Collective",
    verified: true
  },
  {
    id: "rp-004",
    title: "Learning Management System with Razorpay Subscriptions",
    summary: "Full-stack LMS featuring cohort scheduling, content DRM, and in-app marketplace for notes.",
    description:
      "Supports multiple instructor roles, live webinars via Zoom SDK, certificate generation, and Razorpay Plans for INR billing. Includes seed data for tech + design cohorts.",
    priceINR: 5999,
    level: "Intermediate",
    category: "Web App",
    duration: "3 weeks",
    techStack: ["React", "Node.js", "MongoDB", "Redis", "Razorpay", "AWS S3"],
    deliverables: [
      "Responsive frontend + design system",
      "Admin portal with role-based access",
      "Razorpay subscription + GST invoices",
      "Certificate generation pipeline",
      "Email + WhatsApp notification templates"
    ],
    includes: ["Figma UI kit", "Launch checklist", "Pitch deck"],
    repoUrl: "https://github.com/demo/lms-razorpay",
    previewUrl: "https://lms-razorpay.demo",
    lastUpdated: "Jun 2025",
    rating: 4.8,
    studentsBuilt: 184,
    seller: "CodeAcademy Pro Labs",
    verified: true
  }
];
