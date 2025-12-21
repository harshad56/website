import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { apiService } from "@/services/ApiService";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Globe,
  Star,
  Calendar,
  ExternalLink,
  FileText,
  Send,
  Share2,
} from "lucide-react";
import { ShareDialog } from "@/components/ShareDialog";

interface JobDetailData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  experience: string;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string | Date;
  applications: number;
  isRemote: boolean;
  isFeatured: boolean;
  category: string;
  contact: {
    email: string;
    phone?: string;
    website?: string;
  };
  companyPdfUrl?: string | null;
  is_active?: boolean;
  applyUrl?: string | null;
}

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<JobDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      if (!jobId) return;
      try {
        const res = await apiService.getJob(jobId);
        if (res.success && res.data) {
          setJob(res.data);
        } else {
          throw new Error(res.message || "Failed to load job");
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Failed to load job",
          variant: "destructive",
        });
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId, navigate, toast]);

  const handleExternalApply = () => {
    if (!job) return;
    const externalUrl = job.applyUrl || job.contact?.website;
    if (externalUrl) {
      window.open(externalUrl, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "No application link",
        description: "This job has no external application link configured.",
      });
    }
  };

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    if (!salary || (!salary.min && !salary.max)) return "Not disclosed";
    return `${salary.currency}${salary.min?.toLocaleString?.() || "0"} - ${salary.currency}${salary.max?.toLocaleString?.() || "0"}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <p>Loading job...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <p>Job not found.</p>
      </div>
    );
  }

  const postedDate =
    job.postedDate instanceof Date
      ? job.postedDate
      : job.postedDate
      ? new Date(job.postedDate)
      : new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-930 to-slate-950 text-white">
      <SEO
        title={`${job.title} at ${job.company} | Job Details`}
        description={job.description?.slice(0, 150) || "Job details"}
        image={`${window.location.origin}/og-jobs.jpg`}
      />

      <header className="bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-white flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Link
            to="/jobs"
            className="text-sm text-blue-400 hover:text-blue-300 underline"
          >
            Back to Job Board
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        <Card className="bg-slate-900/80 border-white/10">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-400" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    {job.type}
                  </span>
                  {job.isRemote && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                      <Globe className="w-3 h-3 mr-1" />
                      Remote
                    </Badge>
                  )}
                  {job.isFeatured && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                <div className="flex flex-col items-end gap-1 text-sm text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span>Posted on {postedDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-pink-400" />
                    <span>{job.applications || 0} applications</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="font-semibold text-green-400">
                  {formatSalary(job.salary)}
                </span>
              </div>
              {job.category && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                  {job.category}
                </Badge>
              )}
            </div>

            <section>
              <h2 className="text-lg font-semibold mb-2">Job Description</h2>
              <p className="text-gray-200 whitespace-pre-line">
                {job.description}
              </p>
            </section>

            {job.requirements?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-2">Requirements</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-200">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </section>
            )}

            {job.benefits?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-2">Benefits</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-200">
                  {job.benefits.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </section>
            )}

            {job.skills?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-2">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      className="bg-blue-500/20 text-blue-300 border-blue-500/50"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {job.companyPdfUrl && (
              <section className="pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  className="text-blue-400 border-blue-500/50 hover:bg-blue-500/10"
                  asChild
                >
                  <a
                    href={job.companyPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Company PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </section>
            )}

            <section className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 text-sm text-gray-300">
                <p>
                  <span className="font-semibold">Contact Email:</span>{" "}
                  {job.contact.email}
                </p>
                {job.contact.phone && (
                  <p>
                    <span className="font-semibold">Contact Phone:</span>{" "}
                    {job.contact.phone}
                  </p>
                )}
                {job.contact.website && (
                  <p>
                    <span className="font-semibold">Application Link:</span>{" "}
                    <a
                      href={job.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {job.contact.website}
                    </a>
                  </p>
                )}
              </div>
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleExternalApply}
              >
                <Send className="w-4 h-4 mr-2" />
                Apply on Company Site
              </Button>
            </section>
          </CardContent>
        </Card>
      </main>

      {/* Share Dialog */}
      {job && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          title={`${job.title} at ${job.company}`}
          url={`${window.location.origin}/jobs/${job.id}`}
          description={`Check out this ${job.type} position: ${job.title} at ${job.company} - ${job.location}. ${job.description?.slice(0, 100)}...`}
        />
      )}
    </div>
  );
};

export default JobDetail;



