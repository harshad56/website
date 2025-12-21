import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Quote } from "lucide-react";

const stories = [
  {
    id: "1",
    name: "Amira Patel",
    role: "Frontend Engineer @ Stripe",
    summary: "Transitioned from teacher to engineer in 11 months with personalized projects.",
    quote: "The mentorship cadence and AI tutor made every hurdle feel solvable.",
    highlight: "3 project offers"
  },
  {
    id: "2",
    name: "Felix Bauer",
    role: "Data Scientist @ Spotify",
    summary: "Used the analytics learning path and mock interviews to pivot from finance.",
    quote: "Having a structured interview scorecard removed the guesswork.",
    highlight: "+42% salary"
  },
  {
    id: "3",
    name: "Luna Park",
    role: "Full-stack Developer @ Atlassian",
    summary: "Built the collaboration suite capstone and showcased it during hiring week.",
    quote: "Reviewers went deep on architecture which impressed hiring managers.",
    highlight: "Offer in 6 weeks"
  }
];

const SuccessStories = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-rose-500/10 border-b border-border">
        <div className="container mx-auto px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-4">Community wins</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet students who leveled up through CodeAcademy Pro—and see the exact paths they followed.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-10">
        <section className="grid gap-6 md:grid-cols-3">
          {stories.map((story) => (
            <Card key={story.id} className="flex flex-col">
              <CardHeader>
                <Badge variant="outline">{story.highlight}</Badge>
                <CardTitle>{story.name}</CardTitle>
                <CardDescription>{story.role}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">{story.summary}</p>
                <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                  <Quote className="h-4 w-4 text-primary mb-2" />
                  {story.quote}
                </div>
                <Button variant="ghost" className="justify-start px-0" onClick={() => navigate(`/success-story/${story.id}`)}>
                  Read full story <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Share your milestone</CardTitle>
            <CardDescription>We spotlight new wins every month.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Tell us about your offer, promotion, or launch and we will feature it in the community newsletter.
            </div>
            <Button className="self-start">Submit your story</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessStories;
