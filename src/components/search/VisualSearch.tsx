import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface VisualSearchProps {
  onResult: (results: any[]) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function VisualSearch({ onResult, onError, className = '' }: VisualSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const processImage = async (imageFile: File | Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        setPreviewImage(imageData);
        
        // Simulate visual search processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock search results based on image analysis
        const mockResults = [
          {
            id: '1',
            name: 'Similar Blue Dress',
            price: 89.99,
            image: '/api/placeholder/200/200',
            similarity: 95,
            vendor: 'Fashion Store'
          },
          {
            id: '2',
            name: 'Navy Blue Maxi Dress',
            price: 75.50,
            image: '/api/placeholder/200/200',
            similarity: 87,
            vendor: 'Style Hub'
          },
          {
            id: '3',
            name: 'Blue Evening Dress',
            price: 120.00,
            image: '/api/placeholder/200/200',
            similarity: 82,
            vendor: 'Elegant Wear'
          }
        ];
        
        setSearchResults(mockResults);
        onResult(mockResults);
        setIsProcessing(false);
      };
      
      reader.onerror = () => {
        onError?.('Failed to process image');
        setIsProcessing(false);
      };
      
      reader.readAsDataURL(imageFile);
    } catch (error) {
      console.error('Visual search error:', error);
      onError?.('Visual search failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    } else {
      onError?.('Please select a valid image file');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraMode(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      onError?('Camera access denied. Please allow camera access or upload an image.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraMode(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        processImage(blob);
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  const resetSearch = () => {
    setPreviewImage(null);
    setSearchResults([]);
    setIsProcessing(false);
    stopCamera();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className={`hover-scale ${className}`}>
          <Camera className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Visual Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!previewImage && !isCameraMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover-scale" onClick={() => fileInputRef.current?.click()}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold">Upload Image</h3>
                  <p className="text-sm text-muted-foreground">Select from gallery</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover-scale" onClick={startCamera}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Camera className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold">Take Photo</h3>
                  <p className="text-sm text-muted-foreground">Use camera</p>
                </CardContent>
              </Card>
            </div>
          )}
          
          {isCameraMode && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <Button onClick={capturePhoto} size="lg" className="rounded-full">
                    <Camera className="w-5 h-5" />
                  </Button>
                  <Button onClick={stopCamera} variant="outline" size="lg" className="rounded-full">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
          
          {previewImage && (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={previewImage} 
                  alt="Search image" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  onClick={resetSearch}
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {isProcessing && (
                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Analyzing image...</span>
                  </CardContent>
                </Card>
              )}
              
              {searchResults.length > 0 && !isProcessing && (
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Similar Products Found
                  </h3>
                  
                  <div className="grid gap-3">
                    {searchResults.map((result) => (
                      <Card key={result.id} className="hover-scale cursor-pointer">
                        <CardContent className="flex items-center gap-4 p-4">
                          <img 
                            src={result.image} 
                            alt={result.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{result.name}</h4>
                            <p className="text-sm text-muted-foreground">{result.vendor}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-semibold">${result.price}</span>
                              <Badge variant="secondary">
                                {result.similarity}% match
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}