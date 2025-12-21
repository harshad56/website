import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Calendar,
  MessageCircle,
  Video,
  MapPin,
  DollarSign,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  ArrowRight,
  ArrowLeft,
  Heart,
  Share2,
  Play,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  Bookmark,
  History,
  User,
  Briefcase,
  Globe,
  Smartphone,
  Monitor,
  Code,
  Database,
  Cloud,
  Brain,
  Lightbulb,
  GraduationCap
} from "lucide-react";

const MentorshipProgram = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const mentors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Senior Software Engineer",
      company: "Google",
      expertise: ["React", "TypeScript", "Node.js", "System Design"],
      experience: "8+ years",
      rating: 4.9,
      reviews: 127,
      hourlyRate: 150,
      availability: "Available",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      background: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop",
      bio: "Senior software engineer with 8+ years of experience building scalable web applications. Former tech lead at Google and passionate about mentoring developers.",
      achievements: ["Google Tech Lead", "Open Source Contributor", "Conference Speaker"],
      languages: ["English", "Spanish"],
      sessions: 245,
      students: 89,
      isVerified: true,
      isOnline: true
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Principal Data Scientist",
      company: "Netflix",
      expertise: ["Python", "Machine Learning", "Data Engineering", "AWS"],
      experience: "10+ years",
      rating: 4.8,
      reviews: 94,
      hourlyRate: 180,
      availability: "Limited",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      background: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
      bio: "Principal Data Scientist at Netflix with expertise in machine learning and big data. PhD in Computer Science and published author.",
      achievements: ["PhD Computer Science", "Published Author", "Kaggle Grandmaster"],
      languages: ["English", "Mandarin"],
      sessions: 189,
      students: 67,
      isVerified: true,
      isOnline: false
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Senior Frontend Developer",
      company: "Microsoft",
      expertise: ["JavaScript", "React", "Vue.js", "CSS"],
      experience: "6+ years",
      rating: 4.7,
      reviews: 156,
      hourlyRate: 120,
      availability: "Available",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      background: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      bio: "Senior Frontend Developer specializing in modern JavaScript frameworks and user experience design. Passionate about teaching and mentoring.",
      achievements: ["Microsoft MVP", "Frontend Mentor", "Community Leader"],
      languages: ["English", "Spanish"],
      sessions: 312,
      students: 134,
      isVerified: true,
      isOnline: true
    },
    {
      id: 4,
      name: "David Kim",
      title: "DevOps Engineer",
      company: "Amazon",
      expertise: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      experience: "7+ years",
      rating: 4.6,
      reviews: 78,
      hourlyRate: 140,
      availability: "Available",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      background: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
      bio: "DevOps Engineer with extensive experience in cloud infrastructure and automation. AWS certified solutions architect.",
      achievements: ["AWS Solutions Architect", "Kubernetes Administrator", "DevOps Expert"],
      languages: ["English", "Korean"],
      sessions: 167,
      students: 45,
      isVerified: true,
      isOnline: true
    },
    {
      id: 5,
      name: "Lisa Wang",
      title: "Product Manager",
      company: "Apple",
      expertise: ["Product Strategy", "User Research", "Agile", "Analytics"],
      experience: "9+ years",
      rating: 4.9,
      reviews: 203,
      hourlyRate: 160,
      availability: "Limited",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      background: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      bio: "Senior Product Manager with experience launching successful products at Apple and other tech companies. MBA from Stanford.",
      achievements: ["Stanford MBA", "Apple Product Manager", "Startup Advisor"],
      languages: ["English", "Mandarin"],
      sessions: 289,
      students: 98,
      isVerified: true,
      isOnline: false
    }
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesExpertise = selectedExpertise === "all" || mentor.expertise.includes(selectedExpertise);
    const matchesExperience = selectedExperience === "all" || mentor.experience.includes(selectedExperience);
    const matchesPrice = selectedPrice === "all" || 
                        (selectedPrice === "low" && mentor.hourlyRate < 100) ||
                        (selectedPrice === "medium" && mentor.hourlyRate >= 100 && mentor.hourlyRate < 150) ||
                        (selectedPrice === "high" && mentor.hourlyRate >= 150);
    
    return matchesSearch && matchesExpertise && matchesExperience && matchesPrice;
  });

  const sortedMentors = [...filteredMentors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.hourlyRate - b.hourlyRate;
      case "price-high":
        return b.hourlyRate - a.hourlyRate;
      case "experience":
        return parseInt(b.experience) - parseInt(a.experience);
      default:
        return 0;
    }
  });

  const myMentorships = [
    {
      id: 1,
      mentorName: "Dr. Sarah Johnson",
      mentorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
      topic: "React Advanced Patterns",
      nextSession: "2024-01-20 2:00 PM",
      totalSessions: 8,
      completedSessions: 5,
      status: "Active"
    },
    {
      id: 2,
      mentorName: "Michael Chen",
      mentorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      topic: "Machine Learning Fundamentals",
      nextSession: "2024-01-22 10:00 AM",
      totalSessions: 12,
      completedSessions: 3,
      status: "Active"
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      mentorName: "Dr. Sarah Johnson",
      topic: "React Advanced Patterns",
      date: "2024-01-20",
      time: "2:00 PM",
      duration: "60 min",
      type: "Video Call"
    },
    {
      id: 2,
      mentorName: "Michael Chen",
      topic: "Machine Learning Fundamentals",
      date: "2024-01-22",
      time: "10:00 AM",
      duration: "90 min",
      type: "Video Call"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton />
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Mentorship Program
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with industry experts and accelerate your career growth through personalized mentorship.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="mentors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
            <TabsTrigger value="my-mentorships">My Mentorships</TabsTrigger>
            <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="resources">Mentorship Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="mentors" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search mentors by name or expertise..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="experience">Most Experienced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                    <SelectTrigger>
                      <SelectValue placeholder="Expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Expertise</SelectItem>
                      <SelectItem value="React">React</SelectItem>
                      <SelectItem value="Python">Python</SelectItem>
                      <SelectItem value="AWS">AWS</SelectItem>
                      <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Experience</SelectItem>
                      <SelectItem value="5+ years">5+ years</SelectItem>
                      <SelectItem value="8+ years">8+ years</SelectItem>
                      <SelectItem value="10+ years">10+ years</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="low">Under $100/hr</SelectItem>
                      <SelectItem value="medium">$100-$150/hr</SelectItem>
                      <SelectItem value="high">Over $150/hr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {sortedMentors.length} mentor{sortedMentors.length !== 1 ? 's' : ''} found
              </p>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* Mentor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedMentors.map((mentor) => (
                <Card key={mentor.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={mentor.background}
                      alt={mentor.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      {mentor.isOnline && (
                        <Badge className="bg-green-500 text-white">Online</Badge>
                      )}
                      {mentor.isVerified && (
                        <Badge className="bg-blue-500 text-white">Verified</Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{mentor.name}</h3>
                        <p className="text-muted-foreground">{mentor.title}</p>
                        <p className="text-sm text-muted-foreground">{mentor.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{mentor.rating}</span>
                        <span className="text-sm text-muted-foreground">({mentor.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">${mentor.hourlyRate}/hr</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">{mentor.bio}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.expertise.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {mentor.expertise.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{mentor.expertise.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <p>{mentor.sessions} sessions • {mentor.students} students</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm">
                          Book Session
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-mentorships" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Active Mentorships</CardTitle>
                <CardDescription>
                  Track your ongoing mentorship programs and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myMentorships.map((mentorship) => (
                    <div key={mentorship.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={mentorship.mentorAvatar}
                        alt={mentorship.mentorName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{mentorship.mentorName}</h4>
                        <p className="text-sm text-muted-foreground">{mentorship.topic}</p>
                        <p className="text-xs text-muted-foreground">
                          Next session: {mentorship.nextSession}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{mentorship.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {mentorship.completedSessions}/{mentorship.totalSessions} sessions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>
                  Your scheduled mentorship sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Video className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{session.mentorName}</h4>
                          <p className="text-sm text-muted-foreground">{session.topic}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.date} at {session.time} • {session.duration}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{session.type}</Badge>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button size="sm">
                            Join Session
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Mentorship Guide</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn how to make the most of your mentorship experience
                  </p>
                  <Button>Read Guide</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Goal Setting</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set clear goals and track your progress with mentors
                  </p>
                  <Button>Set Goals</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Success Stories</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Read inspiring stories from successful mentorship relationships
                  </p>
                  <Button>Read Stories</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MentorshipProgram; 