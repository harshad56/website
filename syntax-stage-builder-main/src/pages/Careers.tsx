import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/BackButton";
import { MapPin, Users } from "lucide-react";

const openings = [
  {
    title: "Senior Frontend Engineer",
    location: "Remote - North America",
    type: "Full-time"
  },
  {
    title: "Curriculum Developer (AI)",
    location: "Remote - Global",
    type: "Contract"
  },
  {
    title: "Community Manager",
    location: "Austin, TX",
    type: "Full-time"
  }
];

const benefits = [
  "Remote-first culture",
  "Learning stipend",
  "Wellness budget",
  "Open vacation policy"
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      
      <div className="bg-gradient-to-r from-fuchsia-500/10 via-blue-500/10 to-fuchsia-500/10 border-b border-border">
        <div className="container mx-auto px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-4">We are hiring</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Careers at CodeAcademy Pro</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join a distributed team that obsesses over learner outcomes, delightful tooling, and community impact.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-10">
        <Card>
          <CardHeader>
            <CardTitle>Open Roles</CardTitle>
            <CardDescription>We review applications on a rolling basis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {openings.map((role) => (
              <div key={role.title} className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold">{role.title}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {role.location}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{role.type}</Badge>
                  <Button size="sm">Apply</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Life at CodeAcademy Pro</CardTitle>
            <CardDescription>Values that guide our work.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="p-4 border rounded-lg text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary mb-2" />
                {benefit}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Join our talent network</CardTitle>
            <CardDescription>Share your email and we will notify you when new roles open.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-3">
            <Input placeholder="Email address" />
            <Button className="md:w-auto w-full">Subscribe</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Careers;
