'use client';

import { X, MapPin, Calendar, Users, Trash2, ArrowRight, BookmarkCheck, Compass } from 'lucide-react';

export default function SavedTripsDrawer({ isOpen, onClose, savedTrips, onLoadTrip, onDeleteTrip, darkMode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Side Drawer Modal */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md border-l shadow-2xl flex flex-col transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          
          {/* Header */}
          <div className={`p-5 border-b flex items-center justify-between ${
            darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50/50'
          }`}>
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-indigo-500" />
              <h3 className="font-extrabold text-base tracking-tight">
                My Saved Trips ({savedTrips.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl border transition-colors ${
                darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {savedTrips.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm">No Saved Trips Yet</h4>
                <p className={`text-xs max-w-xs mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Generate an itinerary and click the <strong>"Save Trip"</strong> button to bookmark your favorite travel plans here!
                </p>
              </div>
            ) : (
              savedTrips.map((trip) => (
                <div
                  key={trip.savedId}
                  className={`p-4 rounded-xl border space-y-3 transition-all ${
                    darkMode
                      ? 'bg-slate-800/80 border-slate-700 hover:border-indigo-500/50'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
                        Saved on {trip.savedAt || 'Recently'}
                      </span>
                      <h4 className="font-bold text-base leading-snug">
                        {trip.tripTitle}
                      </h4>
                    </div>

                    <button
                      onClick={() => onDeleteTrip(trip.savedId)}
                      title="Delete saved trip"
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs flex-wrap opacity-90">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {trip.destination}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {trip.duration}
                    </span>
                    {trip.companionType && (
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        {trip.companionType}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-end">
                    <button
                      onClick={() => {
                        onLoadTrip(trip);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <span>Load Trip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
