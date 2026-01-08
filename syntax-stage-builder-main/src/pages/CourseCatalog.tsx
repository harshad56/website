import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/BackButton";
import SEO from "@/components/SEO";
import { useCourses, useMyCourses } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/ApiService";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
  Code,
  Database,
  Smartphone,
  Gamepad2,
  Cloud,
  Brain,
  Target,
  TrendingUp,
  Award,
  ArrowRight,
  Heart,
  Share2,
  Eye,
  Calendar,
  MapPin,
  DollarSign
} from "lucide-react";

const CourseCatalog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [dbCategories, setDbCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [dbLanguages, setDbLanguages] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [languageSearchQuery, setLanguageSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");

  const { data: coursesData, isLoading, isError } = useCourses();
  const { data: myCoursesData, isLoading: isLoadingMyCourses } = useMyCourses();

  // Fetch categories and languages from database on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [categoriesRes, languagesRes] = await Promise.all([
          apiService.getCourseCategories(),
          apiService.getCourseLanguages()
        ]);
        if (categoriesRes.success && categoriesRes.data) {
          setDbCategories(categoriesRes.data);
        }
        if (languagesRes.success && languagesRes.data) {
          setDbLanguages(languagesRes.data);
        }
      } catch (error: any) {
        // Silently handle rate limit errors - use fallback data
        if (error.message && error.message.includes('Too many requests')) {
          console.warn('Rate limit reached for metadata, using fallback data...');
        } else {
          console.error('Failed to fetch metadata:', error);
        }
        // Fallback to default categories if API fails
        setDbCategories([
          { id: '1', name: 'General', slug: 'general' },
          { id: '2', name: 'Theme', slug: 'theme' },
          { id: '3', name: 'Web Development', slug: 'web-development' },
          { id: '4', name: 'Frontend', slug: 'frontend' },
          { id: '5', name: 'Backend', slug: 'backend' },
          { id: '6', name: 'Full Stack', slug: 'fullstack' },
          { id: '7', name: 'Data & AI', slug: 'data' },
          { id: '8', name: 'Cloud Computing', slug: 'cloud-computing' },
          { id: '9', name: 'DevOps/Cloud', slug: 'devops' },
          { id: '10', name: 'Mobile', slug: 'mobile' }
        ]);
        setDbLanguages([
          { id: '1', name: 'Python', slug: 'python' },
          { id: '2', name: 'JavaScript', slug: 'javascript' },
          { id: '3', name: 'Java', slug: 'java' },
          { id: '4', name: 'C#', slug: 'csharp' },
          { id: '5', name: 'Go', slug: 'go' },
          { id: '6', name: 'Rust', slug: 'rust' }
        ]);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch wishlist on mount
  useEffect(() => {
    if (user) {
      const fetchWishlist = async () => {
        try {
          const response = await apiService.getWishlist();
          if (response.success && response.data) {
            const courseWishlistIds = response.data.map((item: any) => item.course_id);
            setLikedIds(new Set(courseWishlistIds));
          }
        } catch (error: any) {
          // Silently handle rate limit errors - don't show error to user
          if (error.message && error.message.includes('Too many requests')) {
            console.warn('Rate limit reached for wishlist, skipping...');
            return;
          }
          console.error('Failed to fetch wishlist:', error);
        }
      };
      fetchWishlist();
    }
  }, [user]);

  // Map database categories to catalog format with icons
  const getCategoryIcon = (slug: string) => {
    if (slug.includes('web') || slug.includes('frontend') || slug.includes('backend') || slug === 'fullstack') return Code;
    if (slug === 'data') return Brain;
    if (slug.includes('cloud') || slug === 'devops') return Cloud;
    if (slug === 'mobile') return Smartphone;
    return BookOpen;
  };

  const categories = useMemo(() => {
    const baseCategories = [
      { id: "all", name: "All Categories", icon: BookOpen, slug: "all" }
    ];
    const dbCategoriesWithIcons = dbCategories.map(cat => ({
      id: cat.slug,
      name: cat.name,
      icon: getCategoryIcon(cat.slug),
      slug: cat.slug
    }));
    return [...baseCategories, ...dbCategoriesWithIcons];
  }, [dbCategories]);

  const levels = [
    { id: "all", name: "All Levels" },
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
  ];

  const durations = [
    { id: "all", name: "Any Duration" },
    { id: "0-5", name: "0-5 hours" },
    { id: "5-10", name: "5-10 hours" },
    { id: "10-20", name: "10-20 hours" },
    { id: "20+", name: "20+ hours" },
  ];

  const courses = useMemo(() => {
    if (!coursesData) return [];
    // Map Supabase course rows into catalog view model
    return coursesData.map((course: any) => {
      // Use course.category directly if it exists
      const rawCategory = course.category || "general";
      const categorySlug = typeof rawCategory === 'string' ? rawCategory.toLowerCase().trim() : "general";

      // Check if category exists in database categories, otherwise use as-is or default to general
      const category = dbCategories.find(c => c.slug === categorySlug)
        ? categorySlug
        : (categories.find(c => c.id === categorySlug) ? categorySlug : "general");

      // Get language from course
      const courseLanguage = course.language || "";
      const languageSlug = typeof courseLanguage === 'string' ? courseLanguage.toLowerCase().trim() : "";

      // Duration parsing: accept numeric minutes, or strings like "20+ hours", "5 hours", "90 min"
      const durationMinutes = (() => {
        const raw = course.estimated_duration ?? course.estimatedDuration;
        if (typeof raw === "number" && !isNaN(raw)) return raw;
        if (typeof raw === "string") {
          const lower = raw.toLowerCase().trim();
          // Handle patterns
          const hoursMatch = lower.match(/(\d+(?:\.\d+)?)\s*\+?\s*hour/);
          const minsMatch = lower.match(/(\d+(?:\.\d+)?)\s*min/);
          if (hoursMatch) {
            const hrs = parseFloat(hoursMatch[1]);
            if (!isNaN(hrs)) return Math.round(hrs * 60);
          }
          if (minsMatch) {
            const mins = parseFloat(minsMatch[1]);
            if (!isNaN(mins)) return Math.round(mins);
          }
          // If plain number string, assume minutes
          const num = parseFloat(lower.replace('+', ''));
          if (!isNaN(num)) return num;
        }
        return null;
      })();
      const durationLabel = (() => {
        if (course.estimatedDuration) return course.estimatedDuration;
        if (durationMinutes && durationMinutes >= 60) {
          const hrs = durationMinutes / 60;
          return hrs >= 1 ? `${Math.round(hrs)} hrs` : `${durationMinutes} min`;
        }
        if (durationMinutes && durationMinutes < 60) return `${durationMinutes} min`;
        return "Self-paced";
      })();
      return {
        id: course.id,
        title: course.title,
        description: course.description || null, // Only show if admin added it
        category,
        language: languageSlug,
        level: course.difficulty || "beginner",
        duration: durationLabel,
        durationMinutes,
        students: course.students_count || 0,
        rating: course.rating || 4.8,
        reviews: course.reviews_count || 0,
        price: course.price || 0,
        originalPrice: course.original_price || course.price || 0,
        instructor: course.instructor || "CodeAcademy Pro Instructor",
        instructorAvatar:
          course.instructor_avatar ||
          "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=50&h=50&fit=crop&crop=face",
        image:
          course.image_url ||
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop",
        tags: (course.tags as string[]) || [course.language || "Programming"],
        features: ["Certificate", "Lifetime Access"],
        isBestseller: !!course.is_bestseller,
        isNew: !!course.is_new,
        lessonCount: course.lesson_count || 0,
        lessons: course.lessons || [],
      };
    });
  }, [coursesData, dbCategories, categories]);

  const myCourses = useMemo(() => {
    if (!myCoursesData) return [];
    // Map Supabase course rows into catalog view model
    return myCoursesData.map((course: any) => {
      // Reuse logic or simplify for My Courses view
      const rawCategory = course.category || "general";
      const categorySlug = typeof rawCategory === 'string' ? rawCategory.toLowerCase().trim() : "general";
      const category = dbCategories.find(c => c.slug === categorySlug)
        ? categorySlug
        : (categories.find(c => c.id === categorySlug) ? categorySlug : "general");

      const courseLanguage = course.language || "";
      const languageSlug = typeof courseLanguage === 'string' ? courseLanguage.toLowerCase().trim() : "";

      // Simplified duration logic or same as above
      const durationLabel = course.estimatedDuration || "Self-paced";

      return {
        id: course.id,
        title: course.title,
        description: course.description || null,
        category,
        language: languageSlug,
        level: course.difficulty || "beginner",
        duration: durationLabel,
        students: course.students_count || 0,
        rating: course.rating || 4.8,
        reviews: course.reviews_count || 0,
        price: course.price || 0,
        originalPrice: course.original_price || course.price || 0,
        instructor: course.instructor || "CodeAcademy Pro Instructor",
        instructorAvatar: course.instructor_avatar || "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=50&h=50&fit=crop&crop=face",
        image: course.image_url || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop",
        tags: (course.tags as string[]) || [course.language || "Programming"],
        features: ["Certificate", "Lifetime Access"],
        isBestseller: !!course.is_bestseller,
        isNew: !!course.is_new,
        lessonCount: course.lesson_count || 0,
        lessons: course.lessons || [],
      };
    });
  }, [myCoursesData, dbCategories, categories]);

  const filteredCourses = courses.filter(course => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" ||
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      (course.category?.toLowerCase() || "").includes(searchLower) ||
      (course.language?.toLowerCase() || "").includes(searchLower);
    // Category matching - compare slugs (case-insensitive)
    const matchesCategory = selectedCategory === "all" ||
      course.category?.toLowerCase() === selectedCategory?.toLowerCase() ||
      course.category === selectedCategory;

    // Language matching - compare slugs (case-insensitive)
    const matchesLanguage = selectedLanguage === "all" ||
      course.language?.toLowerCase() === selectedLanguage?.toLowerCase() ||
      course.language === selectedLanguage ||
      (!course.language && selectedLanguage === "all");
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    const matchesDuration = (() => {
      if (selectedDuration === "all") return true;
      const minutes = course.durationMinutes;
      // If duration is unknown and a specific filter is chosen, exclude
      if (minutes == null) return false;
      if (selectedDuration === "0-5") return minutes <= 300;
      if (selectedDuration === "5-10") return minutes > 300 && minutes <= 600;
      if (selectedDuration === "10-20") return minutes > 600 && minutes <= 1200;
      if (selectedDuration === "20+") return minutes > 1200;
      return true;
    })();
    const matchesPrice = !showFreeOnly || course.price === 0;

    return matchesSearch && matchesCategory && matchesLanguage && matchesLevel && matchesDuration && matchesPrice;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.students - a.students;
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return b.isNew ? 1 : -1;
      default:
        return 0;
    }
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Course Catalog - CodeAcademy Pro",
    "description": "Browse our complete catalog of programming courses. Learn web development, mobile development, data science, AI/ML, cloud computing, and more. Find the perfect course for your career goals.",
    "url": `${window.location.origin}/courses`,
    "numberOfItems": filteredCourses.length,
    "itemListElement": filteredCourses.slice(0, 10).map((course: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        },
        "url": `${window.location.origin}/course/${course.id}`,
        "offers": {
          "@type": "Offer",
          "price": course.price || 0,
          "priceCurrency": "INR"
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-930 to-slate-950 text-white">
      <SEO
        title="Course Catalog - Browse All Programming Courses | CodeAcademy Pro"
        description="Browse our complete catalog of programming courses. Learn web development, mobile development, data science, AI/ML, cloud computing, DevOps, and more. Interactive courses with hands-on projects, certificates, and expert guidance. Find the perfect course for your career goals."
        keywords="programming courses, coding courses, online courses, web development courses, data science courses, mobile development courses, AI courses, machine learning courses, cloud computing courses, DevOps courses, Python courses, JavaScript courses, React courses, Node.js courses, Java courses, tech courses, learn programming online"
        image={`${window.location.origin}/og-courses.jpg`}
        structuredData={structuredData}
      />
      {/* Hero */}
      <div className="border-b border-white/5 bg-gradient-to-r from-indigo-900/60 via-slate-950 to-violet-900/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-6">
            <BackButton label="Back to Home" className="bg-black/40 border-white/20 text-white" to="/" />
            <span className="hidden md:inline text-xs text-white/40">
              Browse courses and pick one to start learning.
            </span>
          </div>
          <div className="grid md:grid-cols-[2fr,1.2fr] gap-10 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-indigo-300 mb-4">
                <TrendingUp className="w-3 h-3" />
                Learn Faster. Build Real Skills.
              </p>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                Level up your{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                  programming skills
                </span>
                , one course at a time.
              </h1>
              <p className="text-base md:text-lg text-white/70 max-w-2xl">
                Curated courses designed to take you from absolute beginner to
                job‑ready developer. Learn by building real‑world projects with
                guidance from industry experts.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Certificates on completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-300" />
                  <span>Self‑paced, lifetime access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-300" />
                  <span>Community &amp; mentor support</span>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl shadow-indigo-900/40">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10">
                    <p className="text-xs text-white/60 mb-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Total Courses
                    </p>
                    <p className="text-xl font-semibold">
                      {courses.length.toString().padStart(2, "0")}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10">
                    <p className="text-xs text-white/60 mb-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" /> Avg. Rating
                    </p>
                    <p className="text-xl font-semibold">4.8</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10">
                    <p className="text-xs text-white/60 mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-300" /> Learners
                    </p>
                    <p className="text-xl font-semibold">
                      {(courses.reduce((sum, c) => sum + (c.students || 0), 0) || 1200).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10">
                    <p className="text-xs text-white/60 mb-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-green-300" /> Free Courses
                    </p>
                    <p className="text-xl font-semibold">
                      {courses.filter((c) => c.price === 0).length}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                  <span>New courses added every month</span>
                  <span className="inline-flex items-center gap-1 text-emerald-300">
                    <TrendingUp className="w-3 h-3" />
                    High demand skills
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-slate-900/50 p-1 rounded-xl border border-white/10 mb-8 w-fit h-auto">
            <TabsTrigger value="browse" className="rounded-lg px-6 py-2.5 text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
              Browse Catalog
            </TabsTrigger>
            <TabsTrigger value="my-courses" className="rounded-lg px-6 py-2.5 text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
              My Enrolled Courses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-8">
            {/* Filters and Search */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search courses, instructors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-900/80 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48 bg-slate-900/80 border-white/10 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-slate-900/80 border-white/10 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <div className="px-2 py-1.5 sticky top-0 bg-slate-900 border-b border-white/10">
                      <Input
                        placeholder="Search categories..."
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                        className="h-8 bg-black/40 border-white/10 text-white text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {categories
                      .filter(cat => cat.id === "all" || cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase()))
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="bg-slate-900/80 border-white/10 text-white">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <div className="px-2 py-1.5 sticky top-0 bg-slate-900 border-b border-white/10">
                      <Input
                        placeholder="Search languages..."
                        value={languageSearchQuery}
                        onChange={(e) => setLanguageSearchQuery(e.target.value)}
                        className="h-8 bg-black/40 border-white/10 text-white text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <SelectItem value="all">All Languages</SelectItem>
                    {dbLanguages
                      .filter(lang => lang.name.toLowerCase().includes(languageSearchQuery.toLowerCase()))
                      .map((language) => (
                        <SelectItem key={language.id} value={language.slug}>
                          {language.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="bg-slate-900/80 border-white/10 text-white">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger className="bg-slate-900/80 border-white/10 text-white">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.id} value={duration.id}>
                        {duration.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2 bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2">
                  <Checkbox
                    id="free-only"
                    checked={showFreeOnly}
                    onCheckedChange={(checked) => setShowFreeOnly(checked as boolean)}
                  />
                  <label htmlFor="free-only" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Free courses only
                  </label>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-white/60">
                {sortedCourses.length} course{sortedCourses.length !== 1 ? 's' : ''} found
              </p>
              <div className="hidden md:flex items-center gap-2 text-xs text-white/50">
                <Eye className="w-3 h-3" />
                <span>Tip: Combine search + filters to find the perfect course faster.</span>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.03,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{ willChange: "transform" }}
                >
                  <Card
                    className="group overflow-hidden border-white/10 bg-slate-900/70 backdrop-blur-xl hover:bg-slate-900 hover:border-indigo-500/60 transition-all duration-300 h-full"
                  >
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {course.isBestseller && (
                          <Badge className="bg-yellow-500 text-yellow-900">Bestseller</Badge>
                        )}
                        {course.isNew && (
                          <Badge className="bg-green-500 text-green-900">New</Badge>
                        )}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`bg-black/40 hover:bg-black/60 border border-white/20 rounded-full ${likedIds.has(course.id) ? 'text-pink-400' : ''}`}
                          disabled={loadingWishlist || !user}
                          onClick={async () => {
                            if (!user) {
                              toast({
                                title: "Sign in required",
                                description: "Please sign in to add courses to your wishlist",
                                variant: "default"
                              });
                              return;
                            }

                            const isLiked = likedIds.has(course.id);
                            setLoadingWishlist(true);

                            try {
                              if (isLiked) {
                                const response = await apiService.removeFromWishlist(course.id);
                                if (response.success) {
                                  setLikedIds((prev) => {
                                    const next = new Set(prev);
                                    next.delete(course.id);
                                    return next;
                                  });
                                  toast({
                                    title: "Removed from wishlist",
                                    description: "Course removed from your wishlist",
                                    variant: "default"
                                  });
                                }
                              } else {
                                const response = await apiService.addToWishlist(course.id);
                                if (response.success) {
                                  setLikedIds((prev) => new Set(prev).add(course.id));
                                  toast({
                                    title: "Added to wishlist",
                                    description: "Course added to your wishlist",
                                    variant: "default"
                                  });
                                }
                              }
                            } catch (error) {
                              console.error('Wishlist error:', error);
                              toast({
                                title: "Error",
                                description: "Failed to update wishlist",
                                variant: "destructive"
                              });
                            } finally {
                              setLoadingWishlist(false);
                            }
                          }}
                        >
                          <Heart className="w-4 h-4" fill={likedIds.has(course.id) ? 'currentColor' : 'none'} />
                        </Button>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-medium">
                          {categories.find(c => c.id === course.category)?.name}
                        </Badge>
                        <Badge variant="outline" className="border-white/30 text-white/90 bg-white/5 font-medium">
                          {levels.find(l => l.id === course.level)?.name}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {course.title}
                      </CardTitle>
                      {course.description && (
                        <CardDescription className="line-clamp-2 text-gray-300">
                          {course.description}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={course.instructorAvatar}
                          alt={course.instructor}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-white/90">{course.instructor}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-white/90 mb-4 flex-wrap">
                        <span className="flex items-center gap-1 font-medium">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {course.rating} ({course.reviews.toLocaleString()})
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-4 h-4 text-blue-400" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Users className="w-4 h-4 text-green-400" />
                          {course.students.toLocaleString()}
                        </span>
                        {course.lessonCount > 0 && (
                          <span className="flex items-center gap-1 font-medium">
                            <BookOpen className="w-4 h-4 text-purple-400" />
                            {course.lessonCount} {course.lessonCount === 1 ? 'lesson' : 'lessons'}
                          </span>
                        )}
                      </div>

                      {course.lessons && course.lessons.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-white/70 mb-2 font-medium">Lessons:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {course.lessons.slice(0, 5).map((lesson: any) => (
                              <Badge key={lesson.id} variant="outline" className="text-xs border-purple-500/50 text-purple-300 bg-purple-500/10">
                                {lesson.title}
                              </Badge>
                            ))}
                            {course.lessons.length > 5 && (
                              <Badge variant="outline" className="text-xs border-gray-500/50 text-gray-400 bg-gray-500/10">
                                +{course.lessons.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-gray-500/50 text-gray-300 bg-gray-500/10">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">
                              {course.price === 0 ? 'Free' : `₹${course.price}`}
                            </span>
                            {course.originalPrice > course.price && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{course.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full border-white/30 bg-white/5 text-white font-medium hover:bg-white/15 hover:border-white/40 hover:text-white transition-all duration-200"
                              onClick={() => navigate(`/course/${course.id}`, { state: { from: '/courses' } })}
                            >
                              View Details
                            </Button>
                          </div>
                          <div className="flex-1">
                            <Button
                              className="w-full group-hover:bg-primary group-hover:text-primary-foreground bg-indigo-500 text-white shadow-md shadow-indigo-500/40 transition-all duration-200"
                              onClick={() => navigate(`/course/${course.id}`, { state: { from: '/courses' } })}
                            >
                              Enroll Now
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {sortedCourses.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Courses
                </Button>
              </div>
            )}

            {/* No Results */}
            {sortedCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all categories.
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                  setSelectedDuration("all");
                  setShowFreeOnly(false);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-courses" className="space-y-8">
            {!user ? (
              <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-white/5">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Sign in to view your courses</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">Track your progress, access your certificates, and continue learning where you left off.</p>
                <Button onClick={() => navigate('/login')} size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8">
                  Sign In Now
                </Button>
              </div>
            ) : myCourses.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-white/5">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">You haven't enrolled in any courses yet</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">Explore our catalog to find courses that match your career goals.</p>
                <Button onClick={() => setActiveTab('browse')} size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8">
                  Browse Courses
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group overflow-hidden border-white/10 bg-slate-900/70 backdrop-blur-xl hover:bg-slate-900 hover:border-indigo-500/60 transition-all duration-300 h-full flex flex-col">
                      <div className="relative h-40 overflow-hidden">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                        <Badge className="absolute top-3 right-3 bg-emerald-500 text-white border-0">Enrolled</Badge>
                      </div>
                      <CardHeader className="pb-3 flex-grow">
                        <CardTitle className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">{course.title}</CardTitle>
                        <p className="text-sm text-slate-400">Instructor: {course.instructor}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-4 space-y-2">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Progress</span>
                            <span className="text-indigo-300">0%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[0%]" />
                          </div>
                        </div>
                        <Button
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                          onClick={() => navigate(`/course/${course.id}`)}
                        >
                          Continue Learning
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      );
};

      export default CourseCatalog;