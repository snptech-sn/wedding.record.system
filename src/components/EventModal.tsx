import React, { useState, useEffect } from 'react';
import { EventItem, EventType } from '../types';
import { EVENT_TYPE_LABELS } from '../utils/formatters';
import { X, Calendar, MapPin, User, FileText, Sparkles, Heart, Cake, Home } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<EventItem, 'id'>) => void;
  initialData?: EventItem | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('WEDDING');
  const [date, setDate] = useState('');
  const [hostName, setHostName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setEventType(initialData.eventType);
      setDate(initialData.date);
      setHostName(initialData.hostName);
      setLocation(initialData.location || '');
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setEventType('WEDDING');
      setDate(new Date().toISOString().slice(0, 10));
      setHostName('');
      setLocation('');
      setNotes('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('សូមបញ្ចូលឈ្មោះកម្មវិធី / ពិធី');
      return;
    }
    if (!hostName.trim()) {
      setError('សូមបញ្ចូលឈ្មោះម្ចាស់កម្មវិធី');
      return;
    }
    if (!date) {
      setError('សូមជ្រើសរើសកាលបរិច្ឆេទកម្មវិធី');
      return;
    }

    onSave({
      title: title.trim(),
      eventType,
      date,
      hostName: hostName.trim(),
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'WEDDING':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'BIRTHDAY':
        return <Cake className="w-4 h-4 text-amber-500" />;
      case 'HOUSEWARMING':
        return <Home className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {initialData ? 'កែប្រែព័ត៌មានកម្មវិធី' : 'បង្កើតកម្មវិធី ឬ ពិធីថ្មី'}
            </h2>
            <p className="text-xs text-rose-100 mt-0.5">
              មង្គលការ, ខួបកំណើត, ឡើងគេហដ្ឋាន ឬ ព្រឹត្តិការណ៍ពិសេស
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Event Type Grid Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              ប្រភេទកម្មវិធី <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((type) => {
                const isSelected = eventType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setEventType(type);
                      if (!title || title.startsWith('ពិធី')) {
                        if (type === 'WEDDING') setTitle('ពិធីមង្គលការ ');
                        else if (type === 'BIRTHDAY') setTitle('ពិធីខួបកំណើត ');
                        else if (type === 'HOUSEWARMING') setTitle('ពិធីឡើងគេហដ្ឋានថ្មី ');
                        else setTitle('កម្មវិធី ');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {getEventIcon(type)}
                    <span>{EVENT_TYPE_LABELS[type].label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <span>ឈ្មោះកម្មវិធី / ពិធី</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ឧទាហរណ៍: ពិធីមង្គលការ សុខា & ចរិយា"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Host Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-500" />
              <span>ម្ចាស់កម្មវិធី (កូនកំលោះ-ក្រមុំ ឬ ម្ចាស់ផ្ទះ)</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="ឧទាហរណ៍: លោក សុខា & អ្នកនាង ចរិយា"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>កាលបរិច្ឆេទប្រារព្ធពិធី</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-slate-900 dark:text-white"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>ទីតាំងប្រារព្ធពិធី (បើមាន)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ឧ. មជ្ឈមណ្ឌលកោះពេជ្រ អគារ G ឬ គេហដ្ឋានផ្ទាល់"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>កំណត់សម្គាល់បន្ថែម</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ព័ត៌មានលម្អិតផ្សេងៗ..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-xl transition-all shadow-sm shadow-rose-200 dark:shadow-none"
            >
              {initialData ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតកម្មវិធី'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
