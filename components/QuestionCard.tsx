import React from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
}) => {
  const isAnswered = selectedAnswer !== null;

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-gray-700 hover:bg-purple-700';
    }
    if (option === question.correctAnswer) {
      return 'bg-green-600';
    }
    if (option === selectedAnswer) {
      return 'bg-red-600';
    }
    return 'bg-gray-700 opacity-50 cursor-not-allowed';
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-2xl transform transition-all duration-300">
      <div className="mb-6">
        <p className="text-purple-400 font-semibold mb-2">
          Question {questionNumber} / {totalQuestions}
        </p>
        <h2 className="text-2xl font-bold text-white" dangerouslySetInnerHTML={{ __html: question.question }}></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswerSelect(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      {isAnswered && (
        <>
          <div className="mt-6 p-4 bg-gray-700/50 border-l-4 border-purple-500 rounded-r-lg animate-fade-in">
            <h3 className="font-bold text-purple-300 mb-1">Explanation</h3>
            <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: question.explanation }}></p>
          </div>
          <div className="mt-8 text-center">
              <button 
                  onClick={onNext}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
              >
                  {questionNumber === totalQuestions ? 'Show Results' : 'Next Question'}
              </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionCard;
