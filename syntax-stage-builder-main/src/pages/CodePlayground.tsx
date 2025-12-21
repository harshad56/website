import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BackButton } from "@/components/BackButton";
import { Code2, Cpu, MonitorPlay, RefreshCw, Save } from "lucide-react";

const CodePlayground = memo(() => {
  const languages = ["JavaScript", "Python", "Java", "Rust", "Go", "SQL"];
  const presets = [
    { name: "Algorithm", description: "Console runner with sample inputs" },
    { name: "UI Sandbox", description: "Preview pane with hot reload" },
    { name: "API Client", description: "Fetch helper and mock data" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6 relative z-10">
        <BackButton label="Back to Home" className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40" />
      </div>
      
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white -mt-16 pt-20">
        <div className="container mx-auto px-6 py-20">
          <Badge variant="secondary" className="bg-white/20 text-white mb-4">Instant IDE</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Code Playground</h1>
          <p className="text-lg text-slate-200 max-w-3xl">
            Spin up disposable sandboxes with Monaco editing, runtime analytics, and shareable links—perfect for experiments, live sessions, and snippets.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>Choose your stack</CardTitle>
            <CardDescription>Select a language and runtime tuning before launching a workspace.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-medium">Languages</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <Badge key={lang} variant="outline" className="px-4 py-1 cursor-pointer">
                    {lang}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Memory limit</p>
                <Slider defaultValue={[512]} max={1024} step={64} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Execution time</p>
                <Slider defaultValue={[4]} max={10} step={1} />
              </div>
            </div>
            <div className="space-y-4">
              <Tabs defaultValue="console">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="console">Console</TabsTrigger>
                  <TabsTrigger value="browser">Browser</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>
                <TabsContent value="console" className="pt-4 text-sm text-muted-foreground">
                  Node 20 runtime with readline helpers, inspector support, and snapshotting.
                </TabsContent>
                <TabsContent value="browser" className="pt-4 text-sm text-muted-foreground">
                  Headless browser preview, automatic CSS hot reload, and network proxy.
                </TabsContent>
                <TabsContent value="services" className="pt-4 text-sm text-muted-foreground">
                  Spin up mock REST/GraphQL endpoints powered by MSW and Supabase.
                </TabsContent>
              </Tabs>
              <Button className="w-fit">
                <MonitorPlay className="h-4 w-4 mr-2" /> Launch workspace
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-6 md:grid-cols-2">
          {presets.map((preset) => (
            <Card key={preset.name}>
              <CardHeader>
                <CardTitle>{preset.name}</CardTitle>
                <CardDescription>{preset.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3 text-sm text-muted-foreground">
                <Code2 className="h-4 w-4 text-primary mt-1" />
                <p>Includes linting, starter files, and environment variables tailored for the use case.</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Session Timeline</CardTitle>
            <CardDescription>Every execution captures logs, diffs, and download links.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <ScrollArea className="h-64 rounded-md border">
              <div className="p-4 space-y-4 text-sm">
                {[1,2,3,4].map((run) => (
                  <div key={run} className="p-3 rounded-lg bg-muted">
                    <p className="font-medium">Run #{run}</p>
                    <p className="text-muted-foreground">Tests: {run === 3 ? "2 failing" : "All green"}</p>
                    <p className="text-muted-foreground">Duration: {run * 1.2}s</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" /> Restart runtime
              </Button>
              <Button variant="outline" className="w-full">
                <Save className="h-4 w-4 mr-2" /> Export snapshot
              </Button>
              <Button className="w-full">
                <Cpu className="h-4 w-4 mr-2" /> Enable performance tracing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

CodePlayground.displayName = 'CodePlayground';

export default CodePlayground;
