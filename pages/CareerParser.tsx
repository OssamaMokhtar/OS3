import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { analyzeResumeImage } from '../services/gemini';
import { Skill } from '../types';

interface CareerParserProps {
  onDataParsed: (data: { skills: Skill[], role: string, exp: number }) => void;
}

export const CareerParser: React.FC<CareerParserProps> = ({ onDataParsed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      // Basic validation
      if (!selected.type.startsWith('image/')) {
        setError("Please upload an image of your resume (PNG/JPG) for this demo.");
        return;
      }
      setFile(selected);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Strip base64 prefix for Gemini
      const base64Data = preview.split(',')[1];
      const result = await analyzeResumeImage(base64Data);
      
      onDataParsed({
        skills: result.skills,
        role: result.detectedRole,
        exp: result.yearsExperience
      });

    } catch (err: any) {
      setError("Failed to analyze resume. Please try again. Ensure API Key is set.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Resume Intelligence</h2>
        <p className="text-slate-400">
          Upload an image of your CV. Our AI will extract skills, experience, and match you to market trends.
        </p>
      </div>

      <div className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-xl p-12 text-center hover:border-primary-500/50 transition-colors relative">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {!preview ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-slate-500">PNG, JPG (Max 5MB)</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img src={preview} alt="Resume Preview" className="max-h-64 mx-auto rounded shadow-lg border border-slate-700" />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreview(null);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="mt-4 text-sm text-slate-400">{file?.name}</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={handleAnalyze} 
          disabled={!file} 
          isLoading={isAnalyzing}
          className="w-full md:w-auto min-w-[200px]"
        >
          {isAnalyzing ? 'Analyzing with Gemini AI...' : 'Analyze Resume'}
        </Button>
      </div>

      <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 text-sm text-slate-500">
        <p className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary-500" />
          <span>Secure parsing powered by Google Gemini.</span>
        </p>
        <p className="flex items-center gap-2 mt-1">
          <CheckCircle className="w-4 h-4 text-primary-500" />
          <span>Data is processed in-memory and not stored persistently in this demo.</span>
        </p>
      </div>
    </div>
  );
};