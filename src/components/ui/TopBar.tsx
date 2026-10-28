import React from 'react';
import { Eye, Sparkles, Activity, Volume2, VolumeX } from 'lucide-react';
import type { CameraPreset } from '../../types/dental';

interface TopBarProps {
  cleanlinessScore: number;
  plaqueCleanedCount: number;
  totalPlaqueCount: number;
  disclosingAgentEnabled: boolean;
  onToggleDisclosingAgent: () => void;
  cameraPreset: CameraPreset;
  onChangeCameraPreset: (preset: CameraPreset) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  cleanlinessScore,
  plaqueCleanedCount,
  totalPlaqueCount,
  disclosingAgentEnabled,
  onToggleDisclosingAgent,
  cameraPreset,
  onChangeCameraPreset,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-30 pointer-events-none">
      <div className="glass-panel-elevated rounded-3xl px-5 sm:px-7 py-3 flex items-center justify-between pointer-events-auto border border-stone-200/80 shadow-xl backdrop-blur-2xl">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-200 to-amber-300 flex items-center justify-center text-earth-dark font-black text-xl shadow-sm border border-amber-300/40">
            🦷
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-earth-dark tracking-tight">Tooth</span>
              <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200/60">
                Full Dental Arch
              </span>
            </div>
          </div>
        </div>

        {/* Camera Views Quick Switcher */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100/80 border border-stone-200/60">
          <button
            onClick={() => onChangeCameraPreset('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraPreset === 'overview'
                ? 'bg-white text-earth-dark shadow-sm border border-stone-200/60'
                : 'text-earth-muted hover:text-earth-dark'
            }`}
          >
            ภาพรวมแผงฟัน
          </button>
          <button
            onClick={() => onChangeCameraPreset('anterior')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraPreset === 'anterior'
                ? 'bg-white text-earth-dark shadow-sm border border-stone-200/60'
                : 'text-earth-muted hover:text-earth-dark'
            }`}
          >
            ฟันหน้า
          </button>
          <button
            onClick={() => onChangeCameraPreset('occlusal-top')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraPreset === 'occlusal-top'
                ? 'bg-white text-earth-dark shadow-sm border border-stone-200/60'
                : 'text-earth-muted hover:text-earth-dark'
            }`}
          >
            มุมบน
          </button>
          <button
            onClick={() => onChangeCameraPreset('right-molars')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraPreset === 'right-molars'
                ? 'bg-white text-earth-dark shadow-sm border border-stone-200/60'
                : 'text-earth-muted hover:text-earth-dark'
            }`}
          >
            กรามขวา
          </button>
          <button
            onClick={() => onChangeCameraPreset('left-molars')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraPreset === 'left-molars'
                ? 'bg-white text-earth-dark shadow-sm border border-stone-200/60'
                : 'text-earth-muted hover:text-earth-dark'
            }`}
          >
            กรามซ้าย
          </button>
        </div>

        {/* Right Status, Mute & Disclosing Dye Toggle */}
        <div className="flex items-center gap-2">
          {/* Mute / Unmute Button */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'เปิดเสียงเอฟเฟกต์ (Unmute Sound)' : 'ปิดเสียง (Mute Sound)'}
            className={`p-2 rounded-2xl text-xs font-semibold transition-all border ${
              isMuted
                ? 'bg-stone-100 text-stone-400 border-stone-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-sm'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Disclosing Agent Button */}
          <button
            onClick={onToggleDisclosingAgent}
            title="สีย้อมคราบจุลินทรีย์ (Plaque Disclosing Dye)"
            className={`px-3 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              disclosingAgentEnabled
                ? 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700 shadow-sm'
                : 'bg-stone-50 border-stone-200/80 text-earth-muted hover:text-earth-dark'
            }`}
          >
            <Eye className={`w-3.5 h-3.5 ${disclosingAgentEnabled ? 'text-fuchsia-600' : ''}`} />
            <span className="hidden sm:inline">สีย้อมคราบ</span>
            <Sparkles className="w-3 h-3 text-fuchsia-500" />
          </button>

          {/* Compact Cleanliness Pill */}
          <div className="px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-earth-muted hidden sm:inline">ความสะอาด:</span>
              <span
                className={`text-xs font-extrabold ${
                  cleanlinessScore >= 90
                    ? 'text-emerald-700'
                    : cleanlinessScore >= 50
                    ? 'text-amber-700'
                    : 'text-rose-600'
                }`}
              >
                {cleanlinessScore}%
              </span>
            </div>
            <span className="text-[11px] font-medium text-stone-400">
              ({plaqueCleanedCount}/{totalPlaqueCount})
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
