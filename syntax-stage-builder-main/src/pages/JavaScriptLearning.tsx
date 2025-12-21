import { useMemo, useState, useCallback, memo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Play, BookOpen, Code, Trophy, Clock, Users } from "lucide-react";
import { useCodeRunner } from "@/hooks/useCodeRunner";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useModuleState } from "@/hooks/useModuleState";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
import { ModulesList } from "@/components/ModulesList";

const JavaScriptLearning = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleParam = searchParams.get("module");
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [modules, setModules] = useState<any[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  
  // Lazy load course data to prevent blocking initial render
  useEffect(() => {
    import('@/data/javascriptCourse').then((module) => {
      setModules(module.javascriptModules);
      setIsLoadingModules(false);
    });
  }, []);
  
  // Use persistent state hook for fast back navigation
  const [currentModuleId, setCurrentModuleId, activeTab, setActiveTab] = useModuleState(
    'javascript-learning-state',
    1,
    moduleParam
  );
  
  const [progress, setProgress] = useState(0);
  const {
    code: userCode,
    setCode: setUserCode,
    output,
    setOutput,
    isRunning,
    runCode
  } = useCodeRunner("javascript");

  const currentModuleData = useMemo(
    () => modules.find((module) => module.id === currentModuleId),
    [modules, currentModuleId]
  );

  const startModule = useCallback((moduleId: number) => {
    setCurrentModuleId(moduleId);
    setProgress(0);
    setUserCode("");
    setOutput("");
  }, []);

  const startTopic = useCallback((moduleId: number, topicId: string) => {
    navigate(`/javascript-learning/topic/${moduleId}/${topicId}`);
  }, [navigate]);

  const completeModule = useCallback(() => {
    setProgress(100);
  }, []);

  // Memoize calculations to prevent recalculation on every render
  const totalExercises = useMemo(() => 
    modules.reduce((sum, module) => sum + module.exercises, 0), 
    [modules]
  );
  const totalTopics = useMemo(() => 
    modules.reduce((sum, module) => sum + module.topics.length, 0), 
    [modules]
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "JavaScript Programming Course",
    "description": "Master JavaScript for web development. Learn modern ES6+, React, Node.js, and build real-world applications.",
    "provider": {
      "@type": "Organization",
      "name": "CodeAcademy Pro"
    },
    "courseCode": "JS-101",
    "educationalLevel": "Beginner to Advanced"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="JavaScript Programming Course - Learn JavaScript Online"
        description="Master JavaScript programming with interactive lessons, hands-on exercises, and real-world projects. Learn ES6+, React, Node.js, and modern web development."
        keywords="JavaScript, JS, learn JavaScript, JavaScript course, JavaScript tutorial, web development, React, Node.js, ES6"
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
              <h1 className="text-2xl font-bold">⚡ JavaScript Programming Course</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Progress: {progress}%</Badge>
              <Button variant="outline" size="sm" onClick={completeModule}>
                <BookOpen className="w-4 h-4 mr-2" />
                Mark Module Complete
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
                  <span className="text-sm text-muted-foreground">Modules: {modules.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{totalExercises} Exercises</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{totalTopics} Topics</span>
                </div>

                <Alert>
                  <AlertDescription>
                    JavaScript powers every interactive experience on the modern web. Follow this
                    roadmap to move from syntax fundamentals to advanced asynchronous applications.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h4 className="font-semibold">What you'll learn:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Core syntax, types, and execution model</li>
                    <li>• Control flow, functional patterns, and closures</li>
                    <li>• Arrays, objects, and JSON best practices</li>
                    <li>• DOM, events, and browser APIs</li>
                    <li>• ES6+ features, modules, and tooling</li>
                    <li>• Asynchronous JavaScript and API integration</li>
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
                    currentModule={currentModuleId}
                    onStartModule={startModule}
                  />
                )}
              </TabsContent>

              <TabsContent value="current" className="space-y-4">
                {currentModuleData ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Module {currentModuleData.id}: {currentModuleData.title}
                        </CardTitle>
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
                                  <Button onClick={() => startTopic(currentModuleData.id, topic.id)} size="sm">
                                    <Play className="w-4 h-4 mr-2" />
                                    Start Topic
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
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
                        onChange={(event) => setUserCode(event.target.value)}
                        placeholder="Write your JavaScript code here..."
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
                        <pre className="bg-muted p-4 rounded-lg mt-2 text-sm">{output}</pre>
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

export default memo(JavaScriptLearning);
