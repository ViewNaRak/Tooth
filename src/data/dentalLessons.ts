import * as THREE from 'three';
import type {
  DentalLesson,
  ToothInfo,
  PlaqueSpot,
  DebrisSpot,
} from '../types/dental';

// Construct the Canonical Mandibular U-Arch Spline Curve
export const MANDIBULAR_ARCH_SPLINE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2.05, -0.05, -1.55), // Right 3rd Molar #48
  new THREE.Vector3(-1.92, -0.03, -0.95), // Right 2nd Molar #47
  new THREE.Vector3(-1.75, 0.0, -0.28),   // Right 1st Molar #46
  new THREE.Vector3(-1.50, 0.02, 0.35),   // Right 2nd Premolar #45
  new THREE.Vector3(-1.24, 0.03, 0.86),   // Right 1st Premolar #44
  new THREE.Vector3(-0.90, 0.04, 1.25),   // Right Canine #43
  new THREE.Vector3(-0.54, 0.03, 1.50),   // Right Lateral Incisor #42
  new THREE.Vector3(-0.18, 0.02, 1.62),   // Right Central Incisor #41
  new THREE.Vector3(0.0, 0.02, 1.64),     // Midline Contact
  new THREE.Vector3(0.18, 0.02, 1.62),    // Left Central Incisor #31
  new THREE.Vector3(0.54, 0.03, 1.50),    // Left Lateral Incisor #32
  new THREE.Vector3(0.90, 0.04, 1.25),    // Left Canine #33
  new THREE.Vector3(1.24, 0.03, 0.86),    // Left 1st Premolar #34
  new THREE.Vector3(1.50, 0.02, 0.35),    // Left 2nd Premolar #35
  new THREE.Vector3(1.75, 0.0, -0.28),    // Left 1st Molar #36
  new THREE.Vector3(1.92, -0.03, -0.95),  // Left 2nd Molar #37
  new THREE.Vector3(2.05, -0.05, -1.55),  // Left 3rd Molar #38
]);

// 16 Anatomical Teeth aligned along the U-Curve
export const FULL_DENTAL_ARCH_TEETH: ToothInfo[] = [
  // --- Right Quadrant (FDI 48 -> 41) ---
  {
    id: 'tooth-48',
    fdaNumber: 48,
    name: 'Right 3rd Molar',
    thaiName: 'ฟันกรามแท้ซี่ที่ 3 ขวา',
    classification: 'molar',
    position: [-2.05, 0.22, -1.55],
    rotation: [0, 1.52, 0],
    scale: [0.95, 0.9, 0.95],
  },
  {
    id: 'tooth-47',
    fdaNumber: 47,
    name: 'Right 2nd Molar',
    thaiName: 'ฟันกรามแท้ซี่ที่ 2 ขวา',
    classification: 'molar',
    position: [-1.92, 0.24, -0.95],
    rotation: [0, 1.40, 0],
    scale: [1.02, 0.95, 1.02],
  },
  {
    id: 'tooth-46',
    fdaNumber: 46,
    name: 'Right 1st Molar',
    thaiName: 'ฟันกรามแท้ซี่ที่ 1 ขวา',
    classification: 'molar',
    position: [-1.75, 0.26, -0.28],
    rotation: [0, 1.24, 0],
    scale: [1.08, 0.98, 1.08],
  },
  {
    id: 'tooth-45',
    fdaNumber: 45,
    name: 'Right 2nd Premolar',
    thaiName: 'ฟันกรามน้อยซี่ที่ 2 ขวา',
    classification: 'premolar',
    position: [-1.50, 0.27, 0.35],
    rotation: [0, 1.04, 0],
    scale: [1.0, 1.0, 1.0],
  },
  {
    id: 'tooth-44',
    fdaNumber: 44,
    name: 'Right 1st Premolar',
    thaiName: 'ฟันกรามน้อยซี่ที่ 1 ขวา',
    classification: 'premolar',
    position: [-1.24, 0.28, 0.86],
    rotation: [0, 0.82, 0],
    scale: [0.96, 1.0, 0.96],
  },
  {
    id: 'tooth-43',
    fdaNumber: 43,
    name: 'Right Canine',
    thaiName: 'ฟันเขี้ยวขวา',
    classification: 'canine',
    position: [-0.90, 0.32, 1.25],
    rotation: [0, 0.58, 0],
    scale: [1.0, 1.08, 1.0],
  },
  {
    id: 'tooth-42',
    fdaNumber: 42,
    name: 'Right Lateral Incisor',
    thaiName: 'ฟันตัดข้างขวา',
    classification: 'incisor',
    position: [-0.54, 0.30, 1.50],
    rotation: [0, 0.30, 0],
    scale: [0.96, 1.02, 0.96],
  },
  {
    id: 'tooth-41',
    fdaNumber: 41,
    name: 'Right Central Incisor',
    thaiName: 'ฟันตัดกลางขวา',
    classification: 'incisor',
    position: [-0.18, 0.30, 1.62],
    rotation: [0, 0.10, 0],
    scale: [1.0, 1.02, 1.0],
  },

  // --- Left Quadrant (FDI 31 -> 38) ---
  {
    id: 'tooth-31',
    fdaNumber: 31,
    name: 'Left Central Incisor',
    thaiName: 'ฟันตัดกลางซ้าย',
    classification: 'incisor',
    position: [0.18, 0.30, 1.62],
    rotation: [0, -0.10, 0],
    scale: [1.0, 1.02, 1.0],
  },
  {
    id: 'tooth-32',
    fdaNumber: 32,
    name: 'Left Lateral Incisor',
    thaiName: 'ฟันตัดข้างซ้าย',
    classification: 'incisor',
    position: [0.54, 0.30, 1.50],
    rotation: [0, -0.30, 0],
    scale: [0.96, 1.02, 0.96],
  },
  {
    id: 'tooth-33',
    fdaNumber: 33,
    name: 'Left Canine',
    thaiName: 'ฟันเขี้ยวซ้าย',
    classification: 'canine',
    position: [0.90, 0.32, 1.25],
    rotation: [0, -0.58, 0],
    scale: [1.0, 1.08, 1.0],
  },
  {
    id: 'tooth-34',
    fdaNumber: 34,
    name: 'Left 1st Premolar',
    thaiName: 'ฟันกรามน้อยซี่ที่ 1 ซ้าย',
    classification: 'premolar',
    position: [1.24, 0.28, 0.86],
    rotation: [0, -0.82, 0],
    scale: [0.96, 1.0, 0.96],
  },
  {
    id: 'tooth-35',
    fdaNumber: 35,
    name: 'Left 2nd Premolar',
    thaiName: 'ฟันกรามน้อยซี่ที่ 2 ซ้าย',
    classification: 'premolar',
    position: [1.50, 0.27, 0.35],
    rotation: [0, -1.04, 0],
    scale: [1.0, 1.0, 1.0],
  },
  {
    id: 'tooth-36',
    fdaNumber: 36,
    name: 'Left 1st Molar',
    thaiName: 'ฟันกรามแท้ซี่ที่ 1 ซ้าย',
    classification: 'molar',
    position: [1.75, 0.26, -0.28],
    rotation: [0, -1.24, 0],
    scale: [1.08, 0.98, 1.08],
  },
  {
    id: 'tooth-37',
    fdaNumber: 37,
    name: 'Left 2nd Molar',
    thaiName: 'ฟันกรามแท้ซี่ที่ 2 ซ้าย',
    classification: 'molar',
    position: [1.92, 0.24, -0.95],
    rotation: [0, -1.40, 0],
    scale: [1.02, 0.95, 1.02],
  },
  {
    id: 'tooth-38',
    fdaNumber: 38,
    name: 'Left 3rd Molar',
    thaiName: 'ฟันกรามแท้ซี่ที่ 3 ซ้าย',
    classification: 'molar',
    position: [2.05, 0.22, -1.55],
    rotation: [0, -1.52, 0],
    scale: [0.95, 0.9, 0.95],
  },
];

// Plaque spots on the U-Arch along the cervical margin and occlusal tables
export const INITIAL_ARCH_PLAQUE: PlaqueSpot[] = [
  // Anterior Labial Gumline
  { id: 'p-1', toothId: 'tooth-41', position: [-0.18, 0.06, 1.84], normal: [0, 0.3, 1], surface: 'buccal', severity: 0.9, cleaned: false },
  { id: 'p-2', toothId: 'tooth-31', position: [0.18, 0.06, 1.84], normal: [0, 0.3, 1], surface: 'buccal', severity: 0.9, cleaned: false },
  { id: 'p-3', toothId: 'tooth-42', position: [-0.56, 0.06, 1.72], normal: [-0.3, 0.3, 0.9], surface: 'buccal', severity: 0.85, cleaned: false },
  { id: 'p-4', toothId: 'tooth-32', position: [0.56, 0.06, 1.72], normal: [0.3, 0.3, 0.9], surface: 'buccal', severity: 0.85, cleaned: false },
  { id: 'p-5', toothId: 'tooth-43', position: [-0.96, 0.07, 1.44], normal: [-0.6, 0.3, 0.8], surface: 'buccal', severity: 0.8, cleaned: false },
  { id: 'p-6', toothId: 'tooth-33', position: [0.96, 0.07, 1.44], normal: [0.6, 0.3, 0.8], surface: 'buccal', severity: 0.8, cleaned: false },

  // Right Premolar & Molar Gumline
  { id: 'p-7', toothId: 'tooth-44', position: [-1.38, 0.07, 1.0], normal: [-0.8, 0.2, 0.6], surface: 'buccal', severity: 0.85, cleaned: false },
  { id: 'p-8', toothId: 'tooth-45', position: [-1.68, 0.07, 0.44], normal: [-0.9, 0.2, 0.4], surface: 'buccal', severity: 0.85, cleaned: false },
  { id: 'p-9', toothId: 'tooth-46', position: [-1.98, 0.06, -0.24], normal: [-0.98, 0.2, 0.2], surface: 'buccal', severity: 0.95, cleaned: false },
  { id: 'p-10', toothId: 'tooth-47', position: [-2.14, 0.05, -0.92], normal: [-0.98, 0.2, 0.1], surface: 'buccal', severity: 0.9, cleaned: false },

  // Left Premolar & Molar Gumline
  { id: 'p-11', toothId: 'tooth-34', position: [1.38, 0.07, 1.0], normal: [0.8, 0.2, 0.6], surface: 'buccal', severity: 0.85, cleaned: false },
  { id: 'p-12', toothId: 'tooth-35', position: [1.68, 0.07, 0.44], normal: [0.9, 0.2, 0.4], surface: 'buccal', severity: 0.85, cleaned: false },
  { id: 'p-13', toothId: 'tooth-36', position: [1.98, 0.06, -0.24], normal: [0.98, 0.2, 0.2], surface: 'buccal', severity: 0.95, cleaned: false },
  { id: 'p-14', toothId: 'tooth-37', position: [2.14, 0.05, -0.92], normal: [0.98, 0.2, 0.1], surface: 'buccal', severity: 0.9, cleaned: false },

  // Interdental Proximal Contact Areas
  { id: 'p-15', toothId: 'tooth-41', position: [0.0, 0.24, 1.62], normal: [0, 0, 1], surface: 'interdental', severity: 0.95, cleaned: false },
  { id: 'p-16', toothId: 'tooth-43', position: [-1.08, 0.22, 1.05], normal: [-0.7, 0, 0.7], surface: 'interdental', severity: 0.9, cleaned: false },
  { id: 'p-17', toothId: 'tooth-33', position: [1.08, 0.22, 1.05], normal: [0.7, 0, 0.7], surface: 'interdental', severity: 0.9, cleaned: false },
  { id: 'p-18', toothId: 'tooth-46', position: [-1.62, 0.22, 0.04], normal: [-0.9, 0, 0.4], surface: 'interdental', severity: 0.95, cleaned: false },
  { id: 'p-19', toothId: 'tooth-36', position: [1.62, 0.22, 0.04], normal: [0.9, 0, 0.4], surface: 'interdental', severity: 0.95, cleaned: false },

  // Occlusal Chewing Grooves
  { id: 'p-20', toothId: 'tooth-46', position: [-1.75, 0.58, -0.28], normal: [0, 1, 0], surface: 'occlusal', severity: 0.8, cleaned: false },
  { id: 'p-21', toothId: 'tooth-36', position: [1.75, 0.58, -0.28], normal: [0, 1, 0], surface: 'occlusal', severity: 0.8, cleaned: false },
  { id: 'p-22', toothId: 'tooth-47', position: [-1.92, 0.55, -0.95], normal: [0, 1, 0], surface: 'occlusal', severity: 0.75, cleaned: false },
  { id: 'p-23', toothId: 'tooth-37', position: [1.92, 0.55, -0.95], normal: [0, 1, 0], surface: 'occlusal', severity: 0.75, cleaned: false },
];

// Debris spots wedged in natural interdental embrasures
export const INITIAL_ARCH_DEBRIS: DebrisSpot[] = [
  { id: 'd-1', interdentalSpace: '41-31', position: [0.0, 0.25, 1.62], cleaned: false, size: 0.075 },
  { id: 'd-2', interdentalSpace: '46-45', position: [-1.62, 0.24, 0.04], cleaned: false, size: 0.085 },
  { id: 'd-3', interdentalSpace: '36-35', position: [1.62, 0.24, 0.04], cleaned: false, size: 0.085 },
  { id: 'd-4', interdentalSpace: '47-46', position: [-1.84, 0.22, -0.62], cleaned: false, size: 0.08 },
  { id: 'd-5', interdentalSpace: '37-36', position: [1.84, 0.22, -0.62], cleaned: false, size: 0.08 },
];

export const COMPACT_DENTAL_LESSONS: Record<string, DentalLesson> = {
  brushing: {
    id: 'brushing',
    title: 'Modified Bass Technique',
    thaiTitle: 'การแปรงฟันแบบโมดิฟายด์บาสส์',
    subtitle: 'Gold Standard 45° Sulcular Cleaning',
    badge: 'ADA Recommended',
    description: 'วิธีแปรงฟันมาตรฐานสากล ขนแปรงเอียง 45° เข้าหาร่องเหงือก สั่นเบาๆ 2-3 มม. แล้วปัดออกทางปลายฟัน',
    metrics: {
      duration: '2 นาที',
      frequency: 'วันละ 2 ครั้ง',
      techniqueName: '45° Sulcus Vibration & Sweep',
    },
    steps: [
      {
        id: 'b-1',
        stepNumber: 1,
        title: 'วางขนแปรง 45 องศาเข้าร่องเหงือก',
        motionType: 'vibrate_sweep',
        targetAngleText: '45° Sulcular Angle',
        shortDescription: 'ชี้ปลายขนแปรงเข้าหาขอบเหงือกทำมุม 45° เพื่อให้ขนแปรงแทรกลึกเข้าร่องเหงือก 1-2 มม.',
        clinicalRationale: 'ร่องเหงือกเป็นแหล่งกบดานของแบคทีเรียไม่ใช้ออกซิเจน (Anaerobic bacteria)',
        tip: 'ใช้แรงกดเพียงเบาๆ ให้ขนแปรงงอเล็กน้อย ห้ามกดจนบาน',
        recommendedTool: 'brush',
        recommendedSurface: 'buccal',
      },
      {
        id: 'b-2',
        stepNumber: 2,
        title: 'สั่นวนสั้นๆ 10 ครั้งต่อตำแหน่ง',
        motionType: 'vibrate_sweep',
        targetAngleText: 'สั่น 2-3 มิลลิเมตร',
        shortDescription: 'ขยับด้ามแปรงเป็นวงกลมเล็กๆ สั้นๆ ในระยะ 2-3 มม. โดยไม่ยกขนแปรงออกจากตำแหน่ง',
        clinicalRationale: 'แรงสั่นจะทำลายการยึดเกาะของ Microbial Biofilm โดยไม่สึกกร่อนผิวเคลือบฟัน',
        tip: 'ห้ามถูไปมาตามขวางแบบเลื่อยไม้เด็ดขาด',
        recommendedTool: 'brush',
        recommendedSurface: 'buccal',
      },
      {
        id: 'b-3',
        stepNumber: 3,
        title: 'ปัดขนแปรงออกสู่ปลายฟัน',
        motionType: 'vibrate_sweep',
        targetAngleText: 'ปัดขึ้น (ฟันล่าง) / ปัดลง (ฟันบน)',
        shortDescription: 'บิดข้อมือปัดขนแปรงผ่านตัวฟันออกทางปลายฟันเพื่อกวาดคราบที่หลุดลอยทิ้ง',
        clinicalRationale: 'การปัดออกช่วยไล่แบคทีเรียออกจากร่องเหงือก ไม่ดันย้อนกลับเข้าไปลึกกว่าเดิม',
        tip: 'แปรงให้ครบทั้งด้านนอก ด้านใน และด้านบดเคี้ยว',
        recommendedTool: 'brush',
        recommendedSurface: 'buccal',
      },
    ],
    warnings: [
      {
        title: 'การแปรงตามขวาง (Horizontal Scrubbing)',
        description: 'การถูแปรงไปมาแนวนอนด้วยแรงมากเกินไป',
        consequence: 'เกิด "คอฟันสึกรูปลิ่ม" (Cervical Abrasion) และเหงือกร่นถาวร เสียวฟันรุนแรง',
      },
    ],
    clinicalBenefits: [
      'กำจัดคราบพลัคในร่องเหงือกได้มากกว่าวิธีทั่วไป 40%',
      'ป้องกันโรคเหงือกอักเสบและปริทันต์',
    ],
  },
  flossing: {
    id: 'flossing',
    title: 'C-Shape Flossing',
    thaiTitle: 'การใช้ไหมขัดฟันรูปตัว C',
    subtitle: 'Interproximal Contact Cleaning',
    badge: '35% Surface Area',
    description: 'ขัดซอกฟันที่ขนแปรงเข้าไม่ถึง โดยโอบไหมแนบผิวฟันเป็นรูปตัว C แล้วรูดขึ้น-ลงอย่างนุ่มนวล',
    metrics: {
      duration: '1 นาที',
      frequency: 'วันละ 1 ครั้ง',
      techniqueName: 'C-Shape Hugging Motion',
    },
    steps: [
      {
        id: 'f-1',
        stepNumber: 1,
        title: 'ขยับซิกแซกผ่านจุดสัมผัสซอกฟัน',
        motionType: 'c_shape_stroke',
        targetAngleText: 'เลื่อยเบาๆ เข้าซอกฟัน',
        shortDescription: 'ค่อยๆ เลื่อนไหมผ่านจุดสัมผัสระหว่างฟันอย่างนุ่มนวล ห้ามดีดหรือกดกระแทกลงตรงๆ',
        clinicalRationale: 'การดีดกระแทกจะทำให้ไหมบาดเหงือกสามเหลี่ยม (Interdental papilla) เลือดออกและเหงือกร่น',
        tip: 'หากฟันชิดแน่น แนะนำใช้ไหมชนิดเคลือบแว็กซ์ (Waxed Floss)',
        recommendedTool: 'floss',
        recommendedSurface: 'interdental',
      },
      {
        id: 'f-2',
        stepNumber: 2,
        title: 'โอบไหมแนบผิวฟันเป็นรูปตัว C',
        motionType: 'c_shape_stroke',
        targetAngleText: 'โอบโค้งรอบผิวด้านข้าง',
        shortDescription: 'ดึงไหมโอบรอบตัวฟันเป็นรูปตัว C เลื่อนลงใต้ขอบเหงือกเล็กน้อยแล้วรูดขึ้น 4-5 ครั้ง',
        clinicalRationale: 'การโอบรูปตัว C จะสัมผัสผิวฟันด้านประชิดได้ครอบคลุม รูดคราบเหนียวและเศษอาหารออกหมดจด',
        tip: 'ทำความสะอาดฟันทั้งสองซี่ในซอกเดียวกันก่อนขยับไปซอกถัดไป',
        recommendedTool: 'floss',
        recommendedSurface: 'interdental',
      },
    ],
    warnings: [
      {
        title: 'การดีดไหมกระแทกเหงือก (Snapping Floss)',
        description: 'การออกแรงกดไหมตรงๆ ผ่านซอกฟันจนกระแทกยอดเหงือก',
        consequence: 'ยอดเหงือกฉีกขาด เกิดช่องว่างสีดำระหว่างฟัน (Black Triangle)',
      },
    ],
    clinicalBenefits: [
      'ทำความสะอาดบริเวณที่แปรงสีฟันเข้าไม่ถึง 100%',
      'ป้องกันฟันผุด้านข้างซอกฟันและลดกลิ่นปาก',
    ],
  },
  rinsing: {
    id: 'rinsing',
    title: 'Therapeutic Rinse',
    thaiTitle: 'การบ้วนปากเสริมการรักษา',
    subtitle: 'Chemical Plaque Control',
    badge: 'Spit, Don\'t Rinse',
    description: 'กลั้วน้ำยาบ้วนปาก 30-60 วินาที บ้วนทิ้งโดยไม่ต้องบ้วนน้ำเปล่าตาม เพื่อคืนแร่ธาตุฟลูออไรด์สู่ผิวฟัน',
    metrics: {
      duration: '30-60 วินาที',
      frequency: 'วันละ 1-2 ครั้ง',
      techniqueName: 'Vigorous Swishing',
    },
    steps: [
      {
        id: 'r-1',
        stepNumber: 1,
        title: 'กลั้วน้ำยาทั่วช่องปาก 30-60 วินาที',
        motionType: 'swish_spit',
        targetAngleText: 'กลั้วผ่านทุกซอกฟัน',
        shortDescription: 'ใช้น้ำยา 15-20 มล. ใช้แรงดันกล้ามเนื้อแก้มกลั้วให้น้ำยาแทรกซึมผ่านทุกซอกฟัน',
        clinicalRationale: 'แรงดันของเหลวจะนำสารออกฤทธิ์ทางยาเข้าสู่ซอกฟันและเนื้อเยื่ออ่อน',
        tip: 'ห้ามกลืนน้ำยาบ้วนปาก',
        recommendedTool: 'rinse',
        recommendedSurface: 'buccal',
      },
      {
        id: 'r-2',
        stepNumber: 2,
        title: 'บ้วนทิ้งและ "ห้าม" บ้วนน้ำเปล่าตาม',
        motionType: 'swish_spit',
        targetAngleText: 'Spit, Don\'t Rinse',
        shortDescription: 'บ้วนน้ำยาออกให้หมด และงดดื่มน้ำหรือรับประทานอาหาร 30 นาที',
        clinicalRationale: 'การบ้วนน้ำตามจะชะล้างไอออนฟลูออไรด์ออกไปจนหมด ขัดขวางกระบวนการ Remineralization',
        tip: 'ยึดหลัก Spit Don\'t Rinse เช่นเดียวกับการแปรงฟันแห้ง',
        recommendedTool: 'rinse',
        recommendedSurface: 'buccal',
      },
    ],
    warnings: [
      {
        title: 'ใช้น้ำยาบ้วนปากแทนการแปรงฟัน',
        description: 'คิดว่าการบ้วนปากสามารถทดแทนการแปรงฟันได้',
        consequence: 'คราบพลัคเป็นไบโอฟิล์มเหนียว ต้องใช้แรงกล (Mechanical Force) ในการขจัดเท่านั้น',
      },
    ],
    clinicalBenefits: [
      'เติมแคลเซียมและฟอสเฟตกลับสู่เคลือบฟัน',
      'เข้าถึงเนื้อเยื่ออ่อน เพดานปาก และโคนลิ้น',
    ],
  },
};
