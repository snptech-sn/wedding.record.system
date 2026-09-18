export type Currency = 'USD' | 'KHR';

export type PaymentStatus = 'PAID' | 'PENDING';

export type PaymentMethod = 'CASH' | 'TRANSFER' | 'ENVELOPE';

export type EventType = 'WEDDING' | 'BIRTHDAY' | 'HOUSEWARMING' | 'OTHER';

export interface GiftRecord {
  id: string;
  eventId: string;
  guestName: string;
  phone?: string;
  relationship: string;
  tableNumber?: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  recordedAt: string; // ISO string
}

export interface EventItem {
  id: string;
  title: string;
  eventType: EventType;
  date: string;
  hostName: string;
  location?: string;
  notes?: string;
}

export interface FilterOptions {
  searchQuery: string;
  status: 'ALL' | PaymentStatus;
  currency: 'ALL' | Currency;
  relationship: string;
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc' | 'name_asc';
}

export interface SummaryStats {
  totalGuests: number;
  paidGuests: number;
  pendingGuests: number;
  totalUSD: number;
  totalKHR: number;
  pendingUSD: number;
  pendingKHR: number;
}

export interface EventSummaryItem {
  event: EventItem;
  guestsCount: number;
  paidGuests: number;
  pendingGuests: number;
  paidUSD: number;
  paidKHR: number;
  pendingUSD: number;
  pendingKHR: number;
}

export interface AllTimeStats {
  totalEvents: number;
  totalGuests: number;
  totalPaidUSD: number;
  totalPaidKHR: number;
  totalPendingUSD: number;
  totalPendingKHR: number;
  eventsBreakdown: EventSummaryItem[];
}

export type UserRole = 'ADMIN' | 'RECORDER' | 'VIEWER' | 'CUSTOM';

export interface UserPermissions {
  canCreateGift: boolean;          // កត់ត្រាចំណងដៃថ្មី
  canEditGift: boolean;            // កែប្រែព័ត៌មានចំណងដៃ
  canDeleteGift: boolean;          // លុបចំណងដៃ
  canTogglePaymentStatus: boolean; // ដូរស្ថានភាព (បង់រួច / រង់ចាំ)
  canManageEvents: boolean;        // បង្កើត និងកែប្រែកម្មវិធី
  canDeleteEvents: boolean;        // លុបកម្មវិធី
  canExportPrint: boolean;         // បោះពុម្ព និងទាញយក Excel
  canViewStats: boolean;           // មើលតួលេខទឹកប្រាក់សរុប
  canManageUsers: boolean;         // Admin: កំណត់សិទ្ធិ និងគ្រប់គ្រងអ្នកប្រើ
}

export interface AppUser {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  roleLabel: string;
  avatarColor?: string;
  pin?: string;
  permissions: UserPermissions;
  createdAt: string;
}

