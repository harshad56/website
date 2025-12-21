import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/services/ApiService';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Download, FileCode } from 'lucide-react';
import SEO from '@/components/SEO';

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Determine where to go back to based on referrer or default to /real-projects
  const getBackPath = () => {
    // Check if we came from a specific page
    const referrer = document.referrer;
    if (referrer.includes('/real-projects')) return '/real-projects';
    if (referrer.includes('/projects')) return '/real-projects'; // Redirect old /projects to /real-projects
    if (location.state?.from) return location.state.from;
    return '/real-projects'; // Default
  };

  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getProject(projectId!);
      if (response.success && response.data) {
        setProject(response.data);
      } else {
        toast({ title: 'Error', description: 'Project not found', variant: 'destructive' });
        navigate(getBackPath());
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to load project', variant: 'destructive' });
      navigate(getBackPath());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId]);

  const handleDownload = async (proj: any) => {
    try {
      setProcessing(true);
      
      // Wait a bit more to ensure purchase is fully saved
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await apiService.downloadProject(proj.id);
      setProcessing(false);
      
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
              const filename = data.download_url.split('/').pop() || `project-${proj.id}.zip`;
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
              const filename = data.setup_pdf_url.split('/').pop() || `setup-${proj.id}.pdf`;
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
    } catch (error: any) {
      setProcessing(false);
      console.error('Download error:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to download project. Please try again or contact support.', 
        variant: 'destructive' 
      });
    }
  };

  const handlePayment = async (proj: any) => {
    try {
      setProcessing(true);
      const checkoutResponse = await apiService.createProjectCheckout(proj.id);
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
        description: proj.title,
        order_id: orderData.order_id || orderData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await apiService.verifyProjectPayment(proj.id, {
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
                handleDownload(proj);
              }, 500);
            } else {
              toast({ title: 'Payment verification failed', variant: 'destructive' });
            }
          } catch (error: any) {
            setProcessing(false);
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
            setProcessing(false);
          }
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
        variant: 'destructive' 
      });
    }
  };


  const handleBuyOrDownload = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to purchase/download projects',
        variant: 'destructive',
      });
      return;
    }
    if (!project) return;
    if (!project.price || project.price === 0) {
      await handleDownload(project);
    } else {
      await handlePayment(project);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <Link to={getBackPath()}>
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description || `${project.title} - Professional programming project with complete source code, documentation, and setup guides.`,
    applicationCategory: project.category || 'DeveloperApplication',
    operatingSystem: project.language || 'Web',
    programmingLanguage: project.language,
    offers: {
      '@type': 'Offer',
      price: project.price || 0,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${window.location.origin}/project/${project.id}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '10',
    },
    url: `${window.location.origin}/project/${project.id}`,
    image: project.thumbnail_url || `${window.location.origin}/og-project.jpg`,
  };

  const seoDescription = project.description 
    ? `${project.description.substring(0, 150)}... Download complete source code, documentation, and setup guides.`
    : `Download ${project.title} - Professional ${project.language || 'programming'} project with complete source code, documentation, and setup guides. Perfect for learning and portfolio building.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <SEO
        title={`${project.title} - Buy Project Source Code | CodeAcademy Pro`}
        description={seoDescription}
        keywords={`${project.title}, ${project.language}, ${project.category}, source code, programming project, ${project.language} project, ${project.category} project, download project, buy project source code, portfolio project`}
        image={project.thumbnail_url || `${window.location.origin}/og-project.jpg`}
        structuredData={structuredData}
      />
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link to={getBackPath()} className="text-purple-400 hover:text-purple-300">
            ← Back to Projects
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {project.thumbnail_url && (
              <div className="relative w-full h-64 md:h-96 bg-slate-800 rounded-lg overflow-hidden mb-6">
                <img
                  src={project.thumbnail_url}
                  alt={project.title || 'Project thumbnail'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-lg bg-slate-800">No Image Available</div>';
                    }
                  }}
                />
              </div>
            )}
            <Card className="bg-black/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">{project.title}</CardTitle>
                <div className="flex gap-2 mt-2">
                  {project.language && <Badge variant="outline">{project.language}</Badge>}
                  {project.category && <Badge variant="outline">{project.category}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="text-gray-200 space-y-4">
                <p>{project.description}</p>
                {project.setup_pdf_url && (
                  <div className="text-sm text-gray-300">Setup guide included</div>
                )}
                <div className="flex gap-3">
                  <Badge className="bg-green-500/20 text-green-300">
                    <Star className="w-4 h-4 mr-1" /> Production ready
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300">
                    <FileCode className="w-4 h-4 mr-1" /> Full source
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
                  {project.price > 0 ? `₹${project.price}` : 'Free'}
                  {project.original_price && (
                    <span className="text-gray-500 line-through text-sm ml-2">₹{project.original_price}</span>
                  )}
                </div>
                <Button className="w-full" onClick={handleBuyOrDownload} disabled={processing}>
                  {processing ? 'Processing...' : project.price > 0 ? 'Buy & Download' : 'Download'}
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

export default ProjectDetail;











