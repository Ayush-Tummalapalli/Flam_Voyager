'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, ArrowUp, ArrowDown, MapPin, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { convertCurrencyString } from '@/lib/currencyConverter';

const CATEGORY_COLORS = {
  Sightseeing: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
  Food: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  Culture: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
  Relaxation: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  Shopping: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/60 dark:text-pink-300 dark:border-pink-800',
  Adventure: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
  General: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
};

export default function StopItem({ stop, isFirst, isLast, onMoveUp, onMoveDown, onDelete, destination, currency = 'USD', darkMode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryStyle = CATEGORY_COLORS[stop.category] || CATEGORY_COLORS.General;
  
  const mapSearchQuery = encodeURIComponent(`${stop.title} ${stop.location || ''} ${destination || ''}`.trim());
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;

  const formattedCost = stop.estimatedCost ? convertCurrencyString(stop.estimatedCost, currency) : null;

  return (
    <div className={`group rounded-xl border p-4 shadow-sm hover:shadow-md transition-all ${
      darkMode
        ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50'
        : 'bg-white border-slate-100 hover:border-indigo-100'
    }`}>
      <div className="flex items-start justify-between gap-3">
        {/* Main Content Area */}
        <div className="flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
              darkMode
                ? 'bg-slate-800 text-slate-300 border-slate-700'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              <Clock className={`w-3 h-3 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} />
              {stop.time}
            </span>

            {stop.category && (
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${categoryStyle}`}>
                {stop.category}
              </span>
            )}

            {formattedCost && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${
                darkMode
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                <DollarSign className="w-3 h-3" />
                {formattedCost}
              </span>
            )}
          </div>

          <h4 className={`font-semibold text-base transition-colors flex items-center gap-2 ${
            darkMode
              ? 'text-slate-100 group-hover:text-indigo-400'
              : 'text-slate-800 group-hover:text-indigo-600'
          }`}>
            {stop.title}
          </h4>

          {/* Clickable Google Maps Location Link */}
          {stop.location && (
            <div className="mt-1" onClick={(e) => e.stopPropagation()}>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in Google Maps"
                className={`inline-flex items-center gap-1 text-xs font-medium hover:underline ${
                  darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>{stop.location}</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </a>
            </div>
          )}
        </div>

        {/* Action buttons: Reorder, Delete, Toggle Expand */}
        <div className={`flex items-center gap-1 p-1 rounded-lg border ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'
        }`}>
          <button
            onClick={() => onMoveUp(stop.id)}
            disabled={isFirst}
            title="Move Up"
            className="p-1 text-slate-400 hover:text-indigo-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          <button
            onClick={() => onMoveDown(stop.id)}
            disabled={isLast}
            title="Move Down"
            className="p-1 text-slate-400 hover:text-indigo-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          >
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(stop.id)}
            title="Remove Stop"
            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
            className={`p-1 text-slate-400 hover:text-indigo-500 transition-colors ml-1 border-l ${
              darkMode ? 'border-slate-700' : 'border-slate-200'
            }`}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Description Details */}
      {isExpanded && (
        <div className={`mt-3 pt-3 border-t text-sm p-3 rounded-lg animate-fadeIn space-y-2 ${
          darkMode
            ? 'border-slate-800 bg-slate-800/50 text-slate-300'
            : 'border-slate-100 bg-slate-50/50 text-slate-600'
        }`}>
          <p className="leading-relaxed">{stop.description}</p>

          <div className="pt-1">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors border ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-slate-700'
                  : 'bg-white hover:bg-indigo-50 text-indigo-700 border-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>View Location on Google Maps</span>
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
