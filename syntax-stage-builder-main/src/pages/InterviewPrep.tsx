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
      badge: "Phase 1"
    },
    {
      title: "Technical drills",
      description: "Curated DSA sets, system design prompts, and whiteboard walkthroughs.",
      badge: "Phase 2"
    },
    {
      title: "Onsite rehearsal",
      description: "Timed mock interviews with mentor scoring rubrics.",
      badge: "Phase 3"
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
    <div className="min-h-screen bg-background">
      <SEO
        title="Interview Preparation - Coding Interviews & Tech Interview Prep"
        description="Prepare for programming job interviews with mock interviews, coding practice, system design prep, and behavioral interview guidance. Ace your tech interviews!"
        keywords="interview preparation, coding interviews, tech interviews, mock interviews, system design interview, behavioral interview, programming interview prep"
        structuredData={structuredData}
      />
      <div className="bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 border-b border-border">
        <div className="container mx-auto px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-4">Practice mode</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Interview Prep Lab</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Build confidence through structured drills, expert feedback, and data-driven progress tracking.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-10">
        <section className="grid gap-6 md:grid-cols-3">
          {stages.map((stage) => (
            <Card key={stage.title}>
              <CardHeader>
                <Badge variant="outline">{stage.badge}</Badge>
                <CardTitle>{stage.title}</CardTitle>
                <CardDescription>{stage.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Session Formats</CardTitle>
            <CardDescription>Select a format and we will pair you with the right mentor.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="behavioral">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="design">System Design</TabsTrigger>
              </TabsList>
              <TabsContent value="behavioral" className="pt-4 space-y-4 text-muted-foreground">
                <p>Story bank creation, STAR responses, and confidence coaching.</p>
                <Button variant="secondary" className="w-fit">
                  <Mic className="h-4 w-4 mr-2" /> Book mock interview
                </Button>
              </TabsContent>
              <TabsContent value="technical" className="pt-4 space-y-4 text-muted-foreground">
                <p>DSA whiteboard practice with real-time hints and complexity breakdowns.</p>
                <Button variant="secondary" className="w-fit">
                  <Target className="h-4 w-4 mr-2" /> Join live drill
                </Button>
              </TabsContent>
              <TabsContent value="design" className="pt-4 space-y-4 text-muted-foreground">
                <p>Architecture prompts, trade-off discussions, and artifact review.</p>
                <Button variant="secondary" className="w-fit">
                  <ClipboardCheck className="h-4 w-4 mr-2" /> Reserve mentor
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Dashboard</CardTitle>
              <CardDescription>Track confidence, clarity, and technical accuracy over time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {["Communication","Problem framing","Technical depth","Follow-up"] .map((metric, idx) => (
                <div key={metric} className="flex items-center justify-between">
                  <span>{metric}</span>
                  <Badge variant="outline">{80 + idx * 3}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>Everything you need to know before booking.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.q} value={`item-${index}`}>
                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="text-3xl">Need a coach?</CardTitle>
            <CardDescription className="text-indigo-100">Pair with industry interviewers for 1:1 sessions.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              {[
                "Former FAANG engineers",
                "Structured scoring rubrics",
                "Personalized homework"
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" variant="secondary" className="self-start">
              Reserve a coach
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewPrep;
