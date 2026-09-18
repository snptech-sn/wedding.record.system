import React, { useState, useEffect, useRef } from 'react';
import { AppUser } from '../types';
import {
  ShieldAlert,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Delete,
  ArrowLeft,
  KeySquare,
} from 'lucide-react';
import { DEFAULT_ADMIN_PIN, validateAdminPin } from '../utils/userStorage';

export type PinModalAction = 'SWITCH_USER' | 'OPEN_ADMIN_PANEL' | 'CHANGE_PIN_ONLY';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminUser: AppUser;
  actionType: PinModalAction;
  onSuccess: () => void;
  onChangePin: (adminId: string, newPin: string) => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  adminUser,
  actionType,
  onSuccess,
  onChangePin,
}) => {
  const [mode, setMode] = useState<'VERIFY' | 'CHANGE'>('VERIFY');
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Change PIN state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showChangePins, setShowChangePins] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setErrorMsg('');
      setSuccessMsg('');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      if (actionType === 'CHANGE_PIN_ONLY') {
        setMode('CHANGE');
      } else {
        setMode('VERIFY');
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, actionType]);

  if (!isOpen) return null;

  const handleKeypadPress = (val: string) => {
    setErrorMsg('');
    if (pinInput.length < 8) {
      setPinInput((prev) => prev + val);
    }
  };

  const handleKeypadBackspace = () => {
    setErrorMsg('');
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setErrorMsg('');
    setPinInput('');
  };

  const handleVerifySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!pinInput.trim()) {
      setErrorMsg('សូមបញ្ចូលលេខកូដសម្ងាត់ PIN');
      inputRef.current?.focus();
      return;
    }

    const isValid = validateAdminPin(adminUser, pinInput);
    if (isValid) {
      onSuccess();
    } else {
      setErrorMsg('លេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ! សូមសាកល្បងម្តងទៀត');
      setPinInput('');
      inputRef.current?.focus();
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // If current pin is set on user, verify current pin
    const userPin = adminUser.pin?.trim() || DEFAULT_ADMIN_PIN;
    if (currentPin.trim() !== userPin) {
      setErrorMsg('លេខកូដសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវទេ!');
      return;
    }

    if (!newPin.trim() || newPin.trim().length < 4) {
      setErrorMsg('លេខកូដសម្ងាត់ថ្មីត្រូវតែមានយ៉ាងតិច ៤ ខ្ទង់');
      return;
    }

    if (newPin.trim().length > 8) {
      setErrorMsg('លេខកូដសម្ងាត់ថ្មីមិនអាចលើសពី ៨ ខ្ទង់ឡើយ');
      return;
    }

    if (newPin.trim() !== confirmPin.trim()) {
      setErrorMsg('លេខកូដសម្ងាត់ថ្មី និងការបញ្ជាក់មិនដូចគ្នាទេ!');
      return;
    }

    onChangePin(adminUser.id, newPin.trim());
    setSuccessMsg('បានប្តូរលេខកូដសម្ងាត់ Admin ជោគជ័យ!');
    setTimeout(() => {
      if (actionType === 'CHANGE_PIN_ONLY') {
        onClose();
      } else {
        setMode('VERIFY');
        setPinInput(newPin.trim());
        setSuccessMsg('លេខកូដថ្មីរួចរាល់ សូមចុច "ចូលប្រើ"');
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 my-auto flex flex-col transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-amber-700 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {mode === 'VERIFY' ? 'ផ្ទៀងផ្ទាត់លេខកូដសម្ងាត់ Admin' : 'ប្តូរលេខកូដសម្ងាត់ Admin'}
              </h3>
              <p className="text-[11px] text-rose-100/90 leading-tight">
                {mode === 'VERIFY'
                  ? 'តម្រូវឱ្យបញ្ចូលលេខកូដសម្ងាត់ជាដាច់ខាត'
                  : 'កំណត់លេខកូដថ្មីតាមតម្រូវការ'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="បិទផ្ទាំង"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Target User Info Badge */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              <Lock className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {adminUser.fullName}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="px-1.5 py-0.2 rounded font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                  {adminUser.roleLabel || 'Admin កំពូល'}
                </span>
                <span>@{adminUser.username}</span>
              </div>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {mode === 'VERIFY' ? (
            /* VERIFY PIN FORM */
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  បញ្ចូលលេខកូដ PIN សម្ងាត់ (៤ ដល់ ៨ ខ្ទង់)
                </label>
                <div className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    placeholder="••••"
                    value={pinInput}
                    onChange={(e) => {
                      setErrorMsg('');
                      setPinInput(e.target.value.replace(/\D/g, ''));
                    }}
                    className="w-full text-center tracking-[0.4em] font-mono text-xl sm:text-2xl py-2.5 px-10 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-slate-900 dark:text-white font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                    title={showPin ? 'លាក់លេខកូដ' : 'បង្ហាញលេខកូដ'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                  <span>លេខកូដលំនាំដើម: <strong className="text-rose-600 dark:text-rose-400 font-mono">1234</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('CHANGE');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>ប្តូរលេខកូដសម្ងាត់?</span>
                  </button>
                </div>
              </div>

              {/* Numeric Touch Keypad for Tablet & Mobile Convenience */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadPress(digit)}
                    className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-base text-slate-800 dark:text-slate-200 transition-all active:scale-95 cursor-pointer shadow-2xs border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleKeypadClear}
                  className="h-10 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-xs text-slate-500 dark:text-slate-400 transition-all active:scale-95 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                  title="លុបទាំងអស់"
                >
                  <RotateCcw className="w-3.5 h-3.5 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-base text-slate-800 dark:text-slate-200 transition-all active:scale-95 cursor-pointer shadow-2xs border border-slate-200/60 dark:border-slate-700/60"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleKeypadBackspace}
                  className="h-10 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-xs text-slate-600 dark:text-slate-300 transition-all active:scale-95 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                  title="លុបថយក្រោយ"
                >
                  <Delete className="w-4 h-4 mx-auto" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-9.5 px-4 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="flex-1 h-9.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-xl transition-all shadow-sm shadow-rose-200 dark:shadow-none active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>ផ្ទៀងផ្ទាត់ & ចូល</span>
                </button>
              </div>
            </form>
          ) : (
            /* CHANGE PIN FORM */
            <form onSubmit={handleChangePinSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setMode('VERIFY');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ត្រឡប់ទៅផ្ទៀងផ្ទាត់</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePins(!showChangePins)}
                  className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 cursor-pointer font-medium"
                >
                  {showChangePins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showChangePins ? 'លាក់លេខកូដ' : 'បង្ហាញលេខកូដ'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  លេខកូដសម្ងាត់បច្ចុប្បន្ន (Current PIN)
                </label>
                <input
                  type={showChangePins ? 'text' : 'password'}
                  maxLength={8}
                  placeholder="ឧ. 1234"
                  value={currentPin}
                  onChange={(e) => {
                    setErrorMsg('');
                    setCurrentPin(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  លេខកូដសម្ងាត់ថ្មី (New PIN - ៤ ដល់ ៨ ខ្ទង់)
                </label>
                <input
                  type={showChangePins ? 'text' : 'password'}
                  maxLength={8}
                  placeholder="បញ្ចូលលេខសម្ងាត់ថ្មី"
                  value={newPin}
                  onChange={(e) => {
                    setErrorMsg('');
                    setNewPin(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ផ្ទៀងផ្ទាត់លេខកូដថ្មី (Confirm New PIN)
                </label>
                <input
                  type={showChangePins ? 'text' : 'password'}
                  maxLength={8}
                  placeholder="បញ្ចូលលេខសម្ងាត់ថ្មីម្តងទៀត"
                  value={confirmPin}
                  onChange={(e) => {
                    setErrorMsg('');
                    setConfirmPin(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (actionType === 'CHANGE_PIN_ONLY') {
                      onClose();
                    } else {
                      setMode('VERIFY');
                    }
                  }}
                  className="flex-1 h-9.5 px-4 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="flex-1 h-9.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl transition-all shadow-sm shadow-emerald-200 dark:shadow-none active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <KeySquare className="w-3.5 h-3.5" />
                  <span>រក្សាទុកលេខកូដថ្មី</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
