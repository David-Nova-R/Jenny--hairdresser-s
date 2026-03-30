'use client';

import { useEffect, useState } from 'react';
import {
    addDays, addMonths, startOfWeek, startOfMonth,
    format, isSameDay, isSameMonth,
} from 'date-fns';
import {
    FetchAdminCalendarAppointments,
    UpdateAppointmentStatusAdmin,
    AcceptAppointmentAdmin,
} from '@/app/_api/appointment-api';
import {
    Loader2, Clock3, User2, Scissors, StickyNote,
    ChevronLeft, ChevronRight, X, CalendarDays, DollarSign, CheckCircle2, XCircle,
} from 'lucide-react';
import { AdminCalendarAppointmentDTO } from '../_models/models';
import { useLang } from '@/app/_context/language-context';
import { tr } from '@/app/_config/translations';

// ── Constants ────────────────────────────────────────────────────────────────
const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i);
const HOUR_HEIGHT = 96;
const PX_PER_MINUTE = HOUR_HEIGHT / 60;
type CalendarView = 'day' | 'week' | 'month';

const STATUS_COLOR: Record<number, string> = {
    0: 'bg-amber-400',
    1: 'bg-blue-400',
    2: 'bg-rose-400',
    3: 'bg-emerald-400',
    4: 'bg-violet-400',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmtApi = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}T00:00:00`;
};
const parseLocal = (v: string) => {
    const [dp, tp] = v.split('T');
    const [Y, M, D] = dp.split('-').map(Number);
    const [h, m, s] = tp.split(':').map(Number);
    return new Date(Y, M - 1, D, h, m, s || 0);
};

const getTheme = (status: number) => {
    const map: Record<number, { card: string; pill: string }> = {
        0: { card: 'bg-amber-500   border-amber-300/40',   pill: 'bg-black/20' },
        1: { card: 'bg-blue-600    border-blue-300/40',    pill: 'bg-black/20' },
        2: { card: 'bg-rose-600    border-rose-300/40',    pill: 'bg-black/20' },
        3: { card: 'bg-emerald-600 border-emerald-300/40', pill: 'bg-black/20' },
        4: { card: 'bg-violet-600  border-violet-300/40',  pill: 'bg-black/20' },
    };
    return map[status] ?? { card: 'bg-slate-600 border-slate-300/40', pill: 'bg-black/20' };
};

// ── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({
    appointment,
    onClose,
    onConfirm,
    onComplete,
    onCancel,
    loading,
}: {
    appointment: AdminCalendarAppointmentDTO;
    onClose: () => void;
    onConfirm: () => void;
    onComplete: () => void;
    onCancel: () => void;
    loading: boolean;
}) {
    const { lang } = useLang();
    const date = parseLocal(appointment.appointmentDate);
    const duration = (appointment as any).durationMinutes ?? appointment.externalDurationMinutes ?? 60;
    const status = Number(appointment.status);
    const theme = getTheme(status);
    const statusLabels: Record<number, string> = {
        0: tr('status_0', lang), 1: tr('status_1', lang), 2: tr('status_2', lang),
        3: tr('status_3', lang), 4: tr('status_4', lang),
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-2xl border border-[#D4AF37]/20 bg-[#111] shadow-2xl">
                {/* Header strip */}
                <div className={`rounded-t-2xl px-5 py-4 ${theme.card}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            {/* Client — very prominent */}
                            <div className="flex items-center gap-2">
                                <User2 className="h-5 w-5 shrink-0 text-white" />
                                <p className="text-xl font-bold text-white">
                                    {appointment.userName || tr('admin_client', lang)}
                                </p>
                            </div>
                            {/* Service */}
                            <div className="mt-1 flex items-center gap-2">
                                <Scissors className="h-4 w-4 shrink-0 text-white/80" />
                                <p className="text-sm font-semibold text-white/90">
                                    {appointment.hairStyleName || tr('admin_appointment', lang)}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="mt-0.5 shrink-0 rounded-full bg-black/20 p-1.5 text-white hover:bg-black/40">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-3 px-5 py-4">
                    <div className="flex items-center gap-3 text-sm">
                        <CalendarDays className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                        <span className="font-semibold capitalize text-white">
                            {tr(`day_${date.getDay()}`, lang)} {date.getDate()} {tr(`month_${date.getMonth()}`, lang)} {date.getFullYear()}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Clock3 className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                        <span className="text-white">{format(date, 'HH:mm')} <span className="text-gray-400">({duration} min)</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <DollarSign className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                        <span className="text-white">
                            {appointment.status === 4
                                ? appointment.notes || tr('admin_external_note', lang)
                                : `${appointment.priceMin}${appointment.priceMax != null ? ` – ${appointment.priceMax}` : ''} CAD`}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLOR[status] ?? 'bg-gray-400'}`} />
                        <span className="text-white">{statusLabels[status] ?? tr('admin_unknown', lang)}</span>
                    </div>
                </div>

                {/* Actions */}
                {status !== 3 && status !== 2 && (
                    <div className="flex gap-2 border-t border-white/5 px-5 pb-5 pt-4">
                        {status === 0 && (
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                {tr('admin_btn_confirm', lang)}
                            </button>
                        )}
                        {status === 1 && (
                            <button
                                onClick={onComplete}
                                disabled={loading}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                {tr('admin_btn_complete', lang)}
                            </button>
                        )}
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 px-4 py-2.5 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-50"
                        >
                            <XCircle className="h-4 w-4" />
                            {tr('admin_btn_cancel', lang)}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AdminCalendar() {
    const { lang } = useLang();
    const [view, setView] = useState<CalendarView>('week');
    const [currentDate, setCurrentDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [appointments, setAppointments] = useState<AdminCalendarAppointmentDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingIds, setLoadingIds] = useState<number[]>([]);
    const [selected, setSelected] = useState<AdminCalendarAppointmentDTO | null>(null);

    const switchView = (v: CalendarView) => {
        if (v === 'week')  setCurrentDate(startOfWeek(currentDate, { weekStartsOn: 1 }));
        if (v === 'month') setCurrentDate(startOfMonth(currentDate));
        setView(v);
    };

    const navigate = (dir: 'prev' | 'next') => {
        const d = dir === 'prev' ? -1 : 1;
        if (view === 'day')   setCurrentDate(x => addDays(x, d));
        if (view === 'week')  setCurrentDate(x => addDays(x, d * 7));
        if (view === 'month') setCurrentDate(x => addMonths(x, d));
    };

    useEffect(() => { void load(); }, [currentDate, view]);

    const load = async () => {
        setLoading(true);
        try {
            if (view !== 'month') {
                const weekStart = view === 'week' ? currentDate : startOfWeek(currentDate, { weekStartsOn: 1 });
                setAppointments((await FetchAdminCalendarAppointments(fmtApi(weekStart))) ?? []);
            } else {
                const first = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
                const weeks = Array.from({ length: 6 }, (_, i) => addDays(first, i * 7));
                const res = await Promise.all(weeks.map(w => FetchAdminCalendarAppointments(fmtApi(w)).catch(() => [])));
                const seen = new Set<number>();
                const merged: AdminCalendarAppointmentDTO[] = [];
                res.flat().forEach(a => { if (!seen.has(a.id)) { seen.add(a.id); merged.push(a); } });
                setAppointments(merged);
            }
        } catch (e) { console.error(e); setAppointments([]); }
        finally { setLoading(false); }
    };

    const getForDay = (day: Date) =>
        appointments
            .filter(a => isSameDay(parseLocal(a.appointmentDate), day))
            .sort((a, b) => parseLocal(a.appointmentDate).getTime() - parseLocal(b.appointmentDate).getTime());

    const isLoadingId = (id: number) => loadingIds.includes(id);

    const handleStatusChange = async (a: AdminCalendarAppointmentDTO, type: 'confirm' | 'complete' | 'cancel') => {
        const cur = Number(a.status);
        const next = type === 'confirm' ? 1 : type === 'complete' ? 3 : 2;
        if (next === cur) return;
        setLoadingIds(p => [...p, a.id]);
        try {
            if (type === 'confirm') await AcceptAppointmentAdmin(a.id);
            else await UpdateAppointmentStatusAdmin(a.id, next);
            setAppointments(p => p.map(x => x.id === a.id ? { ...x, status: next } : x));
            setSelected(prev => prev?.id === a.id ? { ...prev, status: next } : prev);
        } catch (e) { console.error(e); }
        finally { setLoadingIds(p => p.filter(id => id !== a.id)); }
    };

    // ── Appointment card ─────────────────────────────────────────────────────
    const AppCard = ({ a, height }: { a: AdminCalendarAppointmentDTO; height: number }) => {
        const date = parseLocal(a.appointmentDate);
        const ultraCompact = height < 58;
        const compact = height < 88;
        const theme = getTheme(Number(a.status));

        return (
            <div
                className={`h-full w-full cursor-pointer overflow-hidden rounded-xl border p-2 text-white shadow-md transition-opacity hover:opacity-90 ${theme.card}`}
                onClick={() => setSelected(a)}
            >
                {/* Time badge */}
                <div className={`mb-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${theme.pill}`}>
                    {format(date, 'HH:mm')}
                </div>

                {/* Client name — big & first */}
                <p className={`truncate font-extrabold leading-tight text-white ${ultraCompact ? 'text-xs' : 'text-sm'}`}>
                    {a.userName || tr('admin_client', lang)}
                </p>

                {/* Service name */}
                {!ultraCompact && (
                    <p className="truncate text-[11px] font-semibold text-white/80">
                        {a.hairStyleName || tr('admin_appointment', lang)}
                    </p>
                )}

                {/* Duration */}
                {!compact && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-white/70">
                        <Clock3 className="h-3 w-3" />
                        <span>{(a as any).durationMinutes ?? a.externalDurationMinutes ?? 60} min</span>
                    </div>
                )}

                {isLoadingId(a.id) && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </div>
                )}
            </div>
        );
    };

    // ── Time grid (day & week) ───────────────────────────────────────────────
    const TimeGrid = ({ days }: { days: Date[] }) => (
        <div className="overflow-x-auto">
            <div className="grid min-w-[500px]" style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}>
                <div className="bg-[#181818]">
                    <div className="h-12 border-b border-[#D4AF37]/10 bg-[#1b1b1b]" />
                    {HOURS.map(h => (
                        <div key={h} className="flex h-24 items-start border-b border-[#D4AF37]/10 px-2 pt-2">
                            <span className="rounded bg-white/5 px-1.5 py-0.5 text-xs font-medium text-gray-300">{h}:00</span>
                        </div>
                    ))}
                </div>

                {days.map((day, i) => {
                    const dayApps = getForDay(day);
                    const isToday = isSameDay(day, new Date());
                    return (
                        <div key={i} className="border-l border-[#D4AF37]/10 bg-[#141414]">
                            <div className={`h-12 border-b border-[#D4AF37]/10 px-2 py-1.5 text-center ${isToday ? 'bg-[#D4AF37]/10' : 'bg-[#181818]'}`}>
                                <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{tr(`day_${day.getDay()}`, lang).slice(0, 3)}</div>
                                <div className={`text-sm font-bold ${isToday ? 'text-[#D4AF37]' : 'text-white'}`}>{format(day, 'd')}</div>
                            </div>

                            <div className="relative" style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}>
                                {HOURS.map(h => <div key={h} className="h-24 border-b border-[#D4AF37]/10" />)}

                                {dayApps.map(a => {
                                    const date = parseLocal(a.appointmentDate);
                                    const duration = (a as any).durationMinutes ?? a.externalDurationMinutes ?? 60;
                                    const top = ((date.getHours() - HOURS[0]) * 60 + date.getMinutes()) * PX_PER_MINUTE;
                                    const height = Math.max(duration * PX_PER_MINUTE - 4, 48);

                                    return (
                                        <div key={a.id} className="absolute left-1 right-1" style={{ top: `${top + 2}px`, height: `${height}px` }}>
                                            <AppCard a={a} height={height} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // ── Month grid ───────────────────────────────────────────────────────────
    const MonthGrid = () => {
        const first = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
        const allDays = Array.from({ length: 42 }, (_, i) => addDays(first, i));
        const weeks = Array.from({ length: 6 }, (_, i) => allDays.slice(i * 7, i * 7 + 7));
        // Lundi → Dimanche (semaine commence lundi)
        const DAY_NAMES = [1, 2, 3, 4, 5, 6, 0].map(i => tr(`day_${i}`, lang).slice(0, 3));

        return (
            <div className="overflow-hidden rounded-xl border border-[#D4AF37]/10">
                <div className="grid grid-cols-7 border-b border-[#D4AF37]/10 bg-[#181818]">
                    {DAY_NAMES.map(d => (
                        <div key={d} className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">{d}</div>
                    ))}
                </div>
                {weeks.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 border-b border-[#D4AF37]/10 last:border-0">
                        {week.map((day, di) => {
                            const dayApps = getForDay(day);
                            const isToday = isSameDay(day, new Date());
                            const inMonth = isSameMonth(day, currentDate);
                            return (
                                <div
                                    key={di}
                                    onClick={() => { setCurrentDate(day); switchView('day'); }}
                                    className={`min-h-[90px] cursor-pointer border-r border-[#D4AF37]/10 p-2 transition-colors last:border-0 hover:bg-[#D4AF37]/5 ${inMonth ? 'bg-[#141414]' : 'bg-[#0f0f0f]'}`}
                                >
                                    <div className={`mb-1.5 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${isToday ? 'bg-[#D4AF37] text-black' : inMonth ? 'text-white' : 'text-gray-600'}`}>
                                        {format(day, 'd')}
                                    </div>
                                    <div className="space-y-1">
                                        {dayApps.slice(0, 3).map(a => (
                                            <div
                                                key={a.id}
                                                onClick={e => { e.stopPropagation(); setSelected(a); }}
                                                className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-bold text-white ${getTheme(Number(a.status)).card}`}
                                            >
                                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full bg-white/60`} />
                                                <span className="truncate">{format(parseLocal(a.appointmentDate), 'HH:mm')} {a.userName || tr('admin_client', lang)}</span>
                                            </div>
                                        ))}
                                        {dayApps.length > 3 && <div className="px-1 text-[10px] text-[#D4AF37]">+{dayApps.length - 3}</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    const fmtDay  = (d: Date) => `${tr(`day_${d.getDay()}`, lang)} ${d.getDate()} ${tr(`month_${d.getMonth()}`, lang)} ${d.getFullYear()}`;
    const fmtShort = (d: Date) => `${tr(`month_${d.getMonth()}`, lang).slice(0, 3)} ${d.getDate()}`;
    const title = view === 'day'
        ? fmtDay(currentDate)
        : view === 'week'
            ? `${fmtShort(currentDate)} – ${fmtShort(addDays(currentDate, 6))} ${addDays(currentDate, 6).getFullYear()}`
            : `${tr(`month_${currentDate.getMonth()}`, lang)} ${currentDate.getFullYear()}`;

    return (
        <>
            <div className="mt-6 rounded-3xl border border-[#D4AF37]/15 bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                {/* Header */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D4AF37]/10 bg-white/[0.03] px-4 py-3">
                    <button onClick={() => navigate('prev')} className="flex items-center rounded-full border border-[#D4AF37]/20 bg-white/[0.03] px-4 py-2 text-sm text-[#D4AF37] transition hover:bg-[#D4AF37]/10">
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-base font-semibold capitalize text-white">{title}</h2>
                        <div className="flex rounded-full border border-[#D4AF37]/20 bg-black/30 p-0.5">
                            {(['day', 'week', 'month'] as CalendarView[]).map(v => (
                                <button key={v} onClick={() => switchView(v)}
                                    className={`rounded-full px-4 py-1 text-xs font-semibold tracking-wide transition-all duration-200 ${view === v ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-[#D4AF37]'}`}>
                                    {v === 'day' ? tr('admin_view_day', lang) : v === 'week' ? tr('admin_view_week', lang) : tr('admin_view_month', lang)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={() => navigate('next')} className="flex items-center rounded-full border border-[#D4AF37]/20 bg-white/[0.03] px-4 py-2 text-sm text-[#D4AF37] transition hover:bg-[#D4AF37]/10">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#D4AF37]/10 bg-white/[0.02]">
                        <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-[#151515]">
                        {view === 'day'   && <TimeGrid days={[currentDate]} />}
                        {view === 'week'  && <TimeGrid days={Array.from({ length: 7 }, (_, i) => addDays(currentDate, i))} />}
                        {view === 'month' && <MonthGrid />}
                    </div>
                )}

                {/* Légende */}
                <div className="mt-4 rounded-2xl border border-[#D4AF37]/10 bg-white/[0.02] px-4 py-3">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#D4AF37]/60">
                        {tr('admin_legend', lang)}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {([0, 1, 2, 3, 4] as const).map(n => (
                            <div key={n} className="flex items-center gap-2 rounded-full border border-white/5 bg-black/30 px-3 py-1.5">
                                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_COLOR[n] ?? 'bg-gray-400'}`} />
                                <span className="text-xs font-medium text-gray-300">{tr(`status_${n}`, lang)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detail modal */}
            {selected && (
                <DetailModal
                    appointment={selected}
                    onClose={() => setSelected(null)}
                    onConfirm={() => handleStatusChange(selected, 'confirm')}
                    onComplete={() => handleStatusChange(selected, 'complete')}
                    onCancel={() => handleStatusChange(selected, 'cancel')}
                    loading={isLoadingId(selected.id)}
                />
            )}
        </>
    );
}
