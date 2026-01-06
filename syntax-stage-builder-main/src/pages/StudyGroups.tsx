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

import { apiService } from "@/services/ApiService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
// Kept as fallback or initial state type definition aid
const MOCK_GROUPS: StudyGroup[] = [];

const StudyGroups = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [activeTab, setActiveTab] = useState("explore");

  const joinGroup = async (groupId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({ title: "Login Required", description: "You must be logged in to join a group.", variant: "destructive" });
      return;
    }
    try {
      const res = await apiService.joinStudyGroup(groupId);
      if (res.success) {
        toast({ title: "Welcome!", description: "You have joined the group." });
        navigate(`/study-groups/${groupId}`);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to join group", variant: "destructive" });
    }
  };

  const visitGroup = (groupId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/study-groups/${groupId}`);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const [groupsRes, myGroupsRes] = await Promise.all([
          apiService.getStudyGroups(),
          user ? apiService.getMyStudyGroups() : Promise.resolve({ success: true, data: [] })
        ]);

        if (groupsRes.success && Array.isArray(groupsRes.data)) {
          const myGroupIds = new Set((myGroupsRes.data || []).map((g: any) => g.id));

          const mappedGroups: StudyGroup[] = groupsRes.data.map((g: any) => ({
            id: g.id,
            name: g.name,
            topic: g.topic,
            level: g.level,
            description: g.description,
            members: g.members || 0,
            maxMembers: g.max_members || 10,
            isPrivate: g.is_private || false,
            isActive: g.is_active,
            createdBy: g.created_by,
            createdDate: g.created_at,
            nextMeeting: g.next_meeting,
            meetingFrequency: g.meeting_frequency,
            avatar: g.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${g.name}`,
            tags: g.tags || [],
            isMember: myGroupIds.has(g.id),
            isAdmin: false,
            gradient: g.gradient || 'from-indigo-600 to-violet-600'
          }));
          setGroups(mappedGroups);
        }
      } catch (error) {
        console.error("Failed to fetch study groups", error);
        toast({ title: "Error", description: "Failed to load study groups", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [toast, user]);

  // Simulated filtering usually handled by backend
  const filteredGroups = useMemo(() => groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === "all" || group.topic === selectedTopic;
    const matchesLevel = selectedLevel === "all" || group.level === selectedLevel;


    return matchesSearch && matchesTopic && matchesLevel;
  }), [groups, searchQuery, selectedTopic, selectedLevel]);

  const myGroups = groups.filter(g => g.isMember);
  const featuredGroup = groups.length > 0 ? groups[0] : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Join Coding Study Groups | CodeAcademy Pro",
    "description": "Collaborate with developers in focused study groups for Python, JavaScript, React, and more. Master programming together.",
    "url": window.location.href,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": groups.slice(0, 5).map((group, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Event",
          "name": group.name,
          "description": group.description,
          "startDate": group.nextMeeting || new Date().toISOString(),
          "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
          "location": {
            "@type": "VirtualLocation",
            "url": window.location.href // Should replace with actual meeting link if public
          },
          "organizer": {
            "@type": "Organization",
            "name": "CodeAcademy Pro Community"
          }
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 pb-20 relative overflow-x-hidden">
      <SEO
        title="Study Groups - Collaborative Coding Communities | CodeAcademy Pro"
        description="Join elite study groups, collaborate with peers, and master programming together. Find your squad for Python, React, Java, and more."
        keywords="coding study groups, programming community, learn to code together, developer squads, python study group, javascript learning community, pair programming"
        image="https://codeacademy.vercel.app/og-study-groups.jpg"
        structuredData={structuredData}
      />

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[100px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full animate-pulse-slow delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Navigation Bar */}
        <div className="py-6 flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:flex text-slate-400 hover:text-white">
              <MessageCircle className="w-5 h-5 mr-2" /> Community Guidelines
            </Button>
            <div className="hidden md:block h-4 w-px bg-white/10"></div>
            <Button className="hidden md:flex bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 shadow-lg shadow-indigo-600/20">
              <Plus className="w-4 h-4 mr-2" /> Start A Group
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <header className="mb-12 text-center max-w-3xl mx-auto pt-4 md:pt-8">
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-white leading-tight"
          >
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-400">Squad</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-400 leading-relaxed mb-8 px-4"
          >
            Connect with developers who share your passion. Master complex topics together, accountability, and grow your network.
          </motion.p>
        </header>

        {/* Featured Group Banner - Mobile Optimized */}
        {featuredGroup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-[32px] bg-gradient-to-r from-indigo-900/50 to-blue-900/50 border border-white/10 p-1 relative overflow-hidden mb-16 max-w-5xl mx-auto shadow-2xl"
          >
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
            <div className="relative bg-[#020617]/80 backdrop-blur-xl rounded-[28px] overflow-hidden">
              <div className="flex flex-col md:flex-row items-stretch md:items-center">
                <div className="p-8 md:p-10 flex-1 space-y-6 order-2 md:order-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1">Featured Community</Badge>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-slate-400 font-medium">+21 active now</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white leading-tight">{featuredGroup.name}</h2>
                  <p className="text-slate-400 text-lg">{featuredGroup.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Button size="lg" className="w-full sm:w-auto rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-600/20">
                      Join Discussion <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl h-12 px-8 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold backdrop-blur-sm">
                      View Curriculum
                    </Button>
                  </div>
                </div>
                <div className="w-full md:w-[320px] h-48 md:h-auto relative group order-1 md:order-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${featuredGroup.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" alt="Community" className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#020617] to-transparent md:hidden" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="explore" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="sticky top-0 z-30 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 pb-1 -mx-4 px-4 md:static md:bg-transparent md:border-none md:p-0 md:mx-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 pt-4 md:pt-0">
              <TabsList className="bg-transparent h-12 p-0 w-full md:w-auto flex overflow-x-auto no-scrollbar snap-x">
                {['explore', 'my-groups', 'calendar'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="snap-start flex-shrink-0 data-[state=active]:bg-transparent data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-indigo-500 rounded-none h-full px-4 md:px-0 mr-6 transition-all font-bold text-base"
                  >
                    {tab === 'explore' && 'Explore Groups'}
                    {tab === 'my-groups' && (
                      <span className="flex items-center">
                        My Squads <Badge className="ml-2 bg-indigo-500/20 text-indigo-400 border-0">{myGroups.length}</Badge>
                      </span>
                    )}
                    {tab === 'calendar' && 'Events'}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Search Bar - Only visible on Explore */}
              {activeTab === 'explore' && (
                <div className="flex items-center gap-3 w-full md:w-auto pb-4 md:pb-0">
                  <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <Input
                      placeholder="Search topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-900/50 border-white/10 rounded-xl pl-9 focus-visible:ring-indigo-500/50 transition-all w-full"
                    />
                  </div>
                  <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-slate-900/50 hover:bg-white/10 flex-shrink-0">
                    <Filter className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <TabsContent value="explore" className="space-y-8">
            {/* Filters - Mobile Scrollable */}
            <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar snap-x -mx-4 px-4 md:mx-0 md:px-0">
              {['all', ...Array.from(new Set(groups.map(g => g.topic))).sort()].map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`snap-start flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedTopic === topic ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
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
                    whileTap={{ scale: 0.98 }}
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
                          <div className="w-14 h-14 rounded-2xl bg-slate-900 p-1 shadow-xl ring-4 ring-[#020617]/50">
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
                          <Button
                            size="sm"
                            variant={group.isMember ? "secondary" : "default"}
                            className={`rounded-xl font-bold px-6 ${!group.isMember && 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'}`}
                            onClick={(e) => group.isMember ? visitGroup(group.id, e) : joinGroup(group.id, e)}
                          >
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
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="bg-[#1e293b] border-indigo-500/20 hover:border-indigo-500/40 transition-all group rounded-[24px]">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-white">
                        <span className="text-xl font-bold">{group.name}</span>
                        <Badge className="bg-indigo-500/20 text-indigo-300 border-0">Member</Badge>
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
                      <Button
                        className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-11 transition-colors"
                        onClick={(e) => visitGroup(group.id, e)}
                      >
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

      {/* Mobile Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 border border-indigo-400/20"
      >
        <Plus className="w-7 h-7" />
      </motion.button>

    </div>
  );
};

export default StudyGroups;