
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Globe,
  Smartphone,
  Database,
  Brain,
  Cloud,
  Target,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Zap,
  TrendingUp,
  Layout,
  Layers,
  Terminal,
  Server,
  Cpu
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const LearningPathsPage = () => {
  const [selectedPath, setSelectedPath] = useState("web-development");

  const learningPaths = [
    {
      id: "web-development",
      title: "Web Development",
      description: "Master frontend and backend development to build modern web applications",
      icon: <Globe className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-400",
      accent: "text-blue-500",
      bg: "bg-blue-500/10",
      duration: "6-8 months",
      difficulty: "Beginner to Advanced",
      jobs: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Web Developer"],
      salary: "$60,000 - $120,000",
      modules: [
        {
          title: "Frontend Fundamentals",
          duration: "8 weeks",
          topics: ["HTML5 & CSS3", "JavaScript ES6+", "Responsive Design", "Accessibility"],
          projects: ["Personal Portfolio", "E-commerce Landing Page", "Weather App"],
          skills: ["HTML", "CSS", "JavaScript", "Git"]
        },
        {
          title: "Frontend Frameworks",
          duration: "10 weeks",
          topics: ["React.js", "State Management", "Component Architecture", "Testing"],
          projects: ["Social Media Clone", "Task Management App", "Real-time Chat"],
          skills: ["React", "Redux", "Jest", "TypeScript"]
        },
        {
          title: "Backend Development",
          duration: "12 weeks",
          topics: ["Node.js", "Express.js", "Database Design", "API Development"],
          projects: ["RESTful API", "Authentication System", "File Upload Service"],
          skills: ["Node.js", "Express", "MongoDB", "PostgreSQL"]
        },
        {
          title: "Full Stack Integration",
          duration: "6 weeks",
          topics: ["Deployment", "CI/CD", "Performance Optimization", "Security"],
          projects: ["Complete Web Application", "Deployment Pipeline", "Performance Audit"],
          skills: ["Docker", "AWS", "Nginx", "Security Best Practices"]
        }
      ]
    },
    {
      id: "mobile-development",
      title: "Mobile Development",
      description: "Build native and cross-platform mobile applications for iOS and Android",
      icon: <Smartphone className="w-8 h-8" />,
      color: "from-purple-500 to-pink-400",
      accent: "text-purple-500",
      bg: "bg-purple-500/10",
      duration: "5-7 months",
      difficulty: "Beginner to Advanced",
      jobs: ["Mobile Developer", "iOS Developer", "Android Developer", "React Native Developer"],
      salary: "$70,000 - $130,000",
      modules: [
        {
          title: "Mobile Fundamentals",
          duration: "6 weeks",
          topics: ["Mobile UI/UX", "Platform Differences", "App Store Guidelines", "Performance"],
          projects: ["Simple Calculator App", "To-Do List", "Weather Widget"],
          skills: ["Mobile Design", "Platform Guidelines", "Performance Optimization"]
        },
        {
          title: "React Native",
          duration: "10 weeks",
          topics: ["React Native Basics", "Navigation", "State Management", "Native Modules"],
          projects: ["Social Media App", "E-commerce App", "Fitness Tracker"],
          skills: ["React Native", "Redux", "React Navigation", "Firebase"]
        },
        {
          title: "Native Development",
          duration: "12 weeks",
          topics: ["iOS Development (Swift)", "Android Development (Kotlin)", "App Store Deployment"],
          projects: ["Native Calculator", "Photo Gallery App", "Location-based App"],
          skills: ["Swift", "Kotlin", "Xcode", "Android Studio"]
        },
        {
          title: "Advanced Mobile",
          duration: "6 weeks",
          topics: ["Push Notifications", "Offline Support", "Analytics", "Testing"],
          projects: ["Complete Mobile App", "Push Notification System", "Analytics Dashboard"],
          skills: ["Push Notifications", "Offline Storage", "Analytics", "Testing"]
        }
      ]
    },
    {
      id: "data-science",
      title: "Data Science",
      description: "Learn to analyze data, build machine learning models, and drive insights",
      icon: <Brain className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-400",
      accent: "text-emerald-500",
      bg: "bg-emerald-500/10",
      duration: "8-10 months",
      difficulty: "Intermediate to Advanced",
      jobs: ["Data Scientist", "Machine Learning Engineer", "Data Analyst", "AI Engineer"],
      salary: "$80,000 - $150,000",
      modules: [
        {
          title: "Data Fundamentals",
          duration: "8 weeks",
          topics: ["Python for Data Science", "Statistics", "Data Visualization", "SQL"],
          projects: ["Data Analysis Report", "Interactive Dashboard", "Database Design"],
          skills: ["Python", "Pandas", "Matplotlib", "SQL"]
        },
        {
          title: "Machine Learning",
          duration: "12 weeks",
          topics: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Feature Engineering"],
          projects: ["Predictive Model", "Classification System", "Recommendation Engine"],
          skills: ["Scikit-learn", "NumPy", "Feature Engineering", "Model Evaluation"]
        },
        {
          title: "Deep Learning",
          duration: "10 weeks",
          topics: ["Neural Networks", "Computer Vision", "NLP", "TensorFlow/PyTorch"],
          projects: ["Image Classification", "Text Analysis", "Neural Network from Scratch"],
          skills: ["TensorFlow", "PyTorch", "Computer Vision", "NLP"]
        },
        {
          title: "Data Engineering",
          duration: "8 weeks",
          topics: ["Big Data", "Data Pipelines", "Cloud Platforms", "MLOps"],
          projects: ["Data Pipeline", "ML Model Deployment", "Real-time Analytics"],
          skills: ["Apache Spark", "Airflow", "AWS", "MLOps"]
        }
      ]
    },
    {
      id: "devops",
      title: "DevOps & Cloud",
      description: "Master infrastructure, automation, and cloud platforms for scalable applications",
      icon: <Cloud className="w-8 h-8" />,
      color: "from-orange-500 to-amber-400",
      accent: "text-orange-500",
      bg: "bg-orange-500/10",
      duration: "6-8 months",
      difficulty: "Intermediate to Advanced",
      jobs: ["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Infrastructure Engineer"],
      salary: "$75,000 - $140,000",
      modules: [
        {
          title: "Infrastructure Fundamentals",
          duration: "8 weeks",
          topics: ["Linux Administration", "Networking", "Virtualization", "Containerization"],
          projects: ["Linux Server Setup", "Network Configuration", "Docker Containerization"],
          skills: ["Linux", "Networking", "Docker", "Virtualization"]
        },
        {
          title: "Cloud Platforms",
          duration: "10 weeks",
          topics: ["AWS", "Azure", "Google Cloud", "Serverless Computing"],
          projects: ["Cloud Infrastructure", "Serverless Application", "Multi-cloud Setup"],
          skills: ["AWS", "Azure", "GCP", "Serverless"]
        },
        {
          title: "Automation & CI/CD",
          duration: "8 weeks",
          topics: ["Jenkins", "GitLab CI", "Terraform", "Ansible"],
          projects: ["CI/CD Pipeline", "Infrastructure as Code", "Automated Deployment"],
          skills: ["Jenkins", "Terraform", "Ansible", "CI/CD"]
        },
        {
          title: "Monitoring & Security",
          duration: "6 weeks",
          topics: ["Monitoring Tools", "Logging", "Security Best Practices", "Compliance"],
          projects: ["Monitoring Dashboard", "Security Audit", "Compliance Framework"],
          skills: ["Prometheus", "ELK Stack", "Security", "Compliance"]
        }
      ]
    },
    {
      id: "game-development",
      title: "Game Development",
      description: "Create engaging games using modern game engines and programming techniques",
      icon: <Code className="w-8 h-8" />,
      color: "from-red-500 to-rose-400",
      accent: "text-red-500",
      bg: "bg-red-500/10",
      duration: "7-9 months",
      difficulty: "Beginner to Advanced",
      jobs: ["Game Developer", "Unity Developer", "Unreal Developer", "Game Programmer"],
      salary: "$60,000 - $120,000",
      modules: [
        {
          title: "Game Development Basics",
          duration: "8 weeks",
          topics: ["Game Design Principles", "Unity Basics", "C# Programming", "Game Physics"],
          projects: ["Simple Platformer", "Puzzle Game", "2D Shooter"],
          skills: ["Unity", "C#", "Game Design", "Physics"]
        },
        {
          title: "Advanced Unity",
          duration: "10 weeks",
          topics: ["3D Graphics", "Animation", "Audio", "UI/UX"],
          projects: ["3D Adventure Game", "Racing Game", "RPG Elements"],
          skills: ["3D Modeling", "Animation", "Audio Design", "UI Design"]
        },
        {
          title: "Game Programming",
          duration: "12 weeks",
          topics: ["Game Architecture", "AI Programming", "Networking", "Optimization"],
          projects: ["Multiplayer Game", "AI-driven NPCs", "Performance Optimization"],
          skills: ["Game Architecture", "AI", "Networking", "Optimization"]
        },
        {
          title: "Game Publishing",
          duration: "6 weeks",
          topics: ["Platform Deployment", "Monetization", "Marketing", "Community Building"],
          projects: ["Complete Game", "Monetization Strategy", "Marketing Campaign"],
          skills: ["Platform Deployment", "Monetization", "Marketing", "Community"]
        }
      ]
    }
  ];

  const currentPath = learningPaths.find(path => path.id === selectedPath);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEO
        title="Learning Paths | CodeAcademy Pro"
        description="Structured learning paths for Web Development, Data Science, Mobile Apps, and more. Launch your tech career today."
      />

      {/* Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] opacity-50" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-6">
        <div className="container mx-auto px-6">
          <BackButton label="Back to Home" />
        </div>

        <div className="container mx-auto px-6 py-12 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
              Career Focused Curriculum
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Choose Your <span className="text-primary">Learning Path</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Step-by-step guides helping you go from beginner to professional.
              Select a path to see the detailed curriculum, projects, and career outcomes.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Sidebar - Path Selection */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Available Paths
            </h2>
            <div className="space-y-3">
              {learningPaths.map((path) => (
                <motion.div
                  key={path.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 border-0 ${selectedPath === path.id
                        ? `bg-gradient-to-r ${path.color} text-white shadow-lg shadow-${path.accent ? path.accent.split('-')[1] : 'primary'}/20`
                        : "bg-card/50 hover:bg-card border border-border/50 hover:border-primary/20"
                      }`}
                    onClick={() => setSelectedPath(path.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${selectedPath === path.id ? 'bg-white/20' : path.bg} ${selectedPath === path.id ? 'text-white' : path.accent}`}>
                        {path.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${selectedPath === path.id ? 'text-white' : ''}`}>{path.title}</h3>
                        <p className={`text-xs ${selectedPath === path.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {path.duration} • {path.difficulty}
                        </p>
                      </div>
                      {selectedPath === path.id && (
                        <motion.div layoutId="activePath" className="bg-white/20 p-1 rounded-full">
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Content - Path Details */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {currentPath && (
                <motion.div
                  key={currentPath.id}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-8"
                >
                  {/* Path Overview Header */}
                  <motion.div variants={itemVariants}>
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-background border-t border-white/10 overflow-hidden relative">
                      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${currentPath.color} opacity-10 rounded-full blur-3xl -mr-32 -mt-32`} />

                      <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8 relative z-10">
                          <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentPath.color} text-white shadow-lg`}>
                            {currentPath.icon}
                          </div>
                          <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-2">{currentPath.title}</h2>
                            <p className="text-muted-foreground text-lg">{currentPath.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                          <div className="p-4 rounded-xl bg-background/50 border border-border/50 backdrop-blur-sm">
                            <Clock className={`w-5 h-5 mb-2 ${currentPath.accent}`} />
                            <div className="text-2xl font-bold">{currentPath.duration}</div>
                            <div className="text-xs text-muted-foreground">Duration</div>
                          </div>
                          <div className="p-4 rounded-xl bg-background/50 border border-border/50 backdrop-blur-sm">
                            <BookOpen className={`w-5 h-5 mb-2 ${currentPath.accent}`} />
                            <div className="text-2xl font-bold">{currentPath.modules.length}</div>
                            <div className="text-xs text-muted-foreground">Modules</div>
                          </div>
                          <div className="p-4 rounded-xl bg-background/50 border border-border/50 backdrop-blur-sm">
                            <Briefcase className={`w-5 h-5 mb-2 ${currentPath.accent}`} />
                            <div className="text-2xl font-bold">{currentPath.jobs.length}</div>
                            <div className="text-xs text-muted-foreground">Careers</div>
                          </div>
                          <div className="p-4 rounded-xl bg-background/50 border border-border/50 backdrop-blur-sm">
                            <DollarSign className={`w-5 h-5 mb-2 ${currentPath.accent}`} />
                            <div className="text-lg font-bold truncate">{currentPath.salary}</div>
                            <div className="text-xs text-muted-foreground">Est. Salary</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Tabs Section */}
                  <motion.div variants={itemVariants}>
                    <Tabs defaultValue="curriculum" className="w-full">
                      <TabsList className="w-full justify-start bg-transparent p-0 border-b border-border/50 rounded-none h-auto mb-6 gap-6">
                        <TabsTrigger
                          value="curriculum"
                          className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
                        >
                          Curriculum & Modules
                        </TabsTrigger>
                        <TabsTrigger
                          value="projects"
                          className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
                        >
                          Real-world Projects
                        </TabsTrigger>
                        <TabsTrigger
                          value="careers"
                          className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
                        >
                          Career Outcomes
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="curriculum" className="space-y-4">
                        {currentPath.modules.map((module, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="group hover:border-primary/30 transition-all duration-300">
                              <CardContent className="p-0">
                                <div className="p-6">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                    <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary-foreground`}>
                                        {index + 1}
                                      </div>
                                      <div>
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{module.title}</h3>
                                        <p className="text-sm text-muted-foreground">{module.duration}</p>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {module.skills.map((skill, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs bg-secondary/10">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border/50">
                                    <div>
                                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" /> Topics
                                      </h4>
                                      <ul className="grid gap-2">
                                        {module.topics.map((topic, i) => (
                                          <li key={i} className="flex items-start gap-2 text-sm">
                                            <div className="mt-1.5 w-1 h-1 rounded-full bg-primary" />
                                            {topic}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                        <Terminal className="w-4 h-4" /> Projects
                                      </h4>
                                      <ul className="grid gap-2">
                                        {module.projects.map((project, i) => (
                                          <li key={i} className="flex items-start gap-2 text-sm">
                                            <div className="mt-1.5 w-1 h-1 rounded-full bg-secondary-foreground" />
                                            {project}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </TabsContent>

                      <TabsContent value="projects">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {currentPath.modules.flatMap((module, mIndex) =>
                            module.projects.map((project, pIndex) => (
                              <Card key={`${mIndex}-${pIndex}`} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-background">
                                <CardHeader className="border-b border-border/50 bg-muted/20 p-4">
                                  <div className="flex justify-between items-center">
                                    <Badge variant="outline" className="bg-background">Module {mIndex + 1}</Badge>
                                    <Code className={`w-5 h-5 ${currentPath.accent}`} />
                                  </div>
                                  <CardTitle className="mt-2">{project}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <Layout className="w-4 h-4" />
                                      <span>Full-featured implementation</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <Star className="w-4 h-4" />
                                      <span>Portfolio-ready asset</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                      {module.skills.slice(0, 3).map((skill, i) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-primary/5 text-primary rounded-md">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="careers">
                        <Card className="bg-gradient-to-br from-card to-background border-border/50">
                          <CardContent className="p-8">
                            <div className="grid md:grid-cols-2 gap-12">
                              <div>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                  <Target className={`w-6 h-6 ${currentPath.accent}`} />
                                  Target Roles
                                </h3>
                                <div className="space-y-4">
                                  {currentPath.jobs.map((job, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all">
                                      <div className={`p-2 rounded-full bg-primary/10 ${currentPath.accent}`}>
                                        <CheckCircle className="w-5 h-5" />
                                      </div>
                                      <span className="font-semibold text-lg">{job}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                  <TrendingUp className={`w-6 h-6 ${currentPath.accent}`} />
                                  Salary Insights
                                </h3>
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 mb-6">
                                  <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Estimated Annual Salary</div>
                                  <div className="text-4xl font-bold text-foreground">{currentPath.salary}</div>
                                  <div className="mt-2 text-sm text-muted-foreground">Based on industry standards for entry to mid-level positions.</div>
                                </div>
                                <div className="space-y-4">
                                  <h4 className="font-semibold mb-2">Why this path?</h4>
                                  <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                      High demand in the current job market
                                    </li>
                                    <li className="flex gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                      Excellent remote work opportunities
                                    </li>
                                    <li className="flex gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                      Strong career growth potential
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </motion.div>

                  {/* CTA Section */}
                  <motion.div variants={itemVariants}>
                    <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 md:p-12 text-center border border-primary/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                      <h2 className="text-3xl font-bold mb-4 relative z-10">Ready to Start Your Journey?</h2>
                      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto relative z-10">
                        Join thousands of learners who have transformed their careers. Get verified certificates, portfolio projects, and mentorship.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 h-14 shadow-lg shadow-primary/20">
                          Start {currentPath.title} Path
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg px-8 h-14 bg-background/50 backdrop-blur-sm">
                          View Syllabus PDF
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for icons
const Briefcase = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const DollarSign = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export default LearningPathsPage;