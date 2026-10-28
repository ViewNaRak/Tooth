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
      <div className="glass-panel-elevated rounded-2xl p-2 sm:p-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pointer-events-auto border border-white/10 shadow-2xl backdrop-blur-xl">
        {/* Tool Mode Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => onSelectTool('brush')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTool === 'brush'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🪥</span>
            <span>แปรงฟัน</span>
          </button>

          <button
            onClick={() => onSelectTool('floss')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTool === 'floss'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🧵</span>
            <span>ไหมขัดฟัน</span>
          </button>

          <button
            onClick={() => onSelectTool('rinse')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTool === 'rinse'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>💧</span>
            <span>บ้วนปาก</span>
          </button>
        </div>

        {/* 45° Angle Calibration Pill (for Toothbrush) */}
        {activeTool === 'brush' && (
          <button
            onClick={onToggleBrushAngle}
            title="คลิกเพื่อสลับมุมองศาขนแปรง (45° vs 90°)"
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-medium text-slate-300 hover:border-cyan-500 transition-all flex items-center gap-1.5"
          >
            <span className="text-[10px] text-slate-400">มุม:</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded ${
                brushAngle === 45
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {brushAngle}°
            </span>
            {brushAngle === 45 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="text-[10px] text-amber-400">(ลอง 45°)</span>
            )}
          </button>
        )}

        {/* Actions: Simulate Cleaning & Reset */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <button
            onClick={onStartSimulation}
            disabled={isSimulating}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
              isSimulating
                ? 'bg-cyan-600 text-white cursor-wait opacity-90'
                : 'bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 shadow-cyan-500/30 active:scale-95'
            }`}
          >
            {isSimulating ? (
              <>
                <Flame className="w-4 h-4 animate-spin text-slate-950" />
                <span>กำลังทำความสะอาด...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>สาธิตการทำความสะอาด</span>
              </>
            )}
          </button>

          <button
            onClick={onResetPlaque}
            title="รีเซ็ตคราบจุลินทรีย์และเศษอาหารใหม่"
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
