import React from 'react';
import { Eye, Sparkles, Activity } from 'lucide-react';
import type { CameraPreset } from '../../types/dental';

interface TopBarProps {
  cleanlinessScore: number;
  plaqueCleanedCount: number;
  totalPlaqueCount: number;
  disclosingAgentEnabled: boolean;
  onToggleDisclosingAgent: () => void;
  cameraPreset: CameraPreset;
  onChangeCameraPreset: (preset: CameraPreset) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  cleanlinessScore,
  plaqueCleanedCount,
  totalPlaqueCount,
  disclosingAgentEnabled,
  onToggleDisclosingAgent,
  cameraPreset,
  onChangeCameraPreset,
}) => {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-30 pointer-events-none">
      <div className="glass-panel-elevated rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between pointer-events-auto border border-white/10 shadow-2xl backdrop-blur-xl">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-sky-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-cyan-500/30">
            🦷
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-tight">Tooth</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
                Full Dental Arch 3D
              </span>
            </div>
          </div>
        </div>

        {/* Camera Views Quick Switcher */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <button
            onClick={() => onChangeCameraPreset('overview')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              cameraPreset === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ภาพรวมแผงฟัน
          </button>
          <button
            onClick={() => onChangeCameraPreset('anterior')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              cameraPreset === 'anterior'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ฟันหน้า
          </button>
          <button
            onClick={() => onChangeCameraPreset('occlusal-top')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              cameraPreset === 'occlusal-top'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            มุมบน
          </button>
          <button
            onClick={() => onChangeCameraPreset('right-molars')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              cameraPreset === 'right-molars'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            กรามขวา
          </button>
          <button
            onClick={() => onChangeCameraPreset('left-molars')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              cameraPreset === 'left-molars'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            กรามซ้าย
          </button>
        </div>

        {/* Right Status & Disclosing Dye Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Disclosing Agent Button */}
          <button
            onClick={onToggleDisclosingAgent}
            title="สีย้อมคราบจุลินทรีย์ (Plaque Disclosing Dye)"
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
              disclosingAgentEnabled
                ? 'bg-fuchsia-950/80 border-fuchsia-500/50 text-fuchsia-300 shadow-md shadow-fuchsia-500/25'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className={`w-3.5 h-3.5 ${disclosingAgentEnabled ? 'text-fuchsia-400' : ''}`} />
            <span className="hidden sm:inline">สีย้อมคราบพลัค</span>
            <Sparkles className="w-3 h-3 text-fuchsia-400" />
          </button>

          {/* Compact Cleanliness Pill */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 hidden sm:inline">ความสะอาด:</span>
              <span
                className={`text-xs font-bold ${
                  cleanlinessScore >= 90
                    ? 'text-emerald-400'
                    : cleanlinessScore >= 50
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {cleanlinessScore}%
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              ({plaqueCleanedCount}/{totalPlaqueCount})
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
