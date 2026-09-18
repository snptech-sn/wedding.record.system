import React from 'react';
import { GiftRecord, FilterOptions, PaymentStatus, Currency } from '../types';
import {
  formatCurrency,
  formatDateTimeKhmer,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  RELATIONSHIP_OPTIONS,
} from '../utils/formatters';
import {
  Search,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  Filter,
  ArrowUpDown,
  Phone,
  MapPin,
  FileText,
  User,
  Banknote,
  Smartphone,
  Mail,
  RotateCcw,
} from 'lucide-react';

interface GiftListTableProps {
  gifts: GiftRecord[];
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  onToggleStatus: (id: string, currentStatus: PaymentStatus) => void;
  onEditGift: (gift: GiftRecord) => void;
  onDeleteGift: (id: string) => void;
  onOpenNewGiftModal: () => void;
  canCreateGift?: boolean;
  canEditGift?: boolean;
  canDeleteGift?: boolean;
  canTogglePaymentStatus?: boolean;
}

export const GiftListTable: React.FC<GiftListTableProps> = ({
  gifts,
  filters,
  onFilterChange,
  onToggleStatus,
  onEditGift,
  onDeleteGift,
  onOpenNewGiftModal,
  canCreateGift = true,
  canEditGift = true,
  canDeleteGift = true,
  canTogglePaymentStatus = true,
}) => {
  // Compute filtered & sorted gifts
  const filteredGifts = gifts.filter((item) => {
    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = item.guestName.toLowerCase().includes(q);
      const matchPhone = item.phone ? item.phone.toLowerCase().includes(q) : false;
      const matchTable = item.tableNumber ? item.tableNumber.toLowerCase().includes(q) : false;
      const matchNotes = item.notes ? item.notes.toLowerCase().includes(q) : false;
      const matchRel = item.relationship.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchTable && !matchNotes && !matchRel) {
        return false;
      }
    }

    // Status filter
    if (filters.status !== 'ALL' && item.status !== filters.status) {
      return false;
    }

    // Currency filter
    if (filters.currency !== 'ALL' && item.currency !== filters.currency) {
      return false;
    }

    // Relationship filter
    if (filters.relationship !== 'ALL' && item.relationship !== filters.relationship) {
      return false;
    }

    return true;
  });

  // Sort
  const sortedGifts = [...filteredGifts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'date_asc':
        return new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime();
      case 'date_desc':
        return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
      case 'amount_desc':
        return b.amount - a.amount;
      case 'amount_asc':
        return a.amount - b.amount;
      case 'name_asc':
        return a.guestName.localeCompare(b.guestName, 'km');
      default:
        return 0;
    }
  });

  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.status !== 'ALL' ? 1 : 0) +
    (filters.currency !== 'ALL' ? 1 : 0) +
    (filters.relationship !== 'ALL' ? 1 : 0);

  const clearAllFilters = () => {
    onFilterChange({
      searchQuery: '',
      status: 'ALL',
      currency: 'ALL',
      relationship: 'ALL',
      sortBy: 'date_desc',
    });
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'TRANSFER':
        return <Smartphone className="w-3.5 h-3.5 text-blue-600" />;
      case 'ENVELOPE':
        return <Mail className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Banknote className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      
      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="ស្វែងរកឈ្មោះភ្ញៀវ លេខទូរស័ព្ទ លេខតុ ឬចំណាំ..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-semibold"
              >
                លុប
              </button>
            )}
          </div>

          {/* Quick Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium self-start md:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => onFilterChange({ status: 'ALL' })}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                filters.status === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ទាំងអស់ ({gifts.length})
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ status: 'PAID' })}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
                filters.status === 'PAID'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>បានទទួល ({gifts.filter(g => g.status === 'PAID').length})</span>
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ status: 'PENDING' })}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
                filters.status === 'PENDING'
                  ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>រង់ចាំ/ជំពាក់ ({gifts.filter(g => g.status === 'PENDING').length})</span>
            </button>
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Currency Filter */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">រូបិយប័ណ្ណ:</span>
              <select
                value={filters.currency}
                onChange={(e) => onFilterChange({ currency: e.target.value as 'ALL' | Currency })}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-xs focus:ring-1 focus:ring-rose-500 font-medium"
              >
                <option value="ALL">ទាំងអស់ ($ & ៛)</option>
                <option value="USD">ដុល្លារ ($) តែប៉ុណ្ណោះ</option>
                <option value="KHR">ប្រាក់រៀល (៛) តែប៉ុណ្ណោះ</option>
              </select>
            </div>

            {/* Relationship Filter */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">ក្រុម:</span>
              <select
                value={filters.relationship}
                onChange={(e) => onFilterChange({ relationship: e.target.value })}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-xs focus:ring-1 focus:ring-rose-500 font-medium max-w-[180px] truncate"
              >
                <option value="ALL">គ្រប់ក្រុមទាំងអស់</option>
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-xs focus:ring-1 focus:ring-rose-500 font-medium"
              >
                <option value="date_desc">កត់ត្រាចុងក្រោយបង្អស់</option>
                <option value="date_asc">កត់ត្រាដំបូងបង្អស់</option>
                <option value="amount_desc">ទឹកប្រាក់ ច្រើន ➔ តិច</option>
                <option value="amount_asc">ទឹកប្រាក់ តិច ➔ ច្រើន</option>
                <option value="name_asc">ឈ្មោះភ្ញៀវ (ក ➔ អ)</option>
              </select>
            </div>
          </div>

          {/* Reset Filters button */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 font-medium hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>សម្អាតតម្រង ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Gifts Count & Summary header */}
      <div className="px-5 py-2.5 bg-slate-50/30 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>
          បង្ហាញទិន្នន័យ <span className="font-bold text-slate-800 dark:text-slate-200">{sortedGifts.length}</span> / {gifts.length} នាក់
        </div>
        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          * ចុចលើផ្លាកស្ថានភាព ដើម្បីផ្លាស់ប្តូរ បានទទួល / រង់ចាំ បានភ្លាមៗ
        </div>
      </div>

      {/* Empty State */}
      {sortedGifts.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
            <User className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">មិនមានទិន្នន័យចំណងដៃ</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {gifts.length === 0
              ? 'សូមចុចប៊ូតុងខាងក្រោមដើម្បីកត់ត្រាចំណងដៃដំបូងរបស់អ្នក'
              : 'មិនមានទិន្នន័យត្រូវនឹងតម្រងដែលបានស្វែងរកទេ សូមសាកល្បងសម្អាតតម្រង'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {gifts.length > 0 ? (
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                បង្ហាញទិន្នន័យទាំងអស់ឡើងវិញ
              </button>
            ) : canCreateGift ? (
              <button
                type="button"
                onClick={onOpenNewGiftModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-sm"
              >
                + កត់ចំណងដៃដំបូង
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th scope="col" className="py-3.5 pl-5 pr-3 text-center w-12">ល.រ</th>
                  <th scope="col" className="py-3.5 px-3">ឈ្មោះភ្ញៀវកិត្តិយស</th>
                  <th scope="col" className="py-3.5 px-3">ក្រុម / ទំនាក់ទំនង</th>
                  <th scope="col" className="py-3.5 px-3">លេខតុ / សម្គាល់</th>
                  <th scope="col" className="py-3.5 px-3 text-right">ចំនួនទឹកប្រាក់</th>
                  <th scope="col" className="py-3.5 px-3 text-center">ស្ថានភាព</th>
                  <th scope="col" className="py-3.5 px-3">វិធីបង់ប្រាក់</th>
                  <th scope="col" className="py-3.5 px-3">ចំណាំ</th>
                  <th scope="col" className="py-3.5 pr-5 pl-3 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {sortedGifts.map((gift, idx) => {
                  const statusMeta = PAYMENT_STATUS_LABELS[gift.status];
                  const methodMeta = PAYMENT_METHOD_LABELS[gift.paymentMethod] || { label: gift.paymentMethod };

                  return (
                    <tr
                      key={gift.id}
                      className="hover:bg-rose-50/30 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      {/* Index */}
                      <td className="py-3.5 pl-5 pr-3 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {idx + 1}
                      </td>

                      {/* Guest Name & Phone */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{gift.guestName}</span>
                        </div>
                        {gift.phone && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            <span>{gift.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Relationship */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {gift.relationship}
                        </span>
                      </td>

                      {/* Table Number */}
                      <td className="py-3.5 px-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {gift.tableNumber ? (
                          <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {gift.tableNumber}
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">-</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 text-right font-bold whitespace-nowrap">
                        <span
                          className={
                            gift.currency === 'USD'
                              ? 'text-emerald-600 dark:text-emerald-400 text-base'
                              : 'text-blue-700 dark:text-blue-400 text-base'
                          }
                        >
                          {formatCurrency(gift.amount, gift.currency)}
                        </span>
                      </td>

                      {/* Status Toggle (Interactive Click if permitted) */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {canTogglePaymentStatus ? (
                          <button
                            type="button"
                            onClick={() => onToggleStatus(gift.id, gift.status)}
                            title="ចុចដើម្បីប្តូរស្ថានភាព"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer hover:shadow-2xs active:scale-95 ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}
                          >
                            {gift.status === 'PAID' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            )}
                            <span>{statusMeta.label}</span>
                          </button>
                        ) : (
                          <span
                            title="គ្មានសិទ្ធិកែប្រែស្ថានភាព"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border opacity-80 ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}
                          >
                            {gift.status === 'PAID' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            )}
                            <span>{statusMeta.label}</span>
                          </span>
                        )}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {getMethodIcon(gift.paymentMethod)}
                          <span>{methodMeta.label}</span>
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="py-3.5 px-3 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {gift.notes ? (
                          <span title={gift.notes}>{gift.notes}</span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-5 pl-3 text-right whitespace-nowrap">
                        {canEditGift || canDeleteGift ? (
                          <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {canEditGift && (
                              <button
                                type="button"
                                onClick={() => onEditGift(gift)}
                                title="កែប្រែ"
                                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {canDeleteGift && (
                              <button
                                type="button"
                                onClick={() => onDeleteGift(gift.id)}
                                title="លុបចោល"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (shown on screens < lg) */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {sortedGifts.map((gift, idx) => {
              const statusMeta = PAYMENT_STATUS_LABELS[gift.status];
              const methodMeta = PAYMENT_METHOD_LABELS[gift.paymentMethod] || { label: gift.paymentMethod };

              return (
                <div key={gift.id} className="p-4 space-y-3 hover:bg-rose-50/20 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* Top row: Name & Amount */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {gift.guestName}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 pl-7 text-xs text-slate-500 dark:text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {gift.relationship}
                        </span>
                        {gift.tableNumber && (
                          <span className="flex items-center gap-0.5 text-slate-600 dark:text-slate-400">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {gift.tableNumber}
                          </span>
                        )}
                        {gift.phone && (
                          <span className="flex items-center gap-0.5 text-slate-600 dark:text-slate-400">
                            <Phone className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            {gift.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right whitespace-nowrap">
                      <div
                        className={`text-lg font-bold ${
                          gift.currency === 'USD' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'
                        }`}
                      >
                        {formatCurrency(gift.amount, gift.currency)}
                      </div>
                    </div>
                  </div>

                  {/* Middle row: Status Toggle & Method */}
                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    {canTogglePaymentStatus ? (
                      <button
                        type="button"
                        onClick={() => onToggleStatus(gift.id, gift.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border} cursor-pointer`}
                      >
                        {gift.status === 'PAID' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        )}
                        <span>{statusMeta.label}</span>
                      </button>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border opacity-80 ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}
                      >
                        {gift.status === 'PAID' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        )}
                        <span>{statusMeta.label}</span>
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      {getMethodIcon(gift.paymentMethod)}
                      <span>{methodMeta.label}</span>
                    </div>
                  </div>

                  {/* Notes & Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <div className="truncate flex-1">
                      {gift.notes ? (
                        <span className="italic text-slate-600 dark:text-slate-300">"{gift.notes}"</span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">គ្មានចំណាំ</span>
                      )}
                    </div>
                    {(canEditGift || canDeleteGift) && (
                      <div className="flex items-center gap-1 shrink-0">
                        {canEditGift && (
                          <button
                            type="button"
                            onClick={() => onEditGift(gift)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                            <span>កែ</span>
                          </button>
                        )}
                        {canDeleteGift && (
                          <button
                            type="button"
                            onClick={() => onDeleteGift(gift.id)}
                            className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
};
