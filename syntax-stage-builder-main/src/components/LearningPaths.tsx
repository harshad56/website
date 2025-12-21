import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LearningPaths = () => {
  const paths = [
    {
      title: "Full-Stack Web Development",
      description: "Complete path from HTML basics to production-ready applications",
      duration: "6-8 months",
      level: "Beginner to Advanced",
      students: "45K+",
      rating: 4.9,
      languages: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Node.js", "MongoDB", "PostgreSQL"],
      projects: ["Portfolio Website", "E-commerce Store", "Social Media App", "Real-time Chat", "Blog Platform"],
      modules: 12,
      assessments: 24,
      certification: "Professional Certificate",
      jobPlacement: "92%",
      icon: "🌐",
      gradient: "from-blue-500 to-purple-600",
      skills: ["Frontend Development", "Backend APIs", "Database Design", "Authentication", "Deployment", "Testing"]
    },
    {
      title: "Data Science & Machine Learning",
      description: "Python-focused path covering data analysis, ML, and AI implementation",
      duration: "8-10 months", 
      level: "Beginner to Expert",
      students: "32K+",
      rating: 4.8,
      languages: ["Python", "SQL", "R", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn"],
      projects: ["Data Dashboard", "Predictive Model", "AI Chatbot", "Computer Vision", "NLP System"],
      modules: 15,
      assessments: 30,
      certification: "Data Science Professional",
      jobPlacement: "88%",
      icon: "🤖",
      gradient: "from-green-500 to-teal-600",
      skills: ["Data Analysis", "Machine Learning", "Deep Learning", "Statistics", "Data Visualization", "MLOps"]
    },
    {
      title: "Mobile App Development",
      description: "Cross-platform mobile apps for iOS and Android with modern frameworks",
      duration: "5-7 months",
      level: "Intermediate",
      students: "28K+", 
      rating: 4.7,
      languages: ["Swift", "Kotlin", "Flutter", "React Native", "Dart", "Firebase"],
      projects: ["Todo App", "Social Media App", "E-commerce App", "Navigation App", "Fitness Tracker"],
      modules: 10,
      assessments: 20,
      certification: "Mobile Developer",
      jobPlacement: "85%",
      icon: "📱",
      gradient: "from-orange-500 to-red-600",
      skills: ["iOS Development", "Android Development", "Cross-platform", "UI/UX", "App Store Publishing", "Performance"]
    },
    {
      title: "Backend & System Design",
      description: "Scalable server architecture, databases, and distributed systems",
      duration: "6-9 months",
      level: "Intermediate to Advanced", 
      students: "22K+",
      rating: 4.8,
      languages: ["Java", "Python", "Go", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
      projects: ["REST API", "Microservices", "Distributed Cache", "Message Queue", "Load Balancer"],
      modules: 14,
      assessments: 28,
      certification: "Backend Engineer",
      jobPlacement: "90%",
      icon: "⚙️",
      gradient: "from-indigo-500 to-blue-600",
      skills: ["System Design", "Database Architecture", "API Development", "Microservices", "DevOps", "Performance"]
    },
    {
      title: "Game Development Master",
      description: "2D/3D games, VR experiences, and interactive entertainment",
      duration: "7-10 months",
      level: "Intermediate to Advanced",
      students: "18K+",
      rating: 4.6,
      languages: ["C#", "C++", "Unity", "Unreal Engine", "Godot", "HLSL", "JavaScript"],
      projects: ["2D Platformer", "3D Adventure", "Multiplayer Game", "VR Experience", "Mobile Game"],
      modules: 16,
      assessments: 32,
      certification: "Game Developer",
      jobPlacement: "78%",
      icon: "🎮",
      gradient: "from-purple-500 to-pink-600",
      skills: ["Game Programming", "3D Graphics", "Game Design", "Physics", "Animation", "Optimization"]
    },
    {
      title: "DevOps & Cloud Engineering",
      description: "Infrastructure automation, CI/CD, and cloud-native technologies",
      duration: "4-6 months",
      level: "Intermediate",
      students: "15K+",
      rating: 4.7, 
      languages: ["Docker", "Kubernetes", "AWS", "Azure", "Terraform", "Jenkins", "Python", "Go"],
      projects: ["CI/CD Pipeline", "Cloud Infrastructure", "Monitoring System", "Auto-scaling", "Security Pipeline"],
      modules: 8,
      assessments: 16,
      certification: "DevOps Engineer",
      jobPlacement: "94%",
      icon: "☁️",
      gradient: "from-cyan-500 to-blue-500",
      skills: ["Cloud Platforms", "Containerization", "Infrastructure as Code", "Monitoring", "Security", "Automation"]
    },
    {
      title: "Cybersecurity Specialist",
      description: "Ethical hacking, penetration testing, and security architecture",
      duration: "8-12 months",
      level: "Intermediate to Advanced",
      students: "12K+",
      rating: 4.8,
      languages: ["Python", "C", "Assembly", "PowerShell", "Bash", "SQL"],
      projects: ["Vulnerability Scanner", "Penetration Test", "Security Audit", "Incident Response", "Malware Analysis"],
      modules: 18,
      assessments: 36,
      certification: "Cybersecurity Professional",
      jobPlacement: "96%",
      icon: "🔒",
      gradient: "from-red-500 to-orange-600",
      skills: ["Ethical Hacking", "Network Security", "Forensics", "Risk Assessment", "Compliance", "Incident Response"]
    },
    {
      title: "AI & Deep Learning Engineer",
      description: "Advanced AI, neural networks, and computer vision systems",
      duration: "10-12 months",
      level: "Advanced to Expert",
      students: "8K+",
      rating: 4.9,
      languages: ["Python", "TensorFlow", "PyTorch", "CUDA", "C++", "R"],
      projects: ["Neural Network", "Computer Vision", "NLP Model", "Recommendation System", "Autonomous System"],
      modules: 20,
      assessments: 40,
      certification: "AI Engineer",
      jobPlacement: "89%",
      icon: "🧠",
      gradient: "from-violet-500 to-purple-600",
      skills: ["Deep Learning", "Computer Vision", "NLP", "Reinforcement Learning", "MLOps", "Research"]
    },
    {
      title: "Blockchain Developer",
      description: "Smart contracts, DeFi, and decentralized applications",
      duration: "5-7 months",
      level: "Intermediate to Advanced",
      students: "9K+",
      rating: 4.6,
      languages: ["Solidity", "JavaScript", "Rust", "Go", "Web3.js", "Ethers.js"],
      projects: ["Smart Contract", "DeFi Protocol", "NFT Marketplace", "DAO", "Cross-chain Bridge"],
      modules: 12,
      assessments: 24,
      certification: "Blockchain Developer",
      jobPlacement: "82%",
      icon: "⛓️",
      gradient: "from-yellow-500 to-orange-500",
      skills: ["Smart Contracts", "DeFi", "Web3", "Consensus", "Cryptography", "dApp Development"]
    }
  ];

  return (
    <section id="learning-paths" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Career-Focused</span> Learning Paths
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Structured learning journeys designed by industry experts. Each path includes projects, 
            mentorship, and job placement support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paths.map((path, index) => (
            <Card 
              key={index}
              className="border-border bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{path.icon}</div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{path.rating}</span>
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold mb-2">{path.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed mb-3">
                  {path.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>⏱️ {path.duration}</span>
                  <span>📊 {path.level}</span>
                  <span>👥 {path.students}</span>
                </div>
              </CardHeader>
              
              <CardContent className="relative space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <span>📚</span>
                    <span>{path.modules} modules</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>✅</span>
                    <span>{path.assessments} tests</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>🏆</span>
                    <span>{path.certification}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>💼</span>
                    <span>{path.jobPlacement} placed</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Technologies & Tools:</h4>
                  <div className="flex flex-wrap gap-1">
                    {path.languages.slice(0, 6).map((lang, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                    {path.languages.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{path.languages.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Key Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {path.skills.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md">
                        {skill}
                      </span>
                    ))}
                    {path.skills.length > 4 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                        +{path.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2">Build Real Projects:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {path.projects.slice(0, 3).map((project, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>{project}</span>
                      </li>
                    ))}
                    {path.projects.length > 3 && (
                      <li className="flex items-center space-x-2 text-primary">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>+{path.projects.length - 3} more projects</span>
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={() => {
                      // Navigate to appropriate pages based on path
                      const pathPages = {
                        'Full-Stack Web Development': '/coding-challenges',
                        'Data Science & Machine Learning': '/learning-paths',
                        'Mobile App Development': '/learning-paths',
                        'Backend & System Design': '/java-learning',
                        'Game Development Master': '/learning-paths',
                        'DevOps & Cloud Engineering': '/learning-paths'
                      };
                      
                      const targetPage = pathPages[path.title as keyof typeof pathPages] || '/learning-paths';
                      window.location.href = targetPage;
                    }}
                  >
                    Start Learning Path
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      // Navigate to coding challenges page
                      window.location.href = '/coding-challenges';
                    }}
                  >
                    View Curriculum
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-card border border-border rounded-xl p-8 shadow-elegant max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">🎯 Not Sure Which Path to Choose?</h3>
            <p className="text-muted-foreground mb-6">
              Take our personalized career quiz to find the perfect learning path for your goals and interests.
            </p>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => {
                // Navigate to learning paths page
                window.location.href = '/learning-paths';
              }}
            >
              Take Career Quiz
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningPaths;