'use client';

import { useState } from 'react';
import { Sparkles, Send, Users, Zap } from 'lucide-react';

const PRESET_PROMPTS = [
  "3 days in Tokyo exploring culture, anime & street food",
  "Budget-friendly weekend getaway to Paris",
  "5-day relaxing beach & heritage trip to Goa",
  "4 days in New York City with top landmarks & museums"
];

const COMPANION_OPTIONS = [
  { label: '🧳 Solo Traveler', value: 'Solo Traveler' },
  { label: '👩‍❤️‍👨 Couple / Romantic', value: 'Couple / Romantic' },
  { label: '👨‍👩‍👧‍👦 Family with Kids', value: 'Family with Kids' },
  { label: '🥳 Group of Friends', value: 'Group of Friends' }
];

const INSTANT_DEMOS = [
  { label: '🗼 Tokyo 3 Days', prompt: '3 days in Tokyo exploring culture & food', companion: 'Family with Kids' },
  { label: '🥐 Paris Weekend', prompt: 'Weekend trip to Paris romantic highlights', companion: 'Couple / Romantic' },
  { label: '🏖️ Goa 5 Days', prompt: '5-day beach & nightlife trip to Goa', companion: 'Group of Friends' },
  { label: '🏛️ Rome 4 Days', prompt: '4 days in Rome exploring historical sights', companion: 'Solo Traveler' }
];

export default function TripInputForm({ onSubmit, onInstantDemo, isLoading, darkMode }) {
  const [prompt, setPrompt] = useState('');
  const [companionType, setCompanionType] = useState('Solo Traveler');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt, companionType);
  };

  const handleSelectPreset = (presetText) => {
    setPrompt(presetText);
    onSubmit(presetText, companionType);
  };

  return (
    <div className={`rounded-2xl p-6 mb-8 transition-all space-y-5 border ${
      darkMode
        ? 'bg-slate-900 border-slate-800 shadow-xl'
        : 'bg-white border-slate-100 shadow-sm'
    }`}>
      
      {/* Quick Demo Trips Banner */}
      <div className={`p-4 rounded-xl border space-y-2.5 ${
        darkMode ? 'bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 border-amber-900/40' : 'bg-gradient-to-r from-amber-50 via-indigo-50 to-purple-50 border-amber-200/70'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-400">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>⚡ Quick Demo Trips</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
            Instant Load
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-0.5">
          {INSTANT_DEMOS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInstantDemo(demo.prompt, demo.companion)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-all shadow-2xs hover:scale-[1.02] disabled:opacity-50 ${
                darkMode
                  ? 'bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-indigo-600 hover:text-white text-slate-800 border-amber-200/90'
              }`}
            >
              <span>{demo.label}</span>
              <span className="text-[10px] opacity-75 font-normal">({demo.companion.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-indigo-500 font-semibold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Or describe your own travel plan</span>
        </div>

        {/* Companion Filter Selector Label */}
        <div className={`flex items-center gap-1.5 text-xs font-medium ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          <span>Who is traveling?</span>
        </div>
      </div>

      {/* Travel Companion Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {COMPANION_OPTIONS.map((option) => {
          const isSelected = companionType === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setCompanionType(option.value)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : darkMode
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Where do you want to go as a ${companionType}? E.g., 'Planning a 4-day trip to Kyoto focusing on gardens, tea houses & peaceful walks...'`}
            rows={3}
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded-xl outline-none resize-none text-base transition-all disabled:opacity-50 ${
              darkMode
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500'
            }`}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Try an example:
            </span>
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className={`px-2.5 py-1 rounded-lg transition-colors text-xs disabled:opacity-50 ${
                  darkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                {preset.split(' ')[2]} {preset.split(' ')[3]}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:shadow-none"
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
