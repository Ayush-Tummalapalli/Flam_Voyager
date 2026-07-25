'use client';

import { useState } from 'react';
import DayCard from './DayCard';
import RefinementBar from './RefinementBar';
import { MapPin, Calendar, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export default function ItineraryView({ itinerary, onUpdateItinerary, onReset }) {
  const [isRefining, setIsRefining] = useState(false);
  const [refineNotice, setRefineNotice] = useState(null);

  if (!itinerary) return null;

  const handleUpdateStops = (dayNumber, newStops) => {
    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return { ...day, stops: newStops };
      }
      return day;
    });

    onUpdateItinerary({
      ...itinerary,
      days: updatedDays
    });
  };

  const handleRefine = async (instruction) => {
    setIsRefining(true);
    setRefineNotice(null);

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentItinerary: itinerary,
          instruction: instruction
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to refine itinerary.');
      }

      onUpdateItinerary(data.data);
      setRefineNotice(`Refined based on: "${instruction}"`);

      // Clear notice after 5 seconds
      setTimeout(() => setRefineNotice(null), 5000);
    } catch (err) {
      console.error('Refinement error:', err);
      alert(err.message || 'Could not refine itinerary. Please try again.');
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-3">
          {itinerary.isMock && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Offline / Demo Fallback Mode</span>
            </div>
          )}

          {refineNotice && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-medium animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{refineNotice}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {itinerary.tripTitle}
              </h2>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-indigo-200 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  {itinerary.destination}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  {itinerary.duration}
                </span>
              </div>
            </div>

            <button
              onClick={onReset}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors self-start sm:self-center"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Plan</span>
            </button>
          </div>

          <p className="text-sm text-indigo-100/80 pt-2 border-t border-indigo-700/50 leading-relaxed">
            {itinerary.summary}
          </p>
        </div>
      </div>

      {/* AI Refinement Bar Component */}
      <RefinementBar onRefine={handleRefine} isRefining={isRefining} />

      {/* Days Breakdown */}
      <div className="space-y-6">
        {itinerary.days.map((day) => (
          <DayCard
            key={day.dayNumber}
            day={day}
            onUpdateStops={handleUpdateStops}
          />
        ))}
      </div>
    </div>
  );
}
