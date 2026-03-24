'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_context/auth-context';
import {
    FetchAllAppointmentsAdmin,
    UpdateAppointmentStatusAdmin,
} from '@/app/_api/appointment-api';
import { AppointmentResponseDTO } from '@/app/_models/models';

const STATUS_OPTIONS = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Confirmed' },
    { value: 2, label: 'Cancelled' },
    { value: 3, label: 'Completed' },
];

type AdminTab = 'appointments';

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

    const [activeTab, setActiveTab] = useState<AdminTab>('appointments');
    const [appointments, setAppointments] = useState<AppointmentResponseDTO[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (!loading && (!user || !user.app_metadata?.isAdmin)) {
            router.replace('/');
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (!loading && user?.app_metadata?.isAdmin) {
            void loadAppointments(1);
        }
    }, [loading, user]);

    const loadAppointments = async (page = 1) => {
        try {
            setLoadingAppointments(true);

            const data: PagedAppointmentsResponse = await FetchAllAppointmentsAdmin(page);

            setAppointments(data.items ?? []);
            setPageNumber(data.pageNumber ?? 1);
            setTotalPages(data.totalPages ?? 1);
        } catch (error) {
            console.error('Failed to load appointments:', error);
            setAppointments([]);
        } finally {
            setLoadingAppointments(false);
        }
    };

    const handleStatusChange = async (appointmentId: number, status: number) => {
        try {
            setSavingId(appointmentId);
            await UpdateAppointmentStatusAdmin(appointmentId, status);

            setAppointments((prev) =>
                prev.map((appointment: any) =>
                    appointment.id === appointmentId
                        ? { ...appointment, status }
                        : appointment
                )
            );
        } catch (error) {
            console.error('Failed to update appointment status:', error);
        } finally {
            setSavingId(null);
        }
    };

    const renderPageNumbers = () => {
        const pages: number[] = [];

        const start = Math.max(1, pageNumber - 2);
        const end = Math.min(totalPages, pageNumber + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages.map((page) => (
            <button
                key={page}
                onClick={() => loadAppointments(page)}
                className={`h-10 min-w-10 rounded-full px-3 text-sm transition-all ${page === pageNumber
                        ? 'bg-[#D4AF37] text-black'
                        : 'border border-[#D4AF37]/20 bg-[#0a0a0a] text-[#D4AF37] hover:border-[#D4AF37]/40'
                    }`}
            >
                {page}
            </button>
        ));
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
            </div>
        );
    }

    if (!user.app_metadata?.isAdmin) return null;

    return (
        <div className="min-h-screen bg-black text-white pt-28 px-6 pb-12">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-light">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-400">
                        Manage appointments and, later, users and website content.
                    </p>
                </div>

                <div className="mb-8 flex flex-wrap gap-3 border-b border-[#D4AF37]/10 pb-4">
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm transition-all ${activeTab === 'appointments'
                                ? 'bg-[#D4AF37] text-black'
                                : 'border border-[#D4AF37]/20 bg-[#0a0a0a] text-[#D4AF37] hover:border-[#D4AF37]/40'
                            }`}
                    >
                        <Calendar className="h-4 w-4" />
                        Appointments
                    </button>
                </div>

                {activeTab === 'appointments' && (
                    <section className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-5">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-light">Appointments</h2>
                                <p className="mt-2 text-gray-400">
                                    Voir tous les rendez-vous et modifier leur status.
                                </p>
                            </div>

                            <button
                                onClick={() => loadAppointments(pageNumber)}
                                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 px-4 py-2 text-sm text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </button>
                        </div>

                        {loadingAppointments ? (
                            <div className="flex min-h-[300px] items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/20 bg-black text-gray-400">
                                No appointments found.
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {appointments.map((appointment: any) => (
                                        <div
                                            key={appointment.id}
                                            className="rounded-2xl border border-[#D4AF37]/10 bg-black p-5"
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                <div>
                                                    <p className="text-lg font-medium">
                                                        {appointment.hairStyleName ??
                                                            appointment.hairStyle?.name ??
                                                            'Appointment'}
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-400">
                                                        {appointment.userName ??
                                                            appointment.user?.firstName ??
                                                            'Client'}
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {new Date(appointment.appointmentDate).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="w-full lg:w-72">
                                                    <label className="mb-2 block text-sm text-gray-400">
                                                        Status
                                                    </label>

                                                    <select
                                                        value={appointment.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                appointment.id,
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        disabled={savingId === appointment.id}
                                                        className="w-full rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a] px-4 py-3 text-white outline-none"
                                                    >
                                                        {STATUS_OPTIONS.map((option) => (
                                                            <option
                                                                key={option.value}
                                                                value={option.value}
                                                                className="bg-black text-white"
                                                            >
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {savingId === appointment.id && (
                                                        <div className="mt-2 text-sm text-[#D4AF37]">
                                                            Updating...
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        onClick={() => loadAppointments(pageNumber - 1)}
                                        disabled={pageNumber === 1}
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/20 px-4 py-2 text-sm text-[#D4AF37] transition-all disabled:opacity-40"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </button>

                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        {renderPageNumbers()}
                                    </div>

                                    <button
                                        onClick={() => loadAppointments(pageNumber + 1)}
                                        disabled={pageNumber === totalPages}
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/20 px-4 py-2 text-sm text-[#D4AF37] transition-all disabled:opacity-40"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="mt-3 text-center text-sm text-gray-500">
                                    Page {pageNumber} of {totalPages}
                                </div>
                            </>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}