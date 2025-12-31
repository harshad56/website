import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/BackButton";
import {
  CheckCircle2,
  PlayCircle,
  Rocket,
  Sparkles,
  Timer,
  Zap,
  BookOpen,
  Target,
  ArrowRight,
  Monitor,
  Video,
  Users
} from "lucide-react";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";

import { useEffect, useState, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { useAuth } from "@/contexts/AuthContext";

const InteractiveTutorials = () => {
  const { user } = useAuth();
  const [dbTutorials, setDbTutorials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const res = await apiService.getTutorials();
        if (res.success && res.data) {
          setDbTutorials(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch tutorials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutorials();
  }, []);

  const tracks = [
    // ... existing tracks (can be merged with dbTutorials if schema matches exactly)
    {
      title: "Foundations",
      description: "Guided introductions to syntax, variables, and control flow across 12 languages.",
      lessons: 42,
      duration: "6h total",
      badge: "Beginner",
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      color: "from-blue-500/20 to-indigo-500/20"
    },
    {
      title: "Applied Projects",
      description: "Tutorials that walk through building dashboards, APIs, and automation bots.",
      lessons: 28,
      duration: "8 guided builds",
      badge: "Hands-on",
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Debug Labs",
      description: "Fix broken code with hints, checkpoints, and AI explanations.",
      lessons: 18,
      duration: "45 bite-size labs",
      badge: "Challenge",
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      color: "from-amber-500/20 to-orange-500/20"
    }
  ];

  const features = [
    {
      title: "Step-by-step guidance",
      description: "Each tutorial mixes narrative, checkpoints, and inline code verification.",
      icon: Sparkles,
      color: "text-purple-400"
    },
    {
      title: "Adaptive pacing",
      description: "Progress bars, reminders, and smart resume keep learners in flow.",
      icon: Timer,
      color: "text-blue-400"
    },
    {
      title: "Practice boosts",
      description: "Every lesson ends with an optional extension task to reinforce skills.",
      icon: Zap,
      color: "text-amber-400"
    }
  ];

  const liveSessions = [
    {
      title: "Frontend Fundamentals",
      coach: "Maya Chen",
      spots: "12 seats left",
      focus: "DOM, layout, and accessibility",
      time: "Mon, 6:00 PM"
    },
    {
      title: "Backend Blueprints",
      coach: "Diego Alvarez",
      spots: "Open",
      focus: "REST patterns & auth",
      time: "Wed, 7:30 PM"
    },
    {
      title: "DevOps Kickstart",
      coach: "Priya Rao",
      spots: "Waitlist",
      focus: "CI/CD and monitoring",
      time: "Fri, 5:00 PM"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Interactive Tutorials - CodeAcademy Pro",
    "description": "Follow guided interactive tutorials with step-by-step guidance, checkpoints, and AI hints. Learn programming through hands-on tutorials and projects.",
    "provider": {
      "@type": "Organization",
      "name": "CodeAcademy Pro"
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      <SEO
        title="Interactive Tutorials - Guided Programming Tutorials"
        description="Follow guided interactive tutorials with step-by-step guidance, checkpoints, and AI hints. Learn programming through hands-on tutorials, projects, and debug labs."
        keywords="interactive tutorials, programming tutorials, guided tutorials, coding tutorials, step-by-step tutorials, learn programming, programming guides"
        structuredData={structuredData}
      />

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[200px]"
        />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 pt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BackButton label="Back to Home" />
          </motion.div>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1 text-blue-400 border-blue-400/30 bg-blue-400/5 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Guided learning experience
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Tutorials</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Follow curated storylines, unlock checkpoints, and let AI hints keep you moving forward—no blank screens, just pure momentum.
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 pb-24 space-y-24">
          {/* Main Tracks Grid */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            {tracks.map((track) => (
              <motion.div key={track.title} variants={itemVariants}>
                <Card className="group relative h-full bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${track.color} opacity-50`} />
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        {track.icon}
                      </div>
                      <Badge className="bg-white/10 hover:bg-white/20 text-slate-300 border-none px-3 py-1">
                        {track.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-blue-400 transition-colors">{track.title}</CardTitle>
                    <CardDescription className="text-slate-400 text-base leading-relaxed mt-2">{track.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Monitor className="w-4 h-4 text-blue-400/70" />
                        <span>{track.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Timer className="w-4 h-4 text-purple-400/70" />
                        <span>{track.duration}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-white/5 hover:bg-blue-600 border border-white/10 group-hover:border-blue-500/50 transition-all duration-500 text-slate-200">
                      Explore Track
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.section>

          {/* Interactive Learning Section */}
          <section className="grid gap-8 lg:grid-cols-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    The Learning Journey
                  </h2>
                  <p className="text-slate-400 mt-2 max-w-xl">
                    Choose your pace. Our adaptive system tailors the experience to your goals.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-full p-1">
                <Tabs defaultValue="guided" className="w-full">
                  <div className="p-4 border-b border-white/5">
                    <TabsList className="grid grid-cols-3 bg-slate-900/50 border border-white/5 p-1 rounded-xl">
                      <TabsTrigger value="guided" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all">Guided</TabsTrigger>
                      <TabsTrigger value="challenge" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg transition-all">Challenge</TabsTrigger>
                      <TabsTrigger value="review" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg transition-all">Review</TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="p-8">
                    <AnimatePresence mode="wait">
                      <TabsContent value="guided" className="mt-0 focus-visible:outline-none">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-8"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                              <Video className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold mb-2">Narrated Walkthroughs</h3>
                              <p className="text-slate-400 leading-relaxed">
                                Detailed explanations with visual cues, checkpoints, and instant feedback at every step.
                              </p>
                            </div>
                          </div>
                          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-blue-400 font-medium flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Interactive Flow
                              </span>
                              <span className="text-slate-500">72% completion rate</span>
                            </div>
                            <Progress value={72} className="h-2 bg-slate-800" />
                            <p className="text-xs text-slate-500 italic">
                              Learners are 3x more likely to finish a tutorial in one sitting using Guided Mode.
                            </p>
                          </div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="challenge" className="mt-0 focus-visible:outline-none">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-8"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                              <Target className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold mb-2">Unassisted Mastery</h3>
                              <p className="text-slate-400 leading-relaxed">
                                Minimal hints, timed checkpoints, and exclusive mastery badges for the bold.
                              </p>
                            </div>
                          </div>
                          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-purple-400 font-medium flex items-center gap-2">
                                <Timer className="w-4 h-4" />
                                Speed Trials
                              </span>
                              <span className="text-slate-500">Avg. 38 mins</span>
                            </div>
                            <Progress value={48} className="h-2 bg-slate-800" />
                            <p className="text-xs text-slate-500 italic">
                              Recommended for those who want to test their limits and earn prestige badges.
                            </p>
                          </div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="review" className="mt-0 focus-visible:outline-none">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-8"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                              <BookOpen className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold mb-2">Condensed Recaps</h3>
                              <p className="text-slate-400 leading-relaxed">
                                High-speed refreshers, flash quizzes, and digital cheat sheets for quick mastery.
                              </p>
                            </div>
                          </div>
                          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-emerald-400 font-medium flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Precision Recall
                              </span>
                              <span className="text-slate-500">86% retention boost</span>
                            </div>
                            <Progress value={86} className="h-2 bg-slate-800" />
                            <p className="text-xs text-slate-500 italic">
                              The perfect companion for interview prep and last-minute concept verification.
                            </p>
                          </div>
                        </motion.div>
                      </TabsContent>
                    </AnimatePresence>
                  </div>
                </Tabs>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-full p-8 border-l-4 border-l-blue-500/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-bold">Live Coach Sessions</h3>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">Weekly</Badge>
                </div>

                <div className="space-y-4">
                  {liveSessions.map((session, idx) => (
                    <motion.div
                      key={session.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{session.title}</p>
                          <p className="text-sm text-slate-500">with {session.coach}</p>
                        </div>
                        <Badge variant="outline" className={`text-[10px] ${session.spots === "Waitlist" ? "border-amber-500/30 text-amber-500" : "border-emerald-500/30 text-emerald-500"}`}>
                          {session.spots}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-3">
                        <span className="text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded-full">{session.focus}</span>
                        <span className="text-blue-400/70 font-medium">{session.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-medium h-12 shadow-lg shadow-blue-500/20 transition-all">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  View Session Calendar
                </Button>
              </Card>
            </motion.div>
          </section>

          {/* Features Subsection */}
          <section className="grid gap-8 md:grid-cols-3">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full bg-white/5 border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 w-fit mb-4 group-hover:scale-110 transition-transform duration-500`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-400 leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </section>

          {/* AI Banner - Premium Overhaul */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative group p-[2px] rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              <div className="absolute inset-0 bg-blue-600/20 blur-2xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
              <div className="relative bg-slate-950 rounded-[22px] p-8 md:p-12 overflow-hidden">
                {/* Decorative background for the banner */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />

                <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-600 text-white border-none px-3 py-1">Beta</Badge>
                      <span className="text-blue-400 font-medium">Experimental Release</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                      Experience <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI Pair Programming</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                      Enable the experimental Copilot mode to see narrated explanations, instant refactors, and contextual hints while you type. It's like having a senior engineer by your side 24/7.
                    </p>
                    <div className="flex flex-wrap gap-6 pt-4">
                      {[
                        { text: "Narrated breakdowns", icon: <Video className="w-4 h-4" /> },
                        { text: "Auto-generated checkpoints", icon: <CheckCircle2 className="w-4 h-4" /> },
                        { text: "Smart recap notes", icon: <Zap className="w-4 h-4" /> }
                      ].map((item) => (
                        <div key={item.text} className="flex items-center gap-2 text-slate-300">
                          <div className="text-blue-400">{item.icon}</div>
                          <span className="text-sm font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                    <Button
                      size="lg"
                      className="relative px-8 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg shadow-2xl shadow-blue-500/40 transition-all hover:scale-105"
                    >
                      <Rocket className="h-6 w-6 mr-3" />
                      Enable Copilot Mode
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Footer-like spacer */}
      <div className="py-20 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm italic">
          New tutorials released every Tuesday. Stay ahead of the curve.
        </p>
      </div>
    </div>
  );
};

export default InteractiveTutorials;

