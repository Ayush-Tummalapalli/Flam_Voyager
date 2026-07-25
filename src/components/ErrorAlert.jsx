'use client';

import { AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';

export default function ErrorAlert({ message, onRetry, onUseMock }) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800 space-y-4 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="font-bold text-base text-rose-900">AI Generation Failed</h3>
          <p className="text-xs sm:text-sm text-rose-700 leading-relaxed">
            {message || 'The AI model could not process your prompt or returned invalid output.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2 border-t border-rose-200/60">
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>

        {onUseMock && (
          <button
            onClick={onUseMock}
            className="px-4 py-2 bg-white hover:bg-rose-100/50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Load Demo Itinerary</span>
          </button>
        )}
      </div>
    </div>
  );
}
