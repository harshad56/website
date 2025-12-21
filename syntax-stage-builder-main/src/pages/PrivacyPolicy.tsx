import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    title: "Data we collect",
    items: [
      "Account information such as name, email, and authentication tokens",
      "Learning data including course progress, submissions, and messages",
      "Device details (browser, OS) and usage analytics for performance"
    ]
  },
  {
    title: "How we use data",
    items: [
      "Deliver personalized learning paths and recommendations",
      "Improve platform reliability, security, and new feature planning",
      "Communicate important updates, billing info, and support responses"
    ]
  },
  {
    title: "Your controls",
    items: [
      "Download or delete your data anytime from account settings",
      "Adjust marketing preferences and notification types",
      "Request human review for automated decisions"
    ]
  }
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-slate-200 via-white to-slate-200 border-b border-border">
        <div className="container mx-auto px-6 py-16 text-center">
          <Badge variant="secondary" className="mb-3">Updated Nov 2025</Badge>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            We care deeply about transparency. Below is a simplified summary—see the full legal policy in our docs for more detail.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-6">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
        <p className="text-xs text-muted-foreground">
          Questions? Contact privacy@codeacademypro.com. We respond to requests within 30 days.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
