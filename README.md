# 🦷 Tooth — 3D Interactive Dental Arch Simulator (Modified Bass Edition)

> An accessible, friendly, and non-intimidating 3D dental simulator designed to teach proper brushing (**Authentic Modified Bass Technique 45° with 2-Phase Jiggle & Sweep**), flossing (C-Shape), and oral hygiene on an **Anatomical U-Arch Dental Model (16 smooth stylized teeth & tube-lofted gums)** with a modern minimalist floating island dock.

---

## 🌟 Key Features & Improvements (ฟีเจอร์และการปรับปรุงล่าสุด)

### 1. Modern Floating Island Bottom Dock UI ([BottomDock.tsx](file:///d:/Github/Tooth/src/components/ui/BottomDock.tsx))
- **Floating Pill Design (`rounded-full`)**: ด็อกลอยสไตล์โมเดิร์นคลีน กระจกฝ้าโปร่งแสง (`backdrop-blur-xl bg-white/85 border border-stone-200/70 shadow-2xl`)
- **จัดกลุ่มฟังก์ชันชัดเจนด้วยเส้นคั่น (Dividers)**:
  - **[กลุ่มเครื่องมือ]**: แปรงฟัน (🪥) / ไหมขัดฟัน (🧵) / บ้วนปาก (💧) พร้อมไฮไลต์พาสเทลมินต์-พีชนุ่มตา
  - **[ปุ่มเสียง]**: ไอคอนลำโพงเปิด/ปิดเสียง Compact Sound Toggle (`Volume2` / `VolumeX`) วางเคียงข้างแถบเครื่องมืออย่างกลมกลืน
  - **[กลุ่มควบคุม]**:
    - **ปุ่มเริ่มสาธิต (Play Demo)**: สไตล์แคปซูลสีครีม/เอิร์ธโทนสุดพรีเมียม ไม่ใช้สีเหลืองฉูดฉาด
    - **ปุ่มสลับมุม 45°**: บ่งบอกสถานะมุมองศาแปรงอย่างชัดเจน
  - **[ปุ่มรีเซ็ต]**: ไอคอนหมุนวนขนาดพอดีมือ

### 2. ฟิสิกส์และท่าทางการแปรงฟันตามหลักทันตแพทย์จริง (Modified Bass Technique)
ปรับปรุงใน [ToolsModel.tsx](file:///d:/Github/Tooth/src/components/models/ToolsModel.tsx):
- **การวางแนวด้ามแปรงตามแนวโค้งขากรรไกร (Tangent Alignment)**:
  - ยกเลิกการวางแปรงแนวตั้ง 100%
  - ด้ามแปรงวาง **"แนวนอนขนานไปตามแนวโค้งของขากรรไกร (Tangent to Dental Arch)"** ครอบคลุมฟันครั้งละประมาณ 2-3 ซี่
- **มุมขนแปรง 45 องศา (45° Sulcular Angle)**:
  - ขนแปรงเอียงทำมุม 45° ชี้ลงเข้าหาร่องเหงือก (Gingival Sulcus) อย่างนุ่มนวล
- **วงจรอนิเมชัน 2 จังหวะ (Jiggle & Sweep)**:
  - **จังหวะที่ 1 (Vibrate/Jiggle, 0-2.2s)**: ขนแปรงสั่นไป-มาสั้นๆ ในร่องเหงือก (1-2 มม. ด้วยความถี่ ~19 Hz) 10 ครั้ง เพื่อรบกวนแผ่นคราบชีวภาพ (Microbial Biofilm)
  - **จังหวะที่ 2 (Sweep/Roll, 2.2-3.0s)**: บิดข้อมือสะบัดขนแปรงปัดขึ้นทางด้านบดเคี้ยว (Coronal Roll) เพื่อกวาดคราบทิ้ง
  - **การขยับย้ายจุด (Glide, 3.0-3.2s)**: ค่อยๆ ขยับย้ายไปแปรงฟันส่วนถัดไปรอบแผงฟัน
- **Anti-Collision Guard**: มีระยะ Offset คำนวณตามเวกเตอร์แนวตั้งฉาก ป้องกันหัวแปรงไม่ให้จมทะลุเข้าไปในเนื้อฟัน
- **Visual & Audio FX**: เกิดฟองโฟมสีขาวนุ่มแตกตัวรอบขนแปรง และคราบพลัคจะค่อยๆ สลายหายไปพร้อมเสียง Pop น่ารัก

---

## 🛠️ โครงสร้างไฟล์ (File Structure)

```
Tooth/
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   └── DentalScene.tsx       # Soft Studio Lighting, Canvas & Orbit Controls
│   │   ├── models/
│   │   │   ├── TeethModel.tsx        # 16 Smooth Rounded Teeth (RoundedBox Clay Aesthetic)
│   │   │   ├── GumsModel.tsx         # Anatomical U-Arch Tube Gingiva (No Flat Disc)
│   │   │   ├── PlaqueModel.tsx       # Biofilm Clusters with Disclosing Dye Support
│   │   │   ├── DebrisModel.tsx       # Interdental Food Particles
│   │   │   ├── ToolsModel.tsx        # Horizontal Tangent Alignment & 2-Phase Modified Bass
│   │   │   └── ParticlesModel.tsx    # Sparkle & Foam Bubble Burst System
│   │   └── ui/
│   │       ├── TopBar.tsx            # Camera Presets & Cleanliness Meter
│   │       ├── BottomDock.tsx        # Modern Floating Island Dock (Dividers, Earth-tone Capsule)
│   │       └── GuidePopover.tsx      # Large Typography Step-by-Step Popover Card
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
