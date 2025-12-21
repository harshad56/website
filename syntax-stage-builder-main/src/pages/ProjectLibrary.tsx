import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/BackButton";
import { ArrowRight, FolderGit2, Layers, ListChecks } from "lucide-react";

const ProjectLibrary = () => {
  const projectTracks = [
    {
      title: "Frontend Systems",
      level: "Intermediate",
      items: ["Analytics dashboard", "Design system", "Marketing site"]
    },
    {
      title: "Backend & APIs",
      level: "Advanced",
      items: ["Auth service", "Payments API", "Notification worker"]
    },
    {
      title: "AI & Automation",
      level: "Beginner",
      items: ["Chat assistant", "Data cleanup", "Workflow automations"]
    }
  ];

  const resources = [
    {
      title: "Starter Kits",
      description: "Scaffolded repos with README checklists, architecture notes, and CI configs.",
      badge: "GitHub"
    },
    {
      title: "Solution Walkthroughs",
      description: "Video + written breakdowns explaining trade-offs, tooling, and deployment.",
      badge: "Premium"
    },
    {
      title: "Mentor Feedback",
      description: "Submit your repo for async review and targeted improvement suggestions.",
      badge: "Community"
    }
  ];

  const statuses = [
    { label: "Not started", value: 24 },
    { label: "In progress", value: 46 },
    { label: "Ready for review", value: 18 },
    { label: "Published", value: 12 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      
      <div className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border-b border-border">
        <div className="container mx-auto px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-4">Portfolio ready</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Project Library</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Browse curated, production-grade builds with specs, storyboards, and acceptance tests. Ship projects that recruiters actually want to see.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-12">
        <section className="grid gap-6 md:grid-cols-3">
          {projectTracks.map((track) => (
            <Card key={track.title}>
              <CardHeader>
                <Badge variant="outline">{track.level}</Badge>
                <CardTitle>{track.title}</CardTitle>
                <CardDescription>Includes {track.items.length} briefs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {track.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <FolderGit2 className="h-4 w-4 text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Workspace Templates</CardTitle>
            <CardDescription>Pick a stack and we will preconfigure environment variables, CI pipelines, and deployment scripts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="react">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="react">React + Vite</TabsTrigger>
                <TabsTrigger value="node">Node API</TabsTrigger>
                <TabsTrigger value="python">Python FastAPI</TabsTrigger>
              </TabsList>
              <TabsContent value="react" className="pt-4 space-y-3 text-muted-foreground">
                <p>Tailwind + shadcn UI, Vitest, Playwright, and Netlify deploy hooks baked in.</p>
                <Button variant="secondary" className="w-fit">
                  Use template <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </TabsContent>
              <TabsContent value="node" className="pt-4 space-y-3 text-muted-foreground">
                <p>Express, Prisma, Stripe mock server, and Render deploy scripts.</p>
                <Button variant="secondary" className="w-fit">
                  Use template <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </TabsContent>
              <TabsContent value="python" className="pt-4 space-y-3 text-muted-foreground">
                <p>FastAPI, SQLModel, Celery worker, and Railway ready-to-run configs.</p>
                <Button variant="secondary" className="w-fit">
                  Use template <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <section className="grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.title}>
              <CardHeader>
                <Badge>{resource.badge}</Badge>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Track where your builds are in the review pipeline.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              {statuses.map((status) => (
                <div key={status.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{status.label}</span>
                    <span>{status.value} projects</span>
                  </div>
                  <Progress value={status.value} />
                </div>
              ))}
            </div>
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" /> Submission checklist
              </h3>
              <p className="text-sm text-muted-foreground">We auto-verify linting, tests, deploy previews, and documentation coverage before mentors review.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Automated QA run","Accessibility audit","Performance budget"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectLibrary;
