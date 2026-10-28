import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import type { DentalLesson, LessonStep } from '../../types/dental';

interface LessonGuidePanelProps {
  lesson: DentalLesson;
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const LessonGuidePanel: React.FC<LessonGuidePanelProps> = ({
  lesson,
  currentStepIndex,
  onSelectStep,
  onNextStep,
  onPrevStep,
}) => {
  const currentStep: LessonStep | undefined = lesson.steps[currentStepIndex];

  return (
    <aside className="w-full lg:w-[380px] xl:w-[420px] h-full flex flex-col glass-panel border-r border-slate-800/80 overflow-y-auto z-20">
      {/* Header Info */}
      <div className="p-5 border-b border-slate-800/70">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {lesson.badge}
          </span>
        </div>

        <h1 className="text-xl font-bold text-white tracking-tight leading-snug">
          {lesson.thaiTitle}
        </h1>
        <p className="text-xs text-cyan-400 font-medium mt-0.5">{lesson.title}</p>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {lesson.description}
        </p>

        {/* Clinical Metrics Cards */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>ระยะเวลาที่แนะนำ</span>
            </div>
            <p className="text-xs font-semibold text-slate-200">{lesson.metrics.duration}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>เทคนิคหลัก</span>
            </div>
            <p className="text-xs font-semibold text-slate-200 truncate" title={lesson.metrics.techniqueName}>
              {lesson.metrics.techniqueName}
            </p>
          </div>
        </div>
      </div>

      {/* Steps Navigation Tabs */}
      <div className="px-5 py-3 border-b border-slate-800/50 bg-slate-950/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            ขั้นตอนปฏิบัติ ({currentStepIndex + 1}/{lesson.steps.length})
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevStep}
              disabled={currentStepIndex === 0}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition-all"
            >
              ย้อนกลับ
            </button>
            <button
              onClick={onNextStep}
              disabled={currentStepIndex === lesson.steps.length - 1}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 disabled:opacity-40 transition-all"
            >
              ถัดไป
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {lesson.steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => onSelectStep(idx)}
              className={`py-1.5 rounded-md text-xs font-semibold transition-all border ${
                idx === currentStepIndex
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm shadow-cyan-500/30'
                  : idx < currentStepIndex
                  ? 'bg-slate-900/80 text-cyan-400 border-slate-800'
                  : 'bg-slate-900/40 text-slate-500 border-slate-800/60 hover:text-slate-300'
              }`}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Details */}
      {currentStep && (
        <div className="p-5 flex-1 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-bold text-white leading-snug">
                {currentStep.title}
              </h2>
              {currentStep.targetAngleText && (
                <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {currentStep.targetAngleText}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStep.description}
            </p>

            {/* Clinical Rationale Box */}
            <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-800/40 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>เหตุผลทางการแพทย์ (Clinical Rationale)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-5">
                {currentStep.clinicalRationale}
              </p>
            </div>

            {/* Pro Tip Box */}
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                <span>ข้อแนะนำจากทันตแพทย์ (Pro-Tip)</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed pl-5">
                {currentStep.tip}
              </p>
            </div>
          </div>

          {/* Clinical Benefits */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              ประโยชน์ต่อสุขภาพเหงือกและฟัน
            </h3>
            <ul className="space-y-1.5">
              {lesson.clinicalBenefits.map((benefit, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <ArrowRight className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Footer Alert */}
      <div className="p-4 border-t border-slate-800/70 bg-slate-950/80 text-[11px] text-slate-400 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>หมั่นตรวจสุขภาพช่องปากกับทันตแพทย์เป็นประจำทุก 6 เดือน</span>
      </div>
    </aside>
  );
};
