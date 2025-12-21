import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SuccessStories = () => {
  const stories = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      avatar: "👩‍💻",
      story: "Started as a complete beginner and landed my dream job at Google in 8 months. The project-based learning really prepared me for real-world challenges.",
      previousJob: "Marketing Manager",
      salary: "$145k",
      timeToJob: "8 months",
      languages: ["Python", "JavaScript", "React"]
    },
    {
      name: "Marcus Johnson", 
      role: "Full-Stack Developer at Stripe",
      avatar: "👨‍💻",
      story: "The career services team was incredible. They helped me perfect my resume and ace technical interviews. Now I'm building payment systems at Stripe!",
      previousJob: "Teacher",
      salary: "$130k", 
      timeToJob: "6 months",
      languages: ["JavaScript", "Node.js", "PostgreSQL"]
    },
    {
      name: "Priya Patel",
      role: "Data Scientist at Netflix",
      avatar: "👩‍🔬",
      story: "The AI/ML path was exactly what I needed. Hands-on projects with real data gave me the confidence to transition from finance to tech.",
      previousJob: "Financial Analyst",
      salary: "$140k",
      timeToJob: "10 months", 
      languages: ["Python", "TensorFlow", "SQL"]
    },
    {
      name: "Alex Rodriguez",
      role: "iOS Developer at Apple",
      avatar: "👨‍🎨",
      story: "Always wanted to build apps but didn't know where to start. The mobile development path took me from zero to Apple in under a year!",
      previousJob: "Graphic Designer", 
      salary: "$155k",
      timeToJob: "11 months",
      languages: ["Swift", "SwiftUI", "Objective-C"]
    }
  ];

  return (
    <section id="success-stories" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Real Students</span>, Real Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of career changers who transformed their lives through programming. 
            These are real people who started exactly where you are now.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {stories.map((story, index) => (
            <Card 
              key={index}
              className="border-border bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-5 transform rotate-45 translate-x-10 -translate-y-10"></div>
              
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{story.avatar}</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold">{story.name}</CardTitle>
                    <CardDescription className="text-primary font-semibold">
                      {story.role}
                    </CardDescription>
                    <div className="text-sm text-muted-foreground mt-1">
                      Previously: {story.previousJob}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <blockquote className="text-foreground leading-relaxed italic">
                  "{story.story}"
                </blockquote>
                
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="font-bold text-lg text-success">{story.salary}</div>
                    <div className="text-xs text-muted-foreground">Starting Salary</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary">{story.timeToJob}</div>
                    <div className="text-xs text-muted-foreground">Time to Job</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-accent">{story.languages.length}</div>
                    <div className="text-xs text-muted-foreground">Languages</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {story.languages.map((lang, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-card border border-border rounded-xl p-8 shadow-elegant max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">🎯 Ready to Write Your Success Story?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join our proven program with 94% job placement rate within 12 months. 
              Get mentorship, career coaching, and guaranteed interview opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => {
                  // Navigate to learning paths page
                  window.location.href = '/learning-paths';
                }}
              >
                Start Free Trial - 14 Days
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  // Navigate to home page features section
                  window.location.href = '/#features';
                }}
              >
                Talk to Career Advisor
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground">
              <span>✅ No Credit Card Required</span>
              <span>✅ Money-Back Guarantee</span>
              <span>✅ Job Placement Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;