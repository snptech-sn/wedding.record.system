import React from 'react';
import { SummaryStats } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Users, DollarSign, Coins, CheckCircle2, Clock, Lock } from 'lucide-react';

interface StatsCardsProps {
  stats: SummaryStats;
  canViewStats?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, canViewStats = true }) => {
  const percentPaid = stats.totalGuests > 0 ? Math.round((stats.paidGuests / stats.totalGuests) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* Card 1: Total Guests */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-rose-200 dark:hover:border-rose-800 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
              ភ្ញៀវសរុប
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {stats.totalGuests}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">នាក់</span>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>បានទទួល: {stats.paidGuests}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>រង់ចាំ: {stats.pendingGuests}</span>
          </span>
        </div>
      </div>

      {/* Card 2: Total USD ($) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-200 dark:hover:border-emerald-800 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
              ចំណងដៃ ($)
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline gap-1">
            {canViewStats ? (
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 truncate">
                {formatCurrency(stats.totalUSD, 'USD')}
              </span>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 py-1">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-semibold">លាក់ដោយ Admin</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
          {canViewStats ? (
            <span className="truncate">
              {stats.pendingUSD > 0 ? (
                <span className="text-amber-700 dark:text-amber-400 font-medium">
                  រង់ចាំ: {formatCurrency(stats.pendingUSD, 'USD')}
                </span>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">បានទទួលគ្រប់ចំនួន</span>
              )}
            </span>
          ) : (
            <span className="text-slate-400">គ្មានសិទ្ធិមើល</span>
          )}
        </div>
      </div>

      {/* Card 3: Total KHR (៛) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-200 dark:hover:border-blue-800 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
              ចំណងដៃ (៛)
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline gap-1">
            {canViewStats ? (
              <span className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-400 truncate">
                {formatCurrency(stats.totalKHR, 'KHR')}
              </span>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 py-1">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-semibold">លាក់ដោយ Admin</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
          {canViewStats ? (
            <span className="truncate">
              {stats.pendingKHR > 0 ? (
                <span className="text-amber-700 dark:text-amber-400 font-medium">
                  រង់ចាំ: {formatCurrency(stats.pendingKHR, 'KHR')}
                </span>
              ) : (
                <span className="text-blue-700 dark:text-blue-400 font-medium">បានទទួលគ្រប់ចំនួន</span>
              )}
            </span>
          ) : (
            <span className="text-slate-400">គ្មានសិទ្ធិមើល</span>
          )}
        </div>
      </div>

      {/* Card 4: Payment Completion Rate */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-200 dark:hover:border-amber-800 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
              អត្រាទទួល
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {percentPaid}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">បានទទួល</span>
          </div>
        </div>
        
        {/* Visual Progress Bar */}
        <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentPaid}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

