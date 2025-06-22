
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface VoiceSearchProps {
  onVoiceSearch: (audioBlob: Blob) => void;
  isLoading: boolean;
  language?: 'bn' | 'en';
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onVoiceSearch,
  isLoading,
  language = 'bn'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
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
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      
      console.log(`Voice recording started in ${language === 'bn' ? 'Bengali' : 'English'} mode`);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Voice recording stopped');
    }
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

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className={`p-1.5 hover:bg-gray-100 rounded-full transition-all ${
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
    </Button>
  );
};
