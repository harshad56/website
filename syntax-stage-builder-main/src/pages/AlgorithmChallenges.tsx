import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/BackButton";
import { Brain, Flame, LineChart, Medal } from "lucide-react";

const AlgorithmChallenges = () => {
  const tiers = [
    {
      name: "Daily Warmups",
      difficulty: "Beginner",
      problems: 120,
      focus: "Arrays, strings, math"
    },
    {
      name: "Interview Sets",
      difficulty: "Intermediate",
      problems: 85,
      focus: "Trees, graphs, DP"
    },
    {
      name: "Competition Mode",
      difficulty: "Advanced",
      problems: 40,
      focus: "Geometry, bitmasks, optimizations"
    }
  ];

  const metrics = [
    { label: "Avg. solve time", value: "12m" },
    { label: "Community attempts", value: "84k" },
    { label: "Editorials", value: "Available 24h later" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      
      <div className="bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-orange-500/10 border-b border-border">
        <div className="container mx-auto px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-4">Daily challenge</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Algorithm Challenges</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Sharpen problem-solving skills with timeboxed puzzles, leaderboard races, and detailed editorial breakdowns.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-10">
        <section className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name}>
              <CardHeader>
                <Badge variant="outline">{tier.difficulty}</Badge>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.focus}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {tier.problems} curated problems
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Challenge Modes</CardTitle>
            <CardDescription>Pick a format that matches your energy.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timed">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="timed">Timed</TabsTrigger>
                <TabsTrigger value="pair">Pair</TabsTrigger>
                <TabsTrigger value="marathon">Marathon</TabsTrigger>
              </TabsList>
              <TabsContent value="timed" className="pt-4 text-muted-foreground">
                <p className="mb-2">30-minute sprint with instant scoring and hints unlocked after two failed submissions.</p>
                <Button variant="secondary">Start sprint</Button>
              </TabsContent>
              <TabsContent value="pair" className="pt-4 text-muted-foreground">
                <p className="mb-2">Invite a friend or mentor to collaborate in realtime with shared editor and chat.</p>
                <Button variant="secondary">Open lobby</Button>
              </TabsContent>
              <TabsContent value="marathon" className="pt-4 text-muted-foreground">
                <p className="mb-2">Solve five escalating problems with only three hints for the entire run.</p>
                <Button variant="secondary">Join queue</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <section className="grid gap-6 md:grid-cols-3">
          {[{ icon: Flame, title: "Streaks" }, { icon: Brain, title: "Concept tags" }, { icon: Medal, title: "Seasonal cups" }].map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>Keep motivation high with progress visuals and unlockable rewards.</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard Health</CardTitle>
            <CardDescription>Realtime telemetry from todays contest.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <Card key={metric.label} className="bg-muted">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">{metric.label}</CardTitle>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                </CardHeader>
              </Card>
            ))}
            <Card className="bg-card border-dashed border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-primary" /> Join the scoreboard
                </CardTitle>
                <CardDescription>Submit three problems to appear on todays ranking.</CardDescription>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlgorithmChallenges;
