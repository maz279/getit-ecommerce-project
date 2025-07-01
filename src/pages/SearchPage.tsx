import React from 'react';

// Enhanced Search Component with performance optimizations
const EnhancedSearchComponent = React.lazy(() => import('@/components/search/EnhancedSearchComponent'));
const OptimizedSearchComponent = React.lazy(() => import('@/components/search/OptimizedSearchComponent'));

// Notification Center with real-time features
const NotificationCenter = React.lazy(() => import('@/components/notifications/NotificationCenter'));

const SearchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <OptimizedSearchComponent />
      </React.Suspense>
    </div>
  );
};

const NotificationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <NotificationCenter />
      </React.Suspense>
    </div>
  );
};

export { SearchPage, NotificationsPage };