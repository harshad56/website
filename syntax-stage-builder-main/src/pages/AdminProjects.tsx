import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/services/ApiService';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, Upload, Loader2, DollarSign, Download, Package, Star } from 'lucide-react';

const AdminProjects = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'regular'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    language: '',
    category: '',
    thumbnail_url: '',
    download_url: '',
    setup_pdf_url: '',
    is_active: true,
    is_featured: false,
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const [res, statsRes] = await Promise.all([
        apiService.getProjects(),
        apiService.getProjectStats()
      ]);
      
      if (res.success && res.data) {
        const projectsData = Array.isArray(res.data) ? res.data : [];
        setProjects(projectsData);
        console.log('✅ Loaded projects:', projectsData.length, projectsData);
      } else {
        console.error('❌ Failed to load projects:', res);
        toast({ 
          title: 'Warning', 
          description: res.message || 'Failed to load projects. Check console for details.', 
          variant: 'destructive' 
        });
      }
      
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
        console.log('✅ Loaded stats:', statsRes.data);
      } else {
        console.warn('⚠️ Failed to load stats:', statsRes);
      }
    } catch (err: any) {
      console.error('❌ Error loading projects:', err);
      toast({ 
        title: 'Error', 
        description: err.message || 'Failed to load projects. Please check your connection.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [toast, isAuthenticated]);

  const resetForm = () =>
    setFormData({
      title: '',
      description: '',
      price: '',
      original_price: '',
      language: '',
      category: '',
      thumbnail_url: '',
      download_url: '',
      setup_pdf_url: '',
      is_active: true,
      is_featured: false,
    });

  const startAdd = () => {
    setEditingProject(null);
    resetForm();
    setShowModal(true);
  };

  const handleFileUpload = async (field: 'thumbnail_url' | 'download_url' | 'setup_pdf_url', file: File | null) => {
    if (!file) return;
    try {
      const res = await apiService.uploadFile(file);
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, [field]: res.data!.url }));
        toast({ title: 'Uploaded', description: `${field.replace('_', ' ')} uploaded` });
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err: any) {
      toast({ title: 'Upload error', description: err.message || 'Failed to upload', variant: 'destructive' });
    }
  };

  const startEdit = (project: any) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      price: project.price?.toString() || '',
      original_price: project.original_price?.toString() || '',
      language: project.language || '',
      category: project.category || '',
      thumbnail_url: project.thumbnail_url || '',
      download_url: project.download_url || '',
      setup_pdf_url: project.setup_pdf_url || '',
      is_active: project.is_active ?? true,
      is_featured: project.is_featured ?? false,
    });
    setShowModal(true);
  };

  const saveProject = async () => {
    if (!formData.title || !formData.description) {
      toast({ title: 'Missing fields', description: 'Title and description are required', variant: 'destructive' });
      return;
    }
    try {
      setSaving(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price) || 0,
        original_price: formData.original_price ? Number(formData.original_price) : null,
        language: formData.language,
        category: formData.category,
        thumbnail_url: formData.thumbnail_url,
        download_url: formData.download_url,
        setup_pdf_url: formData.setup_pdf_url,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
      };
      let res;
      if (editingProject) {
        res = await apiService.adminUpdateProject(editingProject.id, payload);
      } else {
        res = await apiService.adminCreateProject(payload);
      }
      if (res.success && res.data) {
        setShowModal(false);
        toast({ 
          title: 'Saved', 
          description: editingProject ? 'Project updated successfully' : 'Project created successfully' 
        });
        // Refresh projects and stats
        await loadProjects();
      } else {
        throw new Error(res.message || 'Save failed');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save', variant: 'destructive' });
    } finally {
      setSaving(false);
      setEditingProject(null);
      resetForm();
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      const res = await apiService.adminDeleteProject(id);
      if (res.success) {
        toast({ title: 'Deleted', description: 'Project removed successfully' });
        // Refresh projects and stats
        await loadProjects();
      } else {
        throw new Error(res.message || 'Delete failed');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to delete', variant: 'destructive' });
    }
  };

  const totalRevenue = stats?.revenue ?? 0;
  const totalDownloads = stats?.totalDownloads ?? 0;
  const activeCount = stats?.activeProjects ?? projects.filter((p) => p.is_active !== false).length;
  const featuredCount = stats?.featuredProjects ?? projects.filter((p) => p.is_featured).length;

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.is_active !== false) ||
        (statusFilter === 'inactive' && p.is_active === false);
      const matchesFeatured =
        featuredFilter === 'all' ||
        (featuredFilter === 'featured' && p.is_featured) ||
        (featuredFilter === 'regular' && !p.is_featured);
      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [projects, search, statusFilter, featuredFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900">
      <header className="bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/real-projects"
              className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            >
              ← Back to Store
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Projects Admin
            </h1>
          </div>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600" onClick={startAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Fill in the project details below. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-black/40 border-white/10 text-white"
                    placeholder="e.g., E-commerce Web Application"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-black/40 border-white/10 text-white"
                    rows={3}
                    placeholder="Project description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="original_price">Original Price (₹)</Label>
                    <Input
                      id="original_price"
                      type="number"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="e.g., JavaScript"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="e.g., Web Development"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="thumbnail_url"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="https://..."
                    />
                    <Button variant="outline" asChild>
                      <label className="cursor-pointer flex items-center gap-1 px-3 py-2">
                        <Upload className="w-4 h-4" />
                        <input type="file" className="hidden" accept="image/*"
                          onChange={(e) => handleFileUpload('thumbnail_url', e.target.files?.[0] || null)} />
                        Upload
                      </label>
                    </Button>
                  </div>
                  {formData.thumbnail_url && (
                    <div className="mt-2">
                      <div className="relative w-full h-32 bg-slate-800 rounded border border-white/10 overflow-hidden">
                        <img
                          src={formData.thumbnail_url}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-sm">Invalid Image URL</div>';
                            }
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Preview</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="download_url">Download URL *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="download_url"
                      value={formData.download_url}
                      onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="https://..."
                    />
                    <Button variant="outline" asChild>
                      <label className="cursor-pointer flex items-center gap-1 px-3 py-2">
                        <Upload className="w-4 h-4" />
                        <input type="file" className="hidden"
                          onChange={(e) => handleFileUpload('download_url', e.target.files?.[0] || null)} />
                        Upload
                      </label>
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="setup_pdf_url">Setup PDF URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="setup_pdf_url"
                      value={formData.setup_pdf_url}
                      onChange={(e) => setFormData({ ...formData, setup_pdf_url: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="https://..."
                    />
                    <Button variant="outline" asChild>
                      <label className="cursor-pointer flex items-center gap-1 px-3 py-2">
                        <Upload className="w-4 h-4" />
                        <input type="file" className="hidden" accept="application/pdf"
                          onChange={(e) => handleFileUpload('setup_pdf_url', e.target.files?.[0] || null)} />
                        Upload
                      </label>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label>Featured</Label>
                  </div>
                </div>
                <Button 
                  type="button"
                  className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600" 
                  onClick={saveProject} 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="bg-black/40 border border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="list">Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-900/50 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-indigo-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Downloads</p>
                      <p className="text-2xl font-bold text-white">{totalDownloads.toLocaleString()}</p>
                    </div>
                    <Download className="w-8 h-8 text-cyan-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Projects</p>
                      <p className="text-2xl font-bold text-white">{projects.length}</p>
                    </div>
                    <Package className="w-8 h-8 text-indigo-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Active / Featured</p>
                      <p className="text-2xl font-bold text-white">
                        {activeCount} / {featuredCount}
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="list" className="mt-4">
            <div className="flex flex-wrap gap-3 mb-6">
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/40 border-white/10 text-white w-full md:w-64"
              />
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={featuredFilter} onValueChange={(v: any) => setFeaturedFilter(v)}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white w-40">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">
                  {projects.length === 0 ? 'No projects found. Create your first project!' : 'No projects match your filters.'}
                </p>
                {projects.length === 0 && (
                  <Button onClick={startAdd} className="mt-4 bg-gradient-to-r from-indigo-500 to-cyan-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="bg-slate-900/50 border-white/10 hover:border-indigo-500/50 transition-colors overflow-hidden">
                    {project.thumbnail_url && (
                      <div className="relative w-full h-48 bg-slate-800 overflow-hidden">
                        <img
                          src={project.thumbnail_url}
                          alt={project.title || 'Project thumbnail'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Image</div>';
                          }}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-white text-lg truncate">{project.title || 'Untitled Project'}</CardTitle>
                          <p className="text-gray-400 text-sm line-clamp-2 mt-1">{project.description || 'No description'}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button size="icon" variant="ghost" onClick={() => startEdit(project)} className="h-8 w-8 hover:bg-indigo-500/20">
                            <Edit className="w-4 h-4 text-indigo-400" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteProject(project.id)} className="h-8 w-8 hover:bg-red-500/20">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-gray-300 text-sm space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        {project.language && <Badge variant="outline" className="text-xs bg-indigo-500/10 border-indigo-500/30">{project.language}</Badge>}
                        {project.category && <Badge variant="outline" className="text-xs bg-cyan-500/10 border-cyan-500/30">{project.category}</Badge>}
                      </div>
                      <div className="font-semibold text-white text-lg">₹{project.price || 0}</div>
                      {project.original_price && project.original_price > project.price && (
                        <div className="text-xs text-gray-500 line-through">₹{project.original_price}</div>
                      )}
                      <div className="space-y-1 pt-2 border-t border-white/10">
                        {project.download_url ? (
                          <div className="text-xs text-green-400 truncate" title={project.download_url}>
                            ✓ Download URL configured
                          </div>
                        ) : (
                          <div className="text-xs text-yellow-400">⚠ Download URL missing</div>
                        )}
                        {project.setup_pdf_url ? (
                          <div className="text-xs text-green-400 truncate" title={project.setup_pdf_url}>
                            ✓ Setup PDF configured
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500">No setup PDF</div>
                        )}
                      </div>
                      <div className="flex gap-2 text-xs text-gray-400 pt-2 border-t border-white/10">
                        <span className={project.is_active ? 'text-green-400' : 'text-red-400'}>
                          {project.is_active ? '● Active' : '○ Inactive'}
                        </span>
                        {project.is_featured && <span className="text-yellow-300">★ Featured</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminProjects;

