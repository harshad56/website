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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MoreVertical, BookOpen, Blocks, GraduationCap, CircleUser, LogIn, ChevronDown, ChevronUp, LogOut, Lock, Globe } from "lucide-react";

const Header = memo(() => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

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
      setShowWelcomeDialog(true);
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
            <div className="w-10 h-10 overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:shadow-glow">
              <img src="/brand-logo.png" alt="CodeAcademy Pro Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl lg:text-2xl font-bold gradient-text hidden xl:inline">CodeAcademy Pro</span>
          </div>

          {/* Desktop Navigation - Main Items */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  Languages
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={10}
                align="start"
                className="max-h-[400px] overflow-y-auto pt-2 bg-background/80 border-border/50 backdrop-blur-xl shadow-2xl"
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
                className="max-h-[400px] overflow-y-auto pt-2 bg-background/80 border-border/50 backdrop-blur-xl shadow-2xl"
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
          <div className="hidden lg:flex flex-1 max-w-xs ml-auto mr-4">
            <SearchBox className="w-full" />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-1 px-2 hover:bg-primary/10 transition-all duration-300">
                      <Avatar className="w-8 h-8 ring-2 ring-primary/20">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left hidden lg:block">
                        <div className="text-sm font-semibold leading-none mb-1 text-foreground">{user?.name}</div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 mt-2 p-1.5 bg-background/80 border-border/50 backdrop-blur-xl shadow-2xl"
                  >
                    {/* User Info Header */}
                    <div className="px-3 py-2.5 mb-1 border-b border-border/10">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground leading-tight">{user?.name}</span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">{user?.email}</span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenuItem
                      onClick={() => navigate('/settings')}
                      className="cursor-pointer font-medium px-3 py-2.5 rounded-md mb-0.5 text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all outline-none border-none focus:bg-muted/50 focus:text-foreground"
                    >
                      <Blocks className="w-4 h-4 mr-3 text-indigo-500" />
                      Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-border/50 my-1" />

                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-red-500 font-medium px-3 py-2.5 rounded-md hover:text-red-600 hover:bg-red-500/10 transition-all outline-none border-none focus:bg-red-500/10 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                        <Avatar className="w-8 h-8 border-2 border-primary/20">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">{user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2 bg-background/95 backdrop-blur-xl border-border/50">
                      <div className="px-3 py-2 border-b border-border/10">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                        <Blocks className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer focus:text-red-600 focus:bg-red-500/10">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="whitespace-nowrap font-medium text-foreground hover:text-primary transition-colors">
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px] max-h-[80vh] overflow-y-auto bg-background/95 border-border/50 backdrop-blur-xl shadow-2xl p-2">
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

                  {!isAuthenticated ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleStartTrial} className="text-primary font-medium">
                        Start Free Trial 🚀
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-destructive font-medium cursor-pointer">
                        Sign Out
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

      {/* Welcome Dialog */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="bg-slate-900 border border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Globe className="w-5 h-5 text-indigo-400" />
              Welcome to CodeAcademy Pro!
            </DialogTitle>
            <DialogDescription className="text-slate-300 pt-2 text-base leading-relaxed">
              Choose your programming language to start your <strong>free trial</strong>.
              Unlock unlimited access to all courses, projects, and mentorship.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowWelcomeDialog(false)} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold">
              Let's Start 🚀
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </header>
  );
});

Header.displayName = 'Header';

export default Header;