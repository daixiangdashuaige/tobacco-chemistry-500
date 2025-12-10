import React, { useState, useEffect } from 'react';
import { parseQuestions, shuffleArray } from './utils/parser';
import { RAW_DATA_STRING } from './data/raw';
import { Dashboard } from './components/Dashboard';
import { Quiz } from './components/Quiz';
import { Question, UserProgress } from './types';
import { Trophy, RefreshCw, Home } from 'lucide-react';

export default function App() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [view, setView] = useState<'dashboard' | 'quiz' | 'results'>('dashboard');
  const [mode, setMode] = useState<'practice' | 'exam' | 'review' | 'blitz'>('practice');
  const [lastResults, setLastResults] = useState<{correct: number, incorrect: number} | null>(null);
  
  // Persistence
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('tobacco_progress_v1');
    return saved ? JSON.parse(saved) : { answered: [], mastered: [], needsReview: [] };
  });

  useEffect(() => {
    const parsed = parseQuestions(RAW_DATA_STRING);
    setAllQuestions(parsed);
  }, []);

  useEffect(() => {
    localStorage.setItem('tobacco_progress_v1', JSON.stringify(progress));
  }, [progress]);

  const handleStart = (selectedMode: 'practice' | 'exam' | 'review' | 'blitz') => {
    setMode(selectedMode);
    let qToPlay: Question[] = [];

    switch (selectedMode) {
      case 'practice':
        // Practice includes everything, shuffled
        qToPlay = shuffleArray([...allQuestions]);
        break;
      case 'exam':
        // 100 random questions
        qToPlay = shuffleArray([...allQuestions]).slice(0, 100);
        break;
      case 'review':
        // Only incorrect ones
        qToPlay = allQuestions.filter(q => progress.needsReview.includes(q.id));
        if (qToPlay.length === 0) {
           alert("太棒了！目前没有错题需要复习。");
           return;
        }
        qToPlay = shuffleArray(qToPlay);
        break;
      case 'blitz':
        qToPlay = shuffleArray([...allQuestions]);
        break;
    }

    setActiveQuestions(qToPlay);
    setView('quiz');
  };

  const handleQuizComplete = (results: { correct: number, incorrect: number, answers: Record<number, 'correct'|'incorrect'> }) => {
    setLastResults({ correct: results.correct, incorrect: results.incorrect });
    
    // Update progress
    setProgress(prev => {
      const newMastered = new Set(prev.mastered);
      const newNeedsReview = new Set(prev.needsReview);
      const newAnswered = new Set(prev.answered);

      Object.entries(results.answers).forEach(([qIdStr, result]) => {
        const qId = parseInt(qIdStr);
        newAnswered.add(qId);
        if (result === 'correct') {
          newMastered.add(qId);
          newNeedsReview.delete(qId); // Remove from review if mastered
        } else {
          newNeedsReview.add(qId);
          newMastered.delete(qId); // Remove from mastered if gotten wrong
        }
      });

      return {
        answered: Array.from(newAnswered),
        mastered: Array.from(newMastered),
        needsReview: Array.from(newNeedsReview)
      };
    });

    setView('results');
  };

  const resetProgress = () => {
    if(confirm("确定要重置所有历史记录吗？")) {
      setProgress({ answered: [], mastered: [], needsReview: [] });
    }
  };

  if (view === 'dashboard') {
    return (
      <Dashboard 
        progress={progress} 
        totalQuestions={allQuestions.length} 
        onStart={handleStart}
        onReset={resetProgress}
      />
    );
  }

  if (view === 'quiz') {
    return (
      <Quiz 
        questions={activeQuestions} 
        mode={mode} 
        onComplete={handleQuizComplete}
        onExit={() => setView('dashboard')}
      />
    );
  }

  if (view === 'results') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">练习结束！</h2>
          <p className="text-slate-500 mb-8">本次练习表现如下</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
              <span className="block text-3xl font-bold text-green-600 mb-1">{lastResults?.correct}</span>
              <span className="text-sm font-medium text-green-800">回答正确</span>
            </div>
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <span className="block text-3xl font-bold text-red-600 mb-1">{lastResults?.incorrect}</span>
              <span className="text-sm font-medium text-red-800">回答错误</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => handleStart(mode)}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              再来一次
            </button>
            <button 
              onClick={() => setView('dashboard')}
              className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              返回主页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div>加载中...</div>;
}