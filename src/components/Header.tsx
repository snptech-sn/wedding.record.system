import React, { useState } from 'react';
import { AllTimeStats, EventItem, AppUser } from '../types';
import { EVENT_TYPE_LABELS, formatCurrency, formatDateKhmer } from '../utils/formatters';
import { ThemeMode } from '../utils/theme';
import {
  Calendar,
  ChevronDown,
  Download,
  Heart,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  MapPin,
  User,
  TrendingUp,
  Sun,
  Moon,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MoreVertical,
  Sliders,
} from 'lucide-react';

interface HeaderProps {
  events: EventItem[];
  currentEvent: EventItem | null;
  allTimeStats: AllTimeStats;
  theme: ThemeMode;
  currentUser: AppUser | null;
  users: AppUser[];
  onToggleTheme: () => void;
  onSelectEvent: (eventId: string) => void;
  onOpenNewEventModal: () => void;
  onOpenEditEventModal: () => void;
  onOpenNewGiftModal: () => void;
  onOpenPrintView: () => void;
  onExportCSV: () => void;
  onResetSampleData: () => void;
  onOpenAllTimeSummary: () => void;
  onOpenAdminModal: () => void;
  onSwitchUser: (userId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  events,
  currentEvent,
  allTimeStats,
  theme,
  currentUser,
  users,
  onToggleTheme,
  onSelectEvent,
  onOpenNewEventModal,
  onOpenEditEventModal,
  onOpenNewGiftModal,
  onOpenPrintView,
  onExportCSV,
  onResetSampleData,
  onOpenAllTimeSummary,
  onOpenAdminModal,
  onSwitchUser,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const eventTypeMeta = currentEvent
    ? EVENT_TYPE_LABELS[currentEvent.eventType] || EVENT_TYPE_LABELS.OTHER
    : EVENT_TYPE_LABELS.OTHER;

  const canManageEvents = currentUser?.permissions.canManageEvents ?? true;
  const canCreateGift = currentUser?.permissions.canCreateGift ?? true;
  const canExportPrint = currentUser?.permissions.canExportPrint ?? true;
  const canViewStats = currentUser?.permissions.canViewStats ?? true;
  const canManageUsers = currentUser?.permissions.canManageUsers ?? (currentUser?.role === 'ADMIN');

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-rose-100/80 dark:border-slate-800 shadow-xs sticky top-0 z-30 transition-colors duration-200">
      {/* Top golden-rose accent line */}
      <div className="h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 w-full" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          
          {/* Left Column: Brand & Event Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-rose-200 dark:shadow-none shrink-0">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  កម្មវិធីគ្រប់គ្រងចំណងដៃ
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  កត់ត្រាភ្ញៀវកិត្តិយស ទឹកប្រាក់ និងកំណត់សិទ្ធិប្រើប្រាស់
                </p>
              </div>
            </div>

            {/* Event Dropdown */}
            {currentEvent && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100/70 dark:hover:bg-rose-900/50 border border-rose-200/80 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  <span className="max-w-[140px] sm:max-w-[200px] truncate font-semibold">
                    {currentEvent.title}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-700 dark:text-rose-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute left-0 mt-1.5 w-76 sm:w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span>ជ្រើសរើសកម្មវិធី</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{events.length} កម្មវិធី</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto py-1">
                        {events.map((evt) => {
                          const meta = EVENT_TYPE_LABELS[evt.eventType];
                          const isSelected = evt.id === currentEvent.id;
                          return (
                            <button
                              key={evt.id}
                              type="button"
                              onClick={() => {
                                onSelectEvent(evt.id);
                                setDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm flex items-start gap-2.5 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-50/80 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 font-medium'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                <span className={`inline-block px-1.5 py-0.5 text-[10px] rounded border ${meta.bg}`}>
                                  {meta.label}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="truncate font-semibold text-slate-900 dark:text-white">
                                  {evt.title}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                  {formatDateKhmer(evt.date)}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            onOpenAllTimeSummary();
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>មើលរបាយការណ៍សរុបគ្រប់កម្មវិធី ({allTimeStats.totalEvents})</span>
                        </button>
                        {canManageEvents && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setDropdownOpen(false);
                                onOpenNewEventModal();
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              បង្កើតកម្មវិធីថ្មី (មង្គលការ, ខួបកំណើត...)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDropdownOpen(false);
                                onOpenEditEventModal();
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              កែប្រែព័ត៌មានកម្មវិធីបច្ចុប្បន្ន
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Clean, Grouped & Beautifully Organized Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            
            {/* Group 1: All-Time Summary Stat Quick Pill */}
            <button
              type="button"
              onClick={onOpenAllTimeSummary}
              title="ចុចដើម្បីមើលរបាយការណ៍សរុបគ្រប់កម្មវិធីទាំងអស់"
              className="inline-flex items-center gap-1.5 sm:gap-2 h-9 px-2.5 sm:px-3 text-xs font-medium text-slate-800 dark:text-slate-200 bg-amber-50/90 dark:bg-amber-950/30 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 border border-amber-200/90 dark:border-amber-800/60 rounded-xl transition-all shadow-2xs group cursor-pointer active:scale-98"
            >
              <div className="w-5 h-5 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-semibold text-amber-900 dark:text-amber-300 hidden xl:inline">សរុប:</span>
                {canViewStats ? (
                  <>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(allTimeStats.totalPaidUSD, 'USD')}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">{formatCurrency(allTimeStats.totalPaidKHR, 'KHR')}</span>
                  </>
                ) : (
                  <span className="font-medium text-slate-400">*** (Lock)</span>
                )}
              </div>
            </button>

            {/* Group 2: Tools & Export (Desktop Segmented Toolbar) */}
            <div className="hidden sm:inline-flex items-center h-9 p-0.5 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs">
              {canExportPrint && (
                <>
                  <button
                    type="button"
                    onClick={onOpenPrintView}
                    title="បោះពុម្ពសៀវភៅចំណងដៃ"
                    className="inline-flex items-center gap-1.5 h-full px-2.5 py-1 font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700/80 rounded-lg transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span className="hidden md:inline">បោះពុម្ព</span>
                  </button>
                  <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />
                  <button
                    type="button"
                    onClick={onExportCSV}
                    title="ទាញយកជាឯកសារ Excel / CSV"
                    className="inline-flex items-center gap-1.5 h-full px-2.5 py-1 font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700/80 rounded-lg transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="hidden md:inline">Excel</span>
                  </button>
                  <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />
                </>
              )}
              <button
                type="button"
                onClick={onResetSampleData}
                title="ផ្ទុកទិន្នន័យគំរូឡើងវិញ"
                className="inline-flex items-center gap-1.5 h-full px-2 py-1 font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700/80 rounded-lg transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">គំរូ</span>
              </button>
            </div>

            {/* Mobile Tools Overflow Menu Button */}
            <div className="relative sm:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center w-9 h-9 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
                title="ឧបករណ៍ & ទាញយក"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {mobileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 text-xs">
                    {canExportPrint && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onOpenPrintView();
                          }}
                          className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                        >
                          <Printer className="w-4 h-4 text-slate-500" />
                          <span>បោះពុម្ពសៀវភៅចំណងដៃ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onExportCSV();
                          }}
                          className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                        >
                          <Download className="w-4 h-4 text-emerald-600" />
                          <span>ទាញយក Excel / CSV</span>
                        </button>
                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onResetSampleData();
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>ផ្ទុកទិន្នន័យគំរូឡើងវិញ</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Group 3: User Profile Switcher & Role */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="inline-flex items-center gap-1.5 h-9 px-2 sm:px-2.5 text-xs font-medium bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer text-slate-800 dark:text-slate-200 shadow-2xs"
                title="ប្តូរគណនី ឬ មើលសិទ្ធិប្រើប្រាស់"
              >
                <div className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 text-white shadow-2xs ${
                  currentUser?.role === 'ADMIN'
                    ? 'bg-rose-600'
                    : currentUser?.role === 'RECORDER'
                    ? 'bg-blue-600'
                    : currentUser?.role === 'VIEWER'
                    ? 'bg-emerald-600'
                    : 'bg-purple-600'
                }`}>
                  {currentUser?.role === 'ADMIN' ? (
                    <Shield className="w-3 h-3" />
                  ) : (
                    currentUser?.fullName?.charAt(0) || 'U'
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold leading-none text-slate-900 dark:text-white max-w-[100px] truncate text-xs">
                    {currentUser?.fullName || 'អ្នកប្រើប្រាស់'}
                  </div>
                  <div className="text-[9.5px] text-rose-600 dark:text-rose-400 font-medium leading-none mt-0.5 truncate">
                    {currentUser?.roleLabel || currentUser?.role || 'សិទ្ធិ'}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Switcher Dropdown */}
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-76 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                    {/* Active User Header */}
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase">
                        គណនីបច្ចុប្បន្ន
                      </div>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-2xs ${
                          currentUser?.role === 'ADMIN'
                            ? 'bg-rose-600'
                            : currentUser?.role === 'RECORDER'
                            ? 'bg-blue-600'
                            : currentUser?.role === 'VIEWER'
                            ? 'bg-emerald-600'
                            : 'bg-purple-600'
                        }`}>
                          {currentUser?.role === 'ADMIN' ? (
                            <Shield className="w-4 h-4" />
                          ) : (
                            currentUser?.fullName?.charAt(0) || 'U'
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                            {currentUser?.fullName}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                              {currentUser?.roleLabel || currentUser?.role}
                            </span>
                            <span className="text-[10px] text-slate-400">@{currentUser?.username}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Permissions quick pills */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1 text-[10px]">
                        {currentUser?.permissions.canCreateGift && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium">
                            + កត់ចំណងដៃ
                          </span>
                        )}
                        {currentUser?.permissions.canEditGift && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-medium">
                            ✓ កែប្រែ
                          </span>
                        )}
                        {currentUser?.permissions.canDeleteGift && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-medium">
                            ✕ លុប
                          </span>
                        )}
                        {currentUser?.permissions.canViewStats && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-medium">
                            $ មើលចំណូល
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Switch User List */}
                    <div className="px-3.5 py-1.5 text-[11px] text-slate-400 font-semibold uppercase">
                      ប្តូរអ្នកប្រើប្រាស់ ({users.length})
                    </div>
                    <div className="max-h-44 overflow-y-auto px-1.5">
                      {users.map((u) => {
                        const isCurrent = u.id === currentUser?.id;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              onSwitchUser(u.id);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 font-semibold'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                                u.role === 'ADMIN'
                                  ? 'bg-rose-600'
                                  : u.role === 'RECORDER'
                                  ? 'bg-blue-600'
                                  : u.role === 'VIEWER'
                                  ? 'bg-emerald-600'
                                  : 'bg-purple-600'
                              }`}>
                                {u.fullName.charAt(0)}
                              </span>
                              <span className="truncate">{u.fullName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                {u.roleLabel || u.role}
                              </span>
                              {u.pin && <Lock className="w-3 h-3 text-amber-500" />}
                              {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Admin Panel button */}
                    <div className="p-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenAdminModal();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100/70 dark:hover:bg-rose-900/50 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-rose-600" />
                          <span>គ្រប់គ្រងសិទ្ធិ & អ្នកប្រើ (Admin Panel)</span>
                        </div>
                        <Sliders className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Group 4: Admin Panel Quick Access Button */}
            <button
              type="button"
              onClick={onOpenAdminModal}
              title="កំណត់សិទ្ធិ & គ្រប់គ្រងអ្នកប្រើ (Admin Panel)"
              className={`inline-flex items-center gap-1.5 h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 ${
                canManageUsers
                  ? 'bg-rose-50/90 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/60'
                  : 'bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span className="hidden lg:inline">Admin</span>
            </button>

            {/* Group 5: Theme Mode Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'ប្តូរទៅ Light Mode (សម្រាប់ពេលថ្ងៃ)' : 'ប្តូរទៅ Dark Mode (សម្រាប់ពេលយប់)'}
              aria-label="Toggle dark mode"
              className="inline-flex items-center justify-center w-9 h-9 text-slate-600 dark:text-amber-400 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Group 6: Primary CTA - New Gift Entry */}
            {canCreateGift && (
              <button
                type="button"
                onClick={onOpenNewGiftModal}
                className="inline-flex items-center gap-1.5 sm:gap-2 h-9 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-xl transition-all shadow-sm shadow-rose-200 dark:shadow-none active:scale-98 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="whitespace-nowrap">កត់ចំណងដៃ</span>
              </button>
            )}

          </div>
        </div>

        {/* Current Event Context Banner */}
        {currentEvent && (
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-y-1.5">
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1">
              <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                <User className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-none">ម្ចាស់កម្មវិធី: {currentEvent.hostName}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{formatDateKhmer(currentEvent.date)}</span>
              </div>
              {currentEvent.location && (
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hidden md:flex">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate max-w-xs">{currentEvent.location}</span>
                </div>
              )}
            </div>
            <div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium border ${eventTypeMeta.bg}`}>
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>{eventTypeMeta.label}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};


