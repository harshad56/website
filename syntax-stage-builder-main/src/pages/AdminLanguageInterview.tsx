import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Code, FileQuestion, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface Language {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon_emoji: string;
    color_from: string;
    color_to: string;
    is_active: boolean;
    display_order: number;
}

interface Question {
    id: string;
    language_id: string;
    question: string;
    answer: string;
    code_example?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    is_active: boolean;
}

const AdminLanguageInterview = () => {
    const { toast } = useToast();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [isAddingLanguage, setIsAddingLanguage] = useState(false);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Form states for language
    const [langForm, setLangForm] = useState({
        name: '',
        slug: '',
        description: '',
        icon_emoji: '',
        color_from: 'from-blue-500',
        color_to: 'to-blue-700',
        display_order: 0
    });

    // Form states for question
    const [questionForm, setQuestionForm] = useState({
        question: '',
        answer: '',
        code_example: '',
        difficulty: 'medium' as 'easy' | 'medium' | 'hard',
        category: ''
    });

    useEffect(() => {
        loadLanguages();
    }, []);

    useEffect(() => {
        if (selectedLanguage) {
            loadQuestions(selectedLanguage);
        }
    }, [selectedLanguage]);

    const loadLanguages = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${apiUrl}/languages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setLanguages(data.languages);
            }
        } catch (error) {
            console.error('Error loading languages:', error);
            toast({
                title: "Error",
                description: "Failed to load languages",
                variant: "destructive"
            });
        }
    };

    const loadQuestions = async (languageId: string) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${apiUrl}/languages/${languageId}/questions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setQuestions(data.questions);
            }
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    };

    const handleAddLanguage = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${apiUrl}/languages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(langForm)
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Language added successfully"
                });
                loadLanguages();
                setIsAddingLanguage(false);
                resetLangForm();
            } else {
                throw new Error(data.message);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to add language",
                variant: "destructive"
            });
        }
    };

    const handleUpdateLanguage = async () => {
        if (!editingLanguage) return;
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${apiUrl}/languages/${editingLanguage.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(langForm)
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Language updated successfully"
                });
                loadLanguages();
                setEditingLanguage(null);
                resetLangForm();
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to update language",
                variant: "destructive"
            });
        }
    };

    const handleDeleteLanguage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this language?')) return;
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${apiUrl}/languages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Language deleted successfully"
                });
                loadLanguages();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete language",
                variant: "destructive"
            });
        }
    };

    const handleAddQuestion = async () => {
        if (!selectedLanguage) return;
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${apiUrl}/languages/${selectedLanguage}/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(questionForm)
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Question added successfully"
                });
                loadQuestions(selectedLanguage);
                setIsAddingQuestion(false);
                resetQuestionForm();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add question",
                variant: "destructive"
            });
        }
    };

    const handleUpdateQuestion = async () => {
        if (!editingQuestion || !selectedLanguage) return;
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${apiUrl}/languages/${selectedLanguage}/questions/${editingQuestion.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(questionForm)
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Question updated successfully"
                });
                loadQuestions(selectedLanguage);
                setEditingQuestion(null);
                resetQuestionForm();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update question",
                variant: "destructive"
            });
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        if (!selectedLanguage) return;
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${apiUrl}/languages/${selectedLanguage}/questions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Question deleted successfully"
                });
                loadQuestions(selectedLanguage);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete question",
                variant: "destructive"
            });
        }
    };

    const resetLangForm = () => {
        setLangForm({
            name: '',
            slug: '',
            description: '',
            icon_emoji: '',
            color_from: 'from-blue-500',
            color_to: 'to-blue-700',
            display_order: 0
        });
    };

    const resetQuestionForm = () => {
        setQuestionForm({
            question: '',
            answer: '',
            code_example: '',
            difficulty: 'medium',
            category: ''
        });
    };

    const startEditLanguage = (lang: Language) => {
        setEditingLanguage(lang);
        setLangForm({
            name: lang.name,
            slug: lang.slug,
            description: lang.description,
            icon_emoji: lang.icon_emoji,
            color_from: lang.color_from,
            color_to: lang.color_to,
            display_order: lang.display_order
        });
    };

    const startEditQuestion = (q: Question) => {
        setEditingQuestion(q);
        setQuestionForm({
            question: q.question,
            answer: q.answer,
            code_example: q.code_example || '',
            difficulty: q.difficulty,
            category: q.category
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900 pb-12">
            <header className="bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40 mb-8">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/interview-practice"
                            className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Studio
                        </Link>
                        <div className="h-6 w-px bg-white/20" />
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Code className="w-5 h-5 text-indigo-400" />
                            Languages Admin
                        </h1>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6">
                <div className="space-y-6">
                    <Card className="bg-slate-900/50 border-white/10 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code className="w-5 h-5" />
                                Programming Languages Management
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Manage programming languages and their interview questions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Languages ({languages.length})</h3>
                                <Dialog open={isAddingLanguage} onOpenChange={setIsAddingLanguage}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Language
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-white/10">
                                        <DialogHeader>
                                            <DialogTitle>Add New Language</DialogTitle>
                                            <DialogDescription className="text-gray-400">
                                                Add a new programming language to the interview Q&A section
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Language Name *</Label>
                                                    <Input
                                                        value={langForm.name}
                                                        onChange={(e) => setLangForm({ ...langForm, name: e.target.value })}
                                                        placeholder="e.g., Python"
                                                        className="bg-slate-800 border-white/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Slug *</Label>
                                                    <Input
                                                        value={langForm.slug}
                                                        onChange={(e) => setLangForm({ ...langForm, slug: e.target.value })}
                                                        placeholder="e.g., python"
                                                        className="bg-slate-800 border-white/10"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={langForm.description}
                                                    onChange={(e) => setLangForm({ ...langForm, description: e.target.value })}
                                                    placeholder="Brief description of the language"
                                                    rows={3}
                                                    className="bg-slate-800 border-white/10"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Icon Emoji</Label>
                                                    <Input
                                                        value={langForm.icon_emoji}
                                                        onChange={(e) => setLangForm({ ...langForm, icon_emoji: e.target.value })}
                                                        placeholder="🐍"
                                                        className="bg-slate-800 border-white/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Color From</Label>
                                                    <Input
                                                        value={langForm.color_from}
                                                        onChange={(e) => setLangForm({ ...langForm, color_from: e.target.value })}
                                                        placeholder="from-blue-500"
                                                        className="bg-slate-800 border-white/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Color To</Label>
                                                    <Input
                                                        value={langForm.color_to}
                                                        onChange={(e) => setLangForm({ ...langForm, color_to: e.target.value })}
                                                        placeholder="to-yellow-500"
                                                        className="bg-slate-800 border-white/10"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Display Order</Label>
                                                <Input
                                                    type="number"
                                                    value={langForm.display_order}
                                                    onChange={(e) => setLangForm({ ...langForm, display_order: parseInt(e.target.value) })}
                                                    className="bg-slate-800 border-white/10"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" onClick={() => setIsAddingLanguage(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleAddLanguage} className="bg-indigo-600 hover:bg-indigo-700">
                                                    Add Language
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="grid gap-4">
                                {languages.map((lang) => (
                                    <Card key={lang.id} className="p-4 bg-slate-800/50 border-white/10 hover:border-indigo-500/50 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{lang.icon_emoji}</span>
                                                <div>
                                                    <h4 className="font-semibold text-white">{lang.name}</h4>
                                                    <p className="text-sm text-gray-400">{lang.slug}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedLanguage(lang.id)}
                                                    className="border-white/10 hover:bg-white/5"
                                                >
                                                    <FileQuestion className="w-4 h-4 mr-2" />
                                                    Questions
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => startEditLanguage(lang)}
                                                    className="border-white/10 hover:bg-white/5"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteLanguage(lang.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Questions Section */}
                    {selectedLanguage && (
                        <Card className="bg-slate-900/50 border-white/10 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileQuestion className="w-5 h-5 text-indigo-400" />
                                    Interview Questions - {languages.find(l => l.id === selectedLanguage)?.name}
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Manage interview questions for this language
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Questions ({questions.length})</h3>
                                    <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Question
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-white/10">
                                            <DialogHeader>
                                                <DialogTitle>Add Interview Question</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Question *</Label>
                                                    <Textarea
                                                        value={questionForm.question}
                                                        onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                                                        placeholder="Enter the interview question"
                                                        rows={3}
                                                        className="bg-slate-800 border-white/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Answer *</Label>
                                                    <Textarea
                                                        value={questionForm.answer}
                                                        onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })}
                                                        placeholder="Enter the detailed answer"
                                                        rows={6}
                                                        className="bg-slate-800 border-white/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Code Example (Optional)</Label>
                                                    <Textarea
                                                        value={questionForm.code_example}
                                                        onChange={(e) => setQuestionForm({ ...questionForm, code_example: e.target.value })}
                                                        placeholder="Enter code example if applicable"
                                                        rows={4}
                                                        className="font-mono text-sm bg-slate-800 border-white/10"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Difficulty</Label>
                                                        <Select
                                                            value={questionForm.difficulty}
                                                            onValueChange={(value: 'easy' | 'medium' | 'hard') => setQuestionForm({ ...questionForm, difficulty: value })}
                                                        >
                                                            <SelectTrigger className="bg-slate-800 border-white/10">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                                <SelectItem value="easy">Easy</SelectItem>
                                                                <SelectItem value="medium">Medium</SelectItem>
                                                                <SelectItem value="hard">Hard</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Category</Label>
                                                        <Input
                                                            value={questionForm.category}
                                                            onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                                                            placeholder="e.g., Data Structures"
                                                            className="bg-slate-800 border-white/10"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" onClick={() => setIsAddingQuestion(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleAddQuestion} className="bg-indigo-600 hover:bg-indigo-700">
                                                        Add Question
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div className="space-y-4">
                                    {questions.map((q) => (
                                        <Card key={q.id} className="p-4 bg-slate-800/40 border-white/10">
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${q.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                                                q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                    'bg-red-500/20 text-red-400'
                                                                }`}>
                                                                {q.difficulty}
                                                            </span>
                                                            <span className="text-xs text-gray-400">{q.category}</span>
                                                        </div>
                                                        <h4 className="font-semibold mb-2 text-white">{q.question}</h4>
                                                        <p className="text-sm text-gray-400 line-clamp-2">{q.answer}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => startEditQuestion(q)}
                                                            className="border-white/10 hover:bg-white/5"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteQuestion(q.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Edit Language Dialog */}
                    <Dialog open={!!editingLanguage} onOpenChange={(open) => !open && setEditingLanguage(null)}>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-white/10">
                            <DialogHeader>
                                <DialogTitle>Edit Language</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Language Name *</Label>
                                        <Input
                                            value={langForm.name}
                                            onChange={(e) => setLangForm({ ...langForm, name: e.target.value })}
                                            className="bg-slate-800 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug *</Label>
                                        <Input
                                            value={langForm.slug}
                                            onChange={(e) => setLangForm({ ...langForm, slug: e.target.value })}
                                            className="bg-slate-800 border-white/10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={langForm.description}
                                        onChange={(e) => setLangForm({ ...langForm, description: e.target.value })}
                                        rows={3}
                                        className="bg-slate-800 border-white/10"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Icon Emoji</Label>
                                        <Input
                                            value={langForm.icon_emoji}
                                            onChange={(e) => setLangForm({ ...langForm, icon_emoji: e.target.value })}
                                            className="bg-slate-800 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Color From</Label>
                                        <Input
                                            value={langForm.color_from}
                                            onChange={(e) => setLangForm({ ...langForm, color_from: e.target.value })}
                                            className="bg-slate-800 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Color To</Label>
                                        <Input
                                            value={langForm.color_to}
                                            onChange={(e) => setLangForm({ ...langForm, color_to: e.target.value })}
                                            className="bg-slate-800 border-white/10"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setEditingLanguage(null)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleUpdateLanguage} className="bg-indigo-600 hover:bg-indigo-700">
                                        Update Language
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Question Dialog */}
                    <Dialog open={!!editingQuestion} onOpenChange={(open) => !open && setEditingQuestion(null)}>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-white/10">
                            <DialogHeader>
                                <DialogTitle>Edit Question</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Question *</Label>
                                    <Textarea
                                        value={questionForm.question}
                                        onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                                        rows={3}
                                        className="bg-slate-800 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Answer *</Label>
                                    <Textarea
                                        value={questionForm.answer}
                                        onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })}
                                        rows={6}
                                        className="bg-slate-800 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Code Example (Optional)</Label>
                                    <Textarea
                                        value={questionForm.code_example}
                                        onChange={(e) => setQuestionForm({ ...questionForm, code_example: e.target.value })}
                                        rows={4}
                                        className="font-mono text-sm bg-slate-800 border-white/10"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Difficulty</Label>
                                        <Select
                                            value={questionForm.difficulty}
                                            onValueChange={(value: 'easy' | 'medium' | 'hard') => setQuestionForm({ ...questionForm, difficulty: value })}
                                        >
                                            <SelectTrigger className="bg-slate-800 border-white/10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                <SelectItem value="easy">Easy</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Input
                                            value={questionForm.category}
                                            onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                                            className="bg-slate-800 border-white/10"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleUpdateQuestion} className="bg-indigo-600 hover:bg-indigo-700">
                                        Update Question
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    {/* Edit Question Dialog content ... same as before but inside card */}
                </div>
            </div>
        </div>
    );
};

export default AdminLanguageInterview;
