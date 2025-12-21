import { useEffect, useMemo, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Download, Filter, Shield, FileCode, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';
import { apiService } from '@/services/ApiService';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';

const RealProjects = memo(() => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiService.getProjects();
        if (res.success && res.data) {
          setProjects(res.data as any[]);
        } else {
          throw new Error(res.message || 'Failed to load projects');
        }
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.message || 'Failed to load projects',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.language?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (selectedLanguage !== 'All') {
      filtered = filtered.filter((p) => p.language === selectedLanguage);
    }
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter((p) => p.difficulty === selectedDifficulty);
    }

    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.total_downloads || 0) - (a.total_downloads || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        filtered.sort(
          (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
        break;
    }

    return filtered;
  }, [projects, debouncedSearchQuery, selectedCategory, selectedLanguage, selectedDifficulty, sortBy]);

  const uniqueCategories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))],
    [projects]
  );
  const uniqueLanguages = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.language).filter(Boolean)))],
    [projects]
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleDownload = async (project: any) => {
    try {
      setProcessingId(project.id);
      
      // Wait a bit more to ensure purchase is fully saved
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await apiService.downloadProject(project.id);
      setProcessingId(null);
      
      if (response.success && response.data) {
        const data = response.data as any;
        
        console.log('Download response:', data);
        
        // Function to trigger download
        const triggerDownload = (url: string, filename: string) => {
          const link = document.createElement('a');
          link.href = url;
          link.download = filename || url.split('/').pop() || 'download';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
        
        // Download project file
        if (data.download_url) {
          setTimeout(() => {
            try {
              const filename = data.download_url.split('/').pop() || `project-${project.id}.zip`;
              triggerDownload(data.download_url, filename);
              console.log('Downloading project file:', data.download_url);
            } catch (err) {
              console.error('Error triggering download:', err);
              // Fallback to window.open
              window.open(data.download_url, '_blank');
            }
          }, 100);
        }
        
        // Download setup PDF
        if (data.setup_pdf_url) {
          setTimeout(() => {
            try {
              const filename = data.setup_pdf_url.split('/').pop() || `setup-${project.id}.pdf`;
              triggerDownload(data.setup_pdf_url, filename);
              console.log('Downloading setup PDF:', data.setup_pdf_url);
            } catch (err) {
              console.error('Error triggering PDF download:', err);
              // Fallback to window.open
              window.open(data.setup_pdf_url, '_blank');
            }
          }, 500);
        }
        
        if (data.download_url || data.setup_pdf_url) {
          toast({ 
            title: 'Download started', 
            description: 'Your download should start shortly. If it doesn\'t, check your browser\'s popup blocker settings.',
            variant: 'default'
          });
        } else {
          toast({ 
            title: 'No download available', 
            description: 'Download URLs are not configured for this project. Please contact support.',
            variant: 'destructive' 
          });
        }
      } else {
        throw new Error(response.message || 'Download URL not available');
      }
    } catch (err: any) {
      setProcessingId(null);
      console.error('Download error:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to download project. Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };

  const handlePayment = async (project: any) => {
    try {
      setProcessingId(project.id);
      const checkoutResponse = await apiService.createProjectCheckout(project.id);
      if (!checkoutResponse.success || !checkoutResponse.data) {
        throw new Error(checkoutResponse.message || 'Failed to create checkout');
      }
      const orderData: any = checkoutResponse.data;

      // Wait for Razorpay SDK to load
      let retries = 0;
      const maxRetries = 20;
      while (!(window as any).Razorpay && retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        retries++;
      }
      if (!(window as any).Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.');
      }

      const options = {
        key: orderData.key || orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'CodeAcademy Pro',
        description: project.title,
        order_id: orderData.order_id || orderData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await apiService.verifyProjectPayment(project.id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setProcessingId(null);
            if (verifyResponse.success) {
              toast({ 
                title: 'Payment Successful', 
                description: 'Your payment has been verified. Download starting...',
                variant: 'default'
              });
              // Wait a moment for purchase to be saved in database
              setTimeout(() => {
                handleDownload(project);
              }, 1000);
            } else {
              toast({ title: 'Payment verification failed', variant: 'destructive' });
            }
          } catch (error: any) {
            setProcessingId(null);
            toast({ 
              title: 'Payment Error', 
              description: error.message || 'Failed to verify payment',
              variant: 'destructive' 
            });
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: { color: '#9333ea' },
        modal: { 
          ondismiss: () => {
            setProcessingId(null);
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      
      razorpay.on('payment.failed', (response: any) => {
        setProcessingId(null);
        toast({
          title: 'Payment Failed',
          description: response.error?.description || 'Payment could not be processed',
          variant: 'destructive',
        });
      });

      // Open Razorpay window for real payments
      razorpay.open();
    } catch (err: any) {
      setProcessingId(null);
      toast({
        title: 'Payment Error',
        description: err.message || 'Failed to process payment',
        variant: 'destructive',
      });
    }
  };


  const handleBuyOrDownload = async (project: any) => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to purchase/download projects',
        variant: 'destructive',
      });
      return;
    }
    if (!project.price || project.price === 0) {
      await handleDownload(project);
    } else {
      await handlePayment(project);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Real Projects - Professional Programming Projects',
    description: 'Discover professional programming projects with complete source code, documentation, and setup guides. Build your portfolio with real-world applications.',
    url: `${window.location.origin}/real-projects`,
    numberOfItems: projects.length,
    itemListElement: projects.slice(0, 10).map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: project.title,
        description: project.description,
        applicationCategory: project.category,
        operatingSystem: project.language,
        offers: {
          '@type': 'Offer',
          price: project.price || 0,
          priceCurrency: 'INR',
        },
        url: `${window.location.origin}/project/${project.id}`,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-930 to-slate-950 text-white">
      <SEO
        title="Real Projects - Professional Programming Projects & Source Code | CodeAcademy Pro"
        description="Browse our collection of professional programming projects with complete source code, documentation, and setup guides. Perfect for building your portfolio with real-world applications in web development, mobile apps, data science, and more. Download projects in Python, JavaScript, Java, React, Node.js, and 20+ technologies."
        keywords="real projects, programming projects, source code, portfolio projects, web development projects, mobile app projects, data science projects, Python projects, JavaScript projects, React projects, Node.js projects, professional projects, code examples, project templates, programming portfolio"
        image={`${window.location.origin}/og-projects.jpg`}
        structuredData={structuredData}
      />
      <header className="bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-white/5 bg-gradient-to-r from-purple-900/60 via-slate-950 to-pink-900/50">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-300 mb-4">
              <FileCode className="w-3 h-3" />
              Professional Source Code Projects
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Build Your Portfolio with{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Real-World Projects
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Get complete source code, documentation, and setup guides for professional projects. 
              Perfect for building your portfolio and learning industry best practices.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-400" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span>Full Source Code</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filters - Cleaner Design */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                {uniqueCategories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white w-[140px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                {uniqueLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="text-white hover:bg-white/10">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white w-[140px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="All" className="text-white hover:bg-white/10">All</SelectItem>
                <SelectItem value="Beginner" className="text-white hover:bg-white/10">Beginner</SelectItem>
                <SelectItem value="Intermediate" className="text-white hover:bg-white/10">Intermediate</SelectItem>
                <SelectItem value="Advanced" className="text-white hover:bg-white/10">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="popular" className="text-white hover:bg-white/10">Most Popular</SelectItem>
                <SelectItem value="newest" className="text-white hover:bg-white/10">Newest</SelectItem>
                <SelectItem value="price-low" className="text-white hover:bg-white/10">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="text-white hover:bg-white/10">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-slate-900/70 border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden group h-full flex flex-col"
            >
              {project.thumbnail_url && (
                <div className="relative w-full h-48 bg-slate-800 overflow-hidden">
                  <img
                    src={project.thumbnail_url}
                    alt={project.title || 'Project thumbnail'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-sm bg-slate-800">No Image</div>';
                      }
                    }}
                  />
                </div>
              )}
              <Link 
                to={`/project/${project.id}`} 
                state={{ from: '/real-projects' }}
                className="flex-1 flex flex-col"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {project.language && (
                      <Badge variant="outline" className="text-xs border-purple-500/60 text-purple-300 bg-purple-500/20 font-medium">
                        {project.language}
                      </Badge>
                    )}
                    {project.category && (
                      <Badge variant="outline" className="text-xs border-gray-400/60 text-gray-200 bg-gray-500/20 font-medium">
                        {project.category}
                      </Badge>
                    )}
                    {project.is_featured && (
                      <Badge className="text-xs bg-yellow-500/30 text-yellow-300 border-yellow-500/40 font-medium">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-white text-xl font-bold line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>
              </Link>
              <CardContent className="pt-0 mt-auto">
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">₹{project.price || 0}</span>
                        {project.original_price && project.original_price > project.price && (
                          <span className="text-gray-400 line-through text-sm">₹{project.original_price}</span>
                        )}
                      </div>
                      {project.price === 0 && (
                        <span className="text-sm font-medium text-green-400">Free</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-white">
                      <Download className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold">{project.total_downloads || 0} downloads</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      to={`/project/${project.id}`}
                      state={{ from: '/real-projects' }}
                      className="flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-white/40 bg-white/10 text-white font-semibold hover:bg-white/20 hover:border-white/50 hover:text-white shadow-sm"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBuyOrDownload(project);
                      }}
                      disabled={processingId === project.id}
                    >
                      {processingId === project.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : project.price > 0 ? (
                        'Buy Now'
                      ) : (
                        'Download'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center text-gray-400 py-12">No projects found.</div>
        )}
      </div>
    </div>
  );
});

export default RealProjects;











