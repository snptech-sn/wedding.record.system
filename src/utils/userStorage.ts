import { AppUser, UserPermissions, UserRole } from '../types';

const USERS_STORAGE_KEY = 'khmer_wedding_users_v1';
const CURRENT_USER_KEY = 'khmer_wedding_current_user_v1';

export const ADMIN_PERMISSIONS: UserPermissions = {
  canCreateGift: true,
  canEditGift: true,
  canDeleteGift: true,
  canTogglePaymentStatus: true,
  canManageEvents: true,
  canDeleteEvents: true,
  canExportPrint: true,
  canViewStats: true,
  canManageUsers: true,
};

export const RECORDER_PERMISSIONS: UserPermissions = {
  canCreateGift: true,
  canEditGift: true,
  canDeleteGift: false,
  canTogglePaymentStatus: true,
  canManageEvents: false,
  canDeleteEvents: false,
  canExportPrint: true,
  canViewStats: true,
  canManageUsers: false,
};

export const VIEWER_PERMISSIONS: UserPermissions = {
  canCreateGift: false,
  canEditGift: false,
  canDeleteGift: false,
  canTogglePaymentStatus: false,
  canManageEvents: false,
  canDeleteEvents: false,
  canExportPrint: true,
  canViewStats: true,
  canManageUsers: false,
};

export const DEFAULT_USERS: AppUser[] = [
  {
    id: 'user-admin-1',
    username: 'admin',
    fullName: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin)',
    role: 'ADMIN',
    roleLabel: 'Admin កំពូល',
    avatarColor: 'rose',
    pin: '1234',
    permissions: { ...ADMIN_PERMISSIONS },
    createdAt: '2026-09-18T00:00:00.000Z',
  },
  {
    id: 'user-recorder-2',
    username: 'recorder1',
    fullName: 'កញ្ញា សុធា (អ្នកកត់ត្រា តុមុខ A)',
    role: 'RECORDER',
    roleLabel: 'អ្នកកត់ត្រា',
    avatarColor: 'blue',
    pin: '0000',
    permissions: { ...RECORDER_PERMISSIONS },
    createdAt: '2026-09-18T01:00:00.000Z',
  },
  {
    id: 'user-viewer-3',
    username: 'host',
    fullName: 'ម្ចាស់កម្មវិធី (អ្នកពិនិត្យ)',
    role: 'VIEWER',
    roleLabel: 'អ្នកពិនិត្យ / មើល',
    avatarColor: 'amber',
    pin: '',
    permissions: { ...VIEWER_PERMISSIONS },
    createdAt: '2026-09-18T02:00:00.000Z',
  },
];

export const PERMISSION_DEFINITIONS: {
  key: keyof UserPermissions;
  label: string;
  description: string;
  category: 'gifts' | 'events' | 'reports' | 'admin';
}[] = [
  {
    key: 'canCreateGift',
    label: 'កត់ត្រាចំណងដៃថ្មី',
    description: 'អាចចុចប៊ូតុង និងបញ្ចូលចំណងដៃពីភ្ញៀវថ្មីៗ',
    category: 'gifts',
  },
  {
    key: 'canEditGift',
    label: 'កែប្រែទិន្នន័យចំណងដៃ',
    description: 'អាចកែប្រែឈ្មោះ ទឹកប្រាក់ ឬកំណត់សម្គាល់របស់ភ្ញៀវ',
    category: 'gifts',
  },
  {
    key: 'canDeleteGift',
    label: 'លុបចំណងដៃ',
    description: 'អាចលុបទិន្នន័យចំណងដៃដែលបានកត់ត្រារួច',
    category: 'gifts',
  },
  {
    key: 'canTogglePaymentStatus',
    label: 'ប្តូរស្ថានភាពបង់ប្រាក់',
    description: 'អាចចុចប្តូររវាង "បានទទួល" និង "រង់ចាំទទួល"',
    category: 'gifts',
  },
  {
    key: 'canManageEvents',
    label: 'បង្កើត & កែប្រែកម្មវិធី',
    description: 'អាចបង្កើតកម្មវិធីថ្មី និងកែប្រែព័ត៌មានកម្មវិធី',
    category: 'events',
  },
  {
    key: 'canDeleteEvents',
    label: 'លុបកម្មវិធី',
    description: 'អាចលុបកម្មវិធីនិងទិន្នន័យទាំងអស់នៃកម្មវិធីនោះ',
    category: 'events',
  },
  {
    key: 'canExportPrint',
    label: 'បោះពុម្ព & ទាញយក Excel',
    description: 'អាចបោះពុម្ពសៀវភៅ ឬ Export ជាឯកសារ CSV/Excel',
    category: 'reports',
  },
  {
    key: 'canViewStats',
    label: 'មើលតួលេខទឹកប្រាក់សរុប',
    description: 'អាចមើលស្ថិតិទឹកប្រាក់ដុល្លារ និងរៀលក្នុងកាតសង្ខេប',
    category: 'reports',
  },
  {
    key: 'canManageUsers',
    label: 'គ្រប់គ្រងអ្នកប្រើ & កំណត់សិទ្ធិ (Admin)',
    description: 'អាចបន្ថែម កែប្រែ និងចាត់ចែងសិទ្ធិប្រើប្រាស់អ្នកដទៃ',
    category: 'admin',
  },
];

export function getStoredUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveStoredUsers(users: AppUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function getStoredCurrentUser(users: AppUser[]): AppUser {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      const found = users.find((u) => u.id === raw);
      if (found) return found;
    }
  } catch {
    // fallback
  }
  return users[0] || DEFAULT_USERS[0];
}

export function saveStoredCurrentUser(userId: string): void {
  try {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  } catch (e) {
    console.error('Failed to save current user', e);
  }
}

export function getRoleDefaultPermissions(role: UserRole): UserPermissions {
  switch (role) {
    case 'ADMIN':
      return { ...ADMIN_PERMISSIONS };
    case 'RECORDER':
      return { ...RECORDER_PERMISSIONS };
    case 'VIEWER':
      return { ...VIEWER_PERMISSIONS };
    case 'CUSTOM':
    default:
      return { ...RECORDER_PERMISSIONS };
  }
}
