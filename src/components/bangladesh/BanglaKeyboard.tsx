import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Globe, X, Space, ArrowLeft, ArrowUp } from 'lucide-react';

interface BanglaKeyboardProps {
  onTextChange: (text: string) => void;
  isVisible: boolean;
  onToggle: () => void;
  placeholder?: string;
  value?: string;
}

export const BanglaKeyboard: React.FC<BanglaKeyboardProps> = ({
  onTextChange,
  isVisible,
  onToggle,
  placeholder = 'Type in Bangla...',
  value = ''
}) => {
  const [currentText, setCurrentText] = useState(value);
  const [isShift, setIsShift] = useState(false);
  const [layout, setLayout] = useState<'phonetic' | 'traditional'>('phonetic');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Phonetic layout mapping (English to Bangla)
  const phoneticMapping: Record<string, string> = {
    // Vowels
    'a': 'া', 'aa': 'আ', 'i': 'ি', 'ii': 'ী', 'u': 'ু', 'uu': 'ূ',
    'e': 'ে', 'oi': 'ৈ', 'o': 'ো', 'ou': 'ৌ',
    
    // Consonants
    'k': 'ক', 'kh': 'খ', 'g': 'গ', 'gh': 'ঘ', 'ng': 'ঙ',
    'ch': 'চ', 'chh': 'ছ', 'j': 'জ', 'jh': 'ঝ', 'yn': 'ঞ',
    't': 'ট', 'th': 'ঠ', 'd': 'ড', 'dh': 'ঢ', 'n': 'ন',
    'p': 'প', 'ph': 'ফ', 'b': 'ব', 'bh': 'ভ', 'm': 'ম',
    'z': 'য', 'r': 'র', 'l': 'ল', 'sh': 'শ', 's': 'স',
    'h': 'হ', 'rr': 'ড়', 'rrh': 'ঢ়', 'y': 'য়',
    
    // Numbers
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };

  // Traditional Bangla keyboard layout
  const traditionalLayout = [
    ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '০'],
    ['ড়', 'ৈ', 'া', 'ী', 'ূ', 'ব', 'হ', 'গ', 'দ', 'জ', 'ড', '়'],
    ['ো', 'ে', 'ি', 'ু', 'ক', 'ত', 'চ', 'ট', 'া', 'প', 'ড', 'া'],
    ['ৌ', 'য', 'থ', 'খ', 'ধ', 'শ', 'য', 'ব', 'ন', 'ম', '।'],
    ['ৎ', 'ং', 'ভ', 'র', 'ল', 'স', 'ফ', 'দ', 'গ', 'ক']
  ];

  // Phonetic helper layout
  const phoneticKeys = [
    ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '০'],
    ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ'],
    ['ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন'],
    ['প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ'],
    ['স', 'হ', 'ড়', 'ঢ়', 'য়', 'ৎ', 'ং', 'ঃ', 'ঁ']
  ];

  const vowelKeys = ['া', 'ি', 'ী', 'ু', 'ূ', 'ৃ', 'ে', 'ৈ', 'ো', 'ৌ'];

  useEffect(() => {
    setCurrentText(value);
  }, [value]);

  const insertText = (char: string) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = currentText.slice(0, start) + char + currentText.slice(end);
    
    setCurrentText(newText);
    onTextChange(newText);
    
    // Move cursor after inserted character
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + char.length;
      textarea.focus();
    }, 0);
  };

  const handleBackspace = () => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      // Delete selection
      const newText = currentText.slice(0, start) + currentText.slice(end);
      setCurrentText(newText);
      onTextChange(newText);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start;
        textarea.focus();
      }, 0);
    } else if (start > 0) {
      // Delete previous character
      const newText = currentText.slice(0, start - 1) + currentText.slice(start);
      setCurrentText(newText);
      onTextChange(newText);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start - 1;
        textarea.focus();
      }, 0);
    }
  };

  const handleSpace = () => {
    insertText(' ');
  };

  const handleEnter = () => {
    insertText('\n');
  };

  const convertPhonetic = (input: string): string => {
    let result = input;
    
    // Sort by length (longest first) to handle multi-character mappings
    const sortedKeys = Object.keys(phoneticMapping).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      const regex = new RegExp(key, 'gi');
      result = result.replace(regex, phoneticMapping[key]);
    }
    
    return result;
  };

  const handlePhoneticInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    const converted = layout === 'phonetic' ? convertPhonetic(input) : input;
    setCurrentText(converted);
    onTextChange(converted);
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <Keyboard className="w-4 h-4 mr-2" />
        বাংলা
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-50 border-b">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">বাংলা কীবোর্ড</span>
              <Badge variant="outline" className="text-xs">
                {layout === 'phonetic' ? 'Phonetic' : 'Traditional'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLayout(layout === 'phonetic' ? 'traditional' : 'phonetic')}
              >
                <Globe className="w-4 h-4 mr-1" />
                {layout === 'phonetic' ? 'Traditional' : 'Phonetic'}
              </Button>
              <Button variant="outline" size="sm" onClick={onToggle}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Text Area */}
          <div className="p-4 border-b bg-white">
            <textarea
              ref={textAreaRef}
              value={currentText}
              onChange={handlePhoneticInput}
              placeholder={placeholder}
              className="w-full h-24 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              style={{ fontFamily: 'SolaimanLipi, Arial, sans-serif' }}
            />
          </div>

          {/* Keyboard Layout */}
          <div className="p-4 bg-gray-50 max-h-80 overflow-y-auto">
            {layout === 'phonetic' && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 mb-2">
                  <strong>Phonetic Guide:</strong> Type English letters to get Bangla characters
                </p>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  <span>k=ক</span>
                  <span>kh=খ</span>
                  <span>g=গ</span>
                  <span>ch=চ</span>
                  <span>j=জ</span>
                </div>
              </div>
            )}

            {/* Keyboard Grid */}
            <div className="space-y-2">
              {/* Numbers Row */}
              <div className="flex gap-1 justify-center">
                {(layout === 'phonetic' ? phoneticKeys[0] : traditionalLayout[0]).map((key, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => insertText(key)}
                    className="w-10 h-10 p-0 text-lg"
                  >
                    {key}
                  </Button>
                ))}
              </div>

              {/* Main Keyboard Rows */}
              {(layout === 'phonetic' ? phoneticKeys.slice(1) : traditionalLayout.slice(1)).map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1 justify-center">
                  {row.map((key, keyIndex) => (
                    <Button
                      key={keyIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => insertText(key)}
                      className="w-10 h-10 p-0 text-lg hover:bg-blue-100"
                    >
                      {key}
                    </Button>
                  ))}
                </div>
              ))}

              {/* Vowel Row */}
              <div className="flex gap-1 justify-center flex-wrap">
                {vowelKeys.map((vowel, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => insertText(vowel)}
                    className="w-10 h-10 p-0 text-lg bg-yellow-50 hover:bg-yellow-100 border-yellow-300"
                  >
                    {vowel}
                  </Button>
                ))}
              </div>

              {/* Function Keys */}
              <div className="flex gap-2 justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsShift(!isShift)}
                  className={`px-4 py-2 ${isShift ? 'bg-blue-100' : ''}`}
                >
                  <ArrowUp className="w-4 h-4 mr-1" />
                  Shift
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleSpace}
                  className="px-8 py-2"
                >
                  <Space className="w-4 h-4 mr-1" />
                  Space
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleBackspace}
                  className="px-4 py-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Backspace
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleEnter}
                  className="px-4 py-2"
                >
                  Enter
                </Button>
              </div>

              {/* Common Phrases */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Common Phrases:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'ধন্যবাদ', 'স্বাগতম', 'দুঃখিত', 'অভিনন্দন', 
                    'শুভ সকাল', 'শুভ সন্ধ্যা', 'কেমন আছেন?', 'এখনই কিনুন'
                  ].map((phrase, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => insertText(phrase)}
                      className="text-sm bg-green-50 hover:bg-green-100 border border-green-200"
                    >
                      {phrase}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-100 text-center text-xs text-gray-600">
            <p>Use phonetic typing (k=ক, kh=খ) or click on keys directly • Switch layouts using the Globe button</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};