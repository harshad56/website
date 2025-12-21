import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackButton } from "@/components/BackButton";
import { ClipboardList, MessageSquare, Star } from "lucide-react";

const reviewers = [
  {
    name: "Lena Ortiz",
    focus: "Frontend & accessibility",
    rating: 4.9,
    reviews: 312
  },
  {
    name: "Marcus Reed",
    focus: "Backend architecture",
    rating: 4.8,
    reviews: 204
  },
  {
    name: "Naoko Hara",
    focus: "Data & ML",
    rating: 5.0,
    reviews: 118
  }
];

const CodeReviews = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      
      <div className="bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-teal-500/10 border-b border-border">
        <div className="container mx-auto px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-4">Mentor insights</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Code Reviews</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Submit pull requests, get annotated feedback, and learn how senior engineers reason about trade-offs.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-10">
        <Card>
          <CardHeader>
            <CardTitle>Submission Checklist</CardTitle>
            <CardDescription>Make sure reviewers have everything they need.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 text-sm text-muted-foreground">
              {["Link to repo or sandbox","Feature summary","Testing notes","Questions or focus areas"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" /> {item}
                </div>
              ))}
            </div>
            <div className="p-6 border rounded-lg space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Turnaround</p>
              <p>Standard reviews arrive within 48 hours. Need faster? Upgrade to priority and get feedback in under 12 hours.</p>
              <Button variant="secondary" className="w-fit">Submit pull request</Button>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-6 md:grid-cols-3">
          {reviewers.map((reviewer) => (
            <Card key={reviewer.name} className="text-center">
              <CardHeader className="items-center">
                <Avatar className="h-16 w-16 mb-3">
                  <AvatarImage src="https://i.pravatar.cc/128" alt={reviewer.name} />
                  <AvatarFallback>{reviewer.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle>{reviewer.name}</CardTitle>
                <CardDescription>{reviewer.focus}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  {reviewer.rating} ({reviewer.reviews} reviews)
                </div>
                <Button variant="outline" size="sm">Request review</Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Review Types</CardTitle>
            <CardDescription>Pick the depth that fits your goal.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
            {[
              {
                title: "Snapshot",
                description: "High-level architecture notes and red flags.",
                eta: "6 hours"
              },
              {
                title: "Line-by-line",
                description: "Comments on readability, tests, and performance.",
                eta: "24 hours"
              },
              {
                title: "Pair review",
                description: "Live call with shared coding session and refactor plan.",
                eta: "Scheduled"
              }
            ].map((type) => (
              <div key={type.title} className="border rounded-lg p-4">
                <p className="font-semibold text-foreground">{type.title}</p>
                <p>{type.description}</p>
                <p className="text-xs mt-2">ETA: {type.eta}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <CardHeader>
            <CardTitle className="text-3xl">Community office hours</CardTitle>
            <CardDescription className="text-blue-100">Drop in, share your screen, and get feedback from peers.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-sm">Weekly sessions hosted by mentors covering frontend, backend, and data engineering reviews.</p>
            </div>
            <Button variant="secondary" className="self-start">
              <MessageSquare className="h-4 w-4 mr-2" /> Reserve a seat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeReviews;
