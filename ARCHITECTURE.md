# Manga Drama World - Project Architecture

## 🌟 Introduction (ภาพรวมโปรเจค)
**Manga Drama World** คือ Mobile-first Web Application (Mini App) ที่ออกแบบมาเพื่อมอบประสบการณ์โลกของมังงะแบบ Interactive ผ่านฟีเจอร์ต่างๆ เช่น โหมดเนื้อเรื่อง (Story Mode), การสำรวจพื้นที่ (Exploration), การสะสมตัวละคร (Character Collection), มินิเกม (Mini Games) และระบบอีเวนต์ (Dynamic Events)

ตัวแอปถูกพัฒนาขึ้นด้วยคอนเซ็ปต์ **"Smooth & Interactive UX"** โดยมีการนำ Animation และ Page Transitions มาใช้ในทุกการเปลี่ยนหน้าจอ เพื่อให้ผู้ใช้รู้สึกเหมือนกำลังเล่นเกมหรืออ่านมังงะแบบ Interactive มากกว่าการเปิดเว็บไซต์ธรรมดา

---

## 🏗️ Tech Stack (เทคโนโลยีที่ใช้)
โปรเจคนี้พัฒนาบนสถาปัตยกรรม **Modern Frontend SPA (Single Page Application)**
- **Core Framework:** React 18
- **Language:** TypeScript (Strict Mode)
- **Build Tool:** Vite (พร้อม SWC เพื่อความรวดเร็วในการคอมไพล์)
- **Styling:** Tailwind CSS v3.4 + `shadcn/ui` (สำหรับ UI Components)
- **Animation:** Framer Motion (จัดการ Page Transition และ Micro-interactions)
- **Routing:** React Router v6 (จัดการ Client-side routing)
- **State Management:** Zustand (อ้างอิงจากการออกแบบ Store แบบ custom hook)
- **Icons:** Lucide React

---

## 🏛️ System Architecture (สถาปัตยกรรมระบบ)

### 1. Project Structure (โครงสร้างโฟลเดอร์)
แอปมีการแบ่ง `Separation of Concerns` อย่างชัดเจน เพื่อให้ง่ายต่อการดูแลรักษา (Maintainability)

```text
src/
├── components/       # Reusable UI Components (ส่วนใหญ่มาจาก shadcn/ui)
│   ├── ui/           # Base components (Button, Card, Dialog ฯลฯ)
│   └── BottomNav.tsx # Global Navigation Bar (Mobile Tab Bar)
├── hooks/            # Custom React Hooks สำหรับจัดการ Logic เฉพาะส่วน
├── sections/         # Page Views / Feature Modules (แบ่งตามฟีเจอร์)
│   ├── story/        # ฟีเจอร์ที่เกี่ยวกับเนื้อเรื่อง (StoryMode, Exploration, Collection)
│   ├── HeroSection.tsx
│   ├── MiniGames.tsx
│   ├── EventsPage.tsx
│   └── ...
├── store/            # Global State Management
│   └── events/       # (e.g., dynamicEventStore จัดการข้อมูลกิจกรรม)
├── types/            # TypeScript Definitions & Interfaces
├── App.tsx           # Main Application Component (Router, Suspense, Layout)
└── main.tsx          # Application Entry Point
```

### 2. Application Flow & Routing
แอปพลิเคชันทำงานในรูปแบบ SPA (Single Page Application) โดยมีการใช้ `react-router-dom` ควบคุมการเปลี่ยนหน้า 

**Navigation Pattern:**
เราใช้ **Bottom Navigation** เป็นเครื่องมือหลักในการนำทาง (Navigation) บนอุปกรณ์มือถือ โดยแบ่งออกเป็น 4 แท็บหลักเพื่อหลีกเลี่ยงการทำ UI รก (Cluttered UI):
1. `/` (หน้าหลัก / Home) - รวม Dashboard, Hero Section และ Mini Games เบื้องต้น
2. `/story` (เนื้อเรื่อง / Story) - ฟีเจอร์หลักในการดำเนินเรื่องราว
3. `/explore` (สำรวจ / Explore) - ระบบออกสำรวจโลกมังงะ
4. `/collection` (คอลเลกชัน / Collection) - ระบบจัดการและอัปเกรดตัวละครที่สะสมไว้

*(หมายเหตุ: ฟีเจอร์อื่นๆ เช่น `/events`, `/rewards`, `/games` ยังคงมีอยู่และสามารถเข้าถึงได้ผ่าน URL หรือปุ่มเมนูย่อยในหน้า Home)*

### 3. Performance Optimization
เพื่อให้แอปโหลดได้รวดเร็วแม้จะมีภาพหรือ Animation เยอะ เราได้วางสถาปัตยกรรมด้าน Performance ไว้ดังนี้:
- **Code Splitting (Lazy Loading):** หน้า View ทุกหน้า (เช่น `HeroSection`, `StoryMode`) ถูกดึงมาใช้งานผ่าน `React.lazy()` ควบคู่กับ `<Suspense>` ใน `App.tsx` 
  - **ผลลัพธ์:** เมื่อผู้ใช้เปิดแอปครั้งแรก (Initial Load) เบราว์เซอร์จะดาวน์โหลดเฉพาะโค้ดของหน้า Loading Screen และ Navbar เท่านั้น ส่วนโค้ดของหน้า Story หรือ Explore จะถูกดาวน์โหลดเมื่อผู้ใช้กดเข้าไปดูจริงๆ (Chunking) ช่วยลด Bundle Size ลงอย่างมหาศาล
- **Fallback UI:** ระหว่างที่รอไฟล์โค้ดหน้าต่างดาวน์โหลดเสร็จ จะมีคอมโพเนนต์ `<FallbackLoader />` หรือ `<LoadingScreen />` ขึ้นมาคั่นเพื่อไม่ให้เกิดจอกระพริบขาว (White Flash)

### 4. Animation & State
- ใช้ `Framer Motion` จัดการ Page Transition โดยครอบ `<Routes>` ด้วย `<AnimatePresence mode="wait">` ทำให้เมื่อเปลี่ยน URL หน้าเก่าจะค่อยๆ Fade ออก (Exit) ก่อนที่หน้าใหม่จะสไลด์เข้ามา (Enter)
- ใช้ Shared Layout Animation (`layoutId` ของ Framer Motion) ในการทำปุ่ม Indicator เลื่อนตามเมื่อผู้ใช้กดเปลี่ยนแท็บใน `BottomNav` อย่างสมูท
- มีระบบ **Global State** สำหรับ Events (`useDynamicEventStore`) ซึ่งจะถูกเช็คสถานะตั้งแต่ตอนแอปเริ่มทำงาน (ใน `useEffect` ของ App) และจะส่ง Props ไปโชว์เป็นแจ้งเตือน (Badge) บนปุ่ม "หน้าหลัก" อัตโนมัติ

---

## 🔮 Future Development (แนวทางการพัฒนาต่อยอด)
- **Data Fetching:** หากมีการเชื่อมต่อ Backend ควรนำ **React Query (TanStack Query)** เข้ามาช่วยจัดการ Caching และ API State
- **PWA (Progressive Web App):** สามารถตั้งค่า Vite PWA plugin เพื่อให้ผู้ใช้กด "Add to Home Screen" และใช้งานแอปแบบ Offline ได้
- **Assets Optimization:** สำหรับภาพตัวละครหรือ Assets ของเกม ควรใช้ฟอร์แมต `WebP` และพิจารณาระบบ Image Lazy Loading ภายใน Component `<CharacterGallery />`