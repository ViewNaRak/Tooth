# 🦷 Tooth — Friendly 3D Oral Care Simulator (Pastel & Clay Toy Edition)

> An accessible, friendly, and non-intimidating 3D dental simulator designed to reduce dental anxiety through warm pastel aesthetics, clay/vinyl toy stylization, procedural Web Audio sound effects, and interactive mouse-guided brushing physics.

---

## 🌟 Key Upgrades & Highlights (จุดเด่นและการปรับปรุงล่าสุด)

### 1. Mood & Tone: Friendly Pastel & Earth Tone (ลด Dental Anxiety)
- **Warm Cream Background (`#FDFBF7`)**: สบายตา อบอุ่น นุ่มนวล ไม่น่ากลัว
- **Frosted Glass Cards (`rounded-3xl`)**: แผงควบคุมสไตล์ Frosted Glass มนโค้งพิเศษ สีขาวนวลโปร่งแสง 90% พร้อมเงาฟุ้งละมุน
- **Earth Tone Deep Brown (`#2E2A27`)**: สีตัวอักษรเพื่อความคมชัดและสบายตาเป็นเลิศ

### 2. Large & Comfortable Typography (ตัวหนังสือขนาดใหญ่ อ่านสบายตา)
- **หัวข้อและขั้นตอนหลัก**: ขนาด `text-xl` ถึง `text-2xl` หนาพิเศษ ชัดเจน ไม่ต้องเพ่ง
- **เนื้อหาคำแนะนำ**: ขนาด `text-base` ถึง `text-lg` พร้อม `leading-relaxed` เว้นระยะบรรทัดโปร่งสบาย

### 3. Clay / Vinyl Toy 3D Aesthetic
- **Stylized Soft Teeth**: ฟัน 16 ซี่รูปทรงโค้งมนเป็นมิตร ผิวสัมผัสแบบ Clay/Vinyl toy กึ่งเงา (`Roughness 0.35`, `Metalness 0.05`) สีงาช้างอุ่นธรรมชาติ (`#FAF8F0`)
- **Pastel Peach Gums**: ฐานเหงือกสีชมพูพีชพาสเทลนุ่มนวล (`#F9ABA2`)
- **Warm Soft Studio Lighting**: แสงนวลไร้เงามืดจัด สว่าง อบอุ่น และเป็นมิตร

### 4. Smooth Brushing Physics & Sparkle Particles
- **Interactive Mouse Tracking**: หัวแปรงเคลื่อนที่ตามเคอร์เซอร์เมาส์ด้วยความนุ่มนวลสูง (Lerp Interpolation)
- **Micro-vibrations (Bass Sweep)**: สั่นวนอัตโนมัติเมื่อหัวแปรงอยู่ในแนวร่องเหงือกทำมุม 45°
- **Sparkle / Foam Burst Effect**: ละอองประกายและฟองโฟมสีขาวนุ่มพวยพุ่งเมื่อคราบพลัคหรือเศษอาหารแตกสลาย

### 5. Procedural Web Audio FX (ไม่ต้องพึ่งพาไฟล์เสียงภายนอก)
- สังเคราะห์เสียงแบบเรียลไทม์ 100% ผ่าน Web Audio API:
  * 🪥 **เสียงขัดฟัน (Soft Scrub/Brush Squeak)**: เสียงฟึดฟัดนุ่มนวลเป็นจังหวะขณะถูแปรง
  * 🫧 **เสียงคราบหลุด (Bubble Pop)**: เสียงฟองสบู่แตก "ป๊อป!" สดใสน่ารัก
  * ✨ **เสียงสำเร็จ (Sparkle Chime)**: เสียงกระดิ่งคอร์ดใสก้องกังวานเมื่อทำความสะอาดเสร็จสิ้น
- **ปุ่ม Mute / Unmute**: ควบคุมเสียงเปิด/ปิดได้สะดวกที่มุมขวาบนของหน้าจอ

---

## 🛠️ โครงสร้างไฟล์ (File Structure)

```
Tooth/
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   └── DentalScene.tsx       # Soft Studio Lighting, Canvas & Camera Controller
│   │   ├── models/
│   │   │   ├── TeethModel.tsx        # 16-Tooth Full Dental Arch (Clay/Vinyl Toy Soft Mesh)
│   │   │   ├── GumsModel.tsx         # Soft Peach Pastel Mandibular Gingiva
│   │   │   ├── PlaqueModel.tsx       # Biofilm Clusters with Disclosing Dye Support
│   │   │   ├── DebrisModel.tsx       # Interdental Food Particles
│   │   │   ├── ToolsModel.tsx        # Smooth Lerp Brushing Physics & Interactive Proximity
│   │   │   └── ParticlesModel.tsx    # Sparkle & Foam Bubble Burst System
│   │   └── ui/
│   │       ├── TopBar.tsx            # Frosted Glass rounded-3xl Top Bar + Mute Toggle
│   │       ├── BottomDock.tsx        # Frosted Glass rounded-3xl Tool Controller
│   │       └── GuidePopover.tsx      # Large Typography Step-by-Step Popover Card
│   ├── utils/
│   │   └── soundEffects.ts           # Procedural Web Audio API Sound Synthesizer
│   ├── data/
│   │   └── dentalLessons.ts          # Dental Arch Metadata & Standard Guidelines
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

## 🚀 วิธีการทดสอบและรัน (How to Run)

```powershell
# 1. รันโหมด Development
npm run dev

# 2. ตรวจสอบ Production Build
npm run build
```
