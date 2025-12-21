import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/BackButton";
import { CheckCircle2, PlayCircle, Rocket, Sparkles, Timer, Zap } from "lucide-react";
import SEO from "@/components/SEO";

const InteractiveTutorials = () => {
  const tracks = [
    {
      title: "Foundations",
      description: "Guided introductions to syntax, variables, and control flow across 12 languages.",
      lessons: 42,
      duration: "6h total",
      badge: "Beginner"
    },
    {
      title: "Applied Projects",
      description: "Tutorials that walk through building dashboards, APIs, and automation bots.",
      lessons: 28,
      duration: "8 guided builds",
      badge: "Hands-on"
    },
    {
      title: "Debug Labs",
      description: "Fix broken code with hints, checkpoints, and AI explanations.",
      lessons: 18,
      duration: "45 bite-size labs",
      badge: "Challenge"
    }
  ];

  const features = [
    {
      title: "Step-by-step guidance",
      description: "Each tutorial mixes narrative, checkpoints, and inline code verification.",
      icon: Sparkles
    },
    {
      title: "Adaptive pacing",
      description: "Progress bars, reminders, and smart resume keep learners in flow.",
      icon: Timer
    },
    {
      title: "Practice boosts",
      description: "Every lesson ends with an optional extension task to reinforce skills.",
      icon: Zap
    }
  ];

  const liveSessions = [
    {
      title: "Frontend Fundamentals",
      coach: "Maya Chen",
      spots: "12 seats left",
      focus: "DOM, layout, and accessibility"
    },
    {
      title: "Backend Blueprints",
      coach: "Diego Alvarez",
      spots: "Open",
      focus: "REST patterns & auth"
    },
    {
      title: "DevOps Kickstart",
      coach: "Priya Rao",
      spots: "Waitlist",
      focus: "CI/CD and monitoring"
    }
  ];

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
    <div className="min-h-screen bg-background">
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      
      <SEO
        title="Interactive Tutorials - Guided Programming Tutorials"
        description="Follow guided interactive tutorials with step-by-step guidance, checkpoints, and AI hints. Learn programming through hands-on tutorials, projects, and debug labs."
        keywords="interactive tutorials, programming tutorials, guided tutorials, coding tutorials, step-by-step tutorials, learn programming, programming guides"
        structuredData={structuredData}
      />
      <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 border-b border-border">
        <div className="container mx-auto px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-4">Guided learning</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Interactive Tutorials</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Follow curated storylines, unlock checkpoints, and let AI hints keep you moving forward—no blank screens, just momentum.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-12">
        <section className="grid gap-6 md:grid-cols-3">
          {tracks.map((track) => (
            <Card key={track.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge>{track.badge}</Badge>
                <CardTitle className="text-2xl">{track.title}</CardTitle>
                <CardDescription>{track.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{track.lessons} lessons</span>
                <span>{track.duration}</span>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Learning Journey</CardTitle>
              <CardDescription>Pick a mode and we will assemble the right mix of lessons, labs, and recap quizzes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="guided">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="guided">Guided</TabsTrigger>
                  <TabsTrigger value="challenge">Challenge</TabsTrigger>
                  <TabsTrigger value="review">Review</TabsTrigger>
                </TabsList>
                <TabsContent value="guided" className="space-y-4 pt-4">
                  <p className="text-muted-foreground">Walkthroughs with narration, checkpoints, and instant feedback.</p>
                  <Progress value={72} />
                  <p className="text-sm text-muted-foreground">72% of learners finish a guided tutorial in a single sitting.</p>
                </TabsContent>
                <TabsContent value="challenge" className="space-y-4 pt-4">
                  <p className="text-muted-foreground">Minimal hints, timed checkpoints, and mastery badges.</p>
                  <Progress value={48} />
                  <p className="text-sm text-muted-foreground">Average completion time: 38 minutes.</p>
                </TabsContent>
                <TabsContent value="review" className="space-y-4 pt-4">
                  <p className="text-muted-foreground">Condensed recaps, flash quizzes, and cheat sheets.</p>
                  <Progress value={86} />
                  <p className="text-sm text-muted-foreground">Perfect before interviews or exams.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Coach Sessions</CardTitle>
              <CardDescription>Join weekly cohort-based walkthroughs with senior mentors.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {liveSessions.map((session) => (
                <div key={session.title} className="p-4 border rounded-lg flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{session.title}</p>
                    <p className="text-sm text-muted-foreground">Coach {session.coach}</p>
                    <p className="text-xs text-muted-foreground mt-2">Focus: {session.focus}</p>
                  </div>
                  <Badge variant="outline">{session.spots}</Badge>
                </div>
              ))}
              <Button className="w-full" variant="secondary">
                <PlayCircle className="h-4 w-4 mr-2" />
                View session calendar
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">Beta feature</Badge>
            <CardTitle className="text-3xl">AI Pair Programming</CardTitle>
            <CardDescription className="text-blue-100">
              Enable the experimental Copilot mode to see narrated explanations, instant refactors, and contextual hints while you type.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-3">
              {["Narrated breakdowns","Auto-generated checkpoints","Smart recap notes"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="lg" className="self-start">
              <Rocket className="h-4 w-4 mr-2" />
              Enable Copilot Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveTutorials;
