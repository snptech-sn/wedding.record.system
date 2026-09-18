import React, { useState, useEffect } from 'react';
import { Currency, GiftRecord, PaymentMethod, PaymentStatus } from '../types';
import { RELATIONSHIP_OPTIONS } from '../utils/formatters';
import { X, Check, DollarSign, Coins, User, Phone, MapPin, FileText, Smartphone, Banknote, Mail } from 'lucide-react';

interface GiftFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (giftData: Omit<GiftRecord, 'id' | 'eventId' | 'recordedAt'>) => void;
  initialData?: GiftRecord | null;
  eventId: string;
}

const QUICK_AMOUNTS_USD = [20, 30, 50, 100, 150, 200, 300, 500];
const QUICK_AMOUNTS_KHR = [50000, 100000, 150000, 200000, 300000, 400000, 500000];

export const GiftFormModal: React.FC<GiftFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIP_OPTIONS[0]);
  const [customRelationship, setCustomRelationship] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [amount, setAmount] = useState<number | ''>(50);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [status, setStatus] = useState<PaymentStatus>('PAID');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setGuestName(initialData.guestName);
      setPhone(initialData.phone || '');
      if (RELATIONSHIP_OPTIONS.includes(initialData.relationship)) {
        setRelationship(initialData.relationship);
        setCustomRelationship('');
      } else {
        setRelationship('ផ្សេងៗ');
        setCustomRelationship(initialData.relationship);
      }
      setTableNumber(initialData.tableNumber || '');
      setAmount(initialData.amount);
      setCurrency(initialData.currency);
      setStatus(initialData.status);
      setPaymentMethod(initialData.paymentMethod);
      setNotes(initialData.notes || '');
    } else {
      setGuestName('');
      setPhone('');
      setRelationship(RELATIONSHIP_OPTIONS[2]); // សាច់ញាតិ / បងប្អូន
      setCustomRelationship('');
      setTableNumber('');
      setAmount(50);
      setCurrency('USD');
      setStatus('PAID');
      setPaymentMethod('CASH');
      setNotes('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('សូមបញ្ចូលឈ្មោះភ្ញៀវកិត្តិយស');
      return;
    }
    if (typeof amount !== 'number' || amount <= 0) {
      setError('សូមបញ្ចូលចំនួនទឹកប្រាក់ដែលត្រឹមត្រូវ');
      return;
    }

    const finalRelationship = relationship === 'ផ្សេងៗ' && customRelationship.trim()
      ? customRelationship.trim()
      : relationship;

    onSave({
      guestName: guestName.trim(),
      phone: phone.trim() || undefined,
      relationship: finalRelationship,
      tableNumber: tableNumber.trim() || undefined,
      amount,
      currency,
      status,
      paymentMethod,
      notes: notes.trim() || undefined,
    });
  };

  const handleCurrencyChange = (newCurr: Currency) => {
    setCurrency(newCurr);
    if (newCurr === 'KHR' && (typeof amount !== 'number' || amount <= 500)) {
      setAmount(100000);
    } else if (newCurr === 'USD' && (typeof amount !== 'number' || amount >= 5000)) {
      setAmount(50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95">
        
        {/* Header with Cambodian festive motif */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {initialData ? 'កែប្រែព័ត៌មានចំណងដៃ' : 'កត់ត្រាចំណងដៃថ្មី'}
            </h2>
            <p className="text-xs text-rose-100 mt-0.5">
              បញ្ចូលព័ត៌មានភ្ញៀវ ចំនួនទឹកប្រាក់ និងវិធីសាស្ត្របង់ប្រាក់
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Guest Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>ឈ្មោះភ្ញៀវកិត្តិយស <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                setError('');
              }}
              placeholder="ឧទាហរណ៍: លោក សុខ សុផល, អ្នកមីង ផល្លា..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Currency & Amount Selection */}
          <div className="bg-slate-50/70 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                ចំនួនទឹកប្រាក់ <span className="text-rose-500">*</span>
              </label>

              {/* Currency Toggle */}
              <div className="inline-flex rounded-lg bg-slate-200/70 dark:bg-slate-700 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleCurrencyChange('USD')}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                    currency === 'USD'
                      ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>ដុល្លារ ($)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCurrencyChange('KHR')}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                    currency === 'KHR'
                      ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>ប្រាក់រៀល (៛)</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                required
                min="0"
                step={currency === 'USD' ? '1' : '1000'}
                value={amount}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  setAmount(val);
                }}
                className="w-full pl-10 pr-16 py-2.5 text-lg font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                placeholder="0"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold">
                {currency === 'USD' ? '$' : '៛'}
              </span>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                {currency}
              </span>
            </div>

            {/* Quick Amount Chips */}
            <div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                ជ្រើសរើសទឹកប្រាក់លឿន:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(currency === 'USD' ? QUICK_AMOUNTS_USD : QUICK_AMOUNTS_KHR).map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
                      amount === amt
                        ? 'bg-rose-600 border-rose-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {currency === 'USD' ? `$${amt}` : `${(amt / 1000).toLocaleString()}ពាន់៛`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Payment Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ស្ថានភាពនៃការបង់ប្រាក់
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setStatus('PAID')}
                  className={`py-2 px-2.5 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    status === 'PAID'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 font-semibold ring-1 ring-emerald-400'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>បានទទួល</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('PENDING')}
                  className={`py-2 px-2.5 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    status === 'PENDING'
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-300 font-semibold ring-1 ring-amber-400'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>រង់ចាំ/ជំពាក់</span>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                វិធីសាស្ត្របង់ប្រាក់
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="CASH">សាច់ប្រាក់សុទ្ធ (Cash)</option>
                <option value="TRANSFER">ផ្ទេរតាមធនាគារ (Bakong/ABA)</option>
                <option value="ENVELOPE">ស្រោមសំបុត្រផ្ទាល់</option>
              </select>
            </div>
          </div>

          {/* Relationship / Group */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              ទំនាក់ទំនង / ក្រុមភ្ញៀវ
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 dark:text-slate-200 font-medium"
            >
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {relationship === 'ផ្សេងៗ' && (
              <input
                type="text"
                value={customRelationship}
                onChange={(e) => setCustomRelationship(e.target.value)}
                placeholder="សូមបញ្ជាក់ទំនាក់ទំនងជាក់លាក់..."
                className="mt-2 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            )}
          </div>

          {/* Phone & Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>លេខទូរស័ព្ទ (បើមាន)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="ឧ. 012 345 678"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>លេខតុ / កន្លែងអង្គុយ</span>
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="ឧ. តុ ០៥, តុ VIP..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>ចំណាំបន្ថែម</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ឧ. មកជាមួយគ្រួសារ, ចងដៃតបស្នងកាលពីមុន, ផ្ញើតាមមិត្តភក្តិ..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Modal Actions */}
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
              {initialData ? 'រក្សាទុកការកែប្រែ' : 'កត់ត្រាចំណងដៃ'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
