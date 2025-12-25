import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/ApiService";
import SEO from "@/components/SEO";
import {
  Clock, Users, Sparkles, Play, CheckCircle, X,
  TrendingUp, BookOpen, MessageSquare, Video, Calendar as CalendarIcon,
  Star, AlertCircle, Lightbulb, Target, Zap, Code, Shield, Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Send, User, Bot } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}
question: string;
type: string;
difficulty: string;
tips ?: string;
}

interface Feedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  overall: string;
}

interface Package {
  id: string;
  title: string;
  sessions: number;
  description: string;
  price: number;
  features: string[];
}

const InterviewPractice = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI Interview Coach. Ask me anything about coding, algorithms, or interview prep!" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg: Message = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/interview-practice/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [qaLanguages, setQaLanguages] = useState<any[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Load packages on mount
  useEffect(() => {
    loadQaLanguages();
  }, [user]);





  const loadQaLanguages = async () => {
    try {
      setIsLoadingLanguages(true);
      const data = await apiService.getLanguages() as any;
      if (data.success) {
        setQaLanguages(data.languages);
      }
    } catch (error) {
      console.error('Error loading QA languages:', error);
    } finally {
      setIsLoadingLanguages(false);
    }
  };



  const generateQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${apiUrl}/interview-practice/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: questionCategory,
          difficulty: difficulty,
          count: 5,
          role: 'Software Engineer'
        }),
      });

      const data = await response.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setUserAnswer("");
        setFeedback(null);
        toast({
          title: "Questions generated!",
          description: `Generated ${data.questions.length} ${questionCategory} questions.`,
        });
      } else {
        throw new Error(data.message || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await fetch(`${apiUrl}/interview-practice/evaluate-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questions[currentQuestionIndex].question,
          answer: userAnswer,
          category: questionCategory
        }),
      });

      const data = await response.json();
      if (data.success && data.feedback) {
        setFeedback(data.feedback);
        toast({
          title: "Answer evaluated!",
          description: `Your score: ${data.feedback.score}/100`,
        });
      } else {
        throw new Error(data.message || 'Failed to evaluate answer');
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      toast({
        title: "Error",
        description: "Failed to evaluate answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setFeedback(null);
    }
  };



  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Interview Practice Studio - CodeAcademy Pro",
    "description": "AI-powered interview practice with real-time feedback, session booking, and mentor matching.",
    "provider": {
      "@type": "Organization",
      "name": "CodeAcademy Pro"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <SEO
        title="Interview Practice Studio - AI-Powered Interview Prep"
        description="Practice interviews with AI-powered questions, get real-time feedback, and book sessions with industry mentors. Prepare for your dream tech job."
        keywords="interview practice, interview prep, mock interview, AI interview, technical interview, behavioral interview, interview coaching"
        structuredData={structuredData}
      />

      {/* Header */}
      <div className="container mx-auto px-6 pt-6">
        <BackButton label="Back to Home" className="text-white" to="/" />
      </div>

      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-r from-violet-900/40 via-blue-900/40 to-violet-900/40 border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-6 py-20 text-center">
          <Badge className="mb-4 bg-violet-500/20 text-violet-300 border-violet-500/30">
            <Sparkles className="w-3 h-3 mr-2" />
            AI-Powered Interview Practice
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Interview Practice Studio
          </h1>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Practice with AI-generated questions, get instant feedback, and book sessions with real interviewers from top tech companies.
          </p>

          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Button
                onClick={() => navigate('/admin/interview-practice')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-500/20"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Mode (Manage Languages)
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative overflow-x-auto -mx-2 sm:mx-0 mb-8">
            <style>{`
              .interview-tabs-scroll {
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              .interview-tabs-scroll::-webkit-scrollbar {
                display: none;
              }
              .interview-tabs-scroll {
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
              }
            `}</style>
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-white/10 p-1">
              <TabsTrigger value="chat" className="data-[state=active]:bg-violet-500 text-white/70 data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="languages" className="flex-shrink-0 min-w-[100px] sm:min-w-0 data-[state=active]:bg-violet-500 text-white/70 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3">
                <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="whitespace-nowrap">Language Q&A</span>
              </TabsTrigger>

            </TabsList>
          </div>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="bg-slate-900/70 border-white/10 h-[600px] flex flex-col">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-violet-400" />
                  AI Interview Coach
                </CardTitle>
                <CardDescription className="text-white/60">
                  Ask questions, get explanations, or practice interview scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800/80 text-white/90 border border-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                        {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                        <span>{msg.role === 'user' ? 'You' : 'AI Coach'}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/80 rounded-lg p-3 border border-white/10 flex items-center gap-2">
                      <Bot className="w-3 h-3 text-violet-400" />
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              <div className="p-4 border-t border-white/10 bg-slate-950/30">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your question..."
                    className="bg-slate-900 border-white/10 text-white"
                  />
                  <Button type="submit" disabled={isLoading || !inputMessage.trim()} className="bg-violet-600 hover:bg-violet-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </TabsContent>

          {/* Language Q&A Tab */}
          <TabsContent value="languages" className="space-y-6">
            <Card className="bg-slate-900/70 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-violet-400" />
                  Programming Language Interview Q&A
                </CardTitle>
                <CardDescription className="text-white/60">
                  Click on any language to view interview questions and answers specific to that programming language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {isLoadingLanguages ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4">
                      <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-white/40">Loading languages...</p>
                    </div>
                  ) : qaLanguages.length > 0 ? (
                    qaLanguages.map((lang) => (
                      <motion.div
                        key={lang.id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer"
                        onClick={() => navigate(`/interview-practice/languages/${lang.slug}`)}
                      >
                        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-white/20 hover:border-violet-500/50 transition-all duration-300 overflow-hidden group h-full">
                          <div className={`absolute inset-0 bg-gradient-to-br ${lang.color_from} ${lang.color_to} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                          <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center relative z-10 min-h-[120px] sm:min-h-[140px]">
                            <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{lang.icon_emoji}</div>
                            <h3 className="text-white font-bold text-sm sm:text-base mb-1">{lang.name}</h3>
                            <p className="text-white/60 text-xs">Interview Q&A</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-white/40">No languages available yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Mentor Bench */}
        < Card className="bg-slate-900/70 border-white/10 mt-8" >
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-400" />
              Mentor Bench
            </CardTitle>
            <CardDescription className="text-white/60">
              Real interviewers from top tech companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {["Google", "Meta", "Stripe", "Atlassian", "Twilio", "Amazon", "Microsoft", "Apple"].map((company) => (
                <Badge key={company} variant="outline" className="border-white/20 text-white/60 px-4 py-2">
                  {company}
                </Badge>
              ))}
              <div className="ml-auto flex items-center gap-2 text-white/60 text-sm">
                <Clock className="h-4 w-4 text-violet-400" />
                Slots updated hourly
              </div>
            </div>
          </CardContent>
        </Card >
      </div >
    </div >
  );
};

export default InterviewPractice;
