import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

// Move features array outside component
const FEATURES_DATA = [
    {
      title: "Interactive Learning",
      description: "Write and run code directly in your browser. See instant feedback and learn by doing with our advanced code playground.",
      icon: "💻",
      path: "/challenges"
    },
    {
      title: "Project-Based Curriculum",
      description: "Build real-world applications from day one. Every lesson culminates in a hands-on project for your portfolio.",
      icon: "🚀",
      path: "/real-projects"
    },
    {
      title: "AI-Powered Assistance",
      description: "Get personalized help 24/7 with our AI tutor. Stuck on a problem? Get hints, explanations, and code reviews instantly.",
      icon: "🤖",
      path: "/ai-tutor"
    },
    {
      title: "Career Services",
      description: "From resume reviews to mock interviews. Our career team helps you land your dream programming job.",
      icon: "💼",
      path: "/career"
    },
    {
      title: "Community Support",
      description: "Join thousands of learners worldwide. Get help, share projects, and network with fellow programmers.",
      icon: "👥",
      path: "/study-groups"
    },
    {
      title: "Industry Certification",
      description: "Earn recognized certificates that employers trust. Showcase your skills with verified project portfolios.",
      icon: "🏆",
      path: "/certification"
    }
];

const Features = memo(() => {
  const navigate = useNavigate();
  
  // Memoize features
  const features = useMemo(() => FEATURES_DATA, []);

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why <span className="gradient-text">CodeAcademy Pro</span> is Different
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Unlike traditional coding bootcamps or basic tutorials, we provide a comprehensive, 
            personalized learning experience that adapts to your pace and goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.3,
                ease: "easeOut",
              }}
              whileHover={{
                y: -5,
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.97 }}
              style={{ willChange: "transform" }}
            >
              <Card 
                className="border-border bg-card hover:shadow-elegant transition-all duration-300 cursor-pointer h-full"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader>
                  <div className="text-4xl mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

Features.displayName = "Features";

export default Features;