import React from 'react';
import { Play, BookOpen, AlertCircle, Award, BarChart3, RotateCcw, Database } from 'lucide-react';
import { UserProgress } from '../types';

interface DashboardProps {
  progress: UserProgress;
  totalQuestions: number;
  onStart: (mode: 'practice' | 'exam' | 'review' | 'blitz') => void;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ progress, totalQuestions, onStart, onReset }) => {
  const percentage = Math.round((progress.mastered.length / totalQuestions) * 100) || 0;
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          烟草化学<span className="text-indigo-600">大师</span>
        </h1>
        <p className="text-lg text-slate-600 mb-4">
          全面掌握烟草化学与工艺知识
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600 font-medium text-sm">
          <Database className="w-4 h-4" />
          <span>总题库：{totalQuestions} 题</span>
        </div>
      </header>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full text-green-600 mb-3">
             <Award className="w-6 h-6" />
          </div>
          <span className="text-3xl font-bold text-slate-800">{progress.mastered.length}</span>
          <span className="text-sm text-slate-500 font-medium">已掌握</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="p-3 bg-red-100 rounded-full text-red-600 mb-3">
             <AlertCircle className="w-6 h-6" />
          </div>
          <span className="text-3xl font-bold text-slate-800">{progress.needsReview.length}</span>
          <span className="text-sm text-slate-500 font-medium">需复习</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="p-3 bg-indigo-100 rounded-full text-indigo-600 mb-3">
             <BarChart3 className="w-6 h-6" />
          </div>
          <span className="text-3xl font-bold text-slate-800">{percentage}%</span>
          <span className="text-sm text-slate-500 font-medium">完成度</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Practice Mode */}
        <button
          onClick={() => onStart('practice')}
          className="group relative flex items-center p-6 bg-white border-2 border-indigo-100 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all text-left"
        >
          <div className="p-4 bg-indigo-50 rounded-xl mr-5 group-hover:bg-indigo-600 transition-colors">
            <Play className="w-8 h-8 text-indigo-600 group-hover:text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">练习模式</h3>
            <p className="text-slate-500 text-sm">每题即时反馈，按自己的节奏练习。</p>
          </div>
        </button>

        {/* Exam Mode */}
        <button
          onClick={() => onStart('exam')}
          className="group relative flex items-center p-6 bg-white border-2 border-slate-100 rounded-2xl hover:border-slate-800 hover:shadow-lg transition-all text-left"
        >
          <div className="p-4 bg-slate-100 rounded-xl mr-5 group-hover:bg-slate-800 transition-colors">
            <BookOpen className="w-8 h-8 text-slate-700 group-hover:text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">模拟考试</h3>
            <p className="text-slate-500 text-sm">随机抽取100题，限时，无提示。</p>
          </div>
        </button>

        {/* Review Mistakes */}
        <button
          onClick={() => onStart('review')}
          disabled={progress.needsReview.length === 0}
          className={`group relative flex items-center p-6 bg-white border-2 rounded-2xl transition-all text-left ${
            progress.needsReview.length === 0 
              ? 'border-slate-100 opacity-50 cursor-not-allowed' 
              : 'border-red-100 hover:border-red-500 hover:shadow-lg'
          }`}
        >
          <div className={`p-4 rounded-xl mr-5 transition-colors ${
            progress.needsReview.length === 0 ? 'bg-slate-100' : 'bg-red-50 group-hover:bg-red-500'
          }`}>
            <RotateCcw className={`w-8 h-8 ${
               progress.needsReview.length === 0 ? 'text-slate-400' : 'text-red-600 group-hover:text-white'
            }`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">错题复习</h3>
            <p className="text-slate-500 text-sm">针对做错的 {progress.needsReview.length} 道题进行强化训练。</p>
          </div>
        </button>

        {/* Blitz Mode (Extra) */}
         <button
          onClick={() => onStart('blitz')}
          className="group relative flex items-center p-6 bg-white border-2 border-amber-100 rounded-2xl hover:border-amber-500 hover:shadow-lg transition-all text-left"
        >
          <div className="p-4 bg-amber-50 rounded-xl mr-5 group-hover:bg-amber-600 transition-colors">
            <Award className="w-8 h-8 text-amber-600 group-hover:text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">生存模式</h3>
            <p className="text-slate-500 text-sm">答错即止，挑战最高连胜纪录。</p>
          </div>
        </button>
      </div>

      <div className="mt-12 text-center">
         <button onClick={onReset} className="text-sm text-slate-400 hover:text-red-500 underline">
            重置所有进度
         </button>
      </div>
    </div>
  );
};