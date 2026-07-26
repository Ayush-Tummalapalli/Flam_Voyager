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
    
    // Unique ID for each saved trip session
    const uniqueSavedId = itinerary.savedId || `saved-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const savedEntry = {
      ...itinerary,
      savedId: uniqueSavedId,
      savedAt: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    // Only update if exact savedId matches (i.e. editing an existing saved trip), otherwise add new
    const existingIndex = itinerary.savedId ? existing.findIndex(t => t.savedId === itinerary.savedId) : -1;

    if (existingIndex >= 0) {
      existing[existingIndex] = savedEntry;
    } else {
      existing.unshift(savedEntry);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return uniqueSavedId;
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
