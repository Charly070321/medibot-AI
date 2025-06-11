import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface UploadCardProps {
  onDataSubmit: (data: { text: string; file?: File }) => void;
  isLoading: boolean;
}

const UploadCard: React.FC<UploadCardProps> = ({ onDataSubmit, isLoading }) => {
  const [textData, setTextData] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (textData.trim() || selectedFile) {
      onDataSubmit({
        text: textData,
        file: selectedFile || undefined
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Patient Data</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient Information
          </label>
          <textarea
            value={textData}
            onChange={(e) => setTextData(e.target.value)}
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter patient symptoms, medical history, or other relevant information..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Medical Files
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            {selectedFile ? (
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-1">Drop files here or click to upload</p>
                <p className="text-sm text-gray-400">PDF, DOC, or TXT files supported</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={(!textData.trim() && !selectedFile) || isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Generate Analysis</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadCard;