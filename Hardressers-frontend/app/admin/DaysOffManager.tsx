'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarOff, Plus, Trash2, Loader2, AlertTriangle, X, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { DayOff } from '@/app/_models/models';
import { FetchDaysOff, AddDayOff, RemoveDayOff } from '@/app/_api/appointment-api';
import { useLang } from '@/app/_context/language-context';
import { tr } from '@/app/_config/translations';
import { Lang } from '@/app/_context/language-context';

// ── Calendar Popup ────────────────────────────────────────────────────────────
function DatePickerCalendar({
    value,
    onChange,
    existingDates,
    lang,
}: {
    value: string;
    onChange: (date: string) => void;
    existingDates: string[];
    lang: Lang;
}) {
    const [open, setOpen] = useState(false);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear]   = useState(today.getFullYear());
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    const toYmd = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const existingSet = new Set(existingDates.map(s => s.slice(0, 10)));

    // Days grid: week starts Monday
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startOffset  = (firstOfMonth.getDay() + 6) % 7; // Mon=0
    const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (Date | null)[] = [
        ...Array(startOffset).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    const handleSelect = (d: Date) => {
        if (d < today) return;
        onChange(toYmd(d));
        setOpen(false);
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const displayValue = value
        ? (() => { const d = new Date(value + 'T12:00:00'); return `${tr(`day_${d.getDay()}`, lang)} ${d.getDate()} ${tr(`month_${d.getMonth()}`, lang)} ${d.getFullYear()}`; })()
        : tr('daysoff_date_label', lang);

    // Mon→Sun headers
    const DAY_HEADERS = [1, 2, 3, 4, 5, 6, 0].map(i => tr(`day_${i}`, lang).slice(0, 2));

    return (
        <div className="relative" ref={ref}>
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-all ${
                    value
                        ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5 text-white'
                        : 'border-[#D4AF37]/20 bg-black text-gray-500 hover:border-[#D4AF37]/40'
                }`}
            >
                <CalendarDays className={`h-4 w-4 shrink-0 ${value ? 'text-[#D4AF37]' : 'text-gray-600'}`} />
                <span className="capitalize">{displayValue}</span>
            </button>

            {/* Popup */}
            {open && (
                <div className="absolute left-0 top-full z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#111] shadow-2xl shadow-black/60">
                    {/* Month navigation */}
                    <div className="flex items-center justify-between border-b border-[#D4AF37]/10 px-4 py-3">
                        <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-full text-[#D4AF37] transition hover:bg-[#D4AF37]/10">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <p className="text-sm font-semibold capitalize text-white">
                            {tr(`month_${viewMonth}`, lang)} {viewYear}
                        </p>
                        <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-full text-[#D4AF37] transition hover:bg-[#D4AF37]/10">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 border-b border-[#D4AF37]/10 px-3 py-2">
                        {DAY_HEADERS.map(d => (
                            <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">{d}</div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-y-1 p-3">
                        {cells.map((d, i) => {
                            if (!d) return <div key={i} />;
                            const ymd      = toYmd(d);
                            const isPast   = d < today;
                            const isToday  = d.getTime() === today.getTime();
                            const isSelected = ymd === value;
                            const isExisting = existingSet.has(ymd);

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(d)}
                                    disabled={isPast}
                                    className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all
                                        ${isPast ? 'cursor-not-allowed text-gray-700' : ''}
                                        ${isSelected ? 'bg-[#D4AF37] font-bold text-black' : ''}
                                        ${isToday && !isSelected ? 'ring-1 ring-[#D4AF37] text-[#D4AF37]' : ''}
                                        ${isExisting && !isSelected && !isPast ? 'bg-rose-500/20 text-rose-300' : ''}
                                        ${!isPast && !isSelected && !isExisting ? 'text-white hover:bg-[#D4AF37]/15' : ''}
                                    `}
                                >
                                    {d.getDate()}
                                    {isExisting && !isSelected && (
                                        <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-rose-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 border-t border-[#D4AF37]/10 px-4 py-2.5 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#D4AF37]" />
                            {tr('daysoff_selected', lang)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />
                            {tr('daysoff_already', lang)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DaysOffManager() {
    const { lang } = useLang();
    const [daysOff, setDaysOff] = useState<DayOff[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingDate, setAddingDate] = useState('');
    const [addingReason, setAddingReason] = useState('');
    const [adding, setAdding] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<DayOff | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        FetchDaysOff()
            .then(setDaysOff)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleAdd = async () => {
        if (!addingDate) return;
        setAdding(true);
        try {
            const newDay = await AddDayOff(addingDate, addingReason.trim() || undefined);
            setDaysOff(prev =>
                [...prev, newDay].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            );
            setAddingDate('');
            setAddingReason('');
        } catch (e) { console.error(e); }
        finally { setAdding(false); }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        const id = confirmDelete.id;
        setConfirmDelete(null);
        setDeletingId(id);
        try {
            await RemoveDayOff(id);
            setDaysOff(prev => prev.filter(d => d.id !== id));
        } catch (e) { console.error(e); }
        finally { setDeletingId(null); }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T12:00:00');
        return `${tr(`day_${d.getDay()}`, lang)} ${d.getDate()} ${tr(`month_${d.getMonth()}`, lang)} ${d.getFullYear()}`;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = daysOff.filter(d => new Date(d.date) >= today);
    const past     = daysOff.filter(d => new Date(d.date) <  today);
    const existingDates = daysOff.map(d => d.date);

    const DayOffCard = ({ day }: { day: DayOff }) => {
        const isPast = new Date(day.date) < today;
        return (
            <div className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-all ${
                isPast ? 'border-white/5 bg-[#0a0a0a] opacity-50' : 'border-[#D4AF37]/15 bg-gradient-to-r from-[#0a0a0a] to-black'
            }`}>
                <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                        isPast ? 'border-gray-700 bg-black' : 'border-[#D4AF37]/30 bg-black'
                    }`}>
                        <CalendarOff className={`h-4 w-4 ${isPast ? 'text-gray-600' : 'text-[#D4AF37]'}`} />
                    </div>
                    <div>
                        <p className={`font-medium capitalize ${isPast ? 'text-gray-500' : 'text-white'}`}>
                            {formatDate(day.date)}
                        </p>
                        {day.reason && (
                            <p className="mt-0.5 text-sm text-gray-500">{day.reason}</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setConfirmDelete(day)}
                    disabled={deletingId === day.id}
                    className="shrink-0 rounded-xl border border-rose-500/20 p-2 text-rose-400 transition hover:border-rose-500/50 hover:bg-rose-500/10 disabled:opacity-40"
                >
                    {deletingId === day.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />
                    }
                </button>
            </div>
        );
    };

    return (
        <>
        <div className="mt-6 space-y-8">
            {/* Header */}
            <div className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6">
                <h2 className="text-2xl font-light text-white">{tr('daysoff_title', lang)}</h2>
                <p className="mt-1 text-sm text-gray-400">{tr('daysoff_subtitle', lang)}</p>
            </div>

            {/* Add form */}
            <div className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-light text-white">
                    <Plus className="h-5 w-5 text-[#D4AF37]" />
                    {tr('daysoff_add_title', lang)}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr_auto]">
                    {/* Date picker */}
                    <DatePickerCalendar
                        value={addingDate}
                        onChange={setAddingDate}
                        existingDates={existingDates}
                        lang={lang}
                    />
                    {/* Reason */}
                    <input
                        type="text"
                        value={addingReason}
                        onChange={e => setAddingReason(e.target.value)}
                        placeholder={tr('daysoff_reason_ph', lang)}
                        onKeyDown={e => e.key === 'Enter' && handleAdd()}
                        className="w-full rounded-2xl border border-[#D4AF37]/20 bg-black px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#D4AF37]/60"
                    />
                    {/* Button */}
                    <button
                        onClick={handleAdd}
                        disabled={!addingDate || adding}
                        className="inline-flex h-[46px] items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#F4D03F] disabled:opacity-40"
                    >
                        {adding
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Plus className="h-4 w-4" />
                        }
                        {tr('daysoff_add_btn', lang)}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6">
                {loading ? (
                    <div className="flex min-h-[150px] items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
                    </div>
                ) : daysOff.length === 0 ? (
                    <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/15 text-sm text-gray-500">
                        {tr('daysoff_none', lang)}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {upcoming.length > 0 && (
                            <div>
                                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]/60">
                                    {tr('daysoff_upcoming', lang)} — {upcoming.length}
                                </p>
                                <div className="space-y-3">
                                    {upcoming.map(d => <DayOffCard key={d.id} day={d} />)}
                                </div>
                            </div>
                        )}
                        {past.length > 0 && (
                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="h-[1px] flex-1 bg-white/5" />
                                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">
                                        {tr('daysoff_past', lang)} — {past.length}
                                    </p>
                                    <div className="h-[1px] flex-1 bg-white/5" />
                                </div>
                                <div className="space-y-3">
                                    {past.map(d => <DayOffCard key={d.id} day={d} />)}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* ── Confirm delete popup ──────────────────────────────────────────── */}
        {confirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
                <div className="relative w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#111] shadow-2xl">
                    <div className="flex justify-center pt-8 pb-2">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 ring-2 ring-rose-500/30">
                            <AlertTriangle className="h-7 w-7 text-rose-400" />
                        </div>
                    </div>
                    <div className="px-6 pb-6 pt-3 text-center">
                        <h3 className="text-lg font-semibold text-white">{tr('daysoff_delete_confirm', lang)}</h3>
                        <p className="mt-2 font-medium capitalize text-[#D4AF37]">{formatDate(confirmDelete.date)}</p>
                        {confirmDelete.reason && (
                            <p className="mt-1 text-sm text-gray-400">{confirmDelete.reason}</p>
                        )}
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-gray-300 transition hover:border-white/30 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                                {tr('modal_close', lang)}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500"
                            >
                                <Trash2 className="h-4 w-4" />
                                {tr('editor_delete_confirm_btn', lang)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
