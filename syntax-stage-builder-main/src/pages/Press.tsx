import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Newspaper, Share2 } from "lucide-react";

const features = [
  {
    outlet: "TechCrunch",
    summary: "Highlighting CodeAcademy Pro's AI mentor rollout.",
    date: "Oct 2025"
  },
  {
    outlet: "Forbes",
    summary: "Named one of the fastest growing edtech startups.",
    date: "Sep 2025"
  },
  {
    outlet: "The Verge",
    summary: "Deep dive on collaborative coding tooling.",
    date: "Jul 2025"
  }
];

const Press = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-slate-600/10 via-indigo-600/10 to-slate-600/10 border-b border-border">
        <div className="container mx-auto px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-4">Media kit</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Press & Media</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Access company background, logos, product screenshots, and reach our communications team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-10">
        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.outlet}>
              <CardHeader>
                <Badge variant="outline">{feature.date}</Badge>
                <CardTitle>{feature.outlet}</CardTitle>
                <CardDescription>{feature.summary}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Press Kit</CardTitle>
            <CardDescription>Logos, screenshots, executive bios, and boilerplate copy.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {["Brand assets","Product tour","Company timeline"].map((item) => (
              <Badge key={item} variant="outline">{item}</Badge>
            ))}
            <Button className="ml-auto">
              <Share2 className="h-4 w-4 mr-2" /> Download kit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Press Contact</CardTitle>
            <CardDescription>We aim to respond within 1 business day.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>press@codeacademypro.com</p>
              <p>+1 (415) 555-0123</p>
              <p>Media relations office — San Francisco, CA</p>
            </div>
            <div className="space-y-3">
              <Input placeholder="Your name" />
              <Input placeholder="Publication" />
              <Textarea rows={4} placeholder="How can we help?" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Press;
