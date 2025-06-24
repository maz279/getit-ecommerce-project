
import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  language, 
  onLanguageChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'BD', name: 'বাংলা', flag: '🇧🇩' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{currentLanguage.flag}</span>
        <span className="text-sm hidden sm:inline">{currentLanguage.code}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                  language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
