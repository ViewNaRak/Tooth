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
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-[96%] max-w-2xl flex justify-center"
    >
      <div className="pointer-events-auto rounded-3xl px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3.5 backdrop-blur-2xl bg-white/90 border border-stone-200/80 shadow-[0_20px_50px_rgba(46,42,39,0.1)]">
        {/* [1. กลุ่มเครื่องมือ]: แบบมีไอคอนด้านบนและข้อความกะทัดรัดด้านล่าง (Stacked Icon + Label) */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl bg-stone-100/70 border border-stone-200/50">
          {/* ปุ่มที่ 1: แปรงฟัน */}
          <button
            onClick={() => onSelectTool('brush')}
            className={`min-w-[64px] sm:min-w-[72px] py-1.5 px-2.5 sm:px-3 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 ${
              activeTool === 'brush'
                ? 'bg-emerald-100 text-emerald-900 shadow-sm border border-emerald-300/80'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <span className="text-lg leading-none">🪥</span>
            <span className={`text-xs font-medium ${activeTool === 'brush' ? 'font-bold text-emerald-950' : 'text-stone-700'}`}>
              แปรงฟัน
            </span>
          </button>

          {/* ปุ่มที่ 2: ไหมขัดฟัน */}
          <button
            onClick={() => onSelectTool('floss')}
            className={`min-w-[64px] sm:min-w-[72px] py-1.5 px-2.5 sm:px-3 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 ${
              activeTool === 'floss'
                ? 'bg-rose-100 text-rose-900 shadow-sm border border-rose-300/80'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <span className="text-lg leading-none">🧵</span>
            <span className={`text-xs font-medium ${activeTool === 'floss' ? 'font-bold text-rose-950' : 'text-stone-700'}`}>
              ไหมขัดฟัน
            </span>
          </button>

          {/* ปุ่มที่ 3: บ้วนปาก */}
          <button
            onClick={() => onSelectTool('rinse')}
            className={`min-w-[64px] sm:min-w-[72px] py-1.5 px-2.5 sm:px-3 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 ${
              activeTool === 'rinse'
                ? 'bg-sky-100 text-sky-900 shadow-sm border border-sky-300/80'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <span className="text-lg leading-none">💧</span>
            <span className={`text-xs font-medium ${activeTool === 'rinse' ? 'font-bold text-sky-950' : 'text-stone-700'}`}>
              บ้วนปาก
            </span>
          </button>
        </div>

        {/* เส้นคั่น Divider */}
        <div className="h-8 w-px bg-stone-200/80 hidden sm:block" />

        {/* [2. ปุ่มเสียง]: ปุ่มเปิด/ปิดเสียง Compact Sound Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'เปิดเสียงเอฟเฟกต์ (Unmute Sound)' : 'ปิดเสียง (Mute Sound)'}
          className={`p-2.5 sm:p-3 rounded-2xl transition-all border flex items-center justify-center shrink-0 ${
            isMuted
              ? 'bg-stone-100 text-stone-400 border-stone-200/80 hover:bg-stone-200/70 hover:text-stone-600'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm hover:bg-emerald-100'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* เส้นคั่น Divider */}
        <div className="h-8 w-px bg-stone-200/80 hidden sm:block" />

        {/* [3. กลุ่มควบคุม]: ปุ่มเริ่มสาธิต & 45° Angle Indicator */}
        <div className="flex items-center gap-2">
          {activeTool === 'brush' && (
            <button
              onClick={onToggleBrushAngle}
              title="คลิกเพื่อสลับมุมองศาขนแปรง (45° Bass vs 90°)"
              className="px-3 py-2 sm:py-2.5 rounded-2xl text-xs font-semibold bg-stone-100/90 hover:bg-stone-200/70 border border-stone-200 text-stone-700 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span className="text-stone-400 text-[11px]">มุม</span>
              <span
                className={`font-extrabold px-1.5 py-0.5 rounded-full text-xs ${
                  brushAngle === 45
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {brushAngle}°
              </span>
              {brushAngle === 45 && <Check className="w-3.5 h-3.5 text-emerald-600 hidden sm:inline" />}
            </button>
          )}

          {/* ปุ่มเริ่มสาธิต: แคปซูลพรีเมียมสีครีม/เอิร์ธโทน */}
          <button
            onClick={onStartSimulation}
            disabled={isSimulating}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
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
            className="p-2.5 sm:p-3 rounded-2xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200/80 text-stone-500 hover:text-stone-800 transition-all active:scale-95 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
