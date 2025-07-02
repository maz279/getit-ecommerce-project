import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  onClose?: () => void;
}

export function BengaliVoiceSearch({ onSearch, onClose }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'bn-BD'; // Bengali (Bangladesh)
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          handleSearch(transcript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        setError(`Voice recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      onSearch(query.trim());
      setTranscript('');
      onClose?.();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <Card className="p-4 w-full max-w-md">
        <Alert>
          <AlertDescription>
            Voice search is not supported in your browser. Please try using Chrome or Firefox.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="p-6 w-full max-w-md">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-lg font-semibold">বাংলা ভয়েস সার্চ</h3>
          <Badge variant="secondary">বিটা</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">
          মাইক্রোফোন বাটনে ক্লিক করে বাংলায় কথা বলুন
        </p>

        {/* Microphone Button */}
        <div className="relative">
          <Button
            onClick={isListening ? stopListening : startListening}
            size="lg"
            className={`rounded-full w-16 h-16 ${
              isListening ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
          
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-pulse" />
          )}
        </div>

        {/* Status */}
        {isListening && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm">শুনছি...</span>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm">{transcript}</p>
              {transcript && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakText(transcript)}
                  className="p-1"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Manual Search */}
        {transcript && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleSearch(transcript)}
              className="flex-1"
            >
              সার্চ করুন
            </Button>
            <Button
              variant="outline"
              onClick={() => setTranscript('')}
            >
              মুছুন
            </Button>
          </div>
        )}

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 টিপস:</p>
          <p>• স্পষ্ট করে বলুন</p>
          <p>• শান্ত পরিবেশে ব্যবহার করুন</p>
          <p>• পণ্যের নাম বা ক্যাটেগরি বলুন</p>
        </div>

        {onClose && (
          <Button variant="outline" onClick={onClose} className="w-full">
            বন্ধ করুন
          </Button>
        )}
      </div>
    </Card>
  );
}