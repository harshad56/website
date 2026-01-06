import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/ApiService";
import { Users, Clock, MessageCircle, FileText, Video, ArrowLeft, LogOut } from "lucide-react";

const StudyGroupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [group, setGroup] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("discussion");

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                if (!id) return;
                setLoading(true);
                const res = await apiService.getStudyGroup(id);
                if (res.success && res.data) {
                    setGroup(res.data);
                } else {
                    toast({ title: "Error", description: "Group not found", variant: "destructive" });
                    navigate("/study-groups");
                }
            } catch (error) {
                console.error("Failed to fetch group", error);
                toast({ title: "Error", description: "Failed to load group", variant: "destructive" });
                navigate("/study-groups");
            } finally {
                setLoading(false);
            }
        };

        fetchGroup();
    }, [id, navigate, toast]);

    const handleLeave = async () => {
        if (!confirm("Are you sure you want to leave this group?")) return;
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-[#020617]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!group) return null;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 pb-20">
            {/* Header Banner */}
            <div className={`h-64 relative bg-gradient-to-br ${group.gradient || 'from-indigo-600 to-violet-600'}`}>
                <div className="absolute inset-0 bg-black/20" />
                {/* Back Button - Fixed Position relative to banner */}
                <div className="absolute top-6 left-4 md:left-8 z-20">
                    <BackButton className="bg-black/20 hover:bg-black/40 border-0 text-white backdrop-blur-sm" />
                </div>

                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">

                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-slate-900 p-1 shadow-2xl ring-4 ring-[#020617]/50">
                            <img src={group.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${group.name}`} alt={group.name} className="w-full h-full rounded-xl object-cover" />
                        </div>
                        <div className="flex-1 mb-2">
                            <h1 className="text-4xl font-black text-white mb-2">{group.name}</h1>
                            <div className="flex items-center gap-4 text-white/80">
                                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {group.members || 1} Members</span>
                                <span className="w-1 h-1 bg-white/40 rounded-full" />
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {group.meeting_frequency}</span>
                                <Badge className="bg-white/10 hover:bg-white/20 ml-2">{group.topic}</Badge>
                            </div>
                        </div>
                        <Button variant="destructive" onClick={handleLeave} className="mb-2 bg-white/90 hover:bg-white text-red-600 border-0 md:ml-auto font-bold shadow-lg backdrop-blur-md">
                            <LogOut className="w-4 h-4 mr-2" /> Leave Group
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card className="bg-slate-900/40 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg">About</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-400 text-sm leading-relaxed">
                                {group.description}
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/40 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg">Next Meeting</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                                    <p className="text-indigo-300 font-bold mb-1">Saturday, 8:00 PM</p>
                                    <p className="text-xs text-indigo-400/60">Zoom Call</p>
                                    <Button size="sm" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500">Join Call</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="bg-slate-900/50 border border-white/5 p-1 h-12 rounded-xl w-full justify-start">
                                <TabsTrigger value="discussion" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-full px-6">
                                    <MessageCircle className="w-4 h-4 mr-2" /> Discussion
                                </TabsTrigger>
                                <TabsTrigger value="resources" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-full px-6">
                                    <FileText className="w-4 h-4 mr-2" /> Resources
                                </TabsTrigger>
                                <TabsTrigger value="members" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-full px-6">
                                    <Users className="w-4 h-4 mr-2" /> Members
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="discussion" className="space-y-4">
                                <Card className="bg-slate-900/40 border-white/10 h-[400px] flex items-center justify-center">
                                    <div className="text-center text-slate-500">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <h3 className="text-lg font-bold text-white mb-2">Group Chat</h3>
                                        <p>Start a conversation with your squad!</p>
                                        <Button className="mt-4 bg-white/10 hover:bg-white/20">Send a Message</Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="resources">
                                <Card className="bg-slate-900/40 border-white/10">
                                    <CardContent className="p-8 text-center text-slate-500">
                                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No resources shared yet.</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="members">
                                <Card className="bg-slate-900/40 border-white/10">
                                    <CardContent className="p-8 text-center text-slate-500">
                                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Member list coming soon.</p>
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
