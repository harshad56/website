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
                // Fetch language details
                const langRes = await apiService.getLanguageBySlug(slug!) as any;

                if (langRes.success && langRes.language) {
                    setLanguage(langRes.language);

                    // Fetch questions
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/70 animate-pulse">Loading questions...</p>
                </div>
            </div>
        );
    }

    if (!language) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
                <h1 className="text-2xl text-white mb-4">Language not found</h1>
                <Button asChild>
                    <Link to="/interview-practice">Return to Studio</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <BackButton label="Back to Studio" className="bg-transparent border-none hover:bg-white/10 text-white/60 hover:text-white" />
                        <div className="h-6 w-px bg-white/10 hidden sm:block" />
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{language.icon_emoji}</span>
                            <h1 className="text-xl sm:text-2xl font-bold text-white">{language.name} Interview Q&A</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Intro/Hero section */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${language.color_from} ${language.color_to} opacity-10 blur-3xl -mr-20 -mt-20 rounded-full`} />
                        <div className="relative z-10">
                            <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 mb-4 px-3 py-1 text-xs">
                                <Sparkles className="w-3 h-3 mr-1" />
                                {questions.length} Selected Questions
                            </Badge>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Master Your {language.name} Interview</h2>
                            <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
                                {language.description || "Prepare for your next technical interview with our curated list of high-impact questions and comprehensive answers."}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-24 z-40 bg-slate-950/50 backdrop-blur-sm py-4 -my-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-violet-400 transition-colors" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions or keywords..."
                            className="pl-10 bg-white/5 border-white/10 text-white focus:border-violet-500/50 focus:ring-violet-500/20 h-12"
                        />
                    </div>
                    <Tabs value={difficultyFilter} onValueChange={setDifficultyFilter} className="w-full md:w-auto">
                        <TabsList className="bg-white/5 border border-white/10 h-12 p-1">
                            <TabsTrigger value="all" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white px-4 h-full">All</TabsTrigger>
                            <TabsTrigger value="easy" className="data-[state=active]:bg-green-500/20 text-green-500/60 data-[state=active]:text-green-400 px-4 h-full">Easy</TabsTrigger>
                            <TabsTrigger value="medium" className="data-[state=active]:bg-yellow-500/20 text-yellow-500/60 data-[state=active]:text-yellow-400 px-4 h-full">Medium</TabsTrigger>
                            <TabsTrigger value="hard" className="data-[state=active]:bg-red-500/20 text-red-500/60 data-[state=active]:text-red-400 px-4 h-full">Hard</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Question List */}
                <div className="space-y-4">
                    {filteredQuestions.length > 0 ? (
                        filteredQuestions.map((q, index) => (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className={`bg-white/5 border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden ${expandedQuestion === q.id ? 'ring-1 ring-violet-500/30 bg-white/[0.07]' : ''}`}
                                    onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                                >
                                    <CardHeader className="p-5 flex flex-row items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`px-2 py-0 text-[10px] uppercase font-bold tracking-wider ${q.difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                    q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                        'bg-red-500/20 text-red-400 border-red-500/30'
                                                    }`}>
                                                    {q.difficulty}
                                                </Badge>
                                                {q.category && (
                                                    <Badge variant="outline" className="px-2 py-0 text-[10px] text-white/40 border-white/10">
                                                        {q.category}
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardTitle className="text-lg text-white group-hover:text-violet-400 transition-colors">
                                                {q.question}
                                            </CardTitle>
                                        </div>
                                        <div className="mt-1 flex-shrink-0">
                                            {expandedQuestion === q.id ? <ChevronUp className="w-5 h-5 text-violet-400" /> : <ChevronDown className="w-5 h-5 text-white/30" />}
                                        </div>
                                    </CardHeader>
                                    <AnimatePresence>
                                        {expandedQuestion === q.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            >
                                                <CardContent className="p-5 pt-0 border-t border-white/5 bg-slate-900/40">
                                                    <div className="mt-4 space-y-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold uppercase tracking-wider">
                                                                <MessageSquare className="w-3.5 h-3.5" />
                                                                Expert Answer
                                                            </div>
                                                            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                                                                {q.answer}
                                                            </p>
                                                        </div>

                                                        {q.code_example && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold uppercase tracking-wider">
                                                                    <Code className="w-3.5 h-3.5" />
                                                                    Implementation
                                                                </div>
                                                                <div className="relative group">
                                                                    <pre className="p-4 bg-slate-950 rounded-lg border border-white/10 overflow-x-auto font-mono text-sm text-indigo-300">
                                                                        <code>{q.code_example}</code>
                                                                    </pre>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-white/10 text-white/40 hover:text-white h-7"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigator.clipboard.writeText(q.code_example);
                                                                            toast({ title: "Copied!", description: "Code snippet copied to clipboard" });
                                                                        }}
                                                                    >
                                                                        Copy
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                            <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
                            <h3 className="text-xl text-white font-semibold">No questions found</h3>
                            <p className="text-white/40">Try adjusting your search or difficulty filter</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LanguageInterviewPage;
