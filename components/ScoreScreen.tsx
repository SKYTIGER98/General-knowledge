
import React, { useState, useEffect } from 'react';
import { getResultsExplanation } from '../services/geminiService';
import Spinner from './Spinner';

interface ScoreScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const ScoreScreen: React.FC<ScoreScreenProps> = ({ score, total, onRestart }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    const fetchExplanation = async () => {
      setIsLoading(true);
      const result = await getResultsExplanation(score, total);
      setExplanation(result);
      setIsLoading(false);
    };
    
    fetchExplanation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, total]);

  const getPerformanceColor = () => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  }

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center transform transition-all duration-300 flex flex-col items-center">
      <h2 className="text-4xl font-bold text-purple-400 mb-2">Quiz Complete!</h2>
      <p className="text-gray-300 mb-6">Here's how you did:</p>
      
      <div className="bg-gray-900 rounded-full w-48 h-48 flex flex-col items-center justify-center mb-6 border-4 border-purple-500">
          <p className="text-lg text-gray-400">You Scored</p>
          <p className={`text-6xl font-bold ${getPerformanceColor()}`}>{score}<span className="text-3xl text-gray-500">/{total}</span></p>
          <p className={`text-xl font-semibold ${getPerformanceColor()}`}>{percentage}%</p>
      </div>

      <div className="w-full bg-gray-700 p-4 rounded-lg min-h-[120px] flex items-center justify-center">
        {isLoading ? (
            <Spinner text="Analyzing your performance..." />
        ) : (
            <p className="text-lg text-gray-200 italic">"{explanation}"</p>
        )}
      </div>

      <button
        onClick={onRestart}
        className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
      >
        Play Again
      </button>
    </div>
  );
};

export default ScoreScreen;
