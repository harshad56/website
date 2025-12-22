import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
import { apiService } from "@/services/ApiService";
import { ShareDialog } from "@/components/ShareDialog";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Users,
  Star,
  Bookmark,
  Share2,
  Send,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Globe,
  Smartphone,
  Brain,
  Cloud,
  Code,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone,
  ExternalLink,
  FileText
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  experience: 'entry' | 'junior' | 'mid' | 'senior' | 'lead';
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: Date;
  applications: number;
  isRemote: boolean;
  isFeatured: boolean;
  category: string;
  logo?: string;
  contact: {
    email: string;
    phone?: string;
    /**
     * Company careers page or external application URL.
     * Admin can paste a Google Form link or job post link here.
     */
    website?: string;
  };
  /**
   * Whether the job is currently active.
   * Provided for admin views; public API only returns active jobs.
   */
  is_active?: boolean;
  /**
   * Optional direct application URL if added later.
   */
  applyUrl?: string | null;
}

const JobBoard = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeDomains, setResumeDomains] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedJobForShare, setSelectedJobForShare] = useState<Job | null>(null);

  // Load jobs from backend
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const res = await apiService.getJobs();
        if (res.success && res.data) {
          const jobsData = Array.isArray(res.data) ? res.data : [];
          // Ensure postedDate is a Date object
          const processedJobs = jobsData.map((job: any) => ({
            ...job,
            postedDate: job.postedDate instanceof Date
              ? job.postedDate
              : job.postedDate
                ? new Date(job.postedDate)
                : new Date(),
          }));
          setJobs(processedJobs);
          setFilteredJobs(processedJobs);
        } else {
          throw new Error(res.message || 'Failed to load jobs');
        }
      } catch (err: any) {
        console.error('Error loading jobs:', err);
        toast({
          title: 'Error',
          description: err.message || 'Failed to load jobs',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [toast]);

  // Load saved jobs and applications if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadUserData = async () => {
      try {
        const [savedRes, applicationsRes] = await Promise.all([
          apiService.getSavedJobs(),
          apiService.getUserJobApplications()
        ]);

        if (savedRes.success && savedRes.data) {
          const savedIds = savedRes.data.map((item: any) => item.job_id || item.jobs?.id).filter(Boolean);
          setSavedJobs(savedIds);
        }

        if (applicationsRes.success && applicationsRes.data) {
          const appliedIds = applicationsRes.data.map((app: any) => app.job_id || app.jobs?.id).filter(Boolean);
          setAppliedJobs(appliedIds);
        }
      } catch (err: any) {
        console.error('Error loading user job data:', err);
      }
    };

    loadUserData();
  }, [isAuthenticated]);

  // Mock job data (fallback)
  const mockJobs: Job[] = [
    {
      id: "1",
      title: "Senior Java Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      type: "full-time",
      salary: { min: 120000, max: 180000, currency: "USD" },
      experience: "senior",
      skills: ["Java", "Spring Boot", "Microservices", "AWS", "Docker", "Kubernetes"],
      description: "We're looking for a Senior Java Developer to join our growing team. You'll be responsible for designing and implementing scalable backend services.",
      requirements: [
        "5+ years of Java development experience",
        "Strong knowledge of Spring Boot and microservices",
        "Experience with cloud platforms (AWS/Azure/GCP)",
        "Knowledge of containerization and orchestration",
        "Excellent problem-solving skills"
      ],
      benefits: [
        "Competitive salary and equity",
        "Health, dental, and vision insurance",
        "Flexible work arrangements",
        "Professional development budget",
        "401(k) matching"
      ],
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      applications: 45,
      isRemote: true,
      isFeatured: true,
      category: "Backend Development",
      contact: {
        email: "careers@techcorp.com",
        phone: "+1-555-0123",
        website: "https://techcorp.com"
      }
    },
    {
      id: "2",
      title: "Frontend React Developer",
      company: "InnovateWeb",
      location: "New York, NY",
      type: "full-time",
      salary: { min: 90000, max: 140000, currency: "USD" },
      experience: "mid",
      skills: ["React", "TypeScript", "Redux", "CSS3", "HTML5", "JavaScript"],
      description: "Join our frontend team to build beautiful, responsive web applications. We're looking for someone passionate about user experience and modern web technologies.",
      requirements: [
        "3+ years of React development experience",
        "Proficiency in TypeScript and modern JavaScript",
        "Experience with state management (Redux/Context)",
        "Strong CSS skills and responsive design",
        "Knowledge of web accessibility standards"
      ],
      benefits: [
        "Competitive salary",
        "Remote work options",
        "Flexible hours",
        "Learning and development opportunities",
        "Team events and activities"
      ],
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      applications: 32,
      isRemote: true,
      isFeatured: false,
      category: "Frontend Development",
      contact: {
        email: "jobs@innovateweb.com",
        website: "https://innovateweb.com"
      }
    },
    {
      id: "3",
      title: "Data Scientist",
      company: "DataFlow Analytics",
      location: "Austin, TX",
      type: "full-time",
      salary: { min: 110000, max: 160000, currency: "USD" },
      experience: "senior",
      skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "SQL", "Statistics"],
      description: "Help us build cutting-edge machine learning models and data-driven solutions. You'll work with large datasets and develop predictive analytics.",
      requirements: [
        "5+ years of data science experience",
        "Strong Python programming skills",
        "Experience with ML frameworks (TensorFlow/PyTorch)",
        "Knowledge of statistical analysis and modeling",
        "Experience with big data technologies"
      ],
      benefits: [
        "Competitive salary and benefits",
        "Cutting-edge technology stack",
        "Conference attendance and training",
        "Flexible work environment",
        "Health and wellness programs"
      ],
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      applications: 28,
      isRemote: false,
      isFeatured: true,
      category: "Data Science",
      contact: {
        email: "careers@dataflow.com",
        phone: "+1-555-0456"
      }
    },
    {
      id: "4",
      title: "Mobile App Developer (React Native)",
      company: "MobileFirst Inc",
      location: "Seattle, WA",
      type: "full-time",
      salary: { min: 95000, max: 150000, currency: "USD" },
      experience: "mid",
      skills: ["React Native", "JavaScript", "iOS", "Android", "Firebase", "Redux"],
      description: "Build cross-platform mobile applications that millions of users love. Join our mobile team and help shape the future of mobile development.",
      requirements: [
        "3+ years of mobile development experience",
        "Strong React Native skills",
        "Experience with iOS and Android platforms",
        "Knowledge of mobile app architecture",
        "Experience with app store deployment"
      ],
      benefits: [
        "Competitive salary and equity",
        "Latest mobile devices and tools",
        "App store revenue sharing",
        "Flexible work schedule",
        "Health and dental coverage"
      ],
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      applications: 38,
      isRemote: true,
      isFeatured: false,
      category: "Mobile Development",
      contact: {
        email: "jobs@mobilefirst.com",
        website: "https://mobilefirst.com"
      }
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "CloudScale Systems",
      location: "Denver, CO",
      type: "full-time",
      salary: { min: 100000, max: 160000, currency: "USD" },
      experience: "senior",
      skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins", "Linux"],
      description: "Help us build and maintain scalable infrastructure. You'll work with cutting-edge cloud technologies and automation tools.",
      requirements: [
        "5+ years of DevOps experience",
        "Strong knowledge of containerization and orchestration",
        "Experience with major cloud providers",
        "Knowledge of CI/CD pipelines",
        "Linux system administration skills"
      ],
      benefits: [
        "Competitive salary and benefits",
        "Latest cloud certifications",
        "Home office setup allowance",
        "Flexible work hours",
        "Professional development budget"
      ],
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      applications: 22,
      isRemote: true,
      isFeatured: true,
      category: "DevOps",
      contact: {
        email: "careers@cloudscale.com",
        phone: "+1-555-0789"
      }
    },
    {
      id: "6",
      title: "Junior Python Developer",
      company: "StartupXYZ",
      location: "Remote",
      type: "full-time",
      salary: { min: 60000, max: 85000, currency: "USD" },
      experience: "entry",
      skills: ["Python", "Django", "PostgreSQL", "Git", "REST APIs", "Testing"],
      description: "Perfect opportunity for a junior developer to grow their skills in a fast-paced startup environment. Learn from experienced developers.",
      requirements: [
        "1+ years of Python development experience",
        "Knowledge of web frameworks (Django/Flask)",
        "Basic understanding of databases",
        "Strong problem-solving skills",
        "Eagerness to learn and grow"
      ],
      benefits: [
        "Competitive entry-level salary",
        "Mentorship program",
        "Flexible work hours",
        "Stock options",
        "Learning budget"
      ],
      postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      applications: 67,
      isRemote: true,
      isFeatured: false,
      category: "Backend Development",
      contact: {
        email: "jobs@startupxyz.com",
        website: "https://startupxyz.com"
      }
    },
    {
      id: "7",
      title: "Game Developer (Unity)",
      company: "GameStudio Pro",
      location: "Los Angeles, CA",
      type: "full-time",
      salary: { min: 80000, max: 130000, currency: "USD" },
      experience: "mid",
      skills: ["Unity", "C#", "Game Development", "3D Graphics", "Physics", "Animation"],
      description: "Create amazing gaming experiences! Join our team of passionate game developers and bring your creative ideas to life.",
      requirements: [
        "3+ years of Unity development experience",
        "Strong C# programming skills",
        "Experience with 3D graphics and physics",
        "Knowledge of game development principles",
        "Portfolio of completed projects"
      ],
      benefits: [
        "Competitive salary and royalties",
        "Latest gaming hardware",
        "Creative freedom",
        "Health and wellness benefits",
        "Game industry networking"
      ],
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      applications: 41,
      isRemote: false,
      isFeatured: false,
      category: "Game Development",
      contact: {
        email: "careers@gamestudio.com",
        phone: "+1-555-0321"
      }
    },
    {
      id: "8",
      title: "Full Stack Developer",
      company: "Digital Solutions",
      location: "Chicago, IL",
      type: "contract",
      salary: { min: 80000, max: 120000, currency: "USD" },
      experience: "mid",
      skills: ["JavaScript", "Node.js", "React", "MongoDB", "AWS", "Docker"],
      description: "Join our team as a full stack developer. Work on exciting projects using modern technologies and best practices.",
      requirements: [
        "3+ years of full stack development",
        "Proficiency in JavaScript and Node.js",
        "Experience with React and modern frontend",
        "Knowledge of NoSQL databases",
        "Experience with cloud platforms"
      ],
      benefits: [
        "Competitive contract rates",
        "Flexible project assignments",
        "Remote work options",
        "Professional development",
        "Networking opportunities"
      ],
      postedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      applications: 29,
      isRemote: true,
      isFeatured: false,
      category: "Full Stack Development",
      contact: {
        email: "contracts@digitalsolutions.com",
        website: "https://digitalsolutions.com"
      }
    }
  ];

  useEffect(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Filter by experience
    if (selectedExperience !== "all") {
      filtered = filtered.filter(job => job.experience === selectedExperience);
    }

    // Filter by job type
    if (selectedType !== "all") {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    // Filter by location
    if (selectedLocation !== "all") {
      if (selectedLocation === "remote") {
        filtered = filtered.filter(job => job.isRemote || job.location?.toLowerCase().includes('remote'));
      } else {
        filtered = filtered.filter(job => job.location === selectedLocation || job.location?.includes(selectedLocation));
      }
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedCategory, selectedExperience, selectedType, selectedLocation]);

  const handleSaveJob = async (jobId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to save jobs.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (savedJobs.includes(jobId)) {
        await apiService.unsaveJob(jobId);
        setSavedJobs(savedJobs.filter(id => id !== jobId));
        toast({
          title: "Job removed from saved",
          description: "The job has been removed from your saved jobs.",
        });
      } else {
        await apiService.saveJob(jobId);
        setSavedJobs([...savedJobs, jobId]);
        toast({
          title: "Job saved",
          description: "The job has been added to your saved jobs.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save/unsave job",
        variant: "destructive",
      });
    }
  };

  const handleApplyJob = async (job: Job) => {
    // If an external application link is provided, redirect there
    const externalUrl = job.applyUrl || job.contact?.website;
    if (externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for jobs.",
        variant: "destructive",
      });
      return;
    }

    if (appliedJobs.includes(job.id)) {
      toast({
        title: "Already applied",
        description: "You have already applied for this position.",
      });
      return;
    }

    try {
      const res = await apiService.applyForJob(job.id, {
        cover_letter: "",
        resume_url: null,
      });

      if (res.success) {
        setAppliedJobs([...appliedJobs, job.id]);
        toast({
          title: "Application submitted",
          description: "Your application has been submitted successfully!",
        });
      } else {
        throw new Error(res.message || "Failed to apply");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`;
  };

  const getExperienceLabel = (experience: string) => {
    const labels = {
      entry: "Entry Level",
      junior: "Junior",
      mid: "Mid Level",
      senior: "Senior",
      lead: "Lead"
    };
    return labels[experience as keyof typeof labels] || experience;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Build dynamic category and location lists based on jobs from admin/backend
  const categories = [
    { id: "all", label: "All Categories", icon: Briefcase },
    ...Array.from(
      new Set(
        jobs
          .map((j) => j.category)
          .filter((c): c is string => !!c && c.trim().length > 0)
      )
    ).map((cat) => ({
      id: cat,
      label: cat,
      icon: Code,
    })),
  ];

  const locations = [
    "all",
    ...Array.from(
      new Set(
        jobs
          .map((j) => j.location)
          .filter((l): l is string => !!l && l.trim().length > 0)
      )
    ),
  ];

  const getFilteredJobsByTab = () => {
    switch (activeTab) {
      case "featured":
        return filteredJobs.filter(job => job.isFeatured);
      case "remote":
        return filteredJobs.filter(job => job.isRemote);
      case "saved":
        return filteredJobs.filter(job => savedJobs.includes(job.id));
      case "recommended":
        return recommendedJobs;
      case "applied":
        return filteredJobs.filter(job => appliedJobs.includes(job.id));
      default:
        return filteredJobs;
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Job Board - Programming & Tech Jobs',
    description: 'Find your dream job in programming and technology. Browse thousands of opportunities from top companies worldwide.',
    url: `${window.location.origin}/jobs`,
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 10).map((job, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'JobPosting',
        title: job.title,
        description: job.description,
        hiringOrganization: {
          '@type': 'Organization',
          name: job.company,
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.location,
          },
        },
        employmentType: job.type,
        baseSalary: job.salary?.min > 0 ? {
          '@type': 'MonetaryAmount',
          currency: job.salary.currency,
          value: {
            '@type': 'QuantitativeValue',
            minValue: job.salary.min,
            maxValue: job.salary.max,
          },
        } : undefined,
        url: `${window.location.origin}/jobs/${job.id}`,
      },
    })),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-930 to-slate-950 text-white">
      <SEO
        title="Job Board - Programming & Tech Jobs | CodeAcademy Pro"
        description="Find your dream job in programming and technology. Browse thousands of opportunities from top companies worldwide. Full-time, part-time, contract, and internship positions available."
        keywords="programming jobs, tech jobs, software developer jobs, web developer jobs, software engineer jobs, IT jobs, remote jobs, programming careers, tech careers, developer jobs, coding jobs"
        image={`${window.location.origin}/og-jobs.jpg`}
        structuredData={structuredData}
      />

      {/* Header with Back Button */}
      <header className="bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-white/5 bg-gradient-to-r from-blue-900/60 via-slate-950 to-indigo-900/50">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-blue-300 mb-4">
              <Briefcase className="w-3 h-3" />
              Career Opportunities
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Find Your Dream{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Tech Job
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Discover thousands of programming and technology opportunities from top companies worldwide.
              Full-time, part-time, contract, and internship positions available.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Verified Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Remote Opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Career Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-gray-500 h-11"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <SelectItem key={category.id} value={category.id} className="text-white hover:bg-white/10">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white w-[140px]">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-white/10">All Levels</SelectItem>
                  <SelectItem value="entry" className="text-white hover:bg-white/10">Entry Level</SelectItem>
                  <SelectItem value="junior" className="text-white hover:bg-white/10">Junior</SelectItem>
                  <SelectItem value="mid" className="text-white hover:bg-white/10">Mid Level</SelectItem>
                  <SelectItem value="senior" className="text-white hover:bg-white/10">Senior</SelectItem>
                  <SelectItem value="lead" className="text-white hover:bg-white/10">Lead</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white w-[140px]">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-white/10">All Types</SelectItem>
                  <SelectItem value="full-time" className="text-white hover:bg-white/10">Full Time</SelectItem>
                  <SelectItem value="part-time" className="text-white hover:bg-white/10">Part Time</SelectItem>
                  <SelectItem value="contract" className="text-white hover:bg-white/10">Contract</SelectItem>
                  <SelectItem value="internship" className="text-white hover:bg-white/10">Internship</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white w-[140px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-white/10">All Locations</SelectItem>
                  <SelectItem value="remote" className="text-white hover:bg-white/10">Remote Only</SelectItem>
                  {locations
                    .filter((loc) => loc !== "all")
                    .map((loc) => (
                      <SelectItem key={loc} value={loc} className="text-white hover:bg-white/10">
                        {loc}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative overflow-x-auto -mx-2 sm:mx-0">
                <style>{`
                  .job-tabs-scroll {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                  }
                  .job-tabs-scroll::-webkit-scrollbar {
                    display: none;
                  }
                  .job-tabs-scroll {
                    scroll-behavior: smooth;
                    -webkit-overflow-scrolling: touch;
                  }
                `}</style>
                <TabsList className="flex overflow-x-auto sm:grid sm:grid-cols-5 bg-black/40 border-white/10 job-tabs-scroll min-w-full w-max sm:w-full">
                  <TabsTrigger value="all" className="flex-shrink-0 min-w-[80px] sm:min-w-0 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 text-xs sm:text-sm px-3 sm:px-4">All Jobs</TabsTrigger>
                  <TabsTrigger value="featured" className="flex-shrink-0 min-w-[85px] sm:min-w-0 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 text-xs sm:text-sm px-3 sm:px-4">Featured</TabsTrigger>
                  <TabsTrigger value="remote" className="flex-shrink-0 min-w-[75px] sm:min-w-0 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 text-xs sm:text-sm px-3 sm:px-4">Remote</TabsTrigger>
                  <TabsTrigger value="saved" className="flex-shrink-0 min-w-[70px] sm:min-w-0 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 text-xs sm:text-sm px-3 sm:px-4">Saved</TabsTrigger>
                  <TabsTrigger value="recommended" className="flex-shrink-0 min-w-[110px] sm:min-w-0 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 text-xs sm:text-sm px-3 sm:px-4">Recommended</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-6">
                  {getFilteredJobsByTab().map((job) => (
                    <Card
                      key={job.id}
                      className={`bg-slate-900/70 border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 overflow-hidden group ${job.isFeatured ? 'ring-2 ring-blue-500/30' : ''}`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-3">
                              <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">{job.title}</CardTitle>
                              {job.isFeatured && (
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              {job.isRemote && (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                                  <Globe className="w-3 h-3 mr-1" />
                                  Remote
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-300 mb-3">
                              <div className="flex items-center gap-1.5">
                                <Building className="w-4 h-4 text-blue-400" />
                                <span className="font-medium">{job.company}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-indigo-400" />
                                <span>{getTypeLabel(job.type)}</span>
                              </div>
                            </div>
                            <div className="flex items-center flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <span className="font-semibold text-green-400">{formatSalary(job.salary)}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-pink-400" />
                                <span className="text-gray-300">{job.applications} applications</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-orange-400" />
                                <span className="text-gray-300">
                                  {(() => {
                                    const postedDate = job.postedDate instanceof Date
                                      ? job.postedDate
                                      : new Date(job.postedDate || Date.now());
                                    const daysAgo = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
                                    return daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
                                  })()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveJob(job.id)}
                              className={`${savedJobs.includes(job.id) ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-white'}`}
                            >
                              <Bookmark className={`w-4 h-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                              onClick={() => {
                                setSelectedJobForShare(job);
                                setShareDialogOpen(true);
                              }}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <p className="text-gray-300 line-clamp-2">{job.description}</p>

                          <div>
                            <h4 className="font-medium mb-2 text-white">Required Skills:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill, index) => (
                                <Badge key={index} className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {job.companyPdfUrl && (
                            <div className="pt-2 border-t border-white/10">
                              <a
                                href={job.companyPdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                                <span>View Company PDF</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/50">{getExperienceLabel(job.experience)}</Badge>
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">{job.category}</Badge>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-400/60 bg-white/5 text-blue-100 hover:bg-blue-500/20 hover:text-white flex-1 sm:flex-initial min-h-[44px]"
                                asChild
                              >
                                <Link to={`/jobs/${job.id}`} className="inline-flex items-center justify-center">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  <span className="font-medium">View Details</span>
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApplyJob(job)}
                                disabled={appliedJobs.includes(job.id)}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex-1 sm:flex-initial min-h-[44px]"
                              >
                                {appliedJobs.includes(job.id) ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Applied
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Apply Now
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {getFilteredJobsByTab().length === 0 && (
                    <Card className="bg-slate-900/70 border-white/20">
                      <CardContent className="text-center py-12">
                        <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-white">No jobs found</h3>
                        <p className="text-gray-400">
                          Try adjusting your search criteria or filters to find more opportunities.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Stats */}
            <Card className="bg-slate-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span>Job Market Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Jobs</span>
                    <span className="text-sm font-medium">{jobs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Remote Jobs</span>
                    <span className="text-sm font-medium">{jobs.filter(job => job.isRemote).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Featured Jobs</span>
                    <span className="text-sm font-medium">{jobs.filter(job => job.isFeatured).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg. Salary</span>
                    <span className="text-sm font-medium">$95K</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Skills */}
            <Card className="bg-slate-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Code className="w-5 h-5 text-indigo-400" />
                  <span>Top Skills</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['JavaScript', 'Python', 'React', 'Java', 'AWS', 'Docker'].map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{skill}</span>
                      <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/50 text-xs">
                        {Math.floor(Math.random() * 50) + 20}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Career Tips */}
            <Card className="bg-slate-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <span>Career Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium mb-1 text-white">Optimize Your Resume</h4>
                    <p className="text-gray-400">Include relevant keywords and quantify your achievements.</p>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium mb-1 text-white">Network Effectively</h4>
                    <p className="text-gray-400">Connect with professionals in your field on LinkedIn.</p>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium mb-1 text-white">Prepare for Interviews</h4>
                    <p className="text-gray-400">Practice coding problems and system design questions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Apply - upload resume for recommendations */}
            {isAuthenticated && (
              <Card className="bg-slate-900/70 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <User className="w-5 h-5 text-blue-400" />
                    <span>Quick Apply</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm flex justify-between">
                      <span className="text-gray-300">Saved Jobs:</span>
                      <span className="font-semibold text-yellow-400">{savedJobs.length}</span>
                    </div>
                    <div className="text-sm flex justify-between">
                      <span className="text-gray-300">Applied Jobs:</span>
                      <span className="font-semibold text-green-400">{appliedJobs.length}</span>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      variant="outline"
                      onClick={() => setResumeDialogOpen(true)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Upload Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {/* Beautiful resume dialog */}
      <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
        <DialogContent className="bg-slate-950 border-white/10 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent text-2xl font-bold">
              Upload Your Resume
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-300">
              We&apos;ll analyze your skills and interests, then highlight jobs that are the best fit for you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-blue-900/40 via-slate-950 to-purple-900/40 p-4">
              <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_0_0,#22d3ee_0,transparent_50%),radial-gradient(circle_at_100%_0,#e879f9_0,transparent_50%)]" />
              <div className="relative flex flex-col gap-2">
                <p className="text-sm font-medium text-blue-100">Step 1 – Choose your resume file</p>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="bg-black/40 border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setResumeFile(file);
                  }}
                />
                <p className="text-xs text-blue-100/80">
                  We only use this to generate recommendations for you. Your resume is stored securely.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-100">
                Step 2 – Tell us about your skills
              </label>
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={3}
                placeholder="Example: Python, Java, React, Marketing, Data Science..."
                className="bg-black/60 border-white/15 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-400">
                Paste summary from your resume or just list the technologies and domains you are confident in.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-100">
                Step 3 – Preferred domains
              </label>
              <Input
                value={resumeDomains}
                onChange={(e) => setResumeDomains(e.target.value)}
                placeholder="Web Development, Backend, Data Science, Marketing, DevOps..."
                className="bg-black/60 border-white/15 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-400">
                After processing, check the <span className="font-semibold text-blue-300">Recommended</span> tab to see
                matches.
              </p>
              <Button
                disabled={resumeUploading}
                onClick={async () => {
                  if (!resumeFile) {
                    toast({
                      title: "File required",
                      description: "Please select a resume file first.",
                      variant: "destructive",
                    });
                    return;
                  }
                  try {
                    setResumeUploading(true);
                    const uploadRes = await apiService.uploadFile(resumeFile);
                    if (!uploadRes.success || !uploadRes.data?.url) {
                      throw new Error(uploadRes.message || "Failed to upload resume");
                    }

                    const preferredDomains = resumeDomains
                      .split(",")
                      .map((d) => d.trim())
                      .filter(Boolean);

                    const resumeRes = await apiService.uploadResume({
                      resumeUrl: uploadRes.data.url,
                      rawText: resumeText,
                      preferredDomains,
                    });

                    if (resumeRes.success && Array.isArray(resumeRes.data?.recommendations)) {
                      setRecommendedJobs(resumeRes.data.recommendations);
                      setActiveTab("recommended");
                    }

                    toast({
                      title: "Resume processed",
                      description: "We updated your job recommendations based on your resume.",
                    });
                    setResumeDialogOpen(false);
                    setResumeFile(null);
                    setResumeText("");
                    setResumeDomains("");
                  } catch (err: any) {
                    toast({
                      title: "Upload error",
                      description: err.message || "Failed to upload resume",
                      variant: "destructive",
                    });
                  } finally {
                    setResumeUploading(false);
                  }
                }}
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
              >
                {resumeUploading ? "Processing..." : "Generate Recommendations"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      {selectedJobForShare && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          title={`${selectedJobForShare.title} at ${selectedJobForShare.company}`}
          url={`${window.location.origin}/jobs/${selectedJobForShare.id}`}
          description={`Check out this ${selectedJobForShare.type} position: ${selectedJobForShare.title} at ${selectedJobForShare.company} - ${selectedJobForShare.location}`}
        />
      )}
    </div>
  );
};

export default JobBoard; 