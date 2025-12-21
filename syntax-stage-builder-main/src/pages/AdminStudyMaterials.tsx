import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/services/ApiService';
import { Plus, Edit, Trash2, Upload, DollarSign, Download, Package, Star, Loader2 } from 'lucide-react';

const AdminStudyMaterials = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'regular'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: '',
    type: '',
    price: '',
    original_price: '',
    file_url: '',
    setup_pdf_url: '',
    thumbnail_url: '',
    is_active: true,
    is_featured: false,
  });

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const [res, statsRes] = await Promise.all([
        apiService.getStudyMaterials(),
        apiService.getStudyMaterialStats()
      ]);
      
      if (res.success && res.data) {
        const materialsData = Array.isArray(res.data) ? res.data : [];
        setMaterials(materialsData);
        console.log('✅ Loaded study materials:', materialsData.length, materialsData);
      } else {
        console.error('❌ Failed to load materials:', res);
        toast({ 
          title: 'Warning', 
          description: res.message || 'Failed to load materials. Check console for details.', 
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
      console.error('❌ Error loading materials:', err);
      toast({ 
        title: 'Error', 
        description: err.message || 'Failed to load materials. Please check your connection.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [toast]);

  const resetForm = () =>
    setFormData({
      title: '',
      description: '',
      category: '',
      language: '',
      type: '',
      price: '',
      original_price: '',
      file_url: '',
      setup_pdf_url: '',
      thumbnail_url: '',
      is_active: true,
      is_featured: false,
    });

  const startAdd = () => {
    setEditingMaterial(null);
    resetForm();
    setShowModal(true);
  };

  const startEdit = (material: any) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title || '',
      description: material.description || '',
      category: material.category || '',
      language: material.language || '',
      type: material.type || '',
      price: material.price?.toString() || '',
      original_price: material.original_price?.toString() || '',
      file_url: material.file_url || '',
      setup_pdf_url: material.setup_pdf_url || '',
      thumbnail_url: material.thumbnail_url || '',
      is_active: material.is_active ?? true,
      is_featured: material.is_featured ?? false,
    });
    setShowModal(true);
  };

  const saveMaterial = async () => {
    if (!formData.title || !formData.title.trim()) {
      toast({ title: 'Missing fields', description: 'Title is required', variant: 'destructive' });
      return;
    }
    if (!formData.type || !formData.type.trim()) {
      toast({ title: 'Missing fields', description: 'Type is required (PDF, Notes, Ebook, Video, Document, or Tutorial)', variant: 'destructive' });
      return;
    }
    if (!formData.file_url || !formData.file_url.trim()) {
      toast({ title: 'Missing fields', description: 'File URL is required', variant: 'destructive' });
      return;
    }
    try {
      setSaving(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        category: formData.category?.trim() || null,
        language: formData.language?.trim() || null,
        type: formData.type.trim(), // Required field
        price: Number(formData.price) || 0,
        original_price: formData.original_price && formData.original_price.trim() ? Number(formData.original_price) : null,
        file_url: formData.file_url.trim(),
        setup_pdf_url: formData.setup_pdf_url?.trim() || null,
        thumbnail_url: formData.thumbnail_url?.trim() || null,
        is_active: formData.is_active ?? true,
        is_featured: formData.is_featured ?? false,
      };
      
      console.log('Saving study material with payload:', payload);
      let res;
      if (editingMaterial) {
        res = await apiService.adminUpdateStudyMaterial(editingMaterial.id, payload);
      } else {
        res = await apiService.adminCreateStudyMaterial(payload);
      }
      if (res.success) {
        await loadMaterials();
        setShowModal(false);
        toast({ title: 'Saved', description: editingMaterial ? 'Material updated' : 'Material created' });
      } else {
        const errorMsg = res.message || res.error || 'Save failed';
        console.error('Save failed:', res);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error('Error saving study material:', err);
      toast({ 
        title: 'Error', 
        description: err.message || err.response?.data?.message || 'Failed to save', 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
      setEditingMaterial(null);
      resetForm();
    }
  };

  const deleteMaterial = async (id: string) => {
    if (!confirm('Delete this material?')) return;
    try {
      const res = await apiService.adminDeleteStudyMaterial(id);
      if (res.success) {
        await loadMaterials();
        toast({ title: 'Deleted', description: 'Material removed' });
      } else {
        throw new Error(res.message || 'Delete failed');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to delete', variant: 'destructive' });
    }
  };

  // Helper function to detect file type from URL
  const detectFileTypeFromUrl = (url: string): string | null => {
    if (!url) return null;
    const urlLower = url.toLowerCase();
    const urlPath = urlLower.split('?')[0]; // Remove query parameters
    const fileExtension = urlPath.split('.').pop() || '';

    // Check by file extension
    if (fileExtension === 'pdf') {
      return 'PDF';
    }
    if (fileExtension === 'mp4' || fileExtension === 'avi' || fileExtension === 'mov' || 
        fileExtension === 'mkv' || fileExtension === 'webm' || urlLower.includes('/video/')) {
      return 'Video';
    }
    if (fileExtension === 'epub' || fileExtension === 'mobi' || fileExtension === 'azw') {
      return 'Ebook';
    }
    if (fileExtension === 'doc' || fileExtension === 'docx') {
      return 'Document';
    }
    if (fileExtension === 'txt' || fileExtension === 'md') {
      return 'Notes';
    }
    
    return null;
  };

  // Helper function to detect file type from file extension or MIME type
  const detectFileType = (file: File): string | null => {
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop() || '';
    const mimeType = file.type.toLowerCase();

    // Check by file extension first
    if (fileExtension === 'pdf' || mimeType.includes('pdf')) {
      return 'PDF';
    }
    if (fileExtension === 'mp4' || fileExtension === 'avi' || fileExtension === 'mov' || fileExtension === 'mkv' || 
        fileExtension === 'webm' || mimeType.includes('video')) {
      return 'Video';
    }
    if (fileExtension === 'epub' || fileExtension === 'mobi' || fileExtension === 'azw' || mimeType.includes('epub')) {
      return 'Ebook';
    }
    if (fileExtension === 'doc' || fileExtension === 'docx' || fileExtension === 'txt' || 
        mimeType.includes('document') || mimeType.includes('msword') || mimeType.includes('text')) {
      // For text files, check if it's notes-like
      if (fileExtension === 'txt' || fileExtension === 'md') {
        return 'Notes';
      }
      return 'Document';
    }
    
    // Default to null if we can't determine
    return null;
  };

  const handleFileUpload = async (field: 'file_url' | 'setup_pdf_url' | 'thumbnail_url', file: File | null) => {
    if (!file) return;
    try {
      const res = await apiService.uploadFile(file);
      if (res.success && res.data?.url) {
        // Auto-detect and set type based on file extension (only for file_url)
        const detectedType = field === 'file_url' ? detectFileType(file) : null;
        
        setFormData((prev) => {
          const updated = { ...prev, [field]: res.data!.url };
          // Auto-set type when file is uploaded (type is required, so always set it if detected)
          if (detectedType && field === 'file_url') {
            updated.type = detectedType;
          }
          return updated;
        });
        
        const typeMessage = detectedType && field === 'file_url' ? ` (Type: ${detectedType})` : '';
        toast({ title: 'Uploaded', description: `${field.replace('_', ' ')} uploaded${typeMessage}` });
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err: any) {
      toast({ title: 'Upload error', description: err.message || 'Failed to upload', variant: 'destructive' });
    }
  };

  const totalRevenue = stats?.revenue ?? 0;
  const totalDownloads = stats?.totalDownloads ?? 0;
  const activeCount = stats?.activeMaterials ?? materials.filter((m) => m.is_active !== false).length;
  const featuredCount = stats?.featuredMaterials ?? materials.filter((m) => m.is_featured).length;

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch =
        !search ||
        m.title?.toLowerCase().includes(search.toLowerCase()) ||
        m.description?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && m.is_active !== false) ||
        (statusFilter === 'inactive' && m.is_active === false);
      const matchesFeatured =
        featuredFilter === 'all' ||
        (featuredFilter === 'featured' && m.is_featured) ||
        (featuredFilter === 'regular' && !m.is_featured);
      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [materials, search, statusFilter, featuredFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-400 mx-auto mb-4" />
          <p>Loading study materials...</p>
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
              to="/study-materials"
              className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            >
              ← Back to Store
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Study Materials Admin
            </h1>
          </div>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500" onClick={startAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>{editingMaterial ? 'Edit Study Material' : 'Add Study Material'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div>
                  <Label>Language</Label>
                  <Input value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div>
                  <Label>Type <span className="text-red-400">*</span></Label>
                  <Select 
                    value={formData.type || undefined} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="bg-black/50 border-white/20 text-white">
                      <SelectValue placeholder="Select type (required)" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="PDF" className="text-white hover:bg-white/10">PDF</SelectItem>
                      <SelectItem value="Notes" className="text-white hover:bg-white/10">Notes</SelectItem>
                      <SelectItem value="Ebook" className="text-white hover:bg-white/10">Ebook</SelectItem>
                      <SelectItem value="Video" className="text-white hover:bg-white/10">Video</SelectItem>
                      <SelectItem value="Document" className="text-white hover:bg-white/10">Document</SelectItem>
                      <SelectItem value="Tutorial" className="text-white hover:bg-white/10">Tutorial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Price (₹)</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div>
                  <Label>Original Price (₹)</Label>
                  <Input type="number" value={formData.original_price} onChange={(e) => setFormData({ ...formData, original_price: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div className="col-span-2">
                  <Label>File URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={formData.file_url} 
                      onChange={(e) => {
                        const url = e.target.value;
                        // Auto-detect type from URL (type is required, so always set it if detected)
                        const detectedType = detectFileTypeFromUrl(url);
                        setFormData((prev) => ({
                          ...prev,
                          file_url: url,
                          ...(detectedType && { type: detectedType })
                        }));
                      }} 
                      className="bg-black/50 border-white/20 text-white" 
                    />
                    <Button variant="outline" asChild>
                      <label className="cursor-pointer flex items-center gap-1 px-3 py-2">
                        <Upload className="w-4 h-4" />
                        <input type="file" className="hidden"
                          onChange={(e) => handleFileUpload('file_url', e.target.files?.[0] || null)} />
                        Upload
                      </label>
                    </Button>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Setup PDF URL</Label>
                  <div className="flex gap-2">
                    <Input value={formData.setup_pdf_url} onChange={(e) => setFormData({ ...formData, setup_pdf_url: e.target.value })} className="bg-black/50 border-white/20 text-white" />
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
                <div className="col-span-2">
                  <Label>Thumbnail URL</Label>
                  <div className="flex gap-2">
                    <Input value={formData.thumbnail_url} onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })} className="bg-black/50 border-white/20 text-white" />
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
                <div className="col-span-2 flex items-center gap-6">
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
                <div className="col-span-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600" 
                    onClick={saveMaterial} 
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingMaterial ? (
                      'Update Material'
                    ) : (
                      'Create Material'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="bg-black/40 border border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="list">Study Materials</TabsTrigger>
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
                      <p className="text-sm text-gray-400 mb-1">Materials</p>
                      <p className="text-2xl font-bold text-white">{materials.length}</p>
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
            <div className="flex flex-wrap gap-3 mb-4">
              <Input
                placeholder="Search title or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/40 border-white/20 text-white w-full md:w-64"
              />
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="bg-black/40 border-white/20 text-white w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={featuredFilter} onValueChange={(v: any) => setFeaturedFilter(v)}>
                <SelectTrigger className="bg-black/40 border-white/20 text-white w-40">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center text-xs text-gray-400">
                {stats ? 'Synced with database' : 'Live data'}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="bg-slate-900/50 border-white/10 hover:border-indigo-500/50 transition-colors overflow-hidden">
                  {material.thumbnail_url && (
                    <div className="relative w-full h-48 bg-slate-800 overflow-hidden">
                      <img
                        src={material.thumbnail_url}
                        alt={material.title || 'Material thumbnail'}
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
                        <CardTitle className="text-white text-lg truncate">{material.title || 'Untitled Material'}</CardTitle>
                        <p className="text-gray-400 text-sm line-clamp-2 mt-1">{material.description || 'No description'}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(material)} className="h-8 w-8 hover:bg-indigo-500/20">
                          <Edit className="w-4 h-4 text-indigo-400" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteMaterial(material.id)} className="h-8 w-8 hover:bg-red-500/20">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-gray-300 text-sm space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      {material.type && <Badge variant="outline" className="text-xs bg-indigo-500/10 border-indigo-500/30">{material.type}</Badge>}
                      {material.category && <Badge variant="outline" className="text-xs bg-cyan-500/10 border-cyan-500/30">{material.category}</Badge>}
                      {material.language && <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30">{material.language}</Badge>}
                    </div>
                    <div className="font-semibold text-white text-lg">₹{material.price || 0}</div>
                    {material.original_price && material.original_price > material.price && (
                      <div className="text-xs text-gray-500 line-through">₹{material.original_price}</div>
                    )}
                    <div className="space-y-1 pt-2 border-t border-white/10">
                      {material.file_url ? (
                        <div className="text-xs text-green-400 truncate" title={material.file_url}>
                          ✓ File URL configured
                        </div>
                      ) : (
                        <div className="text-xs text-yellow-400">⚠ File URL missing</div>
                      )}
                      {material.setup_pdf_url ? (
                        <div className="text-xs text-green-400 truncate" title={material.setup_pdf_url}>
                          ✓ Setup PDF configured
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">No setup PDF</div>
                      )}
                    </div>
                    <div className="flex gap-2 text-xs text-gray-400 pt-2 border-t border-white/10">
                      <span className={material.is_active ? 'text-green-400' : 'text-red-400'}>
                        {material.is_active ? '● Active' : '○ Inactive'}
                      </span>
                      {material.is_featured && <span className="text-yellow-300">★ Featured</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredMaterials.length === 0 && <p className="text-gray-400 mt-4">No study materials match filters.</p>}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminStudyMaterials;

