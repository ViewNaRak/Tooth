import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';
import type { ToolType } from '../../types/dental';

interface BottomDockProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  brushAngle: number;
  onToggleBrushAngle: () => void;
  isSimulating: boolean;
  onStartSimulation: () => void;
  onResetPlaque: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeTool,
  onSelectTool,
  brushAngle,
  onToggleBrushAngle,
  isSimulating,
  onStartSimulation,
  onResetPlaque,
  isMuted,
  onToggleMute,
}) => {
  return (
    <nav
      aria-label="Bottom Control Dock"
      className="fixed bottom-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-[94%] max-w-2xl flex justify-center"
    >
      <div className="pointer-events-auto rounded-full px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-3.5 backdrop-blur-xl bg-white/85 border border-stone-200/70 shadow-[0_20px_50px_rgba(46,42,39,0.08)]">
        {/* [1. กลุ่มเครื่องมือ]: แปรงฟัน / ไหมขัดฟัน / บ้วนปาก */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-full bg-stone-100/70 border border-stone-200/50">
          <button
            onClick={() => onSelectTool('brush')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'brush'
                ? 'bg-emerald-100 text-emerald-900 shadow-sm border border-emerald-200/80'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
            }`}
          >
            <span>🪥</span>
            <span className="hidden xs:inline">แปรงฟัน</span>
          </button>

          <button
            onClick={() => onSelectTool('floss')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'floss'
                ? 'bg-rose-100 text-rose-900 shadow-sm border border-rose-200/80'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
            }`}
          >
            <span>🧵</span>
            <span className="hidden xs:inline">ไหมขัดฟัน</span>
          </button>

          <button
            onClick={() => onSelectTool('rinse')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'rinse'
                ? 'bg-sky-100 text-sky-900 shadow-sm border border-sky-200/80'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
            }`}
          >
            <span>💧</span>
            <span className="hidden xs:inline">บ้วนปาก</span>
          </button>
        </div>

        {/* เส้นคั่น Divider */}
        <div className="h-6 w-px bg-stone-200/90 hidden sm:block" />

        {/* [2. ปุ่มเสียง]: ปุ่มเปิด/ปิดเสียง Compact Sound Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'เปิดเสียงเอฟเฟกต์ (Unmute Sound)' : 'ปิดเสียง (Mute Sound)'}
          className={`p-2 sm:p-2.5 rounded-full transition-all border flex items-center justify-center shrink-0 ${
            isMuted
              ? 'bg-stone-100 text-stone-400 border-stone-200/80 hover:bg-stone-200/70 hover:text-stone-600'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm hover:bg-emerald-100'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* เส้นคั่น Divider */}
        <div className="h-6 w-px bg-stone-200/90 hidden sm:block" />

        {/* [3. กลุ่มควบคุม]: ปุ่มเริ่มสาธิต & 45° Angle Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {activeTool === 'brush' && (
            <button
              onClick={onToggleBrushAngle}
              title="คลิกเพื่อสลับมุมองศาขนแปรง (45° Bass vs 90°)"
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full text-xs font-semibold bg-stone-100/80 hover:bg-stone-200/60 border border-stone-200 text-stone-700 transition-all flex items-center gap-1 shrink-0"
            >
              <span className="text-stone-400 text-[10px]">มุม</span>
              <span
                className={`font-extrabold px-1.5 py-0.5 rounded-full text-[11px] ${
                  brushAngle === 45
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {brushAngle}°
              </span>
              {brushAngle === 45 && <Check className="w-3 h-3 text-emerald-600 hidden sm:inline" />}
            </button>
          )}

          {/* ปุ่มเริ่มสาธิต: แคปซูลพรีเมียมสีครีม/เอิร์ธโทน (ไม่ใช่สีเหลืองฉูดฉาด) */}
          <button
            onClick={onStartSimulation}
            disabled={isSimulating}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
              isSimulating
                ? 'bg-stone-200 text-stone-500 cursor-wait'
                : 'bg-stone-800 hover:bg-stone-900 text-stone-50 shadow-stone-800/15'
            }`}
          >
            {isSimulating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>กำลังสาธิต...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-stone-200" />
                <span>เริ่มสาธิต</span>
              </>
            )}
          </button>

          {/* [4. ปุ่มรีเซ็ต]: ไอคอนหมุนวนขนาดพอดีมือ */}
          <button
            onClick={onResetPlaque}
            title="รีเซ็ตคราบจุลินทรีย์และเศษอาหารใหม่"
            className="p-2 sm:p-2.5 rounded-full bg-stone-100 hover:bg-stone-200/80 border border-stone-200/80 text-stone-500 hover:text-stone-800 transition-all active:scale-95 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
