import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HERO_TEXTS = ["Master Programming", "Build Amazing Apps", "Launch Your Career", "Code Your Dreams"];
const CODE_EXAMPLES = [
  { lang: "🐍 Python", code: 'print("Hello World!")', color: "from-yellow-400 to-green-500", path: "/python-learning" },
  { lang: "⚡ JavaScript", code: 'console.log("Hello World!");', color: "from-yellow-300 to-orange-500", path: "/javascript-learning" },
  { lang: "☕ Java", code: 'System.out.println("Hello World!");', color: "from-orange-400 to-red-500", path: "/java-learning" },
  { lang: "⚙️ C++", code: 'cout << "Hello World!" << endl;', color: "from-blue-400 to-purple-500", path: "/cpp-learning" }
];
const FEATURES = [
  { icon: "🎯", text: "Interactive Learning", color: "success", path: "/challenges" },
  { icon: "🚀", text: "Real Projects", color: "primary", path: "/real-projects" },
  { icon: "👨‍🏫", text: "Expert Mentors", color: "accent", path: "/mentorship" },
  { icon: "💼", text: "Career Support", color: "warning", path: "/career" },
  { icon: "🏆", text: "Certification", color: "secondary", path: "/certification" },
  { icon: "🌍", text: "Global Community", color: "primary", path: "/study-groups" }
];

const HeroInner = memo(() => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const currentText = HERO_TEXTS[currentIndex];
    const timer = setTimeout(() => {
      if (typedText.length < currentText.length) {
        setTypedText(currentText.slice(0, typedText.length + 1));
      } else {
        setTimeout(() => {
          setTypedText("");
          setCurrentIndex((prev) => (prev + 1) % HERO_TEXTS.length);
        }, 2000);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [typedText, currentIndex]);

  const scrollToLanguages = useCallback(() => {
    const element = document.getElementById('languages');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  const scrollToFeatures = useCallback(() => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  const showStartLearningFlow = useCallback(() => {
    navigate('/learning-paths');
  }, [navigate]);

  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Animated Background - No image to avoid blocking */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-hero" />
        
        {/* Floating Elements - Optimized for performance */}
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 bg-primary/30 rounded-full pointer-events-none"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform, opacity" }}
        />
        <motion.div
          className="absolute top-40 right-32 w-6 h-6 bg-accent/40 rounded-full pointer-events-none"
          animate={{
            y: [0, -40, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{ willChange: "transform, opacity" }}
        />
      </div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated Title with 3D effect */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1000 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-4 leading-tight">
              <motion.span
                className="text-primary inline-block"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {typedText}
                <span className="animate-pulse">|</span>
              </motion.span>
              <br />
              <motion.span
                className="text-foreground inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Languages Effortlessly
              </motion.span>
            </h1>
          </motion.div>
          
          <motion.p
            className="text-xl md:text-2xl text-foreground mb-10 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            🚀 Learn programming languages through <span className="text-primary font-semibold">interactive tutorials</span>, 
            <span className="text-accent font-semibold"> hands-on coding challenges</span>, 
            and <span className="text-primary font-semibold">real-world projects</span>. From beginner to expert, we've got you covered!
          </motion.p>
          
          {/* Enhanced CTA Buttons with 3D hover */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full sm:min-w-[250px] text-base sm:text-lg shadow-glow hover:shadow-2xl group touch-target"
                onClick={showStartLearningFlow}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🎯 Start Learning Free</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                </span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5, rotateY: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                variant="outline" 
                size="xl" 
                className="w-full sm:min-w-[250px] text-base sm:text-lg border-2 hover:bg-primary/10 hover:border-primary touch-target"
                onClick={scrollToFeatures}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>📚 Explore Features</span>
                </span>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Interactive Code Examples with 3D card effect */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {CODE_EXAMPLES.map((item, index) => (
              <motion.div
                key={index}
                className={`group code-block p-6 cursor-pointer bg-gradient-to-br ${item.color} bg-opacity-10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg`}
                onClick={() => navigate(item.path)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.8 + index * 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
                style={{ willChange: "transform" }}
              >
                <div className="text-foreground text-lg font-bold mb-3">
                  {item.lang}
                </div>
                <pre className="text-code-foreground text-sm bg-black/80 p-3 rounded-lg overflow-hidden">
                  <code className="group-hover:text-green-400 transition-colors duration-300">
                    {item.code}
                  </code>
                </pre>
                <div className="mt-3 text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  Click to start learning →
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Enhanced Features with 3D hover */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            {FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2 group cursor-pointer p-3 rounded-lg hover:bg-accent/10"
                onClick={() => navigate(feature.path)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 1.2 + index * 0.05,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.08,
                  y: -3,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                style={{ willChange: "transform" }}
              >
                <div className="text-2xl">
                  {feature.icon}
                </div>
                <span className="font-medium group-hover:text-primary transition-colors duration-300">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator - Optimized */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            whileHover={{ scale: 1.1, y: -3 }}
            onClick={scrollToLanguages}
            style={{ willChange: "transform" }}
          >
            <div className="w-6 h-10 border-2 border-primary/50 rounded-full hover:border-primary transition-colors duration-300">
              <div className="w-1 h-3 bg-primary rounded-full mx-auto mt-2 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

HeroInner.displayName = "HeroInner";

export default HeroInner;