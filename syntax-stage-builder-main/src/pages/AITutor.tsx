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
import { motion, AnimatePresence } from "framer-motion";
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
  Bug,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Terminal,
  ShieldCheck,
  Cpu
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
    if (activeTab === "learning" && recommendations.length === 0 && isAuthenticated) {
      fetchRecommendations();
    }
  }, [activeTab, isAuthenticated]);

  // Load challenge context from sessionStorage if available
  useEffect(() => {
    const challengeContext = sessionStorage.getItem('aiTutorContext');

    if (challengeContext && isAuthenticated && !inputMessage) {
      // Clear the stored context
      sessionStorage.removeItem('aiTutorContext');
      sessionStorage.removeItem('aiTutorChallenge');

      // Pre-fill the input message
      setInputMessage(challengeContext);

      // Switch to chat tab
      setActiveTab('chat');
    }
  }, [isAuthenticated]);

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
      // Build context from last 5 messages
      const context = messages.slice(-5).map(m => `${m.type}: ${m.content}`).join('\n');

      const response = await apiService.aiTutorChat({
        message: inputMessage,
        language: user?.preferences?.preferredLanguage || 'general',
        context: context
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
        toast({
          title: "Error",
          description: response.message || "Failed to get AI response",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Could not connect to the AI service",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleAnalyzeCode = async (task?: string) => {
    if (!analysisCode.trim() || isAnalyzing) {
      if (!analysisCode.trim()) {
        toast({
          title: "Input Required",
          description: "Please paste some code in the Source Input box first.",
        });
      }
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setActiveTab('code');

    try {
      const response = await apiService.aiTutorAnalyzeCode({
        code: analysisCode,
        language: analysisLanguage,
        task: task || 'General code review'
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

  const handleUtilityTool = (toolLabel: string) => {
    let task = '';
    switch (toolLabel) {
      case "Structural Explanation":
        task = "Explain the architecture and data flow of this code in simple terms.";
        break;
      case "Fault Simulation":
        task = "Find potential bugs, edge cases, and security vulnerabilities in this code.";
        break;
      case "Atomic Optimization":
        task = "Suggest ways to improve the performance and readability of this code through refactoring.";
        break;
    }
    handleAnalyzeCode(task);
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
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 pb-20 overflow-x-hidden">
      <SEO
        title="AI Tutor - Specialized Programming Help | CodeAcademy Pro"
        description="Master programming with our specialized AI Tutor. Get code explanations, debugging help, and personalized learning paths."
        keywords="AI tutor, coding tutor, programming help, AI code mentor"
        structuredData={structuredData}
      />

      {/* Modern Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full animate-pulse-slow delay-700"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Navbar-style Breadcrumb */}
        <div className="py-4 sm:py-6 flex items-center justify-between border-b border-white/5 mb-6 sm:mb-8">
          <BackButton />
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AI Protected</span>
            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> GPT-4o Specialized</span>
          </div>
        </div>

        {/* Hero Section */}
        <header className="mb-8 sm:mb-12 text-center relative px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 sm:mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-300">Intelligent Studio</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 tracking-tight">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-violet-400 antialiased">Craft</span> With AI.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Not just another chatbot. A specialized pair programmer trained to explain deep concepts, audit your code, and architect your learning journey.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 relative">
            {!isAuthenticated && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020617]/40 backdrop-blur-md rounded-[32px] border border-white/5">
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-black">Sign In Required</h3>
                  <p className="text-slate-400 max-w-xs mx-auto">Please login to your CodeAcademy Pro account to access the AI Studio and specialized tutors.</p>
                  <Button
                    onClick={() => window.location.href = '/sign-in'}
                    className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-500 font-bold"
                  >
                    Take Me To Login
                  </Button>
                </div>
              </div>
            )}
            <motion.div
              layout
              className={`bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col min-h-[600px] sm:min-h-[850px] ${!isAuthenticated ? 'opacity-50 grayscale' : ''}`}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                {/* Tabs Navigation */}
                <div className="px-4 sm:px-8 pt-4 sm:pt-6 border-b border-white/5 bg-white/[0.02] overflow-x-auto">
                  <TabsList className="bg-transparent h-12 sm:h-14 p-0 space-x-4 sm:space-x-8 justify-start min-w-max">
                    <TabsTrigger
                      value="chat"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-indigo-500 rounded-none h-full px-0 transition-all font-semibold whitespace-nowrap text-sm sm:text-base"
                    >
                      <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> <span className="hidden sm:inline">Chat Console</span><span className="sm:hidden">Chat</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="code"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-indigo-500 rounded-none h-full px-0 transition-all font-semibold whitespace-nowrap text-sm sm:text-base"
                    >
                      <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> <span className="hidden sm:inline">Analysis Engine</span><span className="sm:hidden">Analysis</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="learning"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-indigo-500 rounded-none h-full px-0 transition-all font-semibold whitespace-nowrap text-sm sm:text-base"
                    >
                      <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Curriculum
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Chat Content */}
                <TabsContent value="chat" className="flex-1 flex flex-col justify-start m-0 overflow-hidden">
                  <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 scrollbar-thin scrollbar-thumb-white/10">
                    <AnimatePresence initial={false}>
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-4 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 ${msg.type === 'user' ? 'bg-indigo-600' : 'bg-slate-800'
                              }`}>
                              {msg.type === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-indigo-400" />}
                            </div>

                            <div className={`space-y-3 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                              <div className={`p-4 rounded-[24px] text-sm leading-relaxed shadow-lg border whitespace-pre-wrap ${msg.type === 'user'
                                ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
                                : 'bg-slate-800/80 border-white/5 rounded-tl-none backdrop-blur-md'
                                }`}>
                                {msg.content}
                              </div>

                              {msg.code && (
                                <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl w-full max-w-xl">
                                  <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">{msg.language || 'Code Snippet'}</span>
                                    <button onClick={() => navigator.clipboard.writeText(msg.code || "")} className="text-slate-500 hover:text-white transition-colors">
                                      <FileText className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <pre className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed selection:bg-indigo-500/30">
                                    <code className="text-blue-300">
                                      {msg.code}
                                    </code>
                                  </pre>
                                </div>
                              )}

                              {msg.suggestions && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                  {msg.suggestions.map((s, i) => (
                                    <button
                                      key={i}
                                      onClick={() => setInputMessage(s)}
                                      className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-slate-800 border border-white/5 hover:border-indigo-500/50 hover:bg-slate-700 transition-all text-slate-400 hover:text-white"
                                    >
                                      💡 {s}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
                        </div>
                        <div className="bg-slate-800/50 px-4 py-3 rounded-2xl flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Controls */}
                  <div className="p-4 sm:p-8 pt-0 mt-auto bg-slate-900/40">
                    <div className="hidden sm:flex flex-wrap gap-2 mb-4">
                      {quickQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setInputMessage(q)}
                          className="text-[11px] font-medium px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-slate-400 hover:text-white whitespace-nowrap"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-[16px] sm:rounded-[24px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center bg-slate-800/80 border border-white/10 rounded-[16px] sm:rounded-[24px] p-1.5 sm:p-2 focus-within:border-indigo-500/50 transition-all">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask anything..."
                          className="bg-transparent border-0 focus-visible:ring-0 text-white h-10 sm:h-12 px-3 sm:px-4 placeholder:text-slate-500 text-sm sm:text-base"
                          disabled={isTyping}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={isTyping || !inputMessage.trim()}
                          className="rounded-xl sm:rounded-2xl h-10 sm:h-12 px-4 sm:px-6 bg-indigo-600 hover:bg-indigo-500 font-bold shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Code Analysis Content */}
                <TabsContent value="code" className="flex-1 m-0 overflow-hidden flex flex-col justify-start h-full">
                  <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 scrollbar-thin flex flex-col">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 flex-1">
                      <div className="flex flex-col space-y-6 h-full">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                          <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" /> Source Input
                          </h3>
                          <Select value={analysisLanguage} onValueChange={setAnalysisLanguage}>
                            <SelectTrigger className="w-full sm:w-[140px] bg-slate-800/50 border-white/10 h-10 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                              <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="java">Java</SelectItem>
                              <SelectItem value="cpp">C++</SelectItem>
                              <SelectItem value="typescript">TypeScript</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex-1 flex flex-col relative group min-h-[300px] sm:min-h-[450px]">
                          <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                          <Textarea
                            placeholder="// Paste code here..."
                            className="flex-1 bg-slate-950/50 border-white/10 rounded-2xl font-mono text-xs sm:text-[13px] leading-relaxed focus-visible:ring-indigo-500/30 transition-all scrollbar-thin relative z-10"
                            value={analysisCode}
                            onChange={(e) => setAnalysisCode(e.target.value)}
                          />
                        </div>

                        <Button
                          className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-bold text-base sm:text-lg shadow-xl shadow-indigo-500/20"
                          onClick={() => handleAnalyzeCode()}
                          disabled={isAnalyzing || !analysisCode.trim()}
                        >
                          {isAnalyzing ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                              <span className="hidden sm:inline">Auditing Intelligence...</span>
                              <span className="sm:hidden">Analyzing...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                              <span className="hidden sm:inline">Start Deep Audit</span>
                              <span className="sm:hidden">Analyze Code</span>
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="rounded-[24px] sm:rounded-[32px] bg-white/[0.02] border border-white/5 p-4 sm:p-8 flex flex-col h-full min-h-[300px] sm:min-h-[450px]">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" /> Audit Report
                          </h3>
                        </div>

                        <div className="flex-1">
                          <AnimatePresence mode="wait">
                            {!analysisResult && !isAnalyzing ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4"
                              >
                                <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center mb-2">
                                  <Bot className="w-10 h-10 text-slate-500 opacity-20" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-400">Analysis Idle</h4>
                                <p className="text-sm text-slate-500 max-w-xs">Run a deep audit to uncover security flaws, performance bottlenecks, and best practice violations.</p>
                              </motion.div>
                            ) : isAnalyzing ? (
                              <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-6"
                              >
                                <div className="relative">
                                  <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 animate-spin border-t-indigo-500"></div>
                                  <Sparkles className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-lg font-bold">Scanning Codebase</h4>
                                  <p className="text-sm text-slate-500">Running quality heuristics...</p>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                              >
                                <div className="space-y-4">
                                  <div className="group p-5 rounded-[24px] bg-indigo-500/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all">
                                    <h5 className="flex items-center text-indigo-400 font-bold mb-3 text-sm">
                                      <Code className="w-4 h-4 mr-3" /> Code Integrity
                                    </h5>
                                    <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">{analysisResult.quality}</p>
                                  </div>

                                  <div className="group p-5 rounded-[24px] bg-amber-500/[0.03] border border-white/5 hover:border-amber-500/30 transition-all">
                                    <h5 className="flex items-center text-amber-400 font-bold mb-3 text-sm">
                                      <Zap className="w-4 h-4 mr-3" /> Improvement Vector
                                    </h5>
                                    <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">{analysisResult.improvements}</p>
                                  </div>

                                  <div className="group p-5 rounded-[24px] bg-emerald-500/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all">
                                    <h5 className="flex items-center text-emerald-400 font-bold mb-3 text-sm">
                                      <CheckCircle className="w-4 h-4 mr-3" /> Professional Standards
                                    </h5>
                                    <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">{analysisResult.bestPractices}</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Learning Path Content */}
                <TabsContent value="learning" className="flex-1 m-0 overflow-hidden flex flex-col justify-start">
                  <div className="flex-1 overflow-y-auto px-8 py-8 scrollbar-thin">
                    <div className="max-w-4xl mx-auto space-y-10">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-black">AI Learning Path</h2>
                          <p className="text-slate-400">A dynamic curriculum built uniquely for your skill level.</p>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 h-12 px-6 font-bold"
                          onClick={fetchRecommendations}
                          disabled={isLoadingRecs}
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingRecs ? 'animate-spin' : ''}`} /> Sync Path
                        </Button>
                      </div>

                      {isLoadingRecs ? (
                        <div className="space-y-6">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-[140px] rounded-[32px] bg-white/[0.02] border border-white/5 animate-pulse"></div>
                          ))}
                        </div>
                      ) : recommendations.length > 0 ? (
                        <div className="grid gap-6">
                          {recommendations.map((rec, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <Card className="group bg-slate-900/40 border-white/10 hover:border-indigo-500/50 shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 rounded-[32px] overflow-hidden backdrop-blur-md">
                                <CardContent className="p-8">
                                  <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                      <div className="flex items-center gap-3">
                                        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 font-bold">{rec.category}</Badge>
                                        <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">{rec.difficulty}</span>
                                      </div>
                                      <h4 className="text-xl font-black tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{rec.title}</h4>
                                      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl whitespace-pre-wrap">{rec.description}</p>
                                      <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {rec.estimatedTime}</span>
                                        <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                        <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Interactive exercises</span>
                                      </div>
                                    </div>
                                    <Button className="rounded-2xl h-14 px-8 bg-indigo-600 hover:bg-white hover:text-indigo-600 font-black tracking-tight shadow-xl shadow-indigo-600/10 group-hover:scale-105 transition-all shrink-0">
                                      CONTINUE MODULE <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-20 text-center space-y-6">
                          <div className="w-24 h-24 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-10 h-10 text-slate-600 opacity-30" />
                          </div>
                          <h4 className="text-2xl font-black">Ready To Map Your Growth?</h4>
                          <p className="text-slate-500 max-w-sm mx-auto">Click sync so I can analyze your recent activity and build a custom module roadmap for you.</p>
                          <Button size="lg" onClick={fetchRecommendations} className="rounded-2xl h-14 px-10 bg-indigo-600 hover:bg-indigo-500 font-bold">Initialize Roadmap</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 sm:space-y-8">
            {/* Stats Overview */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-8">
              <Card className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl">
                <CardHeader className="p-4 sm:p-6 border-b border-white/5">
                  <CardTitle className="text-xs uppercase tracking-[0.2em] font-black text-slate-500 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-emerald-400" /> Proficiency Radar
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Velocity</span>
                      <span className="text-sm font-black text-white">82%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '82%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                      ></motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:bg-white/10 transition-colors">
                      <div className="text-2xl font-black mb-1">14</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Mastered</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:bg-white/10 transition-colors">
                      <div className="text-2xl font-black mb-1">5</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Achievements</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:sticky lg:top-[28rem]">
              <Card className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl">
                <CardHeader className="p-4 sm:p-6 border-b border-white/5">
                  <CardTitle className="text-xs uppercase tracking-[0.2em] font-black text-slate-500 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-blue-400" /> Utility Tools
                  </CardTitle>
                </CardHeader>
                <div className="divide-y divide-white/5">
                  {[
                    { icon: Code, label: "Structural Explanation", color: "indigo" },
                    { icon: Bug, label: "Fault Simulation", color: "pink" },
                    { icon: Lightbulb, label: "Atomic Optimization", color: "amber" },
                  ].map((tool, i) => (
                    <button
                      key={i}
                      onClick={() => handleUtilityTool(tool.label)}
                      className="w-full flex items-center p-4 sm:p-5 hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-${tool.color}-500/10 flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform`}>
                        <tool.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${tool.color}-400`} />
                      </div>
                      <span className="text-xs sm:text-[13px] font-bold text-slate-300 group-hover:text-white transition-colors">{tool.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Active Challenge */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="group relative rounded-[32px] overflow-hidden bg-indigo-600 shadow-2xl shadow-indigo-600/20">
                <div className="absolute top-0 right-0 -m-10 w-40 h-40 bg-white/20 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight">Active Pulse</h4>
                  </div>
                  <p className="text-indigo-100 font-medium leading-relaxed">Implement a linked list from scratch using generics.</p>
                  <Button variant="secondary" className="w-full h-14 rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 font-black shadow-xl">
                    ACCEPT CHALLENGE <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
