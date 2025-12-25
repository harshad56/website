import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCourses } from "@/hooks/useApi";
import { apiService } from "@/services/ApiService";
import { Plus, BookOpen, Globe2, Star, Users, Loader2, Edit, Trash2, Clock, DollarSign, Image as ImageIcon, Upload } from "lucide-react";

const AdminCourses = () => {
  const navigate = useNavigate();
  const { data: courses, isLoading, isError, refetch } = useCourses();
  const { toast } = useToast();
  // ... (previous state variables)
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [deletingCourse, setDeletingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "python",
    difficulty: "beginner",
    estimatedDuration: "",
    totalLessons: "",
    price: "",
    imageUrl: "",
    tags: "",
    isPublished: true,
    category: "general",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState<{ totalCourses: number; publishedCourses: number; totalEnrollments: number; paidEnrollments: number; revenue: number } | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [languages, setLanguages] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showAddLanguageDialog, setShowAddLanguageDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newLanguageName, setNewLanguageName] = useState("");
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  const totalCourses = courses?.length || 0;
  const publishedCourses = useMemo(
    () => (courses || []).filter((c: any) => c.is_published).length,
    [courses]
  );

  // Fetch categories and languages on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoadingMetadata(true);
        const [categoriesRes, languagesRes] = await Promise.all([
          apiService.getCourseCategories(),
          apiService.getCourseLanguages()
        ]);
        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
        if (languagesRes.success && languagesRes.data) {
          setLanguages(languagesRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
        // Fallback to default lists if API fails
        setCategories([
          { id: '1', name: 'General', slug: 'general' },
          { id: '2', name: 'Frontend', slug: 'frontend' },
          { id: '3', name: 'Backend', slug: 'backend' },
          { id: '4', name: 'Full Stack', slug: 'fullstack' },
          { id: '5', name: 'Data & AI', slug: 'data' },
          { id: '6', name: 'DevOps/Cloud', slug: 'devops' },
          { id: '7', name: 'Mobile', slug: 'mobile' },
          { id: '8', name: 'Web Development', slug: 'web-development' },
          { id: '9', name: 'Cloud Computing', slug: 'cloud-computing' },
          { id: '10', name: 'Theme', slug: 'theme' }
        ]);
        setLanguages([
          { id: '1', name: 'Python', slug: 'python' },
          { id: '2', name: 'JavaScript', slug: 'javascript' },
          { id: '3', name: 'Java', slug: 'java' },
          { id: '4', name: 'C#', slug: 'csharp' },
          { id: '5', name: 'Go', slug: 'go' },
          { id: '6', name: 'Rust', slug: 'rust' },
          { id: '7', name: 'TypeScript', slug: 'typescript' },
          { id: '8', name: 'C++', slug: 'cpp' },
          { id: '9', name: 'C', slug: 'c' },
          { id: '10', name: 'PHP', slug: 'php' },
          { id: '11', name: 'Ruby', slug: 'ruby' },
          { id: '12', name: 'Swift', slug: 'swift' },
          { id: '13', name: 'Kotlin', slug: 'kotlin' }
        ]);
      } finally {
        setLoadingMetadata(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const res = await apiService.uploadFile(file);
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data!.url }));
        toast({ title: 'Uploaded', description: 'Thumbnail uploaded successfully' });
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err: any) {
      toast({ title: 'Upload error', description: err.message || 'Failed to upload', variant: 'destructive' });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.title || !formData.language) {
      toast({
        title: "Missing fields",
        description: "Title and language are required.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const totalLessons = formData.totalLessons
        ? parseInt(formData.totalLessons, 10)
        : 0;
      const price = formData.price ? parseFloat(formData.price) : 0;

      console.log('Creating course with data:', {
        title: formData.title,
        language: formData.language,
        hasToken: !!localStorage.getItem('auth_token')
      });

      const response = await apiService.createCourse({
        title: formData.title,
        description: formData.description,
        language: formData.language,
        difficulty: formData.difficulty as any,
        estimatedDuration: formData.estimatedDuration,
        totalLessons,
        price,
        imageUrl: formData.imageUrl,
        tags,
        isPublished: formData.isPublished,
        category: formData.category,
      });

      console.log('Course creation response:', response);

      if (!response.success) {
        throw new Error(response.error || response.message || "Failed to create course");
      }

      toast({
        title: "Course created",
        description: "The course has been added to the catalog.",
      });
      setShowAddModal(false);
      setFormData({
        title: "",
        description: "",
        language: "python",
        difficulty: "beginner",
        estimatedDuration: "",
        totalLessons: "",
        price: "",
        imageUrl: "",
        tags: "",
        isPublished: true,
        category: "general",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Creation failed",
        description:
          error instanceof Error ? error.message : "We couldn't create the course. Try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      language: course.language || "python",
      difficulty: course.difficulty || "beginner",
      estimatedDuration: course.estimated_duration || "",
      totalLessons: course.total_lessons?.toString() || "",
      price: course.price?.toString() || "",
      imageUrl: course.image_url || "",
      tags: Array.isArray(course.tags) ? course.tags.join(", ") : course.tags || "",
      isPublished: course.is_published ?? true,
      category: course.category || "general",
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingCourse || !formData.title || !formData.language) {
      toast({
        title: "Missing fields",
        description: "Title and language are required.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const totalLessons = formData.totalLessons
        ? parseInt(formData.totalLessons, 10)
        : 0;
      const price = formData.price ? parseFloat(formData.price) : 0;

      const response = await apiService.updateCourse(editingCourse.id, {
        title: formData.title,
        description: formData.description,
        language: formData.language,
        difficulty: formData.difficulty as any,
        estimatedDuration: formData.estimatedDuration,
        totalLessons,
        price,
        imageUrl: formData.imageUrl,
        tags,
        isPublished: formData.isPublished,
        category: formData.category,
      });

      if (!response.success) {
        throw new Error(response.error || response.message || "Failed to update course");
      }

      toast({
        title: "Course updated",
        description: "The course has been updated successfully.",
      });
      setShowEditModal(false);
      setEditingCourse(null);
      setFormData({
        title: "",
        description: "",
        language: "python",
        difficulty: "beginner",
        estimatedDuration: "",
        totalLessons: "",
        price: "",
        imageUrl: "",
        tags: "",
        isPublished: true,
        category: "general",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "We couldn't update the course. Try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const response = await apiService.createCourseCategory(newCategoryName.trim());
      if (response.success && response.data) {
        setCategories([...categories, response.data]);
        setFormData({ ...formData, category: response.data.slug });
        toast({
          title: "Category added",
          description: `"${response.data.name}" has been added successfully.`,
        });
      } else {
        throw new Error(response.message || 'Failed to create category');
      }
    } catch (error: any) {
      toast({
        title: "Failed to add category",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setNewCategoryName("");
      setShowAddCategoryDialog(false);
    }
  };

  const handleAddLanguage = async () => {
    if (!newLanguageName.trim()) return;

    try {
      const response = await apiService.createCourseLanguage(newLanguageName.trim());
      if (response.success && response.data) {
        setLanguages([...languages, response.data]);
        setFormData({ ...formData, language: response.data.slug });
        toast({
          title: "Language added",
          description: `"${response.data.name}" has been added successfully.`,
        });
      } else {
        throw new Error(response.message || 'Failed to create language');
      }
    } catch (error: any) {
      toast({
        title: "Failed to add language",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setNewLanguageName("");
      setShowAddLanguageDialog(false);
    }
  };

  const handleDeleteClick = (course: any) => {
    setDeletingCourse(course);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCourse) return;

    setDeleting(true);
    try {
      const response = await apiService.deleteCourse(deletingCourse.id);

      if (!response.success) {
        throw new Error(response.error || response.message || "Failed to delete course");
      }

      toast({
        title: "Course deleted",
        description: "The course has been deleted successfully.",
      });
      setShowDeleteDialog(false);
      setDeletingCourse(null);
      refetch();
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error instanceof Error ? error.message : "We couldn't delete the course. Try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await apiService.getCourseStats();
        if (!response.success || !response.data) throw new Error(response.error || "Failed to load stats");
        setStats(response.data as any);
      } catch (error) {
        toast({
          title: "Could not load stats",
          description: error instanceof Error ? error.message : "Please check your connection.",
          variant: "destructive",
        });
      }
    };
    loadStats();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900">
      <header className="bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            >
              ← Home
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Courses Admin
            </h1>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogDescription>
                  Fill in the course details below. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-black/40 border-white/10 text-white"
                    placeholder="e.g., Python Fundamentals"
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
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Language *</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(language) => {
                        if (language === "__add_new_language__") {
                          setShowAddLanguageDialog(true);
                        } else {
                          setFormData({ ...formData, language });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-black/40 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {languages.map((lang) => (
                          <SelectItem key={lang.id} value={lang.slug}>
                            {lang.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="__add_new_language__" className="text-cyan-400 font-semibold border-t border-white/10 mt-1 pt-1">
                          + Add New Language
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(difficulty) => setFormData({ ...formData, difficulty })}
                    >
                      <SelectTrigger className="bg-black/40 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(category) => {
                        if (category === "__add_new_category__") {
                          setShowAddCategoryDialog(true);
                        } else {
                          setFormData({ ...formData, category });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-black/40 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="__add_new_category__" className="text-cyan-400 font-semibold border-t border-white/10 mt-1 pt-1">
                          + Add New Category
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimatedDuration">Estimated duration</Label>
                    <Input
                      id="estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={(e) =>
                        setFormData({ ...formData, estimatedDuration: e.target.value })
                      }
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="e.g., 12 hours"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalLessons">Total lessons</Label>
                    <Input
                      id="totalLessons"
                      type="number"
                      value={formData.totalLessons}
                      onChange={(e) => setFormData({ ...formData, totalLessons: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="e.g., 24"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (0 for free)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="e.g., 49.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Thumbnail image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="bg-black/40 border-white/10 text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button variant="outline" type="button" asChild>
                        <label className="cursor-pointer flex items-center gap-1 px-3 py-2">
                          <Upload className="w-4 h-4" />
                          <input type="file" className="hidden" accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files?.[0] || null)} />
                        </label>
                      </Button>
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      Enter a direct image URL or upload an image.
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="bg-black/40 border-white/10 text-white"
                    placeholder="Python, Backend, Beginner"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isPublished: Boolean(checked) })
                      }
                    />
                    <Label htmlFor="isPublished">Published</Label>
                  </div>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save course"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Course Dialog */}
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Edit Course</DialogTitle>
                <DialogDescription>
                  Update the course details below. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-black/40 border-white/10 text-white"
                    placeholder="e.g., Python Fundamentals"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-black/40 border-white/10 text-white"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Language *</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(language) => {
                        if (language === "__add_new_language__") {
                          setShowAddLanguageDialog(true);
                        } else {
                          setFormData({ ...formData, language });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-black/40 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {languages.map((lang) => (
                          <SelectItem key={lang.id} value={lang.slug}>
                            {lang.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="__add_new_language__" className="text-cyan-400 font-semibold border-t border-white/10 mt-1 pt-1">
                          + Add New Language
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(difficulty) => setFormData({ ...formData, difficulty })}
                    >
                      <SelectTrigger className="bg-black/40 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(category) => {
                        if (category === "__add_new_category__") {
                          setShowAddCategoryDialog(true);
                        } else {
                          setFormData({ ...formData, category });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-black/40 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="__add_new_category__" className="text-cyan-400 font-semibold border-t border-white/10 mt-1 pt-1">
                          + Add New Category
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-estimatedDuration">Estimated duration</Label>
                    <Input
                      id="edit-estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={(e) =>
                        setFormData({ ...formData, estimatedDuration: e.target.value })
                      }
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="e.g., 12 hours"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-totalLessons">Total lessons</Label>
                    <Input
                      id="edit-totalLessons"
                      type="number"
                      value={formData.totalLessons}
                      onChange={(e) => setFormData({ ...formData, totalLessons: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="e.g., 24"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Price (0 for free)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="e.g., 49.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-imageUrl">Thumbnail image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="edit-imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="bg-black/40 border-white/10 text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button variant="outline" type="button" asChild>
                        <label className="cursor-pointer flex items-center gap-1 px-3 py-2">
                          <Upload className="w-4 h-4" />
                          <input type="file" className="hidden" accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files?.[0] || null)} />
                        </label>
                      </Button>
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      Enter a direct image URL or upload an image.
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                  <Input
                    id="edit-tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="bg-black/40 border-white/10 text-white"
                    placeholder="Python, Backend, Beginner"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="edit-isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isPublished: Boolean(checked) })
                      }
                    />
                    <Label htmlFor="edit-isPublished">Published</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingCourse(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Update Course
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent className="bg-slate-950 border-white/10 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Course</AlertDialogTitle>
                <AlertDialogDescription className="text-white/70">
                  Are you sure you want to delete "{deletingCourse?.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Add Category Dialog */}
          <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
            <DialogContent className="bg-slate-950 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription className="text-white/70">
                  Enter the name of the new category.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="newCategory">Category Name</Label>
                  <Input
                    id="newCategory"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-black/40 border-white/10 text-white"
                    placeholder="e.g., Machine Learning"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewCategoryName("");
                      setShowAddCategoryDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                    Add Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Language Dialog */}
          <Dialog open={showAddLanguageDialog} onOpenChange={setShowAddLanguageDialog}>
            <DialogContent className="bg-slate-950 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Add New Language</DialogTitle>
                <DialogDescription className="text-white/70">
                  Enter the name of the new programming language.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="newLanguage">Language Name</Label>
                  <Input
                    id="newLanguage"
                    value={newLanguageName}
                    onChange={(e) => setNewLanguageName(e.target.value)}
                    className="bg-black/40 border-white/10 text-white"
                    placeholder="e.g., Dart"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLanguage();
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewLanguageName("");
                      setShowAddLanguageDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddLanguage} disabled={!newLanguageName.trim()}>
                    Add Language
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-black/50 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Total courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalCourses}</p>
            </CardContent>
          </Card>
          <Card className="bg-black/50 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-emerald-400" />
                Published
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{publishedCourses}</p>
            </CardContent>
          </Card>
          <Card className="bg-black/50 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {stats ? stats.totalEnrollments : "—"}
              </p>
              <p className="text-xs text-white/60 mt-1">
                Paid: {stats ? stats.paidEnrollments : "—"}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-black/50 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {stats ? `₹${(stats.revenue || 0).toLocaleString()}` : "—"}
              </p>
              <p className="text-xs text-white/60 mt-1">Paid enrollments total</p>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Current courses
          </h2>

          {isLoading && (
            <div className="flex items-center justify-center py-12 text-white/80">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Loading courses...
            </div>
          )}

          {isError && !isLoading && (
            <p className="text-red-400 text-sm">
              Failed to load courses. Check your backend or Supabase connection.
            </p>
          )}

          {!isLoading && courses && courses.length === 0 && (
            <p className="text-sm text-white/70">No courses found. Add your first course above.</p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(courses || []).map((course: any) => (
              <Card
                key={course.id}
                className="bg-black/50 border-white/10 text-white overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-900/50 to-purple-900/50">
                  {course.image_url && course.image_url.startsWith('http') ? (
                    <>
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Hide broken image and show placeholder
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = target.parentElement?.querySelector('.image-placeholder') as HTMLElement;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div className="image-placeholder hidden w-full h-full items-center justify-center absolute inset-0">
                        <div className="text-center">
                          <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-2" />
                          <p className="text-xs text-white/40">Image failed to load</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-2" />
                        <p className="text-xs text-white/40">No Image</p>
                        <p className="text-xs text-white/30 mt-1">Add image URL</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {course.is_published ? (
                      <Badge className="bg-emerald-500/90 text-white border-0">
                        Live
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/20 border-yellow-400/60 text-yellow-300">
                        Draft
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      onClick={() => handleEdit(course)}
                    >
                      <Edit className="w-4 h-4 text-gray-900" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600"
                      onClick={() => handleDeleteClick(course)}
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold line-clamp-2 mb-2">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-white/70 line-clamp-2 min-h-[2.5rem]">
                    {course.description || "No description provided"}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {course.category && (
                      <Badge variant="outline" className="border-cyan-400/50 text-cyan-300 bg-cyan-500/10">
                        {course.category}
                      </Badge>
                    )}
                    <Badge variant="outline" className="border-indigo-400/50 text-indigo-300 bg-indigo-500/10">
                      {course.language}
                    </Badge>
                    {course.difficulty && (
                      <Badge variant="outline" className="border-purple-400/50 text-purple-300 bg-purple-500/10">
                        {course.difficulty}
                      </Badge>
                    )}
                    {Array.isArray(course.tags) && course.tags.length > 0 && (
                      course.tags.slice(0, 2).map((tag: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="border-white/20 text-white/70 text-xs">
                          {tag}
                        </Badge>
                      ))
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex items-center gap-4 text-xs text-white/60 pt-2 border-t border-white/10">
                    {course.estimated_duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.estimated_duration}</span>
                      </div>
                    )}
                    {course.total_lessons > 0 && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{course.total_lessons} lessons</span>
                      </div>
                    )}
                    {course.price !== undefined && course.price > 0 && (
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="font-semibold text-white">₹{course.price}</span>
                      </div>
                    )}
                    {(!course.price || course.price === 0) && (
                      <div className="ml-auto">
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/40 text-xs">
                          Free
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/admin/courses/${course.id}/content`)}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Manage Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminCourses;



