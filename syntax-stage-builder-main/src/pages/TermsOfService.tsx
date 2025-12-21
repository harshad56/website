import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const clauses = [
  {
    title: "Acceptance of terms",
    description: "By creating an account you agree to our acceptable use guidelines, payment terms, and privacy policy."
  },
  {
    title: "Usage rights",
    description: "Subscriptions grant a non-transferable license to use the platform for personal or team training purposes. No reselling or redistribution of content."
  },
  {
    title: "Billing",
    description: "Plans renew automatically unless cancelled. We prorate upgrades and offer full refunds within 14 days for self-serve plans."
  },
  {
    title: "Content & conduct",
    description: "Be respectful in community spaces. We may suspend accounts that share harmful code, harass users, or breach security."
  },
  {
    title: "Liability",
    description: "The service is provided \"as-is\". We limit liability to the fees paid for the current term as permitted by law."
  }
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-gray-200 via-white to-gray-200 border-b border-border">
        <div className="container mx-auto px-6 py-16 text-center">
          <Badge variant="secondary" className="mb-3">Updated Nov 2025</Badge>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Read this summary of key terms. Detailed legal language is available via our downloadable PDF.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-6">
        {clauses.map((clause) => (
          <Card key={clause.title}>
            <CardHeader>
              <CardTitle>{clause.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{clause.description}</p>
            </CardContent>
          </Card>
        ))}
        <p className="text-xs text-muted-foreground">
          For legal questions contact legal@codeacademypro.com.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
