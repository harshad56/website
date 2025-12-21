import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/ApiService";
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  BookOpen,
  FileText,
  Video,
  Download,
  Award,
  Loader2
} from "lucide-react";
import SEO from "@/components/SEO";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Determine where to go back to based on referrer or default to /courses
  const getBackPath = () => {
    // Check if we came from a specific page via location state
    if (location.state?.from) return location.state.from;
    
    // Check referrer
    const referrer = document.referrer;
    if (referrer.includes('/courses')) return '/courses';
    if (referrer.includes('/real-projects')) return '/real-projects';
    if (referrer.includes('/projects')) return '/courses';
    
    // Default to courses page
    return '/courses';
  };
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);

  useEffect(() => {
    loadCourse();
    if (isAuthenticated && user) {
      checkEnrollment();
    }
  }, [courseId, isAuthenticated, user]);

  const loadCourse = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getCourse(courseId!);
      if (response.success && response.data) {
        setCourse(response.data);
        // Load modules and lessons
        if (response.data.modules) {
          setModules(response.data.modules);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
      navigate(getBackPath());
    } finally {
      setIsLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await apiService.checkEnrollment(courseId!);
      if (response.success && response.data) {
        setIsEnrolled(true);
        setEnrollment(response.data);
      }
    } catch (error) {
      // Not enrolled
      setIsEnrolled(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to enroll in this course",
        variant: "destructive",
      });
      navigate("/sign-in", { state: { returnTo: `/course/${courseId}` } });
      return;
    }

    setIsEnrolling(true);
    try {
      // Paid course: use Razorpay Checkout instead of direct enroll
      if (course && course.price && course.price > 0) {
        const checkoutResponse = await apiService.createCourseCheckoutSession(courseId!);

        if (!checkoutResponse.success || !(checkoutResponse.data as any)) {
          throw new Error(
            checkoutResponse.message || checkoutResponse.error || "Failed to start payment"
          );
        }

        const data = checkoutResponse.data as any;

        if (!data.razorpayOrderId || !data.keyId) {
          throw new Error("Payment gateway is not configured correctly.");
        }

        const options: any = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency || "INR",
          name: data.course?.title || course.title,
          description: data.course?.description || course.description,
          order_id: data.razorpayOrderId,
          prefill: {
            email: user?.email,
            name: user?.name,
          },
          theme: {
            color: "#4f46e5",
          },
          handler: async function (response: any) {
            try {
              // Verify payment on backend and create enrollment
              const verifyRes = await apiService.verifyCoursePayment(courseId!, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (!verifyRes.success) {
                throw new Error(
                  verifyRes.message || verifyRes.error || "Payment verification failed"
                );
              }

              toast({
                title: "Payment successful",
                description: "You have been enrolled in this course.",
              });

              // Update local enrollment state and navigate to learning page
              setIsEnrolled(true);
              setEnrollment(verifyRes.data);
              navigate(`/learn/${courseId}`);
            } catch (err: any) {
              toast({
                title: "Payment verification failed",
                description: err?.message || "Please contact support with your payment details.",
                variant: "destructive",
              });
            }
          },
          modal: {
            ondismiss: function () {
              toast({
                title: "Payment cancelled",
                description: "You can try again anytime.",
              });
            },
          },
        };

        if (!window.Razorpay) {
          throw new Error("Razorpay SDK not loaded. Please refresh the page and try again.");
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // Free course: enroll directly
      const response = await apiService.enrollInCourse(courseId!);

      if (response.success) {
        setIsEnrolled(true);
        setEnrollment(response.data);
        toast({
          title: "Enrolled successfully!",
          description: "You now have access to this course content.",
        });
        // Navigate to course content
        navigate(`/learn/${courseId}`);
        return;
      }

      // Handle paid-course case (backend returns 402 + requiresPayment)
      if ((response as any).requiresPayment) {
        toast({
          title: "Payment required",
          description: "This is a paid course. Please purchase it to get access.",
          variant: "destructive",
        });
        return;
      }

      throw new Error(response.error || response.message || "Enrollment failed");
    } catch (error) {
      const status = (error as any)?.status;
      const data = (error as any)?.data;
      const message = (error as any)?.message as string | undefined;

      // Handle paid-course case robustly (by status, flag, or message text)
      if (
        status === 402 ||
        data?.requiresPayment ||
        (typeof message === "string" &&
          message.toLowerCase().includes("paid course"))
      ) {
        toast({
          title: "Payment required",
          description:
            data?.message ||
            message ||
            "This is a paid course. Please purchase it to get access.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Enrollment failed",
        description:
          error instanceof Error ? error.message : "Could not enroll in course",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
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
            <p className="text-center mb-4">Course not found</p>
            <Button onClick={() => navigate(getBackPath())}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0);
  const lessonsDurationMinutes = modules.reduce((acc, module) => {
    return acc + (module.lessons?.reduce((sum: number, lesson: any) => sum + (lesson.duration_minutes || 0), 0) || 0);
  }, 0);
  const courseDurationLabel = (() => {
    if (typeof course.estimated_duration === "number" && course.estimated_duration > 0) {
      const hours = Math.round(course.estimated_duration / 60);
      return hours >= 1 ? `${hours} hrs` : `${course.estimated_duration} min`;
    }
    if (course.estimatedDuration) return course.estimatedDuration;
    if (lessonsDurationMinutes > 0) {
      const hours = Math.round(lessonsDurationMinutes / 60);
      return hours >= 1 ? `${hours} hrs` : `${lessonsDurationMinutes} min`;
    }
    return "Self-paced";
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900">
      <SEO
        title={`${course.title} - Online Programming Course | CodeAcademy Pro`}
        description={course.description || `Learn ${course.title} with our comprehensive online course. Interactive lessons, hands-on projects, expert guidance, and certificate upon completion.`}
        keywords={`${course.title}, programming course, online course, coding course, learn ${course.title}, ${course.category || 'programming'} course, programming tutorial, coding tutorial`}
        image={course.thumbnail_url || `${window.location.origin}/og-course.jpg`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: course.description || `Learn ${course.title} with our comprehensive online course.`,
          provider: {
            '@type': 'Organization',
            name: 'CodeAcademy Pro',
            url: window.location.origin,
          },
          offers: {
            '@type': 'Offer',
            price: course.price || 0,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
          },
          url: `${window.location.origin}/course/${course.id}`,
          image: course.thumbnail_url || `${window.location.origin}/og-course.jpg`,
        }}
      />
      
      {/* Header */}
      <div className="bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <button 
            onClick={() => navigate(getBackPath())}
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-white/70 text-lg mb-4">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>4.8 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>1,234 Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{courseDurationLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{totalLessons} Lessons</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {course.category && (
                  <Badge className="bg-cyan-500/20 text-cyan-200 border-cyan-400/40">
                    {course.category}
                  </Badge>
                )}
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400/40">
                  {course.language}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/40">
                  {course.difficulty}
                </Badge>
                {course.tags && Array.isArray(course.tags) && course.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="border-white/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Course Content */}
            {isEnrolled ? (
              <Card className="bg-black/50 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {modules.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                      <p className="text-white/60 mb-4">No content available yet</p>
                      <p className="text-sm text-white/40">The instructor is still adding content to this course.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {modules.map((module, moduleIndex) => (
                        <div key={module.id || moduleIndex} className="border border-white/10 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-3">{module.title}</h3>
                          {module.lessons && module.lessons.length > 0 ? (
                            <div className="space-y-2">
                              {module.lessons.map((lesson: any, lessonIndex: number) => (
                                <div
                                  key={lesson.id || lessonIndex}
                                  className="flex items-center justify-between p-3 bg-white/5 rounded hover:bg-white/10 transition"
                                >
                                  <div className="flex items-center gap-3">
                                    {lesson.lesson_type === 'video' ? (
                                      <Video className="w-5 h-5 text-indigo-400" />
                                    ) : (
                                      <FileText className="w-5 h-5 text-purple-400" />
                                    )}
                                    <div>
                                      <p className="text-sm font-medium">{lesson.title}</p>
                                      {lesson.duration_minutes > 0 && (
                                        <p className="text-xs text-white/50">
                                          {lesson.duration_minutes} min
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {lesson.is_preview && (
                                    <Badge variant="outline" className="text-xs">Preview</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-white/40">No lessons in this module yet</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-6">
                    <Button
                      onClick={() => navigate(`/learn/${courseId}`)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/50 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Master {course.language} programming fundamentals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Build real-world projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Get lifetime access to course materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Receive a certificate of completion</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-black/50 border-white/10 text-white sticky top-24">
              {course.image_url && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold">
                      {course.price === 0 || !course.price ? 'Free' : `₹${course.price}`}
                    </span>
                  </div>
                  {course.originalPrice > course.price && (
                    <span className="text-sm text-white/50 line-through">
                      ₹{course.originalPrice}
                    </span>
                  )}
                </div>

                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolling || isEnrolled}
                  className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 mb-4"
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enrolling...
                    </>
                  ) : isEnrolled ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Enrolled
                    </>
                  ) : (
                    <>
                      Enroll Now
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </>
                  )}
                </Button>

                {isEnrolled && (
                  <Button
                    onClick={() => navigate(`/learn/${courseId}`)}
                    variant="outline"
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Learning
                  </Button>
                )}

                <Separator className="my-4 bg-white/10" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Includes:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Downloadable resources</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

