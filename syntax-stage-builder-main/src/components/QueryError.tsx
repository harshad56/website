import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

interface QueryErrorProps {
  error: Error;
  refetch?: () => void;
  title?: string;
  description?: string;
}

/**
 * Component for displaying query errors with retry functionality
 */
export const QueryError = ({ 
  error, 
  refetch, 
  title = 'Failed to load data',
  description 
}: QueryErrorProps) => {
  const isNetworkError = 
    error.message.includes('fetch') || 
    error.message.includes('network') ||
    error.message.includes('Failed to fetch');

  const errorMessage = description || error.message || 'An unexpected error occurred';

  return (
    <Alert variant="destructive" className="my-4">
      <div className="flex items-start gap-3">
        {isNetworkError ? (
          <WifiOff className="h-5 w-5 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 mt-0.5" />
        )}
        <div className="flex-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-3">{errorMessage}</p>
            {isNetworkError && (
              <p className="text-sm mb-3">
                Please check your internet connection and try again.
              </p>
            )}
            {refetch && (
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            )}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};


