import React, { useState, useEffect } from 'react';
import { Question, QuizState } from '../types';
import { QuestionCard } from './QuestionCard';
import { ArrowLeft, ArrowRight, Flag, Check, X } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  mode: 'practice' | 'exam' | 'review' | 'blitz';
  onComplete: (results: { correct: number, incorrect: number, answers: Record<number, 'correct'|'incorrect'> }) => void;
  onExit: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, mode, onComplete, onExit }) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, 'correct' | 'incorrect'>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);

  const currentQ = questions[index];
  const isLast = index === questions.length - 1;

  useEffect(() => {
    // Reset state when switching questions in practice mode
    if (mode === 'practice' || mode === 'review' || mode === 'blitz') {
      setShowFeedback(!!answers[currentQ.id]);
    }
  }, [index, currentQ.id, answers, mode]);

  const handleOptionSelect = (opt: string) => {
    if (answers[currentQ.id] && mode !== 'exam') return; // Prevent changing in practice

    const newAnswers = { ...answers, [currentQ.id]: opt };
    setAnswers(newAnswers);

    if (mode !== 'exam') {
      // Immediate feedback logic
      const isCorrect = opt === currentQ.correctAnswer;
      setResults(prev => ({ ...prev, [currentQ.id]: isCorrect ? 'correct' : 'incorrect' }));
      setShowFeedback(true);
      
      if (mode === 'blitz' && !isCorrect) {
          setTimeout(() => {
             finishQuiz({ ...results, [currentQ.id]: 'incorrect' });
          }, 1500);
      }
    }
  };

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      finishQuiz(results);
    }
  };

  const finishQuiz = (finalResults: Record<number, 'correct' | 'incorrect'>) => {
    // Calculate final stats
    let correct = 0;
    let incorrect = 0;
    
    // For exam mode, calculate now
    if (mode === 'exam') {
      const examResults: Record<number, 'correct'|'incorrect'> = {};
      questions.forEach(q => {
        const userAns = answers[q.id];
        if (userAns === q.correctAnswer) {
            correct++;
            examResults[q.id] = 'correct';
        } else {
            incorrect++;
            examResults[q.id] = 'incorrect';
        }
      });
      onComplete({ correct, incorrect, answers: examResults });
    } else {
      // Practice/Review/Blitz
      Object.values(finalResults).forEach(r => r === 'correct' ? correct++ : incorrect++);
      onComplete({ correct, incorrect, answers: finalResults });
    }
  };

  const getModeLabel = (m: string) => {
    switch(m) {
      case 'practice': return '练习模式';
      case 'exam': return '模拟考试';
      case 'review': return '错题复习';
      case 'blitz': return '生存模式';
      default: return m;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={onExit} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center">
             <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{getModeLabel(mode)}</span>
             <span className="text-sm font-bold text-slate-800">题目 {index + 1} <span className="text-slate-400">/ {questions.length}</span></span>
          </div>

          <div className="w-8" /> {/* Spacer */}
        </div>
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <main className="flex-grow bg-slate-50 p-4 md:p-8 flex items-start justify-center">
        <div className="w-full max-w-3xl space-y-8">
          <QuestionCard
            question={currentQ}
            selectedOption={answers[currentQ.id]}
            onSelectOption={handleOptionSelect}
            showFeedback={showFeedback}
            isExamMode={mode === 'exam'}
          />
          
          <div className="flex justify-between items-center pt-4">
             <button 
               onClick={() => setIndex(Math.max(0, index - 1))}
               disabled={index === 0}
               className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:shadow-none transition-all"
             >
               上一题
             </button>

             {mode === 'exam' ? (
                <button
                  onClick={isLast ? () => finishQuiz(results) : handleNext}
                  className={`px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 ${
                    isLast 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isLast ? '提交试卷' : '下一题'}
                  <ArrowRight className="w-4 h-4" />
                </button>
             ) : (
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQ.id]}
                  className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${
                    !answers[currentQ.id]
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 transform active:scale-95'
                  }`}
                >
                  {isLast ? '结束练习' : '下一题'}
                  <ArrowRight className="w-4 h-4" />
                </button>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};