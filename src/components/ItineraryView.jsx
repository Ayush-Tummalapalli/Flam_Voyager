'use client';

import { useState } from 'react';
import DayCard from './DayCard';
import RefinementBar from './RefinementBar';
import PackingChecklist from './PackingChecklist';
import BudgetChart from './BudgetChart';
import { CURRENCIES, convertCurrencyString } from '@/lib/currencyConverter';
import { saveTrip } from '@/lib/tripStorage';
import { MapPin, Calendar, RefreshCw, AlertCircle, Sparkles, DollarSign, AlertTriangle, SunMedium, Thermometer, Briefcase, Users, Printer, Share2, Check, Globe, BookmarkPlus, BookmarkCheck } from 'lucide-react';

export default function ItineraryView({ itinerary, onUpdateItinerary, onReset, darkMode, onTripSaved }) {
  const [isRefining, setIsRefining] = useState(false);
  const [refineNotice, setRefineNotice] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'packing'

  if (!itinerary) return null;

  const handleSaveCurrentTrip = () => {
    const savedId = saveTrip(itinerary);
    if (savedId) {
      setIsSaved(true);
      if (onTripSaved) onTripSaved();
      setTimeout(() => setIsSaved(false), 4000);
    }
  };

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

  const handleExportPDF = () => {
    window.print();
  };

  const handleShareTrip = () => {
    const formattedBudget = itinerary.estimatedBudgetPerPax 
      ? convertCurrencyString(itinerary.estimatedBudgetPerPax, currency) 
      : 'N/A';

    let text = `✈️ *${itinerary.tripTitle}*\n`;
    text += `📍 *Destination*: ${itinerary.destination}\n`;
    text += `📅 *Duration*: ${itinerary.duration} (${itinerary.companionType || 'Solo Traveler'})\n`;
    text += `💰 *Est. Budget*: ${formattedBudget}\n\n`;
    text += `📝 *Summary*: ${itinerary.summary}\n\n`;

    itinerary.days.forEach((day) => {
      text += `🗓️ *DAY ${day.dayNumber}: ${day.title.toUpperCase()}*\n`;
      day.stops.forEach((stop) => {
        const costStr = stop.estimatedCost ? ` [${convertCurrencyString(stop.estimatedCost, currency)}]` : '';
        text += `• *${stop.time}* - ${stop.title}${costStr}\n  ${stop.description}\n`;
      });
      text += `\n`;
    });

    text += `🚀 *Planned with Itinera AI*`;

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 4000);
  };

  const formattedTotalBudget = itinerary.estimatedBudgetPerPax 
    ? convertCurrencyString(itinerary.estimatedBudgetPerPax, currency) 
    : '$350 / person';

  return (
    <div className="space-y-5 sm:space-y-6 animate-fadeIn">
      {/* Low Budget Warning Banner */}
      {itinerary.isBudgetTooLow && (
        <div className={`border rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-3 animate-fadeIn no-print ${
          darkMode
            ? 'bg-amber-950/60 border-amber-800 text-amber-200'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <div className={`p-2 rounded-xl shrink-0 ${darkMode ? 'bg-amber-900 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-xs sm:text-sm flex items-center gap-2">
              ⚠️ Given Budget is Too Low
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed opacity-90">
              {itinerary.budgetWarning || `The requested budget is too low for a realistic trip to ${itinerary.destination}. Recommended minimum budget is $50/day per person.`}
            </p>
          </div>
        </div>
      )}

      {/* Header Info Banner */}
      <div className={`rounded-2xl p-5 sm:p-8 shadow-xl relative overflow-hidden space-y-4 sm:space-y-5 ${
        darkMode
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800'
          : 'bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white'
      }`}>
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl no-print" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl no-print" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {itinerary.isMock ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-[11px] sm:text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Offline / Demo Fallback Mode</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-[11px] sm:text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live AI Generated Plan</span>
                </div>
              )}

              {/* Companion Type Badge */}
              {itinerary.companionType && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 rounded-full text-[11px] sm:text-xs font-semibold">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{itinerary.companionType}</span>
                </div>
              )}
            </div>

            {/* Currency Selector & Per-Pax Budget Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-white/10 border border-white/20 px-2 py-1 rounded-full text-[11px] sm:text-xs no-print">
                <Globe className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
                >
                  {Object.values(CURRENCIES).map((curr) => (
                    <option key={curr.code} value={curr.code} className="text-slate-800 font-semibold">
                      {curr.flag} {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              {itinerary.estimatedBudgetPerPax && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-[11px] sm:text-xs font-bold shadow-md shadow-emerald-900/30">
                  <DollarSign className="w-3.5 h-3.5 shrink-0" />
                  <span>Est. Budget: {formattedTotalBudget}</span>
                </div>
              )}
            </div>
          </div>

          {refineNotice && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-medium animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{refineNotice}</span>
            </div>
          )}

          {copiedShare && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-teal-500/30 border border-teal-400/40 text-teal-200 rounded-full text-xs font-semibold animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-teal-300" />
              <span>Itinerary copied to clipboard for WhatsApp/SMS!</span>
            </div>
          )}

          {isSaved && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 rounded-full text-xs font-semibold animate-fadeIn">
              <BookmarkCheck className="w-3.5 h-3.5 text-indigo-300" />
              <span>Saved to My Trips drawer!</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {itinerary.tripTitle}
              </h2>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-indigo-200 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                  {itinerary.destination}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                  {itinerary.duration}
                </span>
              </div>
            </div>

            {/* Action Bar: Grid on Mobile, Flex on Desktop */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto self-start sm:self-center no-print">
              <button
                onClick={handleSaveCurrentTrip}
                title="Save itinerary to browser localStorage"
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl border border-indigo-400/30 flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-indigo-200" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Saved!' : 'Save Trip'}</span>
              </button>

              <button
                onClick={handleShareTrip}
                title="Copy trip text summary for WhatsApp or messages"
                className="px-3 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl border border-emerald-400/30 flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedShare ? 'Copied!' : 'Share Trip'}</span>
              </button>

              <button
                onClick={handleExportPDF}
                title="Export or print itinerary to clean PDF"
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={onReset}
                title="Start a new trip plan"
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Plan</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-indigo-100/80 pt-2 border-t border-indigo-700/50 leading-relaxed">
            {itinerary.summary}
          </p>

          {/* Interactive SVG Budget Chart Block */}
          {itinerary.budgetBreakdown && (
            <BudgetChart 
              budgetBreakdown={itinerary.budgetBreakdown} 
              currency={currency} 
              darkMode={darkMode} 
            />
          )}

          {/* Weather & Season Advisor Card */}
          {itinerary.weatherAdvisor && (
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 backdrop-blur-md rounded-xl border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                <SunMedium className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Weather & Season Advisor for {itinerary.destination}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 text-slate-200">
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

      {/* Main Content View Switcher Tabs (Itinerary vs Packing List) */}
      <div className={`flex items-center gap-2 border-b pb-3 no-print ${
        darkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'itinerary'
              ? 'bg-indigo-600 text-white shadow-sm'
              : darkMode
                ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Day-by-Day Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('packing')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'packing'
              ? 'bg-indigo-600 text-white shadow-sm'
              : darkMode
                ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>🎒 Packing Checklist</span>
        </button>
      </div>

      {/* View Content based on activeTab */}
      {activeTab === 'itinerary' ? (
        <>
          {/* AI Refinement Bar Component */}
          <div className="no-print">
            <RefinementBar onRefine={handleRefine} isRefining={isRefining} darkMode={darkMode} />
          </div>

          {/* Days Breakdown */}
          <div className="space-y-5 sm:space-y-6">
            {itinerary.days.map((day) => (
              <DayCard
                key={day.dayNumber}
                day={day}
                destination={itinerary.destination}
                currency={currency}
                darkMode={darkMode}
                onUpdateStops={handleUpdateStops}
              />
            ))}
          </div>
        </>
      ) : (
        /* Interactive Packing Checklist Component */
        <PackingChecklist
          packingChecklist={itinerary.packingChecklist}
          destination={itinerary.destination}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
