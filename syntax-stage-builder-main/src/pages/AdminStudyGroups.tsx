import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/ApiService';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, Upload, Users, Globe, Lock, Search, Filter } from 'lucide-react';
import { BackButton } from '@/components/BackButton';

const AdminStudyGroups = () => {
    const { toast } = useToast();
    const { isAuthenticated, user } = useAuth();
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingGroup, setEditingGroup] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [topicFilter, setTopicFilter] = useState('all');

    const [formData, setFormData] = useState({
        name: '',
        topic: '',
        level: 'Beginner',
        description: '',
        max_members: 10,
        is_private: false,
        meeting_frequency: 'Weekly',
        avatar: '',
        tags: '',
        gradient: 'from-indigo-500 to-purple-500',
        meeting_link: '',
        is_active: true
    });

    const loadGroups = async () => {
        try {
            setLoading(true);
            const res = await apiService.getAllStudyGroupsAdmin();

            if (res.success && res.data) {
                setGroups(res.data);
            } else {
                toast({
                    title: 'Warning',
                    description: res.message || 'Failed to load groups.',
                    variant: 'destructive'
                });
            }
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Failed to load groups.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGroups();
    }, []);

    const resetForm = () =>
        setFormData({
            name: '',
            topic: '',
            level: 'Beginner',
            description: '',
            max_members: 10,
            is_private: false,
            meeting_frequency: 'Weekly',
            avatar: '',
            tags: '',
            gradient: 'from-indigo-500 to-purple-500',
            meeting_link: '',
            is_active: true
        });

    const startAdd = () => {
        setEditingGroup(null);
        resetForm();
        setShowModal(true);
    };

    const startEdit = (group: any) => {
        setEditingGroup(group);
        setFormData({
            name: group.name || '',
            topic: group.topic || '',
            level: group.level || 'Beginner',
            description: group.description || '',
            max_members: group.max_members || 10,
            is_private: group.is_private || false,
            meeting_frequency: group.meeting_frequency || 'Weekly',
            avatar: group.avatar || '',
            tags: group.tags ? group.tags.join(', ') : '',
            gradient: group.gradient || 'from-indigo-500 to-purple-500',
            meeting_link: group.meeting_link || '',
            is_active: group.is_active ?? true
        });
        setShowModal(true);
    };

    const handleFileUpload = async (field: 'avatar', file: File | null) => {
        if (!file) return;
        try {
            const res = await apiService.uploadFile(file);
            if (res.success && res.data?.url) {
                setFormData((prev) => ({ ...prev, [field]: res.data!.url }));
                toast({ title: 'Uploaded', description: 'Image uploaded successfully' });
            } else {
                throw new Error(res.message || 'Upload failed');
            }
        } catch (err: any) {
            toast({ title: 'Upload error', description: err.message || 'Failed to upload', variant: 'destructive' });
        }
    };

    const saveGroup = async () => {
        if (!formData.name || !formData.topic || !formData.description) {
            toast({ title: 'Missing fields', description: 'Name, Topic, and Description are required', variant: 'destructive' });
            return;
        }

        try {
            setSaving(true);
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                max_members: Number(formData.max_members)
            };

            let res;
            if (editingGroup) {
                res = await apiService.updateStudyGroup(editingGroup.id, payload);
            } else {
                res = await apiService.createStudyGroup(payload);
            }

            if (res.success && res.data) {
                setShowModal(false);
                toast({
                    title: 'Saved',
                    description: editingGroup ? 'Group updated successfully' : 'Group created successfully'
                });
                await loadGroups();
            } else {
                throw new Error(res.message || 'Save failed');
            }
        } catch (err: any) {
            toast({ title: 'Error', description: err.message || 'Failed to save', variant: 'destructive' });
        } finally {
            setSaving(false);
            setEditingGroup(null);
            resetForm();
        }
    };

    const deleteGroup = async (id: string) => {
        if (!confirm('Are you sure you want to delete this study group?')) return;
        try {
            const res = await apiService.deleteStudyGroup(id);
            if (res.success) {
                toast({ title: 'Deleted', description: 'Group removed successfully' });
                await loadGroups();
            } else {
                throw new Error(res.message || 'Delete failed');
            }
        } catch (err: any) {
            toast({ title: 'Error', description: err.message || 'Failed to delete', variant: 'destructive' });
        }
    };

    const filteredGroups = useMemo(() => {
        return groups.filter((g) => {
            const matchesSearch =
                !search ||
                g.name?.toLowerCase().includes(search.toLowerCase()) ||
                g.description?.toLowerCase().includes(search.toLowerCase());
            const matchesTopic =
                topicFilter === 'all' || g.topic === topicFilter;
            return matchesSearch && matchesTopic;
        });
    }, [groups, search, topicFilter]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-[#020617]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p>Loading study groups...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 pb-20 overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 pt-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <BackButton />
                        <h1 className="text-3xl font-black text-white">Manage Study Groups</h1>
                    </div>
                    <Dialog open={showModal} onOpenChange={setShowModal}>
                        <DialogTrigger asChild>
                            <Button onClick={startAdd} className="bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl px-6">
                                <Plus className="w-4 h-4 mr-2" /> Create Group
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-white/10 text-white">
                            <DialogHeader>
                                <DialogTitle>{editingGroup ? 'Edit Group' : 'Create New Group'}</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Manage the details of your study community.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <div>
                                    <Label>Group Name *</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-slate-900 border-white/10"
                                        placeholder="e.g., React Masters"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Topic *</Label>
                                        <Input
                                            value={formData.topic}
                                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                            className="bg-slate-900 border-white/10"
                                            placeholder="e.g., React"
                                        />
                                    </div>
                                    <div>
                                        <Label>Level</Label>
                                        <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                                            <SelectTrigger className="bg-slate-900 border-white/10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label>Description *</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="bg-slate-900 border-white/10"
                                        rows={3}
                                        placeholder="What is this group about?"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Max Members</Label>
                                        <Input
                                            type="number"
                                            value={formData.max_members}
                                            onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
                                            className="bg-slate-900 border-white/10"
                                        />
                                    </div>
                                    <div>
                                        <Label>Meeting Frequency</Label>
                                        <Select value={formData.meeting_frequency} onValueChange={(v) => setFormData({ ...formData, meeting_frequency: v })}>
                                            <SelectTrigger className="bg-slate-900 border-white/10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                <SelectItem value="Weekly">Weekly</SelectItem>
                                                <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                                                <SelectItem value="Monthly">Monthly</SelectItem>
                                                <SelectItem value="Daily">Daily</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label>Tags (comma separated)</Label>
                                    <Input
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="bg-slate-900 border-white/10"
                                        placeholder="e.g., hooks, redux, components"
                                    />
                                </div>

                                <div>
                                    <Label>Avatar URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={formData.avatar}
                                            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                            className="bg-slate-900 border-white/10"
                                            placeholder="https://..."
                                        />
                                        <Button variant="outline" asChild className="border-white/10 hover:bg-white/5">
                                            <label className="cursor-pointer flex items-center gap-1 px-3 py-2">
                                                <Upload className="w-4 h-4" />
                                                <input type="file" className="hidden" accept="image/*"
                                                    onChange={(e) => handleFileUpload('avatar', e.target.files?.[0] || null)} />
                                                Upload
                                            </label>
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <Label>Gradient Class (Tailwind)</Label>
                                    <Input
                                        value={formData.gradient}
                                        onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                                        className="bg-slate-900 border-white/10"
                                        placeholder="e.g., from-blue-500 to-cyan-500"
                                    />
                                </div>

                                <div>
                                    <Label>Meeting Link</Label>
                                    <Input
                                        value={formData.meeting_link}
                                        onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                                        className="bg-slate-900 border-white/10"
                                        placeholder="e.g., https://zoom.us/j/..."
                                    />
                                </div>

                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={formData.is_private}
                                            onCheckedChange={(checked) => setFormData({ ...formData, is_private: checked })}
                                        />
                                        <Label>Private Group</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={formData.is_active}
                                            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                        />
                                        <Label>Active (Visible)</Label>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold h-12 rounded-xl mt-4"
                                    onClick={saveGroup}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : editingGroup ? 'Update Group' : 'Create Group'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <Input
                            placeholder="Search groups..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-900/50 border-white/10 rounded-xl pl-9 focus-visible:ring-indigo-500/50 transition-all w-full"
                        />
                    </div>
                    <Select value={topicFilter} onValueChange={setTopicFilter}>
                        <SelectTrigger className="w-[180px] bg-slate-900/50 border-white/10 rounded-xl">
                            <SelectValue placeholder="Topic" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="all">All Topics</SelectItem>
                            <SelectItem value="React">React</SelectItem>
                            <SelectItem value="JavaScript">JavaScript</SelectItem>
                            <SelectItem value="Python">Python</SelectItem>
                            <SelectItem value="Go">Go</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups.map(group => (
                        <Card key={group.id} className="bg-slate-900/40 backdrop-blur-sm border-white/10 hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden rounded-[24px]">
                            <div className={`h-24 bg-gradient-to-br ${group.gradient || 'from-indigo-600 to-violet-600'} p-6 relative`}>
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/10" onClick={() => startEdit(group)}>
                                        <Edit className="w-3.5 h-3.5 text-white" />
                                    </Button>
                                    <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md border border-red-500/30" onClick={() => deleteGroup(group.id)}>
                                        <Trash2 className="w-3.5 h-3.5 text-red-100" />
                                    </Button>
                                </div>
                                <div className="absolute -bottom-6 left-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 p-1 shadow-xl ring-4 ring-[#020617]/50">
                                        <img src={group.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${group.name}`} alt={group.name} className="w-full h-full rounded-xl object-cover" />
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-10 px-6 pb-6 space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{group.name}</h3>
                                        {group.is_private ? <Lock className="w-4 h-4 text-slate-500" /> : <Globe className="w-4 h-4 text-emerald-500" />}
                                    </div>
                                    <p className="text-sm text-slate-400 line-clamp-2">{group.description}</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {group.members || 0}/{group.max_members}</span>
                                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{group.topic}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <Badge variant={group.is_active ? "default" : "destructive"} className={group.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : ""}>
                                        {group.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <span className="text-[10px] text-slate-600">ID: {group.id}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminStudyGroups;
