import React from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedOption?: string;
  onSelectOption: (option: string) => void;
  showFeedback: boolean;
  isExamMode: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  showFeedback,
  isExamMode,
}) => {
  const options = ['A', 'B', 'C', 'D'] as const;

  const getOptionStyle = (optKey: string) => {
    const base = "w-full p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center justify-between group relative overflow-hidden";
    
    // Exam mode or before selection in practice
    if (!showFeedback && !isExamMode) {
      if (selectedOption === optKey) {
        return `${base} border-indigo-500 bg-indigo-50 text-indigo-700 font-medium shadow-sm`;
      }
      return `${base} border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700`;
    }

    if (isExamMode) {
       if (selectedOption === optKey) {
        return `${base} border-indigo-600 bg-indigo-100 text-indigo-900 font-medium`;
       }
       return `${base} border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700`;
    }

    // Practice mode with feedback
    if (showFeedback) {
      if (optKey === question.correctAnswer) {
        return `${base} border-green-500 bg-green-50 text-green-800 font-medium`;
      }
      if (selectedOption === optKey && optKey !== question.correctAnswer) {
        return `${base} border-red-400 bg-red-50 text-red-800`;
      }
      return `${base} border-slate-200 opacity-60`;
    }

    return base;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* Question Header */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-4">
             <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold">
               {question.id}
             </span>
             <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
               单选题
             </span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
            {question.text}
          </h2>
        </div>

        {/* Options */}
        <div className="p-8 space-y-4">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => !showFeedback && onSelectOption(opt)}
              disabled={showFeedback}
              className={getOptionStyle(opt)}
            >
              <div className="flex items-center gap-4 relative z-10">
                <span className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold border ${
                  selectedOption === opt || (showFeedback && opt === question.correctAnswer)
                    ? 'border-transparent bg-white/30' 
                    : 'border-slate-300 text-slate-500'
                }`}>
                  {opt}
                </span>
                <span className="text-lg">{question.options[opt]}</span>
              </div>
              
              {/* Icons for feedback */}
              {showFeedback && opt === question.correctAnswer && (
                <CheckCircle2 className="w-6 h-6 text-green-600 animate-in zoom-in duration-300" />
              )}
              {showFeedback && selectedOption === opt && opt !== question.correctAnswer && (
                <XCircle className="w-6 h-6 text-red-500 animate-in zoom-in duration-300" />
              )}
            </button>
          ))}
        </div>

        {/* Explanation Section */}
        {showFeedback && (
          <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">解析</h3>
                  <p className="text-blue-800 leading-relaxed text-sm md:text-base">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};