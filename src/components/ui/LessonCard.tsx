import React from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import type { LessonMode } from '../../types/dental';

export type DemoPhase = 'position' | 'vibrate' | 'sweep' | null;

interface LessonCardProps {
  currentLessonId: LessonMode;
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  isSimulating: boolean;
  demoPhase: DemoPhase;
}

interface StepContent {
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
  clinicalRationale: string;
  tip: string;
}

const LESSON_STEPS: Record<LessonMode, StepContent[]> = {
  brushing: [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'วางขนแปรงเอียง 45 องศาเข้าร่องเหงือก',
      instruction: 'วางแนวด้ามแปรงเป็นแนวนอนขนานกับแนวฟัน เอียงปลายขนแปรง 45 องศาชี้ลงเข้าหารอยต่อเหงือกและฟัน (Gingival Sulcus) ให้ขนแปรงแทรกเข้าใต้ร่องเหงือกเบาๆ 1-2 มม.',
      clinicalRationale: 'เพื่อกำจัดแบคทีเรียไม่ใช้ออกซิเจนที่สะสมอยู่ใต้ขอบเหงือก ซึ่งเป็นจุดเริ่มต้นของโรคเหงือกอักเสบ',
      tip: 'ใช้แรงกดเพียงเบาๆ ให้ขนแปรงงอเล็กน้อย ห้ามกดจนขนแปรงบาน',
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'สั่นวนสั้นๆ 1-2 มม. อยู่กับที่ (Jiggle Motion)',
      instruction: 'ขยับด้ามแปรงเป็นวงแคบๆ สั่นไป-มาสั้นๆ ในระยะ 1-2 มม. นับ 1 ถึง 10 ครั้งต่อหนึ่งจุด โดยไม่ยกขนแปรงออกจากร่องเหงือก',
      clinicalRationale: 'แรงสั่นสะเทือนระดับไมโครจะทำลายพันธะของแผ่นคราบจุลินทรีย์ (Biofilm) ให้หลุดลอยโดยไม่สึกกร่อนผิวฟัน',
      tip: 'ห้ามถูไปมาตามขวางแบบเลื่อยไม้เด็ดขาด เพราะจะทำให้คอฟันสึกกร่อน',
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'ปัดขนแปรงขึ้นทางปลายฟัน (Coronal Sweep)',
      instruction: 'บิดข้อมือสะบัดขนแปรงปัดขึ้นด้านบน ผ่านตัวฟันไปทางด้านบดเคี้ยว 1 ครั้ง เพื่อกวาดเศษคราบที่หลุดลอยออกจากร่องเหงือก',
      clinicalRationale: 'การปัดออกช่วยนำพาแบคทีเรียที่หลุดแล้วออกสู่ช่องปาก ไม่ดันย้อนกลับเข้าไปใต้เหงือก',
      tip: 'เมื่อแปรงครบ 2-3 ซี่แล้ว จึงค่อยๆ ย้ายไปยังกลุ่มฟันถัดไปรอบขากรรไกร',
    },
  ],
  flossing: [
    {
      stepNumber: 1,
      totalSteps: 2,
      title: 'ขยับซิกแซกผ่านจุดสัมผัสซอกฟัน',
      instruction: 'ค่อยๆ เลื่อนไหมขัดฟันผ่านจุดสัมผัสระหว่างฟันอย่างนุ่มนวล ห้ามดีดหรือกดกระแทกลงตรงๆ',
      clinicalRationale: 'ป้องกันการบาดเจ็บต่อยอดเหงือกสามเหลี่ยม (Interdental Papilla)',
      tip: 'หากฟันชิดแน่น แนะนำให้ใช้ไหมชนิดเคลือบแว็กซ์ (Waxed Floss)',
    },
    {
      stepNumber: 2,
      totalSteps: 2,
      title: 'โอบไหมแนบผิวฟันเป็นรูปตัว C',
      instruction: 'ดึงไหมโอบรอบตัวฟันเป็นรูปตัว C เลื่อนลงใต้ขอบเหงือกเล็กน้อย แล้วรูดขึ้น-ลง 4-5 ครั้งเพื่อขูดคราบ',
      clinicalRationale: 'ทำความสะอาดพื้นผิวด้านข้างของฟันที่ขนแปรงเข้าไม่ถึงได้ถึง 100%',
      tip: 'ทำความสะอาดฟันทั้งสองซี่ในซอกเดียวกันก่อนย้ายไปซอกถัดไป',
    },
  ],
  rinsing: [
    {
      stepNumber: 1,
      totalSteps: 2,
      title: 'กลั้วน้ำยาทั่วช่องปาก 30-60 วินาที',
      instruction: 'ใช้น้ำยาบ้วนปาก 15-20 มล. ใช้แรงดันกระพุ้งแก้มกลั้วให้น้ำยาแทรกซึมผ่านทุกซอกฟันและเนื้อเยื่ออ่อน',
      clinicalRationale: 'แรงดันของเหลวจะนำสารออกฤทธิ์ฟลูออไรด์เข้าถึงจุดที่แปรงเข้าไม่ถึง',
      tip: 'ห้ามกลืนน้ำยาบ้วนปาก และไม่ควรผสมน้ำเจือจาง',
    },
    {
      stepNumber: 2,
      totalSteps: 2,
      title: 'บ้วนทิ้งและ "ห้าม" บ้วนน้ำเปล่าตาม (Spit, Don\'t Rinse)',
      instruction: 'บ้วนน้ำยาออกให้หมด และงดดื่มน้ำหรือรับประทานอาหารเป็นเวลาอย่างน้อย 30 นาทีหลังบ้วนปาก',
      clinicalRationale: 'เพื่อให้ไอออนฟลูออไรด์คงอยู่บนชั้นเคลือบฟันและทำปฏิกิริยา Remineralization คืนแร่ธาตุสู่ผิวฟัน',
      tip: 'หลักการเดียวกับการแปรงฟันแห้งที่ทันตแพทย์ยุคใหม่รณรงค์',
    },
  ],
};

export const LessonCard: React.FC<LessonCardProps> = ({
  currentLessonId,
  currentStepIndex,
  onNextStep,
  onPrevStep,
  isSimulating,
  demoPhase,
}) => {
  const steps = LESSON_STEPS[currentLessonId];
  const step = steps[Math.min(currentStepIndex, steps.length - 1)];

  // Real-Time Demo Phase Content Override
  let displayTitle = `ขั้นตอนที่ ${step.stepNumber}/${step.totalSteps}: ${step.title}`;
  let displayInstruction = step.instruction;
  let displayBadge = 'คำแนะนำทางคลินิก';
  let badgeColor = 'bg-stone-100 text-stone-700 border-stone-200';

  if (isSimulating && currentLessonId === 'brushing') {
    if (demoPhase === 'position') {
      displayTitle = 'จังหวะที่ 1: วางขนแปรงเอียง 45° แนบร่องเหงือก';
      displayInstruction = 'วางด้ามแปรงแนวนอนขนานกับแนวฟัน ปลายขนแปรงเอียง 45 องศาชี้ลงเข้าร่องเหงือกอย่างนุ่มนวล โดยไม่ให้ตัวแปรงจมทะลุเข้าไปในเหงือก';
      displayBadge = 'กำลังจัดตำแหน่งขนแปรง (45° Placement)';
      badgeColor = 'bg-sky-100 text-sky-800 border-sky-300';
    } else if (demoPhase === 'vibrate') {
      displayTitle = 'จังหวะที่ 2: สั่นวนสั้นๆ 1-2 มม. อยู่กับที่ (Jiggle)';
      displayInstruction = 'ขยับแปรงสั่นไป-มาสั้นๆ เป็นวงแคบๆ 1-2 มม. ต่อเนื่อง 3-4 วินาที เพื่อสลายคราบไบโอฟิล์มใต้ขอบเหงือก พร้อมฟองโฟมสีขาวแตกตัวออก';
      displayBadge = 'กำลังสั่นทำลายแผ่นคราบพลัค...';
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (demoPhase === 'sweep') {
      displayTitle = 'จังหวะที่ 3: ปัดขนแปรงขึ้นผ่านตัวฟัน (Sweep Up)';
      displayInstruction = 'บิดข้อมือสะบัดขนแปรงปัดขึ้นด้านบน ผ่านหน้าฟันไปทางด้านบดเคี้ยว เพื่อกวาดคราบแบคทีเรียที่หลุดลอยแล้วทิ้งออกสู่ปลายฟัน';
      displayBadge = 'กวาดคราบออกจากร่องเหงือก';
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    }
  }

  return (
    <div className="fixed top-24 left-6 z-30 pointer-events-none max-w-md w-[92vw] sm:w-[440px]">
      <div className="pointer-events-auto rounded-3xl p-5 sm:p-6 backdrop-blur-2xl bg-white/92 border border-stone-200/90 shadow-[0_20px_50px_rgba(46,42,39,0.1)] transition-all">
        {/* Step Badge & Simulation Indicator */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`text-xs font-bold uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 transition-colors ${badgeColor}`}
          >
            {isSimulating ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>{displayBadge}</span>
          </span>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-5 bg-stone-800'
                    : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Title: text-xl font-bold */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight leading-snug mb-2">
          {displayTitle}
        </h2>

        {/* Big comfortable text: text-lg font-medium text-stone-800 leading-relaxed */}
        <p className="text-base sm:text-lg font-medium text-stone-800 leading-relaxed mb-4">
          {displayInstruction}
        </p>

        {/* Clinical Rationale Tag */}
        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 mb-4 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-amber-600 mt-1 shrink-0" />
          <div className="text-xs sm:text-sm text-stone-800 leading-relaxed">
            <span className="font-bold text-amber-900">เหตุผลทางการแพทย์: </span>
            <span>{step.clinicalRationale}</span>
          </div>
        </div>

        {/* Prev / Next Navigation Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex === 0 || isSimulating}
            className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </button>

          <span className="text-xs font-semibold text-stone-400">
            ขั้นตอน {currentStepIndex + 1} จาก {step.totalSteps}
          </span>

          <button
            onClick={onNextStep}
            disabled={currentStepIndex >= steps.length - 1 || isSimulating}
            className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 disabled:opacity-30 disabled:hover:bg-stone-100 transition-all flex items-center gap-1 shadow-sm"
          >
            <span>ถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
