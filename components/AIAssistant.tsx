import React, { useState } from 'react';
import { GridEvent } from '../types';
import { getAIAnalysis } from '../services/geminiService';

interface AIAssistantProps {
  events: GridEvent[];
  isHardwareConnected: boolean;
}

interface AnalysisResult {
  reportTitle: string;
  summary: string;
  patterns: string[];
  recommendations: string[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ events, isHardwareConnected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await getAIAnalysis(events);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to get AI analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">Gemini AI Assistant</h2>
        <button
          onClick={handleAnalyze}
          disabled={isLoading || events.length < 5 || !isHardwareConnected}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze Grid Performance'
          )}
        </button>
      </div>
      {!isHardwareConnected ? (
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">Connect hardware to enable AI analysis.</p>
      ) : (
        events.length < 5 && <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Waiting for more data before analysis is available (needs at least 5 events).</p>
      )}
      
      {error && <p className="mt-4 text-red-500 dark:text-red-400">{error}</p>}
      
      {analysis && isHardwareConnected && (
        <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300 animate-fade-in">
          <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{analysis.reportTitle}</h3>
          <p className="text-sm">{analysis.summary}</p>
          <div>
            <h4 className="font-semibold mb-2">Key Patterns Identified:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {analysis.patterns.map((pattern, index) => <li key={index}>{pattern}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {analysis.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
