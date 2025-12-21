import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { 
  Check, 
  Star, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  Award,
  Clock,
  BookOpen,
  Video,
  MessageSquare,
  Briefcase,
  Download,
  Share2,
  Eye,
  TrendingUp,
  DollarSign,
  Crown,
  Rocket,
  Target
} from "lucide-react";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started",
      price: { monthly: 0, annual: 0 },
      features: [
        "Access to 3 basic courses",
        "Community forum access",
        "Basic progress tracking",
        "Limited coding challenges",
        "Email support"
      ],
      limitations: [
        "No certificate upon completion",
        "No career services",
        "No live sessions",
        "No advanced features"
      ],
      icon: Target,
      color: "from-gray-600 to-gray-800",
      popular: false
    },
    {
      id: "pro",
      name: "Pro",
      description: "Most popular for serious learners",
      price: { monthly: 29, annual: 290 },
      features: [
        "Access to all courses (20+ languages)",
        "Interactive code editor",
        "Project-based learning",
        "Progress tracking & analytics",
        "Certificate upon completion",
        "Community access",
        "Email & chat support",
        "Mobile app access",
        "Downloadable content",
        "Priority support"
      ],
      limitations: [
        "No career coaching",
        "No mock interviews",
        "No resume review"
      ],
      icon: Rocket,
      color: "from-blue-600 to-purple-600",
      popular: true
    },
    {
      id: "premium",
      name: "Premium",
      description: "Complete career transformation",
      price: { monthly: 99, annual: 990 },
      features: [
        "Everything in Pro",
        "1-on-1 career coaching",
        "Mock technical interviews",
        "Resume review & optimization",
        "Job search strategy",
        "LinkedIn profile optimization",
        "Salary negotiation guidance",
        "Networking opportunities",
        "Exclusive workshops",
        "Direct employer connections",
        "Alumni network access",
        "Priority job placement"
      ],
      limitations: [],
      icon: Crown,
      color: "from-purple-600 to-pink-600",
      popular: false
    }
  ];

  const features = [
    {
      category: "Learning Features",
      items: [
        { name: "Course Access", free: "3 courses", pro: "All courses", premium: "All courses" },
        { name: "Interactive Editor", free: "Basic", pro: "Advanced", premium: "Advanced" },
        { name: "Project Portfolio", free: "No", pro: "Yes", premium: "Yes" },
        { name: "Progress Tracking", free: "Basic", pro: "Advanced", premium: "Advanced" },
        { name: "Mobile App", free: "No", pro: "Yes", premium: "Yes" }
      ]
    },
    {
      category: "Certification",
      items: [
        { name: "Completion Certificate", free: "No", pro: "Yes", premium: "Yes" },
        { name: "Verification System", free: "No", pro: "Yes", premium: "Yes" },
        { name: "Digital Badges", free: "No", pro: "Yes", premium: "Yes" },
        { name: "Social Sharing", free: "No", pro: "Yes", premium: "Yes" }
      ]
    },
    {
      category: "Career Services",
      items: [
        { name: "Career Coaching", free: "No", pro: "No", premium: "1-on-1 sessions" },
        { name: "Mock Interviews", free: "No", pro: "No", premium: "Unlimited" },
        { name: "Resume Review", free: "No", pro: "No", premium: "Professional review" },
        { name: "Job Placement", free: "No", pro: "No", premium: "Priority access" }
      ]
    },
    {
      category: "Support",
      items: [
        { name: "Email Support", free: "Yes", pro: "Yes", premium: "Yes" },
        { name: "Chat Support", free: "No", pro: "Yes", premium: "Yes" },
        { name: "Priority Support", free: "No", pro: "Yes", premium: "Yes" },
        { name: "1-on-1 Mentoring", free: "No", pro: "No", premium: "Yes" }
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer",
      company: "TechCorp",
      plan: "Pro",
      content: "The Pro plan gave me everything I needed to transition into tech. The interactive editor and project-based learning were game-changers.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Backend Engineer",
      company: "StartupXYZ",
      plan: "Premium",
      content: "The Premium plan's career services helped me land my dream job. The mock interviews and resume review were invaluable.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist",
      company: "DataFlow Inc",
      plan: "Pro",
      content: "Great value for money. The Pro plan offers everything a serious learner needs to succeed in tech.",
      rating: 5
    }
  ];

  const currentPrice = (plan: any) => isAnnual ? plan.price.annual : plan.price.monthly;
  const savings = (plan: any) => plan.price.monthly * 12 - plan.price.annual;

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton />
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Pricing Plans
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Choose Your Learning Path
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Start free and upgrade as you grow. All plans include a 30-day money-back guarantee.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Label htmlFor="billing" className="text-lg">Monthly</Label>
              <Switch
                id="billing"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <Label htmlFor="billing" className="text-lg">Annual</Label>
              {isAnnual && (
                <Badge className="bg-green-600">
                  Save up to 17%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500">
                  Most Popular
                </Badge>
              )}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${plan.color}`}></div>
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${plan.color} text-white`}>
                    <plan.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <CardDescription className="text-lg">{plan.description}</CardDescription>
                
                <div className="mt-6">
                  <div className="text-4xl font-bold">
                    {currentPrice(plan) === 0 ? 'Free' : `$${currentPrice(plan)}`}
                  </div>
                  {currentPrice(plan) > 0 && (
                    <div className="text-muted-foreground">
                      per {isAnnual ? 'year' : 'month'}
                    </div>
                  )}
                  {isAnnual && currentPrice(plan) > 0 && (
                    <div className="text-sm text-green-600 mt-2">
                      Save ${savings(plan)} per year
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="font-semibold text-muted-foreground mt-6">Not included:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex-shrink-0"></div>
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                      : plan.id === 'free'
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  {plan.id === 'free' ? 'Get Started Free' : 'Start Free Trial'}
                </Button>
                
                {plan.id !== 'free' && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    30-day money-back guarantee
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Feature Comparison</h2>
            <p className="text-xl text-muted-foreground">
              Compare all features across our plans
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Free</th>
                  <th className="text-center p-4">Pro</th>
                  <th className="text-center p-4">Premium</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, categoryIndex) => (
                  <>
                    <tr key={`category-${categoryIndex}`} className="bg-background">
                      <td colSpan={4} className="p-4 font-semibold text-lg">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={`item-${categoryIndex}-${itemIndex}`} className="border-b border-border">
                        <td className="p-4">{item.name}</td>
                        <td className="p-4 text-center">
                          <Badge variant={item.free === 'Yes' ? 'default' : 'secondary'}>
                            {item.free}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={item.pro === 'Yes' ? 'default' : 'secondary'}>
                            {item.pro}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={item.premium === 'Yes' ? 'default' : 'secondary'}>
                            {item.premium}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of satisfied learners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="mt-3">
                  {testimonial.plan} Plan
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Can I cancel my subscription anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to your plan until the end of your current billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's included in the free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The free trial gives you full access to all Pro features for 7 days. No credit card required to start your trial.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do you offer team discounts?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we offer special pricing for teams of 5 or more. Contact our sales team for custom pricing and features.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I upgrade or downgrade my plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, changes take effect at your next billing cycle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join over 100,000 students who have transformed their careers with CodeAcademy Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              View All Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 