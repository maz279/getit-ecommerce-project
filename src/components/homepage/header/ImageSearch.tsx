
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, QrCode } from 'lucide-react';

interface ImageSearchProps {
  onImageSearch: (file: File) => void;
  onQRSearch: (file: File) => void;
  isLoading: boolean;
  type: 'image' | 'qr';
}

export const ImageSearch: React.FC<ImageSearchProps> = ({
  onImageSearch,
  onQRSearch,
  isLoading,
  type
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'image') {
        onImageSearch(file);
      } else {
        onQRSearch(file);
      }
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600"
        title={type === 'image' ? 'Image Search' : 'QR Search'}
      >
        {type === 'image' ? (
          <Camera className="w-4 h-4" />
        ) : (
          <QrCode className="w-4 h-4" />
        )}
      </Button>
    </>
  );
};
