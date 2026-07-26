/**
 * LocalStorage Trip Storage Helper for FlamVoyager.
 * Allows saving, retrieving, loading, and deleting travel itinerary sessions.
 */

const STORAGE_KEY = 'flam_saved_trips';

export function getSavedTrips() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading saved trips from localStorage:', err);
    return [];
  }
}

export function saveTrip(itinerary) {
  if (typeof window === 'undefined' || !itinerary) return false;
  try {
    const existing = getSavedTrips();
    
    // Check if already saved by tripTitle & destination
    const existingIndex = existing.findIndex(t => t.id === itinerary.savedId || (t.tripTitle === itinerary.tripTitle && t.destination === itinerary.destination));

    const savedEntry = {
      savedId: itinerary.savedId || `saved-${Date.now()}`,
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      ...itinerary
    };

    if (existingIndex >= 0) {
      existing[existingIndex] = savedEntry;
    } else {
      existing.unshift(savedEntry);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return savedEntry.savedId;
  } catch (err) {
    console.error('Error saving trip to localStorage:', err);
    return false;
  }
}

export function deleteSavedTrip(savedId) {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getSavedTrips();
    const filtered = existing.filter(t => t.savedId !== savedId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Error deleting trip from localStorage:', err);
    return [];
  }
}
