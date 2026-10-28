import React from 'react';
import { RotateCcw, Navigation } from 'lucide-react';

interface HudOverlayProps {
  onResetCamera: () => void;
  disclosingAgentEnabled: boolean;
  activeMotionText: string;
}

export const HudOverlay: React.FC<HudOverlayProps> = ({
  onResetCamera,
  disclosingAgentEnabled,
  activeMotionText,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-10">
      {/* Top Floating Badge */}
      <div className="flex items-center justify-between w-full">
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-slate-200">
            {activeMotionText}
          </span>
        </div>

        <button
          onClick={onResetCamera}
          title="รีเซ็ตมุมกล้อง"
          className="pointer-events-auto px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-xs font-medium text-slate-300 hover:text-white hover:border-slate-500 transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>รีเซ็ตมุมกล้อง</span>
        </button>
      </div>

      {/* Bottom Floating Legend & Camera Guidance */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 w-full">
        {/* Anatomical Color Legend */}
        <div className="pointer-events-auto p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbfbf9] border border-slate-400 shadow-sm" />
            <span className="text-slate-300">เคลือบฟัน (Enamel)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e57388]" />
            <span className="text-slate-300">เหงือก (Gingiva)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                disclosingAgentEnabled ? 'bg-fuchsia-500' : 'bg-yellow-400'
              }`}
            />
            <span className="text-slate-300">
              {disclosingAgentEnabled ? 'คราบพลัค (ย้อมสี)' : 'คราบจุลินทรีย์ (Biofilm)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <span className="text-slate-300">เศษอาหารซอกฟัน</span>
          </div>
        </div>

        {/* Viewport Navigation Tip */}
        <div className="pointer-events-auto px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-800/70 backdrop-blur-md text-[11px] text-slate-400 flex items-center gap-1.5">
          <Navigation className="w-3 h-3 text-cyan-400" />
          <span>คลิกซ้าย + ลากเพื่อหมุน 3D | สกอลล์เพื่อซูม</span>
        </div>
      </div>
    </div>
  );
};
