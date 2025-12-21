import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download, Layout, Sparkles, Plus, Trash2, User, Briefcase,
  GraduationCap, Code, Award, Mail, Phone, MapPin, Linkedin,
  Github, Globe, FileText, Eye, ChevronRight, ChevronDown, ChevronUp, CheckCircle, X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  title: string;
  photo: string;
  photoPosition: "left" | "right" | "none";
}

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: string[];
  languages: string[];
}

// 20 Professional Resume Templates
const templates = [
  { id: "modern", name: "Modern", color: "#6366f1", accent: "#818cf8", style: "clean" },
  { id: "classic", name: "Classic", color: "#1f2937", accent: "#374151", style: "traditional" },
  { id: "minimal", name: "Minimal", color: "#000000", accent: "#6b7280", style: "simple" },
  { id: "creative", name: "Creative", color: "#8b5cf6", accent: "#a78bfa", style: "bold" },
  { id: "professional", name: "Professional", color: "#0369a1", accent: "#0284c7", style: "corporate" },
  { id: "elegant", name: "Elegant", color: "#7c3aed", accent: "#8b5cf6", style: "sophisticated" },
  { id: "tech", name: "Tech", color: "#059669", accent: "#10b981", style: "developer" },
  { id: "executive", name: "Executive", color: "#1e3a5f", accent: "#2563eb", style: "senior" },
  { id: "startup", name: "Startup", color: "#f97316", accent: "#fb923c", style: "dynamic" },
  { id: "academic", name: "Academic", color: "#7c2d12", accent: "#9a3412", style: "scholarly" },
  { id: "designer", name: "Designer", color: "#db2777", accent: "#ec4899", style: "creative" },
  { id: "compact", name: "Compact", color: "#475569", accent: "#64748b", style: "dense" },
  { id: "corporate", name: "Corporate", color: "#0f172a", accent: "#1e293b", style: "business" },
  { id: "innovative", name: "Innovative", color: "#7c3aed", accent: "#a855f7", style: "cutting-edge" },
  { id: "bold", name: "Bold", color: "#dc2626", accent: "#ef4444", style: "striking" },
  { id: "refined", name: "Refined", color: "#374151", accent: "#4b5563", style: "polished" },
  { id: "vibrant", name: "Vibrant", color: "#ea580c", accent: "#f97316", style: "energetic" },
  { id: "sleek", name: "Sleek", color: "#1e293b", accent: "#334155", style: "smooth" },
  { id: "timeless", name: "Timeless", color: "#292524", accent: "#44403c", style: "enduring" },
  { id: "premium", name: "Premium", color: "#1a1a2e", accent: "#16213e", style: "luxury" },
];

const skillSuggestions = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++",
  "SQL", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Git",
  "REST APIs", "GraphQL", "CI/CD", "Agile", "HTML/CSS", "Tailwind CSS",
  "Next.js", "Vue.js", "Angular", "Express.js", "Django", "Spring Boot"
];

const aiSuggestions = [
  "Developed and deployed a microservices architecture handling 1M+ daily requests with 99.9% uptime",
  "Led a team of 5 engineers to deliver a React Native app with 100K+ downloads in 3 months",
  "Optimized database queries reducing API response time by 60% and improving user experience",
  "Implemented CI/CD pipeline with GitHub Actions, reducing deployment time from 2 hours to 15 minutes",
  "Built real-time notification system using WebSockets serving 50K+ concurrent users",
  "Architected scalable cloud infrastructure on AWS reducing operational costs by 35%",
  "Developed machine learning pipeline processing 10TB+ data daily with 95% accuracy",
  "Created automated testing framework achieving 90% code coverage across 50+ microservices"
];

// Sample data for preview demonstration
const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
    portfolio: "alexjohnson.dev",
    summary: "Senior Full-Stack Developer with 6+ years of experience building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers. Led multiple high-impact projects resulting in 40% increase in user engagement.",
    title: "Senior Full-Stack Developer",
    photo: "",
    photoPosition: "right"
  },
  experiences: [
    {
      id: "exp1",
      company: "TechCorp Inc.",
      role: "Senior Software Engineer",
      startDate: "2021-03",
      endDate: "",
      current: true,
      description: "Lead developer for the core platform team, responsible for architecture decisions and code quality.",
      achievements: [
        "Architected microservices platform handling 2M+ daily active users",
        "Reduced page load time by 60% through performance optimization",
        "Mentored team of 4 junior developers, improving team velocity by 35%",
        "Implemented automated CI/CD pipeline reducing deployment time by 80%"
      ]
    },
    {
      id: "exp2",
      company: "StartupXYZ",
      role: "Full-Stack Developer",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      description: "Built and maintained multiple customer-facing applications using React and Node.js.",
      achievements: [
        "Developed real-time collaboration features used by 50K+ users",
        "Built RESTful APIs serving 100K+ requests per day",
        "Reduced bug count by 45% through comprehensive testing strategy"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2014-09",
      endDate: "2018-05",
      gpa: "3.8"
    }
  ],
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "MongoDB", "GraphQL", "Git", "Agile"],
  projects: [
    {
      id: "proj1",
      name: "E-Commerce Platform",
      description: "Built a full-stack e-commerce platform with real-time inventory management, payment processing, and analytics dashboard.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
      link: "github.com/alexjohnson/ecommerce"
    },
    {
      id: "proj2",
      name: "Task Management App",
      description: "Developed a collaborative task management application with real-time updates and team collaboration features.",
      technologies: ["Next.js", "TypeScript", "Prisma", "WebSocket"],
      link: "taskapp.alexjohnson.dev"
    }
  ],
  certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional Developer", "MongoDB Certified Developer"],
  languages: ["English (Native)", "Spanish (Intermediate)", "Mandarin (Basic)"]
};

const sampleAiSuggestions = [
  "Refactored legacy codebase to TypeScript, reducing bugs by 40% and improving maintainability",
  "Designed and implemented RESTful APIs consumed by 3 client applications",
  "Created automated testing suite with 85% code coverage using Jest and Cypress",
  "Mentored 3 junior developers, conducting code reviews and pair programming sessions",
  "Reduced cloud infrastructure costs by 30% through optimization and resource management",
];

// Resume Preview Component
const ResumePreview = ({ data, template, onClose }: { data: ResumeData; template: string; onClose: () => void }) => {
  const selectedTemplate = templates.find(t => t.id === template) || templates[0];

  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Template-specific styles
  const getTemplateStyles = () => {
    switch (template) {
      case "modern":
        return {
          container: "bg-white",
          header: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8",
          name: "text-4xl font-bold",
          title: "text-xl opacity-90 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm opacity-90",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1 mb-3",
          skillBadge: "bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm",
        };
      case "classic":
        return {
          container: "bg-white",
          header: "border-b-4 border-gray-800 p-8 text-center",
          name: "text-4xl font-serif font-bold text-gray-800",
          title: "text-xl text-gray-600 mt-2",
          contact: "flex justify-center flex-wrap gap-6 mt-4 text-sm text-gray-600",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-serif font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider",
          skillBadge: "bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm",
        };
      case "minimal":
        return {
          container: "bg-white",
          header: "p-8 border-b border-gray-200",
          name: "text-3xl font-light text-gray-900",
          title: "text-lg text-gray-500 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm text-gray-500",
          section: "px-8 py-4",
          sectionTitle: "text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3",
          skillBadge: "border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm",
        };
      case "creative":
        return {
          container: "bg-gradient-to-br from-purple-50 to-pink-50",
          header: "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white p-8 rounded-b-3xl",
          name: "text-4xl font-black",
          title: "text-xl opacity-90 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm opacity-90",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3",
          skillBadge: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm",
        };
      case "professional":
        return {
          container: "bg-white",
          header: "bg-sky-700 text-white p-8",
          name: "text-4xl font-bold",
          title: "text-xl opacity-90 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm opacity-90",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold text-sky-700 border-l-4 border-sky-700 pl-3 mb-3",
          skillBadge: "bg-sky-100 text-sky-700 px-3 py-1 rounded text-sm",
        };
      case "elegant":
        return {
          container: "bg-gray-50",
          header: "bg-violet-900 text-white p-8",
          name: "text-4xl font-light tracking-wide",
          title: "text-xl opacity-80 mt-2 font-light",
          contact: "flex flex-wrap gap-6 mt-4 text-sm opacity-80",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-light text-violet-900 border-b border-violet-200 pb-2 mb-3 tracking-wide",
          skillBadge: "bg-violet-100 text-violet-700 px-3 py-1 rounded text-sm",
        };
      case "tech":
        return {
          container: "bg-gray-900 text-gray-100",
          header: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8",
          name: "text-4xl font-mono font-bold",
          title: "text-xl opacity-90 mt-1 font-mono",
          contact: "flex flex-wrap gap-4 mt-4 text-sm opacity-90 font-mono",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-mono font-bold text-emerald-400 border-b border-emerald-600 pb-1 mb-3",
          skillBadge: "bg-emerald-900 text-emerald-300 px-3 py-1 rounded font-mono text-sm border border-emerald-700",
        };
      case "executive":
        return {
          container: "bg-white",
          header: "bg-slate-800 text-white p-8",
          name: "text-4xl font-bold",
          title: "text-xl text-slate-300 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm text-slate-300",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3 uppercase",
          skillBadge: "bg-slate-100 text-slate-700 px-3 py-1 rounded text-sm",
        };
      case "startup":
        return {
          container: "bg-orange-50",
          header: "bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8",
          name: "text-4xl font-black",
          title: "text-xl opacity-90 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm opacity-90",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold text-orange-600 mb-3",
          skillBadge: "bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium",
        };
      case "academic":
        return {
          container: "bg-amber-50",
          header: "border-b-4 border-amber-900 p-8",
          name: "text-4xl font-serif font-bold text-amber-900",
          title: "text-xl text-amber-700 mt-2",
          contact: "flex flex-wrap gap-6 mt-4 text-sm text-amber-700",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-serif font-bold text-amber-900 border-b border-amber-300 pb-1 mb-3",
          skillBadge: "bg-amber-100 text-amber-800 px-3 py-1 rounded text-sm",
        };
      case "designer":
        return {
          container: "bg-white",
          header: "bg-gradient-to-r from-pink-500 to-rose-500 text-white p-8 clip-path-polygon",
          name: "text-4xl font-black tracking-tight",
          title: "text-xl opacity-90 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm opacity-90",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold text-pink-600 mb-3",
          skillBadge: "bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm",
        };
      case "compact":
        return {
          container: "bg-white text-sm",
          header: "bg-slate-600 text-white p-6",
          name: "text-2xl font-bold",
          title: "text-base opacity-90",
          contact: "flex flex-wrap gap-3 mt-2 text-xs opacity-90",
          section: "px-6 py-2",
          sectionTitle: "text-sm font-bold text-slate-600 border-b border-slate-300 pb-1 mb-2 uppercase",
          skillBadge: "bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs",
        };
      case "corporate":
        return {
          container: "bg-white",
          header: "bg-slate-950 text-white p-8 border-b-4 border-slate-700",
          name: "text-4xl font-bold tracking-tight",
          title: "text-xl text-slate-300 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm text-slate-300",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold text-slate-900 border-l-4 border-slate-900 pl-3 mb-3 uppercase tracking-wide",
          skillBadge: "bg-slate-100 text-slate-800 px-3 py-1 rounded text-sm font-medium",
        };
      case "innovative":
        return {
          container: "bg-gradient-to-br from-purple-50 to-indigo-50",
          header: "bg-gradient-to-r from-purple-700 via-violet-600 to-purple-700 text-white p-8",
          name: "text-4xl font-bold",
          title: "text-xl opacity-90 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm opacity-90",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold text-purple-700 border-b-2 border-purple-300 pb-2 mb-3",
          skillBadge: "bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium",
        };
      case "bold":
        return {
          container: "bg-white",
          header: "bg-gradient-to-r from-red-600 to-rose-600 text-white p-8",
          name: "text-4xl font-black",
          title: "text-xl opacity-95 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm opacity-95",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-black text-red-600 border-b-4 border-red-600 pb-2 mb-3 uppercase tracking-tight",
          skillBadge: "bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-bold",
        };
      case "refined":
        return {
          container: "bg-gray-50",
          header: "bg-gray-800 text-white p-8",
          name: "text-4xl font-semibold tracking-wide",
          title: "text-xl text-gray-300 mt-1",
          contact: "flex flex-wrap gap-6 mt-4 text-sm text-gray-300",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-semibold text-gray-800 border-b-2 border-gray-400 pb-2 mb-3",
          skillBadge: "bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm",
        };
      case "vibrant":
        return {
          container: "bg-orange-50",
          header: "bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white p-8",
          name: "text-4xl font-extrabold",
          title: "text-xl opacity-95 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm opacity-95",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold text-orange-700 mb-3 border-l-4 border-orange-600 pl-3",
          skillBadge: "bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium",
        };
      case "sleek":
        return {
          container: "bg-slate-50",
          header: "bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8",
          name: "text-4xl font-bold",
          title: "text-xl text-slate-200 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm text-slate-200",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold text-slate-800 border-b border-slate-400 pb-2 mb-3",
          skillBadge: "bg-slate-200 text-slate-800 px-3 py-1 rounded text-sm",
        };
      case "timeless":
        return {
          container: "bg-stone-50",
          header: "bg-stone-900 text-white p-8 border-b-2 border-stone-700",
          name: "text-4xl font-serif font-bold text-white",
          title: "text-xl text-stone-300 mt-2 font-serif",
          contact: "flex flex-wrap gap-6 mt-4 text-sm text-stone-300",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-serif font-bold text-stone-900 border-b border-stone-400 pb-2 mb-3 uppercase tracking-wider",
          skillBadge: "bg-stone-200 text-stone-800 px-3 py-1 rounded text-sm",
        };
      case "premium":
        return {
          container: "bg-gradient-to-br from-slate-50 to-gray-100",
          header: "bg-gradient-to-r from-slate-950 via-gray-900 to-slate-950 text-white p-8",
          name: "text-4xl font-bold tracking-tight",
          title: "text-xl text-gray-300 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm text-gray-300",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold text-slate-900 border-l-4 border-slate-900 pl-4 mb-3 uppercase tracking-wide",
          skillBadge: "bg-slate-200 text-slate-900 px-3 py-1 rounded text-sm font-medium",
        };
      default:
        return {
          container: "bg-white",
          header: "bg-indigo-600 text-white p-8",
          name: "text-4xl font-bold",
          title: "text-xl opacity-90 mt-1",
          contact: "flex flex-wrap gap-4 mt-4 text-sm opacity-90",
          section: "px-8 py-4",
          sectionTitle: "text-lg font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1 mb-3",
          skillBadge: "bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm",
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-auto rounded-lg shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-2 sm:top-4 right-2 sm:right-4 z-10 bg-black/70 text-white p-2 sm:p-2.5 rounded-full hover:bg-black/90 transition-colors ml-auto mr-2 sm:mr-4 mt-2 sm:mt-4 mb-2 flex items-center justify-center min-w-[44px] min-h-[44px]"
          aria-label="Close preview"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Resume Content */}
        <div className={`${styles.container} min-h-[1100px]`} id="resume-preview">
          {/* Header */}
          <div className={styles.header}>
            <div className={`flex items-start gap-6 ${data.personalInfo.photoPosition === "right" ? "flex-row-reverse" : ""}`}>
              {/* Photo */}
              {data.personalInfo.photo && data.personalInfo.photoPosition !== "none" && (
                <div className="flex-shrink-0">
                  <img
                    src={data.personalInfo.photo}
                    alt={data.personalInfo.fullName}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white/30 shadow-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className={styles.name}>{data.personalInfo.fullName || "Your Name"}</h1>
                {data.personalInfo.title && <p className={styles.title}>{data.personalInfo.title}</p>}
                <div className={styles.contact}>
                  {data.personalInfo.email && <span>📧 {data.personalInfo.email}</span>}
                  {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
                  {data.personalInfo.location && <span>📍 {data.personalInfo.location}</span>}
                  {data.personalInfo.linkedin && <span>💼 {data.personalInfo.linkedin}</span>}
                  {data.personalInfo.github && <span>🐙 {data.personalInfo.github}</span>}
                  {data.personalInfo.portfolio && <span>🌐 {data.personalInfo.portfolio}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          {data.personalInfo.summary && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Professional Summary</h2>
              <p className={template === "tech" ? "text-gray-300" : "text-gray-700"}>{data.personalInfo.summary}</p>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Technical Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className={styles.skillBadge}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {data.experiences.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Professional Experience</h2>
              <div className="space-y-4">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-bold ${template === "tech" ? "text-white" : "text-gray-900"}`}>{exp.role}</h3>
                        <p className={template === "tech" ? "text-emerald-400" : "text-gray-600"}>{exp.company}</p>
                      </div>
                      <span className={`text-sm ${template === "tech" ? "text-gray-400" : "text-gray-500"}`}>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className={`mt-2 ${template === "tech" ? "text-gray-300" : "text-gray-700"}`}>{exp.description}</p>
                    )}
                    {exp.achievements.length > 0 && (
                      <ul className={`mt-2 list-disc list-inside ${template === "tech" ? "text-gray-300" : "text-gray-700"}`}>
                        {exp.achievements.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Projects</h2>
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className={`font-bold ${template === "tech" ? "text-white" : "text-gray-900"}`}>{proj.name}</h3>
                    <p className={`${template === "tech" ? "text-gray-300" : "text-gray-700"}`}>{proj.description}</p>
                    {proj.technologies.length > 0 && (
                      <p className={`text-sm mt-1 ${template === "tech" ? "text-emerald-400" : "text-gray-500"}`}>
                        Technologies: {proj.technologies.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-bold ${template === "tech" ? "text-white" : "text-gray-900"}`}>
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className={template === "tech" ? "text-emerald-400" : "text-gray-600"}>{edu.institution}</p>
                      {edu.gpa && <p className={`text-sm ${template === "tech" ? "text-gray-400" : "text-gray-500"}`}>GPA: {edu.gpa}</p>}
                    </div>
                    <span className={`text-sm ${template === "tech" ? "text-gray-400" : "text-gray-500"}`}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Certifications</h2>
              <ul className={`list-disc list-inside ${template === "tech" ? "text-gray-300" : "text-gray-700"}`}>
                {data.certifications.map((cert, i) => (
                  <li key={i}>{cert}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Languages</h2>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang, i) => (
                  <span key={i} className={styles.skillBadge}>{lang}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-slate-900 p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center border-t border-white/10">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-white/20 text-white min-h-[44px] w-full sm:w-auto"
          >
            Close Preview
          </Button>
          <Button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                const content = document.getElementById('resume-preview')?.outerHTML;
                printWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>${data.personalInfo.fullName || 'Resume'}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                      @page { margin: 0; size: A4; }
                    </style>
                  </head>
                  <body>${content}</body>
                  </html>
                `);
                printWindow.document.close();
                setTimeout(() => printWindow.print(), 500);
              }
            }}
            className="bg-indigo-500 hover:bg-indigo-600 min-h-[44px] w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// Template Preview Card
const TemplateCard = ({
  template,
  isSelected,
  onClick,
  onPreview
}: {
  template: typeof templates[0];
  isSelected: boolean;
  onClick: () => void;
  onPreview: () => void;
}) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all w-full max-w-full ${isSelected ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-white/10 hover:border-white/30"
      }`}
    onClick={onClick}
  >
    {/* Mini Preview */}
    <div className="h-20 sm:h-24 md:h-32 relative" style={{ background: template.color }}>
      <div className="absolute inset-0 p-3">
        <div className="bg-white/20 h-3 w-16 rounded mb-1"></div>
        <div className="bg-white/10 h-2 w-24 rounded mb-3"></div>
        <div className="space-y-1">
          <div className="bg-white/10 h-1.5 w-full rounded"></div>
          <div className="bg-white/10 h-1.5 w-3/4 rounded"></div>
          <div className="bg-white/10 h-1.5 w-5/6 rounded"></div>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
    <div className="bg-slate-800 p-2">
      <div className="flex items-center justify-between gap-1">
        <span className="text-white font-medium text-xs truncate">{template.name}</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 sm:h-auto sm:w-auto p-1 sm:px-2 text-xs text-white/60 hover:text-white hover:bg-white/10 flex-shrink-0 min-w-[28px] min-h-[28px]"
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          aria-label="Preview template"
        >
          <Eye className="w-3 h-3" />
          <span className="hidden sm:inline sm:ml-1">Preview</span>
        </Button>
      </div>
      <span className="text-white/50 text-[10px] sm:text-xs capitalize truncate block mt-0.5">{template.style}</span>
    </div>
  </motion.div>
);

const ResumeBuilder = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern");
  const [activeTab, setActiveTab] = useState("personal");
  const [currentAiSuggestion, setCurrentAiSuggestion] = useState(aiSuggestions[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiFeature, setAiFeature] = useState<"suggestions" | "summary" | "improve" | "ats" | "keywords" | "analyze">("suggestions");
  const [aiSummary, setAiSummary] = useState<string>("");
  const [aiImprovedText, setAiImprovedText] = useState<string>("");
  const [atsSuggestions, setAtsSuggestions] = useState<string[]>([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);
  const [inputText, setInputText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  // Controls whether the preview shows the user's current data or the built‑in sample
  const [previewSource, setPreviewSource] = useState<"current" | "sample">("current");

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
      summary: "",
      title: "",
      photo: "",
      photoPosition: "right"
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: []
  });

  const photoInputRef = useRef<HTMLInputElement>(null);

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo("photo", reader.result as string);
        toast({
          title: "Photo uploaded",
          description: "Your photo has been added to the resume"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Load sample data for preview
  const loadSampleData = () => {
    setResumeData(sampleResumeData);
    toast({
      title: "Sample data loaded",
      description: "Example resume data has been loaded. You can edit it or clear to start fresh."
    });
  };

  // Clear all data
  const clearAllData = () => {
    setResumeData({
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
        summary: "",
        title: "",
        photo: "",
        photoPosition: "right"
      },
      experiences: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: []
    });
    toast({
      title: "Data cleared",
      description: "All resume data has been cleared"
    });
  };

  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newAchievement, setNewAchievement] = useState<{ [key: string]: string }>({});

  // Update personal info
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: []
    };
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExp]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const addAchievementToExperience = (expId: string) => {
    const achievement = newAchievement[expId];
    if (!achievement?.trim()) return;
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === expId
          ? { ...exp, achievements: [...exp.achievements, achievement] }
          : exp
      )
    }));
    setNewAchievement(prev => ({ ...prev, [expId]: "" }));
  };

  const removeAchievement = (expId: string, index: number) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === expId
          ? { ...exp, achievements: exp.achievements.filter((_, i) => i !== index) }
          : exp
      )
    }));
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: ""
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Project handlers
  const addProject = () => {
    const newProj: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      link: ""
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  // Skills handlers
  const addSkill = (skill: string) => {
    if (!skill.trim() || resumeData.skills.includes(skill)) return;
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Certification handlers
  const addCertification = () => {
    if (!newCertification.trim()) return;
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
    }));
    setNewCertification("");
  };

  const removeCertification = (cert: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  };

  // Language handlers
  const addLanguage = () => {
    if (!newLanguage.trim() || resumeData.languages.includes(newLanguage)) return;
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, newLanguage]
    }));
    setNewLanguage("");
  };

  const removeLanguage = (lang: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }));
  };

  // AI suggestion generator
  const generateAiSuggestion = async () => {
    setIsGenerating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/resume-ai/generate-achievements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: resumeData.personalInfo.title || 'Software Developer',
          company: resumeData.experiences[0]?.company || '',
          industry: 'Technology',
        }),
      });

      const data = await response.json();

      if (data.success && data.achievements && data.achievements.length > 0) {
        // Pick a random achievement from the generated ones
        const randomIndex = Math.floor(Math.random() * data.achievements.length);
        setCurrentAiSuggestion(data.achievements[randomIndex].replace(/^•\s*/, ''));
        toast({
          title: "New suggestion generated!",
          description: "Click to copy and use in your experience section.",
        });
      } else {
        // Fallback to local suggestions
        const randomIndex = Math.floor(Math.random() * aiSuggestions.length);
        setCurrentAiSuggestion(aiSuggestions[randomIndex]);
        toast({
          title: "Suggestion generated!",
          description: "Click to copy and use in your experience section.",
        });
      }
    } catch (error) {
      console.error('Error generating suggestion:', error);
      // Fallback to local suggestions
      const randomIndex = Math.floor(Math.random() * aiSuggestions.length);
      setCurrentAiSuggestion(aiSuggestions[randomIndex]);
      toast({
        title: "Suggestion generated!",
        description: "Click to copy and use in your experience section.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate professional summary using AI
  const generateProfessionalSummary = async () => {
    setIsGenerating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/resume-ai/generate-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: resumeData.personalInfo.fullName,
          title: resumeData.personalInfo.title,
          experiences: resumeData.experiences,
          skills: resumeData.skills,
          education: resumeData.education,
        }),
      });

      const data = await response.json();

      if (data.success && data.summary) {
        setAiSummary(data.summary);
        toast({
          title: "Professional summary generated!",
          description: "Review and customize it for your resume.",
        });
      } else {
        throw new Error(data.message || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Improve bullet point or text using AI
  const improveText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter text to improve.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/resume-ai/improve-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          context: resumeData.personalInfo.title || 'software developer',
        }),
      });

      const data = await response.json();

      if (data.success && data.improvedText) {
        setAiImprovedText(data.improvedText);
        toast({
          title: "Text improved!",
          description: "Review the improved version and use it if you like it.",
        });
      } else {
        throw new Error(data.message || 'Failed to improve text');
      }
    } catch (error) {
      console.error('Error improving text:', error);
      toast({
        title: "Error",
        description: "Failed to improve text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Get ATS optimization suggestions
  const getAtsSuggestions = async () => {
    setIsGenerating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/resume-ai/ats-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      const data = await response.json();

      if (data.success && data.suggestions && data.suggestions.length > 0) {
        setAtsSuggestions(data.suggestions);
        toast({
          title: "ATS analysis complete!",
          description: `Found ${data.suggestions.length} suggestion${data.suggestions.length !== 1 ? 's' : ''} to improve your resume.`,
        });
      } else {
        throw new Error(data.message || 'Failed to get ATS suggestions');
      }
    } catch (error) {
      console.error('Error getting ATS suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Get keyword suggestions based on job description
  const getKeywordSuggestions = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Paste a job description to get keyword suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/resume-ai/extract-keywords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: jobDescription,
        }),
      });

      const data = await response.json();

      if (data.success && data.keywords && data.keywords.length > 0) {
        setKeywordSuggestions(data.keywords);
        toast({
          title: "Keywords extracted!",
          description: `Found ${data.keywords.length} relevant keyword${data.keywords.length !== 1 ? 's' : ''}.`,
        });
      } else {
        setKeywordSuggestions(["No specific keywords found. Try a more detailed job description."]);
        toast({
          title: "Keywords extracted!",
          description: "No specific keywords found.",
        });
      }
    } catch (error) {
      console.error('Error extracting keywords:', error);
      toast({
        title: "Error",
        description: "Failed to extract keywords. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Analyze resume and provide feedback
  const analyzeResume = async () => {
    setIsGenerating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/resume-ai/analyze-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      const data = await response.json();

      if (data.success && data.analysis) {
        setResumeAnalysis(data.analysis);
        toast({
          title: "Resume analysis complete!",
          description: `Your resume score: ${data.analysis.overallScore || completionScore()}/100`,
        });
      } else {
        // Fallback to local analysis
        const score = completionScore();
        const analysis = {
          overallScore: score,
          strengths: score >= 80 ? ["Well-structured resume"] : [],
          weaknesses: score < 50 ? ["Needs more content"] : [],
          recommendations: ["Add more details", "Include achievements"]
        };
        setResumeAnalysis(analysis);
        toast({
          title: "Resume analysis complete!",
          description: `Your resume score: ${score}/100`,
        });
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      // Fallback to local analysis
      const score = completionScore();
      const analysis = {
        overallScore: score,
        strengths: score >= 80 ? ["Well-structured resume"] : [],
        weaknesses: score < 50 ? ["Needs more content"] : [],
        recommendations: ["Add more details", "Include achievements"]
      };
      setResumeAnalysis(analysis);
      toast({
        title: "Resume analysis complete!",
        description: `Your resume score: ${score}/100`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const completionScore = () => {
    let score = 0;
    if (resumeData.personalInfo.fullName) score += 10;
    if (resumeData.personalInfo.email) score += 10;
    if (resumeData.personalInfo.title) score += 10;
    if (resumeData.personalInfo.summary) score += 15;
    if (resumeData.experiences.length > 0) score += 20;
    if (resumeData.education.length > 0) score += 10;
    if (resumeData.skills.length >= 5) score += 15;
    if (resumeData.projects.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Professional Resume Builder - CodeAcademy Pro",
    "description": "Create ATS-friendly professional resumes for programming and tech careers. 20 professional templates, AI-powered suggestions, and instant PDF export. Free resume builder for developers, software engineers, and tech professionals.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "featureList": [
      "20 Professional Resume Templates",
      "ATS-Friendly Format",
      "AI-Powered Writing Suggestions",
      "Instant PDF Export",
      "Real-time Preview",
      "Free to Use",
      "No Account Required"
    ],
    "screenshot": `${window.location.origin}/resume-builder`,
    "url": `${window.location.origin}/resume-builder`,
    "author": {
      "@type": "Organization",
      "name": "CodeAcademy Pro"
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title="Free Professional Resume Builder for Tech Careers | ATS-Friendly Templates"
        description="Create professional, ATS-friendly resumes for programming and tech careers. 20 professional templates, AI-powered writing suggestions, instant PDF export. Free resume builder for developers, software engineers, and tech professionals. Build your perfect resume in minutes."
        keywords="resume builder, free resume builder, tech resume, programming resume, ATS resume, developer resume, software engineer resume, professional resume builder, resume templates, ATS friendly resume, tech career resume, programming career, software developer resume, resume builder free, online resume builder, resume maker, CV builder, professional CV, tech CV, developer CV, software engineer CV, resume generator, resume creator, ATS optimized resume, tech resume templates, programming resume templates, developer resume templates"
        image={`${window.location.origin}/hero-banner.jpg`}
        url={`${window.location.origin}/resume-builder`}
        structuredData={structuredData}
      />

      {/* Hidden SEO Content */}
      <div className="sr-only">
        <h1>Free Professional Resume Builder for Tech Careers</h1>
        <p>Create ATS-friendly professional resumes for programming and tech careers with our free online resume builder. Choose from 20 professional resume templates designed specifically for developers, software engineers, and tech professionals. Our resume builder includes AI-powered writing suggestions, real-time preview, and instant PDF export. Build your perfect tech resume in minutes - completely free, no account required.</p>
        <h2>Features</h2>
        <ul>
          <li>20 Professional Resume Templates - Modern, Classic, Minimal, Creative, and more</li>
          <li>ATS-Friendly Format - Optimized for Applicant Tracking Systems</li>
          <li>AI-Powered Writing Suggestions - Get professional resume content suggestions</li>
          <li>Instant PDF Export - Download your resume as PDF instantly</li>
          <li>Real-time Preview - See your resume as you build it</li>
          <li>Free to Use - No account required, completely free resume builder</li>
          <li>Tech Career Focused - Templates designed for developers and software engineers</li>
        </ul>
        <h2>Perfect For</h2>
        <p>Software Developers, Full-Stack Developers, Frontend Developers, Backend Developers, DevOps Engineers, Data Scientists, Machine Learning Engineers, Mobile App Developers, Web Developers, Software Engineers, Tech Professionals, Programming Careers, IT Professionals</p>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
        {/* Header */}
        <motion.header
          className="bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                <BackButton label="Back" className="text-white" to="/" />
              </motion.div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hidden sm:inline-flex">
                  {completionScore()}% Complete
                </Badge>
                <Button
                  onClick={() => {
                    setPreviewTemplate(null);
                    setPreviewSource("current");
                    setShowPreview(true);
                  }}
                  className="bg-indigo-500 hover:bg-indigo-600"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Preview Resume</span>
                  <span className="sm:hidden">Preview</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero */}
        <motion.header
          className="border-b border-white/5 bg-gradient-to-r from-indigo-900/40 via-slate-950 to-purple-900/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="container mx-auto px-6 py-10 text-center">
            <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 border-indigo-500/30" aria-label="20 Professional Resume Templates">
              <FileText className="w-3 h-3 mr-2" />
              20 Professional Templates
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3">
              Professional{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Resume Builder
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Create ATS-friendly resumes with AI suggestions and instant PDF export. Free resume builder for developers, software engineers, and tech professionals.
            </p>
          </div>
        </motion.header>

        <div className="container mx-auto px-0 sm:px-3 md:px-6 py-2 sm:py-4 md:py-8 max-w-full overflow-x-hidden">
          {/* Template Selection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
            aria-label="Resume Template Selection"
          >
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-1">
              <Layout className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" aria-hidden="true" />
              Choose Your Template
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-1.5 md:gap-2 lg:gap-3">
              {(templates.slice(0, showAllTemplates ? undefined : 8)).map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  onPreview={() => {
                    setPreviewTemplate(template.id);
                    // Preview template always uses sample data
                    setPreviewSource("sample");
                    setShowPreview(true);
                  }}
                />
              ))}
            </div>

            {/* View All / Show Less Button */}
            {templates.length > 12 && (
              <div className="flex justify-center mt-4 sm:mt-6">
                <Button
                  onClick={() => setShowAllTemplates(!showAllTemplates)}
                  variant="outline"
                  className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 transition-all text-sm sm:text-base"
                >
                  {showAllTemplates ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less Templates
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      View All {templates.length} Templates
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.section>

          <div className="grid lg:grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="relative mx-0 sm:mx-0">
                  <style>{`
                    .mobile-tab-scroll {
                      scrollbar-width: none;
                      -ms-overflow-style: none;
                    }
                    .mobile-tab-scroll::-webkit-scrollbar {
                      display: none;
                    }
                    .mobile-tab-scroll {
                      scroll-behavior: smooth;
                      -webkit-overflow-scrolling: touch;
                    }
                  `}</style>
                  <TabsList className="flex overflow-x-auto sm:grid sm:grid-cols-5 bg-slate-800/50 border border-white/10 p-1 mobile-tab-scroll w-full">
                    <TabsTrigger value="personal" className="flex-shrink-0 min-w-[75px] sm:min-w-0 data-[state=active]:bg-indigo-500 text-white/70 data-[state=active]:text-white text-[11px] sm:text-xs md:text-sm px-1 sm:px-2 md:px-3 lg:px-4 py-2 sm:py-2">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1" />
                      <span className="whitespace-nowrap">Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex-shrink-0 min-w-[85px] sm:min-w-0 data-[state=active]:bg-indigo-500 text-white/70 data-[state=active]:text-white text-[11px] sm:text-xs md:text-sm px-1 sm:px-2 md:px-3 lg:px-4 py-2 sm:py-2">
                      <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1" />
                      <span className="whitespace-nowrap">Experience</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex-shrink-0 min-w-[80px] sm:min-w-0 data-[state=active]:bg-indigo-500 text-white/70 data-[state=active]:text-white text-[11px] sm:text-xs md:text-sm px-1 sm:px-2 md:px-3 lg:px-4 py-2 sm:py-2">
                      <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1" />
                      <span className="whitespace-nowrap">Education</span>
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex-shrink-0 min-w-[60px] sm:min-w-0 data-[state=active]:bg-indigo-500 text-white/70 data-[state=active]:text-white text-[11px] sm:text-xs md:text-sm px-1 sm:px-2 md:px-3 lg:px-4 py-2 sm:py-2">
                      <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1" />
                      <span className="whitespace-nowrap">Skills</span>
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="flex-shrink-0 min-w-[70px] sm:min-w-0 data-[state=active]:bg-indigo-500 text-white/70 data-[state=active]:text-white text-[11px] sm:text-xs md:text-sm px-1 sm:px-2 md:px-3 lg:px-4 py-2 sm:py-2">
                      <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1" />
                      <span className="whitespace-nowrap">Projects</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Personal Info Tab */}
                <TabsContent value="personal" className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
                  <Card className="bg-slate-900/70 border-white/10 overflow-hidden">
                    <CardHeader className="p-2 sm:p-3 md:p-4 lg:p-6">
                      <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                        <User className="w-5 h-5 text-indigo-400" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 p-2 sm:p-2.5 md:p-3 lg:p-4 xl:p-6 pt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-4">
                        <div className="space-y-2">
                          <Label className="text-white/80">Full Name *</Label>
                          <Input
                            placeholder="John Doe"
                            value={resumeData.personalInfo.fullName}
                            onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                            className="bg-slate-800/50 border-white/20 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/80">Job Title *</Label>
                          <Input
                            placeholder="Senior Software Engineer"
                            value={resumeData.personalInfo.title}
                            onChange={(e) => updatePersonalInfo("title", e.target.value)}
                            className="bg-slate-800/50 border-white/20 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/80">Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              value={resumeData.personalInfo.email}
                              onChange={(e) => updatePersonalInfo("email", e.target.value)}
                              className="pl-10 bg-slate-800/50 border-white/20 text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/80">Phone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                              placeholder="+1 (555) 123-4567"
                              value={resumeData.personalInfo.phone}
                              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                              className="pl-10 bg-slate-800/50 border-white/20 text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/80">Location</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                              placeholder="San Francisco, CA"
                              value={resumeData.personalInfo.location}
                              onChange={(e) => updatePersonalInfo("location", e.target.value)}
                              className="pl-10 bg-slate-800/50 border-white/20 text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/80">LinkedIn</Label>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                              placeholder="linkedin.com/in/johndoe"
                              value={resumeData.personalInfo.linkedin}
                              onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                              className="pl-10 bg-slate-800/50 border-white/20 text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/80">GitHub</Label>
                          <div className="relative">
                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                              placeholder="github.com/johndoe"
                              value={resumeData.personalInfo.github}
                              onChange={(e) => updatePersonalInfo("github", e.target.value)}
                              className="pl-10 bg-slate-800/50 border-white/20 text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/80">Portfolio</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                              placeholder="johndoe.dev"
                              value={resumeData.personalInfo.portfolio}
                              onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
                              className="pl-10 bg-slate-800/50 border-white/20 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Photo Upload Section */}
                      <div className="border-t border-white/10 pt-4 sm:pt-6 mt-4">
                        <Label className="text-white/80 text-lg font-semibold mb-4 block">Profile Photo (Optional)</Label>
                        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                          {/* Photo Preview */}
                          <div className="flex-shrink-0">
                            {resumeData.personalInfo.photo ? (
                              <div className="relative">
                                <img
                                  src={resumeData.personalInfo.photo}
                                  alt="Profile"
                                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500/30"
                                />
                                <button
                                  onClick={() => updatePersonalInfo("photo", "")}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => photoInputRef.current?.click()}
                                className="w-32 h-32 rounded-full bg-slate-800/50 border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-colors"
                              >
                                <div className="text-center">
                                  <User className="w-8 h-8 text-white/40 mx-auto mb-1" />
                                  <span className="text-xs text-white/40">Add Photo</span>
                                </div>
                              </div>
                            )}
                            <input
                              ref={photoInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </div>

                          {/* Photo Options */}
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label className="text-white/80">Photo Position on Resume</Label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { value: "left", label: "📷 Left Side" },
                                  { value: "right", label: "📷 Right Side" },
                                  { value: "none", label: "❌ No Photo" }
                                ].map((option) => (
                                  <Button
                                    key={option.value}
                                    variant={resumeData.personalInfo.photoPosition === option.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updatePersonalInfo("photoPosition", option.value)}
                                    className={resumeData.personalInfo.photoPosition === option.value
                                      ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                                      : "border-white/30 text-white bg-slate-700/50 hover:bg-slate-600/50"
                                    }
                                  >
                                    {option.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            {!resumeData.personalInfo.photo && (
                              <Button
                                variant="outline"
                                onClick={() => photoInputRef.current?.click()}
                                className="border-white/20 text-white/70 hover:text-white"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Upload Photo
                              </Button>
                            )}
                            <p className="text-xs text-white/40">
                              Recommended: Square image, at least 200x200px, max 5MB
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/80">Professional Summary</Label>
                        <Textarea
                          rows={4}
                          placeholder="A brief summary of your professional background..."
                          value={resumeData.personalInfo.summary}
                          onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                          className="bg-slate-800/50 border-white/20 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="mt-6">
                  <Card className="bg-slate-900/70 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-indigo-400" />
                          Work Experience
                        </CardTitle>
                        <Button onClick={addExperience} className="bg-indigo-500 hover:bg-indigo-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <AnimatePresence>
                        {resumeData.experiences.map((exp, index) => (
                          <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 border border-white/10 rounded-lg bg-slate-800/30 space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">Experience #{index + 1}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExperience(exp.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <Input
                                placeholder="Company Name"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                className="bg-slate-800/50 border-white/20 text-white"
                              />
                              <Input
                                placeholder="Job Title"
                                value={exp.role}
                                onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                                className="bg-slate-800/50 border-white/20 text-white"
                              />
                              <div className="space-y-1">
                                <Label className="text-white/60 text-xs">Start Date</Label>
                                <Input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                  className="bg-slate-800/50 border-white/20 text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-white/60 text-xs">End Date</Label>
                                <Input
                                  type="month"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                  disabled={exp.current}
                                  className="bg-slate-800/50 border-white/20 text-white disabled:opacity-50"
                                  placeholder={exp.current ? "Present" : ""}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                                className="rounded"
                              />
                              <Label className="text-white/70 text-sm">Currently working here</Label>
                            </div>
                            <Textarea
                              placeholder="Describe your responsibilities..."
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                              className="bg-slate-800/50 border-white/20 text-white"
                              rows={2}
                            />
                            <div className="space-y-2">
                              <Label className="text-white/80 text-sm">Key Achievements</Label>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add achievement..."
                                  value={newAchievement[exp.id] || ""}
                                  onChange={(e) => setNewAchievement(prev => ({ ...prev, [exp.id]: e.target.value }))}
                                  onKeyDown={(e) => e.key === "Enter" && addAchievementToExperience(exp.id)}
                                  className="bg-slate-800/50 border-white/20 text-white"
                                />
                                <Button
                                  onClick={() => addAchievementToExperience(exp.id)}
                                  className="bg-indigo-500 hover:bg-indigo-600"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              {exp.achievements.map((a, i) => (
                                <div key={i} className="flex items-center gap-2 text-white/70 text-sm bg-slate-800/30 p-2 rounded">
                                  <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                  <span className="flex-1">{a}</span>
                                  <button onClick={() => removeAchievement(exp.id, i)} className="text-red-400 hover:text-red-300">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {resumeData.experiences.length === 0 && (
                        <div className="text-center py-8 text-white/50">
                          No experience added. Click "Add" to get started.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="mt-6">
                  <Card className="bg-slate-900/70 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-indigo-400" />
                          Education
                        </CardTitle>
                        <Button onClick={addEducation} className="bg-indigo-500 hover:bg-indigo-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <AnimatePresence>
                        {resumeData.education.map((edu, index) => (
                          <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 border border-white/10 rounded-lg bg-slate-800/30 space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">Education #{index + 1}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEducation(edu.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <Input
                                placeholder="Institution"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                                className="bg-slate-800/50 border-white/20 text-white"
                              />
                              <Input
                                placeholder="Degree (e.g., Bachelor's)"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                className="bg-slate-800/50 border-white/20 text-white"
                              />
                              <Input
                                placeholder="Field of Study"
                                value={edu.field}
                                onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                                className="bg-slate-800/50 border-white/20 text-white"
                              />
                              <Input
                                placeholder="GPA (optional)"
                                value={edu.gpa}
                                onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                                className="bg-slate-800/50 border-white/20 text-white"
                              />
                              <div className="space-y-1">
                                <Label className="text-white/60 text-xs">Start Date</Label>
                                <Input
                                  type="month"
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                  className="bg-slate-800/50 border-white/20 text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-white/60 text-xs">End Date / Expected</Label>
                                <Input
                                  type="month"
                                  value={edu.endDate}
                                  onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                  className="bg-slate-800/50 border-white/20 text-white"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {resumeData.education.length === 0 && (
                        <div className="text-center py-8 text-white/50">
                          No education added. Click "Add" to get started.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills" className="mt-6 space-y-6">
                  <Card className="bg-slate-900/70 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Code className="w-5 h-5 text-indigo-400" />
                        Technical Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addSkill(newSkill)}
                          className="bg-slate-800/50 border-white/20 text-white"
                        />
                        <Button onClick={() => addSkill(newSkill)} className="bg-indigo-500 hover:bg-indigo-600">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {resumeData.skills.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-white/80">Your Skills</Label>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill) => (
                              <Badge
                                key={skill}
                                className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 cursor-pointer hover:bg-red-500/20 hover:text-red-300"
                                onClick={() => removeSkill(skill)}
                              >
                                {skill} ×
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-white/80">Suggestions (click to add)</Label>
                        <div className="flex flex-wrap gap-2">
                          {skillSuggestions.filter(s => !resumeData.skills.includes(s)).slice(0, 12).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="border-white/20 text-white/60 cursor-pointer hover:bg-indigo-500/20 hover:text-indigo-300"
                              onClick={() => addSkill(skill)}
                            >
                              + {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Certifications & Languages */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="bg-slate-900/70 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Certifications</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add certification..."
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addCertification()}
                            className="bg-slate-800/50 border-white/20 text-white"
                          />
                          <Button onClick={addCertification} className="bg-indigo-500 hover:bg-indigo-600">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {resumeData.certifications.map((cert) => (
                          <div key={cert} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                            <span className="text-white/80 text-sm flex items-center gap-2">
                              <Award className="w-4 h-4 text-indigo-400" />
                              {cert}
                            </span>
                            <button onClick={() => removeCertification(cert)} className="text-red-400 hover:text-red-300">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/70 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Languages</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add language..."
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addLanguage()}
                            className="bg-slate-800/50 border-white/20 text-white"
                          />
                          <Button onClick={addLanguage} className="bg-indigo-500 hover:bg-indigo-600">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.languages.map((lang) => (
                            <Badge
                              key={lang}
                              className="bg-purple-500/20 text-purple-300 border-purple-500/30 cursor-pointer hover:bg-red-500/20 hover:text-red-300"
                              onClick={() => removeLanguage(lang)}
                            >
                              {lang} ×
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="mt-6">
                  <Card className="bg-slate-900/70 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Award className="w-5 h-5 text-indigo-400" />
                          Projects
                        </CardTitle>
                        <Button onClick={addProject} className="bg-indigo-500 hover:bg-indigo-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <AnimatePresence>
                        {resumeData.projects.map((proj, index) => (
                          <motion.div
                            key={proj.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 border border-white/10 rounded-lg bg-slate-800/30 space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">Project #{index + 1}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProject(proj.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <Input
                                placeholder="Project Name"
                                value={proj.name}
                                onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                                className="bg-slate-800/50 border-white/20 text-white"
                              />
                              <Input
                                placeholder="Technologies (comma separated)"
                                value={proj.technologies.join(", ")}
                                onChange={(e) => updateProject(proj.id, "technologies", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                                className="bg-slate-800/50 border-white/20 text-white"
                              />
                              <Input
                                placeholder="Project URL"
                                value={proj.link}
                                onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                                className="bg-slate-800/50 border-white/20 text-white sm:col-span-2"
                              />
                            </div>
                            <Textarea
                              placeholder="Describe your project..."
                              value={proj.description}
                              onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                              className="bg-slate-800/50 border-white/20 text-white"
                              rows={2}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {resumeData.projects.length === 0 && (
                        <div className="text-center py-8 text-white/50">
                          No projects added. Click "Add" to get started.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
              {/* AI Assistant */}
              <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    AI Resume Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AI Feature Tabs */}
                  <Tabs value={aiFeature} onValueChange={(v) => setAiFeature(v as any)} className="w-full">
                    <TabsList className="grid grid-cols-3 sm:grid-cols-3 bg-slate-900/50 border border-white/10 p-1 h-auto gap-1">
                      <style>{`
                        .ai-tab-trigger {
                          font-size: 0.7rem;
                          padding: 0.375rem 0.25rem;
                          white-space: nowrap;
                          overflow: hidden;
                          text-overflow: ellipsis;
                        }
                        @media (min-width: 640px) {
                          .ai-tab-trigger {
                            font-size: 0.75rem;
                            padding: 0.375rem 0.5rem;
                          }
                        }
                      `}</style>
                      <TabsTrigger value="suggestions" className="ai-tab-trigger data-[state=active]:bg-indigo-500 text-white/70 data-[state=active]:text-white">
                        Ideas
                      </TabsTrigger>
                      <TabsTrigger value="summary" className="ai-tab-trigger data-[state=active]:bg-indigo-500 text-white/70 data-[state=active]:text-white">
                        Summary
                      </TabsTrigger>
                      <TabsTrigger value="improve" className="ai-tab-trigger data-[state=active]:bg-indigo-500 text-white/70 data-[state=active]:text-white">
                        Improve
                      </TabsTrigger>
                      <TabsTrigger value="ats" className="ai-tab-trigger data-[state=active]:bg-indigo-500 text-white/70 data-[state=active]:text-white">
                        ATS
                      </TabsTrigger>
                      <TabsTrigger value="keywords" className="ai-tab-trigger data-[state=active]:bg-indigo-500 text-white/70 data-[state=active]:text-white">
                        Keywords
                      </TabsTrigger>
                      <TabsTrigger value="analyze" className="ai-tab-trigger data-[state=active]:bg-indigo-500 text-white/70 data-[state=active]:text-white">
                        Analyze
                      </TabsTrigger>
                    </TabsList>

                    {/* Achievement Suggestions */}
                    <TabsContent value="suggestions" className="mt-4 space-y-3">
                      <div className="p-3 bg-slate-900/50 rounded-lg border border-white/10 min-h-[80px]">
                        <p className="text-white/80 text-sm italic">"{currentAiSuggestion}"</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateAiSuggestion}
                          disabled={isGenerating}
                          className="flex-1 border-white/30 text-white bg-indigo-600/30 hover:bg-indigo-600/50"
                        >
                          {isGenerating ? "Generating..." : <><Sparkles className="w-4 h-4 mr-1" /> New Idea</>}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(currentAiSuggestion);
                            toast({ title: "Copied!", description: "Paste it into your experience section." });
                          }}
                          className="border-white/30 text-white bg-slate-600/30 hover:bg-slate-600/50"
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-white/50 text-xs">Click "New Idea" for AI-generated achievement statements</p>
                    </TabsContent>

                    {/* Professional Summary Generator */}
                    <TabsContent value="summary" className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white/80 text-sm">Generate Professional Summary</Label>
                        <p className="text-white/50 text-xs">AI will create a summary based on your resume data</p>
                      </div>
                      {aiSummary && (
                        <div className="p-3 bg-slate-900/50 rounded-lg border border-white/10">
                          <p className="text-white/80 text-sm">{aiSummary}</p>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateProfessionalSummary}
                        disabled={isGenerating}
                        className="w-full border-white/30 text-white bg-indigo-600/30 hover:bg-indigo-600/50"
                      >
                        {isGenerating ? "Generating..." : <><Sparkles className="w-4 h-4 mr-1" /> Generate Summary</>}
                      </Button>
                      {aiSummary && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              updatePersonalInfo("summary", aiSummary);
                              toast({ title: "Summary added!", description: "Professional summary has been added to your resume." });
                            }}
                            className="flex-1 border-white/30 text-white bg-green-600/30 hover:bg-green-600/50"
                          >
                            Use This
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(aiSummary);
                              toast({ title: "Copied!" });
                            }}
                            className="border-white/30 text-white bg-slate-600/30 hover:bg-slate-600/50"
                          >
                            Copy
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    {/* Text Improvement */}
                    <TabsContent value="improve" className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white/80 text-sm">Improve Your Text</Label>
                        <Textarea
                          placeholder="Paste a bullet point or description to improve..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className="bg-slate-800/50 border-white/20 text-white text-sm min-h-[80px]"
                          rows={3}
                        />
                      </div>
                      {aiImprovedText && (
                        <div className="p-3 bg-slate-900/50 rounded-lg border border-green-500/30">
                          <p className="text-white/80 text-sm">{aiImprovedText}</p>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={improveText}
                        disabled={isGenerating || !inputText.trim()}
                        className="w-full border-white/30 text-white bg-indigo-600/30 hover:bg-indigo-600/50"
                      >
                        {isGenerating ? "Improving..." : <><Sparkles className="w-4 h-4 mr-1" /> Improve Text</>}
                      </Button>
                      {aiImprovedText && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setInputText(aiImprovedText);
                              toast({ title: "Text updated!", description: "Replace the original text with the improved version." });
                            }}
                            className="flex-1 border-white/30 text-white bg-green-600/30 hover:bg-green-600/50"
                          >
                            Use This
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(aiImprovedText);
                              toast({ title: "Copied!" });
                            }}
                            className="border-white/30 text-white bg-slate-600/30 hover:bg-slate-600/50"
                          >
                            Copy
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    {/* ATS Optimization */}
                    <TabsContent value="ats" className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white/80 text-sm">ATS Optimization Check</Label>
                        <p className="text-white/50 text-xs">Get suggestions to make your resume ATS-friendly</p>
                      </div>
                      {atsSuggestions.length > 0 && (
                        <div className="p-3 bg-slate-900/50 rounded-lg border border-white/10 max-h-[200px] overflow-y-auto">
                          <ul className="space-y-2">
                            {atsSuggestions.map((suggestion, i) => (
                              <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={getAtsSuggestions}
                        disabled={isGenerating}
                        className="w-full border-white/30 text-white bg-indigo-600/30 hover:bg-indigo-600/50"
                      >
                        {isGenerating ? "Analyzing..." : <><Sparkles className="w-4 h-4 mr-1" /> Check ATS Compatibility</>}
                      </Button>
                    </TabsContent>

                    {/* Keyword Suggestions */}
                    <TabsContent value="keywords" className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white/80 text-sm">Extract Keywords from Job Description</Label>
                        <Textarea
                          placeholder="Paste the job description here..."
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          className="bg-slate-800/50 border-white/20 text-white text-sm min-h-[100px]"
                          rows={4}
                        />
                      </div>
                      {keywordSuggestions.length > 0 && (
                        <div className="p-3 bg-slate-900/50 rounded-lg border border-white/10">
                          <p className="text-white/80 text-sm mb-2 font-semibold">Suggested Keywords:</p>
                          <div className="flex flex-wrap gap-2">
                            {keywordSuggestions.map((keyword, i) => (
                              <Badge
                                key={i}
                                className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 cursor-pointer hover:bg-indigo-500/30"
                                onClick={() => {
                                  if (!resumeData.skills.includes(keyword)) {
                                    addSkill(keyword);
                                    toast({ title: "Keyword added!", description: `${keyword} added to skills.` });
                                  }
                                }}
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={getKeywordSuggestions}
                        disabled={isGenerating || !jobDescription.trim()}
                        className="w-full border-white/30 text-white bg-indigo-600/30 hover:bg-indigo-600/50"
                      >
                        {isGenerating ? "Extracting..." : <><Sparkles className="w-4 h-4 mr-1" /> Extract Keywords</>}
                      </Button>
                    </TabsContent>

                    {/* Resume Analysis */}
                    <TabsContent value="analyze" className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white/80 text-sm">Resume Analysis</Label>
                        <p className="text-white/50 text-xs">Get comprehensive feedback on your resume</p>
                      </div>
                      {resumeAnalysis && (
                        <div className="p-3 bg-slate-900/50 rounded-lg border border-white/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-white/80 text-sm font-semibold">Overall Score:</span>
                            <Badge className={`${resumeAnalysis.overallScore >= 70 ? "bg-green-500/20 text-green-300" : resumeAnalysis.overallScore >= 50 ? "bg-yellow-500/20 text-yellow-300" : "bg-red-500/20 text-red-300"}`}>
                              {resumeAnalysis.overallScore}/100
                            </Badge>
                          </div>
                          {resumeAnalysis.strengths.length > 0 && (
                            <div>
                              <p className="text-green-400 text-xs font-semibold mb-1">Strengths:</p>
                              <ul className="space-y-1">
                                {resumeAnalysis.strengths.map((strength: string, i: number) => (
                                  <li key={i} className="text-white/70 text-xs flex items-start gap-2">
                                    <span className="text-green-400 mt-0.5">✓</span>
                                    <span>{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {resumeAnalysis.weaknesses.length > 0 && (
                            <div>
                              <p className="text-yellow-400 text-xs font-semibold mb-1">Areas to Improve:</p>
                              <ul className="space-y-1">
                                {resumeAnalysis.weaknesses.map((weakness: string, i: number) => (
                                  <li key={i} className="text-white/70 text-xs flex items-start gap-2">
                                    <span className="text-yellow-400 mt-0.5">!</span>
                                    <span>{weakness}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {resumeAnalysis.recommendations.length > 0 && (
                            <div>
                              <p className="text-indigo-400 text-xs font-semibold mb-1">Recommendations:</p>
                              <ul className="space-y-1">
                                {resumeAnalysis.recommendations.map((rec: string, i: number) => (
                                  <li key={i} className="text-white/70 text-xs flex items-start gap-2">
                                    <span className="text-indigo-400 mt-0.5">→</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={analyzeResume}
                        disabled={isGenerating}
                        className="w-full border-white/30 text-white bg-indigo-600/30 hover:bg-indigo-600/50"
                      >
                        {isGenerating ? "Analyzing..." : <><Sparkles className="w-4 h-4 mr-1" /> Analyze Resume</>}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Export */}
              <Card className="bg-slate-900/70 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Download className="w-5 h-5 text-indigo-400" />
                    Export Resume
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => {
                      setPreviewTemplate(null);
                      setPreviewSource("current");
                      setShowPreview(true);
                    }}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white h-auto py-3 whitespace-normal"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview & Download PDF
                  </Button>
                  <Button
                    onClick={() => {
                      const dataStr = JSON.stringify(resumeData, null, 2);
                      const blob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${resumeData.personalInfo.fullName || 'resume'}.json`;
                      a.click();
                      toast({ title: "Saved!", description: "Resume data saved as JSON" });
                    }}
                    variant="outline"
                    className="w-full border-white/30 text-white bg-slate-700/50 hover:bg-slate-600/50 h-auto py-3 whitespace-normal"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    💾 Save as JSON (Backup)
                  </Button>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-slate-900/70 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">💡 Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-white/70">
                  <p>• Use action verbs: "Developed", "Led", "Optimized"</p>
                  <p>• Include metrics when possible</p>
                  <p>• Keep it to 1-2 pages</p>
                  <p>• Tailor for each job application</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <ResumePreview
              data={previewSource === "sample" ? sampleResumeData : resumeData}
              template={previewTemplate || selectedTemplate}
              onClose={() => {
                setShowPreview(false);
                setPreviewTemplate(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ResumeBuilder;
