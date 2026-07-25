'use client';

import { useState } from 'react';
import DayCard from './DayCard';
import RefinementBar from './RefinementBar';
import { MapPin, Calendar, RefreshCw, AlertCircle, Sparkles, DollarSign, AlertTriangle, PieChart, SunMedium, Thermometer, Briefcase } from 'lucide-react';

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
      {/* Low Budget Warning Banner */}
      {itinerary.isBudgetTooLow && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 text-amber-900 shadow-sm flex items-start gap-3 animate-fadeIn">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
              ⚠️ Given Budget is Too Low
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              {itinerary.budgetWarning || `The requested budget is too low for a realistic trip to ${itinerary.destination}. Recommended minimum budget is $50/day per person.`}
            </p>
          </div>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-5">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {itinerary.isMock ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Offline / Demo Fallback Mode</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live AI Generated Plan</span>
              </div>
            )}

            {/* Per-Pax Total Budget Badge */}
            {itinerary.estimatedBudgetPerPax && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-900/30">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Est. Budget: {itinerary.estimatedBudgetPerPax}</span>
              </div>
            )}
          </div>

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

          {/* Always Visible Detailed Budget Breakdown Box */}
          {itinerary.budgetBreakdown && (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <PieChart className="w-4 h-4 text-emerald-400" />
                  <span>Estimated Budget Breakdown (per pax)</span>
                </div>
                <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold">
                  End-to-End Estimate
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2.5 text-center pt-1">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-indigo-200 block text-[10px] font-medium">Stay & Hotel</span>
                  <span className="font-extrabold text-base text-white">{itinerary.budgetBreakdown.stay}</span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-indigo-200 block text-[10px] font-medium">Food & Dining</span>
                  <span className="font-extrabold text-base text-white">{itinerary.budgetBreakdown.food}</span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-indigo-200 block text-[10px] font-medium">Activities & Transport</span>
                  <span className="font-extrabold text-base text-white">{itinerary.budgetBreakdown.activities}</span>
                </div>
              </div>
            </div>
          )}

          {/* Weather & Season Advisor Card */}
          {itinerary.weatherAdvisor && (
            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 backdrop-blur-md rounded-xl border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <SunMedium className="w-4 h-4 text-amber-400" />
                <span>Weather & Season Advisor for {itinerary.destination}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-slate-200">
                <div className="flex items-center gap-2">
                  <SunMedium className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-indigo-300 font-semibold uppercase">Best Season</span>
                    <span className="font-semibold text-white">{itinerary.weatherAdvisor.bestSeason}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-indigo-300 font-semibold uppercase">Avg Temp</span>
                    <span className="font-semibold text-white">{itinerary.weatherAdvisor.averageTemp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:col-span-1">
                  <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-indigo-300 font-semibold uppercase">Packing Advice</span>
                    <span className="font-semibold text-white leading-tight">{itinerary.weatherAdvisor.packingTip}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            destination={itinerary.destination}
            onUpdateStops={handleUpdateStops}
          />
        ))}
      </div>
    </div>
  );
}
