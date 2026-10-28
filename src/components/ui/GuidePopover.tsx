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
      {/* Trigger Button: Warm Cream Frosted Glass with Cute Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="glass-panel-elevated px-5 py-3 rounded-3xl flex items-center gap-2.5 text-sm sm:text-base font-bold text-earth-dark hover:text-earth-dark border border-stone-200/90 hover:border-amber-400 shadow-xl backdrop-blur-2xl transition-all active:scale-95 group"
        >
          <BookOpen className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          <span>คู่มือทันตกรรม</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Popover Card with Large, Readable Typography */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[480px] max-w-[500px] glass-panel-elevated rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header with Large Font */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200/60 inline-block">
                {lesson.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-earth-dark tracking-tight">
                {lesson.thaiTitle}
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-2xl text-stone-400 hover:text-earth-dark hover:bg-stone-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lesson Tab Selector */}
          <div className="grid grid-cols-3 gap-1.5 my-4 p-1.5 rounded-2xl bg-stone-100/80 border border-stone-200/60 text-xs sm:text-sm">
            <button
              onClick={() => onSelectLesson('brushing')}
              className={`py-2 rounded-xl font-bold transition-all ${
                currentLessonId === 'brushing'
                  ? 'bg-sky-400 text-slate-950 shadow-sm'
                  : 'text-earth-muted hover:text-earth-dark'
              }`}
            >
              แปรงฟัน 45°
            </button>
            <button
              onClick={() => onSelectLesson('flossing')}
              className={`py-2 rounded-xl font-bold transition-all ${
                currentLessonId === 'flossing'
                  ? 'bg-rose-300 text-slate-950 shadow-sm'
                  : 'text-earth-muted hover:text-earth-dark'
              }`}
            >
              ไหมขัดฟัน
            </button>
            <button
              onClick={() => onSelectLesson('rinsing')}
              className={`py-2 rounded-xl font-bold transition-all ${
                currentLessonId === 'rinsing'
                  ? 'bg-teal-300 text-slate-950 shadow-sm'
                  : 'text-earth-muted hover:text-earth-dark'
              }`}
            >
              บ้วนปาก
            </button>
          </div>

          {/* Steps Overview with Large, Relaxed Typography */}
          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {lesson.steps.map((step) => (
              <div
                key={step.id}
                className="p-4 rounded-2xl bg-stone-50/90 border border-stone-200/80 space-y-2 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-earth-dark leading-snug">
                    ขั้นตอนที่ {step.stepNumber}: {step.title}
                  </h3>
                  {step.targetAngleText && (
                    <span className="shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800">
                      {step.targetAngleText}
                    </span>
                  )}
                </div>

                {/* Body Text: text-base to text-lg with leading-relaxed as requested */}
                <p className="text-sm sm:text-base text-earth-charcoal leading-relaxed">
                  {step.shortDescription}
                </p>

                <div className="text-xs sm:text-sm text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100/80 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{step.tip}</span>
                </div>
              </div>
            ))}

            {/* Medical Warning Box */}
            {lesson.warnings[0] && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-rose-800 text-sm sm:text-base font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{lesson.warnings[0].title}</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-700 leading-relaxed">
                  {lesson.warnings[0].consequence}
                </p>
              </div>
            )}
          </div>

          {/* Footer Clinical Authority */}
          <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between text-xs sm:text-sm text-earth-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              มาตรฐานทันตแพทยสภา
            </span>
            <span>แนะนำตรวจฟันทุก 6 เดือน</span>
          </div>
        </div>
      )}
    </div>
  );
};
