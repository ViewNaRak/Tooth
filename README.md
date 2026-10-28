# 🦷 Tooth — 3D Interactive Oral Care Education Platform

> An interactive 3D dental simulator for proper brushing and flossing techniques, built with Vite, React, TypeScript, Three.js, React Three Fiber, and Tailwind CSS.

---

## 🌟 Overview (ภาพรวมโครงการ)

**Tooth** เป็นเว็บแอปพลิเคชัน 3D ทางการแพทย์และการศึกษาทันตกรรม (Clinical Dental Simulator) เพื่อแก้ปัญหาการดูแลสุขภาพช่องปากที่ผิดวิธี เช่น การแปรงฟันตามแนวนอนจนคอฟันสึก (Cervical Abrasion) หรือการไม่ใช้ไหมขัดฟันจนเกิดฟันผุด้านประชิด (Interproximal Caries)

ระบบจำลองกายวิภาคฟันกราม 2 ซี่ที่แนบชิดกันพร้อมขอบเหงือก (Gingival Margin), คราบจุลินทรีย์ (Microbial Biofilm Plaque), และเศษอาหารในซอกฟัน (Food Debris) ในรูปแบบ 3D แบบเรียลไทม์

---

## 📖 Key Clinical Lessons (บทเรียนทันตกรรม)

1. **Modified Bass Technique (การแปรงฟันแบบโมดิฟายด์บาสส์)**
   - **ตำแหน่งและมุม**: วางขนแปรงเอียง 45 องศาเข้าหาร่องเหงือก (Sulcus)
   - **การเคลื่อนไหว**: สั่นวนเบาๆ เป็นระยะสั้น 2-3 มม. (Micro-vibration) นับ 1-10 ครั้งต่อตำแหน่ง
   - **การปัดออก**: ปัดขนแปรงออกจากขอบเหงือกสู่ปลายฟัน (Sweep / Roll)
   - **ข้อควรระวัง**: การแปรงตามขวางแบบเลื่อยไม้ (Horizontal Scrubbing) ทำให้คอฟันสึกกร่อนเป็นรูปลิ่มและเหงือกร่นถาวร

2. **C-Shape Flossing Technique (การใช้ไหมขัดฟันรูปตัวซี)**
   - **การสอด**: ค่อยๆ ขยับซิกแซกผ่านจุดสัมผัส (Contact Point) ห้ามดีดหรือกดกระแทกเหงือก
   - **การโอบ**: ดึงไหมโอบรอบตัวฟันให้แนบสนิทเป็นรูปตัว "C"
   - **การรูด**: รูดขึ้น-ลงในร่องเหงือก 4-5 ครั้งเพื่อกำจัดคราบที่แปรงสีฟันเข้าไม่ถึง (35-40% ของผิวฟัน)

3. **Therapeutic Rinse (การบ้วนปากเสริมการรักษา)**
   - กลั้วน้ำยาบ้วนปากฟลูออไรด์ 30-60 วินาทีให้กระจายทั่วทั้งช่องปาก
   - **หลักการ Spit, Don't Rinse**: บ้วนทิ้งโดยไม่ต้องบ้วนน้ำเปล่าตาม เพื่อคงระดับฟลูออไรด์ในการคืนแร่ธาตุสู่เคลือบฟัน (Remineralization)

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: React 19 + TypeScript + Vite 8
- **3D Graphics Engine**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Styling**: Tailwind CSS + Custom Medical Theme & Glassmorphism
- **Icons**: Lucide React

### โครงสร้างโฟลเดอร์ (Folder Structure)

```
Tooth/
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   └── DentalScene.tsx          # 3D Canvas, Studio Lighting & Orbit Controls
│   │   ├── models/
│   │   │   ├── TeethModel.tsx           # Procedural Anatomical Molar Crown & Enamel
│   │   │   ├── GumsModel.tsx            # Contoured Gingiva & Interdental Papilla
│   │   │   ├── PlaqueModel.tsx          # Biofilm Clusters with Disclosing Dye Support
│   │   │   ├── DebrisModel.tsx          # Interproximal Food Particles
│   │   │   └── ToolsModel.tsx           # Toothbrush (45°), C-Shape Floss, Rinse Stream
│   │   └── ui/
│   │       ├── Header.tsx               # Lesson Switcher & Global Simulation Controls
│   │       ├── LessonGuidePanel.tsx     # Step-by-step Clinical Medical Explanations
│   │       ├── ActionFeedbackPanel.tsx  # Cleanliness Meter, Angle Slider & Medical Warnings
│   │       └── HudOverlay.tsx           # 3D Viewport Controls & Anatomical Legend
│   ├── data/
│   │   └── dentalLessons.ts             # Standard Dental Guidelines & Initial Plaque Data
│   ├── types/
│   │   └── dental.ts                    # Strict TypeScript Interfaces & Type Declarations
│   ├── App.tsx                          # Main Application Coordinator
│   ├── main.tsx                         # React Mount Point
│   └── index.css                        # Tailwind Directives & Custom Theme Styles
├── index.html
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 How to Run (ขั้นตอนการรันโปรเจกต์)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันโหมด Development
```bash
npm run dev
```
เปิดเบราว์เซอร์ที่ `http://localhost:5173`

### 3. ตรวจสอบการ Build (Production Build)
```bash
npm run build
```
โครงการจะรัน TypeScript compiler (`tsc -b`) และสร้าง Production bundle ด้วย Vite โดยปราศจากข้อผิดพลาด
