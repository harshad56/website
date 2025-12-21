import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Play, BookOpen, Code, Trophy, Clock, Users } from "lucide-react";
import { perlModules } from "@/data/perlCourse";
import { useAuth } from "@/contexts/AuthContext";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
import { getCourseSEO } from "@/utils/seoData";

const PerlLearning = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleParam = searchParams.get("module");
  const { isAuthenticated } = useAuth();
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

  const modules = perlModules;
  const currentModuleData = modules.find((m) => m.id === currentModule);

  const seo = getCourseSEO("perl");

  return (
    <div className="min-h-screen bg-background">
      <SEO {...seo} />
      
      {/* Beautiful Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" />
      </div>
      
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">🐪 Perl Programming Course</h1>
            </div>
            <Badge variant="secondary">Progress: {progress}%</Badge>
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
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Course Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>Perl is legendary for text processing and regex. Master scripting, CPAN modules, and system administration.</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Modules</TabsTrigger>
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                {modules.map((module) => (
                  <Card key={module.id} className="cursor-pointer hover:shadow-md">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <CardTitle>Module {module.id}: {module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                        <Button 
                          onClick={() => { 
                            setCurrentModule(module.id); 
                            setActiveTab("current"); 
                          }} 
                          variant={currentModule === module.id ? "default" : "outline"}
                        >
                          {currentModule === module.id ? "Current" : "Start"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {module.topics.map((t, i) => (
                          <Badge key={i} variant="secondary">{t.title}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="current" className="space-y-4">
                {currentModuleData && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Module {currentModuleData.id}: {currentModuleData.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {currentModuleData.topics.map((topic) => (
                          <Card key={topic.id} className="border-l-4 border-l-primary">
                            <CardHeader>
                              <CardTitle className="text-lg">{topic.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center">
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                  <span>{topic.duration}</span>
                                  <Badge variant="outline">{topic.difficulty}</Badge>
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={() => navigate(`/perl-learning/topic/${currentModuleData.id}/${topic.id}`)}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Start
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
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
              <TabsContent value="practice">
                <Card>
                  <CardHeader>
                    <CardTitle>Practice Editor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea 
                      value={userCode} 
                      onChange={(e) => setUserCode(e.target.value)} 
                      placeholder="Write Perl code..." 
                      className="min-h-[200px] font-mono" 
                    />
                    <Button onClick={() => setOutput("Executed!")}>
                      <Play className="w-4 h-4 mr-2" />
                      Run
                    </Button>
                    {output && (
                      <pre className="bg-muted p-4 rounded-lg text-sm">
                        {output}
                      </pre>
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

export default PerlLearning;




