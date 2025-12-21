import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, Code, BookOpen } from "lucide-react";
import { assemblyModules } from "@/data/assemblyCourse";
import { useAuth } from "@/contexts/AuthContext";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
import { getCourseSEO } from "@/utils/seoData";

const AssemblyLearning = () => {
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

  const modules = assemblyModules;
  const currentModuleData = modules.find((m) => m.id === currentModule);

  const seo = getCourseSEO("assembly");

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
              <h1 className="text-2xl font-bold">⚡ Assembly Course</h1>
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
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>Assembly gives you direct control over hardware. Master CPU architecture, registers, and low-level programming.</AlertDescription>
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
                {modules.map((m) => (
                  <Card key={m.id}>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <CardTitle>Module {m.id}: {m.title}</CardTitle>
                          <CardDescription>{m.description}</CardDescription>
                        </div>
                        <Button 
                          onClick={() => { 
                            setCurrentModule(m.id); 
                            setActiveTab("current"); 
                          }} 
                          variant={currentModule === m.id ? "default" : "outline"}
                        >
                          {currentModule === m.id ? "Current" : "Start"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {m.topics.map((t, i) => (
                          <Badge key={i} variant="secondary">{t.title}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="current">
                {currentModuleData && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>{currentModuleData.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {currentModuleData.topics.map((t) => (
                          <Card key={t.id} className="border-l-4 border-l-primary">
                            <CardHeader>
                              <CardTitle className="text-lg">{t.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">{t.duration} • {t.difficulty}</span>
                                <Button 
                                  size="sm" 
                                  onClick={() => navigate(`/assembly-learning/topic/${currentModuleData.id}/${t.id}`)}
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
                        <CardTitle>Example</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{currentModuleData.codeExample}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
              <TabsContent value="practice">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <Textarea 
                      value={userCode} 
                      onChange={(e) => setUserCode(e.target.value)} 
                      placeholder="Assembly code..." 
                      className="min-h-[200px] font-mono" 
                    />
                    <Button onClick={() => setOutput("Assembled!")}>
                      <Play className="w-4 h-4 mr-2" />
                      Assemble
                    </Button>
                    {output && (
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
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

export default AssemblyLearning;




