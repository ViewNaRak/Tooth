import type { DentalLesson, PlaqueSpot, DebrisSpot } from '../types/dental';

export const INITIAL_PLAQUE_SPOTS: PlaqueSpot[] = [
  // Cervical margin (gumline) - Tooth 1 (Left Molar)
  { id: 'plaque-1', position: [-0.75, -0.15, 0.78], normal: [0, 0.2, 1], surface: 'buccal', severity: 0.9, cleaned: false },
  { id: 'plaque-2', position: [-1.05, -0.18, 0.72], normal: [-0.3, 0.2, 0.9], surface: 'buccal', severity: 0.85, cleaned: false },
  { id: 'plaque-3', position: [-0.45, -0.16, 0.75], normal: [0.2, 0.2, 0.9], surface: 'buccal', severity: 0.8, cleaned: false },
  
  // Cervical margin (gumline) - Tooth 2 (Right Molar)
  { id: 'plaque-4', position: [0.75, -0.15, 0.78], normal: [0, 0.2, 1], surface: 'buccal', severity: 0.9, cleaned: false },
  { id: 'plaque-5', position: [0.45, -0.16, 0.75], normal: [-0.2, 0.2, 0.9], surface: 'buccal', severity: 0.85, cleaned: false },
  { id: 'plaque-6', position: [1.05, -0.18, 0.72], normal: [0.3, 0.2, 0.9], surface: 'buccal', severity: 0.8, cleaned: false },

  // Interdental proximal surfaces (between teeth)
  { id: 'plaque-7', position: [-0.08, 0.15, 0.35], normal: [1, 0, 0.2], surface: 'interdental', severity: 0.95, cleaned: false },
  { id: 'plaque-8', position: [0.08, 0.15, 0.35], normal: [-1, 0, 0.2], surface: 'interdental', severity: 0.95, cleaned: false },
  { id: 'plaque-9', position: [-0.06, -0.05, 0.2], normal: [1, 0.1, 0.1], surface: 'interdental', severity: 0.9, cleaned: false },
  { id: 'plaque-10', position: [0.06, -0.05, 0.2], normal: [-1, 0.1, 0.1], surface: 'interdental', severity: 0.9, cleaned: false },

  // Occlusal fissures (Chewing grooves - Tooth 1)
  { id: 'plaque-11', position: [-0.85, 0.88, 0.05], normal: [0, 1, 0], surface: 'occlusal', severity: 0.75, cleaned: false },
  { id: 'plaque-12', position: [-0.65, 0.86, -0.2], normal: [0, 1, 0], surface: 'occlusal', severity: 0.7, cleaned: false },

  // Occlusal fissures (Chewing grooves - Tooth 2)
  { id: 'plaque-13', position: [0.65, 0.86, -0.2], normal: [0, 1, 0], surface: 'occlusal', severity: 0.75, cleaned: false },
  { id: 'plaque-14', position: [0.85, 0.88, 0.05], normal: [0, 1, 0], surface: 'occlusal', severity: 0.7, cleaned: false },

  // Lingual / Palatal cervical margin
  { id: 'plaque-15', position: [-0.75, -0.15, -0.78], normal: [0, 0.2, -1], surface: 'lingual', severity: 0.85, cleaned: false },
  { id: 'plaque-16', position: [0.75, -0.15, -0.78], normal: [0, 0.2, -1], surface: 'lingual', severity: 0.85, cleaned: false },
];

export const INITIAL_DEBRIS_SPOTS: DebrisSpot[] = [
  { id: 'debris-1', position: [0.0, 0.3, 0.25], cleaned: false, size: 0.11 },
  { id: 'debris-2', position: [0.0, 0.05, 0.18], cleaned: false, size: 0.09 },
  { id: 'debris-3', position: [0.0, 0.5, 0.05], cleaned: false, size: 0.08 },
];

export const DENTAL_LESSONS: Record<string, DentalLesson> = {
  brushing: {
    id: 'brushing',
    title: 'Modified Bass Technique',
    thaiTitle: 'เทคนิคการแปรงฟันแบบโมดิฟายด์บาสส์',
    subtitle: 'Gold standard for plaque biofilm removal along the gingival margin',
    badge: 'Clinical Standard: ADA & FDI',
    description: 'วิธีแปรงฟันที่ทันตแพทย์ทั่วโลกแนะนำ เพื่อกำจัดคราบจุลินทรีย์บริเวณคอฟันและร่องเหงือก ซึ่งเป็นจุดเริ่มต้นของโรคเหงือกอักเสบและฟันผุ',
    metrics: {
      duration: '2 - 3 นาที',
      frequency: 'อย่างน้อยวันละ 2 ครั้ง (เช้า-ก่อนนอน)',
      techniqueName: '45° Angle Vibrating & Sweeping',
    },
    steps: [
      {
        id: 'step-bass-1',
        stepNumber: 1,
        title: 'วางขนแปรงเอียง 45 องศาเข้าหาร่องเหงือก',
        motionType: 'vibrate_sweep',
        targetAngleText: '45° ทำมุมกับแกนฟัน',
        description: 'วางปลายขนแปรงแนบชิดบริเวณรอยต่อระหว่างเหงือกกับฟัน (Cervical margin) โดยทำมุม 45 องศา ชี้ปลายขนแปรงเข้าหาขอบเหงือกเพื่อให้ขนแปรงซอกซอนเข้าร่องเหงือกได้ 1-2 มม.',
        clinicalRationale: 'ร่องเหงือก (Gingival Sulcus) เป็นแหล่งสะสมแบคทีเรีย Anaerobic bacteria ที่ไม่ชอบออกซิเจน การวาง 45 องศาช่วยรบกวน Biofilm ได้ตรงจุดที่สุด',
        tip: 'ออกแรงกดพอประมาณ ให้ขนแปรงงอเล็กน้อย ห้ามกดจนขนแปรงบานแตกลาย',
        recommendedTool: 'brush',
        recommendedSurface: 'buccal',
      },
      {
        id: 'step-bass-2',
        stepNumber: 2,
        title: 'ขยับวนหรือสั่นเบาๆ ในช่วงสั้นๆ (Vibrate / Circular)',
        motionType: 'vibrate_sweep',
        targetAngleText: 'ช่วงขยับ 2-3 มิลลิเมตร',
        description: 'ขยับด้ามแปรงเป็นวงกลมเล็กๆ หรือสั่นหน้า-หลังเบาๆ ในระยะสั้นมาก (2-3 มม.) โดยไม่ให้ขนแปรงหลุดออกจากตำแหน่งเดิม นับ 1 ถึง 10 ครั้งต่อหนึ่งจุด (ครอบคลุมฟัน 2-3 ซี่)',
        clinicalRationale: 'แรงสั่นสะเทือนจะทำลายการยึดเกาะของแผ่นคราบจุลินทรีย์ (Microbial Biofilm) ให้หลุดลอยออกมาโดยไม่ทำลายชั้นเคลือบฟัน',
        tip: 'ห้ามถูไปมาเป็นแนวนอนยาวๆ (Horizontal Scrubbing) เด็ดขาด เพราะจะทำให้คอฟันสึกกร่อน',
        recommendedTool: 'brush',
        recommendedSurface: 'buccal',
      },
      {
        id: 'step-bass-3',
        stepNumber: 3,
        title: 'ปัดขนแปรงออกทางปลายฟัน (Sweep / Roll)',
        motionType: 'vibrate_sweep',
        targetAngleText: 'ปัดขึ้นสำหรับฟันล่าง / ปัดลงสำหรับฟันบน',
        description: 'หลังจากสั่นเบาๆ ครบ 10 ครั้ง ให้บิดข้อมือปัดขนแปรงผ่านตัวฟันออกไปยังปลายฟัน (ฟันบนปัดลง ฟันล่างปัดขึ้น) เพื่อกวาดเศษคราบจุลินทรีย์ออกจากผิวฟัน',
        clinicalRationale: 'การปัดออกช่วยนำพาแบคทีเรียที่หลุดจากร่องเหงือกให้ออกสู่ช่องปาก ไม่ดันแบคทีเรียย้อนกลับเข้าไปใต้เหงือก',
        tip: 'แปรงให้ครบทุกด้าน: ด้านนอก (Buccal), ด้านใน (Lingual/Palatal) และด้านบดเคี้ยว (Occlusal)',
        recommendedTool: 'brush',
        recommendedSurface: 'buccal',
      },
      {
        id: 'step-bass-4',
        stepNumber: 4,
        title: 'แปรงด้านบดเคี้ยวและด้านในลิ้น',
        motionType: 'chewing_surface',
        targetAngleText: 'ตั้งฉาก 90° กับร่องฟัน',
        description: 'วางขนแปรงตั้งฉากบนด้านบดเคี้ยว ถูเข้าออกสั้นๆ ตามแนวร่องฟัน (Fissures) จากนั้นตั้งแปรงแนวตั้งสำหรับด้านในของฟันหน้า',
        clinicalRationale: 'ร่องฟันกรามมีหลุมลึกที่อาหารและแบคทีเรียตกค้างได้ง่าย การถูสั้นๆ บนด้านบดเคี้ยวจะเข้าถึงหลุมฟันลึกได้ดี',
        tip: 'อย่าลืมแปรงลิ้นเบาๆ เพื่อกำจัดแบคทีเรียต้นเหตุของกลิ่นปาก',
        recommendedTool: 'brush',
        recommendedSurface: 'occlusal',
      },
    ],
    warnings: [
      {
        title: 'อันตรายจากการแปรงตามขวาง (Horizontal Scrubbing)',
        description: 'การแปรงฟันแบบเลื่อยหรือถูไปมาตามแนวนอนด้วยแรงมากเกินไป',
        consequence: 'ก่อให้เกิด "คอฟันสึกรูปลิ่ม" (Cervical Abrasion / Wedge Defect) และเหงือกร่น (Gingival Recession) ส่งผลให้เสียวฟันรุนแรงและอาจทะลุโพรงประสาทฟัน',
      },
      {
        title: 'ขนแปรงแข็งเกินไป (Hard Bristles)',
        description: 'การเลือกใช้ขนแปรงชนิดแข็งเพราะคิดว่าจะขัดสะอาดกว่า',
        consequence: 'ทำลายชั้นเคลือบฟัน (Enamel) และทำให้ขอบเหงือกฉีกขาดระคายเคืองเรื้อรัง ควรเลือกขนแปรงปลายเรียวแหลม นุ่มพิเศษ (Soft / Ultra-soft) เสมอ',
      },
    ],
    clinicalBenefits: [
      'ลดการสะสมของคราบพลัคในร่องเหงือกได้มากกว่าการแปรงทั่วไปถึง 40%',
      'ป้องกันโรคเหงือกอักเสบ (Gingivitis) และโรคปริทันต์อักเสบ (Periodontitis)',
      'ป้องกันอาการเสียวฟันจากการที่คอฟันไม่สึกกร่อนผิดวิธี',
    ],
  },
  flossing: {
    id: 'flossing',
    title: 'C-Shape Flossing Technique',
    thaiTitle: 'เทคนิคการใช้ไหมขัดฟันรูปตัวซี (C-Shape)',
    subtitle: 'Essential care for interproximal contact surfaces where toothbrushes cannot reach',
    badge: '35-40% Surface Coverage',
    description: 'การแปรงฟันทำความสะอาดได้เพียง 60% ของผิวฟัน ไหมขัดฟันจึงเป็นสิ่งจำเป็นอย่างยิ่งในการทำความสะอาดซอกฟันที่แปรงเข้าไม่ถึง เพื่อป้องกันฟันผุด้านประชิด',
    metrics: {
      duration: '1 - 2 นาที',
      frequency: 'วันละ 1 ครั้งเป็นประจำ (แนะนำก่อนนอน)',
      techniqueName: 'C-Shape Hugging Motion',
    },
    steps: [
      {
        id: 'step-floss-1',
        stepNumber: 1,
        title: 'เตรียมไหมยาว 40-45 ซม. พันนิ้วกลางทั้งสองข้าง',
        motionType: 'c_shape_stroke',
        targetAngleText: 'เหลือระยะไหมใช้งาน 2-3 ซม.',
        description: 'ดึงไหมขัดฟันยาวประมาณข้อศอก (45 ซม.) พันไว้รอบนิ้วกลางทั้งสองข้าง เหลือส่วนตรงกลางไว้ 2-3 ซม. ใช้นิ้วโป้งและนิ้วชี้คอยจับนำทางและประคองไหมอย่างมั่นคง',
        clinicalRationale: 'การพันที่นิ้วกลางจะช่วยให้นิ้วชี้และนิ้วโป้งอิสระ สามารถควบคุมทิศทางและแรงกดได้อย่างแม่นยำที่สุดทั้งฟันหน้าและฟันกรามในสุด',
        tip: 'เมื่อย้ายซอกฟัน ให้คลายไหมสะอาดจากนิ้วข้างหนึ่งและม้วนไหมที่ใช้แล้วเก็บเข้าอีกข้าง',
        recommendedTool: 'floss',
        recommendedSurface: 'interdental',
      },
      {
        id: 'step-floss-2',
        stepNumber: 2,
        title: 'สอดผ่านจุดสัมผัสซอกฟันด้วยการขยับซิกแซกเบาๆ',
        motionType: 'c_shape_stroke',
        targetAngleText: 'ขยับเลื่อยเบาๆ เข้าจุด Contact',
        description: 'ค่อยๆ เลื่อนไหมผ่านจุดสัมผัสระหว่างฟัน (Contact point) ด้วยการขยับไปมาเบาๆ ในแนวหน้า-หลัง ห้ามกดหรือดีดไหมกระแทกลงไปตรงๆ',
        clinicalRationale: 'การกดกระแทกแรงๆ จะทำให้ไหมบาดเหงือกสามเหลี่ยม (Interdental Papilla) เกิดแผลเลือดออกและทำให้เหงือกร่นเกิดช่องว่างดำ (Black Triangle)',
        tip: 'หากฟันชิดแน่นมาก ให้เลือกใช้ไหมชนิดเคลือบแว็กซ์ (Waxed Dental Floss) หรือชนิดเทป (Dental Tape)',
        recommendedTool: 'floss',
        recommendedSurface: 'interdental',
      },
      {
        id: 'step-floss-3',
        stepNumber: 3,
        title: 'โอบไหมแนบชิดผิวฟันเป็นรูปตัว C (C-Shape Hug)',
        motionType: 'c_shape_stroke',
        targetAngleText: 'โอบโค้งรอบผิวด้านข้างตัวฟัน',
        description: 'เมื่อไหมผ่านจุดสัมผัสลงมาถึงร่องเหงือก ให้ดึงไหมโอบรอบตัวฟันซี่หนึ่งให้มีรูปร่างโค้งคล้ายตัวอักษร "C" ค่อยๆ เลื่อนไหมลงไปใต้รอยต่อขอบเหงือกเล็กน้อยจนรู้สึกตึง',
        clinicalRationale: 'ฟันมีลักษณะทรงกระบอกโค้งมน การดึงไหมเป็นเส้นตรงจะไม่สัมผัสคราบพลัค การโอบโค้งรูป C จะกวาดแผ่นชีวภาพบนผิวฟันได้รอบด้าน',
        tip: 'ขัดฟันซี่หนึ่งเสร็จแล้ว ให้โอบกลับไปขัดฟันอีกซี่หนึ่งในซอกเดียวกันก่อนดึงไหมขึ้น',
        recommendedTool: 'floss',
        recommendedSurface: 'interdental',
      },
      {
        id: 'step-floss-4',
        stepNumber: 4,
        title: 'รูดไหมขึ้น-ลงแนบผิวฟัน 4-5 ครั้งเพื่อขจัดคราบ',
        motionType: 'c_shape_stroke',
        targetAngleText: 'รูดจากโคนฟันขึ้นสู่ปลายฟัน',
        description: 'ขยับไหมรูดขึ้น-ลงแนบสนิทกับผิวฟัน 4-5 ครั้งเพื่อขูดคราบจุลินทรีย์และเศษอาหารออก จากนั้นค่อยๆ ดึงไหมออกจากซอกฟันอย่างนุ่มนวล',
        clinicalRationale: 'แรงเสียดทานจากการรูดไหมจะดึงทั้งแผ่นคราบจุลินทรีย์และเศษอาหารที่ติดแน่นอยู่ใต้ Contact point ออกมาอย่างหมดจด',
        tip: 'หากมีเลือดซึมในช่วงแรก แสดงว่าเหงือกมีภาวะอักเสบสะสม ให้ขัดต่อไปอย่างถูกวิธี เลือดจะหยุดใน 1-2 สัปดาห์',
        recommendedTool: 'floss',
        recommendedSurface: 'interdental',
      },
    ],
    warnings: [
      {
        title: 'การดีดหรือกดไหมกระแทกลงบนยอดเหงือก (Snapping Floss)',
        description: 'การออกแรงกดไหมขัดฟันตรงๆ ผ่านจุดสัมผัสจนกระแทกเข้ากับเหงือกอย่างรวดเร็ว',
        consequence: 'เกิดการบาดเจ็บต่อยอดเหงือก (Gingival Cleft) เลือดออก และทำให้ยอดเหงือกฝ่อร่นจนเกิดรอยต่อฟันเป็นช่องดำ (Black Triangle) แก้ไขยาก',
      },
      {
        title: 'การละเลยไม่ใช้ไหมขัดฟัน (Skipping Interdental Cleaning)',
        description: 'คิดว่าการแปรงฟันอย่างเดียวเพียงพอแล้ว',
        consequence: 'ผิวฟันประมาณ 35-40% ไม่เคยได้รับการทำความสะอาด นำไปสู่ฟันผุด้านประชิด (Interproximal Caries) และกลิ่นปากเรื้อรัง',
      },
    ],
    clinicalBenefits: [
      'ทำความสะอาดบริเวณซอกฟันที่ขนแปรงทั่วไปไม่สามารถเข้าถึงได้ถึง 100%',
      'ป้องกันฟันผุด้านข้างซอกฟัน ซึ่งมักตรวจพบช้าและต้องรักษารากฟัน',
      'ลดกลิ่นปากที่เกิดจากเศษโปรตีนและแบคทีเรียหมักหมมระหว่างซี่ฟัน',
    ],
  },
  rinsing: {
    id: 'rinsing',
    title: 'Therapeutic Rinse & Oral Care',
    thaiTitle: 'การบ้วนปากเสริมการรักษาและการทำความสะอาดช่องปาก',
    subtitle: 'Chemical plaque control and enamel remineralization guidelines',
    badge: 'Complementary Care',
    description: 'การบ้วนปากด้วยน้ำยาที่มีสารออกฤทธิ์ทางยาหรือฟลูออไรด์ เพื่อเสริมสร้างความแข็งแรงของชั้นเคลือบฟันและยับยั้งการเจริญเติบโตรอบช่องปาก',
    metrics: {
      duration: '30 - 60 วินาที',
      frequency: 'วันละ 1-2 ครั้ง ตามคำแนะนำของทันตแพทย์',
      techniqueName: 'Vigorous Swishing & Spit (Don\'t Rinse)',
    },
    steps: [
      {
        id: 'step-rinse-1',
        stepNumber: 1,
        title: 'ตวงปริมาณ 15-20 มล. กลั้วทั่วช่องปากอย่างกระฉับกระเฉง',
        motionType: 'swish_spit',
        targetAngleText: 'กลั้วทั่วถึงทั้งฟันหน้า ฟันกราม และกระพุ้งแก้ม',
        description: 'เทน้ำยาบ้วนปาก 15-20 มล. อมไว้ในปากแล้วใช้กล้ามเนื้อแก้มและลิ้นดันน้ำยาผ่านซอกฟันทุกซี่เป็นเวลา 30-60 วินาที',
        clinicalRationale: 'แรงดันไฮดรอลิกจากการกลั้วจะผลักสารออกฤทธิ์ (Active ingredients) เช่น ฟลูออไรด์ หรือ Cetylpyridinium Chloride (CPC) เข้าสู่ซอกฟันและร่องเหงือก',
        tip: 'ห้ามกลืนน้ำยาบ้วนปาก และไม่ควรผสมน้ำเปล่าเจือจางหากฉลากไม่ได้ระบุ',
        recommendedTool: 'rinse',
        recommendedSurface: 'buccal',
      },
      {
        id: 'step-rinse-2',
        stepNumber: 2,
        title: 'บ้วนทิ้งและ "ห้าม" บ้วนน้ำเปล่าตามทันที (Spit, Don\'t Rinse)',
        motionType: 'swish_spit',
        targetAngleText: 'งดดื่มน้ำหรือทานอาหาร 30 นาที',
        description: 'บ้วนน้ำยาออกจากปากให้หมด ห้ามบ้วนน้ำเปล่าตาม และควรงดดื่มน้ำหรือรับประทานอาหารเป็นเวลาอย่างน้อย 30 นาทีหลังบ้วนปาก',
        clinicalRationale: 'การบ้วนน้ำเปล่าตามจะชะล้างไอออนฟลูออไรด์ออกไปจนหมด ทำให้กระบวนการคืนกลับแร่ธาตุ (Remineralization) สู่ชั้นเคลือบฟันไม่เกิดขึ้น',
        tip: 'หลักการเดียวกับการแปรงฟันแห้ง (Spit don\'t rinse) ที่ทันตแพทย์ยุคใหม่รณรงค์',
        recommendedTool: 'rinse',
        recommendedSurface: 'buccal',
      },
    ],
    warnings: [
      {
        title: 'ใช้น้ำยาบ้วนปากแทนการแปรงฟัน (Rinse as Replacement)',
        description: 'คิดว่าการบ้วนปากฆ่าเชื้อโรคสามารถทดแทนการแปรงฟันและใช้ไหมขัดฟันได้',
        consequence: 'คราบพลัคคือแผ่นฟิล์มชีวภาพที่เหนียวแน่น (Sticky Biofilm) สารเคมีเพียงอย่างเดียวไม่สามารถสลายออกได้ จำเป็นต้องใช้แรงกล (Mechanical Removal) จากแปรงและไหมขัดฟันเท่านั้น',
      },
      {
        title: 'ใช้น้ำยาบ้วนปากที่มีแอลกอฮอล์สูงต่อเนื่องเป็นเวลานาน',
        description: 'น้ำยาบ้วนปากที่มีปริมาณ Alcohol สูงทำให้เยื่อบุช่องปากแห้งตึง',
        consequence: 'ภาวะปากแห้ง (Xerostomia) ลดการหลั่งน้ำลายธรรมชาติ ซึ่งน้ำลายคือเกราะป้องกันฟันผุที่ดีที่สุด ทำให้เสี่ยงฟันผุเพิ่มขึ้นและมีกลิ่นปาก',
      },
    ],
    clinicalBenefits: [
      'ส่งเสริมกระบวนการ Remineralization เติมแคลเซียมและฟอสเฟตกลับสู่ผิวฟัน',
      'เข้าถึงบริเวณเนื้อเยื่ออ่อน ลิ้น กระพุ้งแก้ม และเพดานปากที่แปรงเข้าไม่ถึง',
      'ควบคุมปริมาณแบคทีเรียและลดการก่อตัวของกรดจากอาหารในช่องปาก',
    ],
  },
};
