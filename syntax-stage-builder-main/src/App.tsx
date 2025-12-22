import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { RouteSkeleton } from '@/components/RouteSkeleton';

// Lazy load React Query DevTools (only in development)
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() => import('@tanstack/react-query-devtools').then((mod) => ({ default: mod.ReactQueryDevtools })))
  : () => null;

// Homepage - load immediately (not lazy) for fastest initial load
import Index from '@/pages/Index';
const NotFound = lazy(() => import('@/pages/NotFound'));
const PythonLearning = lazy(() => import('@/pages/PythonLearning'));
const JavaScriptLearning = lazy(() => import('@/pages/JavaScriptLearning'));
const JavaLearning = lazy(() => import('@/pages/JavaLearning'));
const CPPLearning = lazy(() => import('@/pages/CPPLearning'));
const CSharpLearning = lazy(() => import('@/pages/CSharpLearning'));
const GoLearning = lazy(() => import('@/pages/GoLearning'));
const RustLearning = lazy(() => import('@/pages/RustLearning'));
const TypeScriptLearning = lazy(() => import('@/pages/TypeScriptLearning'));
const SwiftLearning = lazy(() => import('@/pages/SwiftLearning'));
const KotlinLearning = lazy(() => import('@/pages/KotlinLearning'));
const PHPLearning = lazy(() => import('@/pages/PHPLearning'));
const RubyLearning = lazy(() => import('@/pages/RubyLearning'));
const CLearning = lazy(() => import('@/pages/CLearning'));
const ScalaLearning = lazy(() => import('@/pages/ScalaLearning'));
const DartLearning = lazy(() => import('@/pages/DartLearning'));
const RLearning = lazy(() => import('@/pages/RLearning'));
const PerlLearning = lazy(() => import('@/pages/PerlLearning'));
const HaskellLearning = lazy(() => import('@/pages/HaskellLearning'));
const AssemblyLearning = lazy(() => import('@/pages/AssemblyLearning'));
const MatlabLearning = lazy(() => import('@/pages/MatlabLearning'));
const PythonTopicPage = lazy(() => import('@/pages/PythonTopicPage'));
const JavaScriptTopicPage = lazy(() => import('@/pages/JavaScriptTopicPage'));
const JavaTopicPage = lazy(() => import('@/pages/JavaTopicPage'));
const CPPTopicPage = lazy(() => import('@/pages/CPPTopicPage'));
const CSharpTopicPage = lazy(() => import('@/pages/CSharpTopicPage'));
const GoTopicPage = lazy(() => import('@/pages/GoTopicPage'));
const RustTopicPage = lazy(() => import('@/pages/RustTopicPage'));
const TypeScriptTopicPage = lazy(() => import('@/pages/TypeScriptTopicPage'));
const SwiftTopicPage = lazy(() => import('@/pages/SwiftTopicPage'));
const KotlinTopicPage = lazy(() => import('@/pages/KotlinTopicPage'));
const PHPTopicPage = lazy(() => import('@/pages/PHPTopicPage'));
const RubyTopicPage = lazy(() => import('@/pages/RubyTopicPage'));
const CTopicPage = lazy(() => import('@/pages/CTopicPage'));
const ScalaTopicPage = lazy(() => import('@/pages/ScalaTopicPage'));
const DartTopicPage = lazy(() => import('@/pages/DartTopicPage'));
const RTopicPage = lazy(() => import('@/pages/RTopicPage'));
const PerlTopicPage = lazy(() => import('@/pages/PerlTopicPage'));
const HaskellTopicPage = lazy(() => import('@/pages/HaskellTopicPage'));
const AssemblyTopicPage = lazy(() => import('@/pages/AssemblyTopicPage'));
const MatlabTopicPage = lazy(() => import('@/pages/MatlabTopicPage'));
const CodingChallenges = lazy(() => import('@/pages/CodingChallenges'));
const StudyGroups = lazy(() => import('@/pages/StudyGroups'));
const AITutor = lazy(() => import('@/pages/AITutor'));
const MentorshipProgram = lazy(() => import('@/pages/MentorshipProgram'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const Contact = lazy(() => import('@/pages/Contact'));
const UserDashboard = lazy(() => import('@/pages/UserDashboard'));
const Certification = lazy(() => import('@/pages/Certification'));
const ProgressTracking = lazy(() => import('@/pages/ProgressTracking'));
const JobBoard = lazy(() => import('@/pages/JobBoard'));
const JobDetail = lazy(() => import('@/pages/JobDetail'));
const CourseCatalog = lazy(() => import('@/pages/CourseCatalog'));
const CourseDetail = lazy(() => import('@/pages/CourseDetail'));
const CourseLearning = lazy(() => import('@/pages/CourseLearning'));
const LearningPathsPage = lazy(() => import('@/pages/LearningPathsPage'));
const CareerServices = lazy(() => import('@/pages/CareerServices'));
const BlogResources = lazy(() => import('@/pages/BlogResources'));
const SuccessStoryDetails = lazy(() => import('@/pages/SuccessStoryDetails'));
const MobileApp = lazy(() => import('@/pages/MobileApp'));
const SignIn = lazy(() => import('@/pages/SignIn'));
const RealProjects = lazy(() => import('@/pages/RealProjects'));
const ProjectStore = lazy(() => import('@/pages/ProjectStore'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const AdminProjects = lazy(() => import('@/pages/AdminProjects'));
const AdminStudyMaterials = lazy(() => import('@/pages/AdminStudyMaterials'));
const AdminJobs = lazy(() => import('@/pages/AdminJobs'));
const AdminCourses = lazy(() => import('@/pages/AdminCourses'));
const AdminCourseContent = lazy(() => import('@/pages/AdminCourseContent'));
const AdminLanguageInterview = lazy(() => import('@/pages/AdminLanguageInterview'));
const StudyMaterials = lazy(() => import('@/pages/StudyMaterials'));
const StudyMaterialDetail = lazy(() => import('@/pages/StudyMaterialDetail'));
const InteractiveTutorials = lazy(() => import('@/pages/InteractiveTutorials'));
const ProjectLibrary = lazy(() => import('@/pages/ProjectLibrary'));
const CodePlayground = lazy(() => import('@/pages/CodePlayground'));
const AlgorithmChallenges = lazy(() => import('@/pages/AlgorithmChallenges'));
const InterviewPrep = lazy(() => import('@/pages/InterviewPrep'));
const CodeReviews = lazy(() => import('@/pages/CodeReviews'));
const SuccessStories = lazy(() => import('@/pages/SuccessStories'));
const ResumeBuilder = lazy(() => import('@/pages/ResumeBuilder'));
const InterviewPractice = lazy(() => import('@/pages/InterviewPractice'));
const LanguageInterviewPage = lazy(() => import('@/pages/LanguageInterviewPage'));
const SalaryGuide = lazy(() => import('@/pages/SalaryGuide'));
const Careers = lazy(() => import('@/pages/Careers'));
const Press = lazy(() => import('@/pages/Press'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const CodeOfConduct = lazy(() => import('@/pages/CodeOfConduct'));
const Settings = lazy(() => import('@/pages/Settings'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const CourseCertificate = lazy(() => import('@/pages/CourseCertificate'));
import AdminRoute from '@/components/AdminRoute';

// Route-aware loading screen that shows appropriate skeleton based on route
const LoadingScreen = () => <RouteSkeleton />;

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Homepage - highest priority */}
              <Route path="/" element={<Index />} />

              <Route path="/python-learning" element={<PythonLearning />} />
              <Route path="/python-learning/topic/:moduleId/:topicId" element={<PythonTopicPage />} />
              <Route path="/python-learning/:topicId" element={<PythonTopicPage />} />

              <Route path="/javascript-learning" element={<JavaScriptLearning />} />
              <Route path="/javascript-learning/topic/:moduleId/:topicId" element={<JavaScriptTopicPage />} />
              <Route path="/javascript-learning/:topicId" element={<JavaScriptTopicPage />} />

              <Route path="/real-projects" element={<RealProjects />} />

              <Route path="/projects" element={<ProjectStore />} />
              <Route path="/project/:projectId" element={<ProjectDetail />} />
              <Route
                path="/admin/projects"
                element={
                  <AdminRoute>
                    <AdminProjects />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/study-materials"
                element={
                  <AdminRoute>
                    <AdminStudyMaterials />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/jobs"
                element={
                  <AdminRoute>
                    <AdminJobs />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <AdminRoute>
                    <AdminCourses />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/courses/:courseId/content"
                element={
                  <AdminRoute>
                    <AdminCourseContent />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/languages"
                element={
                  <AdminRoute>
                    <AdminLanguageInterview />
                  </AdminRoute>
                }
              />
              <Route path="/study-materials" element={<StudyMaterials />} />
              <Route path="/study-material/:materialId" element={<StudyMaterialDetail />} />

              <Route path="/java-learning" element={<JavaLearning />} />
              <Route path="/java-learning/topic/:moduleId/:topicId" element={<JavaTopicPage />} />
              <Route path="/java-learning/:topicId" element={<JavaTopicPage />} />

              <Route path="/cpp-learning" element={<CPPLearning />} />
              <Route path="/cpp-learning/topic/:moduleId/:topicId" element={<CPPTopicPage />} />
              <Route path="/cpp-learning/:topicId" element={<CPPTopicPage />} />

              <Route path="/csharp-learning" element={<CSharpLearning />} />
              <Route path="/csharp-learning/topic/:moduleId/:topicId" element={<CSharpTopicPage />} />
              <Route path="/csharp-learning/:topicId" element={<CSharpTopicPage />} />

              <Route path="/go-learning" element={<GoLearning />} />
              <Route path="/go-learning/topic/:moduleId/:topicId" element={<GoTopicPage />} />
              <Route path="/go-learning/:topicId" element={<GoTopicPage />} />

              <Route path="/rust-learning" element={<RustLearning />} />
              <Route path="/rust-learning/topic/:moduleId/:topicId" element={<RustTopicPage />} />
              <Route path="/rust-learning/:topicId" element={<RustTopicPage />} />

              <Route path="/typescript-learning" element={<TypeScriptLearning />} />
              <Route path="/typescript-learning/topic/:moduleId/:topicId" element={<TypeScriptTopicPage />} />
              <Route path="/typescript-learning/:topicId" element={<TypeScriptTopicPage />} />

              <Route path="/swift-learning" element={<SwiftLearning />} />
              <Route path="/swift-learning/topic/:moduleId/:topicId" element={<SwiftTopicPage />} />
              <Route path="/swift-learning/:topicId" element={<SwiftTopicPage />} />

              <Route path="/kotlin-learning" element={<KotlinLearning />} />
              <Route path="/kotlin-learning/topic/:moduleId/:topicId" element={<KotlinTopicPage />} />
              <Route path="/kotlin-learning/:topicId" element={<KotlinTopicPage />} />

              <Route path="/php-learning" element={<PHPLearning />} />
              <Route path="/php-learning/topic/:moduleId/:topicId" element={<PHPTopicPage />} />
              <Route path="/php-learning/:topicId" element={<PHPTopicPage />} />

              <Route path="/ruby-learning" element={<RubyLearning />} />
              <Route path="/ruby-learning/topic/:moduleId/:topicId" element={<RubyTopicPage />} />
              <Route path="/ruby-learning/:topicId" element={<RubyTopicPage />} />

              <Route path="/c-learning" element={<CLearning />} />
              <Route path="/c-learning/topic/:moduleId/:topicId" element={<CTopicPage />} />
              <Route path="/c-learning/:topicId" element={<CTopicPage />} />

              <Route path="/scala-learning" element={<ScalaLearning />} />
              <Route path="/scala-learning/topic/:moduleId/:topicId" element={<ScalaTopicPage />} />
              <Route path="/scala-learning/:topicId" element={<ScalaTopicPage />} />

              <Route path="/dart-learning" element={<DartLearning />} />
              <Route path="/dart-learning/topic/:moduleId/:topicId" element={<DartTopicPage />} />
              <Route path="/dart-learning/:topicId" element={<DartTopicPage />} />

              <Route path="/r-learning" element={<RLearning />} />
              <Route path="/r-learning/topic/:moduleId/:topicId" element={<RTopicPage />} />
              <Route path="/r-learning/:topicId" element={<RTopicPage />} />

              <Route path="/perl-learning" element={<PerlLearning />} />
              <Route path="/perl-learning/topic/:moduleId/:topicId" element={<PerlTopicPage />} />
              <Route path="/perl-learning/:topicId" element={<PerlTopicPage />} />

              <Route path="/haskell-learning" element={<HaskellLearning />} />
              <Route path="/haskell-learning/topic/:moduleId/:topicId" element={<HaskellTopicPage />} />
              <Route path="/haskell-learning/:topicId" element={<HaskellTopicPage />} />

              <Route path="/assembly-learning" element={<AssemblyLearning />} />
              <Route path="/assembly-learning/topic/:moduleId/:topicId" element={<AssemblyTopicPage />} />
              <Route path="/assembly-learning/:topicId" element={<AssemblyTopicPage />} />

              <Route path="/matlab-learning" element={<MatlabLearning />} />
              <Route path="/matlab-learning/topic/:moduleId/:topicId" element={<MatlabTopicPage />} />
              <Route path="/matlab-learning/:topicId" element={<MatlabTopicPage />} />

              <Route path="/challenges" element={<CodingChallenges />} />
              <Route path="/interactive-tutorials" element={<InteractiveTutorials />} />
              <Route path="/project-library" element={<ProjectLibrary />} />
              <Route path="/code-playground" element={<CodePlayground />} />
              <Route path="/algorithm-challenges" element={<AlgorithmChallenges />} />
              <Route path="/interview-prep" element={<InterviewPrep />} />
              <Route path="/code-reviews" element={<CodeReviews />} />
              <Route path="/study-groups" element={<StudyGroups />} />
              <Route path="/ai-tutor" element={<AITutor />} />
              <Route path="/mentorship" element={<MentorshipProgram />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/certification" element={<Certification />} />
              <Route path="/progress" element={<ProgressTracking />} />
              <Route path="/jobs" element={<JobBoard />} />
              <Route path="/jobs/:jobId" element={<JobDetail />} />
              <Route path="/courses" element={<CourseCatalog />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/course/:courseId/certificate" element={<CourseCertificate />} />
              <Route path="/learn/:courseId" element={<CourseLearning />} />
              <Route path="/learning-paths" element={<LearningPathsPage />} />
              <Route path="/career" element={<CareerServices />} />
              <Route path="/interview-practice" element={<InterviewPractice />} />
              <Route path="/interview-practice/languages/:slug" element={<LanguageInterviewPage />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/salary-guide" element={<SalaryGuide />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              <Route path="/blog" element={<BlogResources />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/success-story/:id" element={<SuccessStoryDetails />} />
              <Route path="/mobile-app" element={<MobileApp />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/code-of-conduct" element={<CodeOfConduct />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
          <Toaster position="top-right" />
          {import.meta.env.DEV && (
            <Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
          )}
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
