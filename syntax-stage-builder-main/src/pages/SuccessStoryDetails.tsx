import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  BookOpen,
  Code,
  Users,
  Award,
  MessageCircle,
  Share2,
  Heart,
  Play,
  CheckCircle,
  Clock,
  Target,
  Zap
} from "lucide-react";

const SuccessStoryDetails = () => {
  const { storyId } = useParams();
  const [liked, setLiked] = useState(false);

  // Mock data for success stories
  const successStories = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Senior Frontend Developer",
      company: "Google",
      salary: "$180,000",
      location: "San Francisco, CA",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      background: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
      story: "I started my coding journey with zero programming experience. Through CodeAcademy Pro's structured learning paths, I was able to build a strong foundation in web development. The hands-on projects and real-world applications helped me understand complex concepts easily.",
      journey: [
        {
          date: "January 2023",
          title: "Started Learning Path",
          description: "Enrolled in Full-Stack Web Development path",
          icon: BookOpen
        },
        {
          date: "March 2023",
          title: "First Project Completed",
          description: "Built a complete e-commerce website",
          icon: Code
        },
        {
          date: "June 2023",
          title: "Portfolio Ready",
          description: "Created professional portfolio with 5+ projects",
          icon: Award
        },
        {
          date: "August 2023",
          title: "Job Search Started",
          description: "Applied to 50+ companies with tailored applications",
          icon: Target
        },
        {
          date: "October 2023",
          title: "Google Interview",
          description: "Passed technical interviews and coding challenges",
          icon: CheckCircle
        },
        {
          date: "November 2023",
          title: "Job Offer",
          description: "Received offer from Google as Senior Frontend Developer",
          icon: Zap
        }
      ],
      skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
      projects: [
        {
          name: "E-commerce Platform",
          description: "Full-stack application with payment integration",
          tech: ["React", "Node.js", "MongoDB", "Stripe"],
          link: "#"
        },
        {
          name: "Social Media Dashboard",
          description: "Real-time analytics dashboard for social media management",
          tech: ["React", "Socket.io", "Chart.js", "Express"],
          link: "#"
        },
        {
          name: "AI Chatbot",
          description: "Machine learning-powered customer service chatbot",
          tech: ["Python", "TensorFlow", "Flask", "NLP"],
          link: "#"
        }
      ],
      testimonials: [
        {
          name: "Mike Chen",
          role: "Software Engineer",
          company: "Microsoft",
          text: "Sarah's transformation is incredible. She went from knowing nothing about coding to being a senior developer at Google in just 10 months!",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
        },
        {
          name: "Emily Rodriguez",
          role: "Tech Lead",
          company: "Netflix",
          text: "The quality of Sarah's code and her problem-solving skills are exceptional. She's a great example of what's possible with the right learning platform.",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
        }
      ],
      stats: {
        timeToJob: "10 months",
        salaryIncrease: "300%",
        projectsCompleted: 15,
        interviews: 8,
        offers: 3
      },
      rating: 5,
      reviewCount: 1247
    },
    {
      id: "2",
      name: "David Kim",
      role: "Data Scientist",
      company: "Netflix",
      salary: "$160,000",
      location: "Los Angeles, CA",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      background: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop",
      story: "Coming from a non-technical background, I was intimidated by data science. But CodeAcademy Pro's step-by-step approach made complex concepts accessible. The real-world projects helped me build a strong portfolio.",
      journey: [
        {
          date: "February 2023",
          title: "Started Data Science Path",
          description: "Enrolled in Data Science & Machine Learning program",
          icon: BookOpen
        },
        {
          date: "April 2023",
          title: "First ML Model",
          description: "Built a recommendation system for e-commerce",
          icon: Code
        },
        {
          date: "July 2023",
          title: "Kaggle Competition",
          description: "Participated in data science competitions",
          icon: Award
        },
        {
          date: "September 2023",
          title: "Netflix Interview",
          description: "Aced technical interviews and case studies",
          icon: CheckCircle
        },
        {
          date: "October 2023",
          title: "Job Offer",
          description: "Received offer from Netflix as Data Scientist",
          icon: Zap
        }
      ],
      skills: ["Python", "SQL", "TensorFlow", "PyTorch", "AWS", "Docker"],
      projects: [
        {
          name: "Movie Recommendation System",
          description: "ML-powered recommendation engine for streaming platform",
          tech: ["Python", "TensorFlow", "Pandas", "Scikit-learn"],
          link: "#"
        },
        {
          name: "Customer Churn Prediction",
          description: "Predictive analytics model for customer retention",
          tech: ["Python", "XGBoost", "SQL", "Tableau"],
          link: "#"
        }
      ],
      testimonials: [
        {
          name: "Lisa Wang",
          role: "Senior Data Scientist",
          company: "Netflix",
          text: "David's analytical thinking and technical skills are outstanding. He quickly adapted to our team and started contributing meaningful insights.",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
        }
      ],
      stats: {
        timeToJob: "8 months",
        salaryIncrease: "250%",
        projectsCompleted: 12,
        interviews: 6,
        offers: 2
      },
      rating: 5,
      reviewCount: 892
    }
  ];

  const currentStory = successStories.find(story => story.id === storyId) || successStories[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src={currentStory.background}
            alt="Background"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative container mx-auto px-6 py-16">
          <Button variant="ghost" className="text-white hover:bg-white/20 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Success Stories
          </Button>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <img
                src={currentStory.avatar}
                alt={currentStory.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
            </div>
            
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Success Story
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(currentStory.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm ml-2">({currentStory.reviewCount} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold mb-2">{currentStory.name}</h1>
              <p className="text-xl mb-4">{currentStory.role} at {currentStory.company}</p>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {currentStory.location}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {currentStory.salary}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {currentStory.stats.timeToJob} to job
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Story */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">My Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed mb-6">{currentStory.story}</p>
                
                <div className="space-y-6">
                  {currentStory.journey.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-muted-foreground">{step.date}</span>
                            <Badge variant="outline">{step.title}</Badge>
                          </div>
                          <p className="text-foreground">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Key Projects</CardTitle>
                <CardDescription>Projects that helped secure the job offer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentStory.projects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-semibold mb-2">{project.name}</h4>
                      <p className="text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm">
                        View Project
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Colleague Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentStory.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <p className="text-lg italic mb-4">"{testimonial.text}"</p>
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role} at {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Success Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Time to Job</span>
                  <span className="font-semibold">{currentStory.stats.timeToJob}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Salary Increase</span>
                  <span className="font-semibold text-green-600">{currentStory.stats.salaryIncrease}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Projects Completed</span>
                  <span className="font-semibold">{currentStory.stats.projectsCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Interviews</span>
                  <span className="font-semibold">{currentStory.stats.interviews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Job Offers</span>
                  <span className="font-semibold">{currentStory.stats.offers}</span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentStory.skills.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Interview
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Connect
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                    {liked ? 'Liked' : 'Like'}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Similar Stories */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Success Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {successStories.filter(story => story.id !== currentStory.id).map((story) => (
                    <div key={story.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{story.name}</p>
                        <p className="text-sm text-muted-foreground">{story.role} at {story.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStoryDetails; 