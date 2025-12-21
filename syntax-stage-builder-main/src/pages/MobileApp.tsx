import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Smartphone, 
  Download, 
  Star, 
  Users, 
  Clock, 
  Calendar,
  MessageCircle,
  Video,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  ArrowRight,
  ArrowLeft,
  Heart,
  Share2,
  Play,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  Bookmark,
  History,
  User,
  Plus,
  Settings,
  Edit,
  Trash2,
  Crown,
  Globe,
  Monitor,
  Code,
  Database,
  Cloud,
  Brain,
  Lightbulb,
  GraduationCap,
  Lock,
  Unlock,
  QrCode,
  Apple,
  Chrome
} from "lucide-react";

const MobileApp = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("ios");

  const appFeatures = [
    {
      id: 1,
      title: "Learn On-The-Go",
      description: "Access all your courses, lessons, and progress from anywhere. Perfect for learning during commutes or breaks.",
      icon: Smartphone,
      color: "text-blue-500"
    },
    {
      id: 2,
      title: "Offline Learning",
      description: "Download lessons and practice offline. Continue learning even without internet connection.",
      icon: Download,
      color: "text-green-500"
    },
    {
      id: 3,
      title: "Interactive Code Editor",
      description: "Write, run, and debug code directly on your mobile device with our optimized code editor.",
      icon: Code,
      color: "text-purple-500"
    },
    {
      id: 4,
      title: "Progress Tracking",
      description: "Track your learning progress, streaks, and achievements in real-time with beautiful visualizations.",
      icon: TrendingUp,
      color: "text-orange-500"
    },
    {
      id: 5,
      title: "AI Tutor Chat",
      description: "Get instant help from our AI tutor. Ask questions, get explanations, and receive personalized guidance.",
      icon: Brain,
      color: "text-pink-500"
    },
    {
      id: 6,
      title: "Study Groups",
      description: "Join study groups, participate in discussions, and collaborate with other learners on mobile.",
      icon: Users,
      color: "text-indigo-500"
    }
  ];

  const appScreenshots = [
    {
      id: 1,
      title: "Home Dashboard",
      description: "Beautiful dashboard showing your progress, recent courses, and quick actions.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop",
      platform: "ios"
    },
    {
      id: 2,
      title: "Course Player",
      description: "Optimized video player with interactive elements and progress tracking.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop",
      platform: "ios"
    },
    {
      id: 3,
      title: "Code Editor",
      description: "Mobile-optimized code editor with syntax highlighting and auto-completion.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop",
      platform: "android"
    },
    {
      id: 4,
      title: "AI Tutor Chat",
      description: "Chat interface with our AI tutor for instant help and guidance.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop",
      platform: "android"
    }
  ];

  const appStats = {
    downloads: "500K+",
    rating: 4.8,
    reviews: 12500,
    activeUsers: "250K+",
    countries: 45
  };

  const userReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      review: "Amazing app! I can learn programming anywhere. The offline feature is a lifesaver during my commute.",
      platform: "iOS",
      date: "2 days ago"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      review: "The mobile code editor is incredible. I can practice coding on my phone and the AI tutor is very helpful.",
      platform: "Android",
      date: "1 week ago"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 4,
      review: "Great app for learning on the go. The progress tracking keeps me motivated to continue learning.",
      platform: "iOS",
      date: "2 weeks ago"
    }
  ];

  const downloadLinks = {
    ios: "https://apps.apple.com/app/codeacademy-pro",
    android: "https://play.google.com/store/apps/details?id=com.codeacademy.pro",
    web: "https://app.codeacademypro.com"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Mobile App
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Take your learning journey with you. Download our mobile app and learn programming anywhere, anytime.
            </p>
            
            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="flex items-center gap-2">
                <Apple className="w-5 h-5" />
                Download for iOS
              </Button>
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Download for Android
              </Button>
            </div>

            {/* App Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{appStats.downloads}</p>
                <p className="text-sm text-muted-foreground">Downloads</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{appStats.rating}</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{appStats.reviews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{appStats.activeUsers}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{appStats.countries}</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Mobile App?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ${feature.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* App Screenshots */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">App Screenshots</h2>
          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ios" className="flex items-center gap-2">
                <Apple className="w-4 h-4" />
                iOS
              </TabsTrigger>
              <TabsTrigger value="android" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Android
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ios" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {appScreenshots.filter(screenshot => screenshot.platform === "ios").map((screenshot) => (
                  <Card key={screenshot.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={screenshot.image}
                        alt={screenshot.title}
                        className="w-full h-auto"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">iOS</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{screenshot.title}</h3>
                      <p className="text-muted-foreground">{screenshot.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="android" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {appScreenshots.filter(screenshot => screenshot.platform === "android").map((screenshot) => (
                  <Card key={screenshot.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={screenshot.image}
                        alt={screenshot.title}
                        className="w-full h-auto"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">Android</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{screenshot.title}</h3>
                      <p className="text-muted-foreground">{screenshot.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* User Reviews */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{review.review}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.platform}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Download our mobile app and take your programming skills to the next level. Available on iOS and Android.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="flex items-center gap-2">
              <Apple className="w-5 h-5" />
              <div className="text-left">
                <p className="text-xs">Download on the</p>
                <p className="text-sm font-semibold">App Store</p>
              </div>
            </Button>
            <Button size="lg" variant="outline" className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              <div className="text-left">
                <p className="text-xs">Get it on</p>
                <p className="text-sm font-semibold">Google Play</p>
              </div>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Free to download
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No ads
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Offline support
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Scan to Download</h3>
          <p className="text-muted-foreground mb-8">
            Scan the QR code with your mobile device to download the app
          </p>
          <div className="flex justify-center">
            <Card className="p-8 inline-block">
              <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                <QrCode className="w-32 h-32 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-4">Scan with your camera</p>
            </Card>
          </div>
        </div>

        {/* System Requirements */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  iOS Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>iOS Version</span>
                  <span className="font-semibold">iOS 13.0 or later</span>
                </div>
                <div className="flex justify-between">
                  <span>Device</span>
                  <span className="font-semibold">iPhone, iPad, iPod touch</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage</span>
                  <span className="font-semibold">100 MB available space</span>
                </div>
                <div className="flex justify-between">
                  <span>RAM</span>
                  <span className="font-semibold">2 GB minimum</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Android Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Android Version</span>
                  <span className="font-semibold">Android 8.0 or later</span>
                </div>
                <div className="flex justify-between">
                  <span>Device</span>
                  <span className="font-semibold">Smartphone or tablet</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage</span>
                  <span className="font-semibold">150 MB available space</span>
                </div>
                <div className="flex justify-between">
                  <span>RAM</span>
                  <span className="font-semibold">3 GB minimum</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp; 