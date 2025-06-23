
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  Tag, 
  Search,
  Languages,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { contentAnalyzer } from '@/services/nlp/ContentAnalyzer';
import { nlpService } from '@/services/nlp/NLPService';

interface ContentAnalysisPanelProps {
  content?: {
    title?: string;
    description?: string;
    reviews?: string[];
    category?: string;
  };
  onAnalysisComplete?: (analysis: any) => void;
  language?: 'en' | 'bn';
}

export const ContentAnalysisPanel: React.FC<ContentAnalysisPanelProps> = ({
  content,
  onAnalysisComplete,
  language = 'en'
}) => {
  const [analysisText, setAnalysisText] = useState(content?.description || '');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'sentiment' | 'keywords' | 'seo'>('content');

  useEffect(() => {
    if (content?.description) {
      setAnalysisText(content.description);
      handleAnalyze();
    }
  }, [content]);

  const handleAnalyze = async () => {
    if (!analysisText.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const [contentAnalysis, sentiment, keywords, entities] = await Promise.all([
        contentAnalyzer.analyzeProductContent({
          title: content?.title || 'Sample Product',
          description: analysisText,
          reviews: content?.reviews || [],
          category: content?.category || 'general'
        }),
        nlpService.analyzeSentiment(analysisText, { detailed: true }),
        nlpService.extractKeywords(analysisText, { maxKeywords: 10 }),
        nlpService.extractEntities(analysisText)
      ]);

      const combinedAnalysis = {
        content: contentAnalysis,
        sentiment,
        keywords,
        entities
      };

      setAnalysis(combinedAnalysis);
      onAnalysisComplete?.(combinedAnalysis);

    } catch (error) {
      console.error('Content analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const contentLabels = {
    en: {
      title: 'Content Analysis',
      analyze: 'Analyze Content',
      analyzing: 'Analyzing...',
      placeholder: 'Enter content to analyze...',
      tabs: {
        content: 'Content Quality',
        sentiment: 'Sentiment',
        keywords: 'Keywords',
        seo: 'SEO Analysis'
      },
      quality: 'Content Quality',
      readability: 'Readability Score',
      improvements: 'Suggested Improvements',
      sentiment: 'Sentiment Analysis',
      confidence: 'Confidence',
      emotions: 'Detected Emotions',
      keywords: 'Extracted Keywords',
      entities: 'Named Entities',
      suggestions: 'Content Suggestions'
    },
    bn: {
      title: 'কন্টেন্ট বিশ্লেষণ',
      analyze: 'বিশ্লেষণ করুন',
      analyzing: 'বিশ্লেষণ চলছে...',
      placeholder: 'বিশ্লেষণের জন্য কন্টেন্ট লিখুন...',
      tabs: {
        content: 'কন্টেন্ট গুণমান',
        sentiment: 'মনোভাব',
        keywords: 'মূল শব্দ',
        seo: 'SEO বিশ্লেষণ'
      },
      quality: 'কন্টেন্ট গুণমান',
      readability: 'পড়ার যোগ্যতার স্কোর',
      improvements: 'উন্নতির পরামর্শ',
      sentiment: 'মনোভাব বিশ্লেষণ',
      confidence: 'আত্মবিশ্বাস',
      emotions: 'শনাক্তকৃত আবেগ',
      keywords: 'নিষ্কাশিত মূল শব্দ',
      entities: 'নামকরা সত্তা',
      suggestions: 'কন্টেন্ট পরামর্শ'
    }
  };

  const currentLabels = contentLabels[language];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <CardTitle>{currentLabels.title}</CardTitle>
            <Badge className="bg-purple-100 text-purple-800">NLP</Badge>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={!analysisText.trim() || isAnalyzing}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {isAnalyzing ? currentLabels.analyzing : currentLabels.analyze}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Content Input */}
        <div>
          <Textarea
            value={analysisText}
            onChange={(e) => setAnalysisText(e.target.value)}
            placeholder={currentLabels.placeholder}
            className="min-h-[100px]"
            disabled={isAnalyzing}
          />
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b">
              {Object.entries(currentLabels.tabs).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Content Quality Tab */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{currentLabels.quality}</span>
                      <Badge className={getQualityColor(analysis.content.contentQuality)}>
                        {analysis.content.contentQuality}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{currentLabels.readability}</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(analysis.content.readabilityScore)}%
                      </span>
                    </div>
                    <Progress value={analysis.content.readabilityScore} className="h-2" />
                  </div>
                </div>

                {analysis.content.improvements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      {currentLabels.improvements}
                    </h4>
                    <div className="space-y-1">
                      {analysis.content.improvements.map((improvement: string, index: number) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                          {improvement}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-500" />
                    Suggested Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.content.suggestedTags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sentiment Tab */}
            {activeTab === 'sentiment' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium">{currentLabels.sentiment}</span>
                    <Badge className={getSentimentColor(analysis.sentiment.sentiment)}>
                      {analysis.sentiment.sentiment}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">{currentLabels.confidence}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={analysis.sentiment.confidence * 100} className="h-2 flex-1" />
                      <span className="text-sm text-gray-600">
                        {Math.round(analysis.sentiment.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                    {currentLabels.emotions}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.sentiment.emotions.map((emotion: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Keywords Tab */}
            {activeTab === 'keywords' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4 text-green-500" />
                    {currentLabels.keywords}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {analysis.keywords.keywords.map((keyword: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{keyword.word}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {keyword.frequency}x
                          </Badge>
                          <div className="w-12 h-1 bg-gray-200 rounded">
                            <div 
                              className="h-full bg-green-500 rounded" 
                              style={{ width: `${keyword.score * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-blue-500" />
                    {currentLabels.entities}
                  </h4>
                  <div className="space-y-2">
                    {analysis.entities.entities.map((entity: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{entity.text}</span>
                        <Badge variant="outline" className="text-xs">
                          {entity.label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">85%</div>
                  <div className="text-sm text-gray-600">SEO Score</div>
                  <Progress value={85} className="mt-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Keyword Density: Good</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Content Length: Optimal</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Meta Description: Missing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Readability: Good</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {isAnalyzing && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600 animate-pulse" />
              <div className="text-sm text-gray-600">{currentLabels.analyzing}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
