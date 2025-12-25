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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  // Explicitly check for the admin email as requested for strict security
  const isAuthorizedAdmin = isAuthenticated && isAdmin && user?.email === 'harshadbagal77@gmail.com';

  if (isAuthorizedAdmin) {
    return <>{children}</>;
  }

  return <Navigate to="/real-projects" state={{ from: location }} replace />;
};

export default AdminRoute;

