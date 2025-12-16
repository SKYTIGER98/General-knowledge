import React, { useState, useCallback } from 'react';
import { QuizState, Difficulty } from './types';
import type { Question } from './types';
import { generateQuizQuestions } from './services/geminiService';
import QuestionCard from './components/QuestionCard';
import ScoreScreen from './components/ScoreScreen';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>(QuizState.START);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = useCallback(async (difficulty: Difficulty) => {
    setQuizState(QuizState.LOADING_QUESTIONS);
    setError(null);
    try {
      const newQuestions = await generateQuizQuestions(difficulty);
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setQuizState(QuizState.ACTIVE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setQuizState(QuizState.START);
    }
  }, []);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };
  
  const handleNextQuestion = () => {
      if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
      } else {
          setQuizState(QuizState.SHOWING_RESULTS);
      }
  };

  const handleRestart = () => {
      setQuizState(QuizState.START);
      setQuestions([]);
  }

  const renderContent = () => {
    switch (quizState) {
      case QuizState.LOADING_QUESTIONS:
        return <Spinner text="Generating your genius quiz..." />;
      
      case QuizState.ACTIVE:
        return (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNextQuestion}
          />
        );

      case QuizState.SHOWING_RESULTS:
        return <ScoreScreen score={score} total={questions.length} onRestart={handleRestart} />;

      case QuizState.START:
      default:
        return (
          <div className="text-center bg-gray-800 p-10 rounded-2xl shadow-lg">
            <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Gemini Genius Quiz
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-md mx-auto">
              Ready to challenge your intellect? Choose your difficulty to begin.
            </p>
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg mb-4">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => startQuiz(Difficulty.EASY)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                >
                  Easy
                </button>
                 <button
                  onClick={() => startQuiz(Difficulty.MEDIUM)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
                >
                  Medium
                </button>
                 <button
                  onClick={() => startQuiz(Difficulty.HARD)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                >
                  Hard
                </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 font-sans">
      <main className="w-full flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
