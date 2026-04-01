'use client';

import { useEffect, useRef, useState } from 'react';
import {
    Loader2, RefreshCw, Search, X, ChevronDown, ChevronLeft, ChevronRight,
    User2, Mail, CalendarDays, NotebookPen, RotateCcw, ArrowUpDown,
} from 'lucide-react';
import { AdminUserDTO, AdminUserAppointmentDTO, PagedUsersResponse } from '@/app/_models/models';
import { FetchUsersAdmin, FetchUserAdmin, UserFilters, DEFAULT_USER_FILTERS } from '@/app/_api/user-api';
import { useLang } from '@/app/_context/language-context';
import { tr } from '@/app/_config/translations';

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { dot: string; badge: string }> = {
    Pending:   { dot: 'bg-amber-400',   badge: 'bg-amber-400/10   text-amber-300'   },
    Confirmed: { dot: 'bg-blue-400',    badge: 'bg-blue-400/10    text-blue-300'    },
    Cancelled: { dot: 'bg-rose-400',    badge: 'bg-rose-400/10    text-rose-300'    },
    Completed: { dot: 'bg-emerald-400', badge: 'bg-emerald-400/10 text-emerald-300' },
    External:  { dot: 'bg-violet-400',  badge: 'bg-violet-400/10  text-violet-300'  },
};

const ROLE_STYLE: Record<string, string> = {
    Admin:    'bg-violet-500/15 text-violet-300 border-violet-500/30',
    Styliste: 'bg-[#D4AF37]/15 text-[#D4AF37]  border-[#D4AF37]/30',
    Client:   'bg-blue-500/15  text-blue-300   border-blue-500/30',
};

function initials(u: AdminUserDTO) {
    const a = u.firstName?.[0] ?? '';
    const b = u.lastName?.[0]  ?? '';
    return (a + b).toUpperCase() || '?';
}

function fullName(u: AdminUserDTO) {
    return [u.firstName, u.lastName].filter(Boolean).join(' ');
}

function formatApptDate(dateStr: string, lang: string) {
    return new Date(dateStr).toLocaleString(
        lang === 'es' ? 'es-MX' : lang === 'fr' ? 'fr-CA' : 'en-CA',
        { dateStyle: 'medium', timeStyle: 'short' }
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function ApptRow({ appt, lang }: { appt: AdminUserAppointmentDTO; lang: string }) {
    const style = STATUS_STYLE[appt.status] ?? { dot: 'bg-gray-400', badge: 'bg-gray-400/10 text-gray-400' };
    return (
        <div className="rounded-xl border border-white/5 bg-[#0d0d0d] px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                <span className="text-sm font-medium text-white">{appt.hairStyleName}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.badge}`}>
                    {appt.status}
                </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <CalendarDays className="h-3 w-3 shrink-0" />
                {formatApptDate(appt.appointmentDate, lang)}
            </div>
            {appt.styleNotes && (
                <div className="mt-2 flex items-start gap-1.5">
                    <NotebookPen className="mt-0.5 h-3 w-3 shrink-0 text-[#D4AF37]/60" />
                    <p className="text-xs italic text-[#D4AF37]/70 line-clamp-2">{appt.styleNotes}</p>
                </div>
            )}
        </div>
    );
}

function UserCard({
    user: initialUser,
    lang,
}: {
    user: AdminUserDTO;
    lang: string;
}) {
    const [expanded,     setExpanded]     = useState(false);
    const [user,         setUser]         = useState(initialUser);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Keep card in sync when parent re-fetches
    useEffect(() => { setUser(initialUser); }, [initialUser]);

    const apptCount = user.appointments?.length ?? 0;
    const roleStyle = ROLE_STYLE[user.roleName] ?? 'bg-gray-500/15 text-gray-300 border-gray-500/30';

    const handleExpand = async () => {
        if (!expanded && apptCount === 0) {
            // Try fetching detail in case list didn't include appointments
            setLoadingDetail(true);
            try {
                const detail = await FetchUserAdmin(user.id);
                setUser(detail);
            } catch { /* keep existing */ }
            finally { setLoadingDetail(false); }
        }
        setExpanded(e => !e);
    };

    const refreshDetail = async () => {
        setLoadingDetail(true);
        try {
            const detail = await FetchUserAdmin(user.id);
            setUser(detail);
        } catch { /* ignore */ }
        finally { setLoadingDetail(false); }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-black transition-all">
            {/* ── Card header ── */}
            <div className="flex items-start gap-3 p-4 sm:gap-4 sm:p-5">
                {/* Avatar */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-sm font-bold text-[#D4AF37] sm:h-12 sm:w-12">
                    {initials(user)}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-base font-semibold text-white">{fullName(user) || '—'}</p>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${roleStyle}`}>
                            {user.roleName}
                        </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{user.email}</span>
                    </div>
                    {/* Appointment count pill */}
                    <div className="mt-2">
                        {apptCount === 0 ? (
                            <span className="text-xs text-gray-600">{tr('users_no_appts', lang as any)}</span>
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/8 px-2.5 py-1 text-xs font-medium text-[#D4AF37]/80">
                                <CalendarDays className="h-3 w-3" />
                                {apptCount === 1
                                    ? tr('users_appts_count_one', lang as any)
                                    : tr('users_appts_count', lang as any).replace('{n}', String(apptCount))}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: expand + refresh */}
                <div className="flex shrink-0 items-center gap-1.5">
                    {expanded && (
                        <button
                            onClick={refreshDetail}
                            disabled={loadingDetail}
                            className="rounded-xl border border-white/10 p-2 text-gray-500 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37] disabled:opacity-40"
                        >
                            {loadingDetail
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <RotateCcw className="h-3.5 w-3.5" />}
                        </button>
                    )}
                    <button
                        onClick={handleExpand}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                            expanded
                                ? 'border-[#D4AF37]/40 bg-[#D4AF37]/8 text-[#D4AF37]'
                                : 'border-white/10 text-gray-400 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]'
                        }`}
                    >
                        {loadingDetail && !expanded
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                        }
                        <span className="hidden sm:inline">
                            {expanded ? tr('users_hide_appts', lang as any) : tr('users_see_appts', lang as any)}
                        </span>
                    </button>
                </div>
            </div>

            {/* ── Appointments panel ── */}
            {expanded && (
                <div className="border-t border-[#D4AF37]/10 bg-[#060606] px-4 py-4 sm:px-5">
                    {loadingDetail && user.appointments.length === 0 ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-5 w-5 animate-spin text-[#D4AF37]" />
                        </div>
                    ) : user.appointments.length === 0 ? (
                        <p className="py-4 text-center text-sm text-gray-600">{tr('users_no_appts', lang as any)}</p>
                    ) : (
                        <div className="space-y-2">
                            {[...user.appointments]
                                .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                                .map(appt => (
                                    <ApptRow key={appt.id} appt={appt} lang={lang} />
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function UserManagement() {
    const { lang } = useLang();

    const [users,       setUsers]       = useState<AdminUserDTO[]>([]);
    const [loading,     setLoading]     = useState(true);
    const [filters,     setFilters]     = useState<UserFilters>(DEFAULT_USER_FILTERS);
    const [inputValue,  setInputValue]  = useState('');
    const [pageNumber,  setPageNumber]  = useState(1);
    const [totalPages,  setTotalPages]  = useState(1);
    const [totalCount,  setTotalCount]  = useState(0);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const load = async (page = 1, overrideFilters?: UserFilters) => {
        setLoading(true);
        try {
            const f = overrideFilters ?? filters;
            const data: PagedUsersResponse = await FetchUsersAdmin(page, f);
            setUsers(data.items ?? []);
            setPageNumber(data.pageNumber ?? 1);
            setTotalPages(data.totalPages ?? 1);
            setTotalCount(data.totalCount ?? 0);
        } catch (e) {
            console.error(e);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void load(1, filters); }, [filters]);

    const handleQueryChange = (val: string) => {
        setInputValue(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setFilters(f => ({ ...f, query: val }));
        }, 450);
    };

    const handleRole = (roleId: number | null) => {
        setFilters(f => ({ ...f, roleId }));
    };

    const handleDateMode = (mode: 'exact' | 'week' | 'month' | null) => {
        setFilters(f => ({
            ...f,
            dateFilterMode: f.dateFilterMode === mode ? null : mode,
            // clear date when mode is cleared
            filterDate: f.dateFilterMode === mode ? null : f.filterDate,
        }));
    };

    const handleDateChange = (val: string) => {
        setFilters(f => ({
            ...f,
            filterDate: val || null,
            // default to exact if user picks a date without a mode
            dateFilterMode: val ? (f.dateFilterMode ?? 'exact') : null,
        }));
    };

    const handleSort = (dir: 'asc' | 'desc' | null) => {
        setFilters(f => ({ ...f, sortByAppointments: f.sortByAppointments === dir ? null : dir }));
    };

    const clearAll = () => {
        setInputValue('');
        setFilters(DEFAULT_USER_FILTERS);
    };

    const ROLES: { id: number | null; label: string }[] = [
        { id: null, label: tr('users_role_all',     lang) },
        { id: 1,    label: tr('users_role_admin',   lang) },
        { id: 2,    label: tr('users_role_styliste', lang) },
        { id: 3,    label: tr('users_role_client',  lang) },
    ];

    const activeFilters = [
        filters.query.trim() !== '',
        filters.roleId !== null,
        filters.filterDate !== null,
        filters.sortByAppointments !== null,
    ].filter(Boolean).length;

    const renderPageNumbers = () => {
        const pages: number[] = [];
        for (let i = Math.max(1, pageNumber - 2); i <= Math.min(totalPages, pageNumber + 2); i++) pages.push(i);
        return pages.map(p => (
            <button
                key={p}
                onClick={() => void load(p)}
                className={`h-10 min-w-10 rounded-full px-3 text-sm transition-all ${
                    p === pageNumber
                        ? 'bg-[#D4AF37] text-black'
                        : 'border border-[#D4AF37]/20 bg-[#0a0a0a] text-[#D4AF37] hover:border-[#D4AF37]/40'
                }`}
            >{p}</button>
        ));
    };

    return (
        <section className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-4 sm:p-5">

            {/* ── Header ── */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-light text-white sm:text-2xl">{tr('users_title', lang)}</h2>
                    <p className="mt-1 text-sm text-gray-400">{tr('users_subtitle', lang)}</p>
                </div>
                <button
                    onClick={() => void load(pageNumber)}
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 px-4 py-2.5 text-sm text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black disabled:opacity-50 sm:w-auto sm:py-2"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {tr('admin_refresh', lang)}
                </button>
            </div>

            {/* ── Search bar ── */}
            <div className="mb-5 rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a] overflow-hidden">
                {/* Text input row */}
                <div className="flex items-center gap-2 px-3 py-3 sm:px-4">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => handleQueryChange(e.target.value)}
                            placeholder={tr('users_search_ph', lang)}
                            className="w-full rounded-xl border border-[#D4AF37]/15 bg-black py-2.5 pl-9 pr-8 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#D4AF37]/50"
                        />
                        {inputValue && (
                            <button
                                onClick={() => handleQueryChange('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-500 transition hover:text-white"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                    {activeFilters > 0 && (
                        <button
                            onClick={clearAll}
                            className="shrink-0 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-gray-500 transition hover:border-white/20 hover:text-white"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Role pills row */}
                <div className="flex items-center gap-2 overflow-x-auto border-t border-[#D4AF37]/10 px-3 py-2.5 pb-3 scrollbar-none sm:px-4">
                    <User2 className="h-3.5 w-3.5 shrink-0 text-gray-600" />
                    {ROLES.map(r => (
                        <button
                            key={r.id ?? 'all'}
                            onClick={() => handleRole(r.id)}
                            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                filters.roleId === r.id
                                    ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                                    : 'border-[#D4AF37]/20 text-gray-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                    {/* Total count */}
                    {!loading && totalCount > 0 && (
                        <span className="ml-auto shrink-0 text-xs text-gray-600">
                            {tr('users_total', lang).replace('{n}', String(totalCount))}
                        </span>
                    )}
                </div>

                {/* Date filter row */}
                <div className="flex flex-wrap items-center gap-2 border-t border-[#D4AF37]/10 px-3 py-2.5 pb-3 sm:px-4">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-600" />
                    <input
                        type="date"
                        value={filters.filterDate ?? ''}
                        onChange={e => handleDateChange(e.target.value)}
                        className="rounded-xl border border-[#D4AF37]/15 bg-black px-3 py-1.5 text-xs text-white outline-none transition focus:border-[#D4AF37]/50 [color-scheme:dark]"
                    />
                    {(['exact', 'week', 'month'] as const).map(mode => (
                        <button
                            key={mode}
                            onClick={() => handleDateMode(mode)}
                            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                filters.dateFilterMode === mode
                                    ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                                    : 'border-[#D4AF37]/20 text-gray-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
                            }`}
                        >
                            {tr(`users_date_${mode}` as any, lang)}
                        </button>
                    ))}
                </div>

                {/* Sort row */}
                <div className="flex flex-wrap items-center gap-2 border-t border-[#D4AF37]/10 px-3 py-2.5 pb-3 sm:px-4">
                    <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-gray-600" />
                    <span className="text-xs text-gray-600">{tr('users_sort_label', lang)}</span>
                    {(['asc', 'desc'] as const).map(dir => (
                        <button
                            key={dir}
                            onClick={() => handleSort(dir)}
                            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                filters.sortByAppointments === dir
                                    ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                                    : 'border-[#D4AF37]/20 text-gray-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
                            }`}
                        >
                            {tr(`users_sort_${dir}` as any, lang)}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
                </div>
            ) : users.length === 0 ? (
                <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/20 bg-black text-gray-400">
                    {tr('users_empty', lang)}
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {users.map(u => (
                            <UserCard key={u.id} user={u} lang={lang} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                onClick={() => void load(pageNumber - 1)}
                                disabled={pageNumber === 1}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/20 px-4 py-2.5 text-sm text-[#D4AF37] transition-all disabled:opacity-40 sm:py-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                {tr('admin_prev', lang)}
                            </button>

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {renderPageNumbers()}
                            </div>

                            <button
                                onClick={() => void load(pageNumber + 1)}
                                disabled={pageNumber === totalPages}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/20 px-4 py-2.5 text-sm text-[#D4AF37] transition-all disabled:opacity-40 sm:py-2"
                            >
                                {tr('admin_next', lang)}
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <p className="mt-3 text-center text-sm text-gray-500">
                        {tr('admin_page_of', lang).replace('{n}', String(pageNumber)).replace('{t}', String(totalPages))}
                    </p>
                </>
            )}
        </section>
    );
}
