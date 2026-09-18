import React, { useState, useEffect, useMemo } from 'react';
import { AllTimeStats, EventItem, FilterOptions, GiftRecord, PaymentStatus, SummaryStats, AppUser } from './types';
import {
  getActiveEventId,
  getStoredEvents,
  getStoredGifts,
  resetToSampleData,
  saveStoredEvents,
  saveStoredGifts,
  setActiveEventId,
} from './utils/storage';
import {
  getStoredUsers,
  saveStoredUsers,
  getStoredCurrentUser,
  saveStoredCurrentUser,
} from './utils/userStorage';
import { exportToCSV } from './utils/formatters';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { GiftListTable } from './components/GiftListTable';
import { GiftFormModal } from './components/GiftFormModal';
import { EventModal } from './components/EventModal';
import { PrintView } from './components/PrintView';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AllTimeSummaryModal } from './components/AllTimeSummaryModal';
import { AdminUserModal } from './components/AdminUserModal';
import { ThemeMode, getInitialTheme, applyTheme } from './utils/theme';
import { CheckCircle2, Heart, Plus, Sparkles, ShieldAlert } from 'lucide-react';

export default function App() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [gifts, setGifts] = useState<GiftRecord[]>([]);
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());

  // Users & RBAC Permissions State
  const [users, setUsers] = useState<AppUser[]>([]);
  const [currentUserIdState, setCurrentUserIdState] = useState<string>('');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Apply theme effect
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modals
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftRecord | null>(null);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [isAllTimeModalOpen, setIsAllTimeModalOpen] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'GIFT' | 'EVENT';
    id: string;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'GIFT',
    id: '',
    title: '',
    message: '',
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    status: 'ALL',
    currency: 'ALL',
    relationship: 'ALL',
    sortBy: 'date_desc',
  });

  // Initial Data Load
  useEffect(() => {
    const loadedEvents = getStoredEvents();
    const currentActiveId = getActiveEventId(loadedEvents);
    const loadedGifts = getStoredGifts();
    const loadedUsers = getStoredUsers();
    const initialUser = getStoredCurrentUser(loadedUsers);

    setEvents(loadedEvents);
    setActiveId(currentActiveId);
    setGifts(loadedGifts);
    setUsers(loadedUsers);
    setCurrentUserIdState(initialUser.id);
  }, []);

  // Save changes to storage
  const handleEventsChange = (newEvents: EventItem[]) => {
    setEvents(newEvents);
    saveStoredEvents(newEvents);
  };

  const handleGiftsChange = (newGifts: GiftRecord[]) => {
    setGifts(newGifts);
    saveStoredGifts(newGifts);
  };

  const handleUsersChange = (newUsers: AppUser[]) => {
    setUsers(newUsers);
    saveStoredUsers(newUsers);
  };

  // Current active User
  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserIdState) || users[0] || null;
  }, [users, currentUserIdState]);

  // Switch User with optional PIN check (returns boolean for modal validation)
  const handleSwitchUser = (userId: string, enteredPin?: string): boolean => {
    const target = users.find((u) => u.id === userId);
    if (!target) return false;

    if (target.pin) {
      let pinInput = enteredPin;
      if (pinInput === undefined) {
        const promptVal = window.prompt(`សូមបញ្ចូលលេខសម្ងាត់ PIN (៤ខ្ទង់) សម្រាប់ «${target.fullName}»:`);
        if (promptVal === null) return false;
        pinInput = promptVal;
      }

      if (pinInput.trim() !== target.pin) {
        showToast('❌ លេខសម្ងាត់ PIN មិនត្រឹមត្រូវទេ!');
        return false;
      }
    }

    setCurrentUserIdState(userId);
    saveStoredCurrentUser(userId);
    showToast(`បានប្តូរទៅកាន់គណនី: ${target.fullName} (${target.roleLabel || target.role})`);
    return true;
  };

  // User CRUD handlers for AdminUserModal
  const handleSaveUserFromModal = (user: AppUser) => {
    const existingIndex = users.findIndex((u) => u.id === user.id);
    let updated: AppUser[];
    if (existingIndex >= 0) {
      updated = [...users];
      updated[existingIndex] = user;
      showToast(`បានកែប្រែអ្នកប្រើប្រាស់ «${user.fullName}»`);
    } else {
      updated = [...users, user];
      showToast(`បានបង្កើតអ្នកប្រើប្រាស់ថ្មី «${user.fullName}»`);
    }
    handleUsersChange(updated);
  };

  const handleDeleteUserFromModal = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    const updated = users.filter((u) => u.id !== userId);
    handleUsersChange(updated);
    if (target) {
      showToast(`បានលុបអ្នកប្រើប្រាស់ «${target.fullName}»`);
    }
    if (currentUserIdState === userId && updated.length > 0) {
      setCurrentUserIdState(updated[0].id);
      saveStoredCurrentUser(updated[0].id);
    }
  };

  // Open Admin Modal (Require Admin PIN if current user is not ADMIN)
  const handleOpenAdminModal = () => {
    if (currentUser?.permissions.canManageUsers || currentUser?.role === 'ADMIN') {
      setIsAdminModalOpen(true);
      return;
    }

    const adminUser = users.find((u) => u.role === 'ADMIN') || users[0];
    if (adminUser?.pin) {
      const enteredPin = window.prompt(`តម្រូវឱ្យមានសិទ្ធិ Admin (${adminUser.fullName})។ សូមបញ្ចូលលេខកូដសម្ងាត់ PIN:`);
      if (enteredPin === null) return;
      if (enteredPin.trim() !== adminUser.pin) {
        showToast('❌ លេខសម្ងាត់ Admin មិនត្រឹមត្រូវទេ!');
        return;
      }
    }
    setIsAdminModalOpen(true);
  };

  // Current selected event
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === activeId) || events[0] || null;
  }, [events, activeId]);

  // Current event gifts
  const currentEventGifts = useMemo(() => {
    if (!currentEvent) return [];
    return gifts.filter((g) => g.eventId === currentEvent.id);
  }, [gifts, currentEvent]);

  // Stats calculation
  const stats: SummaryStats = useMemo(() => {
    const totalGuests = currentEventGifts.length;
    let paidGuests = 0;
    let pendingGuests = 0;
    let totalUSD = 0;
    let totalKHR = 0;
    let pendingUSD = 0;
    let pendingKHR = 0;

    for (const g of currentEventGifts) {
      if (g.status === 'PAID') {
        paidGuests += 1;
        if (g.currency === 'USD') {
          totalUSD += g.amount;
        } else {
          totalKHR += g.amount;
        }
      } else {
        pendingGuests += 1;
        if (g.currency === 'USD') {
          pendingUSD += g.amount;
        } else {
          pendingKHR += g.amount;
        }
      }
    }

    return {
      totalGuests,
      paidGuests,
      pendingGuests,
      totalUSD,
      totalKHR,
      pendingUSD,
      pendingKHR,
    };
  }, [currentEventGifts]);

  // All-time summary calculation across all events and gifts
  const allTimeStats: AllTimeStats = useMemo(() => {
    let totalPaidUSD = 0;
    let totalPaidKHR = 0;
    let totalPendingUSD = 0;
    let totalPendingKHR = 0;

    const eventsBreakdown = events.map((evt) => {
      const eventGifts = gifts.filter((g) => g.eventId === evt.id);
      let paidUSD = 0;
      let paidKHR = 0;
      let pendingUSD = 0;
      let pendingKHR = 0;
      let paidGuests = 0;
      let pendingGuests = 0;

      for (const g of eventGifts) {
        if (g.status === 'PAID') {
          paidGuests += 1;
          if (g.currency === 'USD') paidUSD += g.amount;
          else paidKHR += g.amount;
        } else {
          pendingGuests += 1;
          if (g.currency === 'USD') pendingUSD += g.amount;
          else pendingKHR += g.amount;
        }
      }

      totalPaidUSD += paidUSD;
      totalPaidKHR += paidKHR;
      totalPendingUSD += pendingUSD;
      totalPendingKHR += pendingKHR;

      return {
        event: evt,
        guestsCount: eventGifts.length,
        paidGuests,
        pendingGuests,
        paidUSD,
        paidKHR,
        pendingUSD,
        pendingKHR,
      };
    });

    return {
      totalEvents: events.length,
      totalGuests: gifts.length,
      totalPaidUSD,
      totalPaidKHR,
      totalPendingUSD,
      totalPendingKHR,
      eventsBreakdown,
    };
  }, [events, gifts]);

  // Switch Event
  const handleSelectEvent = (eventId: string) => {
    setActiveId(eventId);
    setActiveEventId(eventId);
    // Reset filters on event switch
    setFilters({
      searchQuery: '',
      status: 'ALL',
      currency: 'ALL',
      relationship: 'ALL',
      sortBy: 'date_desc',
    });
  };

  // Reset to Sample Data
  const handleResetSampleData = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់ឡើងវិញនូវទិន្នន័យគំរូមែនទេ? ទិន្នន័យបច្ចុប្បន្ននឹងត្រូវបានជំនួស។')) {
      const reset = resetToSampleData();
      setEvents(reset.events);
      setActiveId(reset.events[0].id);
      setGifts(reset.gifts);
      showToast('បានកំណត់ឡើងវិញនូវទិន្នន័យគំរូរួចរាល់!');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!currentEvent) return;
    if (currentEventGifts.length === 0) {
      alert('មិនទាន់មានទិន្នន័យចំណងដៃក្នុងកម្មវិធីនេះដើម្បីទាញយកទេ');
      return;
    }
    exportToCSV(currentEventGifts, currentEvent);
    showToast('បានទាញយកបញ្ជីចំណងដៃជា CSV (Excel) រួចរាល់!');
  };

  // Save Gift (Create or Update)
  const handleSaveGift = (giftData: Omit<GiftRecord, 'id' | 'eventId' | 'recordedAt'>) => {
    if (!currentEvent) return;

    if (editingGift) {
      if (currentUser && !currentUser.permissions.canEditGift) {
        showToast('⚠️ អ្នកមិនមានសិទ្ធិកែប្រែទិន្នន័យចំណងដៃទេ');
        return;
      }
      const updated = gifts.map((g) =>
        g.id === editingGift.id
          ? {
              ...g,
              ...giftData,
            }
          : g
      );
      handleGiftsChange(updated);
      showToast(`បានកែប្រែចំណងដៃរបស់ «${giftData.guestName}» ជោគជ័យ!`);
    } else {
      if (currentUser && !currentUser.permissions.canCreateGift) {
        showToast('⚠️ អ្នកមិនមានសិទ្ធិកត់ចំណងដៃថ្មីទេ');
        return;
      }
      const newRecord: GiftRecord = {
        ...giftData,
        id: `gift-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        eventId: currentEvent.id,
        recordedAt: new Date().toISOString(),
      };
      handleGiftsChange([newRecord, ...gifts]);
      showToast(`បានកត់ត្រាចំណងដៃរបស់ «${giftData.guestName}» ជោគជ័យ!`);
    }

    setIsGiftModalOpen(false);
    setEditingGift(null);
  };

  // Toggle Payment Status
  const handleToggleStatus = (id: string, currentStatus: PaymentStatus) => {
    if (currentUser && !currentUser.permissions.canTogglePaymentStatus) {
      showToast('⚠️ អ្នកមិនមានសិទ្ធិកែប្រែស្ថានភាពបង់ប្រាក់ទេ');
      return;
    }

    const newStatus: PaymentStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID';
    const updated = gifts.map((g) => (g.id === id ? { ...g, status: newStatus } : g));
    handleGiftsChange(updated);
    const target = gifts.find((g) => g.id === id);
    showToast(
      newStatus === 'PAID'
        ? `បានប្តូរ «${target?.guestName || ''}» ទៅជា៖ បានទទួលរួច`
        : `បានប្តូរ «${target?.guestName || ''}» ទៅជា៖ រង់ចាំ/ជំពាក់`
    );
  };

  // Save Event (Create or Update)
  const handleSaveEvent = (eventData: Omit<EventItem, 'id'>) => {
    if (currentUser && !currentUser.permissions.canManageEvents) {
      showToast('⚠️ អ្នកមិនមានសិទ្ធិគ្រប់គ្រងកម្មវិធីទេ');
      return;
    }

    if (editingEvent) {
      const updated = events.map((e) =>
        e.id === editingEvent.id
          ? {
              ...e,
              ...eventData,
            }
          : e
      );
      handleEventsChange(updated);
      showToast(`បានកែប្រែកម្មវិធី «${eventData.title}» ជោគជ័យ!`);
    } else {
      const newId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const newEvt: EventItem = {
        ...eventData,
        id: newId,
      };
      const updated = [newEvt, ...events];
      handleEventsChange(updated);
      setActiveId(newId);
      setActiveEventId(newId);
      showToast(`បានបង្កើតកម្មវិធី «${eventData.title}» ជោគជ័យ!`);
    }

    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  // Delete Handlers
  const handleDeleteGiftPrompt = (id: string) => {
    if (currentUser && !currentUser.permissions.canDeleteGift) {
      showToast('⚠️ អ្នកមិនមានសិទ្ធិលុបការកត់ត្រាចំណងដៃទេ');
      return;
    }

    const target = gifts.find((g) => g.id === id);
    setDeleteModal({
      isOpen: true,
      type: 'GIFT',
      id,
      title: 'លុបការកត់ត្រាចំណងដៃ?',
      message: `តើអ្នកប្រាកដជាចង់លុបទិន្នន័យចំណងដៃរបស់ភ្ញៀវ «${target?.guestName || ''}» មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.type === 'GIFT') {
      const updated = gifts.filter((g) => g.id !== deleteModal.id);
      handleGiftsChange(updated);
      showToast('បានលុបទិន្នន័យចំណងដៃរួចរាល់');
    }
    setDeleteModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Export CSV handler with permission check
  const handleExportCSVWithCheck = () => {
    if (currentUser && !currentUser.permissions.canExportPrint) {
      showToast('⚠️ អ្នកមិនមានសិទ្ធិទាញយកឯកសារ Excel/CSV ទេ');
      return;
    }
    handleExportCSV();
  };

  // Print view handler with permission check
  const handleOpenPrintViewWithCheck = () => {
    if (currentUser && !currentUser.permissions.canExportPrint) {
      showToast('⚠️ អ្នកមិនមានសិទ្ធិបោះពុម្ពសៀវភៅចំណងដៃទេ');
      return;
    }
    setIsPrintViewOpen(true);
  };

  // If Print View is open
  if (isPrintViewOpen && currentEvent) {
    return (
      <PrintView
        currentEvent={currentEvent}
        gifts={currentEventGifts}
        stats={stats}
        onClose={() => setIsPrintViewOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      
      {/* Top Header & Event Selector */}
      <Header
        events={events}
        currentEvent={currentEvent}
        allTimeStats={allTimeStats}
        theme={theme}
        currentUser={currentUser}
        users={users}
        onToggleTheme={handleToggleTheme}
        onSelectEvent={handleSelectEvent}
        onOpenNewEventModal={() => {
          setEditingEvent(null);
          setIsEventModalOpen(true);
        }}
        onOpenEditEventModal={() => {
          setEditingEvent(currentEvent);
          setIsEventModalOpen(true);
        }}
        onOpenNewGiftModal={() => {
          setEditingGift(null);
          setIsGiftModalOpen(true);
        }}
        onOpenPrintView={handleOpenPrintViewWithCheck}
        onExportCSV={handleExportCSVWithCheck}
        onResetSampleData={handleResetSampleData}
        onOpenAllTimeSummary={() => setIsAllTimeModalOpen(true)}
        onOpenAdminModal={handleOpenAdminModal}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Quick Action Floating Bar for mobile if permitted */}
        {currentUser?.permissions.canCreateGift && (
          <div className="sm:hidden mb-3">
            <button
              type="button"
              onClick={() => {
                setEditingGift(null);
                setIsGiftModalOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-200 dark:shadow-none cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>កត់ចំណងដៃថ្មី</span>
            </button>
          </div>
        )}

        {/* Statistical Summary Cards */}
        <StatsCards
          stats={stats}
          canViewStats={currentUser?.permissions.canViewStats ?? true}
        />

        {/* Guest Gift List Table with Filters & Search */}
        <GiftListTable
          gifts={currentEventGifts}
          filters={filters}
          onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
          onToggleStatus={handleToggleStatus}
          onEditGift={(gift) => {
            setEditingGift(gift);
            setIsGiftModalOpen(true);
          }}
          onDeleteGift={handleDeleteGiftPrompt}
          onOpenNewGiftModal={() => {
            setEditingGift(null);
            setIsGiftModalOpen(true);
          }}
          canCreateGift={currentUser?.permissions.canCreateGift ?? true}
          canEditGift={currentUser?.permissions.canEditGift ?? true}
          canDeleteGift={currentUser?.permissions.canDeleteGift ?? true}
          canTogglePaymentStatus={currentUser?.permissions.canTogglePaymentStatus ?? true}
        />

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>កម្មវិធីគ្រប់គ្រងចំណងដៃសម្រាប់ពិធីមង្គលការ និងកម្មវិធីពិសេសនានា</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-xs">
            <span>រក្សាសិទ្ធិដោយ <strong className="font-semibold text-slate-700 dark:text-slate-200">S.N.P Technology</strong></span>
          </div>
        </div>
      </footer>

      {/* Gift Record Modal */}
      {currentEvent && (
        <GiftFormModal
          isOpen={isGiftModalOpen}
          onClose={() => {
            setIsGiftModalOpen(false);
            setEditingGift(null);
          }}
          onSave={handleSaveGift}
          initialData={editingGift}
          eventId={currentEvent.id}
        />
      )}

      {/* Event Create / Edit Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        initialData={editingEvent}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* All-time Summary Modal */}
      <AllTimeSummaryModal
        isOpen={isAllTimeModalOpen}
        onClose={() => setIsAllTimeModalOpen(false)}
        allTimeStats={allTimeStats}
        currentEventId={currentEvent?.id || ''}
        onSelectEvent={handleSelectEvent}
      />

      {/* Admin User Management Modal */}
      {currentUser && (
        <AdminUserModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          users={users}
          currentUser={currentUser}
          onSaveUser={handleSaveUserFromModal}
          onDeleteUser={handleDeleteUserFromModal}
          onSwitchUser={handleSwitchUser}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm border border-slate-800 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
