import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorInfo?: any;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  errorInfo 
}) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-700">Oops! Something went wrong</CardTitle>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          <p className="text-sm text-muted-foreground">
            দুঃখিত! একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isDevelopment && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <h4 className="font-semibold text-red-800 mb-2">Error Details (Development)</h4>
              <p className="text-sm text-red-700 font-mono break-words">
                {error.message}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-red-600 cursor-pointer">Stack Trace</summary>
                  <pre className="text-xs text-red-600 mt-1 overflow-x-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Button 
              onClick={resetError} 
              className="w-full"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleGoHome} 
              variant="outline" 
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>If this problem persists, please contact our support team.</p>
            <p className="text-xs">যদি এই সমস্যা বার বার হয়, আমাদের সাহায্য দলের সাথে যোগাযোগ করুন।</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};