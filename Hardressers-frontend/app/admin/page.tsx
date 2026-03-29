'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_context/auth-context';
import { useLang } from '@/app/_context/language-context';
import { FetchAllAppointmentsAdmin, UpdateAppointmentStatusAdmin } from '@/app/_api/appointment-api';
import { AppointmentResponseDTO } from '@/app/_models/models';
import { tr } from '@/app/_config/translations';
import { getHairStyleDisplay } from '@/app/_config/hairstyle-descriptions';
import AdminCalendar from './admin-calendar';

type AdminTab = 'appointments' | 'calendar';
type PagedAppointmentsResponse = {
    items: AppointmentResponseDTO[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
};

export default function AdminPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { lang } = useLang();

    const [activeTab, setActiveTab] = useState<AdminTab>('appointments');
    const [appointments, setAppointments] = useState<AppointmentResponseDTO[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const STATUS_OPTIONS = [
        { value: 0, label: tr('status_0', lang) },
        { value: 1, label: tr('status_1', lang) },
        { value: 2, label: tr('status_2', lang) },
        { value: 3, label: tr('status_3', lang) },
        { value: 4, label: tr('status_4', lang) },
    ];

    useEffect(() => {
        if (!loading && (!user || !user.app_metadata?.isAdmin)) router.replace('/');
    }, [loading, user, router]);

    useEffect(() => {
        if (!loading && user?.app_metadata?.isAdmin) void loadAppointments(1);
    }, [loading, user]);

    const loadAppointments = async (page = 1) => {
        try {
            setLoadingAppointments(true);
            const data: PagedAppointmentsResponse = await FetchAllAppointmentsAdmin(page);
            setAppointments(data.items ?? []);
            setPageNumber(data.pageNumber ?? 1);
            setTotalPages(data.totalPages ?? 1);
        } catch (e) {
            console.error(e);
            setAppointments([]);
        } finally {
            setLoadingAppointments(false);
        }
    };

    const handleStatusChange = async (id: number, status: number) => {
        try {
            setSavingId(id);
            await UpdateAppointmentStatusAdmin(id, status);
            setAppointments(prev => prev.map((a: any) => a.id === id ? { ...a, status } : a));
        } catch (e) { console.error(e); }
        finally { setSavingId(null); }
    };

    const renderPageNumbers = () => {
        const pages: number[] = [];
        for (let i = Math.max(1, pageNumber - 2); i <= Math.min(totalPages, pageNumber + 2); i++) pages.push(i);
        return pages.map(page => (
            <button
                key={page}
                onClick={() => loadAppointments(page)}
                className={`h-10 min-w-10 rounded-full px-3 text-sm transition-all ${page === pageNumber
                    ? 'bg-[#D4AF37] text-black'
                    : 'border border-[#D4AF37]/20 bg-[#0a0a0a] text-[#D4AF37] hover:border-[#D4AF37]/40'}`}
            >
                {page}
            </button>
        ));
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleString(
            lang === 'es' ? 'es-MX' : lang === 'fr' ? 'fr-CA' : 'en-CA',
            { dateStyle: 'medium', timeStyle: 'short' }
        );

    if (loading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
            </div>
        );
    }

    if (!user.app_metadata?.isAdmin) return null;

    const tabClass = (tab: AdminTab) =>
        `inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm transition-all ${activeTab === tab
            ? 'bg-[#D4AF37] text-black'
            : 'border border-[#D4AF37]/20 bg-[#0a0a0a] text-[#D4AF37] hover:border-[#D4AF37]/40'}`;

    return (
        <div className="min-h-screen bg-black px-6 pb-12 pt-28 text-white">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-light">{tr('admin_title', lang)}</h1>
                    <p className="mt-2 text-gray-400">{tr('admin_subtitle', lang)}</p>
                </div>

                {/* Tabs */}
                <div className="mb-8 flex flex-wrap gap-3 border-b border-[#D4AF37]/10 pb-4">
                    <button onClick={() => setActiveTab('appointments')} className={tabClass('appointments')}>
                        <Calendar className="h-4 w-4" />
                        {tr('admin_tab_appts', lang)}
                    </button>
                    <button onClick={() => setActiveTab('calendar')} className={tabClass('calendar')}>
                        {tr('admin_tab_calendar', lang)}
                    </button>
                </div>

                {/* Appointments tab */}
                {activeTab === 'appointments' && (
                    <section className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-5">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-light">{tr('admin_appts_title', lang)}</h2>
                                <p className="mt-2 text-gray-400">{tr('admin_appts_subtitle', lang)}</p>
                            </div>
                            <button
                                onClick={() => loadAppointments(pageNumber)}
                                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 px-4 py-2 text-sm text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black"
                            >
                                <RefreshCw className="h-4 w-4" />
                                {tr('admin_refresh', lang)}
                            </button>
                        </div>

                        {loadingAppointments ? (
                            <div className="flex min-h-[300px] items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/20 bg-black text-gray-400">
                                {tr('admin_no_appts', lang)}
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {appointments.map((appt: any) => {
                                        const displayName = getHairStyleDisplay(
                                            appt.hairStyleName ?? appt.hairStyle?.name ?? '',
                                            lang
                                        ).title || appt.hairStyleName || 'Appointment';

                                        return (
                                            <div key={appt.id} className="rounded-2xl border border-[#D4AF37]/10 bg-black p-5">
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                    <div>
                                                        <p className="text-lg font-medium text-white">{displayName}</p>
                                                        <p className="mt-1 text-sm text-gray-400">
                                                            {appt.userName ?? appt.user?.firstName ?? 'Client'}
                                                        </p>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {formatDate(appt.appointmentDate)}
                                                        </p>
                                                    </div>

                                                    <div className="w-full lg:w-72">
                                                        <label className="mb-2 block text-sm text-gray-400">
                                                            {tr('admin_status_label', lang)}
                                                        </label>
                                                        <select
                                                            value={appt.status}
                                                            onChange={e => handleStatusChange(appt.id, Number(e.target.value))}
                                                            disabled={savingId === appt.id}
                                                            className="w-full rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a] px-4 py-3 text-white outline-none"
                                                        >
                                                            {STATUS_OPTIONS.map(opt => (
                                                                <option key={opt.value} value={opt.value} className="bg-black text-white">
                                                                    {opt.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {savingId === appt.id && (
                                                            <p className="mt-2 text-sm text-[#D4AF37]">
                                                                {tr('admin_updating', lang)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        onClick={() => loadAppointments(pageNumber - 1)}
                                        disabled={pageNumber === 1}
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/20 px-4 py-2 text-sm text-[#D4AF37] transition-all disabled:opacity-40"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        {tr('admin_prev', lang)}
                                    </button>

                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        {renderPageNumbers()}
                                    </div>

                                    <button
                                        onClick={() => loadAppointments(pageNumber + 1)}
                                        disabled={pageNumber === totalPages}
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/20 px-4 py-2 text-sm text-[#D4AF37] transition-all disabled:opacity-40"
                                    >
                                        {tr('admin_next', lang)}
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>

                                <p className="mt-3 text-center text-sm text-gray-500">
                                    {tr('admin_page_of', lang).replace('{n}', String(pageNumber)).replace('{t}', String(totalPages))}
                                </p>
                            </>
                        )}
                    </section>
                )}

                {activeTab === 'calendar' && <AdminCalendar />}
            </div>
        </div>
    );
}
