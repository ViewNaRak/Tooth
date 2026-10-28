import React from 'react';
import {
  AlertOctagon,
  Play,
  RotateCcw,
  Camera,
  Activity,
  Sliders,
  Flame,
} from 'lucide-react';
import type { ToolType, DentalLesson } from '../../types/dental';

interface ActionFeedbackPanelProps {
  lesson: DentalLesson;
  cleanlinessScore: number;
  plaqueCleanedCount: number;
  totalPlaqueCount: number;
  debrisCleanedCount: number;
  totalDebrisCount: number;
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  brushAngle: number;
  onChangeBrushAngle: (angle: number) => void;
  isSimulating: boolean;
  onStartSimulation: () => void;
  onResetPlaque: () => void;
  cameraPreset: 'front' | 'top' | 'close-interdental' | 'side';
  onChangeCameraPreset: (preset: 'front' | 'top' | 'close-interdental' | 'side') => void;
}

export const ActionFeedbackPanel: React.FC<ActionFeedbackPanelProps> = ({
  lesson,
  cleanlinessScore,
  plaqueCleanedCount,
  totalPlaqueCount,
  debrisCleanedCount,
  totalDebrisCount,
  activeTool,
  onSelectTool,
  brushAngle,
  onChangeBrushAngle,
  isSimulating,
  onStartSimulation,
  onResetPlaque,
  cameraPreset,
  onChangeCameraPreset,
}) => {
  // Check if angle conforms to 45 degree gold standard
  const isOptimalAngle = Math.abs(brushAngle - 45) <= 5;

  return (
    <aside className="w-full lg:w-[360px] xl:w-[390px] h-full flex flex-col glass-panel border-l border-slate-800/80 overflow-y-auto z-20">
      {/* 1. Cleanliness Meter Section */}
      <div className="p-5 border-b border-slate-800/70">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            ดัชนีความสะอาด (Cleanliness Index)
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              cleanlinessScore >= 90
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : cleanlinessScore >= 50
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {cleanlinessScore}%
          </span>
        </div>

        {/* Progress Bar with Glow */}
        <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              cleanlinessScore >= 90
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/40'
                : cleanlinessScore >= 50
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-rose-500 to-pink-500'
            }`}
            style={{ width: `${cleanlinessScore}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">คราบจุลินทรีย์ที่ขจัดได้</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-sm font-bold text-slate-100">
                {plaqueCleanedCount} / {totalPlaqueCount}
              </span>
              <span className="text-[10px] text-cyan-400">จุด</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">เศษอาหารในซอกฟัน</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-sm font-bold text-slate-100">
                {debrisCleanedCount} / {totalDebrisCount}
              </span>
              <span className="text-[10px] text-cyan-400">จุด</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tool & Simulation Controls */}
      <div className="p-5 border-b border-slate-800/70 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            เลือกเครื่องมือ (Clinical Tool)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSelectTool('brush')}
              className={`p-2.5 rounded-xl text-xs font-medium border flex flex-col items-center gap-1.5 transition-all ${
                activeTool === 'brush'
                  ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-base">🪥</span>
              <span>แปรงสีฟัน</span>
            </button>

            <button
              onClick={() => onSelectTool('floss')}
              className={`p-2.5 rounded-xl text-xs font-medium border flex flex-col items-center gap-1.5 transition-all ${
                activeTool === 'floss'
                  ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-base">🧵</span>
              <span>ไหมขัดฟัน</span>
            </button>

            <button
              onClick={() => onSelectTool('rinse')}
              className={`p-2.5 rounded-xl text-xs font-medium border flex flex-col items-center gap-1.5 transition-all ${
                activeTool === 'rinse'
                  ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-base">💧</span>
              <span>น้ำยาบ้วนปาก</span>
            </button>
          </div>
        </div>

        {/* Brush Angle Calibration (Modified Bass) */}
        {activeTool === 'brush' && (
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                มุมขนแปรงกับร่องเหงือก
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isOptimalAngle
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {brushAngle}° {isOptimalAngle ? '(เหมาะสมที่สุด)' : ''}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={brushAngle}
              onChange={(e) => onChangeBrushAngle(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0° (แนบเรียบ)</span>
              <button
                type="button"
                onClick={() => onChangeBrushAngle(45)}
                className="text-cyan-400 hover:underline font-semibold"
              >
                45° (Modified Bass)
              </button>
              <span>90° (ตั้งฉาก)</span>
            </div>

            {!isOptimalAngle && (
              <p className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-800/40">
                ⚠️ คำเตือน: มุม 45° เป็นมุมทองคำที่ขนแปรงสามารถแทรกเข้าร่องเหงือก (Sulcus) เพื่อกำจัดไบโอฟิล์มได้ดีที่สุด
              </p>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-2">
          <button
            onClick={onStartSimulation}
            disabled={isSimulating}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
              isSimulating
                ? 'bg-cyan-600 text-white cursor-wait opacity-80'
                : 'bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 shadow-cyan-500/25 active:scale-[0.98]'
            }`}
          >
            {isSimulating ? (
              <>
                <Flame className="w-4 h-4 animate-spin text-slate-950" />
                กำลังสาธิตการทำความสะอาด...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-slate-950 fill-current" />
                จำลองการทำความสะอาดตามเทคนิค
              </>
            )}
          </button>

          <button
            onClick={onResetPlaque}
            className="w-full py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>สร้างคราบพลัคและเศษอาหารใหม่ (Reset Biofilm)</span>
          </button>
        </div>
      </div>

      {/* 3. Camera View Shortcuts */}
      <div className="p-5 border-b border-slate-800/70">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          มุมมองกล้อง 3D (Camera Presets)
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onChangeCameraPreset('front')}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-center ${
              cameraPreset === 'front'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            ด้านหน้า (Buccal)
          </button>
          <button
            onClick={() => onChangeCameraPreset('top')}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-center ${
              cameraPreset === 'top'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            ด้านบดเคี้ยว (Occlusal)
          </button>
          <button
            onClick={() => onChangeCameraPreset('close-interdental')}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-center ${
              cameraPreset === 'close-interdental'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            ซูมซอกฟัน (Interdental)
          </button>
          <button
            onClick={() => onChangeCameraPreset('side')}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-center ${
              cameraPreset === 'side'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            ด้านข้าง (Profile)
          </button>
        </div>
      </div>

      {/* 4. Critical Medical Warnings Box */}
      <div className="p-5 flex-1 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 uppercase tracking-wider">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>ข้อควรระวังทางการแพทย์ (Medical Warnings)</span>
        </div>

        {lesson.warnings.map((w, index) => (
          <div
            key={index}
            className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5"
          >
            <div className="flex items-center gap-1.5 text-rose-300 text-xs font-bold">
              <span>⚠️</span>
              <span>{w.title}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {w.description}
            </p>
            <div className="text-[11px] text-rose-300/90 bg-rose-950/40 p-2 rounded border border-rose-900/30 leading-snug">
              <span className="font-semibold text-rose-400">ผลเสีย: </span>
              {w.consequence}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
