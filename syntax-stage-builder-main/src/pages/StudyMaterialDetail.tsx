import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/services/ApiService';
import { useAuth } from '@/contexts/AuthContext';
import { Download, FileCode, Loader2, Star, FileText, BookOpen, File } from 'lucide-react';
import SEO from '@/components/SEO';
import { OptimizedImage } from '@/components/OptimizedImage';

const StudyMaterialDetail = () => {
  const { materialId } = useParams<{ materialId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Determine where to go back to based on referrer or default to /study-materials
  const getBackPath = () => {
    // Check if we came from a specific page via location state
    if (location.state?.from) return location.state.from;

    // Check referrer
    const referrer = document.referrer;
    if (referrer.includes('/study-materials')) return '/study-materials';

    // Default to study materials page
    return '/study-materials';
  };

  const [material, setMaterial] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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

  const loadMaterial = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getStudyMaterial(materialId!);
      if (response.success && response.data) {
        setMaterial(response.data);
      } else {
        toast({
          title: 'Error',
          description: 'Study material not found',
          variant: 'destructive',
        });
        navigate(getBackPath());
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load study material details',
        variant: 'destructive',
      });
      navigate(getBackPath());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (materialId) loadMaterial();
  }, [materialId]);

  const handleDownload = async (materialToDownload: any) => {
    try {
      setProcessing(true);

      // Wait a bit to ensure purchase is fully saved
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Requesting download for study material:', materialToDownload.id);
      const response = await apiService.downloadStudyMaterial(materialToDownload.id);
      console.log('Download response:', response);
      setProcessing(false);

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
              const filename = data.download_url.split('/').pop() || `material-${materialToDownload.id}.pdf`;
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
              const filename = data.setup_pdf_url.split('/').pop() || `setup-${materialToDownload.id}.pdf`;
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
        throw new Error((response as any).message || 'Download URL not available');
      }
    } catch (error: any) {
      setProcessing(false);
      toast({
        title: 'Error',
        description: error.message || 'Failed to download material',
        variant: 'destructive',
      });
    }
  };

  const handlePayment = async (materialToPay: any) => {
    try {
      setProcessing(true);
      const checkoutResponse = await apiService.createStudyMaterialCheckout(materialToPay.id);
      if (!checkoutResponse.success || !checkoutResponse.data) {
        throw new Error((checkoutResponse as any).message || 'Failed to create checkout');
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
        description: materialToPay.title,
        order_id: orderData.order_id || orderData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await apiService.verifyStudyMaterialPayment(materialToPay.id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setProcessing(false);
            if (verifyResponse.success) {
              toast({
                title: 'Payment Successful',
                description: 'Your payment has been verified. Download starting...',
                variant: 'default'
              });
              // Wait a moment for purchase to be saved in database
              setTimeout(() => {
                handleDownload(materialToPay);
              }, 1500);
            } else {
              toast({ title: 'Payment verification failed', variant: 'destructive' });
            }
          } catch (error: any) {
            setProcessing(false);
            toast({
              title: 'Payment Error',
              description: error.message || 'Failed to verify payment',
              variant: 'destructive',
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
            setProcessing(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on('payment.failed', (response: any) => {
        setProcessing(false);
        toast({
          title: 'Payment Failed',
          description: response.error?.description || 'Payment could not be processed',
          variant: 'destructive',
        });
      });

      // Open Razorpay window
      razorpay.open();
    } catch (error: any) {
      setProcessing(false);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to process payment',
        variant: 'destructive',
      });
    }
  };

  const handleBuyOrDownload = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to download study materials',
        variant: 'destructive',
      });
      return;
    }
    if (!material) return;
    if (!material.price || material.price === 0) {
      await handleDownload(material);
      return;
    }
    await handlePayment(material);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p>Loading study material...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <header className="bg-black/50 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <Link to={getBackPath()} className="text-purple-400 hover:text-purple-300">
              ← Back to Study Materials
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-6 py-8">
          <Card className="bg-black/50 border-white/10 text-white">
            <CardContent className="pt-6">
              <p className="text-center mb-4">Study material not found</p>
              <Button onClick={() => navigate(getBackPath())}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: material.title,
    description: material.description || `${material.title} - ${material.type || 'Study material'} for ${material.language || 'programming'}. Download PDF, ebook, or notes to enhance your learning.`,
    learningResourceType: material.type || 'Document',
    educationalLevel: material.category || 'Beginner',
    inLanguage: material.language || 'English',
    offers: {
      '@type': 'Offer',
      price: material.price || 0,
      priceCurrency: 'INR',
      availability: material.price === 0 ? 'https://schema.org/Free' : 'https://schema.org/InStock',
      url: `${window.location.origin}/study-material/${material.id}`,
    },
    url: `${window.location.origin}/study-material/${material.id}`,
    image: material.thumbnail_url || `${window.location.origin}/og-study-material.jpg`,
  };

  const seoDescription = material.description
    ? `${material.description.substring(0, 150)}... Download ${material.type || 'study material'} for ${material.language || 'programming'}.`
    : `Download ${material.title} - ${material.type || 'Study material'} for ${material.language || 'programming'}. ${material.category ? `Perfect for ${material.category} learners.` : 'Enhance your programming skills with this comprehensive resource.'}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <SEO
        title={`${material.title} - ${material.type || 'Study Material'} | CodeAcademy Pro`}
        description={seoDescription}
        keywords={`${material.title}, ${material.type || 'study material'}, ${material.language}, ${material.category}, PDF, ebook, programming notes, ${material.language} ${material.type}, download ${material.type}`}
        image={material.thumbnail_url || `${window.location.origin}/og-study-material.jpg`}
        structuredData={structuredData}
      />
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link to={getBackPath()} className="text-purple-400 hover:text-purple-300">
            ← Back to Study Materials
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {material.thumbnail_url && (
              <div className="relative w-full h-64 md:h-96 bg-slate-800 rounded-lg overflow-hidden mb-6">
                <OptimizedImage
                  src={material.thumbnail_url}
                  alt={material.title || 'Study material thumbnail'}
                  className="w-full h-full object-cover"
                  width={800}
                  height={400}
                  priority={true} // Priority as it's the main image
                />
              </div>
            )}
            <Card className="bg-black/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">{material.title}</CardTitle>
                <div className="flex gap-2 mt-2">
                  {material.type && (
                    <Badge
                      variant="outline"
                      className={`text-xs border font-medium flex items-center gap-1 ${getTypeColor(material.type)}`}
                    >
                      {getTypeIcon(material.type)}
                      {material.type}
                    </Badge>
                  )}
                  {material.language && <Badge variant="outline">{material.language}</Badge>}
                  {material.category && <Badge variant="outline">{material.category}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="text-gray-200 space-y-4">
                <p>{material.description}</p>
                {material.file_size && (
                  <div className="text-sm text-gray-300">File size: {material.file_size}</div>
                )}
                {material.setup_pdf_url && (
                  <div className="text-sm text-gray-300">Setup guide included</div>
                )}
                <div className="flex gap-3">
                  <Badge className="bg-green-500/20 text-green-300">
                    <Star className="w-4 h-4 mr-1" /> Premium Quality
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300">
                    <FileCode className="w-4 h-4 mr-1" /> Complete Resource
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-black/60 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-xl">Buy & Download</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-200">
                <div className="text-3xl font-bold text-white">
                  {material.price > 0 ? `₹${material.price}` : 'Free'}
                  {material.original_price && (
                    <span className="text-gray-500 line-through text-sm ml-2">₹{material.original_price}</span>
                  )}
                </div>
                <Button className="w-full" onClick={handleBuyOrDownload} disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : material.price > 0 ? (
                    'Buy & Download'
                  ) : (
                    'Download'
                  )}
                  <Download className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialDetail;











