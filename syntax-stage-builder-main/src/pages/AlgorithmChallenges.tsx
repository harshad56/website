import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/BackButton";
import { Brain, Flame, LineChart, Medal, Target, Users, Zap, Trophy, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";

import { useEffect, useState, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { useAuth } from "@/contexts/AuthContext";

const AlgorithmChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [challengesRes, progressRes] = await Promise.all([
          apiService.getChallenges({ category: 'algorithm' }),
          user ? apiService.getUserChallengesProgress() : Promise.resolve({ success: false, data: [] })
        ]);

        if (challengesRes.success) setChallenges(challengesRes.data || []);
        if (progressRes.success) setUserProgress(progressRes.data || []);
      } catch (error) {
        console.error("Failed to fetch algorithm challenges data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const stats = useMemo(() => {
    const total = challenges.length || 245; // Fallback to mockup data if empty
    const completed = userProgress.filter(p => p.status === 'completed').length;
    return { total, completed };
  }, [challenges, userProgress]);

  const tiers = [
    // ... same tiers
    {
      name: "Daily Warmups",
      difficulty: "Beginner",
      problems: 120,
      focus: "Arrays, strings, math",
      color: "from-emerald-500/20 to-emerald-600/20",
      icon: <Zap className="w-6 h-6 text-emerald-400" />
    },
    {
      name: "Interview Sets",
      difficulty: "Intermediate",
      problems: 85,
      focus: "Trees, graphs, DP",
      color: "from-blue-500/20 to-blue-600/20",
      icon: <Target className="w-6 h-6 text-blue-400" />
    },
    {
      name: "Competition Mode",
      difficulty: "Advanced",
      problems: 40,
      focus: "Geometry, bitmasks, optimizations",
      color: "from-purple-500/20 to-purple-600/20",
      icon: <Trophy className="w-6 h-6 text-purple-400" />
    }
  ];

  const metrics = [
    { label: "Avg. Solve Time", value: "12m", icon: <Zap className="w-4 h-4 text-yellow-400" /> },
    { label: "Community Attempts", value: "84k+", icon: <Users className="w-4 h-4 text-blue-400" /> },
    { label: "Expert Tutorials", value: "24h Unlock", icon: <Brain className="w-4 h-4 text-purple-400" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      <SEO
        title="Algorithm Challenges | CodeAcademy Pro"
        description="Master complex algorithms and data structures through curated, timeboxed puzzles."
      />

      {/* Background Animated Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div className="space-y-4">
            <BackButton />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-orange-500/20 text-orange-400 border-none px-3 py-1">🔥 Daily Bonus Active</Badge>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">LIVE CONTEST</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter">
                Algo <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500">Mastery</span>
              </h1>
              <p className="text-slate-400 mt-2 text-xl max-w-2xl leading-relaxed">
                Sharpen problem-solving skills with timeboxed puzzles and leaderboard races.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="h-16 px-8 rounded-2xl bg-white text-slate-900 font-black hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl">
              Random Solve
            </Button>
          </div>
        </header>

        <section className="grid gap-8 md:grid-cols-3 mb-16">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 rounded-[2rem] overflow-hidden group h-full">
                <CardHeader className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6 border border-white/5`}>
                    {tier.icon}
                  </div>
                  <Badge variant="outline" className="w-fit border-white/10 text-slate-500 mb-2">{tier.difficulty}</Badge>
                  <CardTitle className="text-2xl font-black text-white">{tier.name}</CardTitle>
                  <CardDescription className="text-slate-400 font-medium text-base mb-4">{tier.focus}</CardDescription>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">{tier.problems} Problems</span>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-white/5 p-0">
                      View Set <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8">
            <Card className="bg-white/5 backdrop-blur-2xl border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-10 border-b border-white/5">
                <CardTitle className="text-3xl font-black text-white">Challenge Modes</CardTitle>
                <CardDescription className="text-slate-400 text-lg">Pick a format that matches your learning style.</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <Tabs defaultValue="timed" className="w-full">
                  <TabsList className="bg-black/20 border border-white/5 h-14 p-1 rounded-2xl gap-2 w-full mb-10">
                    <TabsTrigger value="timed" className="rounded-xl flex-1 h-full data-[state=active]:bg-white data-[state=active]:text-slate-950 font-bold transition-all">Timed Sprints</TabsTrigger>
                    <TabsTrigger value="pair" className="rounded-xl flex-1 h-full data-[state=active]:bg-white data-[state=active]:text-slate-950 font-bold transition-all">Pair Coding</TabsTrigger>
                    <TabsTrigger value="marathon" className="rounded-xl flex-1 h-full data-[state=active]:bg-white data-[state=active]:text-slate-950 font-bold transition-all">Elite Marathon</TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <TabsContent value="timed" className="mt-0 focus-visible:outline-none">
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="inline-flex p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400 mb-2">
                          <Flame className="w-6 h-6 mr-2" />
                          <span className="font-bold">Most Popular</span>
                        </div>
                        <h3 className="text-2xl font-bold">30-Minute Sprint</h3>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                          Race against the clock to solve 3 escalating problems. Instant scoring, AI hints, and performance metrics included.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-14 px-8 rounded-2xl">
                          Start Sprint Now
                        </Button>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="pair" className="mt-0 focus-visible:outline-none">
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400 mb-2">
                          <Users className="w-6 h-6 mr-2" />
                          <span className="font-bold">Live Multiplayer</span>
                        </div>
                        <h3 className="text-2xl font-bold">Collaborative Solve</h3>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                          Invite a friend or mentor to solve complex puzzles in a shared realtime editor with integrated audio/video chat.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-14 px-8 rounded-2xl">
                          Enter Lobby
                        </Button>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="marathon" className="mt-0 focus-visible:outline-none">
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="inline-flex p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 mb-2">
                          <Trophy className="w-6 h-6 mr-2" />
                          <span className="font-bold">High Stakes</span>
                        </div>
                        <h3 className="text-2xl font-bold">Pro Contest</h3>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                          Solve 5 escalating problems with zero hints allowed. High impact on global ranking and seasonal rewards.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-14 px-8 rounded-2xl">
                          Join Queue
                        </Button>
                      </motion.div>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[2rem]">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-bold flex items-center gap-2 mb-4">
                  <LineChart className="w-5 h-5 text-blue-400" />
                  Live Telemetry
                </CardTitle>
                <div className="space-y-6">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{metric.label}</span>
                        <span className="text-2xl font-black text-white">{metric.value}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        {metric.icon}
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            <div className="bg-gradient-to-br from-orange-600/20 to-pink-600/20 p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Medal className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-black">Rankings Reset</h4>
                <p className="text-sm text-slate-400">The current season ends in <span className="text-white font-bold">14h 22m</span>. Submit problems now to lock your tier rewards!</p>
                <Button variant="ghost" className="w-full text-orange-400 hover:text-orange-300 hover:bg-white/5 px-0 justify-start font-bold">
                  View Competition Rules <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Flame, title: "Heat Streaks", desc: "Solve daily to maintain multiplier bonuses." },
            { icon: Brain, title: "Concept Tags", desc: "Target specific areas like Graphs or DP." },
            { icon: Medal, title: "Seasonal Cups", desc: "Win exclusive badges for top performance." }
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4 rounded-[2rem] hover:bg-white/10 transition-all duration-300">
                <CardHeader className="p-6">
                  <feature.icon className="h-10 w-10 text-orange-500 mb-6" />
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </section>
      </div>

      {/* Modern Footer Section */}
      <footer className="mt-20 py-20 border-t border-white/5 text-center px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full" />
        <div className="container mx-auto relative z-10 space-y-10">
          <div className="flex flex-wrap justify-center gap-8">
            <Button variant="ghost" className="text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">Roadmap</Button>
            <Button variant="ghost" className="text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">Mentorship</Button>
            <Button variant="ghost" className="text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">FAQ</Button>
          </div>
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-medium max-w-lg mx-auto leading-loose">
            Refine your craft with CodeAcademy Pro. Designed for high-performance engineering candidates and lifelong learners.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AlgorithmChallenges;

