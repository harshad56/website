import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-destructive/10 rounded-full p-6">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold gradient-text mb-2">404</h1>
          <p className="text-2xl font-bold text-foreground mb-2">Page Not Found</p>
          <p className="text-muted-foreground mb-2">
            The page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Path: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
