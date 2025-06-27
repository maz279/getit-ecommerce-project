
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Save, Play, Trash2, Clock, Filter } from 'lucide-react';
import { savedSearches } from './mockData';
import { SavedSearch, SearchFilter } from './types';

interface SavedSearchesTabProps {
  onLoadSearch: (query: string, filters: SearchFilter[]) => void;
}

export const SavedSearchesTab: React.FC<SavedSearchesTabProps> = ({
  onLoadSearch
}) => {
  const [searches, setSearches] = useState<SavedSearch[]>(savedSearches);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');

  const handleLoadSearch = (search: SavedSearch) => {
    onLoadSearch(search.query, search.filters);
  };

  const handleDeleteSearch = (searchId: string) => {
    setSearches(prev => prev.filter(s => s.id !== searchId));
  };

  const handleCreateSearch = () => {
    // In a real app, this would save the current search state
    console.log('Creating new saved search:', newSearchName);
    setIsCreateDialogOpen(false);
    setNewSearchName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved Searches</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Current Search
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Search</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search-name">Search Name</Label>
                <Input
                  id="search-name"
                  placeholder="Enter a name for this search..."
                  value={newSearchName}
                  onChange={(e) => setNewSearchName(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSearch}>
                  Save Search
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {searches.map((search) => (
          <Card key={search.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-medium">{search.name}</h4>
                  {search.query && (
                    <p className="text-sm text-gray-600 mt-1">Query: "{search.query}"</p>
                  )}
                  
                  {search.filters.length > 0 && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {search.filters.map((filter, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {filter.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Created: {search.createdAt}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Search className="h-4 w-4" />
                      <span>Last used: {search.lastUsed}</span>
                    </div>
                    <Badge variant="secondary">
                      {search.resultCount} results
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadSearch(search)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSearch(search.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {searches.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Save className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved searches</h3>
            <p className="text-gray-600">
              Save your frequently used searches for quick access later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
