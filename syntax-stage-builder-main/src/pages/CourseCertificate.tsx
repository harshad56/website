import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/ApiService';
import { useToast } from '@/components/ui/use-toast';

const CourseCertificate = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificateInfo, setCertificateInfo] = useState<{ certificateId?: string; downloadUrl?: string } | null>(null);

  const generateAndDownloadCertificate = async () => {
    if (!courseId) {
      setError('Course ID is missing.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getCourseCertificate(courseId);
      if (!response.success) {
        throw new Error(response.error || response.message || 'Could not fetch certificate');
      }
      const downloadUrl = (response.data as any)?.blobUrl || (response.data as any)?.url;
      if (downloadUrl) {
        setCertificateInfo({
          certificateId: (response.data as any)?.certificateId,
          downloadUrl,
        });
        window.open(downloadUrl, '_blank');
        toast({
          title: 'Certificate ready',
          description: (response.data as any)?.certificateId
            ? `Certificate ID: ${(response.data as any).certificateId}`
            : 'Your certificate is downloading.',
        });
      } else {
        throw new Error('Certificate URL not available');
      }
    } catch (err: any) {
      const message =
        err?.status === 403
          ? 'Complete the course to unlock your certificate.'
          : err?.message || 'Could not download certificate. Try again.';
      setError(message);
      toast({
        title: 'Certificate unavailable',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateAndDownloadCertificate();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-black/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-white">Course Certificate</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-200 space-y-4">
            {loading && <p>Generating your certificate...</p>}
            {error && (
              <div className="space-y-3">
                <p className="text-red-400">{error}</p>
                <div className="flex gap-3">
                  <Button variant="default" onClick={() => navigate(`/learn/${courseId}`)}>
                    Continue Learning
                  </Button>
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    Go Back
                  </Button>
                </div>
              </div>
            )}
            {certificateInfo && (
              <div className="space-y-2">
                {certificateInfo.certificateId && <p>Certificate ID: {certificateInfo.certificateId}</p>}
                {certificateInfo.downloadUrl && (
                  <div className="flex gap-3">
                    <Button onClick={() => window.open(certificateInfo.downloadUrl, '_blank')} variant="secondary">
                      Download Certificate
                    </Button>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                      Back
                    </Button>
                  </div>
                )}
              </div>
            )}
            {!loading && !error && !certificateInfo && (
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseCertificate;





