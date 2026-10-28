import React, { useState } from 'react';
import { BookOpen, X, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { COMPACT_DENTAL_LESSONS } from '../../data/dentalLessons';
import type { LessonMode } from '../../types/dental';

interface GuidePopoverProps {
  currentLessonId: LessonMode;
  onSelectLesson: (mode: LessonMode) => void;
}

export const GuidePopover: React.FC<GuidePopoverProps> = ({
  currentLessonId,
  onSelectLesson,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const lesson = COMPACT_DENTAL_LESSONS[currentLessonId];

  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="glass-panel-elevated px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white border border-white/10 hover:border-cyan-500/40 shadow-xl backdrop-blur-xl transition-all active:scale-95 group"
        >
          <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>สรุปเทคนิคทันตกรรม</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </button>
      )}

      {/* Popover Card */}
      {isOpen && (
        <div className="w-80 sm:w-96 glass-panel-elevated rounded-2xl p-4 sm:p-5 border border-white/10 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                {lesson.badge}
              </span>
              <span className="text-xs font-bold text-white">{lesson.thaiTitle}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Lesson Tab Selector */}
          <div className="grid grid-cols-3 gap-1 my-3 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
            <button
              onClick={() => onSelectLesson('brushing')}
              className={`py-1 rounded-lg font-medium transition-all ${
                currentLessonId === 'brushing'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              แปรงฟัน
            </button>
            <button
              onClick={() => onSelectLesson('flossing')}
              className={`py-1 rounded-lg font-medium transition-all ${
                currentLessonId === 'flossing'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ไหมขัดฟัน
            </button>
            <button
              onClick={() => onSelectLesson('rinsing')}
              className={`py-1 rounded-lg font-medium transition-all ${
                currentLessonId === 'rinsing'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              บ้วนปาก
            </button>
          </div>

          {/* Steps Overview */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {lesson.steps.map((step) => (
              <div
                key={step.id}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    Step {step.stepNumber}: {step.title}
                  </span>
                  {step.targetAngleText && (
                    <span className="text-[10px] font-semibold text-cyan-400">
                      {step.targetAngleText}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {step.shortDescription}
                </p>
                <div className="text-[10px] text-emerald-300 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{step.tip}</span>
                </div>
              </div>
            ))}

            {/* Medical Warning Highlight */}
            {lesson.warnings[0] && (
              <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-300 text-[11px] font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                  <span>{lesson.warnings[0].title}</span>
                </div>
                <p className="text-[10px] text-rose-200/90 leading-tight">
                  {lesson.warnings[0].consequence}
                </p>
              </div>
            )}
          </div>

          {/* Footer Clinical Authority */}
          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              มาตรฐานทันตแพทยสภา
            </span>
            <span>แนะนำตรวจฟันทุก 6 เดือน</span>
          </div>
        </div>
      )}
    </div>
  );
};
