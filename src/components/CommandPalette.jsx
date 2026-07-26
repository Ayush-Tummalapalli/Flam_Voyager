'use client';

import { useState, useEffect } from 'react';
import { Search, Moon, Sun, DollarSign, Printer, Share2, Briefcase, Calendar, BookmarkCheck, Zap, X } from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  darkMode,
  toggleDarkMode,
  onExportPDF,
  onShareTrip,
  onOpenSavedTrips,
  onInstantDemo,
  onSwitchTab,
  onSelectCurrency
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'dark-mode',
      title: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      category: 'Appearance',
      icon: darkMode ? Sun : Moon,
      run: () => { toggleDarkMode(); onClose(); }
    },
    {
      id: 'export-pdf',
      title: 'Export Itinerary as PDF / Print',
      category: 'Actions',
      icon: Printer,
      run: () => { onExportPDF(); onClose(); }
    },
    {
      id: 'share-trip',
      title: 'Share Trip Text Summary for WhatsApp / Text',
      category: 'Actions',
      icon: Share2,
      run: () => { onShareTrip(); onClose(); }
    },
    {
      id: 'saved-trips',
      title: 'Open My Saved Trips Drawer',
      category: 'Sessions',
      icon: BookmarkCheck,
      run: () => { onOpenSavedTrips(); onClose(); }
    },
    {
      id: 'currency-inr',
      title: 'Set Currency to INR (₹)',
      category: 'Currency',
      icon: DollarSign,
      run: () => { onSelectCurrency('INR'); onClose(); }
    },
    {
      id: 'currency-usd',
      title: 'Set Currency to USD ($)',
      category: 'Currency',
      icon: DollarSign,
      run: () => { onSelectCurrency('USD'); onClose(); }
    },
    {
      id: 'currency-eur',
      title: 'Set Currency to EUR (€)',
      category: 'Currency',
      icon: DollarSign,
      run: () => { onSelectCurrency('EUR'); onClose(); }
    },
    {
      id: 'tab-schedule',
      title: 'Switch to Day-by-Day Schedule Tab',
      category: 'View',
      icon: Calendar,
      run: () => { onSwitchTab('itinerary'); onClose(); }
    },
    {
      id: 'tab-packing',
      title: 'Switch to 🎒 Packing Checklist Tab',
      category: 'View',
      icon: Briefcase,
      run: () => { onSwitchTab('packing'); onClose(); }
    },
    {
      id: 'demo-tokyo',
      title: 'Instant Load: 🗼 3 Days Tokyo (Family)',
      category: 'Quick Demos',
      icon: Zap,
      run: () => { onInstantDemo('3 days in Tokyo exploring culture & food', 'Family with Kids'); onClose(); }
    },
    {
      id: 'demo-paris',
      title: 'Instant Load: 🥐 Paris Weekend (Couple)',
      category: 'Quick Demos',
      icon: Zap,
      run: () => { onInstantDemo('Weekend trip to Paris romantic highlights', 'Couple / Romantic'); onClose(); }
    },
    {
      id: 'demo-goa',
      title: 'Instant Load: 🏖️ 5 Days Goa (Friends)',
      category: 'Quick Demos',
      icon: Zap,
      run: () => { onInstantDemo('5-day beach & nightlife trip to Goa', 'Group of Friends'); onClose(); }
    },
    {
      id: 'demo-rome',
      title: 'Instant Load: 🏛️ 4 Days Rome (Solo)',
      category: 'Quick Demos',
      icon: Zap,
      run: () => { onInstantDemo('4 days in Rome exploring historical sights', 'Solo Traveler'); onClose(); }
    }
  ];

  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(query.toLowerCase()) ||
    action.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 animate-fadeIn">
      {/* Dark Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
      />

      {/* Command Box Container */}
      <div className={`relative max-w-xl mx-auto rounded-2xl border shadow-2xl overflow-hidden transition-all ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Search Header */}
        <div className={`p-4 border-b flex items-center gap-3 ${
          darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50/50'
        }`}>
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search (e.g. 'dark', 'pdf', 'inr', 'tokyo')..."
            className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400 font-medium"
          />
          <button
            onClick={onClose}
            className={`p-1 rounded-lg border text-xs text-slate-400 hover:text-slate-600 transition-colors ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching commands found for "{query}".
            </div>
          ) : (
            filteredActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.run}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all group ${
                    darkMode
                      ? 'hover:bg-indigo-600 hover:text-white text-slate-200'
                      : 'hover:bg-indigo-600 hover:text-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-slate-800 group-hover:bg-indigo-500 text-indigo-300 group-hover:text-white' : 'bg-indigo-50 group-hover:bg-indigo-500 text-indigo-600 group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{action.title}</span>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    darkMode ? 'border-slate-700 text-slate-400 group-hover:border-indigo-400 group-hover:text-white' : 'border-slate-200 text-slate-400 group-hover:border-indigo-400 group-hover:text-white'
                  }`}>
                    {action.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className={`p-3 border-t text-[10px] flex items-center justify-between font-semibold ${
          darkMode ? 'border-slate-800 bg-slate-900/80 text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-400'
        }`}>
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">ESC</kbd> to exit</span>
          <span className="text-indigo-500">FlamVoyager Command Palette ⌘K</span>
        </div>
      </div>
    </div>
  );
}
