import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
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
  TrendingUp
} from "lucide-react";

const LearningPathsPage = () => {
  const [selectedPath, setSelectedPath] = useState("web-development");

  const learningPaths = [
    {
      id: "web-development",
      title: "Web Development",
      description: "Master frontend and backend development to build modern web applications",
      icon: <Globe className="w-8 h-8" />,
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
    <div className="min-h-screen bg-background">
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Learning Paths
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose your career path and follow a structured curriculum designed by industry experts. 
              Each path includes real-world projects, assessments, and career guidance.
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Path Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Choose Your Career Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <Card 
                key={path.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedPath === path.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedPath(path.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-primary">
                      {path.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{path.title}</h3>
                      <p className="text-sm text-muted-foreground">{path.duration}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{path.difficulty}</Badge>
                    <Badge variant="secondary">{path.salary}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Path Details */}
        {currentPath && (
          <div className="space-y-8">
            {/* Path Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="text-primary">
                    {currentPath.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{currentPath.title}</CardTitle>
                    <CardDescription className="text-lg">{currentPath.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">{currentPath.duration}</div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-2">{currentPath.modules.length}</div>
                    <div className="text-sm text-muted-foreground">Modules</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary mb-2">{currentPath.jobs.length}</div>
                    <div className="text-sm text-muted-foreground">Career Options</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">{currentPath.salary}</div>
                    <div className="text-sm text-muted-foreground">Average Salary</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Career Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPath.jobs.map((job, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">{job}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Curriculum</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="modules" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="modules">Modules</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                  </TabsList>

                  <TabsContent value="modules" className="space-y-4">
                    {currentPath.modules.map((module, index) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">Module {index + 1}: {module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.duration}</p>
                          </div>
                          <Badge variant="outline">{module.duration}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Topics Covered:</h4>
                            <ul className="space-y-1">
                              {module.topics.map((topic, topicIndex) => (
                                <li key={topicIndex} className="text-sm text-muted-foreground flex items-center">
                                  <ArrowRight className="w-3 h-3 mr-2" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Projects:</h4>
                            <ul className="space-y-1">
                              {module.projects.map((project, projectIndex) => (
                                <li key={projectIndex} className="text-sm text-muted-foreground flex items-center">
                                  <Code className="w-3 h-3 mr-2" />
                                  {project}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="projects" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentPath.modules.flatMap((module, moduleIndex) =>
                        module.projects.map((project, projectIndex) => (
                          <Card key={`${moduleIndex}-${projectIndex}`}>
                            <CardHeader>
                              <CardTitle className="text-lg">{project}</CardTitle>
                              <CardDescription>Module {moduleIndex + 1}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">2-4 weeks</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">Individual/Team</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Star className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">Portfolio Ready</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Array.from(new Set(currentPath.modules.flatMap(module => module.skills))).map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="font-medium">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of learners who have transformed their careers with our structured learning paths.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Start Learning Path
                  </Button>
                  <Button variant="outline" size="lg">
                    <Users className="w-4 h-4 mr-2" />
                    Join Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPathsPage; 