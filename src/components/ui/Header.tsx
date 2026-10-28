import React from 'react';
import { Sparkles, Eye, RotateCcw } from 'lucide-react';
import type { LessonMode } from '../../types/dental';

interface HeaderProps {
  currentLesson: LessonMode;
  onSelectLesson: (lesson: LessonMode) => void;
  disclosingAgentEnabled: boolean;
  onToggleDisclosingAgent: () => void;
  onResetSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLesson,
  onSelectLesson,
  disclosingAgentEnabled,
  onToggleDisclosingAgent,
  onResetSimulation,
}) => {
  return (
    <header className="h-16 px-4 md:px-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between z-30 select-none">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black text-xl">
          🦷
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-white">Tooth</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              3D Simulator
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            ศูนย์การเรียนรู้เทคนิคการดูแลสุขภาพช่องปากทางคลินิก
          </p>
        </div>
      </div>

      {/* Lesson Switcher Nav Tabs */}
      <nav className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
        <button
          onClick={() => onSelectLesson('brushing')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            currentLesson === 'brushing'
              ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/25'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <span>🪥</span>
          <span className="hidden sm:inline">การแปรงฟัน</span>
          <span className="text-[10px] opacity-75 hidden md:inline">(Bass)</span>
        </button>

        <button
          onClick={() => onSelectLesson('flossing')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            currentLesson === 'flossing'
              ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/25'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <span>🧵</span>
          <span className="hidden sm:inline">ไหมขัดฟัน</span>
          <span className="text-[10px] opacity-75 hidden md:inline">(C-Shape)</span>
        </button>

        <button
          onClick={() => onSelectLesson('rinsing')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            currentLesson === 'rinsing'
              ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/25'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <span>💧</span>
          <span className="hidden sm:inline">การบ้วนปาก</span>
          <span className="text-[10px] opacity-75 hidden md:inline">(Rinse)</span>
        </button>
      </nav>

      {/* Global Utilities & Disclosing Solution Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDisclosingAgent}
          title="สีย้อมคราบจุลินทรีย์ (Plaque Disclosing Agent)"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
            disclosingAgentEnabled
              ? 'bg-fuchsia-950/70 border-fuchsia-500/50 text-fuchsia-300 shadow-sm shadow-fuchsia-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Eye className={`w-3.5 h-3.5 ${disclosingAgentEnabled ? 'text-fuchsia-400' : ''}`} />
          <span className="hidden md:inline">สีย้อมคราบพลัค</span>
          <Sparkles className="w-3 h-3 text-fuchsia-400" />
        </button>

        <button
          onClick={onResetSimulation}
          title="รีเซ็ตสถานะทั้งหมด"
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">รีเซ็ต</span>
        </button>
      </div>
    </header>
  );
};
