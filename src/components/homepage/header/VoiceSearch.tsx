import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceSearchProps {
  onVoiceSearch: (audioBlob: Blob) => void;
  isLoading: boolean;
  language?: 'bn' | 'en';
  onVoiceCommand?: (command: string) => void;
}

// Add proper speech recognition types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInterface {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onVoiceSearch,
  isLoading,
  language = 'bn',
  onVoiceCommand
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recognition, setRecognition] = useState<SpeechRecognitionInterface | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition() as SpeechRecognitionInterface;
      
      // Configure for Bangla and English support
      recognitionInstance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
      recognitionInstance.interimResults = true;
      recognitionInstance.continuous = true;
      recognitionInstance.maxAlternatives = 3;
      
      // Handle regional Bangladeshi variations
      if (language === 'bn') {
        recognitionInstance.lang = 'bn-BD';
      }

      recognitionInstance.onresult = (event) => {
        const results = Array.from(event.results);
        const transcript = results
          .map(result => result[0].transcript)
          .join('');
        
        console.log('Speech recognition result:', transcript);
        
        // Check for voice commands
        if (onVoiceCommand && transcript.toLowerCase().includes('command')) {
          onVoiceCommand(transcript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language, onVoiceCommand]);

  // Audio level monitoring
  const monitorAudioLevel = (stream: MediaStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateAudioLevel = () => {
      if (analyserRef.current && isRecording) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
        setAudioLevel(average);
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      }
    };

    updateAudioLevel();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });
      
      // Start audio level monitoring
      monitorAudioLevel(stream);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        onVoiceSearch(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        
        // Clean up audio monitoring
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      
      // Also start speech recognition for live commands
      if (recognition) {
        recognition.start();
        setIsListening(true);
      }
      
      console.log(`Voice recording started in ${language === 'bn' ? 'Bengali' : 'English'} mode with accent recognition`);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
    
    console.log('Voice recording stopped');
  };

  const handleClick = () => {
    if (isLoading) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getTitle = () => {
    if (isLoading) return 'Processing...';
    if (isRecording) return `Stop Recording (${language === 'bn' ? 'বাংলা' : 'English'})`;
    return `Voice Search (${language === 'bn' ? 'বাংলা' : 'English'})`;
  };

  // Audio level visualization
  const audioLevelWidth = Math.min((audioLevel / 255) * 100, 100);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className={`p-1.5 hover:bg-gray-100 rounded-full transition-all relative ${
          isRecording 
            ? 'text-red-500 animate-pulse bg-red-50' 
            : isLoading 
              ? 'text-orange-500' 
              : 'text-gray-600'
        }`}
        title={getTitle()}
      >
        {isRecording ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        
        {/* Audio level indicator */}
        {isRecording && (
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-200 rounded">
            <div 
              className="h-full bg-red-500 rounded transition-all duration-100"
              style={{ width: `${audioLevelWidth}%` }}
            />
          </div>
        )}
      </Button>
      
      {/* Recording status indicator */}
      {isRecording && (
        <div className="absolute -top-2 -right-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
      )}
      
      {/* Language indicator */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        {language === 'bn' ? 'বাং' : 'EN'}
      </div>
    </div>
  );
};

// Add global speech recognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
