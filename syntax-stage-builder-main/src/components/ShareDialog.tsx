import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Share2,
  Check,
  Copy,
} from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  description?: string;
}

export const ShareDialog = ({
  open,
  onOpenChange,
  title,
  url,
  description,
}: ShareDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareText = description || `Check out this job: ${title}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const shareOptions = [
    {
      name: "Copy Link",
      icon: Copy,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          toast({
            title: "Link copied!",
            description: "The link has been copied to your clipboard.",
          });
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast({
            title: "Error",
            description: "Failed to copy link. Please try again.",
            variant: "destructive",
          });
        }
      },
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => {
        const whatsappUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        onOpenChange(false);
      },
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        window.open(facebookUrl, "_blank", "noopener,noreferrer");
        onOpenChange(false);
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-black hover:bg-gray-800",
      onClick: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        window.open(twitterUrl, "_blank", "noopener,noreferrer");
        onOpenChange(false);
      },
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      onClick: () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        window.open(linkedinUrl, "_blank", "noopener,noreferrer");
        onOpenChange(false);
      },
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-gray-600 hover:bg-gray-700",
      onClick: () => {
        const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%20${encodedUrl}`;
        window.location.href = emailUrl;
        onOpenChange(false);
      },
    },
  ];

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as any).share({
          title: title,
          text: shareText,
          url: url,
        });
        onOpenChange(false);
      } catch (err: any) {
        // User cancelled or error occurred
        if (err.name !== "AbortError") {
          toast({
            title: "Error",
            description: "Failed to share. Please try another method.",
            variant: "destructive",
          });
        }
      }
    } else {
      toast({
        title: "Not available",
        description: "Native sharing is not supported on your device.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Share2 className="w-5 h-5 text-blue-400" />
            Share Job
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Share this job opportunity with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Link Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Share Link
            </label>
            <div className="flex gap-2">
              <Input
                value={url}
                readOnly
                className="bg-black/40 border-white/10 text-white text-sm"
              />
              <Button
                onClick={shareOptions[0].onClick}
                className={`${shareOptions[0].color} text-white`}
                size="sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Share Options Grid */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Share via
            </label>
            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.name}
                    onClick={option.onClick}
                    className={`${option.color} text-white flex flex-col items-center gap-2 h-auto py-4 px-3`}
                    variant="default"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{option.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Native Share Button (if available) */}
          {typeof navigator !== "undefined" && "share" in navigator && (
            <Button
              onClick={handleNativeShare}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              variant="default"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share via Device
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

