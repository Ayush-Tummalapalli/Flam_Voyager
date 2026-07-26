'use client';

import { useState } from 'react';
import { convertCurrencyString } from '@/lib/currencyConverter';
import { PieChart, Hotel, Utensils, Ticket } from 'lucide-react';

export default function BudgetChart({ budgetBreakdown, currency = 'USD', darkMode }) {
  const [activeSegment, setActiveSegment] = useState(null);

  if (!budgetBreakdown) return null;

  // Helper to extract numeric values from strings like "$150", "$120"
  const parseAmount = (str) => {
    if (!str) return 0;
    const match = String(str).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const stayVal = parseAmount(budgetBreakdown.stay) || 150;
  const foodVal = parseAmount(budgetBreakdown.food) || 120;
  const activitiesVal = parseAmount(budgetBreakdown.activities) || 80;

  const total = stayVal + foodVal + activitiesVal || 350;

  const stayPct = Math.round((stayVal / total) * 100);
  const foodPct = Math.round((foodVal / total) * 100);
  const actPct = 100 - stayPct - foodPct; // Ensure totals 100%

  const formattedStay = convertCurrencyString(budgetBreakdown.stay || `$${stayVal}`, currency);
  const formattedFood = convertCurrencyString(budgetBreakdown.food || `$${foodVal}`, currency);
  const formattedActivities = convertCurrencyString(budgetBreakdown.activities || `$${activitiesVal}`, currency);
  const formattedTotal = convertCurrencyString(`$${total}`, currency);

  // SVG Donut Calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke offsets for donut segments
  const stayOffset = 0;
  const foodOffset = (stayPct / 100) * circumference;
  const actOffset = ((stayPct + foodPct) / 100) * circumference;

  const segments = [
    {
      id: 'stay',
      label: 'Stay & Hotel',
      val: stayVal,
      pct: stayPct,
      formatted: formattedStay,
      color: '#10b981', // emerald-500
      glowColor: 'shadow-emerald-500/30',
      icon: Hotel,
      strokeDasharray: `${(stayPct / 100) * circumference} ${circumference}`,
      strokeDashoffset: -stayOffset
    },
    {
      id: 'food',
      label: 'Food & Dining',
      val: foodVal,
      pct: foodPct,
      formatted: formattedFood,
      color: '#6366f1', // indigo-500
      glowColor: 'shadow-indigo-500/30',
      icon: Utensils,
      strokeDasharray: `${(foodPct / 100) * circumference} ${circumference}`,
      strokeDashoffset: -foodOffset
    },
    {
      id: 'activities',
      label: 'Activities & Transport',
      val: activitiesVal,
      pct: actPct,
      formatted: formattedActivities,
      color: '#f59e0b', // amber-500
      glowColor: 'shadow-amber-500/30',
      icon: Ticket,
      strokeDasharray: `${(actPct / 100) * circumference} ${circumference}`,
      strokeDashoffset: -actOffset
    }
  ];

  return (
    <div className={`mt-4 p-5 rounded-2xl border space-y-4 transition-all ${
      darkMode
        ? 'bg-slate-900/90 border-slate-800 text-white'
        : 'bg-white/10 backdrop-blur-md border-white/20 text-white'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
          <PieChart className="w-4 h-4 text-emerald-400" />
          <span>Interactive Visual Budget Breakdown</span>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
          SVG Chart Block
        </span>
      </div>

      {/* Main Chart + Legend Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        
        {/* SVG Donut Chart */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative py-2">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-white/10 fill-none"
                strokeWidth="12"
              />
              {segments.map((seg) => (
                <circle
                  key={seg.id}
                  cx="50"
                  cy="50"
                  r={radius}
                  className="fill-none transition-all duration-300 cursor-pointer hover:opacity-80"
                  stroke={seg.color}
                  strokeWidth={activeSegment === seg.id ? "15" : "12"}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  onMouseEnter={() => setActiveSegment(seg.id)}
                  onMouseLeave={() => setActiveSegment(null)}
                />
              ))}
            </svg>

            {/* Center Donut Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wider">
                {activeSegment ? segments.find(s => s.id === activeSegment)?.label.split(' ')[0] : 'Total / Pax'}
              </span>
              <span className="font-extrabold text-sm sm:text-base text-white leading-tight">
                {activeSegment ? segments.find(s => s.id === activeSegment)?.formatted : formattedTotal}
              </span>
            </div>
          </div>
        </div>

        {/* Category Legend & Breakdown List */}
        <div className="sm:col-span-7 space-y-2.5">
          {segments.map((seg) => {
            const Icon = seg.icon;
            const isHovered = activeSegment === seg.id;
            return (
              <div
                key={seg.id}
                onMouseEnter={() => setActiveSegment(seg.id)}
                onMouseLeave={() => setActiveSegment(null)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isHovered
                    ? 'bg-white/20 border-white/40 scale-[1.02] shadow-md'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: seg.color }}
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white block flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-indigo-200" />
                      {seg.label}
                    </span>
                    <span className="text-[10px] text-indigo-200 block">
                      {seg.pct}% of total budget
                    </span>
                  </div>
                </div>

                <span className="font-extrabold text-sm text-white">
                  {seg.formatted}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
