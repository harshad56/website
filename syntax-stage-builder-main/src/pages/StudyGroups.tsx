import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
import { 
  Search, 
  Filter, 
  Users, 
  Clock, 
  Calendar,
  MessageCircle,
  Video,
  MapPin,
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
  Plus,
  Settings,
  Edit,
  Trash2,
  Crown,
  Star,
  Globe,
  Smartphone,
  Monitor,
  Code,
  Database,
  Cloud,
  Brain,
  Lightbulb,
  GraduationCap,
  Lock,
  Unlock
} from "lucide-react";

const StudyGroups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const studyGroups = [
    {
      id: 1,
      name: "React Masters",
      topic: "React",
      level: "Intermediate",
      description: "Deep dive into React patterns, hooks, and advanced concepts. Perfect for developers looking to master React.",
      members: 24,
      maxMembers: 30,
      isPrivate: false,
      isActive: true,
      createdBy: "Sarah Johnson",
      createdDate: "2024-01-10",
      nextMeeting: "2024-01-20 2:00 PM",
      meetingFrequency: "Weekly",
      avatar: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop",
      tags: ["React", "JavaScript", "Frontend"],
      isMember: true,
      isAdmin: false
    },
    {
      id: 2,
      name: "Python Data Science",
      topic: "Python",
      level: "Advanced",
      description: "Advanced Python programming for data science and machine learning. Focus on pandas, numpy, and scikit-learn.",
      members: 18,
      maxMembers: 25,
      isPrivate: true,
      isActive: true,
      createdBy: "Michael Chen",
      createdDate: "2024-01-05",
      nextMeeting: "2024-01-18 7:00 PM",
      meetingFrequency: "Bi-weekly",
      avatar: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=100&h=100&fit=crop",
      tags: ["Python", "Data Science", "Machine Learning"],
      isMember: false,
      isAdmin: false
    },
    {
      id: 3,
      name: "JavaScript Fundamentals",
      topic: "JavaScript",
      level: "Beginner",
      description: "Learn JavaScript from scratch. Perfect for beginners who want to build a strong foundation.",
      members: 35,
      maxMembers: 40,
      isPrivate: false,
      isActive: true,
      createdBy: "Emily Rodriguez",
      createdDate: "2024-01-08",
      nextMeeting: "2024-01-19 6:00 PM",
      meetingFrequency: "Weekly",
      avatar: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=100&h=100&fit=crop",
      tags: ["JavaScript", "ES6", "DOM"],
      isMember: true,
      isAdmin: true
    },
    {
      id: 4,
      name: "AWS Cloud Engineers",
      topic: "AWS",
      level: "Intermediate",
      description: "Master AWS services and cloud architecture. Hands-on projects and real-world scenarios.",
      members: 15,
      maxMembers: 20,
      isPrivate: false,
      isActive: true,
      createdBy: "David Kim",
      createdDate: "2024-01-12",
      nextMeeting: "2024-01-21 8:00 PM",
      meetingFrequency: "Weekly",
      avatar: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop",
      tags: ["AWS", "Cloud", "DevOps"],
      isMember: false,
      isAdmin: false
    },
    {
      id: 5,
      name: "System Design Experts",
      topic: "System Design",
      level: "Advanced",
      description: "Advanced system design and architecture patterns. Prepare for technical interviews and real-world challenges.",
      members: 12,
      maxMembers: 15,
      isPrivate: true,
      isActive: true,
      createdBy: "Lisa Wang",
      createdDate: "2024-01-15",
      nextMeeting: "2024-01-22 9:00 PM",
      meetingFrequency: "Weekly",
      avatar: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
      tags: ["System Design", "Architecture", "Scalability"],
      isMember: true,
      isAdmin: false
    }
  ];

  // Memoize filtered and sorted groups to prevent recalculation
  const filteredGroups = useMemo(() => studyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTopic = selectedTopic === "all" || group.topic === selectedTopic;
    const matchesLevel = selectedLevel === "all" || group.level === selectedLevel;
    const matchesSize = selectedSize === "all" || 
                       (selectedSize === "small" && group.members < 15) ||
                       (selectedSize === "medium" && group.members >= 15 && group.members < 30) ||
                       (selectedSize === "large" && group.members >= 30);
    
    return matchesSearch && matchesTopic && matchesLevel && matchesSize;
  }), [searchQuery, selectedTopic, selectedLevel, selectedSize]);

  const sortedGroups = useMemo(() => [...filteredGroups].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      case "members":
        return b.members - a.members;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  }), [filteredGroups, sortBy]);

  const myGroups = useMemo(() => studyGroups.filter(group => group.isMember), []);
  const myAdminGroups = useMemo(() => studyGroups.filter(group => group.isAdmin), []);

  const upcomingMeetings = [
    {
      id: 1,
      groupName: "React Masters",
      topic: "Advanced Hooks and Custom Hooks",
      date: "2024-01-20",
      time: "2:00 PM",
      duration: "90 min",
      participants: 18,
      type: "Video Call"
    },
    {
      id: 2,
      groupName: "JavaScript Fundamentals",
      topic: "ES6 Features and Modern JavaScript",
      date: "2024-01-19",
      time: "6:00 PM",
      duration: "60 min",
      participants: 28,
      type: "Video Call"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      groupName: "React Masters",
      activity: "New member joined: Alex Thompson",
      time: "2 hours ago",
      type: "member"
    },
    {
      id: 2,
      groupName: "JavaScript Fundamentals",
      activity: "New discussion started: 'Understanding Closures'",
      time: "4 hours ago",
      type: "discussion"
    },
    {
      id: 3,
      groupName: "System Design Experts",
      activity: "Meeting scheduled for tomorrow at 9:00 PM",
      time: "1 day ago",
      type: "meeting"
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Study Groups - CodeAcademy Pro",
    "description": "Join study groups, collaborate with peers, and learn programming together. Connect with other learners and grow your skills.",
    "url": "http://localhost:3000/study-groups"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Study Groups - Join Programming Study Groups | CodeAcademy Pro"
        description="Join study groups, collaborate with peers, and learn programming together. Connect with other learners, attend virtual meetings, and grow your skills in a supportive community."
        keywords="study groups, programming study groups, coding groups, learn programming together, peer learning, coding community, programming community"
        structuredData={structuredData}
      />
      
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton />
      </div>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Study Groups
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join collaborative learning communities, share knowledge, and accelerate your learning journey with peers.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="all-groups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-groups">All Groups</TabsTrigger>
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
            <TabsTrigger value="meetings">Upcoming Meetings</TabsTrigger>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="all-groups" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search study groups..."
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
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="members">Most Members</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      <SelectItem value="React">React</SelectItem>
                      <SelectItem value="JavaScript">JavaScript</SelectItem>
                      <SelectItem value="Python">Python</SelectItem>
                      <SelectItem value="AWS">AWS</SelectItem>
                      <SelectItem value="System Design">System Design</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Group Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sizes</SelectItem>
                      <SelectItem value="small">Small (1-15)</SelectItem>
                      <SelectItem value="medium">Medium (15-30)</SelectItem>
                      <SelectItem value="large">Large (30+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {sortedGroups.length} group{sortedGroups.length !== 1 ? 's' : ''} found
              </p>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedGroups.map((group) => (
                <Card key={group.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      {group.isPrivate ? (
                        <Badge className="bg-gray-500 text-white">
                          <Lock className="w-3 h-3 mr-1" />
                          Private
                        </Badge>
                      ) : (
                        <Badge className="bg-green-500 text-white">
                          <Unlock className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
                      )}
                      {group.isActive && (
                        <Badge className="bg-blue-500 text-white">Active</Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <p className="text-muted-foreground">{group.topic} • {group.level}</p>
                      </div>
                      {group.isAdmin && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{group.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {group.members}/{group.maxMembers}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {group.meetingFrequency}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {group.nextMeeting}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Created by {group.createdBy}
                      </div>
                      <div className="flex items-center gap-2">
                        {group.isMember ? (
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Manage
                          </Button>
                        ) : (
                          <Button size="sm">
                            Join Group
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-groups" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Groups */}
              <Card>
                <CardHeader>
                  <CardTitle>My Groups</CardTitle>
                  <CardDescription>
                    Groups you're a member of
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myGroups.map((group) => (
                      <div key={group.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img
                          src={group.avatar}
                          alt={group.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{group.name}</h4>
                          <p className="text-sm text-muted-foreground">{group.topic} • {group.level}</p>
                          <p className="text-xs text-muted-foreground">
                            {group.members}/{group.maxMembers} members
                          </p>
                        </div>
                        <div className="text-right">
                          {group.isAdmin && (
                            <Badge variant="outline" className="mb-2">
                              <Crown className="w-3 h-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            View Group
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Groups I Admin */}
              <Card>
                <CardHeader>
                  <CardTitle>Groups I Admin</CardTitle>
                  <CardDescription>
                    Groups you created and manage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myAdminGroups.map((group) => (
                      <div key={group.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img
                          src={group.avatar}
                          alt={group.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{group.name}</h4>
                          <p className="text-sm text-muted-foreground">{group.topic} • {group.level}</p>
                          <p className="text-xs text-muted-foreground">
                            {group.members}/{group.maxMembers} members
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>
                  Your scheduled study group meetings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Video className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{meeting.groupName}</h4>
                          <p className="text-sm text-muted-foreground">{meeting.topic}</p>
                          <p className="text-xs text-muted-foreground">
                            {meeting.date} at {meeting.time} • {meeting.duration} • {meeting.participants} participants
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{meeting.type}</Badge>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button size="sm">
                            Join Meeting
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest updates from your study groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        {activity.type === "member" && <User className="w-5 h-5" />}
                        {activity.type === "discussion" && <MessageCircle className="w-5 h-5" />}
                        {activity.type === "meeting" && <Calendar className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{activity.groupName}</h4>
                        <p className="text-sm text-muted-foreground">{activity.activity}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudyGroups; 