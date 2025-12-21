import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ComprehensiveFeatures = () => {
  const features = [
    {
      title: "AI-Powered Learning Assistant",
      description: "Get personalized help, code explanations, and debugging assistance 24/7",
      icon: "🤖",
      stats: [
        { label: "Code explanations", value: "10M+" },
        { label: "Bugs fixed", value: "2M+" },
        { label: "Questions answered", value: "50M+" }
      ],
      technologies: ["GPT-4", "Code Analysis", "Natural Language Processing"]
    },
    {
      title: "Live Coding Sessions",
      description: "Join expert-led sessions and learn alongside thousands of students",
      icon: "📹",
      stats: [
        { label: "Live sessions/week", value: "100+" },
        { label: "Expert instructors", value: "500+" },
        { label: "Participants", value: "50K+" }
      ],
      technologies: ["WebRTC", "Real-time Chat", "Screen Sharing", "Q&A System"]
    },
    {
      title: "Advanced Code Analytics",
      description: "Track your progress with detailed metrics and performance insights",
      icon: "📊",
      stats: [
        { label: "Code metrics tracked", value: "25+" },
        { label: "Performance insights", value: "Daily" },
        { label: "Progress reports", value: "Weekly" }
      ],
      technologies: ["Machine Learning", "Data Visualization", "Performance Monitoring"]
    },
    {
      title: "Industry Simulation Labs",
      description: "Practice on real-world scenarios from top tech companies",
      icon: "🏢",
      stats: [
        { label: "Company scenarios", value: "200+" },
        { label: "Real codebases", value: "50+" },
        { label: "Industry partners", value: "100+" }
      ],
      technologies: ["Docker", "Kubernetes", "Cloud Platforms", "CI/CD"]
    },
    {
      title: "Smart Code Review System",
      description: "Get feedback on your code quality, style, and best practices",
      icon: "🔍",
      stats: [
        { label: "Code reviews/day", value: "10K+" },
        { label: "Best practices", value: "500+" },
        { label: "Languages supported", value: "25+" }
      ],
      technologies: ["Static Analysis", "ML Models", "Security Scanning", "Performance Testing"]
    },
    {
      title: "Gamified Learning Experience",
      description: "Earn badges, compete in challenges, and climb leaderboards",
      icon: "🎮",
      stats: [
        { label: "Achievement badges", value: "200+" },
        { label: "Coding challenges", value: "1000+" },
        { label: "Active competitors", value: "100K+" }
      ],
      technologies: ["Blockchain Certificates", "Real-time Rankings", "Achievement System"]
    }
  ];

  const certifications = [
    {
      name: "Professional Developer Certificate",
      provider: "CodeAcademy Pro",
      recognition: "Industry Standard",
      graduates: "25K+",
      companies: ["Google", "Microsoft", "Amazon", "Meta"],
      duration: "6-12 months",
      skills: ["Full-Stack Development", "System Design", "Clean Code", "Testing"]
    },
    {
      name: "AI/ML Engineer Certificate",
      provider: "CodeAcademy Pro",
      recognition: "University Recognized",
      graduates: "15K+",
      companies: ["OpenAI", "NVIDIA", "Tesla", "Apple"],
      duration: "8-12 months",
      skills: ["Machine Learning", "Deep Learning", "Data Science", "MLOps"]
    },
    {
      name: "Cloud Solutions Architect",
      provider: "CodeAcademy Pro",
      recognition: "Cloud Provider Endorsed",
      graduates: "12K+",
      companies: ["AWS", "Azure", "GCP", "Salesforce"],
      duration: "4-8 months",
      skills: ["Cloud Architecture", "DevOps", "Security", "Scalability"]
    }
  ];

  const comparisons = [
    {
      feature: "Interactive Code Editor",
      us: "Advanced IDE with AI assistance",
      geeksforgeeks: "Basic text editor",
      tutorialspoint: "Simple code runner"
    },
    {
      feature: "Learning Paths",
      us: "9 comprehensive career paths",
      geeksforgeeks: "Limited structured courses",
      tutorialspoint: "Basic tutorials only"
    },
    {
      feature: "Project Portfolio",
      us: "100+ real-world projects",
      geeksforgeeks: "Few practice problems",
      tutorialspoint: "No project guidance"
    },
    {
      feature: "Job Placement",
      us: "90%+ placement rate with support",
      geeksforgeeks: "No placement assistance",
      tutorialspoint: "No job support"
    },
    {
      feature: "Live Mentorship",
      us: "24/7 expert support + AI",
      geeksforgeeks: "Community forums only",
      tutorialspoint: "No live support"
    },
    {
      feature: "Industry Certification",
      us: "University + Industry recognized",
      geeksforgeeks: "Basic certificates",
      tutorialspoint: "No certification"
    }
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        {/* Advanced Features */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Advanced Features</span> That Set Us Apart
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Experience next-generation learning with AI assistance, industry simulations, 
            and comprehensive support systems that guarantee your success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-elegant transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl">{feature.icon}</div>
                  <Badge variant="secondary">Premium</Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {feature.stats.map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="font-semibold text-primary">{stat.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {feature.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry Certifications */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Industry-Recognized</span> Certifications
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Earn certificates that are recognized by top tech companies and universities worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="border-border bg-card shadow-elegant">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default">Official Certificate</Badge>
                    <span className="text-sm text-muted-foreground">{cert.duration}</span>
                  </div>
                  <CardTitle className="text-lg">{cert.name}</CardTitle>
                  <CardDescription>by {cert.provider}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Recognition Level</span>
                    <Badge variant="secondary">{cert.recognition}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Graduates</span>
                    <span className="font-semibold">{cert.graduates}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Hiring Companies:</div>
                    <div className="flex flex-wrap gap-1">
                      {cert.companies.map((company, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Core Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={() => {
                      // Navigate to learning paths page
                      window.location.href = '/learning-paths';
                    }}
                  >
                    Enroll for Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">CodeAcademy Pro</span>?
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              See how we compare against other popular programming learning platforms.
            </p>
          </div>

          <Card className="border-border bg-card shadow-elegant overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold text-primary">CodeAcademy Pro</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">GeeksforGeeks</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">TutorialsPoint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((comparison, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="p-4 font-medium">{comparison.feature}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-green-600">✓</span>
                            <span className="text-sm">{comparison.us}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-yellow-600">⚠</span>
                            <span className="text-sm text-muted-foreground">{comparison.geeksforgeeks}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-red-600">✗</span>
                            <span className="text-sm text-muted-foreground">{comparison.tutorialspoint}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Metrics */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="gradient-text">Proven Results</span> & Student Success
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { metric: "3.5M+", label: "Active Students", growth: "+35% this year" },
              { metric: "92%", label: "Job Placement Rate", growth: "Industry leading" },
              { metric: "$85K", label: "Average Starting Salary", growth: "+15% vs market" },
              { metric: "4.9/5", label: "Student Satisfaction", growth: "500K+ reviews" }
            ].map((stat, index) => (
              <Card key={index} className="border-border bg-card p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.metric}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.growth}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveFeatures;