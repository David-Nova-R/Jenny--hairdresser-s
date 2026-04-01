'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, RefreshCw, Calendar, ChevronLeft, ChevronRight, ChevronDown, Check, CalendarOff, NotebookPen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_context/auth-context';
import { useLang } from '@/app/_context/language-context';
import { tr } from '@/app/_config/translations';
import { getHairStyleDisplay } from '@/app/_config/hairstyle-descriptions';
import {
    FetchAllAppointmentsAdmin,
    FetchHairStyles,
    UpdateAppointmentStatusAdmin,
    UpdateStyleNotes,
    AppointmentFilters,
    DEFAULT_FILTERS,
} from '@/app/_api/appointment-api';
import AppointmentSearchBar from '@/app/_components/AppointmentSearchBar';
import { AppointmentResponseDTO, HairStyleWithPhotos } from '@/app/_models/models';
import AdminCalendar from './admin-calendar';
import HairStyleGalleryManager from './hairstyle-gallery-manager';
import AdminReviews from './admin-reviews';
import PortfolioAdminManager from './portfolio-admin-manager';
import DaysOffManager from './DaysOffManager';
import UserManagement from './UserManagement';

type AdminTab = 'appointments' | 'calendar' | 'daysoff' | 'photos' | 'portfolio' | 'reviews' | 'users';

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
    const [hairStyles, setHairStyles] = useState<HairStyleWithPhotos[]>([]);
    const [loadingPhotos, setLoadingPhotos] = useState(false);

    const STATUS_OPTIONS = [
        { value: 0, label: tr('status_0', lang), dot: 'bg-amber-400',   bg: 'hover:bg-amber-400/10'   },
        { value: 1, label: tr('status_1', lang), dot: 'bg-blue-400',    bg: 'hover:bg-blue-400/10'    },
        { value: 2, label: tr('status_2', lang), dot: 'bg-rose-400',    bg: 'hover:bg-rose-400/10'    },
        { value: 3, label: tr('status_3', lang), dot: 'bg-emerald-400', bg: 'hover:bg-emerald-400/10' },
        { value: 4, label: tr('status_4', lang), dot: 'bg-violet-400',  bg: 'hover:bg-violet-400/10'  },
    ];

    const [filters, setFilters] = useState<AppointmentFilters>(DEFAULT_FILTERS);

    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Style notes
    const [editingNotesId, setEditingNotesId]   = useState<number | null>(null);
    const [notesDraft,     setNotesDraft]        = useState<Record<number, string>>({});
    const [savingNotesId,  setSavingNotesId]     = useState<number | null>(null);
    const [notesSavedId,   setNotesSavedId]      = useState<number | null>(null);
    const [notesError,     setNotesError]        = useState<number | null>(null);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
                setOpenDropdownId(null);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    useEffect(() => {
        if (!loading && (!user || !user.app_metadata?.isAdmin)) router.replace('/');
    }, [loading, user, router]);

    useEffect(() => {
        if (!loading && user?.app_metadata?.isAdmin) void loadAppointments(1);
    }, [loading, user]);

    useEffect(() => {
        if (activeTab === 'photos') {
            void loadHairStyles();
        }
    }, [activeTab]);

    const loadAppointments = async (page = 1, overrideFilters?: AppointmentFilters) => {
        try {
            setLoadingAppointments(true);
            const activeFilters = overrideFilters ?? filters;
            const data: PagedAppointmentsResponse = await FetchAllAppointmentsAdmin(page, activeFilters);
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

    // Re-fetch page 1 whenever filters change
    useEffect(() => {
        if (!loading && user?.app_metadata?.isAdmin) {
            void loadAppointments(1, filters);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const loadHairStyles = async () => {
        try {
            setLoadingPhotos(true);
            const data = await FetchHairStyles();
            console.log('Loaded hairstyles:', data);
            setHairStyles(data);
        } catch (error) {
            console.error('Failed to load hairstyles:', error);
            setHairStyles([]);
        } finally {
            setLoadingPhotos(false);
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

    const openNotesEditor = (appt: any) => {
        setEditingNotesId(appt.id);
        setNotesDraft(prev => ({ ...prev, [appt.id]: appt.styleNotes ?? '' }));
        setNotesSavedId(null);
        setNotesError(null);
    };

    const handleSaveNotes = async (id: number) => {
        try {
            setSavingNotesId(id);
            setNotesError(null);
            await UpdateStyleNotes(id, notesDraft[id] ?? '');
            setAppointments(prev => prev.map((a: any) => a.id === id ? { ...a, styleNotes: notesDraft[id] } : a));
            setNotesSavedId(id);
            setTimeout(() => setNotesSavedId(null), 2500);
            setEditingNotesId(null);
        } catch (e) {
            console.error(e);
            setNotesError(id);
        } finally {
            setSavingNotesId(null);
        }
    };

    const renderPageNumbers = () => {
        const pages: number[] = [];
        for (let i = Math.max(1, pageNumber - 2); i <= Math.min(totalPages, pageNumber + 2); i++) pages.push(i);
        return pages.map(page => (
            <button
                key={page}
                onClick={() => void loadAppointments(page)}
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
        `inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:gap-2 sm:px-5 sm:py-3 sm:text-sm transition-all ${activeTab === tab
            ? 'bg-[#D4AF37] text-black'
            : 'border border-[#D4AF37]/20 bg-[#0a0a0a] text-[#D4AF37] hover:border-[#D4AF37]/40'}`;

    return (
        <div className="min-h-screen bg-black px-6 pb-12 pt-28 text-white">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-light sm:text-4xl">{tr('admin_title', lang)}</h1>
                    <p className="mt-2 text-sm text-gray-400 sm:text-base">{tr('admin_subtitle', lang)}</p>
                </div>

                {/* Tabs */}
                <div className="mb-8 flex flex-wrap gap-2 border-b border-[#D4AF37]/10 pb-4 sm:gap-3">
                    <button onClick={() => setActiveTab('appointments')} className={tabClass('appointments')}>
                        <Calendar className="h-4 w-4" />
                        {tr('admin_tab_appts', lang)}
                    </button>
                    <button onClick={() => setActiveTab('calendar')} className={tabClass('calendar')}>
                        {tr('admin_tab_calendar', lang)}
                    </button>
                    <button onClick={() => setActiveTab('daysoff')} className={tabClass('daysoff')}>
                        <CalendarOff className="h-4 w-4" />
                        {tr('admin_tab_daysoff', lang)}
                    </button>
                    <button onClick={() => setActiveTab('users')} className={tabClass('users')}>
                        {tr('admin_tab_users', lang)}
                    </button>
                    <button onClick={() => setActiveTab('photos')} className={tabClass('photos')}>
                        {tr('admin_tab_photos', lang)}
                    </button>
                    <button onClick={() => setActiveTab('portfolio')} className={tabClass('portfolio')}>
                        {tr('admin_tab_portfolio', lang)}
                    </button>
                    <button onClick={() => setActiveTab('reviews')} className={tabClass('reviews')}>
                        {tr('admin_tab_reviews', lang)}
                    </button>
                </div>

                {/* Appointments tab */}
                {activeTab === 'appointments' && (
                    <section className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-5">
                        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-light sm:text-2xl">{tr('admin_appts_title', lang)}</h2>
                                <p className="mt-1 text-sm text-gray-400">{tr('admin_appts_subtitle', lang)}</p>
                            </div>
                            <button
                                onClick={() => loadAppointments(pageNumber)}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 px-4 py-2.5 text-sm text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black sm:w-auto sm:py-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                {tr('admin_refresh', lang)}
                            </button>
                        </div>

                        {/* Search + filters */}
                        <AppointmentSearchBar
                            filters={filters}
                            onChange={f => { setFilters(f); }}
                            resultCount={appointments.length}
                            loading={loadingAppointments}
                        />

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
                                        ).title || appt.hairStyleName || tr('admin_appointment', lang);

                                        return (
                                            <div key={appt.id} className="rounded-2xl border border-[#D4AF37]/10 bg-black p-5">
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                    {/* Left: info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-lg font-medium text-white">{displayName}</p>
                                                        <p className="mt-1 text-sm text-gray-400">
                                                            {appt.userName ?? appt.user?.firstName ?? tr('admin_client', lang)}
                                                        </p>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {formatDate(appt.appointmentDate)}
                                                        </p>
                                                        {/* Existing notes preview */}
                                                        {appt.styleNotes && editingNotesId !== appt.id && (
                                                            <p className="mt-2 text-xs text-[#D4AF37]/70 italic line-clamp-2">
                                                                📝 {appt.styleNotes}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Right: status + notes button */}
                                                    <div className="flex flex-col gap-3 lg:w-72">
                                                        <div ref={dropdownRef}>
                                                            <label className="mb-2 block text-sm text-gray-400">
                                                                {tr('admin_status_label', lang)}
                                                            </label>
                                                            <div className="relative">
                                                                {/* Trigger */}
                                                                <button
                                                                    disabled={savingId === appt.id}
                                                                    onClick={() => setOpenDropdownId(openDropdownId === appt.id ? null : appt.id)}
                                                                    className="flex w-full items-center justify-between rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a] px-4 py-3 text-left transition-all hover:border-[#D4AF37]/50 disabled:opacity-50"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        {savingId === appt.id
                                                                            ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D4AF37]" />
                                                                            : <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_OPTIONS.find(o => o.value === Number(appt.status))?.dot ?? 'bg-gray-400'}`} />
                                                                        }
                                                                        <span className="text-sm text-white">
                                                                            {STATUS_OPTIONS.find(o => o.value === Number(appt.status))?.label ?? '—'}
                                                                        </span>
                                                                    </div>
                                                                    <ChevronDown className={`h-4 w-4 text-[#D4AF37] transition-transform duration-200 ${openDropdownId === appt.id ? 'rotate-180' : ''}`} />
                                                                </button>

                                                                {/* Options */}
                                                                {openDropdownId === appt.id && (
                                                                    <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#111] shadow-2xl shadow-black/60">
                                                                        {STATUS_OPTIONS.map(opt => (
                                                                            <button
                                                                                key={opt.value}
                                                                                onClick={() => {
                                                                                    handleStatusChange(appt.id, opt.value);
                                                                                    setOpenDropdownId(null);
                                                                                }}
                                                                                className={`flex w-full items-center gap-3 px-4 py-3 text-sm text-white transition-colors ${opt.bg} ${Number(appt.status) === opt.value ? 'bg-white/5' : ''}`}
                                                                            >
                                                                                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${opt.dot}`} />
                                                                                <span className="flex-1 text-left">{opt.label}</span>
                                                                                {Number(appt.status) === opt.value && (
                                                                                    <Check className="h-3.5 w-3.5 text-[#D4AF37]" />
                                                                                )}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Notes button */}
                                                        <button
                                                            onClick={() => editingNotesId === appt.id
                                                                ? setEditingNotesId(null)
                                                                : openNotesEditor(appt)
                                                            }
                                                            className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm transition-all ${
                                                                editingNotesId === appt.id
                                                                    ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37]'
                                                                    : appt.styleNotes
                                                                        ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5 text-[#D4AF37]/80 hover:bg-[#D4AF37]/10'
                                                                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]'
                                                            }`}
                                                        >
                                                            <NotebookPen className="h-4 w-4 shrink-0" />
                                                            {appt.styleNotes
                                                                ? tr('appt_style_notes_edit', lang)
                                                                : tr('appt_style_notes_add', lang)}
                                                        </button>

                                                        {/* Saved toast */}
                                                        {notesSavedId === appt.id && (
                                                            <p className="text-center text-xs text-emerald-400">{tr('appt_style_notes_saved', lang)}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Inline notes editor */}
                                                {editingNotesId === appt.id && (
                                                    <div className="mt-4 border-t border-[#D4AF37]/10 pt-4">
                                                        <label className="mb-2 block text-sm font-medium text-[#D4AF37]">
                                                            {tr('appt_style_notes', lang)}
                                                        </label>
                                                        <textarea
                                                            rows={4}
                                                            value={notesDraft[appt.id] ?? ''}
                                                            onChange={e => setNotesDraft(prev => ({ ...prev, [appt.id]: e.target.value }))}
                                                            placeholder={tr('appt_style_notes_ph', lang)}
                                                            className="w-full resize-y rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#D4AF37]/50"
                                                        />
                                                        {notesError === appt.id && (
                                                            <p className="mt-1 text-xs text-rose-400">{tr('appt_style_notes_error', lang)}</p>
                                                        )}
                                                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
                                                            <button
                                                                onClick={() => handleSaveNotes(appt.id)}
                                                                disabled={savingNotesId === appt.id}
                                                                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-medium text-black transition-all hover:bg-[#F4D03F] disabled:opacity-60 sm:w-auto sm:py-2"
                                                            >
                                                                {savingNotesId === appt.id
                                                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                    : <Check className="h-3.5 w-3.5" />
                                                                }
                                                                {tr('appt_style_notes_save', lang)}
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingNotesId(null)}
                                                                className="w-full rounded-full border border-white/10 px-5 py-3 text-sm text-gray-400 transition-all hover:border-white/20 hover:text-white sm:w-auto sm:py-2"
                                                            >
                                                                {tr('appt_style_notes_cancel', lang)}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        onClick={() => void loadAppointments(pageNumber - 1)}
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
                                        onClick={() => void loadAppointments(pageNumber + 1)}
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
                {activeTab === 'photos' && (
                    <section className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-5">
                        {loadingPhotos ? (
                            <div className="flex min-h-[300px] items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : (
                            <HairStyleGalleryManager
                                hairStyles={hairStyles}
                                isAdmin={true}
                                onRefresh={loadHairStyles}
                            />
                        )}
                    </section>
                )}
                {activeTab === 'portfolio' && <PortfolioAdminManager lang={lang} />}
                {activeTab === 'reviews'   && <AdminReviews />}
                {activeTab === 'daysoff'   && <DaysOffManager />}
                {activeTab === 'users'     && <UserManagement />}
            </div>
        </div>
    );
}
