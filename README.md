# 🦷 Tooth — 3D Interactive Dental Arch Simulator (Modified Bass Edition)

> An accessible, friendly, and non-intimidating 3D dental education simulator designed to teach proper brushing (**Authentic Modified Bass Technique 45° with Real-Time Synchronized 3-Phase Demo**), flossing (C-Shape), and oral hygiene on an **Anatomical U-Arch Dental Model (16 smooth stylized teeth & tube-lofted gums)** with a step-by-step guided lesson card and modern floating island dock.

---

## 🌟 Key Features & Improvements (ฟีเจอร์และการปรับปรุงล่าสุด)

### 1. การ์ดบทเรียนลอยตัวทีละขั้นตอน ([LessonCard.tsx](file:///d:/Github/Tooth/src/components/ui/LessonCard.tsx))
- **Floating Lesson Card (มุมซ้ายบน)**: การ์ดกระจกฝ้าโปร่งแสงนุ่มนวล ไม่เกะกะสายตา
  * **ลำดับขั้นตอนชัดเจน**: เช่น "ขั้นตอนที่ 1/3: วางขนแปรงเอียง 45 องศาเข้าร่องเหงือก"
  * **ตัวหนังสือขนาดใหญ่ อ่านสบายตา**: `text-lg font-medium text-stone-800` พร้อมระยะห่างบรรทัดโปร่งสบาย
  * **ป้ายกำกับเหตุผลทางการแพทย์ (Clinical Rationale)**: "เพื่อกำจัดแบคทีเรียไม่ใช้ออกซิเจนที่สะสมอยู่ใต้ขอบเหงือก"
  * **ปุ่มย้อนกลับ / ถัดไป**: ให้ผู้ใช้คลิกเรียนรู้ตามสปีดของตัวเองได้อย่างอิสระ
  * **Real-Time Sync ในโหมดสาธิต**: เมื่อกด "เริ่มสาธิต" ข้อความในการ์ดจะเปลี่ยนตามจังหวะที่แปรงกำลังขยับแบบเรียลไทม์ (จัดตำแหน่ง 45° -> สั่นวนสั้นๆ 1-2 มม. -> ปัดขนแปรงขึ้น)

### 2. ฉาก 3D สะอาดตา ไร้วัตถุแปลกปลอม
- ปลดเอาทรงกระบอกสีฟ้าที่เคยลอยค้างอยู่ออกอย่างสมบูรณ์แบบ 100%
- ในโหมด "บ้วนปาก" จะแสดงเฉพาะละอองน้ำและฟองอากาศเฉพาะตอนกดสาธิตการบ้วนปากเท่านั้น

### 3. ยกระดับแอนิเมชันสาธิต (3-Phase Modified Bass & Camera Zoom)
ปรับปรุงใน [ToolsModel.tsx](file:///d:/Github/Tooth/src/components/models/ToolsModel.tsx) และ [DentalScene.tsx](file:///d:/Github/Tooth/src/components/canvas/DentalScene.tsx):
1. **Focus Area ชัดเจน**: เมื่อกด "เริ่มสาธิต" กล้อง `OrbitControls` จะเคลื่อนที่ซูมเข้าไปโฟกัสที่ **"ฟันหน้าล่างด้านนอก"** ในมุมที่เห็นองศาของขนแปรงและรอยต่อร่องเหงือกอย่างชัดเจนที่สุด
2. **ตำแหน่งแปรงสมจริง ไร้การเจาะทะลุ (Anti-Collision Guard)**:
   - ด้ามแปรงวาง **"แนวนอนขนานไปตามแนวโค้งของขากรรไกร (Tangent to Dental Arch)"**
   - มีระยะ Offset ป้องกันไม่ให้ตัวแปรงจมทะลุเข้าไปในเนื้อฟันหรือเหงือก ขนแปรงแตะโดนผิวฟันพอดี
3. **จังหวะสาธิต 3 จังหวะสมจริง (Modified Bass Routine)**:
   - **จังหวะที่ 1 (Position/Approach)**: แปรงค่อยๆ แตะเข้าที่รอยต่อเหงือกและฟัน ทำมุม 45 องศาอย่างนุ่มนวล
   - **จังหวะที่ 2 (Vibrate/Jiggle)**: สั่นวนสั้นๆ อยู่กับที่ (1-2 มม. ด้วยความถี่ ~18 Hz) ต่อเนื่อง 3.4 วินาที พร้อมฟองโฟมสีขาวแตกตัวออก
   - **จังหวะที่ 3 (Sweep/Roll)**: บิดข้อมือสะบัดขนแปรงปัดขึ้นด้านบน (Coronal Roll) ผ่านหน้าฟันไปทางด้านบดเคี้ยว 1 ครั้ง
   - วนซ้ำให้เห็นชัดเจน 2 รอบ แล้วหยุดในท่าพร้อมอย่างสวยงาม

### 4. Modern Floating Island Bottom Dock UI ([BottomDock.tsx](file:///d:/Github/Tooth/src/components/ui/BottomDock.tsx))
- ดีไซน์ด็อกทรงแคปซูลมน (`rounded-full`) กระจกฝ้าโปร่งแสง
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
│   │   │   ├── ToolsModel.tsx        # Horizontal Tangent Alignment & 3-Phase Modified Bass
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
