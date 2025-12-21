import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const principles = [
  {
    title: "Be respectful",
    details: "Celebrate diverse backgrounds. Assume good intent, avoid harassment, and keep discussions inclusive."
  },
  {
    title: "Share responsibly",
    details: "No plagiarized solutions, leaked interview content, or malicious code."
  },
  {
    title: "Protect privacy",
    details: "Do not share personal data about yourself or others in public spaces."
  },
  {
    title: "Report issues",
    details: "Flag abusive content or security concerns via safety@codeacademypro.com."
  }
];

const CodeOfConduct = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-gradient-to-r from-amber-200 via-white to-amber-200 border-b border-border">
      <div className="container mx-auto px-6 py-16 text-center">
        <Badge variant="secondary" className="mb-3">Community first</Badge>
        <h1 className="text-4xl font-bold mb-2">Code of Conduct</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          We cultivate a safe, supportive space for learning. These guidelines apply across the platform, events, and social channels.
        </p>
      </div>
    </div>

    <div className="container mx-auto px-6 py-12 space-y-6">
      {principles.map((principle) => (
        <Card key={principle.title}>
          <CardHeader>
            <CardTitle>{principle.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{principle.details}</p>
          </CardContent>
        </Card>
      ))}
      <p className="text-xs text-muted-foreground">
        Violations may result in warnings, suspension, or removal. Reach out to community@codeacademypro.com for clarification.
      </p>
    </div>
  </div>
);

export default CodeOfConduct;
