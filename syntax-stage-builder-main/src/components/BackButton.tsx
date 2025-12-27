import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { memo } from "react";

interface BackButtonProps {
  label?: string;
  className?: string;
  to?: string; // Optional: specify where to navigate to instead of using browser history
  fallback?: string; // Optional: where to go if history is empty/short
}

export const BackButton = memo(({
  label = "Back",
  className = "",
  to,
  fallback
}: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // 1. If 'to' prop is provided, navigate there directly
    if (to) {
      navigate(to);
      return;
    }

    // 2. Priority: Browser history navigation (navigate(-1))
    // We strictly use history back if we have history to pop, to avoid stack buildup
    // window.history.length > 2 is a heuristic; most internal navigation chains > 2
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // 3. Fallback: explicit fallback route, state from, or home
      if (fallback) {
        navigate(fallback);
      } else if (location.state?.from) {
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
        bg-gradient-to-r from-indigo-500/20 via-indigo-500/10 to-transparent
        hover:from-indigo-500/30 hover:via-indigo-500/20 hover:to-indigo-500/10
        border border-indigo-400/30 hover:border-indigo-400/60
        rounded-lg text-slate-100
        font-semibold text-sm
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:shadow-indigo-500/30
        hover:-translate-y-0.5
        active:translate-y-0
        backdrop-blur-sm
        ${className}
      `}
    >
      <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 text-indigo-300" />
      <span className="relative z-10">{label}</span>
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/20 group-hover:via-indigo-500/10 group-hover:to-indigo-500/0 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
    </button>
  );
});

BackButton.displayName = 'BackButton';

