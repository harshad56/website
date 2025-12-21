import { useState, memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import SearchBox from "@/components/SearchBox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, BookOpen, Blocks, GraduationCap, CircleUser, LogIn, ChevronDown, ChevronUp } from "lucide-react";

const Header = memo(() => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setMobileExpandedSection(prev => prev === section ? null : section);
  };

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  const handleStartTrial = useCallback(() => {
    // Scroll to languages section to start the trial
    scrollToSection('languages');

    // Show welcome message
    setTimeout(() => {
      alert('🎉 Welcome to CodeAcademy Pro! Choose your programming language to start your free trial.');
    }, 1000);
  }, [scrollToSection]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-3 lg:gap-6">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300 flex-shrink-0"
            onClick={() => scrollToSection('hero')}
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg hover:shadow-glow transition-all duration-300">
              <span className="text-primary-foreground font-bold text-xl">C</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold gradient-text hidden lg:inline">CodeAcademy Pro</span>
          </div>

          {/* Desktop Navigation - Main Items */}
          <div className="hidden md:flex items-center gap-2 lg:gap-5 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  Languages
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={10}
                align="start"
                className="max-h-[400px] overflow-y-auto pt-2"
              >
                <DropdownMenuItem onClick={() => navigate("/python-learning")} className="mt-1">Python</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/javascript-learning")}>JavaScript</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/java-learning")}>Java</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/cpp-learning")}>C++</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/c-learning")}>C</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/csharp-learning")}>C#</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/go-learning")}>Go</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/rust-learning")}>Rust</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/typescript-learning")}>TypeScript</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/swift-learning")}>Swift</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/kotlin-learning")}>Kotlin</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/php-learning")}>PHP</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/ruby-learning")}>Ruby</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/scala-learning")}>Scala</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dart-learning")}>Dart</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/r-learning")}>R</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/perl-learning")}>Perl</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/haskell-learning")}>Haskell</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/assembly-learning")}>Assembly</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/matlab-learning")}>MATLAB</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button onClick={() => navigate('/study-materials')} className="text-base font-medium text-foreground hover:text-primary transition-colors">
              Study Materials
            </button>

            <Link to="/real-projects" className="text-base font-medium text-foreground hover:text-primary transition-colors">
              Real Projects
            </Link>

            <Link to="/courses" className="text-base font-medium text-foreground hover:text-primary transition-colors">
              Courses
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  More
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={10}
                align="start"
                className="max-h-[400px] overflow-y-auto pt-2"
              >
                <DropdownMenuItem onClick={() => navigate('/learning-paths')} className="mt-1">Learning Paths</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/code-playground')}>Code Playground</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/algorithm-challenges')}>Algorithm Challenges</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/interactive-tutorials')}>Interactive Tutorials</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/project-library')}>Project Library</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/code-reviews')}>Code Reviews</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/ai-tutor')}>AI Tutor</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/study-groups')}>Study Groups</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/mentorship')}>Mentorship</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/challenges')}>Challenges</DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection('success-stories')}>Success Stories</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/blog')}>Developer Blog</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/jobs')}>Job Board</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/resume-builder')}>Resume Builder</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/interview-practice')}>Interview Practice</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/salary-guide')}>Salary Guide</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/careers')}>Careers</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/pricing')}>Pricing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/contact')}>Contact</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/about" className="text-base font-medium text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* Desktop Search Box - Right Side */}
          <div className="hidden md:flex flex-1 max-w-xs ml-auto mr-4">
            <SearchBox className="w-full" />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <Badge variant="secondary" className="text-xs">
                  {user?.progress.totalPoints} pts
                </Badge>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.progress.currentStreak} day streak
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/sign-in')}
                >
                  Sign In
                </Button>
                <Button
                  variant="hero"
                  size="sm"
                  className="animate-pulse hover:animate-none shadow-glow"
                  onClick={handleStartTrial}
                >
                  Start Free Trial 🎯
                </Button>
              </>
            )}
          </div>

          {/* Mobile Actions - Text Navigation */}
          <div className="md:hidden flex items-center gap-1 w-full overflow-x-auto no-scrollbar mask-gradient-right">
            <div className="flex items-center gap-1 flex-nowrap pr-2">
              <Button
                variant="ghost"
                size="sm"
                className="whitespace-nowrap font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => navigate('/study-materials')}
              >
                Study Materials
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="whitespace-nowrap font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => navigate('/real-projects')}
              >
                Real Projects
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="whitespace-nowrap font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => navigate('/courses')}
              >
                Courses
              </Button>

              {!isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="whitespace-nowrap font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => navigate('/sign-in')}
                >
                  Sign In
                </Button>
              )}

              {isAuthenticated && (
                <div className="mr-1 ml-1 flex-shrink-0">
                  <Avatar className="w-8 h-8 border-2 border-primary/20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="whitespace-nowrap font-medium text-foreground hover:text-primary transition-colors">
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px] max-h-[80vh] overflow-y-auto">
                  {/* Languages Accordion */}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSection('languages');
                    }}
                    className="flex items-center justify-between font-medium"
                  >
                    <span className="flex items-center gap-2">🌍 Languages</span>
                    {mobileExpandedSection === 'languages' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </DropdownMenuItem>

                  {mobileExpandedSection === 'languages' && (
                    <div className="pl-4 border-l-2 border-muted ml-2 space-y-1 my-1 animate-in slide-in-from-top-2 duration-200">
                      <DropdownMenuItem onClick={() => navigate("/python-learning")}>Python</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/javascript-learning")}>JavaScript</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/java-learning")}>Java</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/cpp-learning")}>C++</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/c-learning")}>C</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/csharp-learning")}>C#</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/go-learning")}>Go</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/rust-learning")}>Rust</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/typescript-learning")}>TypeScript</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/swift-learning")}>Swift</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/kotlin-learning")}>Kotlin</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/php-learning")}>PHP</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/ruby-learning")}>Ruby</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/scala-learning")}>Scala</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/dart-learning")}>Dart</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/r-learning")}>R</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/perl-learning")}>Perl</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/haskell-learning")}>Haskell</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/assembly-learning")}>Assembly</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/matlab-learning")}>MATLAB</DropdownMenuItem>
                    </div>
                  )}

                  {/* More Accordion */}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSection('more');
                    }}
                    className="flex items-center justify-between font-medium"
                  >
                    <span className="flex items-center gap-2">⭐ More</span>
                    {mobileExpandedSection === 'more' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </DropdownMenuItem>

                  {mobileExpandedSection === 'more' && (
                    <div className="pl-4 border-l-2 border-muted ml-2 space-y-1 my-1 animate-in slide-in-from-top-2 duration-200">
                      <DropdownMenuItem onClick={() => navigate('/learning-paths')}>🎯 Learning Paths</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/code-playground')}>Code Playground</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/algorithm-challenges')}>Algorithm Challenges</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/interactive-tutorials')}>Interactive Tutorials</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/project-library')}>Project Library</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/code-reviews')}>Code Reviews</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/ai-tutor')}>AI Tutor</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/study-groups')}>Study Groups</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/mentorship')}>Mentorship</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/challenges')}>Challenges</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => scrollToSection('success-stories')}>Success Stories</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/blog')}>Developer Blog</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/jobs')}>Job Board</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/resume-builder')}>Resume Builder</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/interview-practice')}>Interview Practice</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/salary-guide')}>Salary Guide</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/careers')}>Careers</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/pricing')}>Pricing</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/contact')}>Contact</DropdownMenuItem>
                    </div>
                  )}

                  {!isAuthenticated && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleStartTrial} className="text-primary font-medium">
                        Start Free Trial 🚀
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/about')}>
                    About
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/contact')}>
                    Contact
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </div>

      {/* Auth Modal - Removed duplicate, using the one from App.tsx */}
    </header>
  );
});

Header.displayName = 'Header';

export default Header;