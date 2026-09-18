import React, { useState } from 'react';
import { AppUser, UserPermissions, UserRole } from '../types';
import {
  PERMISSION_DEFINITIONS,
  getRoleDefaultPermissions,
} from '../utils/userStorage';
import {
  ShieldCheck,
  UserPlus,
  Users,
  Edit2,
  Trash2,
  X,
  Check,
  Lock,
  KeyRound,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Eye,
  Settings,
  ArrowRight,
} from 'lucide-react';

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AppUser[];
  currentUser: AppUser;
  onSaveUser: (user: AppUser) => void;
  onDeleteUser: (userId: string) => void;
  onSwitchUser: (userId: string, enteredPin?: string) => boolean;
  onOpenChangePin?: (adminUser: AppUser) => void;
}

const ROLE_PRESET_OPTIONS: { role: UserRole; label: string; desc: string; badge: string }[] = [
  {
    role: 'ADMIN',
    label: 'អ្នកគ្រប់គ្រង (Admin)',
    desc: 'មានសិទ្ធិពេញលេញគ្រប់គ្រងកម្មវិធី របាយការណ៍ និងអ្នកប្រើដទៃ',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  },
  {
    role: 'RECORDER',
    label: 'អ្នកកត់ត្រា (Recorder)',
    desc: 'អាចកត់ត្រា កែប្រែ និងប្តូរស្ថានភាពចំណងដៃ មិនអាចលុប ឬគ្រប់គ្រងអ្នកប្រើ',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800',
  },
  {
    role: 'VIEWER',
    label: 'អ្នកពិនិត្យ / មើល (Viewer)',
    desc: 'មើលបញ្ជី និងរបាយការណ៍សរុបតែប៉ុណ្ណោះ មិនអាចកត់ត្រា ឬកែប្រែទិន្នន័យ',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
  },
  {
    role: 'CUSTOM',
    label: 'ផ្ទាល់ខ្លួន (Custom)',
    desc: 'កំណត់សិទ្ធិនីមួយៗដោយខ្លួនឯងតាមតម្រូវការជាក់ស្តែង',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800',
  },
];

export const AdminUserModal: React.FC<AdminUserModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSaveUser,
  onDeleteUser,
  onSwitchUser,
  onOpenChangePin,
}) => {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('RECORDER');
  const [pin, setPin] = useState('');
  const [permissions, setPermissions] = useState<UserPermissions>(() =>
    getRoleDefaultPermissions('RECORDER')
  );
  const [formError, setFormError] = useState('');

  // PIN switch prompt state
  const [pinPromptUser, setPinPromptUser] = useState<AppUser | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  if (!isOpen) return null;

  const startCreateUser = () => {
    setEditingUserId(null);
    setIsCreating(true);
    setFullName('');
    setUsername(`user_${Date.now().toString().slice(-4)}`);
    setSelectedRole('RECORDER');
    setPin('');
    setPermissions(getRoleDefaultPermissions('RECORDER'));
    setFormError('');
  };

  const startEditUser = (u: AppUser) => {
    setIsCreating(false);
    setEditingUserId(u.id);
    setFullName(u.fullName);
    setUsername(u.username);
    setSelectedRole(u.role);
    setPin(u.pin || (u.role === 'ADMIN' ? '1234' : ''));
    setPermissions({ ...u.permissions });
    setFormError('');
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingUserId(null);
    setFormError('');
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'ADMIN' && !pin.trim()) {
      setPin('1234');
    }
    if (role !== 'CUSTOM') {
      setPermissions(getRoleDefaultPermissions(role));
    }
  };

  const togglePermission = (key: keyof UserPermissions) => {
    setPermissions((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setSelectedRole('CUSTOM');
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError('សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់');
      return;
    }
    if (!username.trim()) {
      setFormError('សូមបញ្ចូលឈ្មោះគណនី (Username)');
      return;
    }

    if (selectedRole === 'ADMIN') {
      if (!pin.trim()) {
        setFormError('គណនី Admin/អ្នកគ្រប់គ្រង តម្រូវឱ្យមានលេខកូដសម្ងាត់ (PIN) ជាដាច់ខាត!');
        return;
      }
      if (pin.trim().length < 4) {
        setFormError('លេខកូដសម្ងាត់ Admin ត្រូវតែមានយ៉ាងតិច ៤ ខ្ទង់');
        return;
      }
    }

    const roleMeta = ROLE_PRESET_OPTIONS.find((r) => r.role === selectedRole);
    const roleLabel = roleMeta ? roleMeta.label.split(' ')[0] : 'អ្នកប្រើ';

    const userToSave: AppUser = {
      id: editingUserId || `user-${Date.now()}`,
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      role: selectedRole,
      roleLabel,
      avatarColor: selectedRole === 'ADMIN' ? 'rose' : selectedRole === 'RECORDER' ? 'blue' : 'amber',
      pin: pin.trim(),
      permissions,
      createdAt: editingUserId
        ? users.find((u) => u.id === editingUserId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    };

    onSaveUser(userToSave);
    cancelEdit();
  };

  const handleSwitchClick = (u: AppUser) => {
    if (u.id === currentUser.id) return;
    if (u.pin && u.pin.length > 0) {
      setPinPromptUser(u);
      setEnteredPin('');
      setPinError('');
    } else {
      onSwitchUser(u.id);
    }
  };

  const handleConfirmPinSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinPromptUser) return;
    const success = onSwitchUser(pinPromptUser.id, enteredPin);
    if (success) {
      setPinPromptUser(null);
      setEnteredPin('');
      setPinError('');
    } else {
      setPinError('កូដ PIN មិនត្រឹមត្រូវទេ! សូមសាកល្បងម្តងទៀត');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-amber-700 px-5 sm:px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                ការកំណត់សិទ្ធិ & គ្រប់គ្រងអ្នកប្រើប្រាស់ (Admin)
              </h2>
              <p className="text-xs text-rose-100/90 hidden sm:block">
                ចាត់ចែងសិទ្ធិ គណនីអ្នកកត់ត្រា និងការការពារសុវត្ថិភាពទិន្នន័យ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/90 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Verification Sub-Modal when switching users with PIN */}
        {pinPromptUser && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs z-30 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ផ្ទៀងផ្ទាត់កូដ PIN របស់ {pinPromptUser.fullName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                គណនីនេះត្រូវបានការពារដោយកូដសម្ងាត់
                {pinPromptUser.role === 'ADMIN' && (
                  <span className="block mt-1 font-semibold text-rose-600 dark:text-rose-400">
                    (PIN គំរូដើម: 1234)
                  </span>
                )}
                {pinPromptUser.role === 'RECORDER' && pinPromptUser.pin === '0000' && (
                  <span className="block mt-1 font-semibold text-blue-600 dark:text-blue-400">
                    (PIN គំរូដើម: 0000)
                  </span>
                )}
              </p>

              <form onSubmit={handleConfirmPinSwitch} className="mt-4 space-y-3">
                {pinError && (
                  <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs rounded-xl">
                    {pinError}
                  </div>
                )}
                <input
                  type="password"
                  maxLength={8}
                  autoFocus
                  required
                  placeholder="បញ្ចូលកូដ PIN..."
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 dark:text-white"
                />
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPinPromptUser(null)}
                    className="flex-1 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs"
                  >
                    បញ្ជាក់ចូល
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Active User Notification Pill */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {currentUser.fullName.slice(0, 1)}
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>គណនីបច្ចុប្បន្នកំពុងប្រើប្រាស់:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.fullName}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    តួនាទី: {currentUser.roleLabel || currentUser.role}
                  </span>
                  {currentUser.pin && (
                    <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
                      <KeyRound className="w-3 h-3" /> មាន PIN
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentUser.role === 'ADMIN' && onOpenChangePin && (
                <button
                  type="button"
                  onClick={() => onOpenChangePin(currentUser)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/60 hover:bg-amber-200/90 rounded-xl border border-amber-300/80 dark:border-amber-800/60 transition-all cursor-pointer shadow-2xs"
                  title="ប្តូរលេខកូដសម្ងាត់ Admin តាមតម្រូវការ"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>ប្តូរលេខកូដ PIN Admin</span>
                </button>
              )}

              {!isCreating && !editingUserId && (
                <button
                  type="button"
                  onClick={startCreateUser}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>បន្ថែមអ្នកប្រើប្រាស់ថ្មី</span>
                </button>
              )}
            </div>
          </div>

          {/* Form for Creating or Editing User */}
          {(isCreating || editingUserId) && (
            <div className="bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl p-4 sm:p-5 border border-rose-200/80 dark:border-rose-900/50 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-900/40">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isCreating ? 'បង្កើតអ្នកប្រើប្រាស់ថ្មី' : `កែប្រែព័ត៌មាន & សិទ្ធិ (${fullName})`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  បិទផ្ទាំងកែប្រែ
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      ឈ្មោះពេញ (Full Name) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ឧ. សុខ វិសាល (អ្នកកត់ត្រា តុមុខ)"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      ឈ្មោះសម្គាល់គណនី (Username) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ឧ. recorder2"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {selectedRole === 'ADMIN' ? (
                        <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>កូដសម្ងាត់ PIN (ចាំបាច់ជាដាច់ខាតសម្រាប់ Admin) *</span>
                        </span>
                      ) : (
                        <span>កូដសម្ងាត់ PIN (ស្រេចចិត្ត - ៤ ខ្ទង់)</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength={8}
                        required={selectedRole === 'ADMIN'}
                        placeholder={selectedRole === 'ADMIN' ? 'ឧ. 1234 (ចាំបាច់យ៉ាងតិច ៤ ខ្ទង់)' : 'ឧ. 1234 (ទុកទទេបើមិនចង់ដាក់)'}
                        value={pin}
                        onChange={(e) => {
                          setFormError('');
                          setPin(e.target.value.replace(/\D/g, ''));
                        }}
                        className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 dark:text-white font-mono ${
                          selectedRole === 'ADMIN'
                            ? 'border-rose-300 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/20'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      />
                      <Lock className={`w-3.5 h-3.5 absolute right-3 top-3 ${selectedRole === 'ADMIN' ? 'text-rose-600' : 'text-slate-400'}`} />
                    </div>
                    <span className={`text-[10px] mt-1 block ${selectedRole === 'ADMIN' ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {selectedRole === 'ADMIN'
                        ? '⚠️ ត្រូវតែបញ្ចូលកូដនេះរាល់ពេលចូលប្រើ Admin ឬបើកផ្ទាំង Admin Panel'
                        : 'ប្រើសម្រាប់ផ្ទៀងផ្ទាត់ពេលប្តូរគណនីប្រើប្រាស់'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      គំរូតួនាទីកំណត់ជាមុន (Role Preset)
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 dark:text-white font-medium"
                    >
                      {ROLE_PRESET_OPTIONS.map((opt) => (
                        <option key={opt.role} value={opt.role}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                      ជ្រើសរើសគំរូសិទ្ធិ ឬកែប្រែប្រអប់ធីកខាងក្រោមតាមចិត្ត
                    </span>
                  </div>
                </div>

                {/* Permissions Matrix */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                      <span>តារាងកំណត់សិទ្ធិប្រើប្រាស់ជាក់ស្តែង</span>
                    </label>
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                      {Object.values(permissions).filter(Boolean).length} / {PERMISSION_DEFINITIONS.length} សិទ្ធិត្រូវបានបើក
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    {PERMISSION_DEFINITIONS.map((def) => {
                      const isChecked = !!permissions[def.key];
                      return (
                        <label
                          key={def.key}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-slate-900 dark:text-white'
                              : 'bg-slate-50/40 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(def.key)}
                            className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 dark:border-slate-700"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold leading-tight">
                              {def.label}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                              {def.description}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all"
                  >
                    {isCreating ? 'រក្សាទុកគណនីថ្មី' : 'រក្សាទុកការកែប្រែ'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* User List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-500" />
                <span>បញ្ជីអ្នកប្រើប្រាស់ក្នុងប្រព័ន្ធ ({users.length})</span>
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                ចុច "ប្តូរប្រើ" ដើម្បីផ្លាស់ប្តូរអ្នកប្រើប្រាស់ភ្លាមៗ
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {users.map((u) => {
                const isActive = u.id === currentUser.id;
                const roleMeta = ROLE_PRESET_OPTIONS.find((r) => r.role === u.role) || ROLE_PRESET_OPTIONS[3];
                const activePermCount = Object.values(u.permissions).filter(Boolean).length;

                return (
                  <div
                    key={u.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-xs'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* User Info */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          u.role === 'ADMIN'
                            ? 'bg-gradient-to-tr from-rose-600 to-amber-600 text-white'
                            : u.role === 'RECORDER'
                            ? 'bg-blue-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {u.fullName.slice(0, 1)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {u.fullName}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${roleMeta.badge}`}
                          >
                            {u.roleLabel || roleMeta.label}
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white shadow-2xs">
                              កំពុងប្រើ
                            </span>
                          )}
                          {u.pin && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500" title="មានកូដសម្ងាត់ PIN">
                              <Lock className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>គណនី: <strong className="font-mono text-slate-700 dark:text-slate-300">{u.username}</strong></span>
                          <span>•</span>
                          <span>សិទ្ធិ: <strong className="text-rose-600 dark:text-rose-400">{activePermCount}</strong>/{PERMISSION_DEFINITIONS.length}</span>
                        </div>

                        {/* Quick Permissions Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {u.permissions.canCreateGift && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 rounded">
                              + កត់ត្រាចំណងដៃ
                            </span>
                          )}
                          {u.permissions.canEditGift && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 rounded">
                              ✎ កែប្រែ
                            </span>
                          )}
                          {u.permissions.canDeleteGift && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded">
                              ✕ លុបចំណងដៃ
                            </span>
                          )}
                          {u.permissions.canManageUsers && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded font-semibold">
                              ★ Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => handleSwitchClick(u)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>ប្តូរប្រើ</span>
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 px-2 py-1 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> សកម្ម
                        </span>
                      )}

                      {u.role === 'ADMIN' && onOpenChangePin && (
                        <button
                          type="button"
                          onClick={() => onOpenChangePin(u)}
                          title="ប្តូរលេខកូដសម្ងាត់ Admin"
                          className="px-2.5 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-xl transition-all flex items-center gap-1 border border-amber-200/80 dark:border-amber-800/60 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>ប្តូរ PIN</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => startEditUser(u)}
                        title="កែប្រែសិទ្ធិអ្នកប្រើ"
                        className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {users.length > 1 && !isActive && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`តើអ្នកប្រាកដជាចង់លុបអ្នកប្រើប្រាស់ "${u.fullName}" ដែរឬទេ?`)) {
                              onDeleteUser(u.id);
                            }
                          }}
                          title="លុបអ្នកប្រើ"
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ការផ្លាស់ប្តូរសិទ្ធិនឹងត្រូវអនុវត្តភ្លាមៗទូទាំងកម្មវិធី</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-xl transition-colors shadow-2xs"
          >
            រួចរាល់
          </button>
        </div>

      </div>
    </div>
  );
};
