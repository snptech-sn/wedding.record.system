import React from 'react';
import { EventItem, GiftRecord, SummaryStats } from '../types';
import { formatCurrency, formatDateKhmer, formatDateTimeKhmer, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '../utils/formatters';
import { Printer, ArrowLeft, Heart } from 'lucide-react';

interface PrintViewProps {
  currentEvent: EventItem;
  gifts: GiftRecord[];
  stats: SummaryStats;
  onClose: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({
  currentEvent,
  gifts,
  stats,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 px-4 sm:px-6 transition-colors">
      
      {/* Floating Action Bar (hidden when printing) */}
      <div className="no-print max-w-4xl mx-auto mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ត្រឡប់ក្រោយ</span>
        </button>

        <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
          អាចជ្រើសរើស "Save as PDF" ពេលចុចបោះពុម្ព ដើម្បីរក្សាទុកជាឯកសារ PDF
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-xl shadow-md transition-all active:scale-98"
        >
          <Printer className="w-4 h-4" />
          <span>បោះពុម្ព / រក្សាទុកជា PDF</span>
        </button>
      </div>

      {/* Printable Paper Document (A4 format style) */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-lg border border-slate-200 rounded-xl print:shadow-none print:border-none print:p-0">
        
        {/* Decorative Top Frame for Khmer Ceremony */}
        <div className="text-center pb-6 border-b-2 border-rose-800">
          <div className="flex items-center justify-center gap-2 text-rose-800 mb-1">
            <Heart className="w-6 h-6 fill-rose-800" />
            <span className="text-2xl font-bold tracking-tight">សៀវភៅកត់ត្រាចំណងដៃ</span>
            <Heart className="w-6 h-6 fill-rose-800" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            {currentEvent.title}
          </h2>
          <div className="mt-2 text-sm text-slate-700 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            <span><strong>ម្ចាស់កម្មវិធី:</strong> {currentEvent.hostName}</span>
            <span><strong>កាលបរិច្ឆេទ:</strong> {formatDateKhmer(currentEvent.date)}</span>
            {currentEvent.location && <span><strong>ទីតាំង:</strong> {currentEvent.location}</span>}
          </div>
        </div>

        {/* Summary Metric Box */}
        <div className="my-6 p-4 rounded-xl bg-rose-50/50 border border-rose-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center print:bg-slate-50 print:border-slate-300">
          <div>
            <div className="text-xs text-slate-600 font-medium">ចំនួនភ្ញៀវសរុប</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{stats.totalGuests} នាក់</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 font-medium">ទឹកប្រាក់ដុល្លារ ($)</div>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">{formatCurrency(stats.totalUSD, 'USD')}</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 font-medium">ទឹកប្រាក់រៀល (៛)</div>
            <div className="text-xl font-bold text-blue-700 mt-0.5">{formatCurrency(stats.totalKHR, 'KHR')}</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 font-medium">បានទទួលរួច / ជំពាក់</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {stats.paidGuests} / <span className="text-amber-700">{stats.pendingGuests}</span>
            </div>
          </div>
        </div>

        {/* Guest Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <tr>
                <th className="py-2.5 px-3 border-r border-slate-300 text-center w-10">ល.រ</th>
                <th className="py-2.5 px-3 border-r border-slate-300">ឈ្មោះភ្ញៀវកិត្តិយស</th>
                <th className="py-2.5 px-3 border-r border-slate-300">ទំនាក់ទំនង</th>
                <th className="py-2.5 px-3 border-r border-slate-300">លេខតុ</th>
                <th className="py-2.5 px-3 border-r border-slate-300 text-right">ចំនួនទឹកប្រាក់</th>
                <th className="py-2.5 px-3 border-r border-slate-300 text-center">ស្ថានភាព</th>
                <th className="py-2.5 px-3 border-r border-slate-300">វិធីបង់ប្រាក់</th>
                <th className="py-2.5 px-3">ចំណាំ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {gifts.map((gift, idx) => (
                <tr key={gift.id} className="hover:bg-slate-50 print-break-inside-avoid">
                  <td className="py-2 px-3 border-r border-slate-200 text-center font-medium text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-900">
                    {gift.guestName}
                    {gift.phone && <span className="block text-[10px] text-slate-500">{gift.phone}</span>}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                    {gift.relationship}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                    {gift.tableNumber || '-'}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 text-right font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(gift.amount, gift.currency)}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 text-center">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      gift.status === 'PAID' ? 'text-emerald-800 bg-emerald-100' : 'text-amber-800 bg-amber-100'
                    }`}>
                      {gift.status === 'PAID' ? 'បានទទួល' : 'រង់ចាំ'}
                    </span>
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                    {PAYMENT_METHOD_LABELS[gift.paymentMethod]?.label || gift.paymentMethod}
                  </td>
                  <td className="py-2 px-3 text-slate-600 text-[11px]">
                    {gift.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grand Total Row */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-300 rounded-lg flex flex-wrap items-center justify-between text-xs font-bold text-slate-900 print-break-inside-avoid">
          <span>សរុបរួមទាំងអស់ ({gifts.length} នាក់):</span>
          <div className="flex items-center gap-6">
            <span className="text-emerald-700">USD: {formatCurrency(stats.totalUSD, 'USD')}</span>
            <span className="text-blue-700">KHR: {formatCurrency(stats.totalKHR, 'KHR')}</span>
          </div>
        </div>

        {/* Signatures for formal event record */}
        <div className="mt-12 pt-6 grid grid-cols-2 gap-8 text-center text-xs print-break-inside-avoid">
          <div>
            <p className="font-semibold text-slate-800">អ្នកកត់ត្រាចំណងដៃ</p>
            <p className="text-slate-400 mt-1">(ហត្ថលេខា និងឈ្មោះ)</p>
            <div className="mt-16 border-t border-slate-300 w-40 mx-auto" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">ម្ចាស់កម្មវិធី / គណៈកម្មការរៀបចំ</p>
            <p className="text-slate-400 mt-1">(ហត្ថលេខា និងឈ្មោះ)</p>
            <div className="mt-16 border-t border-slate-300 w-40 mx-auto" />
          </div>
        </div>

        {/* Document Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
          <span>បោះពុម្ពតាមរយៈ: កម្មវិធីគ្រប់គ្រងចំណងដៃ</span>
          <span>កាលបរិច្ឆេទបោះពុម្ព: {formatDateTimeKhmer(new Date().toISOString())}</span>
        </div>

      </div>

    </div>
  );
};
