import { EventItem, GiftRecord } from '../types';

const EVENTS_STORAGE_KEY = 'khmer_wedding_gift_events_v1';
const GIFTS_STORAGE_KEY = 'khmer_wedding_gift_records_v1';
const ACTIVE_EVENT_KEY = 'khmer_wedding_gift_active_event_v1';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'event-wedding-1',
    title: 'ពិធីមង្គលការ សុខា & ចរិយា',
    eventType: 'WEDDING',
    date: '2026-11-20',
    hostName: 'លោក សុខា & អ្នកនាង ចរិយា',
    location: 'មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍កោះពេជ្រ (Koh Pich)',
    notes: 'កម្មវិធីពេលល្ងាច ទទួលភ្ញៀវពិសារភោជនាហារ',
  },
  {
    id: 'event-house-2',
    title: 'ពិធីឡើងគេហដ្ឋានថ្មី បុរីប៉េងហួត',
    eventType: 'HOUSEWARMING',
    date: '2026-12-05',
    hostName: 'គ្រួសារ លោក ប៊ុនថន',
    location: 'បុរីប៉េងហួត បឹងស្នោ ផ្លូវជាតិលេខ១',
    notes: 'ពិធីសូត្រមន្តឡើងផ្ទះថ្មី',
  },
  {
    id: 'event-birthday-3',
    title: 'ពិធីខួបកំណើត កូនប្រុស សុវណ្ណរិទ្ធ គម្រប់ ៥ ឆ្នាំ',
    eventType: 'BIRTHDAY',
    date: '2026-10-15',
    hostName: 'លោក វ៉ាន់ដា & អ្នកស្រី គន្ធា',
    location: 'សណ្ឋាគារ ហៃយ៉ាត់ រីជិនស៊ី ភ្នំពេញ',
    notes: 'ពិធីខួបកំណើតក្មេងៗ និងជួបជុំសាច់ញាតិ',
  },
];

export const INITIAL_GIFTS: GiftRecord[] = [
  {
    id: 'gift-1',
    eventId: 'event-wedding-1',
    guestName: 'ឯកឧត្តម ជា ស៊ីណាត',
    phone: '012 888 999',
    relationship: 'ភ្ញៀវកិត្តិយស (VIP)',
    tableNumber: 'តុ VIP ០១',
    amount: 200,
    currency: 'USD',
    status: 'PAID',
    paymentMethod: 'CASH',
    notes: 'អញ្ជើញមកជាមួយលោកជំទាវ',
    recordedAt: '2026-09-18T05:30:00.000Z',
  },
  {
    id: 'gift-2',
    eventId: 'event-wedding-1',
    guestName: 'លោកពូ ម៉េង ហុង & អ្នកមីង',
    phone: '098 777 666',
    relationship: 'សាច់ញាតិខាងកូនកំលោះ',
    tableNumber: 'តុ ០២',
    amount: 400000,
    currency: 'KHR',
    status: 'PAID',
    paymentMethod: 'ENVELOPE',
    notes: 'បងប្អូនជីដូនមួយឪពុក',
    recordedAt: '2026-09-18T06:15:00.000Z',
  },
  {
    id: 'gift-3',
    eventId: 'event-wedding-1',
    guestName: 'កញ្ញា រ័ត្ន ធីតា',
    phone: '010 555 444',
    relationship: 'មិត្តភក្តិ',
    tableNumber: 'តុ ០៨',
    amount: 50,
    currency: 'USD',
    status: 'PAID',
    paymentMethod: 'TRANSFER',
    notes: 'មិត្តរួមថ្នាក់សាកលវិទ្យាល័យ (ផ្ទេរតាម ABA)',
    recordedAt: '2026-09-18T06:40:00.000Z',
  },
  {
    id: 'gift-4',
    eventId: 'event-wedding-1',
    guestName: 'លោក ចាន់ វិបុល',
    phone: '077 333 222',
    relationship: 'មិត្តរួមការងារ',
    tableNumber: 'តុ ១២',
    amount: 100,
    currency: 'USD',
    status: 'PAID',
    paymentMethod: 'CASH',
    notes: 'ប្រធានផ្នែកគណនេយ្យ',
    recordedAt: '2026-09-18T07:10:00.000Z',
  },
  {
    id: 'gift-5',
    eventId: 'event-wedding-1',
    guestName: 'អ្នកស្រី កែវ សុភី',
    phone: '085 111 223',
    relationship: 'អ្នកជិតខាង',
    tableNumber: 'តុ ១៥',
    amount: 200000,
    currency: 'KHR',
    status: 'PAID',
    paymentMethod: 'CASH',
    notes: 'ផ្ទះលេខ ៤៥ ផ្លូវមុខផ្ទះ',
    recordedAt: '2026-09-18T07:25:00.000Z',
  },
  {
    id: 'gift-6',
    eventId: 'event-wedding-1',
    guestName: 'លោក ហេង វណ្ណឌី',
    phone: '016 444 777',
    relationship: 'មិត្តភក្តិ',
    tableNumber: 'តុ ០៩',
    amount: 50,
    currency: 'USD',
    status: 'PENDING',
    paymentMethod: 'TRANSFER',
    notes: 'ជាប់រវល់នៅខេត្ត សន្យាផ្ទេរតាម Bakong យប់នេះ',
    recordedAt: '2026-09-18T07:45:00.000Z',
  },
  {
    id: 'gift-7',
    eventId: 'event-wedding-1',
    guestName: 'លោក អ៊ុំ គឹមសាន',
    phone: '097 999 001',
    relationship: 'សាច់ញាតិខាងកូនក្រមុំ',
    tableNumber: 'តុ ០៣',
    amount: 150,
    currency: 'USD',
    status: 'PAID',
    paymentMethod: 'ENVELOPE',
    notes: 'អ៊ំបង្កើតខាងកូនក្រមុំ',
    recordedAt: '2026-09-18T08:00:00.000Z',
  },
  {
    id: 'gift-8',
    eventId: 'event-wedding-1',
    guestName: 'លោកស្រី លី សុជាតា',
    phone: '012 334 455',
    relationship: 'ដៃគូអាជីវកម្ម',
    tableNumber: 'តុ VIP ០២',
    amount: 300,
    currency: 'USD',
    status: 'PAID',
    paymentMethod: 'TRANSFER',
    notes: 'ផ្ញើកន្ត្រកផ្កា និងចងដៃតាម ABA',
    recordedAt: '2026-09-18T08:10:00.000Z',
  },
  {
    id: 'gift-9',
    eventId: 'event-wedding-1',
    guestName: 'លោក ផាន់ សំអុល',
    phone: '069 222 111',
    relationship: 'មិត្តរួមការងារ',
    tableNumber: 'តុ ១២',
    amount: 100000,
    currency: 'KHR',
    status: 'PENDING',
    paymentMethod: 'CASH',
    notes: 'ផ្ញើស្រោមសំបុត្រមកតាមមិត្តភក្តិ មិនទាន់ទទួលបាន',
    recordedAt: '2026-09-18T08:12:00.000Z',
  },
];

export function getStoredEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EVENTS;
  } catch {
    return INITIAL_EVENTS;
  }
}

export function saveStoredEvents(events: EventItem[]): void {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events to localStorage', e);
  }
}

export function getStoredGifts(): GiftRecord[] {
  try {
    const raw = localStorage.getItem(GIFTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(INITIAL_GIFTS));
      return INITIAL_GIFTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_GIFTS;
  } catch {
    return INITIAL_GIFTS;
  }
}

export function saveStoredGifts(gifts: GiftRecord[]): void {
  try {
    localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(gifts));
  } catch (e) {
    console.error('Failed to save gifts to localStorage', e);
  }
}

export function getActiveEventId(events: EventItem[]): string {
  try {
    const active = localStorage.getItem(ACTIVE_EVENT_KEY);
    if (active && events.some(e => e.id === active)) {
      return active;
    }
  } catch {
    // fallback
  }
  return events[0]?.id || '';
}

export function setActiveEventId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_EVENT_KEY, id);
  } catch {
    // ignore
  }
}

export function resetToSampleData(): { events: EventItem[]; gifts: GiftRecord[] } {
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
  localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(INITIAL_GIFTS));
  localStorage.setItem(ACTIVE_EVENT_KEY, INITIAL_EVENTS[0].id);
  return { events: INITIAL_EVENTS, gifts: INITIAL_GIFTS };
}
