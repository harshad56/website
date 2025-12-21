import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SEO from "@/components/SEO";

// Lazy load below-the-fold and heavy components
const LanguageGrid = lazy(() => import("@/components/LanguageGrid"));
const InteractiveEditor = lazy(() => import("@/components/InteractiveEditor"));
const ComprehensiveFeatures = lazy(() => import("@/components/ComprehensiveFeatures"));
const SuccessStories = lazy(() => import("@/components/SuccessStories"));
const Footer = lazy(() => import("@/components/Footer"));

// Simple loading - no complex skeletons
const SimpleLoader = () => <div className="min-h-[200px]" />;

// Lightweight skeleton for LanguageGrid
const LanguageGridSkeleton = () => (
  <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <div className="h-12 bg-muted rounded-lg w-96 max-w-full mx-auto mb-6 animate-pulse"></div>
        <div className="h-6 bg-muted rounded-lg w-2/3 max-w-2xl mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
        ))}
      </div>
    </div>
  </section>
);

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "CodeAcademy Pro",
    "description": "Learn programming with interactive courses, real-world projects, and AI-powered tutoring",
    "url": "http://localhost:3000",
    "logo": "http://localhost:3000/favicon.ico",
    "sameAs": [
      "https://twitter.com/codeacademypro",
      "https://facebook.com/codeacademypro"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "course": [
      {
        "@type": "Course",
        "name": "Python Programming",
        "description": "Learn Python from basics to advanced features",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        }
      },
      {
        "@type": "Course",
        "name": "JavaScript Programming",
        "description": "Master JavaScript for web development",
        "provider": {
          "@type": "Organization",
          "name": "CodeAcademy Pro"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="CodeAcademy Pro - Learn Programming Online"
        description="Master programming with interactive courses, real-world projects, and AI-powered tutoring. Learn Python, JavaScript, Java, C++, and 20+ programming languages. Start coding today!"
        keywords="programming, coding, learn to code, programming courses, Python, JavaScript, Java, web development, software engineering, coding bootcamp"
        structuredData={structuredData}
      />
      {/* Load critical above-the-fold components immediately */}
      <Header />
      <Hero />
      <Features />
      
      {/* Lazy load LanguageGrid - it's heavy with 20 language cards */}
      <Suspense fallback={<LanguageGridSkeleton />}>
        <LanguageGrid />
      </Suspense>
      
      {/* Only lazy load below-the-fold content */}
      <Suspense fallback={<SimpleLoader />}>
        <InteractiveEditor />
      </Suspense>
      <Suspense fallback={<SimpleLoader />}>
        <ComprehensiveFeatures />
      </Suspense>
      <Suspense fallback={<SimpleLoader />}>
        <SuccessStories />
      </Suspense>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
