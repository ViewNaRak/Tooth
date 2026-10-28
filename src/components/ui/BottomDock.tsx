import React from 'react';
import { Play, RotateCcw, Flame, CheckCircle2 } from 'lucide-react';
import type { ToolType } from '../../types/dental';

interface BottomDockProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  brushAngle: number;
  onToggleBrushAngle: () => void;
  isSimulating: boolean;
  onStartSimulation: () => void;
  onResetPlaque: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeTool,
  onSelectTool,
  brushAngle,
  onToggleBrushAngle,
  isSimulating,
  onStartSimulation,
  onResetPlaque,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-[94%] max-w-2xl">
      <div className="glass-panel-elevated rounded-3xl p-2.5 sm:p-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 pointer-events-auto border border-stone-200/80 shadow-2xl backdrop-blur-2xl">
        {/* Tool Mode Buttons (Pastel aesthetic) */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100/80 border border-stone-200/60">
          <button
            onClick={() => onSelectTool('brush')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTool === 'brush'
                ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/30'
                : 'text-earth-muted hover:text-earth-dark hover:bg-stone-200/60'
            }`}
          >
            <span className="text-base">🪥</span>
            <span>แปรงฟัน</span>
          </button>

          <button
            onClick={() => onSelectTool('floss')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTool === 'floss'
                ? 'bg-rose-300 text-slate-950 shadow-md shadow-rose-300/30'
                : 'text-earth-muted hover:text-earth-dark hover:bg-stone-200/60'
            }`}
          >
            <span className="text-base">🧵</span>
            <span>ไหมขัดฟัน</span>
          </button>

          <button
            onClick={() => onSelectTool('rinse')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTool === 'rinse'
                ? 'bg-teal-300 text-slate-950 shadow-md shadow-teal-300/30'
                : 'text-earth-muted hover:text-earth-dark hover:bg-stone-200/60'
            }`}
          >
            <span className="text-base">💧</span>
            <span>บ้วนปาก</span>
          </button>
        </div>

        {/* 45° Angle Calibration Pill */}
        {activeTool === 'brush' && (
          <button
            onClick={onToggleBrushAngle}
            title="คลิกเพื่อสลับมุมองศาขนแปรง (45° vs 90°)"
            className="px-3 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-earth-dark hover:border-amber-400 transition-all flex items-center gap-1.5"
          >
            <span className="text-stone-400 text-[11px]">มุม:</span>
            <span
              className={`font-extrabold px-1.5 py-0.5 rounded ${
                brushAngle === 45
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {brushAngle}°
            </span>
            {brushAngle === 45 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <span className="text-[10px] text-amber-700 font-bold">(ลอง 45°)</span>
            )}
          </button>
        )}

        {/* Action Buttons: Simulate Cleaning & Reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onStartSimulation}
            disabled={isSimulating}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md ${
              isSimulating
                ? 'bg-amber-300 text-earth-dark cursor-wait opacity-80'
                : 'bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-earth-dark shadow-amber-300/40 active:scale-95'
            }`}
          >
            {isSimulating ? (
              <>
                <Flame className="w-4 h-4 animate-spin text-earth-dark" />
                <span>กำลังทำความสะอาด...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-earth-dark" />
                <span>สาธิตการทำความสะอาด</span>
              </>
            )}
          </button>

          <button
            onClick={onResetPlaque}
            title="รีเซ็ตคราบจุลินทรีย์และเศษอาหารใหม่"
            className="p-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-earth-muted hover:text-earth-dark transition-all active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
