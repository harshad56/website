import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { apiService } from "@/services/ApiService";
import {
  Send,
  Code,
  Lightbulb,
  BookOpen,
  Target,
  TrendingUp,
  MessageCircle,
  FileText,
  Play,
  CheckCircle,
  AlertCircle,
  Zap,
  Brain,
  User,
  Bot,
  Clock,
  Star,
  RefreshCw,
  Search,
  Bug
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  code?: string;
  language?: string;
  suggestions?: string[];
}

interface LearningRecommendation {
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  category: string;
}

const AITutor = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI programming tutor. I can help you with:\n\n• Code explanations and debugging\n• Learning recommendations\n• Practice exercises\n• Concept explanations\n• Best practices and tips\n\nWhat would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Code Analysis State
  const [analysisCode, setAnalysisCode] = useState("");
  const [analysisLanguage, setAnalysisLanguage] = useState("javascript");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Recommendations State
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "chat") scrollToBottom();
  }, [messages, activeTab]);

  useEffect(() => {
    if (activeTab === "learning" && recommendations.length === 0) {
      fetchRecommendations();
    }
  }, [activeTab]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await apiService.aiTutorChat({
        message: inputMessage,
        language: user?.preferences?.preferredLanguage,
        context: messages.slice(-5).map(m => `${m.type}: ${m.content}`).join('\n')
      });

      if (response.success) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.response.text,
          timestamp: new Date(),
          code: response.response.code,
          language: response.response.language,
          suggestions: response.response.suggestions
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error(response.message || "Failed to get AI response");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Connection failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleAnalyzeCode = async () => {
    if (!analysisCode.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await apiService.aiTutorAnalyzeCode({
        code: analysisCode,
        language: analysisLanguage
      });

      if (response.success) {
        setAnalysisResult(response.analysis);
        toast({ title: "Analysis Complete", description: "Your code has been reviewed by the AI." });
      } else {
        throw new Error(response.message || "Analysis failed");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze code.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchRecommendations = async () => {
    setIsLoadingRecs(true);
    try {
      const response = await apiService.aiTutorGetRecommendations({
        language: user?.preferences?.preferredLanguage
      });

      if (response.success) {
        setRecommendations(Array.isArray(response.recommendations) ? response.recommendations : []);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Explain loops in Java",
    "Arrays vs Lists difference",
    "Effective debugging tips",
    "Explain OOP concepts",
    "Clean code best practices",
    "REST API explanation"
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalService",
    "name": "AI Programming Tutor",
    "description": "Get instant help with programming questions from our AI tutor. Learn coding concepts, debug code, and improve your skills with personalized guidance.",
    "provider": {
      "@type": "Organization",
      "name": "CodeAcademy Pro"
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-6 pt-6">
        <BackButton />
      </div>

      <SEO
        title="AI Tutor - Get Programming Help from AI | CodeAcademy Pro"
        description="Get instant help with programming questions from our AI tutor. Learn coding concepts, debug code, and improve your skills with personalized guidance."
        keywords="AI tutor, programming tutor, coding help, AI coding assistant"
        structuredData={structuredData}
      />

      <header className="py-12 border-b border-border mb-8">
        <div className="container mx-auto px-6 text-center">
          <Badge variant="outline" className="mb-4 py-1 px-3 border-primary/30 text-primary animate-pulse">
            <Zap className="w-3 h-3 mr-1 fill-primary" /> Specialized AI Tutor
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-indigo-500 to-secondary bg-clip-text text-transparent mb-4">
            CodeAcademy Pro AI Tutor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your 24/7 personalized guide to mastering code. From debugging to deep conceptual dives.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col border-border/50 shadow-xl bg-white/50 backdrop-blur-sm">
              <CardHeader className="border-b border-border/50 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Tutor Studio</CardTitle>
                      <CardDescription className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        {isTyping ? "Tutor is thinking..." : "Ready to help"}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                  <div className="px-6 border-b border-border/50">
                    <TabsList className="bg-transparent h-12 w-full justify-start space-x-6 p-0">
                      <TabsTrigger
                        value="chat"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" /> Chat
                      </TabsTrigger>
                      <TabsTrigger
                        value="code"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2"
                      >
                        <Search className="w-4 h-4 mr-2" /> Code Analysis
                      </TabsTrigger>
                      <TabsTrigger
                        value="learning"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" /> Learning Path
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-6">
                    <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border/50'
                              }`}>
                              {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-primary" />}
                            </div>
                            <div className={`rounded-2xl p-4 shadow-sm ${message.type === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                : 'bg-muted border border-border/50 rounded-tl-none'
                              }`}>
                              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                              {message.code && (
                                <div className="mt-4 bg-[#0d1117] rounded-xl overflow-hidden border border-white/10">
                                  <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                                      {message.language || 'Code'}
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-white/40 hover:text-white" onClick={() => navigator.clipboard.writeText(message.code || "")}>
                                      <FileText className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <pre className="p-4 overflow-x-auto">
                                    <code className="text-sm font-mono text-blue-300">
                                      {message.code}
                                    </code>
                                  </pre>
                                </div>
                              )}
                              {message.suggestions && (
                                <div className="mt-4 grid grid-cols-1 gap-2">
                                  {message.suggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setInputMessage(suggestion)}
                                      className="text-left text-xs bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/5"
                                    >
                                      💡 {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-muted border border-border/50 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                          </div>
                          <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex space-x-1">
                            <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-150"></div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="secondary"
                            size="sm"
                            onClick={() => setInputMessage(question)}
                            className="text-xs rounded-full border border-border/50"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>

                      <div className="relative group">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your programming question..."
                          className="pr-12 py-6 rounded-2xl border-border/50 focus-visible:ring-primary shadow-sm"
                          disabled={isTyping}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isTyping}
                          className="absolute right-2 top-2 h-8 w-8 rounded-xl p-0"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="flex-1 overflow-y-auto m-0 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold flex items-center text-primary">
                            <Code className="w-4 h-4 mr-2" /> Code Input
                          </h3>
                          <Select value={analysisLanguage} onValueChange={setAnalysisLanguage}>
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="java">Java</SelectItem>
                              <SelectItem value="cpp">C++</SelectItem>
                              <SelectItem value="typescript">TypeScript</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          placeholder="Paste your code snippet here..."
                          className="flex-1 font-mono text-sm min-h-[400px] border-border/50 rounded-xl resize-none"
                          value={analysisCode}
                          onChange={(e) => setAnalysisCode(e.target.value)}
                        />
                        <Button className="w-full py-6 rounded-xl shadow-lg" onClick={handleAnalyzeCode} disabled={isAnalyzing || !analysisCode.trim()}>
                          {isAnalyzing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                          Analyze My Code
                        </Button>
                      </div>

                      <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 overflow-y-auto">
                        {!analysisResult && !isAnalyzing && (
                          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                            <Bot className="w-12 h-12 mb-4 opacity-20" />
                            <h4 className="font-medium mb-1">No Analysis Yet</h4>
                            <p className="text-sm">Submit your code for AI-powered review, security checks, and optimization tips.</p>
                          </div>
                        )}
                        {isAnalyzing && (
                          <div className="h-full flex flex-col items-center justify-center text-center">
                            <RefreshCw className="w-12 h-12 mb-4 animate-spin text-primary" />
                            <h4 className="font-medium mb-1">Deep Analysis Running...</h4>
                            <p className="text-sm text-muted-foreground">Running security, quality, and performance audits.</p>
                          </div>
                        )}
                        {analysisResult && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-border pb-4">
                              <h3 className="font-bold text-lg">Analysis Result</h3>
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Complete</Badge>
                            </div>

                            <div className="space-y-4">
                              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                <h4 className="flex items-center font-semibold text-blue-700 mb-2">
                                  <Star className="w-4 h-4 mr-2" /> Code Quality
                                </h4>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">{analysisResult.quality}</div>
                              </div>

                              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                                <h4 className="flex items-center font-semibold text-orange-700 mb-2">
                                  <Zap className="w-4 h-4 mr-2" /> Improvements
                                </h4>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">{analysisResult.improvements}</div>
                              </div>

                              <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                                <h4 className="flex items-center font-semibold text-green-700 mb-2">
                                  <CheckCircle className="w-4 h-4 mr-2" /> Best Practices
                                </h4>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">{analysisResult.bestPractices}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="learning" className="flex-1 overflow-y-auto m-0 p-6">
                    <div className="max-w-4xl mx-auto space-y-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">Your AI Learning Path</h3>
                          <p className="text-muted-foreground">Dynamic curriculum tailored to your skills and progress.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchRecommendations} disabled={isLoadingRecs}>
                          <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingRecs ? 'animate-spin' : ''}`} /> Update Path
                        </Button>
                      </div>

                      {isLoadingRecs ? (
                        <div className="grid gap-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl"></div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {recommendations.length > 0 ? recommendations.map((rec, i) => (
                            <Card key={i} className="group hover:border-primary/50 transition-all shadow-md hover:shadow-xl border-border/50">
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                                        {rec.category}
                                      </Badge>
                                      <Badge variant="outline">{rec.difficulty}</Badge>
                                    </div>
                                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{rec.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
                                    <div className="flex items-center text-xs text-muted-foreground pt-4">
                                      <Clock className="w-3 h-3 mr-1" /> {rec.estimatedTime}
                                    </div>
                                  </div>
                                  <Button className="rounded-xl shadow-lg hover:scale-105 transition-transform">
                                    <Play className="w-4 h-4 mr-2" /> Learn Now
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )) : (
                            <Card className="p-12 text-center border-dashed border-border/50">
                              <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
                              <h4 className="text-lg font-semibold mb-2">No recommendations yet</h4>
                              <p className="text-muted-foreground max-w-sm mx-auto mb-6">Start chatting or analyze some code so I can understand your level better!</p>
                              <Button onClick={fetchRecommendations}>Generate Initial Path</Button>
                            </Card>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50 shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center tracking-wide uppercase text-muted-foreground font-semibold">
                  <TrendingUp className="w-4 h-4 mr-2" /> Skill Progression
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Active Learning</span>
                    <span className="text-primary">82%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-in slide-in-from-left duration-1000" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-border/50 text-center">
                    <div className="text-2xl font-bold">14</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Topics</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-border/50 text-center">
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Badges</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center tracking-wide uppercase text-muted-foreground font-semibold">
                  <Bot className="w-4 h-4 mr-2" /> Tutor Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  <div className="p-4 flex items-center hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-3 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Code className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-medium">Explain Method</div>
                  </div>
                  <div className="p-4 flex items-center hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center mr-3 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                      <Bug className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-medium">Debug Helper</div>
                  </div>
                  <div className="p-4 flex items-center hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mr-3 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-medium">Optimization Ideas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Star className="w-5 h-5 mr-2 fill-current" /> Weekly Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm opacity-90 leading-relaxed">Implement a linked list from scratch using generics.</p>
                <Button variant="secondary" className="w-full font-bold">Accept Challenge</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
