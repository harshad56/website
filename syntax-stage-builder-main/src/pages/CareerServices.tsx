import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  FileText, 
  Video, 
  MessageSquare, 
  Briefcase,
  DollarSign,
  CheckCircle,
  Award,
  TrendingUp,
  UserCheck,
  BookOpen,
  Target
} from "lucide-react";

const CareerServices = () => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const services = [
    {
      id: "resume-review",
      title: "Resume Review & Optimization",
      description: "Get expert feedback on your resume to make it stand out to employers",
      duration: "45 min",
      price: "$99",
      rating: 4.9,
      reviews: 1247,
      features: [
        "Professional resume analysis",
        "ATS optimization tips",
        "Industry-specific recommendations",
        "Cover letter review included",
        "Follow-up consultation"
      ],
      icon: FileText,
      color: "from-blue-600 to-purple-600"
    },
    {
      id: "mock-interview",
      title: "Mock Technical Interview",
      description: "Practice technical interviews with industry experts",
      duration: "60 min",
      price: "$149",
      rating: 4.8,
      reviews: 892,
      features: [
        "Realistic technical questions",
        "Behavioral interview practice",
        "Performance feedback",
        "Interview strategies",
        "Recording for review"
      ],
      icon: Video,
      color: "from-green-600 to-teal-600"
    },
    {
      id: "career-coaching",
      title: "Career Coaching Session",
      description: "One-on-one career guidance and planning",
      duration: "90 min",
      price: "$199",
      rating: 4.9,
      reviews: 567,
      features: [
        "Career path planning",
        "Skill gap analysis",
        "Salary negotiation tips",
        "Networking strategies",
        "Action plan creation"
      ],
      icon: MessageSquare,
      color: "from-purple-600 to-pink-600"
    },
    {
      id: "job-search",
      title: "Job Search Strategy",
      description: "Comprehensive job search and application strategy",
      duration: "75 min",
      price: "$129",
      rating: 4.7,
      reviews: 734,
      features: [
        "Job market analysis",
        "Application strategy",
        "LinkedIn optimization",
        "Networking plan",
        "Follow-up templates"
      ],
      icon: Briefcase,
      color: "from-orange-600 to-red-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer",
      company: "TechCorp",
      content: "The resume review service helped me land interviews at top tech companies. The feedback was incredibly detailed and actionable.",
      rating: 5,
      service: "Resume Review"
    },
    {
      name: "Michael Rodriguez",
      role: "Backend Engineer",
      company: "StartupXYZ",
      content: "The mock interview was exactly what I needed. The interviewer asked realistic questions and gave me valuable feedback on my responses.",
      rating: 5,
      service: "Mock Interview"
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist",
      company: "DataFlow Inc",
      content: "Career coaching helped me transition from academia to industry. The coach provided clear guidance and actionable steps.",
      rating: 5,
      service: "Career Coaching"
    }
  ];

  const stats = [
    { label: "Success Rate", value: "94%", description: "Students land jobs within 6 months" },
    { label: "Average Salary Increase", value: "$15K", description: "After career services" },
    { label: "Interview Success Rate", value: "87%", description: "After mock interview practice" },
    { label: "Satisfaction Rate", value: "98%", description: "Student satisfaction score" }
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
              Career Services
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Launch Your Tech Career
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Get expert guidance, practice interviews, and optimize your job search with our comprehensive career services
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>2,500+ Students Helped</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-current" />
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>94% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Professional Career Services</h2>
          <p className="text-xl text-muted-foreground">
            Choose the service that best fits your career goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <Card key={service.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${service.color}`}></div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${service.color} text-white`}>
                      <service.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="mt-1">{service.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                    <div className="text-sm text-muted-foreground">{service.duration}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    <span className="font-semibold">{service.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({service.reviews} reviews)</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setSelectedService(service.id)}
                >
                  Book Session
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Booking Section */}
      {selectedService && (
        <div className="container mx-auto px-6 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Book Your Session</CardTitle>
              <CardDescription>
                Schedule your {services.find(s => s.id === selectedService)?.title.toLowerCase()} session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific areas you'd like to focus on..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions
                </Label>
              </div>

              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedService("")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Testimonials Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-xl text-muted-foreground">
            Success stories from students who used our career services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="mt-3">
                  {testimonial.service}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Advance Your Career?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully launched their tech careers with our expert guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              View All Services
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerServices; 