'use client';

import { useState } from 'react';
import { Sparkles, Send, RefreshCw, Wand2 } from 'lucide-react';

const REFINEMENT_PRESETS = [
  "✨ Make it budget friendly",
  "🍜 Add vegetarian food spots",
  "🌅 Add sunset viewing spots",
  "⚡ Relax the schedule pace",
  "📸 Add top photography spots"
];

export default function RefinementBar({ onRefine, isRefining }) {
  const [instruction, setInstruction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!instruction.trim() || isRefining) return;
    onRefine(instruction);
    setInstruction('');
  };

  const handleSelectPreset = (presetText) => {
    if (isRefining) return;
    onRefine(presetText);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/80 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
        <Wand2 className="w-4 h-4 text-indigo-600 animate-pulse" />
        <span>Refine & Edit this Itinerary with AI</span>
      </div>

      <p className="text-xs text-slate-500">
        Tweak specific days, swap activities, or adjust the pace without re-generating from scratch.
      </p>

      {/* Preset Suggestion Chips */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {REFINEMENT_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            disabled={isRefining}
            className="px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white text-slate-700 border border-indigo-100 rounded-full text-xs font-medium transition-all shadow-xs disabled:opacity-50"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Custom Refinement Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="E.g., 'Replace day 2 afternoon activity with a local seafood lunch' or 'Make day 1 more relaxed'"
          disabled={isRefining}
          className="flex-1 px-4 py-2.5 text-sm bg-white border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!instruction.trim() || isRefining}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
        >
          {isRefining ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Refining...</span>
            </>
          ) : (
            <>
              <span>Apply Tweak</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
