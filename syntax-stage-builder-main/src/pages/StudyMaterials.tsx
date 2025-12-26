import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, FileText, BookOpen, File, Star, Loader2, Shield, FileCode } from 'lucide-react';
import SEO from '@/components/SEO';
import { apiService } from '@/services/ApiService';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { BackButton } from '@/components/BackButton';
import { useStudyMaterials } from '@/hooks/useApi';
import { motion, AnimatePresence } from 'framer-motion';


const StudyMaterials = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: materialsData, isLoading } = useStudyMaterials();
  const materials = materialsData || [];
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Helper function to get type icon
  const getTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return <FileText className="w-3 h-3" />;
      case 'NOTES':
        return <BookOpen className="w-3 h-3" />;
      case 'EBOOK':
        return <FileCode className="w-3 h-3" />;
      case 'VIDEO':
        return <File className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  // Helper function to get type color
  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'NOTES':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'EBOOK':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'VIDEO':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        material.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
      const matchesLanguage = selectedLanguage === 'all' || material.language === selectedLanguage;
      const matchesType = selectedType === 'all' || material.type?.toUpperCase() === selectedType.toUpperCase();
      return matchesSearch && matchesCategory && matchesLanguage && matchesType;
    });
  }, [materials, searchQuery, selectedCategory, selectedLanguage, selectedType]);


  const handleDownload = async (material: any) => {
    try {
      setProcessingId(material.id);

      // Wait a bit to ensure purchase is fully saved
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Requesting download for study material:', material.id);
      const response = await apiService.downloadStudyMaterial(material.id);
      console.log('Download response:', response);
      setProcessingId(null);

      if (response.success && response.data) {
        const data = response.data as any;

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

        // Download main file
        if (data.download_url) {
          setTimeout(() => {
            try {
              const filename = data.download_url.split('/').pop() || `material-${material.id}.pdf`;
              console.log('Triggering download for:', data.download_url, filename);
              triggerDownload(data.download_url, filename);
            } catch (err) {
              console.error('Error triggering download:', err);
              // Fallback: try window.open
              setTimeout(() => {
                window.open(data.download_url, '_blank');
              }, 300);
            }
          }, 200);
        }

        // Download setup PDF
        if (data.setup_pdf_url) {
          setTimeout(() => {
            try {
              const filename = data.setup_pdf_url.split('/').pop() || `setup-${material.id}.pdf`;
              console.log('Triggering PDF download for:', data.setup_pdf_url, filename);
              triggerDownload(data.setup_pdf_url, filename);
            } catch (err) {
              console.error('Error triggering PDF download:', err);
              // Fallback: try window.open
              setTimeout(() => {
                window.open(data.setup_pdf_url, '_blank');
              }, 300);
            }
          }, 600);
        }

        if (data.download_url || data.setup_pdf_url) {
          toast({
            title: 'Download started',
            description: 'Your download should start shortly.',
            variant: 'default'
          });
        } else {
          toast({
            title: 'No download available',
            description: 'Download URLs are not configured for this material.',
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
        description: err.message || 'Failed to download',
        variant: 'destructive',
      });
    }
  };

  const handlePayment = async (material: any) => {
    try {
      setProcessingId(material.id);
      const checkoutResponse = await apiService.createStudyMaterialCheckout(material.id);
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
        description: material.title,
        order_id: orderData.order_id || orderData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await apiService.verifyStudyMaterialPayment(material.id, {
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
                handleDownload(material);
              }, 1500);
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

      // Open Razorpay window
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

  const handleBuyOrDownload = async (material: any) => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to purchase/download study materials',
        variant: 'destructive',
      });
      return;
    }
    if (!material.price || material.price === 0) {
      await handleDownload(material);
    } else {
      await handlePayment(material);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-930 to-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
        <p className="text-lg font-medium animate-pulse">Loading study materials...</p>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Study Materials - PDFs, Ebooks & Learning Resources',
    description: 'Download PDFs, ebooks, notes, tutorials, and study materials to enhance your programming journey. Access comprehensive learning resources for Python, JavaScript, Java, web development, data science, and more.',
    url: `${window.location.origin}/study-materials`,
    numberOfItems: materials.length,
    itemListElement: materials.slice(0, 10).map((material: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        '@id': `${window.location.origin}/study-material/${material.id}`,
        name: material.title,
        description: material.description,
        learningResourceType: material.type || 'Document',
        educationalLevel: material.category,
        inLanguage: material.language,
        offers: {
          '@type': 'Offer',
          price: material.price || 0,
          priceCurrency: 'INR',
        },
        url: `${window.location.origin}/study-material/${material.id}`,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-930 to-slate-950 text-white">
      <SEO
        title="Study Materials - Free PDFs, Ebooks & Learning Resources | CodeAcademy Pro"
        description="Download PDFs, ebooks, notes, tutorials, and study materials to enhance your programming journey. Access comprehensive learning resources for Python, JavaScript, Java, web development, data science, AI/ML, and more. Free and premium study materials available."
        keywords="study materials, programming PDFs, coding ebooks, programming notes, programming tutorials, Python PDFs, JavaScript ebooks, web development resources, data science materials, programming study guides, coding resources, tech ebooks, programming books, learning materials"
        image={`${window.location.origin}/og-study-materials.jpg`}
        structuredData={structuredData}
      />
      <motion.header
        className="bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
              <BackButton label="Back to Home" className="bg-black/40 border-white/20 text-white" to="/" />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.div
        className="border-b border-white/5 bg-gradient-to-r from-purple-900/60 via-slate-950 to-pink-900/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <motion.p
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-300 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FileCode className="w-3 h-3" />
              Learning Resources & Study Materials
            </motion.p>
            <motion.h1
              className="text-3xl md:text-5xl font-extrabold leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Enhance Your Learning with{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Premium Study Materials
              </span>
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Get complete PDFs, ebooks, and study notes for all programming languages.
              Perfect for building your knowledge base and mastering new skills.
            </motion.p>
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {[
                { icon: Shield, color: "text-green-400", text: "Secure Payment" },
                { icon: Download, color: "text-blue-400", text: "Instant Access" },
                { icon: FileCode, color: "text-purple-400", text: "Complete Resources" },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">

        {/* Filters - Cleaner Design */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search study materials..."
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
                <SelectItem value="all" className="text-white hover:bg-white/10">All Categories</SelectItem>
                {[...new Set(materials.map((m) => m.category).filter(Boolean))].map((cat) => (
                  <SelectItem key={cat} value={cat as string} className="text-white hover:bg-white/10">
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
                <SelectItem value="all" className="text-white hover:bg-white/10">All Languages</SelectItem>
                {[...new Set(materials.map((m) => m.language).filter(Boolean))].map((lang) => (
                  <SelectItem key={lang} value={lang as string} className="text-white hover:bg-white/10">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="all" className="text-white hover:bg-white/10">All Types</SelectItem>
                <SelectItem value="PDF" className="text-white hover:bg-white/10">PDF</SelectItem>
                <SelectItem value="Notes" className="text-white hover:bg-white/10">Notes</SelectItem>
                <SelectItem value="Ebook" className="text-white hover:bg-white/10">Ebook</SelectItem>
                <SelectItem value="Video" className="text-white hover:bg-white/10">Video</SelectItem>
                <SelectItem value="Document" className="text-white hover:bg-white/10">Document</SelectItem>
                <SelectItem value="Tutorial" className="text-white hover:bg-white/10">Tutorial</SelectItem>
                {/* Also show any custom types from database */}
                {[...new Set(materials.map((m) => m.type).filter(Boolean))].filter(
                  (type) => !['PDF', 'Notes', 'Ebook', 'Video', 'Document', 'Tutorial'].includes(type as string)
                ).map((type) => (
                  <SelectItem key={type} value={type as string} className="text-white hover:bg-white/10">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ willChange: "transform" }}
            >
              <Card className="bg-slate-900/70 border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden group h-full flex flex-col">
                {material.thumbnail_url && (
                  <div className="relative w-full h-48 bg-slate-800 overflow-hidden">
                    <img
                      src={material.thumbnail_url}
                      alt={material.title || 'Study material thumbnail'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
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
                  to={`/study-material/${material.id}`}
                  state={{ from: '/study-materials' }}
                  className="flex-1 flex flex-col"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {/* Type badge - always show, default to "Document" if no type */}
                      <Badge
                        variant="outline"
                        className={`text-xs border font-medium flex items-center gap-1 ${getTypeColor(material.type || 'Document')}`}
                      >
                        {getTypeIcon(material.type || 'Document')}
                        {material.type || 'Document'}
                      </Badge>
                      {material.category && (
                        <Badge variant="outline" className="text-xs border-gray-400/60 text-gray-200 bg-gray-500/20 font-medium">
                          {material.category}
                        </Badge>
                      )}
                      {material.language && (
                        <Badge variant="outline" className="text-xs border-purple-500/60 text-purple-300 bg-purple-500/20 font-medium">
                          {material.language}
                        </Badge>
                      )}
                      {material.is_featured && (
                        <Badge className="text-xs bg-yellow-500/30 text-yellow-300 border-yellow-500/40 font-medium">
                          ⭐ Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-white text-xl font-bold line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
                      {material.title}
                    </CardTitle>
                    {material.description && (
                      <CardDescription className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                        {material.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Link>
                <CardContent className="pt-0 mt-auto">
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-white">₹{material.price || 0}</span>
                          {material.original_price && material.original_price > material.price && (
                            <span className="text-gray-400 line-through text-sm">₹{material.original_price}</span>
                          )}
                        </div>
                        {material.price === 0 && (
                          <span className="text-sm font-medium text-green-400">Free</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-white">
                        <Download className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold">{material.total_downloads || 0} downloads</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/study-material/${material.id}`}
                        state={{ from: '/study-materials' }}
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
                          handleBuyOrDownload(material);
                        }}
                        disabled={processingId === material.id}
                      >
                        {processingId === material.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : material.price > 0 ? (
                          'Buy Now'
                        ) : (
                          'Download'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <motion.div
            className="text-center text-gray-400 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            No study materials found.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;











