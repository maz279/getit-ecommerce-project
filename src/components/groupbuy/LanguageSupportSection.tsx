
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, MessageSquare } from 'lucide-react';

export const LanguageSupportSection: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'bn'>('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩', native: 'বাংলা' }
  ];

  const features = [
    {
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      title: currentLanguage === 'en' ? 'Multilingual Interface' : 'বহুভাষিক ইন্টারফেস',
      description: currentLanguage === 'en' 
        ? 'Full support for Bengali and English languages'
        : 'বাংলা এবং ইংরেজি ভাষার সম্পূর্ণ সাপোর্ট'
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-green-600" />,
      title: currentLanguage === 'en' ? 'Local Communication' : 'স্থানীয় যোগাযোগ',
      description: currentLanguage === 'en' 
        ? 'Chat with group members in your preferred language'
        : 'আপনার পছন্দের ভাষায় গ্রুপ সদস্যদের সাথে চ্যাট করুন'
    }
  ];

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {currentLanguage === 'en' ? '🌍 Language Support' : '🌍 ভাষা সাপোর্ট'}
          </h2>
          <p className="text-xl text-gray-600">
            {currentLanguage === 'en' 
              ? 'Shop in your preferred language across Bangladesh'
              : 'বাংলাদেশ জুড়ে আপনার পছন্দের ভাষায় কেনাকাটা করুন'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">
                  {currentLanguage === 'en' ? 'Language Features' : 'ভাষার বৈশিষ্ট্য'}
                </h3>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">
                  {currentLanguage === 'en' ? 'Choose Your Language' : 'আপনার ভাষা বেছে নিন'}
                </h3>
                
                <div className="space-y-4 mb-8">
                  {languages.map((lang) => (
                    <div 
                      key={lang.code}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        currentLanguage === lang.code 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setCurrentLanguage(lang.code as 'en' | 'bn')}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <div className="font-bold">{lang.native}</div>
                          <div className="text-sm text-gray-600">{lang.name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={toggleLanguage}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {currentLanguage === 'en' ? 'Switch to বাংলা' : 'Switch to English'}
                </Button>
                
                <div className="mt-6 text-sm text-gray-500">
                  {currentLanguage === 'en' 
                    ? 'More languages coming soon!'
                    : 'শীঘ্রই আরও ভাষা আসছে!'
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
