import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ClipboardCheck, Headphones, Mic, Target } from "lucide-react";
import SEO from "@/components/SEO";

const InterviewPrep = () => {
  const stages = [
    {
      title: "Screening kit",
      description: "Behavioral prompts, elevator pitch templates, and recruiter email scripts.",
      badge: "Phase 1",
      icon: <Sparkles className="w-5 h-5 text-amber-400" />
    },
    {
      title: "Technical drills",
      description: "Curated DSA sets, system design prompts, and whiteboard walkthroughs.",
      badge: "Phase 2",
      icon: <Code className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Onsite rehearsal",
      description: "Timed mock interviews with mentor scoring rubrics.",
      badge: "Phase 3",
      icon: <Target className="w-5 h-5 text-rose-400" />
    }
  ];

  const faqs = [
    {
      q: "How does scoring work?",
      a: "We evaluate structure, communication, correctness, and follow-up questions to mirror real rubrics."
    },
    {
      q: "Can I bring my own questions?",
      a: "Yes—upload a prompt or share a JD and we will tailor the session."
    },
    {
      q: "Do you provide recordings?",
      a: "Mock interviews include annotated recordings and action items."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Interview Preparation - CodeAcademy Pro",
    "description": "Prepare for programming job interviews with mock interviews, coding practice, system design prep, and behavioral interview guidance.",
    "provider": {
      "@type": "Organization",
      "name": "CodeAcademy Pro"
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-violet-500/30 overflow-hidden relative">
      <SEO
        title="Interview Preparation - Coding Interviews & Tech Interview Prep"
        description="Prepare for programming job interviews with mock interviews, coding practice, system design prep, and behavioral interview guidance. Ace your tech interviews!"
        keywords="interview preparation, coding interviews, tech interviews, mock interviews, system design interview, behavioral interview, programming interview prep"
        structuredData={structuredData}
      />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 pt-8">
          <BackButton label="Back to Home" className="text-white/60 hover:text-white transition-colors" to="/" />
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20 py-1.5 px-4 backdrop-blur-sm">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Practice Lab
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
              Interview Prep <span className="text-violet-500">Lab</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              Build confidence through structured drills, expert feedback, and data-driven progress tracking. Ace your dream tech job interview.
            </p>
          </motion.div>
        </section>

        <main className="container mx-auto px-6 pb-24 space-y-20">
          {/* Phase Cards */}
          <section className="grid gap-8 md:grid-cols-3">
            {stages.map((stage, idx) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-violet-500/50 transition-all duration-500 rounded-3xl overflow-hidden h-full shadow-lg group-hover:bg-white/10">
                  <CardHeader className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900/50 flex items-center justify-center border border-white/5 opacity-50 group-hover:opacity-100 transition-all group-hover:scale-110">
                        {stage.icon}
                      </div>
                      <Badge variant="outline" className="border-white/10 text-slate-500 group-hover:text-violet-400 group-hover:border-violet-500/30 transition-colors uppercase tracking-widest text-[10px] font-black">
                        {stage.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white mb-3">{stage.title}</CardTitle>
                    <CardDescription className="text-slate-400 text-base leading-relaxed font-medium">
                      {stage.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </section>

          {/* Formats Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/5 backdrop-blur-2xl border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-10 border-b border-white/5 text-center">
                <CardTitle className="text-3xl font-bold text-white mb-2">Session Formats</CardTitle>
                <CardDescription className="text-slate-400 text-lg font-medium">Select a format and we will pair you with the right mentor.</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <Tabs defaultValue="behavioral" className="w-full">
                  <div className="flex justify-center mb-10">
                    <TabsList className="bg-slate-950/50 border border-white/5 h-14 p-1.5 rounded-2xl gap-2 w-full max-w-2xl">
                      <TabsTrigger value="behavioral" className="rounded-xl flex-1 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold transition-all">Behavioral</TabsTrigger>
                      <TabsTrigger value="technical" className="rounded-xl flex-1 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold transition-all">Technical</TabsTrigger>
                      <TabsTrigger value="design" className="rounded-xl flex-1 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold transition-all">System Design</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="behavioral" className="focus-visible:outline-none">
                    <div className="flex flex-col md:flex-row items-center gap-12 bg-white/5 rounded-3xl p-10 border border-white/5">
                      <div className="flex-1 space-y-6">
                        <h4 className="text-2xl font-bold text-white">Soft skills & Storytelling</h4>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">Master the art of STAR responses, story bank creation, and building unshakeable confidence with FAANG recruiters.</p>
                        <Button className="bg-violet-600 hover:bg-violet-700 h-12 px-8 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-violet-600/20">
                          <Mic className="h-5 w-5 mr-3" /> Book Mock Interview
                        </Button>
                      </div>
                      <div className="w-full md:w-1/3 aspect-video bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/5 animate-pulse" />
                        <Mic className="w-16 h-16 text-violet-400 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="technical" className="focus-visible:outline-none">
                    <div className="flex flex-col md:flex-row items-center gap-12 bg-white/5 rounded-3xl p-10 border border-white/5">
                      <div className="flex-1 space-y-6">
                        <h4 className="text-2xl font-bold text-white">Algorithm Excellence</h4>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">DSA whiteboard practice with real-time hints, complexity breakdowns, and optimized implementation strategies.</p>
                        <Button className="bg-violet-600 hover:bg-violet-700 h-12 px-8 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-violet-600/20">
                          <Target className="h-5 w-5 mr-3" /> Join Live Drill
                        </Button>
                      </div>
                      <div className="w-full md:w-1/3 aspect-video bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/5 animate-pulse" />
                        <Code className="w-16 h-16 text-blue-400 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="design" className="focus-visible:outline-none">
                    <div className="flex flex-col md:flex-row items-center gap-12 bg-white/5 rounded-3xl p-10 border border-white/5">
                      <div className="flex-1 space-y-6">
                        <h4 className="text-2xl font-bold text-white">Large Scale Systems</h4>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">Deep dive into architecture prompts, load balancing trade-offs, and microservices design review with senior architects.</p>
                        <Button className="bg-violet-600 hover:bg-violet-700 h-12 px-8 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-violet-600/20">
                          <ClipboardCheck className="h-5 w-5 mr-3" /> Reserve Mentor
                        </Button>
                      </div>
                      <div className="w-full md:w-1/3 aspect-video bg-gradient-to-br from-rose-600/20 to-violet-600/20 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/5 animate-pulse" />
                        <Sparkles className="w-16 h-16 text-rose-400 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Metrics & FAQ Section */}
          <section className="grid gap-12 md:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[2.5rem] p-4 shadow-xl h-full">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-bold text-white mb-2">Feedback Dashboard</CardTitle>
                  <CardDescription className="text-slate-400 font-medium">Track confidence, clarity, and technical accuracy over time.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-8">
                  {["Communication", "Problem framing", "Technical depth", "Follow-up"].map((metric, idx) => (
                    <div key={metric} className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider">
                        <span className="text-slate-400">{metric}</span>
                        <span className="text-violet-400">{80 + idx * 3}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${80 + idx * 3}%` }}
                          transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[2.5rem] p-4 shadow-xl h-full">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-bold text-white mb-2">FAQ</CardTitle>
                  <CardDescription className="text-slate-400 font-medium">Everything you need to know before booking.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={faq.q} value={`item-${index}`} className="border-white/5 bg-white/5 rounded-2xl px-6 data-[state=open]:bg-white/10 transition-colors">
                        <AccordionTrigger className="text-white hover:no-underline font-bold text-left py-5">{faq.q}</AccordionTrigger>
                        <AccordionContent className="text-slate-400 text-base leading-relaxed font-medium pb-5">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="relative bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-[3rem] p-12 overflow-hidden shadow-2xl shadow-violet-600/20 group">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="space-y-6 max-w-2xl text-center md:text-left">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Crush your next <br />FAANG interview.</h2>
                  <p className="text-indigo-100/80 text-xl font-medium">Pair with senior industry interviewers for personalized 1:1 sessions and structured homework.</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold uppercase tracking-widest text-indigo-100/60">
                    {["Former FAANG Tier", "Verified Rubrics", "Session Recordings"].map(item => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-slate-100 h-16 px-10 rounded-[2rem] text-lg font-black shadow-2xl transition-all hover:scale-105 active:scale-95 flex-shrink-0">
                  Reserve a Session
                </Button>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default InterviewPrep;
