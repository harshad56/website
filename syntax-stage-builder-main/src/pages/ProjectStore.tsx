import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Download, Filter } from 'lucide-react';
import SEO from '@/components/SEO';
import { apiService } from '@/services/ApiService';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const ProjectStore = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { data: projectsData, isLoading } = useProjects();
  const projects = projectsData || [];
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
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
  }, [projects, searchQuery, selectedCategory, selectedLanguage, selectedDifficulty, sortBy]);

  const uniqueCategories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))].map(String),
    [projects]
  );
  const uniqueLanguages = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.language).filter(Boolean)))].map(String),
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
      toast({
        title: 'Error',
        description: err.message || 'Failed to download project',
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
              handleDownload(project);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
        <p className="text-lg font-medium animate-pulse">Loading project store...</p>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Project Store - Buy Programming Projects',
    description: 'Browse and purchase ready-to-use programming projects with complete source code, documentation, and setup guides.',
    url: 'http://localhost:3000/projects',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <SEO
        title="Project Store - Buy Programming Projects & Source Code"
        description="Browse and purchase ready-to-use programming projects with complete source code, documentation, and setup guides. Build your portfolio with real-world projects."
        keywords="programming projects, source code, buy projects, web development projects, mobile app projects, project templates, code templates, portfolio projects"
        structuredData={structuredData}
      />
      <motion.header
        className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ← Home
                </Link>
              </motion.div>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-2xl font-bold text-white">🚀 Project Store</h1>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Premium <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Source Code</span> Projects
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Razorpay opens directly on purchase; downloads (project + setup PDF) start after success.
          </p>
        </motion.div>

        <motion.div
          className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/50 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-black/50 border-white/20 text-white">
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
              <SelectTrigger className="bg-black/50 border-white/20 text-white">
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
              <SelectTrigger className="bg-black/50 border-white/20 text-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="All" className="text-white hover:bg-white/10">
                  All
                </SelectItem>
                <SelectItem value="Beginner" className="text-white hover:bg-white/10">
                  Beginner
                </SelectItem>
                <SelectItem value="Intermediate" className="text-white hover:bg-white/10">
                  Intermediate
                </SelectItem>
                <SelectItem value="Advanced" className="text-white hover:bg-white/10">
                  Advanced
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-black/50 border-white/20 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="popular" className="text-white hover:bg-white/10">
                  Most Popular
                </SelectItem>
                <SelectItem value="newest" className="text-white hover:bg-white/10">
                  Newest
                </SelectItem>
                <SelectItem value="price-low" className="text-white hover:bg-white/10">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high" className="text-white hover:bg-white/10">
                  Price: High to Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ willChange: "transform" }}
            >
              <Card className="bg-black/40 border-white/10 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group h-full">
                <Link to={`/project/${project.id}`} className="flex-1 flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      {project.language && (
                        <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                          {project.language}
                        </Badge>
                      )}
                      {project.category && (
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                          {project.category}
                        </Badge>
                      )}
                      {project.difficulty && (
                        <Badge className={`text-xs ${getDifficultyColor(project.difficulty)}`}>
                          {project.difficulty}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-white text-base line-clamp-2">{project.title}</CardTitle>
                    <CardDescription className="text-gray-400 line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                </Link>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-white">₹{project.price || 0}</span>
                      {project.original_price && (
                        <span className="text-gray-500 line-through text-sm ml-1">₹{project.original_price}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/project/${project.id}`}>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyOrDownload(project);
                        }}
                        disabled={processingId === project.id}
                      >
                        {processingId === project.id ? 'Processing...' : project.price > 0 ? 'Buy' : 'Download'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            className="text-center text-gray-400 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            No projects found.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectStore;











