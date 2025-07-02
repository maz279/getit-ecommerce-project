import React, { useState } from 'react';
import { Share2, Facebook, Instagram, Copy, MessageSquare, Mail, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProductSharingProps {
  product: {
    id: string;
    name: string;
    price: number;
    discounted_price?: number;
    image_url: string;
    description: string;
    vendor_name?: string;
  };
  trigger?: React.ReactNode;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  shareUrl: (url: string, text: string) => string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    shareUrl: (url, text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageSquare,
    color: 'bg-green-500',
    shareUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: MessageSquare,
    color: 'bg-blue-500',
    shareUrl: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    shareUrl: (url, text) => `https://www.instagram.com/?url=${encodeURIComponent(url)}`
  }
];

export const ProductSharing: React.FC<ProductSharingProps> = ({ 
  product, 
  trigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Share2 className="w-4 h-4" />
      Share
    </Button>
  )
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const productUrl = `${window.location.origin}/product/${product.id}${user ? `?ref=${user.id}` : ''}`;
  const defaultMessage = `Check out this amazing product: ${product.name} - Only ৳${product.discounted_price || product.price} on GetIt Bangladesh!`;

  const handleSocialShare = async (platform: SocialPlatform) => {
    setIsSharing(true);
    
    try {
      const shareText = customMessage || defaultMessage;
      const shareUrl = platform.shareUrl(productUrl, shareText);
      
      // Track the share
      await supabase.functions.invoke('social-commerce-engine', {
        body: {
          action: 'share_product',
          userId: user?.id,
          productId: product.id,
          platform: platform.id,
          socialData: {
            message: shareText,
            url: productUrl
          }
        }
      });

      // Open share window
      window.open(shareUrl, '_blank', 'width=600,height=600');
      
      toast({
        title: "Shared Successfully",
        description: `Product shared on ${platform.name}`
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Error sharing product:', error);
      toast({
        title: "Share Failed",
        description: "Unable to share product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      
      // Track copy action
      await supabase.functions.invoke('social-commerce-engine', {
        body: {
          action: 'track_social_interaction',
          userId: user?.id,
          sessionId: product.id,
          interactionType: 'copy_link',
          content: productUrl
        }
      });

      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please try manual selection.",
        variant: "destructive"
      });
    }
  };

  const handleEmailShare = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);

    try {
      const shareText = customMessage || defaultMessage;
      const emailSubject = `Check out this product: ${product.name}`;
      const emailBody = `${shareText}\n\nView Product: ${productUrl}\n\nShared from GetIt Bangladesh`;

      // Create mailto link
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;

      // Track email share
      await supabase.functions.invoke('social-commerce-engine', {
        body: {
          action: 'share_product',
          userId: user?.id,
          productId: product.id,
          platform: 'email',
          socialData: {
            recipient: email,
            message: shareText
          }
        }
      });

      toast({
        title: "Email Share",
        description: "Email client opened with share content"
      });

      setEmail('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error sharing via email:', error);
      toast({
        title: "Email Share Failed",
        description: "Unable to open email client",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: customMessage || defaultMessage,
          url: productUrl
        });

        // Track native share
        await supabase.functions.invoke('social-commerce-engine', {
          body: {
            action: 'track_social_interaction',
            userId: user?.id,
            sessionId: product.id,
            interactionType: 'native_share',
            content: customMessage || defaultMessage
          }
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Native share cancelled or failed:', error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.vendor_name && `by ${product.vendor_name}`}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-primary">
                      ৳{product.discounted_price || product.price}
                    </span>
                    {product.discounted_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ৳{product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label>Custom Message (Optional)</Label>
            <Textarea
              placeholder={defaultMessage}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Social Platforms */}
          <div className="space-y-3">
            <Label>Share on Social Media</Label>
            <div className="grid grid-cols-2 gap-3">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    variant="outline"
                    onClick={() => handleSocialShare(platform)}
                    disabled={isSharing}
                    className="justify-start gap-3 h-12"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${platform.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    {platform.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Native Share */}
          {navigator.share && (
            <Button
              variant="outline"
              onClick={handleNativeShare}
              className="w-full justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              More Sharing Options
            </Button>
          )}

          {/* Email Share */}
          <div className="space-y-3">
            <Label>Share via Email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleEmailShare} disabled={isSharing}>
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-3">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input
                value={productUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};