import React from 'react';
import { AllTimeStats, EventItem } from '../types';
import { formatCurrency, formatDateKhmer, EVENT_TYPE_LABELS } from '../utils/formatters';
import { X, TrendingUp, Calendar, Users, DollarSign, Coins, ArrowRight, Sparkles, CheckCircle2, Clock } from 'lucide-react';

interface AllTimeSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTimeStats: AllTimeStats;
  currentEventId: string;
  onSelectEvent: (eventId: string) => void;
}

export const AllTimeSummaryModal: React.FC<AllTimeSummaryModalProps> = ({
  isOpen,
  onClose,
  allTimeStats,
  currentEventId,
  onSelectEvent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95">
        
        {/* Festive Header */}
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white backdrop-blur-xs shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                សរុបចំណូលគ្រប់កម្មវិធីទាំងអស់ (All-time Summary)
              </h2>
              <p className="text-xs text-rose-100 mt-0.5">
                ស្ថិតិចំណូល និងភ្ញៀវកត់ត្រារួមពីគ្រប់កម្មវិធីដែលបានបង្កើត ({allTimeStats.totalEvents} កម្មវិធី)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Key Grand Total Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Total Events */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>កម្មវិធីសរុប</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {allTimeStats.totalEvents} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">កម្មវិធី</span>
              </div>
            </div>

            {/* Total Guests */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>ភ្ញៀវសរុប</span>
                <Users className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {allTimeStats.totalGuests} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">នាក់</span>
              </div>
            </div>

            {/* Total USD */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <span>ចំណូលដុល្លារ ($)</span>
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-2 text-xl font-bold text-emerald-700 dark:text-emerald-400 truncate">
                {formatCurrency(allTimeStats.totalPaidUSD, 'USD')}
              </div>
              {allTimeStats.totalPendingUSD > 0 && (
                <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                  រង់ចាំ: {formatCurrency(allTimeStats.totalPendingUSD, 'USD')}
                </div>
              )}
            </div>

            {/* Total KHR */}
            <div className="bg-blue-50/70 dark:bg-blue-950/40 p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/60">
              <div className="flex items-center justify-between text-blue-800 dark:text-blue-300 text-xs font-semibold">
                <span>ចំណូលប្រាក់រៀល (៛)</span>
                <Coins className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mt-2 text-lg font-bold text-blue-700 dark:text-blue-400 truncate">
                {formatCurrency(allTimeStats.totalPaidKHR, 'KHR')}
              </div>
              {allTimeStats.totalPendingKHR > 0 && (
                <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                  រង់ចាំ: {formatCurrency(allTimeStats.totalPendingKHR, 'KHR')}
                </div>
              )}
            </div>

          </div>

          {/* Breakdown Table by Event */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                តារាងលម្អិតតាមកម្មវិធីនីមួយៗ ({allTimeStats.eventsBreakdown.length})
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                * ចុចលើកម្មវិធីដើម្បីប្តូរទៅកាន់កម្មវិធីនោះភ្លាមៗ
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3.5">ឈ្មោះកម្មវិធី</th>
                      <th className="py-3 px-3 text-center">កាលបរិច្ឆេទ</th>
                      <th className="py-3 px-3 text-center">ភ្ញៀវសរុប</th>
                      <th className="py-3 px-3 text-right">ដុល្លារ ($)</th>
                      <th className="py-3 px-3 text-right">រៀល (៛)</th>
                      <th className="py-3 px-3.5 text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {allTimeStats.eventsBreakdown.map((item) => {
                      const isCurrent = item.event.id === currentEventId;
                      const meta = EVENT_TYPE_LABELS[item.event.eventType];

                      return (
                        <tr
                          key={item.event.id}
                          className={`transition-colors ${
                            isCurrent
                              ? 'bg-rose-50/60 dark:bg-rose-950/40 font-medium'
                              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <td className="py-3 px-3.5">
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{item.event.title}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-600 text-white font-medium">
                                  កំពុងមើល
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <span className={`inline-block px-1.5 py-0.2 rounded border ${meta.bg}`}>
                                {meta.label}
                              </span>
                              <span>• ម្ចាស់កម្មវិធី: {item.event.hostName}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-center whitespace-nowrap text-slate-600 dark:text-slate-400">
                            {formatDateKhmer(item.event.date)}
                          </td>

                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <span className="font-semibold text-slate-900 dark:text-white">{item.guestsCount}</span> នាក់
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">
                              (បានទទួល {item.paidGuests})
                            </div>
                          </td>

                          <td className="py-3 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                            {formatCurrency(item.paidUSD, 'USD')}
                            {item.pendingUSD > 0 && (
                              <div className="text-[10px] font-normal text-amber-700 dark:text-amber-400">
                                + {formatCurrency(item.pendingUSD, 'USD')} រង់ចាំ
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right font-bold text-blue-700 dark:text-blue-400 whitespace-nowrap">
                            {formatCurrency(item.paidKHR, 'KHR')}
                            {item.pendingKHR > 0 && (
                              <div className="text-[10px] font-normal text-amber-700 dark:text-amber-400">
                                + {formatCurrency(item.pendingKHR, 'KHR')} រង់ចាំ
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            {isCurrent ? (
                              <span className="text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>កម្មវិធីនេះ</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectEvent(item.event.id);
                                  onClose();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500 hover:text-rose-700 dark:hover:text-rose-400 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center gap-1 mx-auto transition-colors shadow-2xs"
                              >
                                <span>បើកមើល</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div>
            <strong className="text-slate-800 dark:text-white">សរុបចំណូលរួម:</strong> {formatCurrency(allTimeStats.totalPaidUSD, 'USD')} និង {formatCurrency(allTimeStats.totalPaidKHR, 'KHR')}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-medium transition-colors"
          >
            បិទផ្ទាំងនេះ
          </button>
        </div>

      </div>
    </div>
  );
};
