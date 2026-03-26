'use client';

import { useEffect, useState } from 'react';
import { addDays, startOfWeek, format } from 'date-fns';
import {
    FetchAdminCalendarAppointments,
    UpdateAppointmentStatusAdmin,
    AcceptAppointmentAdmin,
} from '@/app/_api/appointment-api';
import { Loader2, Clock3, User2, Scissors, StickyNote } from 'lucide-react';
import { AdminCalendarAppointmentDTO } from '../_models/models';

const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i);
const HOUR_HEIGHT = 96;
const PX_PER_MINUTE = HOUR_HEIGHT / 60;

const formatLocalDateForApi = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');

    return `${y}-${m}-${d}T${h}:${min}:${s}`;
};

const parseLocalDate = (value: string) => {
    const [datePart, timePart] = value.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hour, minute, second || 0);
};

export default function AdminCalendar() {
    const [appointments, setAppointments] = useState<AdminCalendarAppointmentDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingIds, setLoadingIds] = useState<number[]>([]);
    const [currentWeek, setCurrentWeek] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );

    const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

    useEffect(() => {
        void loadAppointments(currentWeek);
    }, [currentWeek]);

    const loadAppointments = async (weekStartDate: Date) => {
        try {
            setLoading(true);
            const data = await FetchAdminCalendarAppointments(
                formatLocalDateForApi(weekStartDate)
            );
            setAppointments(data ?? []);
        } catch (e) {
            console.error(e);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (
        appointment: AdminCalendarAppointmentDTO,
        type: 'confirm' | 'complete'
    ) => {
        const currentStatus = Number(appointment.status);

        let newStatus = currentStatus;
        if (type === 'confirm' && currentStatus === 0) newStatus = 1;
        if (type === 'complete' && currentStatus === 1) newStatus = 3;

        if (newStatus === currentStatus) return;

        setLoadingIds((prev) => [...prev, appointment.id]);

        try {
            if (type === 'confirm') {
                await AcceptAppointmentAdmin(appointment.id);
            } else {
                await UpdateAppointmentStatusAdmin(appointment.id, newStatus);
            }

            setAppointments((prev) =>
                prev.map((a) =>
                    a.id === appointment.id ? { ...a, status: newStatus } : a
                )
            );
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingIds((prev) => prev.filter((id) => id !== appointment.id));
        }
    };

    const getAppointmentsForDay = (day: Date) => {
        return appointments
            .filter((a) => {
                const date = parseLocalDate(a.appointmentDate);

                return (
                    date.getFullYear() === day.getFullYear() &&
                    date.getMonth() === day.getMonth() &&
                    date.getDate() === day.getDate()
                );
            })
            .sort(
                (a, b) =>
                    parseLocalDate(a.appointmentDate).getTime() -
                    parseLocalDate(b.appointmentDate).getTime()
            );
    };

    const getCardTheme = (status: number) => {
        switch (status) {
            case 0:
                return {
                    card: 'bg-amber-500/95 border-amber-300/60 text-white shadow-amber-900/20',
                    pill: 'bg-white/20 text-white border-white/20',
                };
            case 1:
                return {
                    card: 'bg-blue-600/95 border-blue-300/60 text-white shadow-blue-900/20',
                    pill: 'bg-white/20 text-white border-white/20',
                };
            case 2:
                return {
                    card: 'bg-rose-600/95 border-rose-300/60 text-white shadow-rose-900/20',
                    pill: 'bg-white/20 text-white border-white/20',
                };
            case 3:
                return {
                    card: 'bg-emerald-600/95 border-emerald-300/60 text-white shadow-emerald-900/20',
                    pill: 'bg-white/20 text-white border-white/20',
                };
            case 4:
                return {
                    card: 'bg-violet-600/95 border-violet-300/60 text-white shadow-violet-900/20',
                    pill: 'bg-white/20 text-white border-white/20',
                };
            default:
                return {
                    card: 'bg-slate-600/95 border-slate-300/60 text-white shadow-slate-900/20',
                    pill: 'bg-white/20 text-white border-white/20',
                };
        }
    };

    const isLoading = (id: number) => loadingIds.includes(id);

    return (
        <div className="mt-6 rounded-3xl border border-[#D4AF37]/15 bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-[#D4AF37]/10 bg-white/[0.03] px-4 py-3">
                <button
                    onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                    className="rounded-full border border-[#D4AF37]/20 bg-white/[0.03] px-4 py-2 text-sm text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
                >
                    Prev
                </button>

                <h2 className="text-lg font-semibold text-white">
                    {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d, yyyy')}
                </h2>

                <button
                    onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                    className="rounded-full border border-[#D4AF37]/20 bg-white/[0.03] px-4 py-2 text-sm text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
                >
                    Next
                </button>
            </div>

            {loading ? (
                <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#D4AF37]/10 bg-white/[0.02]">
                    <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-[#151515]">
                    <div className="grid grid-cols-8">
                        <div className="bg-[#181818]">
                            <div className="h-14 border-b border-[#D4AF37]/10 bg-[#1b1b1b]" />
                            {HOURS.map((hour) => (
                                <div
                                    key={hour}
                                    className="h-24 border-b border-[#D4AF37]/10 px-3 py-2 text-xs font-medium text-gray-400"
                                >
                                    <span className="rounded-full bg-white/[0.04] px-2 py-1">
                                        {hour}:00
                                    </span>
                                </div>
                            ))}
                        </div>

                        {days.map((day, i) => {
                            const dayAppointments = getAppointmentsForDay(day);
                            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                            return (
                                <div
                                    key={i}
                                    className="border-l border-[#D4AF37]/10 bg-[#141414]"
                                >
                                    <div
                                        className={`h-14 border-b border-[#D4AF37]/10 px-2 py-2 text-center ${isToday ? 'bg-[#D4AF37]/10' : 'bg-[#181818]'
                                            }`}
                                    >
                                        <div className="text-xs uppercase tracking-wide text-gray-400">
                                            {format(day, 'EEE')}
                                        </div>
                                        <div className={`text-sm font-semibold ${isToday ? 'text-[#D4AF37]' : 'text-white'}`}>
                                            {format(day, 'd')}
                                        </div>
                                    </div>

                                    <div
                                        className="relative"
                                        style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}
                                    >
                                        {HOURS.map((hour) => (
                                            <div
                                                key={hour}
                                                className="h-24 border-b border-[#D4AF37]/10 bg-[linear-gradient(to_bottom,transparent_95%,rgba(212,175,55,0.06)_100%)]"
                                            />
                                        ))}

                                        {dayAppointments.map((a) => {
                                            const date = parseLocalDate(a.appointmentDate);
                                            const duration =
                                                (a as any).durationMinutes ??
                                                a.externalDurationMinutes ??
                                                60;

                                            const top =
                                                ((date.getHours() - HOURS[0]) * 60 + date.getMinutes()) *
                                                PX_PER_MINUTE;

                                            const height = Math.max(duration * PX_PER_MINUTE, 60);
                                            const visualHeight = Math.max(duration * PX_PER_MINUTE - 10, 60);
                                            const offset = (height - visualHeight) / 2;
                                            const compact = height < 88;
                                            const ultraCompact = height < 68;
                                            const theme = getCardTheme(Number(a.status));

                                            return (
                                                <div
                                                    key={a.id}
                                                    onClick={() => {
                                                        if (Number(a.status) !== 3 && !isLoading(a.id)) {
                                                            handleStatusChange(a, 'complete');
                                                        }
                                                    }}
                                                    onDoubleClick={() => {
                                                        if (Number(a.status) !== 3 && !isLoading(a.id)) {
                                                            handleStatusChange(a, 'confirm');
                                                        }
                                                    }}
                                                    className={`absolute left-1.5 right-1.5 rounded-2xl border p-3 shadow-lg backdrop-blur-[2px] ${theme.card} ${Number(a.status) === 3 || isLoading(a.id)
                                                            ? 'cursor-default'
                                                            : 'cursor-pointer'
                                                        }`}
                                                    style={{
                                                        top: `${top + offset}px`,
                                                        height: `${visualHeight}px`,
                                                    }}
                                                >
                                                    <div className={`flex h-full flex-col ${height < 90 ? 'justify-center' : 'justify-between'}`}>
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-1.5">
                                                                    <Scissors className="h-3.5 w-3.5 shrink-0 opacity-90" />
                                                                    <p className="truncate text-[11px] font-semibold uppercase tracking-wide opacity-90">
                                                                        {a.hairStyleName || 'Appointment'}
                                                                    </p>
                                                                </div>

                                                                {!ultraCompact && (
                                                                    <div className="mt-1 flex items-center gap-1.5">
                                                                        <User2 className="h-3.5 w-3.5 shrink-0 opacity-80" />
                                                                        <p className="truncate text-sm font-semibold">
                                                                            {a.userName || 'Client'}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div
                                                                className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${theme.pill}`}
                                                            >
                                                                {format(date, 'HH:mm')}
                                                            </div>
                                                        </div>

                                                        {!ultraCompact && (
                                                            <div className="mt-2 flex items-center gap-1.5 text-[11px] opacity-90">
                                                                <Clock3 className="h-3.5 w-3.5 shrink-0" />
                                                                <span>{duration} min</span>
                                                            </div>
                                                        )}

                                                        {!compact && (
                                                            <div className="mt-2 min-h-0 flex-1 overflow-hidden">
                                                                <div className="rounded-xl bg-black/10 px-2 py-1.5">
                                                                    <div className="flex items-start gap-1.5">
                                                                        <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-80" />
                                                                        <p className="line-clamp-3 text-[11px] leading-relaxed opacity-95">
                                                                            {a.status === 4
                                                                                ? a.notes || 'External'
                                                                                : `${a.priceMin}${a.priceMax != null ? ` - ${a.priceMax}` : ''} CAD`}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {compact && !ultraCompact && (
                                                            <div className="mt-auto truncate text-[11px] opacity-90">
                                                                {a.status === 4
                                                                    ? a.notes || 'External'
                                                                    : `${a.priceMin}${a.priceMax != null ? ` - ${a.priceMax}` : ''} CAD`}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {isLoading(a.id) && (
                                                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/25">
                                                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}