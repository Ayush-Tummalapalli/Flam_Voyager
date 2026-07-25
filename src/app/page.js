'use client';

import { useState } from 'react';
import TripInputForm from '@/components/TripInputForm';
import ItineraryView from '@/components/ItineraryView';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { getMockItinerary } from '@/lib/mockItinerary';
import { Compass, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPrompt, setLastPrompt] = useState('');

  const generateItinerary = async (prompt) => {
    setIsLoading(true);
    setError(null);
    setLastPrompt(prompt);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
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
      generateItinerary(lastPrompt);
    }
  };

  const handleUseMock = () => {
    setError(null);
    const mockData = getMockItinerary(lastPrompt || 'Sample Trip');
    setItinerary(mockData);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">
      {/* Top Header Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-lg leading-none">
                FlamVoyager
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600">
                AI Travel Planner
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Key Secured Server-side</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        {/* Intro Tagline */}
        {!itinerary && !isLoading && (
          <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Plan Your Next Adventure in Seconds
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Describe your destination, trip length, or vibe. FlamVoyager generates an interactive day-by-day itinerary you can reorder and customize.
            </p>
          </div>
        )}

        {/* Input Form */}
        <TripInputForm onSubmit={generateItinerary} isLoading={isLoading} />

        {/* Error State */}
        {error && (
          <ErrorAlert
            message={error}
            onRetry={handleRetry}
            onUseMock={handleUseMock}
          />
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Generated Itinerary Display */}
        {itinerary && !isLoading && (
          <ItineraryView
            itinerary={itinerary}
            onUpdateItinerary={setItinerary}
            onReset={() => setItinerary(null)}
          />
        )}
      </div>
    </main>
  );
}
