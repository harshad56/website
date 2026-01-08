import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/ApiService";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Users, Clock, MessageCircle, FileText, Video, ArrowLeft, LogOut,
    Send, Plus, Link as LinkIcon, Download, Globe, Lock
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StudyGroupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();

    // Group State
    const [group, setGroup] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("discussion");

    // Tab Data State
    const [members, setMembers] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);

    // Inputs
    const [newMessage, setNewMessage] = useState("");
    const [newResource, setNewResource] = useState({ title: "", url: "", type: "link" });
    const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchData = async () => {
        if (!id) return;
        try {
            const [groupRes, membersRes, messagesRes, resourcesRes] = await Promise.all([
                apiService.getStudyGroup(id),
                apiService.getGroupMembers(id),
                apiService.getGroupMessages(id),
                apiService.getGroupResources(id)
            ]);

            if (groupRes.success) {
                setGroup(groupRes.data);
            }
            if (membersRes.success) setMembers(membersRes.data || []);
            if (messagesRes.success) setMessages(messagesRes.data || []);
            if (resourcesRes.success) setResources(resourcesRes.data || []);

        } catch (error) {
            console.error("Failed to load group data", error);
            toast({ title: "Error", description: "Failed to load group data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll for new messages every 5 seconds if on discussion tab
        const interval = setInterval(() => {
            if (activeTab === "discussion" && id) {
                apiService.getGroupMessages(id).then(res => {
                    if (res.success) setMessages(res.data || []);
                });
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [id, activeTab]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleLeave = async () => {
        try {
            if (!id) return;
            const res = await apiService.leaveStudyGroup(id);
            if (res.success) {
                toast({ title: "Left Group", description: "You have left the study group." });
                navigate("/study-groups");
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to leave group", variant: "destructive" });
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !id) return;

        try {
            const res = await apiService.sendGroupMessage(id, newMessage, user);
            if (res.success && res.data) {
                setMessages([...messages, res.data]);
                setNewMessage("");
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
        }
    };

    const handleAddResource = async () => {
        if (!newResource.title || !newResource.url || !id) return;
        try {
            const res = await apiService.addGroupResource(id, newResource, user);
            if (res.success && res.data) {
                setResources([res.data, ...resources]);
                setIsResourceDialogOpen(false);
                setNewResource({ title: "", url: "", type: "link" });
                toast({ title: "Success", description: "Resource added successfully" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to add resource", variant: "destructive" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-[#020617]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!group) return null;

    const isMember = true; // Use API check in real app or derived from my-groups list, assuming access here implies membership or public view

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 pb-20">
            {/* Header Banner */}
            <div className={`h-72 relative bg-gradient-to-br ${group.gradient || 'from-indigo-600 to-violet-600'}`}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                <div className="absolute top-6 left-4 md:left-8 z-20">
                    <BackButton className="bg-black/20 hover:bg-black/40 border-0 text-white backdrop-blur-sm" />
                </div>

                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end gap-8">
                        <div className="w-28 h-28 rounded-3xl bg-slate-900 p-1.5 shadow-2xl ring-4 ring-[#020617]/50 shadow-black/50">
                            <img src={group.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${group.name}`} alt={group.name} className="w-full h-full rounded-2xl object-cover" />
                        </div>
                        <div className="flex-1 mb-2">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{group.name}</h1>
                                {group.is_private ?
                                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-200 border-amber-500/30"><Lock className="w-3 h-3 mr-1" /> Private</Badge> :
                                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-500/30"><Globe className="w-3 h-3 mr-1" /> Public</Badge>
                                }
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-white/80 font-medium">
                                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {members.length || group.members || 1} Members</span>
                                <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {group.meeting_frequency}</span>
                                <Badge className="bg-white/10 hover:bg-white/20 ml-2 border-white/10">{group.topic}</Badge>
                            </div>
                        </div>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="mb-2 bg-white/90 hover:bg-white text-red-600 border-0 md:ml-auto font-bold shadow-lg backdrop-blur-md transition-all hover:scale-105">
                                    <LogOut className="w-4 h-4 mr-2" /> Leave Group
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-900 border border-white/10 text-white">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-400">
                                        This will remove you from the <strong>{group.name}</strong> study group.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleLeave} className="bg-red-600 hover:bg-red-700 text-white border-0">
                                        Yes, leave group
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Info */}
                    <div className="space-y-6 lg:col-span-1 order-2 lg:order-1">
                        <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">About</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-400 text-sm leading-relaxed">
                                {group.description}
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Next Meeting</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                                    <p className="text-indigo-300 font-bold mb-1">Saturday, 8:00 PM</p>
                                    <p className="text-xs text-indigo-400/60 mb-3">Zoom Call</p>
                                    <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20">
                                        <Video className="w-4 h-4 mr-2" /> Join Call
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="bg-slate-900/50 border border-white/5 p-1 h-14 rounded-2xl w-full justify-start overflow-x-auto no-scrollbar">
                                <TabsTrigger value="discussion" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-full px-6 transition-all data-[state=active]:shadow-lg shadow-indigo-600/20">
                                    <MessageCircle className="w-4 h-4 mr-2" /> Discussion
                                </TabsTrigger>
                                <TabsTrigger value="resources" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-full px-6 transition-all data-[state=active]:shadow-lg shadow-indigo-600/20">
                                    <FileText className="w-4 h-4 mr-2" /> Resources
                                </TabsTrigger>
                                <TabsTrigger value="members" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-full px-6 transition-all data-[state=active]:shadow-lg shadow-indigo-600/20">
                                    <Users className="w-4 h-4 mr-2" /> Members
                                </TabsTrigger>
                            </TabsList>

                            {/* --- DISCUSSION TAB --- */}
                            <TabsContent value="discussion" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                                <Card className="bg-slate-900/40 border-white/10 flex flex-col h-[600px]">
                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        {messages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                                <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
                                                <p>No messages yet. Start the conversation!</p>
                                            </div>
                                        ) : (
                                            messages.map((msg, idx) => {
                                                const isMe = user?.email === msg.user_email;
                                                return (
                                                    <div key={msg.id || idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                        <Avatar className="w-10 h-10 border border-white/10 bg-slate-800">
                                                            <AvatarImage src={msg.user_avatar} />
                                                            <AvatarFallback className="text-xs bg-slate-800 text-slate-400">
                                                                {msg.user_name?.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                            <div className="flex items-baseline gap-2 mb-1 px-1">
                                                                <span className="text-xs font-bold text-slate-300">{msg.user_name}</span>
                                                                <span className="text-[10px] text-slate-500">
                                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe
                                                                    ? 'bg-indigo-600 text-white rounded-tr-sm shadow-lg shadow-indigo-900/20'
                                                                    : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5'
                                                                }`}>
                                                                {msg.content}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-4 bg-slate-900/50 border-t border-white/5">
                                        <form onSubmit={handleSendMessage} className="flex gap-2">
                                            <Input
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your message..."
                                                className="flex-1 bg-black/20 border-white/10 h-11 focus-visible:ring-indigo-500/50"
                                            />
                                            <Button type="submit" disabled={!newMessage.trim()} className="size-11 rounded-xl bg-indigo-600 hover:bg-indigo-500">
                                                <Send className="w-4 h-4 ml-0.5" />
                                            </Button>
                                        </form>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* --- RESOURCES TAB --- */}
                            <TabsContent value="resources" className="space-y-4 focus-visible:outline-none">
                                <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-white/10">
                                    <h3 className="font-semibold text-white">Shared Resources</h3>

                                    <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                                                <Plus className="w-4 h-4 mr-2" /> Add Resource
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-slate-900 border border-white/10 text-white">
                                            <DialogHeader>
                                                <DialogTitle>Share a Resource</DialogTitle>
                                                <DialogDescription>Share helpful links, docs, or videos with the group.</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Title</Label>
                                                    <Input
                                                        placeholder="e.g., React Documentation"
                                                        className="bg-black/20 border-white/10"
                                                        value={newResource.title}
                                                        onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>URL</Label>
                                                    <Input
                                                        placeholder="https://..."
                                                        className="bg-black/20 border-white/10"
                                                        value={newResource.url}
                                                        onChange={e => setNewResource({ ...newResource, url: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="ghost" onClick={() => setIsResourceDialogOpen(false)}>Cancel</Button>
                                                <Button onClick={handleAddResource} className="bg-indigo-600 text-white">Share</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {resources.length === 0 ? (
                                    <Card className="bg-slate-900/40 border-white/10 py-12">
                                        <CardContent className="text-center text-slate-500">
                                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No resources shared yet. Be the first!</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid gap-3">
                                        {resources.map((res, i) => (
                                            <Card key={i} className="bg-slate-900/40 border-white/10 hover:border-indigo-500/30 transition-all group">
                                                <div className="p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                            <LinkIcon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                                                <a href={res.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                                    {res.title}
                                                                </a>
                                                            </h4>
                                                            <p className="text-xs text-slate-500">
                                                                Shared by {res.added_by_name} • {new Date(res.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="hover:bg-white/5" onClick={() => window.open(res.url, '_blank')}>
                                                        <Download className="w-4 h-4 text-slate-400" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            {/* --- MEMBERS TAB --- */}
                            <TabsContent value="members" className="focus-visible:outline-none">
                                <Card className="bg-slate-900/40 border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Users className="w-5 h-5 text-indigo-400" />
                                            Group Members ({members.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {members.length === 0 ? (
                                            <p className="text-slate-500">No members found.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {members.map((member, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-all">
                                                        <Avatar className="w-10 h-10 border border-white/10">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user_email}`} />
                                                            <AvatarFallback className="bg-slate-800 text-slate-400">
                                                                {member.user_email?.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="overflow-hidden">
                                                            <p className="font-medium text-slate-200 truncate">{member.user_email?.split('@')[0]}</p>
                                                            <p className="text-xs text-slate-500 truncate">{member.user_email}</p>
                                                        </div>
                                                    </div>
                                                ))}
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

export default StudyGroupDetail;

