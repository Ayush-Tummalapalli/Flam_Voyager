'use client';

import { useState } from 'react';
import StopItem from './StopItem';
import { Plus } from 'lucide-react';

export default function DayCard({ day, destination, currency, onUpdateStops }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState('Sightseeing');
  const [newDescription, setNewDescription] = useState('');

  const handleMoveUp = (stopId) => {
    const index = day.stops.findIndex(s => s.id === stopId);
    if (index <= 0) return;
    const newStops = [...day.stops];
    const [movedItem] = newStops.splice(index, 1);
    newStops.splice(index - 1, 0, movedItem);
    onUpdateStops(day.dayNumber, newStops);
  };

  const handleMoveDown = (stopId) => {
    const index = day.stops.findIndex(s => s.id === stopId);
    if (index < 0 || index >= day.stops.length - 1) return;
    const newStops = [...day.stops];
    const [movedItem] = newStops.splice(index, 1);
    newStops.splice(index + 1, 0, movedItem);
    onUpdateStops(day.dayNumber, newStops);
  };

  const handleDelete = (stopId) => {
    const newStops = day.stops.filter(s => s.id !== stopId);
    onUpdateStops(day.dayNumber, newStops);
  };

  const handleAddStop = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newStopObj = {
      id: `custom-stop-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime.trim() || 'Flexible Time',
      category: newCategory,
      description: newDescription.trim() || 'Custom added activity.',
      location: destination || '',
      estimatedCost: 'Free'
    };

    onUpdateStops(day.dayNumber, [...day.stops, newStopObj]);
    setNewTitle('');
    setNewTime('');
    setNewDescription('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      {/* Day Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-sm">
            {day.dayNumber}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-snug">
              {day.title}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {day.stops.length} {day.stops.length === 1 ? 'Stop' : 'Stops'} planned
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stop</span>
        </button>
      </div>

      {/* Add Custom Stop Form */}
      {isAdding && (
        <form onSubmit={handleAddStop} className="p-4 bg-slate-50 border border-indigo-100 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">New Activity</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Activity / Place title *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Time (e.g., 02:00 PM)"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Sightseeing">Sightseeing</option>
              <option value="Food">Food</option>
              <option value="Culture">Culture</option>
              <option value="Relaxation">Relaxation</option>
              <option value="Shopping">Shopping</option>
              <option value="Adventure">Adventure</option>
            </select>
            <input
              type="text"
              placeholder="Short description / tips"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
            >
              Save Stop
            </button>
          </div>
        </form>
      )}

      {/* List of Stops */}
      {day.stops.length === 0 ? (
        <div className="py-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl text-xs">
          No stops planned for this day. Click "Add Stop" to create one!
        </div>
      ) : (
        <div className="space-y-3">
          {day.stops.map((stop, index) => (
            <StopItem
              key={stop.id}
              stop={stop}
              destination={destination}
              currency={currency}
              isFirst={index === 0}
              isLast={index === day.stops.length - 1}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
