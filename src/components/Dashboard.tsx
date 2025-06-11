import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import UploadCard from './UploadCard';
import VideoDisplay from './VideoDisplay';
import ChatBox from './ChatBox';
import ResponseDisplay from './ResponseDisplay';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const handleDataSubmit = async (data: { text: string; file?: File }) => {
    setIsAnalyzing(true);
    
    try {
      // Process file if uploaded
      let textToAnalyze = data.text;
      if (data.file) {
        // In a real app, you'd extract text from the file
        textToAnalyze += `\n[File uploaded: ${data.file.name}]`;
      }

      const response = await fetch('https://medibotbackend-production.up.railway.app/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToAnalyze })
      });

      const result = await response.json();
      
      if (response.ok) {
        setSummary(result.text);
      } else {
        console.error('Analysis failed:', result.error);
        setSummary('Failed to generate analysis. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setSummary('Network error occurred. Please check your connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVideoGenerate = () => {
    setIsGeneratingVideo(true);
    // Video generation is handled in VideoDisplay component
    setTimeout(() => setIsGeneratingVideo(false), 3000); // Mock timing
  };

  const startNewAnalysis = () => {
    setSummary('');
    setIsAnalyzing(false);
    setIsGeneratingVideo(false);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Analysis Dashboard</h1>
              <p className="text-gray-600 mt-1">AI-powered healthcare diagnostics and insights</p>
            </div>
            <button
              onClick={startNewAnalysis}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>Start New Analysis</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Upload Section */}
          <div className="space-y-6">
            <UploadCard
              onDataSubmit={handleDataSubmit}
              isLoading={isAnalyzing}
            />
            
            <ResponseDisplay
              summary={summary}
              isLoading={isAnalyzing}
            />
          </div>

          {/* Video and Chat Section */}
          <div className="space-y-6">
            <VideoDisplay
              summary={summary}
              onVideoGenerate={handleVideoGenerate}
              isGenerating={isGeneratingVideo}
            />
            
            <ChatBox patientContext={summary} />
          </div>
        </div>

        {/* Stats or Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-2">Analyses Today</h4>
            <p className="text-3xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-500">+3 from yesterday</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-2">Accuracy Rate</h4>
            <p className="text-3xl font-bold text-green-600">97.2%</p>
            <p className="text-sm text-gray-500">AI diagnostic accuracy</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-2">Response Time</h4>
            <p className="text-3xl font-bold text-purple-600">1.3s</p>
            <p className="text-sm text-gray-500">Average analysis time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;