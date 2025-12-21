import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Play, BookOpen, Code, Trophy, Clock, Users } from "lucide-react";
import { goModules } from "@/data/goCourse";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
import { getCourseSEO } from "@/utils/seoData";

const GoLearning = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleParam = searchParams.get("module");
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [currentModule, setCurrentModule] = useState(moduleParam ? Number(moduleParam) : 1);
  const [progress, setProgress] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState(moduleParam ? "current" : "overview");
  
  useEffect(() => {
    if (moduleParam) {
      setCurrentModule(Number(moduleParam));
      setActiveTab("current");
    }
  }, [moduleParam]);

  const modules = goModules;

  const currentModuleData = modules.find(m => m.id === currentModule);

  const startModule = (moduleId: number) => {
    setCurrentModule(moduleId);
    setProgress(0);
    setUserCode("");
    setOutput("");
  };

  const startTopic = (moduleId: number, topicId: string) => {
    navigate(`/go-learning/topic/${moduleId}/${topicId}`);
  };

  const runCode = () => {
    setOutput("Code executed successfully!\nOutput: Hello, World!");
  };

  const completeModule = () => {
    setProgress(100);
  };

  const seo = getCourseSEO("go");

  return (
    <div className="min-h-screen bg-background">
      <SEO {...seo} />
      
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">🐹 Go Programming Course</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Progress: {progress}%</Badge>
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
                  <span className="text-sm text-muted-foreground">Total Duration: 23.7 hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">184 Exercises</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">12,543 Students</span>
                </div>
                
                <Alert>
                  <AlertDescription>
                    Go is a modern programming language developed by Google, known for its simplicity, 
                    efficiency, and excellent concurrency support. Learn Go from basics to advanced 
                    features, perfect for building scalable web services and cloud applications.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h4 className="font-semibold">What you'll learn:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Go syntax and fundamentals</li>
                    <li>• Control flow and functions</li>
                    <li>• Data structures (slices, maps, structs)</li>
                    <li>• Interfaces and methods</li>
                    <li>• Concurrency with goroutines and channels</li>
                    <li>• Error handling and testing</li>
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
                <div className="grid gap-4">
                  {modules.map((module) => (
                    <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center">
                              {module.completed && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
                              Module {module.id}: {module.title}
                            </CardTitle>
                            <CardDescription>{module.description}</CardDescription>
                          </div>
                          <Button 
                            onClick={() => startModule(module.id)}
                            variant={currentModule === module.id ? "default" : "outline"}
                          >
                            {currentModule === module.id ? "Current" : "Start"}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{module.topics.length}</div>
                            <div className="text-xs text-muted-foreground">Topics</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{module.duration}</div>
                            <div className="text-xs text-muted-foreground">Duration</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{module.exercises}</div>
                            <div className="text-xs text-muted-foreground">Exercises</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">Beginner</div>
                            <div className="text-xs text-muted-foreground">Level</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Topics:</h4>
                          <div className="flex flex-wrap gap-2">
                            {module.topics.map((topic, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {topic.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="current" className="space-y-4">
                {currentModuleData && (
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
                        placeholder="Write your Go code here..."
                        className="min-h-[200px] font-mono"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={runCode}>
                        <Play className="w-4 h-4 mr-2" />
                        Run Code
                      </Button>
                      <Button variant="outline" onClick={() => setUserCode("")}>
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

export default GoLearning;
