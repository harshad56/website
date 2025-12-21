import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Play, BookOpen, Code, Trophy, Clock, Users, Award } from "lucide-react";
import { useCodeRunner } from "@/hooks/useCodeRunner";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useModuleState } from "@/hooks/useModuleState";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
import { ModulesList } from "@/components/ModulesList";

const PythonLearning = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleParam = searchParams.get("module");
  const { user, isAuthenticated, updateProgress } = useAuth();
  const { toast } = useToast();
  const [pythonModules, setPythonModules] = useState<any[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  
  // Lazy load course data to prevent blocking initial render
  useEffect(() => {
    import('@/data/pythonCourse').then((module) => {
      setPythonModules(module.pythonModules);
      setIsLoadingModules(false);
    });
  }, []);
  
  // Use persistent state hook for fast back navigation
  const [currentModule, setCurrentModule, activeTab, setActiveTab] = useModuleState(
    'python-learning-state',
    1,
    moduleParam
  );
  
  const {
    code: userCode,
    setCode: setUserCode,
    output,
    setOutput,
    isRunning,
    runCode
  } = useCodeRunner("python");

  const completedModuleSet = useMemo(() => {
    return new Set(
      (user?.progress.completedModules || []).filter((id) => id.startsWith("python-module-"))
    );
  }, [user]);

  // Course data loaded asynchronously - prevents blocking
  const modules = useMemo(() => {
    if (!pythonModules.length) return [];
    return pythonModules.map((module) => ({
      ...module,
      completed: completedModuleSet.has(`python-module-${module.id}`)
    }));
  }, [pythonModules, completedModuleSet]);

  const completionPercent = modules.length > 0 
    ? Math.round((completedModuleSet.size / modules.length) * 100)
    : 0;

  const currentModuleData = modules.find(m => m.id === currentModule);

  const startModule = useCallback((moduleId: number) => {
    setCurrentModule(moduleId);
    setUserCode("");
    setOutput("");
  }, []);

  const startTopic = useCallback((moduleId: number, topicId: string) => {
    navigate(`/python-learning/topic/${moduleId}/${topicId}`);
  }, [navigate]);

  const handleModuleCompletion = useCallback(() => {
    if (!currentModuleData) return;
    if (!isAuthenticated) {
      toast({
        title: "Sign in to save progress",
        description: "Create an account to unlock checkpoints and milestones.",
      });
      navigate("/sign-in");
      return;
    }

    const moduleKey = `python-module-${currentModuleData.id}`;
    if (completedModuleSet.has(moduleKey)) {
      toast({
        title: "Already completed",
        description: `${currentModuleData.title} is already in your progress.`,
      });
      return;
    }

    updateProgress(moduleKey);
    toast({
      title: `Milestone unlocked`,
      description: `Great job! Module ${currentModuleData.id} is complete.`,
    });
  }, [currentModuleData, isAuthenticated, completedModuleSet, updateProgress, toast, navigate]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Python Programming Course",
    "description": "Learn Python from basics to advanced features. Perfect for web development, data science, automation, and more.",
    "provider": {
      "@type": "Organization",
      "name": "CodeAcademy Pro"
    },
    "courseCode": "PYTHON-101",
    "educationalLevel": "Beginner to Advanced",
    "timeRequired": "PT20H36M",
    "numberOfCredits": "0"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Python Programming Course - Learn Python Online"
        description="Master Python programming with interactive lessons, hands-on exercises, and real-world projects. Learn Python syntax, data structures, OOP, and advanced features."
        keywords="Python, Python programming, learn Python, Python course, Python tutorial, Python for beginners, Python web development, Python data science"
        structuredData={structuredData}
      />
      
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">🐍 Python Programming Course</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Progress: {completionPercent}%</Badge>
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Course Notes
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-4">
        {!isAuthenticated && (
          <Alert>
            <AlertDescription className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <span>Track your progress, earn streaks, and unlock milestones by creating a free account.</span>
              <Button size="sm" onClick={() => navigate("/sign-in")}>
                Sign in to save progress
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Course Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Duration: 20.6 hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">155 Exercises</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">31,245 Students</span>
                </div>
                
                <Alert>
                  <AlertDescription>
                    Python is a versatile, high-level programming language known for its simplicity and readability. 
                    Learn Python from basics to advanced features, perfect for web development, data science, 
                    automation, and more.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h4 className="font-semibold">What you'll learn:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Python syntax and fundamentals</li>
                    <li>• Control flow and functions</li>
                    <li>• Data structures (lists, dicts, sets)</li>
                    <li>• Object-oriented programming</li>
                    <li>• File handling and exceptions</li>
                    <li>• Advanced Python features</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Course Modules</TabsTrigger>
                <TabsTrigger value="current">Current Module</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {isLoadingModules ? (
                  <div className="grid gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-6 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-32 bg-muted rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <ModulesList 
                    modules={modules}
                    currentModule={currentModule}
                    onStartModule={startModule}
                  />
                )}
              </TabsContent>

              <TabsContent value="current" className="space-y-4">
                {currentModuleData ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Module {currentModuleData.id}: {currentModuleData.title}</CardTitle>
                        <CardDescription>{currentModuleData.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {currentModuleData.topics.map((topic) => (
                            <Card key={topic.id} className="border-l-4 border-l-primary">
                              <CardHeader>
                                <CardTitle className="text-lg">{topic.title}</CardTitle>
                                <CardDescription>{topic.content}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <span>⏱️ {topic.duration}</span>
                                    <span>📊 {topic.exercises} exercises</span>
                                    <Badge variant="outline">{topic.difficulty}</Badge>
                                  </div>
                                  <Button 
                                    onClick={() => startTopic(currentModuleData.id, topic.id)}
                                    size="sm"
                                  >
                                    <Play className="w-4 h-4 mr-2" />
                                    Start Topic
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          <Button 
                            className="w-full"
                            onClick={() => startTopic(currentModuleData.id, currentModuleData.topics[0].id)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start First Topic
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleModuleCompletion}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Module Complete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Code Example</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{currentModuleData.codeExample}</code>
                        </pre>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-primary" />
                          Python Path Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>{completedModuleSet.size} / {modules.length} modules complete</span>
                          <span className="font-semibold">{completionPercent}%</span>
                        </div>
                        <Progress value={completionPercent} />
                        {completedModuleSet.size === 0 && (
                          <p className="text-sm text-muted-foreground">
                            Complete Module {currentModuleData.id} to unlock your first milestone badge.
                          </p>
                        )}
                        {completedModuleSet.size > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Keep the streak going! Your next milestone unlocks at Module {Math.min(completedModuleSet.size + 1, modules.length)}.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground">Select a module to get started</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="practice" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Code Editor</CardTitle>
                    <CardDescription>Practice coding with real-time execution</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Your Code:</label>
                      <Textarea
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder="Write your Python code here..."
                        className="min-h-[200px] font-mono"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={runCode} disabled={isRunning}>
                        <Play className="w-4 h-4 mr-2" />
                        {isRunning ? "Running..." : "Run Code"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUserCode("");
                          setOutput("");
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                    {output && (
                      <div>
                        <label className="text-sm font-medium">Output:</label>
                        <pre className="bg-muted p-4 rounded-lg mt-2 text-sm">
                          {output}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(PythonLearning);
