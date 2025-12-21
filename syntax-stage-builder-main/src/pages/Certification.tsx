import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BackButton } from "@/components/BackButton";
import { 
  ArrowRight, 
  Award, 
  CheckCircle, 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  Target,
  Shield,
  Globe,
  TrendingUp,
  FileText,
  Download,
  Share2,
  Eye,
  Zap,
  GraduationCap,
  Briefcase,
  Code,
  Database,
  Smartphone,
  Gamepad2,
  Cloud,
  Server
} from "lucide-react";
import SEO from "@/components/SEO";

const Certification = () => {
  const [selectedCertification, setSelectedCertification] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");

  const certifications = [
    {
      id: "fullstack",
      title: "Full-Stack Web Developer",
      description: "Master frontend and backend development with modern technologies",
      duration: "6-8 months",
      level: "Intermediate",
      price: "$299",
      rating: 4.9,
      students: 15420,
      skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "Database Design"],
      projects: 12,
      icon: Code,
      color: "from-blue-600 to-purple-600",
      badge: "Most Popular"
    },
    {
      id: "datascience",
      title: "Data Science Professional",
      description: "Learn data analysis, machine learning, and statistical modeling",
      duration: "8-10 months",
      level: "Advanced",
      price: "$399",
      rating: 4.8,
      students: 9870,
      skills: ["Python", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
      projects: 15,
      icon: Database,
      color: "from-green-600 to-teal-600"
    },
    {
      id: "mobile",
      title: "Mobile App Developer",
      description: "Build native and cross-platform mobile applications",
      duration: "5-7 months",
      level: "Intermediate",
      price: "$349",
      rating: 4.7,
      students: 7650,
      skills: ["React Native", "Flutter", "iOS Development", "Android Development", "App Store"],
      projects: 10,
      icon: Smartphone,
      color: "from-purple-600 to-pink-600"
    },
    {
      id: "game-dev",
      title: "Game Development Master",
      description: "Create 2D and 3D games with Unity and Unreal Engine",
      duration: "7-10 months",
      level: "Advanced",
      price: "$449",
      rating: 4.6,
      students: 4320,
      skills: ["Unity", "C#", "3D Modeling", "Game Design", "Physics"],
      projects: 8,
      icon: Gamepad2,
      color: "from-orange-600 to-red-600"
    },
    {
      id: "devops",
      title: "DevOps & Cloud Engineer",
      description: "Master cloud infrastructure and deployment automation",
      duration: "4-6 months",
      level: "Intermediate",
      price: "$379",
      rating: 4.8,
      students: 6540,
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Monitoring"],
      projects: 14,
      icon: Cloud,
      color: "from-cyan-600 to-blue-600"
    },
    {
      id: "backend",
      title: "Backend & System Design",
      description: "Design scalable backend systems and microservices",
      duration: "6-9 months",
      level: "Advanced",
      price: "$429",
      rating: 4.9,
      students: 5430,
      skills: ["Java", "Python", "System Design", "Microservices", "Database"],
      projects: 16,
      icon: Server,
      color: "from-indigo-600 to-purple-600"
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Industry Recognition",
      description: "Certificates recognized by top tech companies worldwide"
    },
    {
      icon: Shield,
      title: "Verifiable Credentials",
      description: "Blockchain-verified certificates that can't be forged"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Join our alumni network of 50,000+ professionals"
    },
    {
      icon: TrendingUp,
      title: "Career Boost",
      description: "Average 25% salary increase after certification"
    }
  ];

  const verificationResults = [
    {
      name: "Sarah Chen",
      certification: "Full-Stack Web Developer",
      issued: "2024-03-15",
      status: "Verified",
      company: "TechCorp Inc."
    },
    {
      name: "Michael Rodriguez",
      certification: "Data Science Professional",
      issued: "2024-02-28",
      status: "Verified",
      company: "DataFlow Analytics"
    },
    {
      name: "Emily Johnson",
      certification: "Mobile App Developer",
      issued: "2024-01-20",
      status: "Verified",
      company: "AppWorks Studio"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton />
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Professional Certifications
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Industry-Recognized Certificates
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Earn verified certificates that boost your career and open doors to top tech companies
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>50,000+ Certified Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-current" />
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Blockchain Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose Our Certifications?</h2>
          <p className="text-xl text-muted-foreground">
            Stand out in the competitive tech industry with our recognized credentials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Available Certifications</h2>
          <p className="text-xl text-muted-foreground">
            Choose the certification that aligns with your career goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {certifications.map((cert) => (
            <Card key={cert.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
              {cert.badge && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500">
                  {cert.badge}
                </Badge>
              )}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${cert.color}`}></div>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${cert.color} text-white`}>
                    <cert.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{cert.title}</CardTitle>
                    <CardDescription>{cert.description}</CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">{cert.level}</Badge>
                  <div className="text-2xl font-bold text-primary">{cert.price}</div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{cert.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    <span>{cert.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{cert.students.toLocaleString()}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Skills You'll Learn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    {cert.projects} Projects
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setSelectedCertification(cert.id)}
                >
                  Enroll Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Certificate Verification */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Verify Certificates</h2>
            <p className="text-xl text-muted-foreground">
              Verify the authenticity of any CodeAcademy Pro certificate
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Certificate Verification</span>
                </CardTitle>
                <CardDescription>
                  Enter the certificate ID or verification code to verify authenticity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="verification">Certificate ID or Verification Code</Label>
                  <Input
                    id="verification"
                    placeholder="Enter certificate ID (e.g., CAP-2024-001234)"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    // Simulate verification
                    alert("Certificate verified! This is a valid CodeAcademy Pro certificate.");
                  }}
                >
                  Verify Certificate
                  <Eye className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Sample Verification Results */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Recent Verifications</h3>
              <div className="space-y-3">
                {verificationResults.map((result, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{result.name}</div>
                          <div className="text-sm text-muted-foreground">{result.certification}</div>
                          <div className="text-xs text-muted-foreground">Issued: {result.issued}</div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-600">{result.status}</Badge>
                          <div className="text-sm text-muted-foreground mt-1">{result.company}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Certificate Features</h2>
          <p className="text-xl text-muted-foreground">
            Our certificates come with powerful features to boost your career
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Download</h3>
              <p className="text-muted-foreground">Download your certificate in PDF format for easy sharing and printing</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Social Sharing</h3>
              <p className="text-muted-foreground">Share your achievement on LinkedIn, Twitter, and other social platforms</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Recognition</h3>
              <p className="text-muted-foreground">Recognized by employers worldwide in the tech industry</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Verification</h3>
              <p className="text-muted-foreground">Employers can instantly verify your certificate authenticity</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Tracking</h3>
              <p className="text-muted-foreground">Track your career progress and salary growth after certification</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Alumni Network</h3>
              <p className="text-muted-foreground">Join our exclusive alumni network for networking opportunities</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Certified?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have advanced their careers with our industry-recognized certifications
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Browse Certifications
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Download Sample Certificate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certification; 