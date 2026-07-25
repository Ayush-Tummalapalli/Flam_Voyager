'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, ArrowUp, ArrowDown, MapPin, Clock, Tag } from 'lucide-react';

const CATEGORY_COLORS = {
  Sightseeing: 'bg-blue-50 text-blue-700 border-blue-200',
  Food: 'bg-amber-50 text-amber-700 border-amber-200',
  Culture: 'bg-purple-50 text-purple-700 border-purple-200',
  Relaxation: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Shopping: 'bg-pink-50 text-pink-700 border-pink-200',
  Adventure: 'bg-orange-50 text-orange-700 border-orange-200',
  General: 'bg-slate-50 text-slate-700 border-slate-200'
};

export default function StopItem({ stop, isFirst, isLast, onMoveUp, onMoveDown, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryStyle = CATEGORY_COLORS[stop.category] || CATEGORY_COLORS.General;

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
          </div>

          <h4 className="font-semibold text-slate-800 text-base group-hover:text-indigo-600 transition-colors flex items-center gap-2">
            {stop.title}
          </h4>

          {stop.location && (
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{stop.location}</span>
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
        <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-lg animate-fadeIn">
          <p className="leading-relaxed">{stop.description}</p>
        </div>
      )}
    </div>
  );
}
