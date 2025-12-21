import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  TrendingUp, 
  Heart,
  BookOpen,
  Code,
  GraduationCap,
  Briefcase,
  Star,
  CheckCircle,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github
} from "lucide-react";

const AboutUs = () => {
  const stats = [
    { label: "Students Worldwide", value: "100K+", icon: Users },
    { label: "Countries Reached", value: "150+", icon: Globe },
    { label: "Success Rate", value: "94%", icon: Award },
    { label: "Years of Excellence", value: "8+", icon: TrendingUp }
  ];

  const values = [
    {
      icon: Heart,
      title: "Student Success First",
      description: "Every decision we make is centered around student success and career advancement."
    },
    {
      icon: Code,
      title: "Innovation in Education",
      description: "We continuously innovate our teaching methods and technology to provide the best learning experience."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Making quality education accessible to everyone, regardless of their location or background."
    },
    {
      icon: Users,
      title: "Community-Driven",
      description: "Building a supportive community where learners can connect, collaborate, and grow together."
    }
  ];

  const team = [
    {
      name: "Harshad Bagal",
      role: "CEO & Founder",
      bio: "Mca student at bharti vidyapeeth institute of technology,navi mumbai.",
      image: "SC",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      bio: "Ex-Microsoft architect with expertise in scalable learning platforms and AI-driven education.",
      image: "MR",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Emily Johnson",
      role: "Head of Education",
      bio: "Curriculum designer with 10+ years experience in online learning and instructional design.",
      image: "EJ",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "David Kim",
      role: "Head of Career Services",
      bio: "Former recruiter at top tech companies, helping students land their dream jobs.",
      image: "DK",
      linkedin: "#",
      twitter: "#"
    }
  ];

  const milestones = [
    {
      year: "2025",
      title: "Founded",
      description: "CodeAcademy Pro was founded with a mission to democratize tech education."
    },
    {
      year: "2025",
      title: "First 10K Students",
      description: "Reached our first milestone of 10,000 students worldwide."
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Expanded to 50+ countries and launched mobile app."
    },
    {
      year: "2025",
      title: "AI Integration",
      description: "Launched AI-powered learning assistant and personalized curriculum."
    },
    {
      year: "2025",
      title: "100K+ Students",
      description: "Celebrated 100,000+ students and 94% job placement rate."
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
              About Us
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Transforming Tech Education
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              We're on a mission to make world-class programming education accessible to everyone, 
              helping millions of people build successful careers in technology.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground mb-6">
                To democratize access to high-quality programming education and empower individuals 
                worldwide to build successful careers in technology, regardless of their background 
                or location.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Accessible Learning</h3>
                    <p className="text-muted-foreground">Making quality education available to everyone</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Career-Focused</h3>
                    <p className="text-muted-foreground">Practical skills that lead to real job opportunities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Innovation-Driven</h3>
                    <p className="text-muted-foreground">Cutting-edge technology and teaching methods</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-lg text-blue-100">
                  To become the world's leading platform for programming education, 
                  helping millions of people achieve their dreams in technology and 
                  contributing to a more inclusive and innovative tech industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-muted-foreground">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">
              The passionate people behind CodeAcademy Pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                    {member.image}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Twitter className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-xl text-muted-foreground">
            Key milestones in our mission to transform tech education
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-muted-foreground">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground">hello@codeacademypro.com</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-muted-foreground">San Francisco, CA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Be part of the movement to democratize tech education and help millions 
            of people build successful careers in technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Learning
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Join Our Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 