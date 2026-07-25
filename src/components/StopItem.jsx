'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, ArrowUp, ArrowDown, MapPin, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { convertCurrencyString } from '@/lib/currencyConverter';

const CATEGORY_COLORS = {
  Sightseeing: 'bg-blue-50 text-blue-700 border-blue-200',
  Food: 'bg-amber-50 text-amber-700 border-amber-200',
  Culture: 'bg-purple-50 text-purple-700 border-purple-200',
  Relaxation: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Shopping: 'bg-pink-50 text-pink-700 border-pink-200',
  Adventure: 'bg-orange-50 text-orange-700 border-orange-200',
  General: 'bg-slate-50 text-slate-700 border-slate-200'
};

export default function StopItem({ stop, isFirst, isLast, onMoveUp, onMoveDown, onDelete, destination, currency = 'USD' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryStyle = CATEGORY_COLORS[stop.category] || CATEGORY_COLORS.General;
  
  const mapSearchQuery = encodeURIComponent(`${stop.title} ${stop.location || ''} ${destination || ''}`.trim());
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;

  const formattedCost = stop.estimatedCost ? convertCurrencyString(stop.estimatedCost, currency) : null;

  return (
    <div className="group bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
      <div className="flex items-start justify-between gap-3">
        {/* Main Content Area */}
        <div className="flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 text-slate-600 bg-slate-50 border-slate-200">
              <Clock className="w-3 h-3 text-slate-400" />
              {stop.time}
            </span>

            {stop.category && (
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${categoryStyle}`}>
                {stop.category}
              </span>
            )}

            {formattedCost && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                <DollarSign className="w-3 h-3" />
                {formattedCost}
              </span>
            )}
          </div>

          <h4 className="font-semibold text-slate-800 text-base group-hover:text-indigo-600 transition-colors flex items-center gap-2">
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
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>{stop.location}</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </a>
            </div>
          )}
        </div>

        {/* Action buttons: Reorder, Delete, Toggle Expand */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
          <button
            onClick={() => onMoveUp(stop.id)}
            disabled={isFirst}
            title="Move Up"
            className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          <button
            onClick={() => onMoveDown(stop.id)}
            disabled={isLast}
            title="Move Down"
            className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          >
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(stop.id)}
            title="Remove Stop"
            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors ml-1 border-l border-slate-200"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Description Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-lg animate-fadeIn space-y-2">
          <p className="leading-relaxed">{stop.description}</p>

          <div className="pt-1">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>View Location on Google Maps</span>
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
