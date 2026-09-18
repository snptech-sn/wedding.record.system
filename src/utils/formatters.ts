import { Currency, EventType, PaymentMethod, PaymentStatus, GiftRecord, EventItem } from '../types';

export const RELATIONSHIP_OPTIONS = [
  'សាច់ញាតិខាងកូនកំលោះ',
  'សាច់ញាតិខាងកូនក្រមុំ',
  'សាច់ញាតិ / បងប្អូន',
  'មិត្តភក្តិ',
  'មិត្តរួមការងារ',
  'អ្នកជិតខាង',
  'ភ្ញៀវកិត្តិយស (VIP)',
  'ដៃគូអាជីវកម្ម',
  'ផ្សេងៗ',
];

export const EVENT_TYPE_LABELS: Record<EventType, { label: string; icon: string; bg: string }> = {
  WEDDING: { label: 'ពិធីមង្គលការ', icon: 'Heart', bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
  BIRTHDAY: { label: 'ពិធីខួបកំណើត', icon: 'Cake', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  HOUSEWARMING: { label: 'ពិធីឡើងគេហដ្ឋាន', icon: 'Home', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  OTHER: { label: 'កម្មវិធីពិសេសផ្សេងៗ', icon: 'Sparkles', bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, { label: string; color: string; bg: string; border: string }> = {
  PAID: {
    label: 'បានទទួលរួច',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  PENDING: {
    label: 'មិនទាន់បង់ / ជំពាក់',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
  },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, { label: string; icon: string }> = {
  CASH: { label: 'សាច់ប្រាក់សុទ្ធ', icon: 'Banknote' },
  TRANSFER: { label: 'ផ្ទេរតាមធនាគារ (Bakong/ABA)', icon: 'Smartphone' },
  ENVELOPE: { label: 'ស្រោមសំបុត្រផ្ទាល់', icon: 'Mail' },
};

export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  return `${amount.toLocaleString('en-US')} ៛`;
}

export function formatDateKhmer(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTimeKhmer(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${date.toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })} ${date.toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return dateString;
  }
}

export function exportToCSV(records: GiftRecord[], currentEvent: EventItem) {
  const headers = ['លេខរៀង', 'ឈ្មោះភ្ញៀវ', 'លេខទូរស័ព្ទ', 'ទំនាក់ទំនង/ក្រុម', 'លេខតុ', 'ចំនួនទឹកប្រាក់', 'រូបិយប័ណ្ណ', 'ស្ថានភាព', 'វិធីបង់ប្រាក់', 'ចំណាំ', 'កាលបរិច្ឆេទកត់ត្រា'];
  
  const rows = records.map((rec, index) => [
    index + 1,
    `"${(rec.guestName || '').replace(/"/g, '""')}"`,
    `"${(rec.phone || '').replace(/"/g, '""')}"`,
    `"${(rec.relationship || '').replace(/"/g, '""')}"`,
    `"${(rec.tableNumber || '').replace(/"/g, '""')}"`,
    rec.amount,
    rec.currency,
    rec.status === 'PAID' ? 'បានទទួលរួច' : 'មិនទាន់បង់/ជំពាក់',
    PAYMENT_METHOD_LABELS[rec.paymentMethod]?.label || rec.paymentMethod,
    `"${(rec.notes || '').replace(/"/g, '""')}"`,
    formatDateTimeKhmer(rec.recordedAt),
  ]);

  // Include UTF-8 BOM \uFEFF for proper Khmer Unicode rendering in Microsoft Excel
  const csvContent = '\uFEFF' + [
    `"សៀវភៅកត់ត្រាចំណងដៃ: ${currentEvent.title}"`,
    `"ម្ចាស់កម្មវិធី: ${currentEvent.hostName}"`,
    `"កាលបរិច្ឆេទ: ${formatDateKhmer(currentEvent.date)}"`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const sanitizedTitle = currentEvent.title.replace(/[/\\?%*:|"<>]/g, '-');
  link.setAttribute('download', `បញ្ជីចំណងដៃ_${sanitizedTitle}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
