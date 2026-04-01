'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useLang } from '@/app/_context/language-context';
import { tr } from '@/app/_config/translations';
import { AppointmentFilters, DEFAULT_FILTERS } from '@/app/_api/appointment-api';

// ── Date helpers ──────────────────────────────────────────────────────────────
function toYmd(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── Types & constants ─────────────────────────────────────────────────────────
export type { AppointmentFilters };
export { DEFAULT_FILTERS };

interface Props {
    filters:       AppointmentFilters;
    onChange:      (filters: AppointmentFilters) => void;
    /** total number of appointments currently shown — optional display */
    resultCount?:  number;
    loading?:      boolean;
}

const STATUS_DOTS: Record<number, string> = {
    0: 'bg-amber-400',
    1: 'bg-blue-400',
    2: 'bg-rose-400',
    3: 'bg-emerald-400',
    4: 'bg-violet-400',
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function AppointmentSearchBar({ filters, onChange, resultCount, loading }: Props) {
    const { lang } = useLang();
    const [inputValue, setInputValue]   = useState(filters.query);
    const [expanded,   setExpanded]     = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync external reset (e.g. "clear all")
    useEffect(() => { setInputValue(filters.query); }, [filters.query]);

    // Debounce text search — 450 ms
    const handleQueryChange = (val: string) => {
        setInputValue(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onChange({ ...filters, query: val });
        }, 450);
    };

    // Map UI period pill keys to dateFilterMode values
    type PeriodKey = 'all' | 'today' | 'week' | 'month' | 'range';

    const handlePeriod = (period: PeriodKey) => {
        const today = toYmd(new Date());
        if (period === 'all') {
            onChange({ ...filters, dateFilterMode: null, filterDate: '', dateFrom: '', dateTo: '' });
        } else if (period === 'today') {
            onChange({ ...filters, dateFilterMode: 'exact', filterDate: today, dateFrom: '', dateTo: '' });
        } else if (period === 'week') {
            onChange({ ...filters, dateFilterMode: 'week',  filterDate: today, dateFrom: '', dateTo: '' });
        } else if (period === 'month') {
            onChange({ ...filters, dateFilterMode: 'month', filterDate: today, dateFrom: '', dateTo: '' });
        } else {
            // range — keep existing dateFrom/dateTo, just switch mode
            onChange({ ...filters, dateFilterMode: 'range', filterDate: '' });
        }
    };

    const handleStatus = (val: number | null) => {
        onChange({ ...filters, status: val });
    };

    const handleCustomDate = (key: 'dateFrom' | 'dateTo', val: string) => {
        onChange({ ...filters, [key]: val, dateFilterMode: 'range', filterDate: '' });
    };

    const clearAll = () => {
        setInputValue('');
        onChange({ ...DEFAULT_FILTERS });
    };

    // Derive which period pill should appear active
    const activePeriod: PeriodKey = (() => {
        if (!filters.dateFilterMode) return 'all';
        if (filters.dateFilterMode === 'exact') return 'today';
        if (filters.dateFilterMode === 'week')  return 'week';
        if (filters.dateFilterMode === 'month') return 'month';
        return 'range';
    })();

    // Count active filters for badge
    const activeCount = [
        filters.query.trim() !== '',
        filters.status !== null,
        filters.dateFilterMode !== null,
    ].filter(Boolean).length;

    const PERIODS: { key: PeriodKey; label: string }[] = [
        { key: 'all',   label: tr('search_period_all',    lang) },
        { key: 'today', label: tr('search_period_today',  lang) },
        { key: 'week',  label: tr('search_period_week',   lang) },
        { key: 'month', label: tr('search_period_month',  lang) },
        { key: 'range', label: tr('search_period_custom', lang) },
    ];

    const STATUS_OPTIONS: { value: number | null; label: string }[] = [
        { value: null, label: tr('search_status_all', lang) },
        { value: 0,    label: tr('status_0', lang) },
        { value: 1,    label: tr('status_1', lang) },
        { value: 2,    label: tr('status_2', lang) },
        { value: 3,    label: tr('status_3', lang) },
        { value: 4,    label: tr('status_4', lang) },
    ];

    // Result count string
    const resultLabel = (() => {
        if (resultCount === undefined) return null;
        if (resultCount === 0) return tr('search_results_none', lang);
        if (resultCount === 1) return tr('search_results_one', lang);
        return tr('search_results_many', lang).replace('{n}', String(resultCount));
    })();

    return (
        <div className="mb-6 rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a] overflow-hidden">

            {/* ── Top bar: search input + toggle ── */}
            <div className="flex items-center gap-2 px-3 py-3 sm:px-4">
                {/* Search input */}
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => handleQueryChange(e.target.value)}
                        placeholder={tr('search_placeholder', lang)}
                        className="w-full rounded-xl border border-[#D4AF37]/15 bg-black py-2.5 pl-9 pr-8 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#D4AF37]/50"
                    />
                    {inputValue && (
                        <button
                            onClick={() => handleQueryChange('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-500 hover:text-white transition"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Filter toggle button */}
                <button
                    onClick={() => setExpanded(e => !e)}
                    className={`relative flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm transition-all ${
                        expanded || activeCount > 0
                            ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'border-[#D4AF37]/20 text-gray-400 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]'
                    }`}
                >
                    <SlidersHorizontal className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">{tr('search_period_all', lang) === 'Tout' ? 'Filtres' : 'Filters'}</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                    {/* Active badge */}
                    {activeCount > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[9px] font-bold text-black">
                            {activeCount}
                        </span>
                    )}
                </button>

                {/* Clear all — only when filters active */}
                {activeCount > 0 && (
                    <button
                        onClick={clearAll}
                        className="shrink-0 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-gray-500 transition hover:border-white/20 hover:text-white"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {/* ── Expanded filters panel ── */}
            {expanded && (
                <div className="border-t border-[#D4AF37]/10 px-3 pb-4 pt-3 sm:px-4 space-y-4">

                    {/* Period row */}
                    <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                            Période
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {PERIODS.map(p => (
                                <button
                                    key={p.key}
                                    onClick={() => handlePeriod(p.key)}
                                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                        activePeriod === p.key
                                            ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                                            : 'border-[#D4AF37]/20 text-gray-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom date inputs */}
                    {activePeriod === 'range' && (
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                            <div className="flex flex-1 items-center gap-2">
                                <label className="w-10 shrink-0 text-xs text-gray-500">{tr('search_date_from', lang)}</label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={e => handleCustomDate('dateFrom', e.target.value)}
                                    className="flex-1 rounded-xl border border-[#D4AF37]/20 bg-black px-3 py-2 text-sm text-white outline-none transition focus:border-[#D4AF37]/50 [color-scheme:dark]"
                                />
                            </div>
                            <div className="flex flex-1 items-center gap-2">
                                <label className="w-10 shrink-0 text-xs text-gray-500">{tr('search_date_to', lang)}</label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    min={filters.dateFrom || undefined}
                                    onChange={e => handleCustomDate('dateTo', e.target.value)}
                                    className="flex-1 rounded-xl border border-[#D4AF37]/20 bg-black px-3 py-2 text-sm text-white outline-none transition focus:border-[#D4AF37]/50 [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Status row */}
                    <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                            Statut
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map(opt => (
                                <button
                                    key={opt.value ?? 'all'}
                                    onClick={() => handleStatus(opt.value)}
                                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                        filters.status === opt.value
                                            ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                                            : 'border-[#D4AF37]/20 text-gray-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
                                    }`}
                                >
                                    {opt.value !== null && (
                                        <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOTS[opt.value]}`} />
                                    )}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Result count + clear */}
                    {(resultLabel !== null || activeCount > 0) && (
                        <div className="flex items-center justify-between border-t border-[#D4AF37]/10 pt-3">
                            {resultLabel !== null && (
                                <p className={`text-xs ${loading ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {loading ? '…' : resultLabel}
                                </p>
                            )}
                            {activeCount > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="ml-auto flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-500 transition hover:border-white/20 hover:text-white"
                                >
                                    <X className="h-3 w-3" />
                                    {tr('search_clear', lang)}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
