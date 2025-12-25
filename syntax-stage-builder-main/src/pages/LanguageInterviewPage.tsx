import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Code, Search, Filter, BookOpen,
    ChevronDown, ChevronUp, Sparkles, MessageSquare
} from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/ApiService";

interface Language {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon_emoji: string;
    color_from: string;
    color_to: string;
}

interface Question {
    id: string;
    question: string;
    answer: string;
    code_example: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
}

const LanguageInterviewPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const { toast } = useToast();
    const [language, setLanguage] = useState<Language | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const langRes = await apiService.getLanguageBySlug(slug!) as any;

                if (langRes.success && langRes.language) {
                    setLanguage(langRes.language);
                    const questionsRes = await apiService.getLanguageQuestions(langRes.language.id) as any;

                    if (questionsRes.success) {
                        setQuestions(questionsRes.questions);
                    }
                } else {
                    toast({
                        title: "Error",
                        description: "Language not found",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast({
                    title: "Error",
                    description: "Failed to load interview questions",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug, toast]);

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-violet-500/20 rounded-full" />
                        <div className="absolute top-0 w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-violet-400 font-medium tracking-widest text-sm uppercase animate-pulse">Initializing Prep Kit...</p>
                </div>
            </div>
        );
    }

    if (!language) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Language Not Found</h1>
                <p className="text-slate-400 mb-8 max-w-md">We couldn't find the interview prep material you're looking for. It might have been moved or deleted.</p>
                <Button asChild className="bg-violet-600 hover:bg-violet-700 rounded-xl px-8 h-12">
                    <Link to="/interview-practice">Return to Studio</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-violet-500/30 overflow-hidden relative">
            {/* Mesh Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br ${language.color_from} opacity-10 blur-[130px] rounded-full animate-pulse`} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br ${language.color_to} opacity-10 blur-[130px] rounded-full animate-pulse`} style={{ animationDelay: '3s' }} />
            </div>

            <div className="relative z-10">
                {/* Sticky Header */}
                <header className="sticky top-0 z-50 bg-[#020617]/40 backdrop-blur-2xl border-b border-white/5">
                    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <BackButton label="Back to Studio" className="text-slate-400 hover:text-white transition-colors" />
                            <div className="h-4 w-px bg-white/10 hidden sm:block" />
                            <div className="flex items-center gap-4">
                                <div className="text-4xl transform hover:scale-110 transition-transform cursor-default">
                                    {language.icon_emoji}
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-white leading-tight">{language.name} Interview Prep</h1>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Expert-Curated Q&A</p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-3">
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
                                {questions.length} Questions Available
                            </Badge>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-6 py-12 max-w-6xl">
                    {/* Hero Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-16 relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden overflow-hidden shadow-2xl">
                            <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${language.color_from} ${language.color_to} opacity-10 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:opacity-20 transition-opacity duration-700`} />

                            <div className="max-w-3xl">
                                <Badge className="mb-6 bg-violet-500/10 text-violet-400 border-violet-500/20 px-4 py-1.5 backdrop-blur-sm">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Ultimate Guide
                                </Badge>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                                    Master <span className="text-violet-500">{language.name}</span> Technical Interviews
                                </h2>
                                <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
                                    {language.description || "Everything you need to crush your technical round. We've filtered the noise to give you the most impactful architectural and coding challenges."}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Filter & Search Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 sticky top-[88px] z-40 bg-transparent py-4 -my-4 h-auto">
                        <div className="lg:col-span-12">
                            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-3 flex flex-col md:flex-row gap-4 items-center shadow-xl">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by topic, keyword, or concept..."
                                        className="pl-12 bg-transparent border-none text-white h-12 focus-visible:ring-0 placeholder:text-slate-500 text-base"
                                    />
                                </div>
                                <div className="h-8 w-px bg-white/10 hidden md:block" />
                                <Tabs value={difficultyFilter} onValueChange={setDifficultyFilter} className="w-full md:w-auto">
                                    <TabsList className="bg-slate-900/50 border border-white/5 h-12 gap-1 p-1 rounded-2xl">
                                        <TabsTrigger value="all" className="rounded-xl px-6 h-full transition-all data-[state=active]:bg-violet-600 data-[state=active]:text-white">All</TabsTrigger>
                                        <TabsTrigger value="easy" className="rounded-xl px-6 h-full transition-all data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-emerald-400">Easy</TabsTrigger>
                                        <TabsTrigger value="medium" className="rounded-xl px-6 h-full transition-all data-[state=active]:bg-amber-500 data-[state=active]:text-white text-amber-400">Medium</TabsTrigger>
                                        <TabsTrigger value="hard" className="rounded-xl px-6 h-full transition-all data-[state=active]:bg-rose-500 data-[state=active]:text-white text-rose-400">Hard</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    </div>

                    {/* Question Pipeline */}
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredQuestions.length > 0 ? (
                                filteredQuestions.map((q, index) => (
                                    <motion.div
                                        key={q.id}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, delay: index * 0.03 }}
                                    >
                                        <Card
                                            className={`group relative bg-white/5 backdrop-blur-xl border-white/10 hover:border-violet-500/50 transition-all duration-500 cursor-pointer overflow-hidden rounded-[2rem] shadow-lg ${expandedQuestion === q.id ? 'ring-2 ring-violet-500/30 bg-white/[0.08] shadow-violet-500/10' : ''
                                                }`}
                                            onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                                        >
                                            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <Badge className={`px-4 py-1 rounded-full text-[10px] uppercase font-black tracking-[0.15em] border-none ${q.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                q.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                                                    'bg-rose-500/20 text-rose-400'
                                                            }`}>
                                                            {q.difficulty}
                                                        </Badge>
                                                        {q.category && (
                                                            <Badge variant="outline" className="px-4 py-1 rounded-full text-[10px] text-slate-400 border-white/10 group-hover:border-violet-500/30 bg-slate-900/50">
                                                                {q.category.toUpperCase()}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-violet-400 transition-colors leading-snug">
                                                        {q.question}
                                                    </h3>
                                                </div>
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
                                                    {expandedQuestion === q.id ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6 text-slate-500 group-hover:text-white" />}
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {expandedQuestion === q.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                                    >
                                                        <CardContent className="px-8 pb-10 space-y-8 border-t border-white/5 pt-10">
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-3 text-violet-400 font-black text-xs uppercase tracking-widest">
                                                                    <div className="w-8 h-px bg-violet-400/30" />
                                                                    High-Resolution Response
                                                                </div>
                                                                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                                                                    {q.answer}
                                                                </p>
                                                            </div>

                                                            {q.code_example && (
                                                                <div className="space-y-4">
                                                                    <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest">
                                                                        <div className="w-8 h-px bg-indigo-400/30" />
                                                                        Technical Implementation
                                                                    </div>
                                                                    <div className="relative group/code rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                                                        <div className="absolute top-0 inset-x-0 h-10 bg-white/5 flex items-center px-4 gap-1.5 grayscale opacity-50">
                                                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                                                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                                                                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                                                        </div>
                                                                        <pre className="p-10 pt-14 bg-slate-950/80 font-mono text-sm text-indigo-200 overflow-x-auto leading-relaxed">
                                                                            <code>{q.code_example}</code>
                                                                        </pre>
                                                                        <Button
                                                                            variant="secondary"
                                                                            size="sm"
                                                                            className="absolute top-4 right-4 bg-white/10 hover:bg-violet-600 text-white rounded-xl h-9 px-5 border-none shadow-xl transition-all"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                navigator.clipboard.writeText(q.code_example);
                                                                                toast({
                                                                                    title: "Snippet Cached!",
                                                                                    description: "Implementation copied to clipboard",
                                                                                    className: "bg-[#020617] border-violet-500/50 text-white"
                                                                                });
                                                                            }}
                                                                        >
                                                                            Copy Implementation
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-32 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl"
                                >
                                    <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center mx-auto mb-8">
                                        <BookOpen className="w-10 h-10 text-slate-600" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2">No Challenges Found</h3>
                                    <p className="text-slate-500 text-lg max-w-sm mx-auto font-medium">Reset your search parameters to find the questions you're looking for.</p>
                                    <Button
                                        variant="outline"
                                        className="mt-10 border-white/10 hover:bg-white/10 text-white rounded-2xl h-12 px-8"
                                        onClick={() => { setSearchQuery(""); setDifficultyFilter("all"); }}
                                    >
                                        Reset Pipeline
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};


export default LanguageInterviewPage;
