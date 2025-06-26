
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, RefreshCw, Zap, Mic, Camera, Target, Clock } from 'lucide-react';
import { SearchConfiguration } from './types';

interface SearchConfigurationTabProps {
  configuration: SearchConfiguration;
}

export const SearchConfigurationTab: React.FC<SearchConfigurationTabProps> = ({ 
  configuration: initialConfig 
}) => {
  const [config, setConfig] = useState<SearchConfiguration>(initialConfig);
  const [hasChanges, setHasChanges] = useState(false);

  const updateConfig = (key: keyof SearchConfiguration, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateSearchWeights = (key: keyof SearchConfiguration['searchWeights'], value: number) => {
    setConfig(prev => ({
      ...prev,
      searchWeights: {
        ...prev.searchWeights,
        [key]: value / 100
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving configuration:', config);
    setHasChanges(false);
    // Here you would typically save to your backend
  };

  const handleReset = () => {
    setConfig(initialConfig);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Search Engine Configuration
            </span>
            <div className="flex space-x-2">
              {hasChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  Unsaved Changes
                </Badge>
              )}
              <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Search Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Basic Search Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Auto-complete</Label>
                <p className="text-sm text-gray-500">Show search suggestions as user types</p>
              </div>
              <Switch
                checked={config.enableAutoComplete}
                onCheckedChange={(checked) => updateConfig('enableAutoComplete', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Search Suggestions</Label>
                <p className="text-sm text-gray-500">Display popular searches and recommendations</p>
              </div>
              <Switch
                checked={config.enableSearchSuggestions}
                onCheckedChange={(checked) => updateConfig('enableSearchSuggestions', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Spell Check</Label>
                <p className="text-sm text-gray-500">Automatically correct spelling mistakes</p>
              </div>
              <Switch
                checked={config.enableSpellCheck}
                onCheckedChange={(checked) => updateConfig('enableSpellCheck', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Advanced Filters</Label>
                <p className="text-sm text-gray-500">Enable category, price, and other filters</p>
              </div>
              <Switch
                checked={config.enableFilters}
                onCheckedChange={(checked) => updateConfig('enableFilters', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Advanced Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mic className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <Label className="text-base font-medium">Voice Search</Label>
                  <p className="text-sm text-gray-500">Enable voice-to-text search functionality</p>
                </div>
              </div>
              <Switch
                checked={config.enableVoiceSearch}
                onCheckedChange={(checked) => updateConfig('enableVoiceSearch', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Camera className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <Label className="text-base font-medium">Image Search</Label>
                  <p className="text-sm text-gray-500">Search by uploading product images</p>
                </div>
              </div>
              <Switch
                checked={config.enableImageSearch}
                onCheckedChange={(checked) => updateConfig('enableImageSearch', checked)}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-base font-medium">Default Sort Order</Label>
              <Select
                value={config.defaultSortBy}
                onValueChange={(value) => updateConfig('defaultSortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Performance Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Maximum Results Per Page</Label>
              <p className="text-sm text-gray-500">Number of products to show in search results</p>
              <Input
                type="number"
                value={config.maxResults}
                onChange={(e) => updateConfig('maxResults', parseInt(e.target.value) || 50)}
                min="10"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Search Timeout (ms)</Label>
              <p className="text-sm text-gray-500">Maximum time to wait for search results</p>
              <Input
                type="number"
                value={config.searchTimeout}
                onChange={(e) => updateConfig('searchTimeout', parseInt(e.target.value) || 5000)}
                min="1000"
                max="30000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Relevance Weights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Search Relevance Weights
          </CardTitle>
          <p className="text-sm text-gray-600">Adjust how different product attributes influence search rankings</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-base font-medium">Product Title</Label>
                  <Badge variant="outline">{Math.round(config.searchWeights.title * 100)}%</Badge>
                </div>
                <Slider
                  value={[config.searchWeights.title * 100]}
                  onValueChange={(value) => updateSearchWeights('title', value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-base font-medium">Description</Label>
                  <Badge variant="outline">{Math.round(config.searchWeights.description * 100)}%</Badge>
                </div>
                <Slider
                  value={[config.searchWeights.description * 100]}
                  onValueChange={(value) => updateSearchWeights('description', value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-base font-medium">Tags</Label>
                  <Badge variant="outline">{Math.round(config.searchWeights.tags * 100)}%</Badge>
                </div>
                <Slider
                  value={[config.searchWeights.tags * 100]}
                  onValueChange={(value) => updateSearchWeights('tags', value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-base font-medium">Category</Label>
                  <Badge variant="outline">{Math.round(config.searchWeights.category * 100)}%</Badge>
                </div>
                <Slider
                  value={[config.searchWeights.category * 100]}
                  onValueChange={(value) => updateSearchWeights('category', value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Higher weights mean that attribute will have more influence on search rankings. 
              The total doesn't need to equal 100% as these are relative weights.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
