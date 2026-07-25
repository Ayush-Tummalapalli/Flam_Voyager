'use client';

import { useState } from 'react';
import { Sparkles, MapPin, Send } from 'lucide-react';

const PRESET_PROMPTS = [
  "3 days in Tokyo exploring culture, anime & street food",
  "Budget-friendly weekend getaway to Paris",
  "5-day relaxing beach & heritage trip to Goa",
  "4 days in New York City with top landmarks & museums"
];

export default function TripInputForm({ onSubmit, isLoading }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt);
  };

  const handleSelectPreset = (presetText) => {
    setPrompt(presetText);
    onSubmit(presetText);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 transition-all">
      <div className="flex items-center gap-2 mb-3 text-indigo-600 font-semibold text-sm">
        <Sparkles className="w-4 h-4" />
        <span>Describe your ideal vacation</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Where do you want to go? E.g., 'Planning a 4-day trip to Kyoto in autumn focusing on temples, gardens, and authentic tea houses...'"
            rows={3}
            disabled={isLoading}
            className="w-full px-4 py-3 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-base placeholder:text-slate-400 transition-all disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span className="font-medium text-slate-600">Try an example:</span>
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-lg transition-colors text-xs disabled:opacity-50"
              >
                {preset.split(' ')[2]} {preset.split(' ')[3]}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Crafting Itinerary...</span>
              </>
            ) : (
              <>
                <span>Generate Plan</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
