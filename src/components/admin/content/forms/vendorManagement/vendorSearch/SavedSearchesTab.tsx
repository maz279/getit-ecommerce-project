
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Play, Edit, Trash2, Share } from 'lucide-react';

export const SavedSearchesTab: React.FC = () => {
  const savedSearches = [
    {
      id: '1',
      name: 'High-Rating Electronics Vendors',
      description: 'Electronics vendors with 4.5+ rating and verified status',
      lastUsed: '2024-01-20',
      results: 156,
      frequency: 'Weekly'
    },
    {
      id: '2',
      name: 'New Fashion Vendors',
      description: 'Fashion vendors joined in the last 30 days',
      lastUsed: '2024-01-18',
      results: 23,
      frequency: 'Daily'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved Searches</h3>
        <Button>
          <Bookmark className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>
      
      {savedSearches.map(search => (
        <Card key={search.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{search.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{search.description}</p>
              </div>
              <Badge variant="outline">{search.frequency}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Last used: {search.lastUsed} • {search.results} results
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
