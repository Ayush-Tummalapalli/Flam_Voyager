# 🚀 FlamVoyager — AI Travel Planner

> **Frontend Internship Assignment Submission for Flam**  
> *Built with Next.js 14 (App Router, JavaScript), Tailwind CSS, Lucide Icons, and LLM Engine (Active Provider: Groq Llama 3.3 70B with Gemini 1.5 Flash fallback support).*

---

## 🌐 Live Demo & GitHub Repository

- **Live Production App**: [https://flam-voyager.vercel.app/](https://flam-voyager.vercel.app/)
- **GitHub Repository**: [https://github.com/Ayush-Tummalapalli/Flam_Voyager.git](https://github.com/Ayush-Tummalapalli/Flam_Voyager.git)
- **Demo Video**: [[https://flam-voyager.vercel.app/](https://drive.google.com/file/d/1vjK1FAxAaLrN-zuXT8rucJpos458oZbx/view?usp=sharing)](https://drive.google.com/file/d/1vjK1FAxAaLrN-zuXT8rucJpos458oZbx/view?usp=sharing)

---

## 🎯 Key Features & Highlights

1. **Structured AI Travel Engine**:
   - Accepts free-form text input describing any trip prompt (destination, days, companion, vibe).
   - Generates strict JSON schema rendered into interactive React components (expand/collapse stops, reorder stops `↑/↓`, delete stop, add custom activity).
2. **Robust Failure Handling & Zero-Crash Architecture**:
   - `schemaValidator.js` validates, cleans, and repairs incomplete/malformed AI outputs.
   - Dynamic `mockItinerary.js` Fallback Engine takes over during offline states, rate limits, or API key errors without crashing the UI.
3. **👥 Travel Companion Personalization**:
   - Filter chips: `🧳 Solo Traveler`, `👩‍❤️‍👨 Couple / Romantic`, `👨‍👩‍👧‍👦 Family with Kids`, `🥳 Group of Friends`.
4. **💰 Per-Pax Budget Breakdown & Low-Budget Alert**:
   - Estimates total cost per person and breaks down into Stay, Food, and Activities.
   - Automatically detects unrealistically low budgets (under $50/day) and displays an alert warning banner.
5. **💱 Real-Time Multi-Currency Converter**:
   - Real-time instant conversion between **USD ($)**, **INR (₹)**, and **EUR (€)** across all total budgets, breakdown boxes, and individual activity stop badges.
6. **📊 Interactive SVG Donut Budget Chart**:
   - Interactive SVG Donut chart displaying segment proportions (Stay, Food, Activities) with segment hover states.
7. **🎒 Interactive AI Packing Checklist**:
   - Destination & weather tailored packing items (Documents, Clothing, Electronics, Essentials) with interactive check-off progress bar and custom item adder.
8. **🗺️ Clickable Google Maps & Weather Advisor**:
   - Activity location tags open directly in Google Maps. Includes Best Season, Average Temp, and Packing advice card.
9. **📄 Export PDF & WhatsApp / Text Share**:
   - Clean `@media print` PDF export and 1-click formatted Markdown summary copy for WhatsApp/SMS.
10. **💾 Session Saving & Reloading (`localStorage`)**:
    - Fulfills session saving: save itineraries to browser `localStorage` and reload/delete past sessions via the "My Saved Trips" drawer.
11. **🌙 Dark / Light Theme Persistence**:
    - Obsidian dark mode toggle with persistent theme selection.
12. **⚡ Quick Demo Trips**:
    - 1-click instant demo loader for interview evaluators (Tokyo, Paris, Goa, Rome) in <50ms.

---

## 🛠️ Local Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/Ayush-Tummalapalli/Flam_Voyager.git
cd Flam_Voyager

# 2. Install dependencies
npm install

# 3. Create .env.local with your Groq or Gemini API Key
echo "GROQ_API_KEY=gsk_your_groq_api_key_here" > .env.local

# 4. Run Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Production Build Locally:
```bash
npm run build
npm start
```

---

## 🔒 Security & Architecture: Server-side API Proxy

All LLM calls are routed through serverless API proxy routes (`/api/generate` & `/api/refine`).  
**API keys are strictly stored on the server environment and never shipped or exposed to client browsers.**

- **Active Model Provider**: **Groq (Llama 3.3 70B Versatile)** — chosen for ultra-fast response times (~1.5s) and strict JSON mode compliance.
- **Provider Fallback**: Google Gemini 1.5 Flash support is built into the backend if a Gemini key is provided.

---

## 🛡️ Failure Handling Strategy

1. **Schema Validation & Sanitization**: AI responses pass through `schemaValidator.js`, which verifies object shapes, array types, and default fallbacks for missing fields before state updates.
2. **Resilient Fallback Engine**: If the LLM service returns bad output, rate limits out, or network drops, the application catches the error gracefully, displays an informative notice banner, and falls back to structured local mock data—preventing white screen crashes.

---

## ⚠️ Known Limitations

- **LLM Rate Limits**: Free-tier API keys may hit rate limits under heavy concurrent requests (handled gracefully by fallback mock data).
- **LocalStorage Storage Limit**: Saved trips use browser `localStorage` (capped at ~5MB, which stores up to ~200 itinerary sessions per device).

---

## 📝 Note on AI Usage & Time Spent

- **AI Tools Used**: Used Antigravity AI assistant for rapid pair programming, component structure iteration, CSS Tailwind styling, and schema validator edge-case testing.
- **Human Oversight**: Architectural design, serverless API proxy security, failure handling strategy, currency converter logic, and state management flow were engineered and verified line-by-line.
- **Estimated Time Spent**: ~5.5 hours total.

---

## 📌 Evaluation Rubric Q&A (For Interviewers)

### Q1: How does the application secure LLM API keys? 
> **Answer**: All LLM requests pass through Next.js serverless proxy routes (`/api/generate` and `/api/refine`). The `GROQ_API_KEY` is loaded from server environment variables (`.env.local` / Vercel secrets) and is **never bundled or exposed to the client browser**.

### Q2: How do you handle malformed or unexpected AI output? 
> **Answer**: AI outputs are validated through `schemaValidator.js`. If an LLM returns unexpected keys, missing array stops, or malformed JSON, `schemaValidator.js` repairs the shape before React state updates. If the API fails or drops offline, `mockItinerary.js` provides dynamic fallback data to prevent white screen crashes.

### Q3: How do you handle low-budget inputs or unrealistic prompts?
> **Answer**: The backend parses requested budgets against a minimum cost-per-day threshold ($50/day). If an input is unrealistically low (e.g. *"5 days in Paris for $20"*), `isBudgetTooLow` is set to `true` and the UI renders a **`⚠️ Given Budget is Too Low`** notice explaining realistic minimums.

### Q4: How is session persistence implemented without a database or authentication? 
> **Answer**: In compliance with the prompt (*"Authentication: Not needed"*), saved sessions use browser `localStorage` (`flam_saved_trips`). Users can save itineraries, view saved trips in a slide-out drawer, reload past sessions, or delete them without requiring backend database overhead.

### Q5: How does the AI Refinement Loop work? 
> **Answer**: Instead of regenerating trips from scratch, follow-up refinement prompts pass the current itinerary JSON back to `/api/refine`. The LLM tweaks the existing schedule in-place (adjusting budget, food themes, or daily pace) and updates state.
