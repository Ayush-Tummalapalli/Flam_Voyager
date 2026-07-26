# 🚀 FlamVoyager — AI Travel Planner

> **Frontend Internship Assignment Submission for Flam**  
> *Built with Next.js (App Router, JavaScript), Tailwind CSS, Lucide Icons, and Dual AI Engine (Groq Llama 3.3 70B & Google Gemini 1.5 Flash).*

---

## 🌟 Live Demo & Architecture

- **Live Local App**: `http://localhost:3000`
- **GitHub Repository**: [https://github.com/Ayush-Tummalapalli/Flam_Voyager.git](https://github.com/Ayush-Tummalapalli/Flam_Voyager.git)

---

## 🎯 Key Features Built

1. **Structured AI Travel Engine**:
   - Accepts free-form trip prompts (destination, days, budget, vibe).
   - Returns strict JSON schema rendered into interactive, drag/reorder/delete/add React components.
2. **Robust Failure Handling & Zero-Crash Architecture**:
   - `schemaValidator.js` validates, sanitizes, and repairs malformed AI outputs.
   - Dynamic `mockItinerary.js` Fallback Engine seamlessly takes over during offline states, rate limits, or API key errors.
3. **👥 Travel Companion Personalization**:
   - Filter options: `🧳 Solo Traveler`, `👩‍❤️‍👨 Couple / Romantic`, `👨‍👩‍👧‍👦 Family with Kids`, `🥳 Group of Friends`.
4. **💰 Per-Pax Budget Breakdown & Low-Budget Detection**:
   - Estimates total cost per person and breaks down into Stay, Food, and Activities.
   - Triggers warning banner if requested budget is unrealistically low.
5. **💱 Multi-Currency Converter**:
   - Real-time instant toggle between **USD ($)**, **INR (₹)**, **EUR (€)**, **GBP (£)**, and **AED**.
6. **🎒 Interactive AI Packing Checklist**:
   - Destination & weather tailored checklist with interactive check-off and custom item adder.
7. **🗺️ Interactive Google Maps & Weather Advisor**:
   - Location tags link directly to Google Maps search tabs.
8. **📄 Export PDF & WhatsApp/SMS Share**:
   - One-click clean PDF export (`@media print`) and copy-formatted text summary for messaging.
9. **💾 Save and Reload Sessions (My Saved Trips Drawer)**:
   - Save itineraries to browser `localStorage` and reload past sessions with 1 click.
10. **🌙 Dark Mode / Light Mode**:
    - Obsidian dark theme toggle with persistent `localStorage` theme preference.

---

## 🛠️ Local Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/Ayush-Tummalapalli/Flam_Voyager.git
cd Flam_Voyager

# 2. Install dependencies
npm install

# 3. Create .env.local with your Groq or Gemini API Key
echo "GROQ_API_KEY=your_groq_api_key_here" > .env.local

# 4. Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🔒 Security Note: Server-side API Proxy

All LLM calls are routed through serverless API proxy routes (`/api/generate` & `/api/refine`).  
**API keys are strictly stored on the server environment and never exposed to client browsers.**

---

## 📝 Note on AI Usage & Time Spent

- **AI Tools Used**: Antigravity AI pair programming assistant for rapid UI iteration, schema validation design, and component modularity.
- **Estimated Time Spent**: ~5.5 hours total (Core architecture: ~2.5h, Refinement & Budget engine: ~1.5h, Personalization & Features: ~1.5h).
