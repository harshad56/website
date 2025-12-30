import { memo, useMemo, useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Move languages array outside component to prevent recreation on every render
const LANGUAGES_DATA = [
  {
    name: "Python",
    description: "Perfect for beginners, data science, AI/ML, and web development",
    icon: "🐍",
    difficulty: "Beginner",
    students: "2.5M+",
    rating: 4.9,
    tutorials: 450,
    projects: 150,
    features: ["Easy Syntax", "Data Science", "AI/ML", "Web Development", "Django", "Flask"],
    topics: ["Variables", "Data Types", "Functions", "OOP", "Libraries", "Frameworks"],
    certification: true,
    jobDemand: "Very High"
  },
  {
    name: "JavaScript",
    description: "Essential for web development, both frontend and backend",
    icon: "⚡",
    difficulty: "Beginner",
    students: "3.2M+",
    rating: 4.8,
    tutorials: 520,
    projects: 200,
    features: ["Web Development", "Node.js", "React", "Vue", "Angular", "Express"],
    topics: ["DOM", "ES6+", "Async/Await", "APIs", "Frameworks", "Testing"],
    certification: true,
    jobDemand: "Extremely High"
  },
  {
    name: "Java",
    description: "Enterprise applications, Android development, and large systems",
    icon: "☕",
    difficulty: "Intermediate",
    students: "2.8M+",
    rating: 4.7,
    tutorials: 380,
    projects: 120,
    features: ["Enterprise", "Android", "Spring", "Hibernate", "Maven", "Gradle"],
    topics: ["OOP", "Collections", "Multithreading", "JDBC", "Spring Boot", "Microservices"],
    certification: true,
    jobDemand: "Very High"
  },
  {
    name: "C++",
    description: "System programming, game development, and high-performance applications",
    icon: "⚙️",
    difficulty: "Advanced",
    students: "1.5M+",
    rating: 4.6,
    tutorials: 320,
    projects: 90,
    features: ["Systems", "Gaming", "Performance", "Embedded", "STL", "Templates"],
    topics: ["Pointers", "Memory Management", "STL", "Templates", "Multithreading", "Design Patterns"],
    certification: true,
    jobDemand: "High"
  },
  {
    name: "C#",
    description: "Microsoft's powerful language for web, desktop, and game development",
    icon: "🔷",
    difficulty: "Intermediate",
    students: "1.8M+",
    rating: 4.7,
    tutorials: 350,
    projects: 110,
    features: [".NET", "ASP.NET", "Unity", "Xamarin", "Azure", "WPF"],
    topics: ["OOP", "LINQ", "Entity Framework", "Web APIs", "Desktop Apps", "Game Development"],
    certification: true,
    jobDemand: "Very High"
  },
  {
    name: "Go",
    description: "Modern language for cloud services, DevOps, and microservices",
    icon: "🚀",
    difficulty: "Intermediate",
    students: "800K+",
    rating: 4.8,
    tutorials: 280,
    projects: 85,
    features: ["Cloud Native", "Microservices", "DevOps", "Concurrency", "Docker", "Kubernetes"],
    topics: ["Goroutines", "Channels", "Interfaces", "Packages", "Testing", "Performance"],
    certification: true,
    jobDemand: "High"
  },
  {
    name: "Rust",
    description: "Systems programming with memory safety and zero-cost abstractions",
    icon: "🦀",
    difficulty: "Advanced",
    students: "600K+",
    rating: 4.9,
    tutorials: 250,
    projects: 70,
    features: ["Memory Safety", "Systems", "WebAssembly", "Performance", "Cargo", "Tokio"],
    topics: ["Ownership", "Borrowing", "Lifetimes", "Traits", "Concurrency", "Unsafe Code"],
    certification: true,
    jobDemand: "Growing"
  },
  {
    name: "TypeScript",
    description: "JavaScript with types for large-scale application development",
    icon: "📘",
    difficulty: "Intermediate",
    students: "1.8M+",
    rating: 4.8,
    tutorials: 300,
    projects: 95,
    features: ["Type Safety", "Large Scale", "Angular", "React", "Node.js", "Decorators"],
    topics: ["Types", "Interfaces", "Generics", "Modules", "Decorators", "Advanced Types"],
    certification: true,
    jobDemand: "Very High"
  },
  {
    name: "Swift",
    description: "iOS and macOS app development with modern syntax",
    icon: "🍎",
    difficulty: "Intermediate",
    students: "900K+",
    rating: 4.7,
    tutorials: 270,
    projects: 80,
    features: ["iOS", "macOS", "SwiftUI", "UIKit", "Combine", "Core Data"],
    topics: ["Optionals", "Closures", "Protocols", "Extensions", "SwiftUI", "Concurrency"],
    certification: true,
    jobDemand: "High"
  },
  {
    name: "Kotlin",
    description: "Modern Android development and cross-platform applications",
    icon: "🤖",
    difficulty: "Intermediate",
    students: "750K+",
    rating: 4.8,
    tutorials: 260,
    projects: 75,
    features: ["Android", "Multiplatform", "Coroutines", "Spring", "Ktor", "Compose"],
    topics: ["Null Safety", "Coroutines", "Extensions", "Data Classes", "Android", "Multiplatform"],
    certification: true,
    jobDemand: "Growing"
  },
  {
    name: "PHP",
    description: "Server-side scripting for web development and content management",
    icon: "🐘",
    difficulty: "Beginner",
    students: "2.2M+",
    rating: 4.5,
    tutorials: 400,
    projects: 130,
    features: ["Web Development", "Laravel", "WordPress", "Symfony", "APIs", "Databases"],
    topics: ["Syntax", "OOP", "MVC", "Databases", "Frameworks", "Security"],
    certification: true,
    jobDemand: "High"
  },
  {
    name: "Ruby",
    description: "Developer-friendly language for web applications and automation",
    icon: "💎",
    difficulty: "Beginner",
    students: "650K+",
    rating: 4.6,
    tutorials: 220,
    projects: 65,
    features: ["Rails", "Web Development", "Scripting", "Gems", "Metaprogramming", "Testing"],
    topics: ["Syntax", "Blocks", "Modules", "Rails", "Gems", "Metaprogramming"],
    certification: true,
    jobDemand: "Moderate"
  },
  {
    name: "C",
    description: "Foundation language for system programming and embedded systems",
    icon: "🔧",
    difficulty: "Advanced",
    students: "1.2M+",
    rating: 4.5,
    tutorials: 300,
    projects: 85,
    features: ["Systems", "Embedded", "Performance", "Low-level", "Portability", "Hardware"],
    topics: ["Pointers", "Memory", "Structures", "File I/O", "System Calls", "Debugging"],
    certification: true,
    jobDemand: "Moderate"
  },
  {
    name: "Scala",
    description: "Functional and object-oriented programming for big data and web",
    icon: "⚖️",
    difficulty: "Advanced",
    students: "400K+",
    rating: 4.6,
    tutorials: 180,
    projects: 50,
    features: ["Functional", "Big Data", "Spark", "Akka", "Play", "Type Safety"],
    topics: ["Functional Programming", "Case Classes", "Traits", "Implicits", "Concurrency", "Big Data"],
    certification: true,
    jobDemand: "Moderate"
  },
  {
    name: "Dart",
    description: "Google's language for Flutter mobile and web development",
    icon: "🎯",
    difficulty: "Intermediate",
    students: "550K+",
    rating: 4.7,
    tutorials: 200,
    projects: 60,
    features: ["Flutter", "Mobile", "Web", "Cross-platform", "Hot Reload", "UI"],
    topics: ["Widgets", "State Management", "Async", "Packages", "Testing", "Deployment"],
    certification: true,
    jobDemand: "Growing"
  },
  {
    name: "R",
    description: "Statistical computing and data analysis with powerful visualization",
    icon: "📊",
    difficulty: "Intermediate",
    students: "480K+",
    rating: 4.5,
    tutorials: 190,
    projects: 55,
    features: ["Statistics", "Data Science", "Visualization", "Machine Learning", "Bioinformatics", "Research"],
    topics: ["Data Frames", "ggplot2", "Statistical Models", "Packages", "Shiny", "Tidyverse"],
    certification: true,
    jobDemand: "Moderate"
  },
  {
    name: "Perl",
    description: "Text processing and system administration automation",
    icon: "🐪",
    difficulty: "Intermediate",
    students: "320K+",
    rating: 4.3,
    tutorials: 150,
    projects: 40,
    features: ["Text Processing", "Regex", "Scripting", "CPAN", "Web Development", "Bioinformatics"],
    topics: ["Regular Expressions", "References", "Modules", "File Handling", "Web Programming", "Testing"],
    certification: true,
    jobDemand: "Low"
  },
  {
    name: "Haskell",
    description: "Pure functional programming with advanced type system",
    icon: "λ",
    difficulty: "Advanced",
    students: "180K+",
    rating: 4.7,
    tutorials: 120,
    projects: 30,
    features: ["Functional", "Pure", "Lazy Evaluation", "Type Safety", "Monads", "Academic"],
    topics: ["Functions", "Types", "Monads", "Lazy Evaluation", "Parsers", "Category Theory"],
    certification: true,
    jobDemand: "Low"
  },
  {
    name: "Assembly",
    description: "Low-level programming for hardware control and optimization",
    icon: "⚡",
    difficulty: "Expert",
    students: "150K+",
    rating: 4.4,
    tutorials: 100,
    projects: 25,
    features: ["Hardware", "Performance", "Embedded", "Reverse Engineering", "Security", "OS Development"],
    topics: ["Registers", "Instructions", "Memory", "CPU Architecture", "Optimization", "Debugging"],
    certification: true,
    jobDemand: "Specialized"
  },
  {
    name: "MATLAB",
    description: "Mathematical computing for engineering and scientific applications",
    icon: "🔢",
    difficulty: "Intermediate",
    students: "420K+",
    rating: 4.5,
    tutorials: 170,
    projects: 45,
    features: ["Mathematics", "Engineering", "Simulation", "Signal Processing", "Control Systems", "Plotting"],
    topics: ["Matrices", "Functions", "Plotting", "Toolboxes", "Simulink", "App Designer"],
    certification: true,
    jobDemand: "Specialized"
  }
];

const LanguageGrid = memo(() => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(12);

  // Memoize languages to prevent recreation
  const languages = useMemo(() => LANGUAGES_DATA, []);

  // Memoize difficulty color function
  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success text-success-foreground";
      case "Intermediate": return "bg-warning text-warning-foreground";
      case "Advanced": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  }, []);

  // Memoize navigation handler
  const handleStartLearning = useCallback((language: typeof languages[0]) => {
    // Navigate to specific pages based on language
    const languagePages = {
      java: '/java-learning',
      python: '/python-learning',
      javascript: '/javascript-learning',
      'c++': '/cpp-learning',
      'c#': '/csharp-learning',
      go: '/go-learning',
      rust: '/rust-learning',
      typescript: '/typescript-learning',
      swift: '/swift-learning',
      kotlin: '/kotlin-learning',
      php: '/php-learning',
      ruby: '/ruby-learning',
      c: '/c-learning',
      scala: '/scala-learning',
      dart: '/dart-learning',
      r: '/r-learning',
      perl: '/perl-learning',
      haskell: '/haskell-learning',
      assembly: '/assembly-learning',
      matlab: '/matlab-learning'
    };

    const targetPage = languagePages[language.name.toLowerCase() as keyof typeof languagePages] || '/learning-paths';
    navigate(targetPage);
  }, [navigate]);

  return (
    <section id="languages" className="py-24 bg-gradient-to-br from-background via-muted/20 to-background"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 40% 80%, rgba(72, 187, 120, 0.1) 0%, transparent 50%)`
      }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your <span className="gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">Programming Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            🌟 From beginner-friendly Python to advanced systems programming with Rust.
            Start with any language and build real-world projects. <span className="text-primary font-semibold">20+ languages</span> •
            <span className="text-accent font-semibold"> 1000+ tutorials</span> •
            <span className="text-secondary font-semibold"> Expert mentorship</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {languages.slice(0, visibleCount).map((lang, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.03,
                duration: 0.4,
                ease: "easeOut",
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
              layout
              style={{ willChange: "transform" }}
            >
              <Card
                data-language-card
                className="border-border bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden hover:bg-card h-full"
                onClick={() => handleStartLearning(lang)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-0 transform rotate-45 translate-x-12 -translate-y-12 group-hover:opacity-20 transition-all duration-500"></div>

                <CardHeader className="pb-2 relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-4xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{lang.icon}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getDifficultyColor(lang.difficulty)} group-hover:scale-110 transition-transform duration-300`}>
                      {lang.difficulty}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{lang.name}</CardTitle>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <span>👥</span>
                      <span className="group-hover:text-primary transition-colors duration-300">{lang.students} students</span>
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500 group-hover:animate-spin">⭐</span>
                      <span className="font-semibold group-hover:text-primary transition-colors duration-300">{lang.rating}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 relative z-10">
                  <CardDescription className="text-xs leading-relaxed line-clamp-2 group-hover:text-foreground transition-colors duration-300">
                    {lang.description}
                  </CardDescription>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1 group-hover:text-primary transition-colors duration-300">
                      <span className="group-hover:animate-bounce">📚</span>
                      <span className="font-medium">{lang.tutorials} tutorials</span>
                    </div>
                    <div className="flex items-center space-x-1 group-hover:text-accent transition-colors duration-300">
                      <span className="group-hover:animate-bounce">🚀</span>
                      <span className="font-medium">{lang.projects} projects</span>
                    </div>
                    <div className="flex items-center space-x-1 group-hover:text-secondary transition-colors duration-300">
                      <span className="group-hover:animate-bounce">🏆</span>
                      <span className="font-medium">{lang.certification ? 'Certified' : 'No Cert'}</span>
                    </div>
                    <div className="flex items-center space-x-1 group-hover:text-warning transition-colors duration-300">
                      <span className="group-hover:animate-bounce">💼</span>
                      <span className="font-medium">{lang.jobDemand}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {lang.features.slice(0, 4).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-sm group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300 hover:scale-110"
                      >
                        {feature}
                      </span>
                    ))}
                    {lang.features.length > 4 && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-sm group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                        +{lang.features.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium group-hover:text-primary transition-colors duration-300">🎯 Core Topics:</div>
                    <div className="flex flex-wrap gap-1">
                      {lang.topics.slice(0, 3).map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-sm group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 hover:scale-105"
                        >
                          {topic}
                        </span>
                      ))}
                      {lang.topics.length > 3 && (
                        <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-sm group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                          +{lang.topics.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-gradient-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-glow transition-all duration-500 text-sm font-bold transform group-hover:scale-105 active:scale-95 touch-target"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartLearning(lang);
                    }}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>🎯 Start Learning Now</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Magic "Explore More" Button */}
        <div className="flex justify-center mt-12 mb-8 animate-fade-in relative z-20">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative p-[2px] rounded-2xl overflow-hidden group hover:scale-105 active:scale-95 transition-all duration-500"
          >
            {/* Animated Gradient Border Layer */}
            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinity] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_25%,#EC4899_50%,#8B5CF6_75%,#3B82F6_100%)] opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

            <Button
              variant="ghost"
              size="lg"
              className="relative px-10 py-7 h-auto bg-slate-950/80 backdrop-blur-2xl rounded-[14px] border-none text-white font-black text-xl flex items-center gap-4 transition-all duration-500 hover:bg-slate-900/60"
              onClick={() => {
                if (visibleCount < languages.length) {
                  setVisibleCount(languages.length);
                } else {
                  setVisibleCount(12);
                }
              }}
            >
              <div className="flex flex-col items-center">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                  {visibleCount < languages.length ? "Explore Every Module" : "Show Best Picks Only"}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium group-hover:text-slate-300 transition-colors">
                  {visibleCount < languages.length ? `Unlock ${languages.length - visibleCount} More Premium Paths` : "Simplify Your View"}
                </span>
              </div>

              <div className="relative">
                <motion.div
                  animate={visibleCount < languages.length ? { y: [0, 5, 0] } : { y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-blue-600/30 p-2 rounded-lg border border-blue-500/50 group-hover:bg-blue-600/50 transition-colors"
                >
                  {visibleCount < languages.length ? "↓" : "↑"}
                </motion.div>
              </div>

              {/* Shimmer Swipe Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            </Button>

            {/* Glow Underlay */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10" />
          </motion.div>
        </div>

        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="mb-8">
            <p className="text-lg text-slate-400 mb-4 bg-white/5 inline-block px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
              🔥 Can't decide? Take our <span className="text-blue-400 font-black">AI Career Quiz</span> to find your perfect match!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
            <Button
              variant="hero"
              size="lg"
              className="w-full sm:min-w-[320px] py-8 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] transform hover:scale-105 active:scale-95 transition-all duration-500 font-black text-lg gap-3"
              onClick={() => navigate('/career')}
            >
              <span>🤖 Start AI Career Quiz</span>
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:min-w-[280px] py-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 text-lg font-bold backdrop-blur-md"
              onClick={() => navigate('/learning-paths')}
            >
              🎯 Full Roadmaps
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

LanguageGrid.displayName = "LanguageGrid";

export default LanguageGrid;