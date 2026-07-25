# ✈️ FlamVoyager - AI Travel Planner

An interactive, AI-powered travel itinerary planning application built with **React** and **JavaScript** (no TypeScript) for the **Flam Frontend Internship Assignment**. It converts free-form travel requests into clean, structured, and interactive day-by-day itineraries.

---

## 🌟 Key Features & Highlights

1. **Free-Form Text Input**: Users can enter any travel request (e.g., *"3 days in Tokyo on a budget focusing on food & tech"*).
2. **Server-Side API Security**: Uses a Next.js API route proxy (`/api/generate`) so the LLM API key is **never exposed in the browser code**.
3. **Strict Structured JSON Schema**: Enforces JSON response mode and validates all generated fields using `schemaValidator.js`.
4. **Resilient Failure Handling**:
   - Handles malformed JSON, schema mismatches, and API errors gracefully without UI crashes.
   - Provides a **Smart Fallback Engine** (`mockItinerary.js`) when offline or when API limits are hit, ensuring the app remains 100% testable.
5. **Interactive Itinerary Controls**:
   - **Expand/Collapse**: Inspect full activity descriptions, location tags, and categories.
   - **Reorder Stops**: Move activities up/down within any day.
   - **Delete Stops**: Remove unwanted stops dynamically.
   - **Add Custom Stop**: Manually append custom activities to any day.

---

## 🛠️ Project Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps to Run Locally

1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/Ayush-Tummalapalli/Flam_Voyager.git
   cd Flam_Voyager
   npm install
   ```

2. **Configure Environment Variable**:
   Create a `.env.local` file in the root directory:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   # OR
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: If no API key is set, the app seamlessly uses the built-in Smart Fallback engine).*

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build & Start**:
   ```bash
   npm run build
   npm start
   ```

---

## 📁 Architecture Overview

```
Flam_Voyager/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.js        # Server-side API proxy (keeps API key secure)
│   │   ├── layout.js               # Root app layout & metadata
│   │   ├── page.js                 # Main stateful home page
│   │   └── globals.css             # Tailwind CSS & animations
│   ├── lib/
│   │   ├── schemaValidator.js      # Validates & repairs AI output structure
│   │   └── mockItinerary.js        # Fallback offline generator
│   └── components/
│       ├── TripInputForm.jsx       # Free-form prompt text area & presets
│       ├── ItineraryView.jsx       # Full itinerary renderer
│       ├── DayCard.jsx             # Day container with stop management
│       ├── StopItem.jsx            # Interactive stop item (reorder, expand, delete)
│       ├── ErrorAlert.jsx          # Error handling & retry UI
│       └── LoadingSkeleton.jsx     # Loading visual feedback
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🤖 AI Usage Note (Transparency)
- **AI Tools Used**: Google Antigravity for pair programming, structural design, and component scaffolding.
- **Custom Logic & Oversight**: All state management, schema validation, fallback mechanisms, drag-free reordering logic, and responsive UI layouts were manually curated and verified to ensure full understanding for interview walkthroughs.

---

## ⏱️ Time Spent & Limitations
- **Total Time Spent**: ~2.5 hours.
- **Known Limitations**:
  - Drag-and-drop reordering uses explicit up/down buttons for maximum mobile compatibility and zero third-party library overhead.
  - Multi-city complex routing could be enhanced further in future iterations.
