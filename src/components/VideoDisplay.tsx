import React, { useState, useEffect } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';

interface VideoDisplayProps {
  summary: string;
  onVideoGenerate: () => void;
  isGenerating: boolean;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ 
  summary, 
  onVideoGenerate, 
  isGenerating 
}) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

useEffect(() => {
  const generateVideo = async () => {
    if (!summary) return;

    try {
      const response = await fetch('https://medibotbackend-production.up.railway.app/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
      });

      const data = await response.json();

      if (!response.ok || !data.videoId) {
        setError(data.error || 'Failed to generate video');
        return;
      }

      const videoId = data.videoId;

      const pollVideoStatus = async () => {
        const statusInterval = setInterval(async () => {
          try {
                const statusRes = await fetch(`https://medibotbackend-production.up.railway.app/api/video-status/${videoId}`);

            const statusData = await statusRes.json();

            if (statusData.status === 'ready' && statusData.hosted_url) {
              clearInterval(statusInterval);
              setVideoUrl(statusData.hosted_url);
              setError('');
            } else {
              console.log("Video not ready yet...");
            }
          } catch (err) {
            clearInterval(statusInterval);
            setError('Failed to check video status');
          }
        }, 5000);
      };

      pollVideoStatus();

    } catch (err) {
      setError('Network error occurred');
    }
  };

  if (summary && !isGenerating) {
    generateVideo();
  }
}, [summary, isGenerating]);


  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Video Analysis</h3>
        {!videoUrl && summary && (
          <button
            onClick={onVideoGenerate}
            disabled={isGenerating}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 transition-colors duration-200 flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Generate Video</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={onVideoGenerate}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : videoUrl ? (
          <iframe
            src={videoUrl}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            title="AI Medical Analysis Video"
          />
        ) : isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">Generating AI video analysis...</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Play className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Upload patient data to generate video analysis</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDisplay;