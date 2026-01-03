import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Target,
  TrendingUp,
  ArrowRight,
  Heart,
  Share2,
  CheckCircle,
  Sparkles,
  Zap,
  User,
  Plus,
  Settings,
  Edit,
  Crown,
  Lock,
  Unlock,
  Globe,
  Code2
} from "lucide-react";

// --- Interfaces for Backend Readiness ---
interface StudyGroup {
  id: number;
  name: string;
  topic: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  members: number;
  maxMembers: number;
  isPrivate: boolean;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  nextMeeting?: string;
  meetingFrequency: string;
  avatar: string;
  tags: string[];
  isMember: boolean;
  isAdmin: boolean;
  gradient: string;
}

interface Activity {
  id: number;
  groupName: string;
  groupId: number;
  type: "member" | "discussion" | "meeting" | "resource";
  content: string;
  time: string;
  user?: string;
}

// --- Mock Data Service (Replace with API calls later) ---
const MOCK_GROUPS: StudyGroup[] = [
  {
    id: 1,
    name: "React Masters",
    topic: "React",
    level: "Intermediate",
    description: "Deep dive into React patterns, hooks, and advanced concepts. Perfect for developers looking to master React ecosystem.",
    members: 24,
    maxMembers: 30,
    isPrivate: false,
    isActive: true,
    createdBy: "Sarah Johnson",
    createdDate: "2024-01-10",
    nextMeeting: "2024-01-20T14:00:00",
    meetingFrequency: "Weekly",
    avatar: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop",
    tags: ["React", "JavaScript", "Frontend"],
    isMember: true,
    isAdmin: false,
    gradient: "from-cyan-500 to-blue-500"
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
    nextMeeting: "2024-01-18T19:00:00",
    meetingFrequency: "Bi-weekly",
    avatar: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=100&h=100&fit=crop",
    tags: ["Python", "Data Science", "ML"],
    isMember: false,
    isAdmin: false,
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    id: 3,
    name: "JavaScript Fundamentals",
    topic: "JavaScript",
    level: "Beginner",
    description: "Learn JavaScript from scratch. Perfect for beginners who want to build a strong foundation in web development.",
    members: 35,
    maxMembers: 40,
    isPrivate: false,
    isActive: true,
    createdBy: "Emily Rodriguez",
    createdDate: "2024-01-08",
    nextMeeting: "2024-01-19T18:00:00",
    meetingFrequency: "Weekly",
    avatar: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=100&h=100&fit=crop",
    tags: ["JavaScript", "ES6", "DOM"],
    isMember: true,
    isAdmin: true,
    gradient: "from-yellow-300 to-yellow-500"
  },
  {
    id: 4,
    name: "AWS Cloud Architects",
    topic: "AWS",
    level: "Intermediate",
    description: "Master AWS services and cloud architecture. Hands-on projects and real-world scenarios for certification prep.",
    members: 15,
    maxMembers: 20,
    isPrivate: false,
    isActive: true,
    createdBy: "David Kim",
    createdDate: "2024-01-12",
    nextMeeting: "2024-01-21T20:00:00",
    meetingFrequency: "Weekly",
    avatar: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop",
    tags: ["AWS", "Cloud", "DevOps"],
    isMember: false,
    isAdmin: false,
    gradient: "from-orange-400 to-pink-500"
  },
  {
    id: 5,
    name: "System Design Pros",
    topic: "System Design",
    level: "Advanced",
    description: "Advanced system design and architecture patterns. Prepare for technical interviews and real-world scale challenges.",
    members: 12,
    maxMembers: 15,
    isPrivate: true,
    isActive: true,
    createdBy: "Lisa Wang",
    createdDate: "2024-01-15",
    nextMeeting: "2024-01-22T21:00:00",
    meetingFrequency: "Weekly",
    avatar: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
    tags: ["System Design", "Architecture"],
    isMember: true,
    isAdmin: false,
    gradient: "from-purple-500 to-indigo-500"
  }
];

const StudyGroups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [activeTab, setActiveTab] = useState("explore");

  // Simulated filtering usually handled by backend
  const filteredGroups = useMemo(() => MOCK_GROUPS.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === "all" || group.topic === selectedTopic;
    const matchesLevel = selectedLevel === "all" || group.level === selectedLevel;

    return matchesSearch && matchesTopic && matchesLevel;
  }), [searchQuery, selectedTopic, selectedLevel]);

  const myGroups = MOCK_GROUPS.filter(g => g.isMember);
  const featuredGroup = MOCK_GROUPS[0];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 pb-20">
      <SEO
        title="Study Groups - Collaborative Learning | CodeAcademy Pro"
        description="Join elite study groups, collaborate with peers, and master programming together."
      />

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse-slow delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Navigation Bar */}
        <div className="py-6 flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <MessageCircle className="w-5 h-5 mr-2" /> Community Guidelines
            </Button>
            <div className="h-4 w-px bg-white/10"></div>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6">
              <Plus className="w-4 h-4 mr-2" /> Start A Group
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <header className="mb-12 text-center max-w-3xl mx-auto pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Collaborative Learning</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white"
          >
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-400">Squad</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed mb-8"
          >
            Connect with developers who share your passion. Master complex topics together, accountability, and grow your network.
          </motion.p>
        </header>

        {/* Featured Group Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-[32px] bg-gradient-to-r from-indigo-900/50 to-blue-900/50 border border-white/10 p-1 relative overflow-hidden mb-16 max-w-5xl mx-auto shadow-2xl"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
          <div className="relative bg-[#020617]/80 backdrop-blur-xl rounded-[28px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1">Featured Community</Badge>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-400 font-medium">+21 active now</span>
              </div>
              <h2 className="text-3xl font-bold text-white">{featuredGroup.name}</h2>
              <p className="text-slate-400 text-lg">{featuredGroup.description}</p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="lg" className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-500 font-bold">
                  Join Discussion <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-xl h-12 px-8 border-white/10 hover:bg-white/5 text-slate-300">
                  View Curriculum
                </Button>
              </div>
            </div>
            <div className="w-full md:w-[320px] aspect-sqaure md:aspect-auto rounded-2xl overflow-hidden relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${featuredGroup.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" alt="Community" className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="explore" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-1">
            <TabsList className="bg-transparent h-12 p-0 space-x-6">
              <TabsTrigger value="explore" className="data-[state=active]:bg-transparent data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-indigo-500 rounded-none h-full px-0 transition-all font-bold text-base">
                Explore Groups
              </TabsTrigger>
              <TabsTrigger value="my-groups" className="data-[state=active]:bg-transparent data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-indigo-500 rounded-none h-full px-0 transition-all font-bold text-base">
                My Squads <Badge className="ml-2 bg-indigo-500/20 text-indigo-400 border-0">{myGroups.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-transparent data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-indigo-500 rounded-none h-full px-0 transition-all font-bold text-base">
                Events
              </TabsTrigger>
            </TabsList>

            {/* Search Bar - Only visible on Explore */}
            {activeTab === 'explore' && (
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative group flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    placeholder="Search topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-900/50 border-white/10 rounded-xl pl-9 focus-visible:ring-indigo-500/50 transition-all"
                  />
                </div>
                <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-slate-900/50 hover:bg-white/10">
                  <Filter className="w-4 h-4 text-slate-400" />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="explore" className="space-y-8">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['all', 'React', 'JavaScript', 'Python', 'AWS', 'System Design'].map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedTopic === topic ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                >
                  {topic === 'all' ? 'All Topics' : topic}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredGroups.map((group, i) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="bg-slate-900/40 backdrop-blur-sm border-white/10 hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden rounded-[24px]">
                      <div className={`h-28 bg-gradient-to-br ${group.gradient} p-6 relative`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <Badge className={`absolute top-4 right-4 backdrop-blur-md ${group.isPrivate ? 'bg-slate-900/50 text-slate-200' : 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30'}`}>
                          {group.isPrivate ? <Lock className="w-3 h-3 mr-1" /> : <Globe className="w-3 h-3 mr-1" />}
                          {group.isPrivate ? 'Private' : 'Public'}
                        </Badge>
                        <div className="absolute -bottom-6 left-6">
                          <div className="w-14 h-14 rounded-2xl bg-slate-900 p-1 shadow-xl">
                            <img src={group.avatar} alt={group.name} className="w-full h-full rounded-xl object-cover" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="pt-10 px-6 pb-6 space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{group.name}</h3>
                            {group.isAdmin && <Crown className="w-5 h-5 text-amber-400" />}
                          </div>
                          <p className="text-sm text-slate-400 line-clamp-2">{group.description}</p>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {group.members}/{group.maxMembers}</span>
                          <span className="w-1 h-1 bg-white/10 rounded-full" />
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {group.meetingFrequency}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {group.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/5">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[8px]">
                                <User className="w-3 h-3 text-slate-500" />
                              </div>
                            ))}
                          </div>
                          <Button size="sm" variant={group.isMember ? "secondary" : "default"} className={`rounded-xl font-bold px-6 ${!group.isMember && 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
                            {group.isMember ? 'Visit' : 'Join'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="my-groups">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGroups.map((group, i) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-indigo-900/20 to-slate-900/40 border-indigo-500/20 hover:border-indigo-500/40 transition-all group rounded-[24px]">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-xl font-bold">{group.name}</span>
                        <Badge className="bg-indigo-500/20 text-indigo-300">Member</Badge>
                      </CardTitle>
                      <CardDescription className="text-slate-400">{group.topic} Chapter</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Next Meeting</span>
                          <span className="text-indigo-400 font-bold">In 2 days</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="w-2/3 h-full bg-indigo-500 rounded-full" />
                        </div>
                        <p className="text-xs text-slate-500">Mastering Async/Await Patterns</p>
                      </div>
                      <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-11">
                        Go To Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default StudyGroups; 