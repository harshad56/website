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
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import SEO from "@/components/SEO";
import {
  Clock, Users, Sparkles, Play, CheckCircle, X,
  TrendingUp, BookOpen, MessageSquare, Video, Calendar as CalendarIcon,
  Star, AlertCircle, Lightbulb, Target, Zap, Code, Shield, Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { Send, User, Bot } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}
interface Question {
  question: string;
  type: string;
  difficulty: string;
  tips?: string;
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
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI Interview Coach. I can help you practice technical questions, refine your behavioral answers, or explain complex programming concepts. What's on your mind today?" }
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

  const [qaLanguages, setQaLanguages] = useState<any[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);

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

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": "AI Interview Practice Studio - CodeAcademy Pro",
        "description": "Master technical and behavioral interviews with our real-time AI coach. Practice role-specific scenarios, FAANG-level coding questions, and get instant feedback.",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "offers": {
          "@type": "Offer",
          "category": "Educational Service",
          "availability": "https://schema.org/InStock"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Interview Preparation Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AI Mock Interviews"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Technical Q&A Practice"
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does AI interview practice work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our AI coach simulates real-world interview scenarios, asks role-specific questions, and provides instant feedback on your performance, tone, and technical accuracy."
            }
          },
          {
            "@type": "Question",
            "name": "Can it help me prepare for FAANG interviews?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! The AI is trained on a vast database of technical questions commonly asked at FAANG and other top-tier tech companies across various roles like Software Engineering, Data Science, and Frontend Development."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-violet-500/30 overflow-hidden relative">
      <SEO
        title="AI Interview Practice Studio | FAANG Coding Interview Prep"
        description="Master your tech interviews with real-time AI coaching. Practice Software Engineering, Data Science, and Frontend questions with instant feedback. Prepare for FAANG today."
        keywords="interview practice, coding interview prep, mock interview, AI interview, technical interview questions, FAANG prep, software engineer interview, behavioral interview help"
        structuredData={structuredData}
      />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-indigo-600/10 blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-6 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <BackButton label="Back to Home" className="text-white/80 hover:text-white transition-colors" to="/" />

          </div>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20 py-1.5 px-4 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Next-Gen Mock Interviews
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
              Interview Practice <span className="text-violet-500">Studio</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Master your tech interviews with our AI coach. Practice role-specific scenarios, get instant feedback, and dive into language-specific Q&A.
            </p>
          </motion.div>
        </section>

        <main className="container mx-auto px-6 pb-24">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 h-auto gap-2 rounded-2xl shadow-2xl">
                <TabsTrigger
                  value="chat"
                  className="px-8 py-3 rounded-xl gap-2 data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all duration-300"
                >
                  <MessageSquare className="w-4 h-4" />
                  AI Coach
                </TabsTrigger>
                <TabsTrigger
                  value="languages"
                  className="px-8 py-3 rounded-xl gap-2 data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all duration-300"
                >
                  <Code className="w-4 h-4" />
                  Language Q&A
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="bg-white/5 backdrop-blur-2xl border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-h-[650px] flex flex-col">
                  {/* Chat Header */}
                  <div className="px-6 py-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <Bot className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-white text-lg">AI Interview Coach</h2>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-xs text-slate-400">Online and ready</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-slate-900/50 border-white/5 text-slate-400">GPT-4 Turbo</Badge>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                    <AnimatePresence mode="popLayout">
                      {messages.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-violet-500'
                            }`}>
                            {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                          </div>
                          <div className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800/80 border border-white/5 rounded-tl-none backdrop-blur-md w-full'}`}>
                            {msg.role === 'user' ? (
                              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                            ) : (
                              <MarkdownRenderer content={msg.content} />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-5 py-4 flex gap-1.5 items-center">
                            <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="ml-2 text-xs text-slate-400 animate-pulse">Thinking and verifying best practices...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </CardContent>

                  {/* Chat Input */}
                  <div className="p-6 bg-white/5 border-t border-white/5 backdrop-blur-xl">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="relative flex items-center gap-3"
                    >
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your question or simulate an interview response..."
                        className="bg-slate-900/50 border-white/10 text-white h-14 pl-5 pr-14 rounded-2xl focus-visible:ring-violet-500/50 transition-all placeholder:text-slate-500"
                      />
                      <Button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        className="absolute right-2 w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all p-0"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </form>
                    <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-medium">
                      AI can provide detailed feedback and interview questions.
                    </p>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="languages" className="focus-visible:outline-none">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {isLoadingLanguages ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="h-40 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                    ))
                  ) : qaLanguages.map((lang) => (
                    <motion.div
                      key={lang.id}
                      whileHover={{ scale: 1.05, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/interview-practice/languages/${lang.slug}`)}
                      className="group cursor-pointer"
                    >
                      <div className="relative h-44 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col items-center justify-center transition-all group-hover:bg-white/10 group-hover:border-violet-500/50 shadow-lg">
                        <div className={`absolute inset-0 bg-gradient-to-br ${lang.color_from} ${lang.color_to} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`} />
                        <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          {lang.icon_emoji}
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">{lang.name}</h3>
                        <Badge variant="outline" className="bg-slate-900/40 text-[10px] border-white/5 group-hover:border-violet-500/30">PREP KIT</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};


export default InterviewPractice;
