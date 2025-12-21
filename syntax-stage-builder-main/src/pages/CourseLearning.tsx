import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/ApiService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock,
  FileText,
  Video,
  Download,
  BookOpen,
  Loader2,
  Lock,
  Award
} from "lucide-react";
import SEO from "@/components/SEO";

const CourseLearning = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in", { state: { returnTo: `/learn/${courseId}` } });
      return;
    }
    loadCourseContent();
  }, [courseId, isAuthenticated]);

  const loadCourseContent = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getCourseContent(courseId!);
      if (response.success && response.data) {
        setCourse(response.data.course);
        setModules(response.data.modules || []);
        setProgress(response.data.progress);
        
        // Select first lesson if available
        if (response.data.modules && response.data.modules.length > 0) {
          const firstModule = response.data.modules[0];
          if (firstModule.lessons && firstModule.lessons.length > 0) {
            setSelectedModule(firstModule);
            setSelectedLesson(firstModule.lessons[0]);
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load course content. You may need to enroll first.",
        variant: "destructive",
      });
      navigate(`/course/${courseId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId: string) => {
    try {
      const response = await apiService.completeLesson(lessonId);
      if (response.success) {
        toast({
          title: "Lesson completed!",
          description: "Great job! Keep learning.",
        });
        loadCourseContent(); // Refresh progress
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900 flex items-center justify-center">
        <Card className="bg-black/50 border-white/10 text-white">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Course not found or not enrolled</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedLessons = progress?.completedLessons || [];
  const totalLessons = progress?.totalLessons ?? modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const progressPercent = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;
  const isComplete = totalLessons > 0 && progressPercent >= 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900">
      <SEO title={`Learning: ${course.title}`} />
      
      {/* Header */}
      <motion.div
        className="bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-white hover:text-indigo-400"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </motion.div>
            <div className="h-6 w-px bg-white/20" />
            <motion.h1
              className="text-xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {course.title}
            </motion.h1>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              className="text-right"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-white/60">Progress</p>
              <p className="text-lg font-semibold text-white">
                {completedLessons.length} / {totalLessons}
              </p>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Progress value={progressPercent} className="w-32" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={isComplete ? "default" : "outline"}
                disabled={!isComplete}
                onClick={() => navigate(`/course/${courseId}/certificate`)}
                className={isComplete ? "bg-emerald-500 hover:bg-emerald-600" : "opacity-60"}
              >
                <Award className="w-4 h-4 mr-2" />
                {isComplete ? "Get Certificate" : "Finish lessons"}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Course Content */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="bg-black/50 border-white/10 text-white sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-lg">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {modules.map((module, moduleIndex) => (
                    <motion.div
                      key={module.id || moduleIndex}
                      className="border-b border-white/10 last:border-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + moduleIndex * 0.1, duration: 0.4 }}
                    >
                      <div className="p-3 font-semibold text-sm bg-white/5">
                        {module.title}
                      </div>
                      {module.lessons && module.lessons.length > 0 && (
                        <div className="space-y-1">
                          {module.lessons.map((lesson: any, lessonIndex: number) => {
                            const isCompleted = completedLessons.includes(lesson.id);
                            const isSelected = selectedLesson?.id === lesson.id;
                            
                            return (
                              <motion.button
                                key={lesson.id || lessonIndex}
                                onClick={() => {
                                  setSelectedModule(module);
                                  setSelectedLesson(lesson);
                                }}
                                className={`w-full text-left p-3 text-sm transition ${
                                  isSelected
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'hover:bg-white/5 text-white/70'
                                }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + lessonIndex * 0.05, duration: 0.3 }}
                                whileHover={{ x: 5, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center gap-2">
                                  {isCompleted ? (
                                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 border-2 border-white/30 rounded-full flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="truncate">{lesson.title}</p>
                                    {lesson.duration_minutes > 0 && (
                                      <p className="text-xs text-white/40">
                                        {lesson.duration_minutes} min
                                      </p>
                                    )}
                                  </div>
                                  {lesson.lesson_type === 'video' ? (
                                    <Video className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                  )}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {selectedLesson ? (
                <motion.div
                  key={selectedLesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-black/50 border-white/10 text-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{selectedLesson.title}</CardTitle>
                        {completedLessons.includes(selectedLesson.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Badge className="bg-green-500/20 text-green-300 border-green-400/40">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                      {selectedLesson.description && (
                        <p className="text-white/60 mt-2">{selectedLesson.description}</p>
                      )}
                    </CardHeader>
                <CardContent>
                  {selectedLesson.lesson_type === 'video' && selectedLesson.video ? (
                    <div className="space-y-4">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        {selectedLesson.video.video_provider === 'youtube' && selectedLesson.video.video_id ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${selectedLesson.video.video_id}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : selectedLesson.video.video_url ? (
                          <video
                            src={selectedLesson.video.video_url}
                            controls
                            className="w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <Video className="w-16 h-16 text-white/20 mx-auto mb-2" />
                              <p className="text-white/40">Video not available</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {selectedLesson.video.transcript && (
                        <div className="mt-4">
                          <h3 className="font-semibold mb-2">Transcript</h3>
                          <p className="text-white/70 text-sm whitespace-pre-wrap">
                            {selectedLesson.video.transcript}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : selectedLesson.lesson_type === 'document' && selectedLesson.documents ? (
                    <div className="space-y-4">
                      {selectedLesson.documents.map((doc: any) => (
                        <Card key={doc.id} className="bg-white/5 border-white/10">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-purple-400" />
                                <div>
                                  <p className="font-medium">{doc.title}</p>
                                  <p className="text-xs text-white/50">{doc.document_type.toUpperCase()}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(doc.document_url, '_blank')}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  {doc.download_allowed ? 'Download' : 'View'}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                      <p className="text-white/60">No content available for this lesson</p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Find previous lesson
                        const currentModuleIndex = modules.findIndex(m => m.id === selectedModule?.id);
                        const currentLessonIndex = selectedModule?.lessons?.findIndex((l: any) => l.id === selectedLesson.id) || 0;
                        
                        if (currentLessonIndex > 0) {
                          setSelectedLesson(selectedModule.lessons[currentLessonIndex - 1]);
                        } else if (currentModuleIndex > 0) {
                          const prevModule = modules[currentModuleIndex - 1];
                          if (prevModule.lessons && prevModule.lessons.length > 0) {
                            setSelectedModule(prevModule);
                            setSelectedLesson(prevModule.lessons[prevModule.lessons.length - 1]);
                          }
                        }
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    
                    {!completedLessons.includes(selectedLesson.id) && (
                      <Button
                        onClick={() => handleLessonComplete(selectedLesson.id)}
                        className="bg-gradient-to-r from-indigo-500 to-cyan-500"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Complete
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Find next lesson
                        const currentModuleIndex = modules.findIndex(m => m.id === selectedModule?.id);
                        const currentLessonIndex = selectedModule?.lessons?.findIndex((l: any) => l.id === selectedLesson.id) || 0;
                        
                        if (currentLessonIndex < (selectedModule?.lessons?.length || 0) - 1) {
                          setSelectedLesson(selectedModule.lessons[currentLessonIndex + 1]);
                        } else if (currentModuleIndex < modules.length - 1) {
                          const nextModule = modules[currentModuleIndex + 1];
                          if (nextModule.lessons && nextModule.lessons.length > 0) {
                            setSelectedModule(nextModule);
                            setSelectedLesson(nextModule.lessons[0]);
                          }
                        }
                      }}
                    >
                      Next
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-black/50 border-white/10 text-white">
                    <CardContent className="pt-6">
                      <div className="text-center py-12">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-white/60">Select a lesson to start learning</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;

