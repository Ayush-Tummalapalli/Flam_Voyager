'use client';

import { useState } from 'react';
import { Briefcase, CheckSquare, Square, Plus, FileText, Shirt, Zap, ShieldCheck } from 'lucide-react';

export default function PackingChecklist({ packingChecklist, destination }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('essentials');

  if (!packingChecklist) return null;

  const categories = [
    { key: 'documents', label: 'Documents', icon: FileText, items: packingChecklist.documents || [] },
    { key: 'clothing', label: 'Clothing', icon: Shirt, items: packingChecklist.clothing || [] },
    { key: 'electronics', label: 'Electronics', icon: Zap, items: packingChecklist.electronics || [] },
    { key: 'essentials', label: 'Essentials', icon: ShieldCheck, items: packingChecklist.essentials || [] }
  ];

  // Calculate total item count and packed count
  let totalItems = 0;
  let packedItems = 0;

  categories.forEach(cat => {
    cat.items.forEach(item => {
      totalItems++;
      if (checkedItems[item]) packedItems++;
    });
  });

  customItems.forEach(item => {
    totalItems++;
    if (checkedItems[item]) packedItems++;
  });

  const progressPercent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const toggleItem = (itemText) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }));
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setCustomItems(prev => [...prev, newItemText.trim()]);
    setNewItemText('');
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          <span>Interactive AI Packing Checklist for {destination}</span>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700">
          <span>{packedItems} of {totalItems} items packed ({progressPercent}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Items Grid for Active Category */}
      <div className="space-y-2">
        {categories
          .filter(cat => cat.key === selectedCategory)
          .map(cat => (
            <div key={cat.key} className="space-y-2">
              {cat.items.map((item, idx) => {
                const isChecked = Boolean(checkedItems[item]);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleItem(item)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-500 line-through'
                        : 'bg-slate-50/50 border-slate-200 hover:bg-indigo-50/40 hover:border-indigo-200 text-slate-800 font-medium'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm">{item}</span>
                  </div>
                );
              })}
            </div>
          ))}

        {/* Custom Items Section if present */}
        {customItems.length > 0 && selectedCategory === 'essentials' && (
          <div className="pt-2 space-y-2 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Custom Added Items</span>
            {customItems.map((item, idx) => {
              const isChecked = Boolean(checkedItems[item]);
              return (
                <div
                  key={idx}
                  onClick={() => toggleItem(item)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-500 line-through'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-indigo-50/40 text-slate-800 font-medium'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm">{item}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddCustomItem} className="flex gap-2 pt-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add your own custom packing item..."
          className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!newItemText.trim()}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </form>
    </div>
  );
}
