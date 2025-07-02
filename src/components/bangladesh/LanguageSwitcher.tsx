import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  onLanguageChange?: (language: string) => void;
  showFullSelector?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  onLanguageChange,
  showFullSelector = false
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
    
    // Apply language to document
    document.documentElement.lang = language;
    
    // Notify parent component
    onLanguageChange?.(language);
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'bn' : 'en';
    handleLanguageChange(newLanguage);
  };

  if (showFullSelector) {
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <Select value={currentLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">
              <div className="flex items-center gap-2">
                <span>🇺🇸</span>
                <span>English</span>
              </div>
            </SelectItem>
            <SelectItem value="bn">
              <div className="flex items-center gap-2">
                <span>🇧🇩</span>
                <span>বাংলা</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1 text-sm"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {currentLanguage === 'en' ? 'EN' : 'বং'}
      </span>
    </Button>
  );
};