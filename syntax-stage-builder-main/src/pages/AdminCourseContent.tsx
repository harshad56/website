import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/ApiService";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Video, 
  FileText, 
  BookOpen,
  Loader2,
  ChevronDown,
  ChevronRight,
  Play,
  Download
} from "lucide-react";

const AdminCourseContent = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    order_index: 0,
  });

  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    lesson_type: "video",
    order_index: 0,
    duration_minutes: 0,
    is_preview: false,
  });

  const [videoForm, setVideoForm] = useState({
    video_url: "",
    video_provider: "youtube",
    video_id: "",
    thumbnail_url: "",
    transcript: "",
  });

  const [documentForm, setDocumentForm] = useState({
    title: "",
    document_url: "",
    document_type: "pdf",
    download_allowed: true,
  });
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  useEffect(() => {
    loadCourseContent();
  }, [courseId]);

  // Load full course content (modules + lessons) from backend
  const loadCourseContent = async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      // Use the dedicated content endpoint so we get modules + lessons
      const response = await apiService.getCourseContent(courseId);

      if (response.success && response.data) {
        const { course: courseData, modules: modulesData } = response.data as any;

        setCourse(courseData);

        if (modulesData && Array.isArray(modulesData)) {
          setModules(modulesData);
          // Expand all modules by default
          setExpandedModules(new Set(modulesData.map((m: any) => m.id)));
        } else {
          setModules([]);
          setExpandedModules(new Set());
        }
      } else {
        toast({
          title: "Error",
          description: response.error || response.message || "Failed to load course content",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load course content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveModule = async () => {
    if (!moduleForm.title) {
      toast({
        title: "Missing field",
        description: "Module title is required",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      let response;
      if (editingModule) {
        response = await apiService.updateModule(editingModule.id, moduleForm);
      } else {
        response = await apiService.createModule(courseId!, moduleForm);
      }

      if (response.success) {
        toast({
          title: editingModule ? "Module updated" : "Module created",
          description: editingModule
            ? "Module updated successfully"
            : "Module added successfully",
        });
        setShowModuleDialog(false);
        setEditingModule(null);
        setModuleForm({ title: "", description: "", order_index: 0 });
        loadCourseContent();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: editingModule ? "Failed to update module" : "Failed to create module",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditModule = (module: any) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title || "",
      description: module.description || "",
      order_index: module.order_index ?? 0,
    });
    setShowModuleDialog(true);
  };

  const handleDeleteModule = async (moduleId: string) => {
    setSubmitting(true);
    try {
      const response = await apiService.deleteModule(moduleId);
      if (response.success) {
        toast({
          title: "Module deleted",
          description: "Module removed successfully",
        });
        loadCourseContent();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete module",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLesson = async () => {
    if (!lessonForm.title || !selectedModuleId) {
      toast({
        title: "Missing fields",
        description: "Lesson title and module are required",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiService.createLesson(selectedModuleId, lessonForm);
      if (response.success) {
        toast({
          title: "Lesson created",
          description: "Lesson added successfully",
        });
        setShowLessonDialog(false);
        setLessonForm({
          title: "",
          description: "",
          lesson_type: "video",
          order_index: 0,
          duration_minutes: 0,
          is_preview: false,
        });
        setSelectedModuleId(null);
        loadCourseContent();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lesson",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddVideo = async () => {
    if (!videoForm.video_url && !videoForm.video_id) {
      toast({
        title: "Missing field",
        description: "Video URL or Video ID is required",
        variant: "destructive",
      });
      return;
    }

    if (!editingLesson) return;

    setSubmitting(true);
    try {
      const response = await apiService.addVideoToLesson(editingLesson.id, videoForm);
      if (response.success) {
        toast({
          title: "Video added",
          description: "Video added to lesson successfully",
        });
        setShowVideoDialog(false);
        setVideoForm({
          video_url: "",
          video_provider: "youtube",
          video_id: "",
          thumbnail_url: "",
          transcript: "",
        });
        setEditingLesson(null);
        loadCourseContent();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add video",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDocument = async () => {
    if (!editingLesson) return;

    setSubmitting(true);
    try {
      let payload = { ...documentForm };

      // If using file upload, upload file first and use returned URL
      if (useFileUpload) {
        if (!documentFile) {
          toast({
            title: "Missing file",
            description: "Please choose a file to upload",
            variant: "destructive",
          });
          return;
        }

        const uploadRes = await apiService.uploadFile(documentFile);
        if (!uploadRes.success || !(uploadRes.data as any)?.url) {
          throw new Error(uploadRes.message || uploadRes.error || "Failed to upload document");
        }

        payload.document_url = (uploadRes.data as any).url;
      } else {
        if (!documentForm.document_url) {
          toast({
            title: "Missing field",
            description: "Document URL is required",
            variant: "destructive",
          });
          return;
        }
      }

      const response = await apiService.addDocumentToLesson(editingLesson.id, payload);
      if (response.success) {
        toast({
          title: "Document added",
          description: "Document added to lesson successfully",
        });
        setShowDocumentDialog(false);
        setDocumentForm({
          title: "",
          document_url: "",
          document_type: "pdf",
          download_allowed: true,
        });
        setUseFileUpload(false);
        setDocumentFile(null);
        setEditingLesson(null);
        loadCourseContent();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add document",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/courses"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Courses
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-xl font-bold text-white">
                {course?.title || "Course Content"}
              </h1>
            </div>
            <Dialog
              open={showModuleDialog}
              onOpenChange={(open) => {
                setShowModuleDialog(open);
                if (!open) {
                  setEditingModule(null);
                  setModuleForm({ title: "", description: "", order_index: 0 });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Module
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-950 border-white/10 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingModule ? "Edit Module" : "Add Module"}</DialogTitle>
                  <DialogDescription>
                    {editingModule
                      ? "Update the details for this module"
                      : "Create a new module for this course"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Module Title *</Label>
                    <Input
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      placeholder="e.g., Introduction to Python"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                      className="bg-black/40 border-white/10 text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Order Index</Label>
                    <Input
                      type="number"
                      value={moduleForm.order_index}
                      onChange={(e) => setModuleForm({ ...moduleForm, order_index: parseInt(e.target.value) || 0 })}
                      className="bg-black/40 border-white/10 text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowModuleDialog(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveModule} disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {editingModule ? "Saving..." : "Creating..."}
                        </>
                      ) : (
                        editingModule ? "Save Module" : "Create Module"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-4">
          {modules.length === 0 ? (
            <Card className="bg-black/50 border-white/10 text-white">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 mb-4">No modules yet</p>
                  <p className="text-sm text-white/40 mb-6">
                    Start by creating your first module
                  </p>
                  <Button onClick={() => setShowModuleDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Module
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            modules.map((module, moduleIndex) => (
              <Card key={module.id || moduleIndex} className="bg-black/50 border-white/10 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="hover:text-indigo-400 transition"
                      >
                        {expandedModules.has(module.id) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {module.lessons?.length || 0} lessons
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedModuleId(module.id);
                          setShowLessonDialog(true);
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Lesson
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/70 hover:text-indigo-300 hover:bg-white/10"
                        onClick={() => handleEditModule(module)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-950 border-white/10 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete module?</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/70">
                              This will remove this module and all of its lessons and content.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDeleteModule(module.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                {expandedModules.has(module.id) && (
                  <CardContent>
                    {module.lessons && module.lessons.length > 0 ? (
                      <div className="space-y-2">
                        {module.lessons.map((lesson: any, lessonIndex: number) => (
                          <div
                            key={lesson.id || lessonIndex}
                            className="p-4 bg-white/5 rounded-lg border border-white/10"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {lesson.lesson_type === 'video' ? (
                                  <Video className="w-5 h-5 text-indigo-400" />
                                ) : (
                                  <FileText className="w-5 h-5 text-purple-400" />
                                )}
                                <div>
                                  <p className="font-medium">{lesson.title}</p>
                                  {lesson.duration_minutes > 0 && (
                                    <p className="text-xs text-white/50">
                                      {lesson.duration_minutes} minutes
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {lesson.lesson_type === 'video' && !lesson.video && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingLesson(lesson);
                                      setShowVideoDialog(true);
                                    }}
                                  >
                                    <Video className="w-3 h-3 mr-1" />
                                    Add Video
                                  </Button>
                                )}
                                {lesson.lesson_type === 'document' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingLesson(lesson);
                                      setShowDocumentDialog(true);
                                    }}
                                  >
                                    <FileText className="w-3 h-3 mr-1" />
                                    Add Document
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {/* Show existing content */}
                            {lesson.video && (
                              <div className="mt-2 p-2 bg-white/5 rounded text-sm">
                                <div className="flex items-center gap-2">
                                  <Video className="w-4 h-4 text-indigo-400" />
                                  <span>Video: {lesson.video.video_provider}</span>
                                  {lesson.video.video_id && (
                                    <Badge variant="outline" className="text-xs">
                                      {lesson.video.video_id}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {lesson.documents && lesson.documents.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {lesson.documents.map((doc: any) => (
                                  <div key={doc.id} className="p-2 bg-white/5 rounded text-sm flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-purple-400" />
                                    <span>{doc.title}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {doc.document_type}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-white/40 text-center py-4">
                        No lessons in this module. Add your first lesson above.
                      </p>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Lesson Dialog */}
      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="bg-slate-950 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Lesson</DialogTitle>
            <DialogDescription>
              Create a new lesson for the selected module
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Lesson Title *</Label>
              <Input
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                className="bg-black/40 border-white/10 text-white"
                placeholder="e.g., Introduction to Variables"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                className="bg-black/40 border-white/10 text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Lesson Type *</Label>
                <Select
                  value={lessonForm.lesson_type}
                  onValueChange={(value) => setLessonForm({ ...lessonForm, lesson_type: value })}
                >
                  <SelectTrigger className="bg-black/40 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={lessonForm.duration_minutes}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: parseInt(e.target.value) || 0 })}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Order Index</Label>
                <Input
                  type="number"
                  value={lessonForm.order_index}
                  onChange={(e) => setLessonForm({ ...lessonForm, order_index: parseInt(e.target.value) || 0 })}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <input
                  type="checkbox"
                  id="is_preview"
                  checked={lessonForm.is_preview}
                  onChange={(e) => setLessonForm({ ...lessonForm, is_preview: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_preview">Free Preview</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowLessonDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLesson} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Lesson"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Video Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="bg-slate-950 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Video to Lesson</DialogTitle>
            <DialogDescription>
              Add a video to this lesson. Supports YouTube, Vimeo, or direct video URLs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Video Provider</Label>
              <Select
                value={videoForm.video_provider}
                onValueChange={(value) => setVideoForm({ ...videoForm, video_provider: value })}
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                  <SelectItem value="direct">Direct URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {videoForm.video_provider === 'youtube' && (
              <div>
                <Label>YouTube Video ID *</Label>
                <Input
                  value={videoForm.video_id}
                  onChange={(e) => setVideoForm({ ...videoForm, video_id: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                  placeholder="e.g., dQw4w9WgXcQ"
                />
                <p className="text-xs text-white/50 mt-1">
                  Extract from YouTube URL: youtube.com/watch?v=VIDEO_ID
                </p>
              </div>
            )}
            {videoForm.video_provider === 'vimeo' && (
              <div>
                <Label>Vimeo Video ID *</Label>
                <Input
                  value={videoForm.video_id}
                  onChange={(e) => setVideoForm({ ...videoForm, video_id: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                  placeholder="e.g., 123456789"
                />
              </div>
            )}
            {videoForm.video_provider === 'direct' && (
              <div>
                <Label>Video URL *</Label>
                <Input
                  type="url"
                  value={videoForm.video_url}
                  onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            )}
            <div>
              <Label>Thumbnail URL (optional)</Label>
              <Input
                type="url"
                value={videoForm.thumbnail_url}
                onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })}
                className="bg-black/40 border-white/10 text-white"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
            <div>
              <Label>Transcript (optional)</Label>
              <Textarea
                value={videoForm.transcript}
                onChange={(e) => setVideoForm({ ...videoForm, transcript: e.target.value })}
                className="bg-black/40 border-white/10 text-white"
                rows={4}
                placeholder="Video transcript or subtitles..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddVideo} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Video"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="bg-slate-950 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Document to Lesson</DialogTitle>
            <DialogDescription>
              Add a document (PDF, DOCX, etc.) to this lesson
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Document Title *</Label>
              <Input
                value={documentForm.title}
                onChange={(e) => setDocumentForm({ ...documentForm, title: e.target.value })}
                className="bg-black/40 border-white/10 text-white"
                placeholder="e.g., Course Notes PDF"
              />
            </div>
            <div>
              <Label>Document Type</Label>
              <Select
                value={documentForm.document_type}
                onValueChange={(value) => setDocumentForm({ ...documentForm, document_type: value })}
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="txt">TXT</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="use_file_upload"
                  type="checkbox"
                  checked={useFileUpload}
                  onChange={(e) => setUseFileUpload(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="use_file_upload">Upload file from computer</Label>
              </div>
              {useFileUpload ? (
                <div>
                  <Label>Choose File *</Label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setDocumentFile(file);
                    }}
                    className="bg-black/40 border-white/10 text-white"
                  />
                  {documentFile && (
                    <p className="text-xs text-white/60 mt-1">
                      Selected: {documentFile.name} ({Math.round(documentFile.size / 1024)} KB)
                    </p>
                  )}
                  <p className="text-xs text-white/50 mt-1">
                    Max size 20MB. Supported: PDF, DOC, DOCX, PPT, PPTX, TXT.
                  </p>
                </div>
              ) : (
                <div>
                  <Label>Document URL *</Label>
                  <Input
                    type="url"
                    value={documentForm.document_url}
                    onChange={(e) => setDocumentForm({ ...documentForm, document_url: e.target.value })}
                    className="bg-black/40 border-white/10 text-white"
                    placeholder="https://example.com/document.pdf"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    Upload your document to a file hosting service and paste the URL here
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="download_allowed"
                checked={documentForm.download_allowed}
                onChange={(e) => setDocumentForm({ ...documentForm, download_allowed: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="download_allowed">Allow Download</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDocumentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDocument} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Document"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseContent;


