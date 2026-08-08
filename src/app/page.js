'use client';

import { useState, useEffect } from 'react';
import TripInputForm from '@/components/TripInputForm';
import ItineraryView from '@/components/ItineraryView';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import SavedTripsDrawer from '@/components/SavedTripsDrawer';
import { getMockItinerary } from '@/lib/mockItinerary';
import { getSavedTrips, deleteSavedTrip } from '@/lib/tripStorage';
import { Compass, ShieldCheck, Sun, Moon, BookmarkCheck } from 'lucide-react';

export default function Home() {
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPrompt, setLastPrompt] = useState('');
  const [lastCompanion, setLastCompanion] = useState('Solo Traveler');
  const [darkMode, setDarkMode] = useState(false);
  const [savedTrips, setSavedTrips] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('flam_theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
    // Load saved trips from localStorage
    setSavedTrips(getSavedTrips());
  }, []);

  const refreshSavedTrips = () => {
    setSavedTrips(getSavedTrips());
  };

  const handleDeleteSavedTrip = (savedId) => {
    const updated = deleteSavedTrip(savedId);
    setSavedTrips(updated);
  };

  const handleLoadSavedTrip = (savedItinerary) => {
    setItinerary(savedItinerary);
  };

  const handleInstantDemo = (promptText, companion) => {
    setError(null);
    setLastPrompt(promptText);
    setLastCompanion(companion);
    const demoData = getMockItinerary(promptText, null, companion);
    setItinerary(demoData);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('flam_theme', newMode ? 'dark' : 'light');
  };

  const generateItinerary = async (prompt, companionType = 'Solo Traveler') => {
    setIsLoading(true);
    setError(null);
    setLastPrompt(prompt);
    setLastCompanion(companionType);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, companionType }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 100)}`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate itinerary. Please try again.');
      }

      setItinerary(data.data);
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastPrompt) {
      generateItinerary(lastPrompt, lastCompanion);
    }
  };

  const handleUseMock = () => {
    setError(null);
    const mockData = getMockItinerary(lastPrompt || 'Sample Trip', null, lastCompanion);
    setItinerary(mockData);
  };

  return (
    <main className={`min-h-screen pb-16 font-sans transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Top Header Navbar */}
      <header className={`backdrop-blur-md border-b sticky top-0 z-40 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200/80'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`font-extrabold text-lg leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Itinera AI
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500">
                AI Travel Planner
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* My Saved Trips Drawer Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-indigo-300 hover:bg-slate-700'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">My Saved Trips</span>
              {savedTrips.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedTrips.length}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            <div className={`hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
              darkMode 
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Key Secured Server-side</span>
            </div>
          </div>
        </div>
      </header>

      {/* Saved Trips Side Drawer */}
      <SavedTripsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        savedTrips={savedTrips}
        onLoadTrip={handleLoadSavedTrip}
        onDeleteTrip={handleDeleteSavedTrip}
        darkMode={darkMode}
      />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        {/* Intro Tagline */}
        {!itinerary && !isLoading && (
          <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
            <h2 className={`text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Plan Your Next Adventure in Seconds
            </h2>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Describe your destination, trip length, or vibe. Itinera AI generates an interactive day-by-day itinerary tailored to your travel companions.
            </p>
          </div>
        )}

        {/* Input Form */}
        <TripInputForm
          onSubmit={generateItinerary}
          onInstantDemo={handleInstantDemo}
          isLoading={isLoading}
          darkMode={darkMode}
        />

        {/* Error State */}
        {error && (
          <ErrorAlert
            message={error}
            onRetry={handleRetry}
            onUseMock={handleUseMock}
          />
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton darkMode={darkMode} />}

        {/* Generated Itinerary Display */}
        {itinerary && !isLoading && (
          <ItineraryView
            itinerary={itinerary}
            darkMode={darkMode}
            onUpdateItinerary={setItinerary}
            onReset={() => setItinerary(null)}
            onTripSaved={refreshSavedTrips}
          />
        )}
      </div>
    </main>
  );
}
