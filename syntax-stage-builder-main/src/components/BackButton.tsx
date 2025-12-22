import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { memo } from "react";

interface BackButtonProps {
  label?: string;
  className?: string;
  to?: string; // Optional: specify where to navigate to instead of using browser history
}

export const BackButton = memo(({
  label = "Back",
  className = "",
  to
}: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // 1. If 'to' prop is provided, navigate there directly
    if (to) {
      navigate(to);
      return;
    }

    // 2. Fallback: check if there's history to go back to
    // Priority: Browser history for single-page app feel
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // 3. Last resort: check location state or go home
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`
        group relative inline-flex items-center gap-2 px-4 py-2.5
        bg-gradient-to-r from-primary/10 via-primary/5 to-transparent
        hover:from-primary/20 hover:via-primary/10 hover:to-primary/5
        border border-primary/20 hover:border-primary/40
        rounded-lg text-foreground
        font-medium text-sm
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:shadow-primary/20
        hover:-translate-y-0.5
        active:translate-y-0
        backdrop-blur-sm
        ${className}
      `}
    >
      <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
      <span className="relative z-10">{label}</span>
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/0 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
    </button>
  );
});

BackButton.displayName = 'BackButton';

