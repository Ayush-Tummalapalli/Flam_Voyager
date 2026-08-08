# 🚀 Itinera AI — Smart AI Travel Planner

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwind-css)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq_AI-Llama_3.3_70B-f35815)](https://groq.com/)
[![Deployment](https://img.shields.io/badge/Vercel-Production-000000?logo=vercel)](https://itinera-ai-planner.vercel.app/)

> **Itinera AI** is an interactive, intelligent travel itinerary generator. It crafts custom day-by-day travel schedules tailored to your destination, travel companions, and budget preferences in seconds.

---

## 🌐 Live Demo & Repository

- **Live Application**: [https://itinera-ai-planner.vercel.app/](https://itinera-ai-planner.vercel.app/)
- **GitHub Repository**: [https://github.com/Ayush-Tummalapalli/itenera_ai.git](https://github.com/Ayush-Tummalapalli/itenera_ai.git)

---

## ✨ Key Features

1. **🤖 Structured AI Itinerary Engine**:
   - Generates realistic day-by-day travel schedules based on free-form prompts.
   - Renders interactive React components: expand/collapse activity details, reorder stops (`↑/↓`), delete stops, or add custom activities.
2. **🛡️ Resilient Zero-Crash Architecture**:
   - `schemaValidator.js` sanitizes and repairs malformed AI outputs before state updates.
   - Built-in fallback engine guarantees zero downtime during network drops or API rate limits.
3. **👥 Travel Companion Personalization**:
   - Tailors activities and pace based on companion filters: `Solo Traveler`, `Couple / Romantic`, `Family with Kids`, and `Group of Friends`.
4. **💰 Per-Pax Budget Breakdown & Smart Alerts**:
   - Calculates estimated cost per person and breaks down expenses into Stay, Food, and Activities.
   - Automatically flags unrealistically low budgets with a helpful minimum recommended threshold notice.
5. **💱 Real-Time Multi-Currency Converter**:
   - Instant real-time toggle between **USD ($)**, **INR (₹)**, and **EUR (€)** across total budgets, breakdown charts, and individual activity cost tags.
6. **📊 Interactive SVG Donut Budget Chart**:
   - Responsive SVG Donut chart displaying cost proportions with interactive segment hover states.
7. **🎒 Interactive AI Packing Checklist**:
   - Destination-tailored packing lists (Documents, Clothing, Electronics, Essentials) with check-off progress tracking and custom item management.
8. **🗺️ Clickable Google Maps & Weather Advisor**:
   - Activity locations link directly to Google Maps search. Includes Best Season, Average Temp, and Packing advice cards.
9. **📄 Export PDF & WhatsApp Sharing**:
   - `@media print` optimized PDF exporter and 1-click Markdown summary copier for WhatsApp and text messaging.
10. **💾 Session Saving & Persistence (`localStorage`)**:
    - Save trips locally and manage past sessions via the "My Saved Trips" slide-out drawer.
11. **🌙 Dark / Light Mode**:
    - Smooth obsidian dark mode toggle with persistent theme selection.
12. **⚡ Preset Quick Demos**:
    - Instant demo loader for instant 0ms exploration (Tokyo, Paris, Goa, Rome).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router, JavaScript), React 18, Tailwind CSS, Lucide Icons.
- **Backend / API**: Next.js Serverless API Routes (`/api/generate` & `/api/refine`).
- **AI Engine**: Groq API (`llama-3.3-70b-versatile`) with fallback support for Google Gemini API (`gemini-1.5-flash`).
- **State & Persistence**: React Hooks + Browser `localStorage`.

---

## 🔒 Security

All LLM API calls are routed through server-side proxy routes (`/api/generate` and `/api/refine`).  
**API keys are kept strictly on the server environment and are never exposed to client browser bundles.**

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/Ayush-Tummalapalli/itenera_ai.git
cd itenera_ai

# 2. Install dependencies
npm install

# 3. Create .env.local with your API Key
echo "GROQ_API_KEY=your_groq_api_key_here" > .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build:
```bash
npm run build
npm start
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
