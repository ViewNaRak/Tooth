# 🦷 Tooth — 3D Interactive Full Dental Arch Simulator

> An accessible, friendly, and non-intimidating 3D dental simulator designed to teach proper brushing (Modified Bass 45°), flossing (C-Shape), and oral hygiene on an **Anatomical U-Arch Dental Model (16 smooth stylized teeth & tube-lofted gums)**.

---

## 🌟 Key Features & Improvements (ฟีเจอร์และการปรับปรุงล่าสุด)

### 1. โมเดล 3D แผงฟันและเหงือกใหม่ทั้งหมด (Anatomical U-Arch)
- **ฐานเหงือกรูปตัว U (Anatomical U-Arch Gum)**:
  - ใช้ `CatmullRomCurve3` ดัดโค้งเป็นรูปเกือกม้าตัว U ตามแนวขากรรไกรล่างธรรมชาติ ร่วมกับ `TubeGeometry`
  - ปราศจากฐานทรงกระบอกกลมแบนเดิม 100% เหงือกโอบรับโคนฟันทุกซี่อย่างแนบสนิท
  - สีชมพูพีชพาสเทลละมุน (`#F4978E` / `#EE887F`) สัมผัสดินปั้นกึ่งเงา (`Roughness 0.4`)
- **ฟันขอบมนสไตล์ Smooth Clay Art ([TeethModel.tsx](file:///d:/Github/Tooth/src/components/models/TeethModel.tsx))**:
  - สร้างด้วย `@react-three/drei` `RoundedBox` ไร้เหลี่ยมคม ปราศจากรอยต่อหรือแผ่นหยักซ้อนกัน
  - **ฟันหน้า (Incisors)**: ทรงแบนมน ปลายโค้งมน ขนาดพอดี
  - **ฟันเขี้ยว (Canines)**: ทรงกรวยมน ปลายไม่แหลมจนน่ากลัว
  - **ฟันกรามน้อยและกรามใหญ่ (Premolars & Molars)**: ด้านบดเคี้ยวโค้งมน มีร่องฟันนุ่มๆ 4 ปุ่ม (Pillowy Cusps)
  - **สีฟัน**: ขาวนวลไข่มุกธรรมชาติ (`#FFFDF9`) เคลือบเงาสะอาดตา (`MeshPhysicalMaterial`, `Roughness 0.22`, `Clearcoat 0.35`)

### 2. ปรับปรุงฟิสิกส์การแปรงฟัน (Smooth Anti-Collision & Modified Bass)
- **Automatic 45° Alignment**: ขนแปรงหันเข้าหาแนวร่องเหงือก (Sulcus) ทำมุม 45 องศาโดยอัตโนมัติเมื่อเลื่อนเข้าไปใกล้
- **Anti-Collision Guard**: มีระยะ Offset คำนวณตามเวกเตอร์แนวตั้งฉาก (Normal Vector) ป้องกันไม่ให้หัวแปรงจมทะลุเข้าไปในเนื้อฟัน
- **แอนิเมชัน Modified Bass**: สั่นวนเป็นวงสั้นๆ (Micro-vibration) ในร่องเหงือก 2-3 วินาที แล้วปัดขึ้นไปทางปลายฟัน (Coronal Sweep)
- **ฟองโฟมและประกายละออง**: คราบพลัคจะค่อยๆ ละลายกลายเป็นฟองโฟมสีขาวนุ่มพวยพุ่งแตกตัวออก พร้อมเสียง Pop น่ารัก

### 3. ปุ่มเปิด/ปิดเสียง (Sound Toggle) ใน Bottom Dock
- เพิ่มปุ่มเปิด/ปิดเสียง (`Volume2` / `VolumeX`) ไว้ข้างๆ แถบสลับเครื่องมือในแถวเดียวกันอย่างกลมกลืน
- ควบคุมเสียงสังเคราะห์ทั้งหมดจาก Web Audio API (เสียงขัดฟัน, เสียงคราบหลุด, เสียงกระดิ่งฉลอง)

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
│   │   │   ├── ToolsModel.tsx        # Anti-Collision Physics & 45° Sulcular Alignment
│   │   │   └── ParticlesModel.tsx    # Sparkle & Foam Bubble Burst System
│   │   └── ui/
│   │       ├── TopBar.tsx            # Camera Presets & Cleanliness Meter
│   │       ├── BottomDock.tsx        # Tool Selector + Sound Toggle in Same Row
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
