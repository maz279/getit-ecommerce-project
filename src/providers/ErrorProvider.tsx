import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

interface ErrorContextType {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  clearError: () => void;
  reportError: (error: Error, errorInfo?: any) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const { toast } = useToast();

  const clearError = () => {
    setError(null);
    setErrorInfo(null);
  };

  const reportError = (error: Error, errorInfo?: any) => {
    setError(error);
    setErrorInfo(errorInfo);
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorProvider:', error);
      console.error('Error info:', errorInfo);
    }

    // Show user-friendly error message
    toast({
      title: 'Something went wrong',
      description: 'We\'ve encountered an unexpected error. Please try again.',
      variant: 'destructive',
    });

    // Here you could also send error to external service
    // sendErrorToService(error, errorInfo);
  };

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportError(new Error(event.reason), { source: 'unhandledRejection' });
    };

    const handleError = (event: ErrorEvent) => {
      reportError(new Error(event.message), { 
        source: 'windowError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno 
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ErrorContext.Provider value={{ error, errorInfo, clearError, reportError }}>
      {children}
    </ErrorContext.Provider>
  );
};