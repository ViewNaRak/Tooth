# 🦷 Tooth — 3D Interactive Full Dental Arch Simulator

> An Awwwards-inspired, fullscreen interactive 3D dental simulator for learning proper brushing (Modified Bass 45°), flossing (C-Shape), and oral hygiene on a **Full Mandibular Dental Arch (16 teeth)**. Built with React 19, Three.js, React Three Fiber, and Tailwind CSS.

---

## 🌟 Architecture & Features (สถาปัตยกรรมและฟีเจอร์)

### 1. Minimalist UI & Fullscreen 3D (Awwwards Style)
- **100vw / 100vh Fullscreen Canvas**: พื้นที่แสดงผล 3D เต็มจอแบบไร้ขอบ ให้ความรู้สึกกว้าง โล่ง และทันสมัย
- **Floating Top Bar**: โลโก้ "Tooth", ปุ่มสลับมุมกล้องด่วน (ภาพรวม, ฟันหน้า, มุมบน, กรามซ้าย/ขวา), ปุ่มย้อมสีคราบพลัค (Plaque Disclosing Dye), และแถบ Cleanliness Index ขนาดกะทัดรัด
- **Floating Bottom Dock**: ด็อกควบคุมลอยตัวตรงกลางล่าง สำหรับเลือกเครื่องมือ (แปรงสีฟัน, ไหมขัดฟัน, น้ำยาบ้วนปาก), สลับมุม 45° (Modified Bass), ปุ่มจำลองการขจัดคราบ และปุ่มรีเซ็ตคราบ
- **Floating Guide Popover**: ปุ่มป๊อปโอเวอร์สรุปขั้นตอนสั้นๆ ทางการแพทย์ที่มุมขวาล่าง ซ่อนตัวหนังสือยาวๆ ไม่ให้บดบังทัศนียภาพ

### 2. Full Mandibular Dental Arch Model (แผงฟันล่างรูปตัว U 16 ซี่)
- **16 Anatomical Teeth**: เรียงตามแนวโค้งพาราโบลาธรรมชาติของขากรรไกรล่าง (FDI #48 ถึง #38)
  - **Incisors (#41, #42, #31, #32)**: ทรงใบมีด ปลายบาง แบนกว้าง
  - **Canines (#43, #33)**: ฟันเขี้ยว ยอดแหลมเด่นชัด รับแนวโค้งมุมปาก
  - **Premolars (#44, #45, #34, #35)**: ฟันกรามน้อย 2 ยอด (Bicuspid)
  - **Molars (#46, #47, #48, #36, #37, #38)**: ฟันกรามใหญ่ หน้าบดเคี้ยวกว้าง ร่องฟันหลายยอด (Multi-cusps)
- **Enamel Physical Material**: ผิวเคลือบฟันสีขาวนวลสะท้อนแสงเงา (`roughness: 0.14`, `clearcoat: 0.75`, `ior: 1.62` ดัชนี Hydroxyapatite)
- **Parabolic Gingival Base**: ฐานเหงือกสีชมพูขึ้นรูปโค้งรับแนวฟันทั้งแผง พร้อมรอยต่อขอบเหงือกและร่องเงาใต้คอฟัน
- **Biofilm & Food Debris Distribution**: กระจายคราบพลัคตามคอฟัน ซอกฟัน และร่องบดเคี้ยวตลอดทั้งแผง รองรับการย้อมสีคราบพลัค (Disclosing Agent)
- **360° Free Orbit Controls**: หมุนสำรวจแผงฟันได้อย่างอิสระทุกมุมมอง

---

## 🛠️ โครงสร้างโฟลเดอร์ (Folder Structure)

```
Tooth/
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   └── DentalScene.tsx       # Fullscreen 3D Canvas, Studio Lighting & Orbit Controls
│   │   ├── models/
│   │   │   ├── TeethModel.tsx        # Procedural 16-Tooth Full Dental Arch (Incisor, Canine, Premolar, Molar)
│   │   │   ├── GumsModel.tsx         # Parabolic U-Shaped Mandibular Gingiva
│   │   │   ├── PlaqueModel.tsx       # Biofilm Clusters with Disclosing Dye Support
│   │   │   ├── DebrisModel.tsx       # Interdental Food Particles
│   │   │   └── ToolsModel.tsx        # Toothbrush (45°), C-Shape Floss, Rinse Swirl
│   │   └── ui/
│   │       ├── TopBar.tsx            # Floating Top Bar (Brand, Camera Presets, Cleanliness Meter)
│   │       ├── BottomDock.tsx        # Floating Center Dock (Tool Selector, 45° Toggle, Simulate & Reset)
│   │       └── GuidePopover.tsx      # Floating Bottom-Right Medical Summary Drawer
│   ├── data/
│   │   └── dentalLessons.ts          # 16-Tooth Arch Metadata, Initial Biofilm Spots & Dental Lessons
│   ├── types/
│   │   └── dental.ts                 # Strict TypeScript Type Definitions
│   ├── App.tsx                       # Fullscreen Coordinator
│   ├── main.tsx                      # Mount entrypoint
│   └── index.css                     # Tailwind & Glassmorphism styles
├── index.html
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 คำสั่งรันโปรเจกต์ (Run Project)

```bash
# รัน Development Server
npm run dev

# ทดสอบ Production Build
npm run build
```
