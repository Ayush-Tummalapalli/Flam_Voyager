'use client';

import { useState } from 'react';
import { Send, Wand2, DollarSign } from 'lucide-react';

const REFINEMENT_PRESETS = [
  "💚 Low Budget",
  "💙 Moderate Budget",
  "💎 High Budget / Luxury",
  "🍜 Food Feast",
  "🧗 Adventurous & Thrill",
  "🏖️ Beach & Relaxation",
  "📸 Photography Spots"
];

export default function RefinementBar({ onRefine, isRefining }) {
  const [instruction, setInstruction] = useState('');
  const [targetBudget, setTargetBudget] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRefining) return;
    
    let fullInstruction = instruction.trim();
    if (targetBudget.trim()) {
      fullInstruction = fullInstruction 
        ? `${fullInstruction} (Target budget: $${targetBudget.trim()} per pax)`
        : `Adjust itinerary to target budget of $${targetBudget.trim()} per person`;
    }

    if (!fullInstruction) return;

    onRefine(fullInstruction);
    setInstruction('');
    setTargetBudget('');
  };

  const handleSelectPreset = (presetText) => {
    if (isRefining) return;
    onRefine(`Refine itinerary to: ${presetText}`);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
          <Wand2 className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>Refine Itinerary & Adjust Budget</span>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-indigo-100/80 text-indigo-700 rounded-full">
          Per-Pax Budget Engine
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Click a quick preset or enter custom instructions to tweak budget tier, food options, or daily pace.
      </p>

      {/* Preset Suggestion Chips */}
      <div className="flex flex-wrap gap-2">
        {REFINEMENT_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            disabled={isRefining}
            className="px-3 py-1.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-700 border border-indigo-200/80 rounded-full text-xs font-semibold transition-all shadow-xs disabled:opacity-50 hover:shadow-sm hover:border-indigo-600"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Custom Refinement Form with Budget Box */}
      <form onSubmit={handleSubmit} className="space-y-2 pt-1">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Target Budget per Pax Input */}
          <div className="relative sm:w-44">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <input
              type="number"
              value={targetBudget}
              onChange={(e) => setTargetBudget(e.target.value)}
              placeholder="Budget/pax"
              disabled={isRefining}
              className="w-full pl-8 pr-3 py-2.5 text-sm bg-white border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 text-slate-800 disabled:opacity-50"
            />
          </div>

          {/* Refinement Prompt Input */}
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="E.g., 'Make day 2 budget friendly' or 'Add seafood dining'"
            disabled={isRefining}
            className="flex-1 px-4 py-2.5 text-sm bg-white border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 text-slate-800 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={(!instruction.trim() && !targetBudget.trim()) || isRefining}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isRefining ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span>Apply</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
