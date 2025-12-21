import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthSuccess } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Missing authentication token.");
      return;
    }

    handleOAuthSuccess(token)
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
      });
  }, [handleOAuthSuccess, navigate, token]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h1 className="text-2xl font-semibold mb-2">Sign-in failed</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => navigate("/sign-in")} className="w-full">
            Return to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <p className="text-lg font-medium">Completing secure sign-in...</p>
        <p className="text-sm text-muted-foreground">
          This will only take a moment. Please do not close this window.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;


