import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface LanguageSwitcherProps {
  currentLanguage?: 'en' | 'bn';
  onLanguageChange?: (language: 'en' | 'bn') => void;
  variant?: 'button' | 'dropdown' | 'toggle';
  size?: 'sm' | 'md' | 'lg';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage = 'en',
  onLanguageChange,
  variant = 'dropdown',
  size = 'md'
}) => {
  const [language, setLanguage] = useState<'en' | 'bn'>(currentLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTranslations();
  }, [language]);

  const loadTranslations = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('bangladesh-localization', {
        body: {
          action: 'get_translations',
          language,
          category: 'ui'
        }
      });

      if (error) throw error;
      if (data?.success) {
        setTranslations(data.data);
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  };

  const handleLanguageChange = (newLanguage: 'en' | 'bn') => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
    localStorage.setItem('preferred-language', newLanguage);
  };

  const getLanguageLabel = (lang: 'en' | 'bn') => {
    return lang === 'en' ? 'English' : 'বাংলা';
  };

  const getLanguageFlag = (lang: 'en' | 'bn') => {
    return lang === 'en' ? '🇺🇸' : '🇧🇩';
  };

  if (variant === 'toggle') {
    return (
      <div className="flex items-center bg-muted rounded-lg p-1">
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size={size === 'sm' ? 'sm' : 'default'}
          onClick={() => handleLanguageChange('en')}
          className="h-8 px-3 text-xs"
        >
          🇺🇸 EN
        </Button>
        <Button
          variant={language === 'bn' ? 'default' : 'ghost'}
          size={size === 'sm' ? 'sm' : 'default'}
          onClick={() => handleLanguageChange('bn')}
          className="h-8 px-3 text-xs"
        >
          🇧🇩 বাং
        </Button>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size={size === 'sm' ? 'sm' : 'default'}
        onClick={() => handleLanguageChange(language === 'en' ? 'bn' : 'en')}
        className="gap-2"
      >
        {getLanguageFlag(language)}
        {getLanguageLabel(language)}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={size === 'sm' ? 'sm' : 'default'}
          className="gap-2"
        >
          {getLanguageFlag(language)}
          {getLanguageLabel(language)}
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            🇺🇸 English
          </div>
          {language === 'en' && <Badge variant="secondary">Current</Badge>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('bn')}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            🇧🇩 বাংলা
          </div>
          {language === 'bn' && <Badge variant="secondary">বর্তমান</Badge>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};