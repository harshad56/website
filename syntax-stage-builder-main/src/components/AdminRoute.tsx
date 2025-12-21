import { ReactNode, useEffect, useState, FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const adminAccessCode = (import.meta.env.VITE_ADMIN_ACCESS_CODE || 'SYNTAX-ADMIN').trim();
  const [overrideGranted, setOverrideGranted] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (adminAccessCode && localStorage.getItem('admin_access_override') === 'true') {
      setOverrideGranted(true);
    }
  }, [adminAccessCode]);

  const handleUnlock = (event: FormEvent) => {
    event.preventDefault();
    if (!adminAccessCode) return;

    if (passcode.trim() === adminAccessCode) {
      localStorage.setItem('admin_access_override', 'true');
      setOverrideGranted(true);
      setError('');
    } else {
      setError('Invalid admin access code');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && isAdmin) {
    return <>{children}</>;
  }

  if (!isAuthenticated && adminAccessCode) {
    if (overrideGranted) {
      return <>{children}</>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-900 flex items-center justify-center px-4">
        <Card className="max-w-md w-full bg-black/60 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="w-5 h-5 text-purple-400" />
              Admin Access
            </CardTitle>
            <p className="text-sm text-gray-400">
              Enter the private admin code to open the Real Projects control panel.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleUnlock}>
              <Input
                type="password"
                placeholder="Enter admin access code"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="bg-black/50 border-white/10 text-white"
                autoFocus
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                Unlock Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Navigate to="/real-projects" state={{ from: location }} replace />;
};

export default AdminRoute;

