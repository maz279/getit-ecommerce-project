import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Star, ShoppingCart, Share, Trash2, Edit, Search, Grid, List, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WishlistItem {
  id: string;
  notes: string;
  priority: number;
  added_at: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    avgRating: number;
    reviewCount: number;
    inStock: boolean;
  };
}

export const EnhancedWishlist: React.FC = () => {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterPriority, setFilterPriority] = useState('all');
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editPriority, setEditPriority] = useState(1);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/wishlist-api',
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.wishlistItems);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/wishlist-api?product_id=${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
        toast({
          title: "Removed from Wishlist",
          description: "Product removed from your wishlist"
        });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove from wishlist",
        variant: "destructive"
      });
    }
  };

  const updateWishlistItem = async () => {
    if (!editingItem) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('wishlists')
        .update({
          notes: editNotes,
          priority: editPriority
        })
        .eq('id', editingItem.id);

      if (!error) {
        setWishlistItems(prev => prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, notes: editNotes, priority: editPriority }
            : item
        ));
        setEditingItem(null);
        toast({
          title: "Updated",
          description: "Wishlist item updated successfully"
        });
      }
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist item",
        variant: "destructive"
      });
    }
  };

  const shareWishlist = async () => {
    try {
      const shareData = {
        title: 'My Wishlist',
        text: `Check out my wishlist with ${wishlistItems.length} items!`,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Wishlist link copied to clipboard"
        });
      }
    } catch (error) {
      console.error('Error sharing wishlist:', error);
    }
  };

  const filteredAndSortedItems = wishlistItems
    .filter(item => {
      const matchesSearch = item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || item.priority.toString() === filterPriority;
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
        case 'oldest':
          return new Date(a.added_at).getTime() - new Date(b.added_at).getTime();
        case 'price_low':
          return a.product.price - b.product.price;
        case 'price_high':
          return b.product.price - a.product.price;
        case 'priority':
          return b.priority - a.priority;
        case 'name':
          return a.product.name.localeCompare(b.product.name);
        default:
          return 0;
      }
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const openEditDialog = (item: WishlistItem) => {
    setEditingItem(item);
    setEditNotes(item.notes || '');
    setEditPriority(item.priority);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Wishlist ({wishlistItems.length})</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={shareWishlist}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search wishlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="1">Low Priority</SelectItem>
            <SelectItem value="2">Medium Priority</SelectItem>
            <SelectItem value="3">High Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Wishlist Items */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || filterPriority !== 'all' ? 'No items match your filters' : 'Your wishlist is empty'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterPriority !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Add products to your wishlist to see them here'
            }
          </p>
          {(!searchQuery && filterPriority === 'all') && (
            <Button onClick={() => window.location.href = '/categories'}>
              Browse Products
            </Button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredAndSortedItems.map((item) => (
            <Card key={item.id} className={viewMode === 'list' ? 'flex' : ''}>
              {viewMode === 'list' ? (
                <>
                  <img
                    src={item.product.images[0] || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    className="w-32 h-32 object-cover rounded-l-lg"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(Math.round(item.product.avgRating))}
                          <span className="text-sm text-gray-500">({item.product.reviewCount})</span>
                          <Badge variant={
                            item.priority === 3 ? 'destructive' : 
                            item.priority === 2 ? 'default' : 
                            'secondary'
                          }>
                            {item.priority === 3 ? 'High' : item.priority === 2 ? 'Medium' : 'Low'} Priority
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.product.description}</p>
                        {item.notes && (
                          <p className="text-sm italic text-gray-500 mb-2">"{item.notes}"</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">৳{item.product.price}</span>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => openEditDialog(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => removeFromWishlist(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" disabled={!item.product.inStock}>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              {item.product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <img
                      src={item.product.images[0] || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge 
                      className="absolute top-2 left-2"
                      variant={
                        item.priority === 3 ? 'destructive' : 
                        item.priority === 2 ? 'default' : 
                        'secondary'
                      }
                    >
                      {item.priority === 3 ? 'High' : item.priority === 2 ? 'Medium' : 'Low'} Priority
                    </Badge>
                    {!item.product.inStock && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(Math.round(item.product.avgRating))}
                      <span className="text-sm text-gray-500 ml-1">
                        ({item.product.reviewCount})
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-xs italic text-gray-500 mb-2 line-clamp-2">"{item.notes}"</p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-primary">৳{item.product.price}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        onClick={() => openEditDialog(item)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => removeFromWishlist(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-2" 
                      disabled={!item.product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {item.product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wishlist Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add a note about this item..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select value={editPriority.toString()} onValueChange={(value) => setEditPriority(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low Priority</SelectItem>
                  <SelectItem value="2">Medium Priority</SelectItem>
                  <SelectItem value="3">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={updateWishlistItem} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};