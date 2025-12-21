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
import { Plus, Edit, Trash2, Loader2, Briefcase, Users, Star, DollarSign, Upload, FileText } from 'lucide-react';

const AdminJobs = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'regular'>('all');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary_min: '',
    salary_max: '',
    salary_currency: 'INR',
    experience: 'entry',
    skills: '',
    description: '',
    requirements: '',
    benefits: '',
    category: '',
    is_remote: false,
    is_featured: false,
    is_active: true,
    contact_email: '',
    contact_phone: '',
    contact_website: '',
    company_pdf_url: '',
  });

  const loadJobs = async () => {
    try {
      setLoading(true);
      const [res, statsRes] = await Promise.all([
        apiService.getJobs(),
        apiService.getJobStats()
      ]);
      
      if (res.success && res.data) {
        const jobsData = Array.isArray(res.data) ? res.data : [];
        setJobs(jobsData);
        console.log('✅ Loaded jobs:', jobsData.length, jobsData);
      } else {
        console.error('❌ Failed to load jobs:', res);
        toast({ 
          title: 'Warning', 
          description: res.message || 'Failed to load jobs. Check console for details.', 
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
      console.error('❌ Error loading jobs:', err);
      toast({ 
        title: 'Error', 
        description: err.message || 'Failed to load jobs. Please check your connection.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [toast]);

  const resetForm = () =>
    setFormData({
      title: '',
      company: '',
      location: '',
      type: 'full-time',
      salary_min: '',
      salary_max: '',
      salary_currency: 'INR',
      experience: 'entry',
      skills: '',
      description: '',
      requirements: '',
      benefits: '',
      category: '',
      is_remote: false,
      is_featured: false,
      is_active: true,
      contact_email: '',
      contact_phone: '',
      contact_website: '',
      company_pdf_url: '',
    });

  const startAdd = () => {
    setEditingJob(null);
    resetForm();
    setShowModal(true);
  };

  const startEdit = (job: any) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      type: job.type || 'full-time',
      salary_min: job.salary?.min?.toString() || '',
      salary_max: job.salary?.max?.toString() || '',
      salary_currency: job.salary?.currency || 'INR',
      experience: job.experience || 'entry',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
      description: job.description || '',
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : '',
      category: job.category || '',
      is_remote: job.isRemote || false,
      is_featured: job.isFeatured || false,
      is_active: job.is_active ?? true,
      contact_email: job.contact?.email || '',
      contact_phone: job.contact?.phone || '',
      contact_website: job.contact?.website || '',
      company_pdf_url: job.companyPdfUrl || '',
    });
    setShowModal(true);
  };

  const saveJob = async () => {
    if (!formData.title || !formData.title.trim()) {
      toast({ title: 'Missing fields', description: 'Title is required', variant: 'destructive' });
      return;
    }
    if (!formData.company || !formData.company.trim()) {
      toast({ title: 'Missing fields', description: 'Company is required', variant: 'destructive' });
      return;
    }
    if (!formData.location || !formData.location.trim()) {
      toast({ title: 'Missing fields', description: 'Location is required', variant: 'destructive' });
      return;
    }
    if (!formData.contact_email || !formData.contact_email.trim()) {
      toast({ title: 'Missing fields', description: 'Contact email is required', variant: 'destructive' });
      return;
    }
    try {
      setSaving(true);
      
      // Parse skills, requirements, and benefits from strings to arrays
      const skills = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const requirements = formData.requirements.split('\n').map(r => r.trim()).filter(Boolean);
      const benefits = formData.benefits.split('\n').map(b => b.trim()).filter(Boolean);
      
      const payload = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        type: formData.type,
        salary_min: formData.salary_min ? Number(formData.salary_min) : null,
        salary_max: formData.salary_max ? Number(formData.salary_max) : null,
        salary_currency: formData.salary_currency,
        experience: formData.experience || null,
        skills: skills.length > 0 ? skills : null,
        description: formData.description?.trim() || null,
        requirements: requirements.length > 0 ? requirements : null,
        benefits: benefits.length > 0 ? benefits : null,
        category: formData.category?.trim() || null,
        is_remote: formData.is_remote,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone?.trim() || null,
        contact_website: formData.contact_website?.trim() || null,
        company_pdf_url: formData.company_pdf_url?.trim() || null,
      };
      
      console.log('Saving job with payload:', payload);
      let res;
      if (editingJob) {
        res = await apiService.adminUpdateJob(editingJob.id, payload);
      } else {
        res = await apiService.adminCreateJob(payload);
      }
      if (res.success) {
        await loadJobs();
        setShowModal(false);
        toast({ title: 'Saved', description: editingJob ? 'Job updated' : 'Job created' });
      } else {
        const errorMsg = res.message || res.error || 'Save failed';
        console.error('Save failed:', res);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error('Error saving job:', err);
      toast({ 
        title: 'Error', 
        description: err.message || err.response?.data?.message || 'Failed to save', 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
      setEditingJob(null);
      resetForm();
    }
  };

  const handleFileUpload = async (field: 'company_pdf_url', file: File | null) => {
    if (!file) return;
    try {
      const res = await apiService.uploadFile(file);
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, [field]: res.data!.url }));
        toast({ title: 'Uploaded', description: 'PDF uploaded successfully' });
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err: any) {
      toast({ title: 'Upload error', description: err.message || 'Failed to upload', variant: 'destructive' });
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    try {
      const res = await apiService.adminDeleteJob(id);
      if (res.success) {
        await loadJobs();
        toast({ title: 'Deleted', description: 'Job removed' });
      } else {
        throw new Error(res.message || 'Delete failed');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to delete', variant: 'destructive' });
    }
  };

  const totalJobs = stats?.totalJobs ?? jobs.length;
  const activeCount = stats?.activeJobs ?? jobs.filter((j) => j.is_active !== false).length;
  const featuredCount = stats?.featuredJobs ?? jobs.filter((j) => j.is_featured).length;
  const totalApplications = stats?.totalApplications ?? 0;

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchesSearch =
        !search ||
        j.title?.toLowerCase().includes(search.toLowerCase()) ||
        j.company?.toLowerCase().includes(search.toLowerCase()) ||
        j.description?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && j.is_active !== false) ||
        (statusFilter === 'inactive' && j.is_active === false);
      const matchesFeatured =
        featuredFilter === 'all' ||
        (featuredFilter === 'featured' && j.is_featured) ||
        (featuredFilter === 'regular' && !j.is_featured);
      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [jobs, search, statusFilter, featuredFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-400 mx-auto mb-4" />
          <p>Loading jobs...</p>
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
              to="/jobs"
              className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            >
              ← Back to Job Board
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Jobs Admin
            </h1>
          </div>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500" onClick={startAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>{editingJob ? 'Edit Job' : 'Add Job'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Title <span className="text-red-400">*</span></Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div>
                  <Label>Company <span className="text-red-400">*</span></Label>
                  <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div>
                  <Label>Location <span className="text-red-400">*</span></Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-black/50 border-white/20 text-white"
                    placeholder="e.g., Mumbai, India or Remote"
                  />
                </div>
                <div>
                  <Label>Type <span className="text-red-400">*</span></Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-black/50 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="full-time" className="text-white hover:bg-white/10">Full-time</SelectItem>
                      <SelectItem value="part-time" className="text-white hover:bg-white/10">Part-time</SelectItem>
                      <SelectItem value="contract" className="text-white hover:bg-white/10">Contract</SelectItem>
                      <SelectItem value="internship" className="text-white hover:bg-white/10">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Experience</Label>
                  <Select value={formData.experience || undefined} onValueChange={(value) => setFormData({ ...formData, experience: value })}>
                    <SelectTrigger className="bg-black/50 border-white/20 text-white">
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="entry" className="text-white hover:bg-white/10">Entry</SelectItem>
                      <SelectItem value="junior" className="text-white hover:bg-white/10">Junior</SelectItem>
                      <SelectItem value="mid" className="text-white hover:bg-white/10">Mid</SelectItem>
                      <SelectItem value="senior" className="text-white hover:bg-white/10">Senior</SelectItem>
                      <SelectItem value="lead" className="text-white hover:bg-white/10">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category / Domain</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-black/50 border-white/20 text-white"
                    placeholder="e.g., Web Development, Data Science, Marketing"
                  />
                </div>
                <div>
                  <Label>Salary Min (₹)</Label>
                  <Input type="number" value={formData.salary_min} onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div>
                  <Label>Salary Max (₹)</Label>
                  <Input type="number" value={formData.salary_max} onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-black/50 border-white/20 text-white" rows={4} />
                </div>
                <div className="col-span-2">
                  <Label>Skills (comma-separated)</Label>
                  <Input value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} className="bg-black/50 border-white/20 text-white" placeholder="e.g., JavaScript, React, Node.js" />
                </div>
                <div className="col-span-2">
                  <Label>Requirements (one per line)</Label>
                  <Textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} className="bg-black/50 border-white/20 text-white" rows={4} placeholder="Enter each requirement on a new line" />
                </div>
                <div className="col-span-2">
                  <Label>Benefits (one per line)</Label>
                  <Textarea value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} className="bg-black/50 border-white/20 text-white" rows={4} placeholder="Enter each benefit on a new line" />
                </div>
                <div>
                  <Label>Contact Email <span className="text-red-400">*</span></Label>
                  <Input type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} className="bg-black/50 border-white/20 text-white" />
                </div>
                <div className="col-span-2">
                  <Label>Contact Website</Label>
                  <Input value={formData.contact_website} onChange={(e) => setFormData({ ...formData, contact_website: e.target.value })} className="bg-black/50 border-white/20 text-white" placeholder="https://company.com" />
                </div>
                <div className="col-span-2">
                  <Label>Company PDF</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('company_pdf_url', file);
                        }}
                        className="bg-black/50 border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf';
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('company_pdf_url', file);
                          };
                          input.click();
                        }}
                        className="bg-black/50 border-white/20 text-white hover:bg-white/10"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload PDF
                      </Button>
                    </div>
                    {formData.company_pdf_url && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <a href={formData.company_pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                          View uploaded PDF
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({ ...formData, company_pdf_url: '' })}
                          className="text-red-400 hover:text-red-300 h-auto p-1"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">Upload company brochure or job details PDF (optional)</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_remote}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_remote: checked })}
                    />
                    <Label>Remote</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
                <div className="col-span-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600" 
                    onClick={saveJob} 
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black/40 border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="list">Jobs</TabsTrigger>
            <TabsTrigger value="resumes">Resumes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-900/50 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Jobs</p>
                      <p className="text-2xl font-bold text-white">{totalJobs.toLocaleString()}</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-indigo-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Applications</p>
                      <p className="text-2xl font-bold text-white">{totalApplications.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-cyan-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Active Jobs</p>
                      <p className="text-2xl font-bold text-white">{activeCount.toLocaleString()}</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-indigo-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Featured</p>
                      <p className="text-2xl font-bold text-white">{featuredCount.toLocaleString()}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="list" className="mt-4">
            <div className="mb-6 flex gap-4">
              <Input
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/40 border-white/10 text-white flex-1"
              />
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-white/10">All Status</SelectItem>
                  <SelectItem value="active" className="text-white hover:bg-white/10">Active</SelectItem>
                  <SelectItem value="inactive" className="text-white hover:bg-white/10">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={featuredFilter} onValueChange={(value: any) => setFeaturedFilter(value)}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-white/10">All</SelectItem>
                  <SelectItem value="featured" className="text-white hover:bg-white/10">Featured</SelectItem>
                  <SelectItem value="regular" className="text-white hover:bg-white/10">Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="bg-slate-900/50 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-white">{job.title}</h3>
                          {job.is_featured && <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Featured</Badge>}
                          {job.is_remote && <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">Remote</Badge>}
                          {!job.is_active && <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/50">Inactive</Badge>}
                        </div>
                        <p className="text-gray-400 mb-2">{job.company} • {job.location}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{job.type}</Badge>
                          <Badge variant="outline" className="text-xs">{job.experience}</Badge>
                          {job.category && <Badge variant="outline" className="text-xs">{job.category}</Badge>}
                        </div>
                        {job.salary?.min > 0 && (
                          <p className="text-sm text-gray-300">
                            ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()} {job.salary.currency}
                          </p>
                        )}
                        <p className="text-sm text-gray-400 mt-2">{job.applications || 0} applications</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(job)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteJob(job.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredJobs.length === 0 && (
                <Card className="bg-slate-900/50 border-white/10">
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-400">No jobs found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="resumes" className="mt-4">
            <AdminJobResumes />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Simple inline component for admin resumes list
const AdminJobResumes = () => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        setLoading(true);
        const res = await apiService.getAllResumes();
        if (res.success && Array.isArray(res.data)) {
          setResumes(res.data);
        } else {
          throw new Error(res.message || 'Failed to load resumes');
        }
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.message || 'Failed to load resumes',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    loadResumes();
  }, [toast]);

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-white/10">
        <CardContent className="p-6 text-white">Loading resumes...</CardContent>
      </Card>
    );
  }

  if (!resumes.length) {
    return (
      <Card className="bg-slate-900/50 border-white/10">
        <CardContent className="p-6 text-gray-300">No resumes uploaded yet.</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {resumes.map((resume) => (
        <Card key={resume.id} className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6 text-sm text-gray-200 space-y-2">
            <p>
              <span className="font-semibold text-white">User ID:</span> {resume.user_id}
            </p>
            <p>
              <span className="font-semibold text-white">Uploaded:</span>{' '}
              {resume.created_at ? new Date(resume.created_at).toLocaleString() : 'N/A'}
            </p>
            <p>
              <span className="font-semibold text-white">Resume:</span>{' '}
              <a
                href={resume.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                View file
              </a>
            </p>
            {Array.isArray(resume.extracted_skills) && resume.extracted_skills.length > 0 && (
              <p>
                <span className="font-semibold text-white">Extracted skills:</span>{' '}
                {resume.extracted_skills.join(', ')}
              </p>
            )}
            {Array.isArray(resume.preferred_domains) && resume.preferred_domains.length > 0 && (
              <p>
                <span className="font-semibold text-white">Preferred domains:</span>{' '}
                {resume.preferred_domains.join(', ')}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminJobs;

