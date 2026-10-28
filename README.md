# 🦷 Tooth — 3D Interactive Dental Arch Simulator (Modified Bass Edition)

> An accessible, friendly, and non-intimidating 3D dental education simulator designed to teach proper brushing (**Authentic Modified Bass Technique 45° with Orthonormal Tooth Coordinate Frame & Real-Time Synchronized 3-Phase Demo**), flossing (C-Shape), and oral hygiene on an **Anatomical U-Arch Dental Model (16 smooth stylized teeth & tube-lofted gums)** with a step-by-step guided lesson card and modern floating island dock.

---

## 🌟 Key Features & Improvements (ฟีเจอร์และการปรับปรุงล่าสุด)

### 1. แก้ไขพิกัดและการวางทิศทางของแปรงสีฟัน (Orthonormal Tooth Coordinate Frame)
ปรับปรุงใน [ToolsModel.tsx](file:///d:/Github/Tooth/src/components/models/ToolsModel.tsx):
- **กำหนดแกนอ้างอิงของฟันเป้าหมาย (Target Tooth Coordinate Frame)**:
  - คำนวณเวกเตอร์ 3 มิติที่เป็นระบบ Orthonormal แท้จริง (`det = +1` ป้องกันการสะท้อนหรือแกนกลับทิศ):
    * `Normal (N)`: เวกเตอร์พุ่งออกจากผิวหน้าฟันออกไปทางริมฝีปาก/กระพุ้งแก้ม (Outward)
    * `Up (U)`: เวกเตอร์ชี้จากโคนฟันขึ้นไปทางปลายฟัน (Crown direction, `[0, 1, 0]`)
    * `Tangent (T)`: เวกเตอร์แนวนอนขนานไปตามแนวโค้งของขากรรไกร (`T = U × N`)
- **จัดแกนโมเดลแปรงสีฟัน (Toothbrush Pivot & Local Axes)**:
  * ด้ามแปรง (Handle): วางตัวตามแนวระนาบ `Tangent (T)` เสมอ ขนานกับแนวฟัน
  * ขนแปรง (Bristles): หันหน้าเข้าหาผิวฟันเสมอ (`-Normal`)
- **แก้ไขความหมายขององศาการแปรง (แก้บั๊กหัวแปรงชี้ฟ้า 100%)**:
  * **มุม 90 องศา (ตั้งฉาก)**: ขนแปรงหันหน้าทิ่มตรงเข้าหาผิวฟันด้านนอกในแนวนอนระนาบเดียวกับฟัน
  * **มุม 45 องศา (Modified Bass)**: หมุนรอบแกน Tangent ด้วยมุมลบ (Negative Rotation) ทำให้ปลายขนแปรง **"เอียง 45 องศา ชี้ทแยงลงเข้าหาร่องเหงือก (Sulcus)"** พอดี ไม่หงายขึ้นฟ้าเด็ดขาด
- **Anti-Collision Guard & Offset**:
  * ตำแหน่งหัวแปรงอยู่ที่ `Tooth Position + (Normal * 0.38)` ขนแปรงแตะพอดีกับผิวเคลือบฟัน
  * ยกหัวแปรงขึ้นมาอยู่ระดับ **"คอฟัน (Cervical Line, Y = 0.14)"** ไม่จมลงไปในก้อนเนื้อเหงือก

### 2. แอนิเมชันสาธิต 3 จังหวะสมจริง (Modified Bass Demo Routine)
1. **Focus Area ชัดเจน**: เมื่อกด "เริ่มสาธิต" กล้องจะซูมเข้าไปโฟกัสใกล้ชิดที่ **"ฟันหน้าล่างด้านนอก (#41, #31, #42)"** ในมุมที่เห็นการวางแนวขนแปรงและรอยต่อร่องเหงือกได้อย่างชัดเจนที่สุด
2. **จังหวะที่ 1 (Position, 0–1.4s)**: ค่อยๆ แตะเข้าที่คอฟัน ทำมุม 45 องศาชี้ลงเข้าร่องเหงือกอย่างนุ่มนวล
3. **จังหวะที่ 2 (Vibrate, 1.4–4.8s)**: สั่นวนสั้นๆ 1–2 มม. ตามแนว Tangent ต่อเนื่อง 3.4 วินาที พร้อมฟองโฟมสีขาวแตกตัวออก
4. **จังหวะที่ 3 (Sweep, 4.8–6.0s)**: บิดข้อมือสะบัดขนแปรงปัดขึ้นด้านบน (Roll/Sweep up) ผ่านหน้าฟัน 1 ครั้ง เพื่อกวาดคราบทิ้ง

### 3. การ์ดบทเรียนลอยตัวทีละขั้นตอน ([LessonCard.tsx](file:///d:/Github/Tooth/src/components/ui/LessonCard.tsx))
- แสดงขั้นตอน 1/3, 2/3, 3/3 พร้อมปุ่ม "ย้อนกลับ" และ "ถัดไป"
- ตัวหนังสือขนาดใหญ่ `text-xl` ถึง `text-2xl` พร้อมป้ายเหตุผลทางการแพทย์ (Clinical Rationale)
- **Real-Time Sync**: อัปเดตข้อความบนการ์ดสดๆ ตามจังหวะที่แปรงกำลังเคลื่อนไหวจริงในโหมดสาธิต

### 4. Modern Floating Island Bottom Dock UI ([BottomDock.tsx](file:///d:/Github/Tooth/src/components/ui/BottomDock.tsx))
- ด็อกลอยสไตล์โมเดิร์นคลีน (`rounded-full`) กระจกฝ้าโปร่งแสง
- แบ่งกลุ่มชัดเจนด้วยเส้นคั่น: [กลุ่มเครื่องมือ แปรง/ไหม/บ้วน] | [ปุ่มเปิด-ปิดเสียงสังเคราะห์] | [ปุ่มเริ่มสาธิตสีเอิร์ธโทนสุดพรีเมียม] | [ปุ่มรีเซ็ต]

---

## 🛠️ โครงสร้างไฟล์ (File Structure)

```
Tooth/
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   └── DentalScene.tsx       # Soft Studio Lighting, Camera Controller & Demo Focus
│   │   ├── models/
│   │   │   ├── TeethModel.tsx        # 16 Smooth Rounded Teeth (RoundedBox Clay Aesthetic)
│   │   │   ├── GumsModel.tsx         # Anatomical U-Arch Tube Gingiva (No Flat Disc)
│   │   │   ├── PlaqueModel.tsx       # Biofilm Clusters with Disclosing Dye Support
│   │   │   ├── DebrisModel.tsx       # Interdental Food Particles
│   │   │   ├── ToolsModel.tsx        # Orthonormal Tooth Coordinate Frame & Modified Bass
│   │   │   └── ParticlesModel.tsx    # Sparkle & Foam Bubble Burst System
│   │   └── ui/
│   │       ├── LessonCard.tsx        # Floating Step-by-Step Lesson Card (Real-Time Sync)
│   │       ├── TopBar.tsx            # Camera Presets & Cleanliness Meter
│   │       ├── BottomDock.tsx        # Modern Floating Island Dock
│   │       └── GuidePopover.tsx      # Clinical Guide Popover Card
│   ├── utils/
│   │   └── soundEffects.ts           # Procedural Web Audio API Sound Synthesizer
│   ├── data/
│   │   └── dentalLessons.ts          # Mandibular Spline & 16-Tooth Arch Metadata
│   ├── types/
│   │   └── dental.ts                 # Strict TypeScript Type Definitions
│   ├── App.tsx                       # Coordinator
│   ├── main.tsx                      # Entrypoint
│   └── index.css                     # Pastel Theme & Frosted Glass Utility Styles
├── index.html
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 คำสั่งรันโปรเจกต์ (Run Project)

```powershell
# รันโหมด Development
npm run dev

# ทดสอบ Production Build
npm run build
```
