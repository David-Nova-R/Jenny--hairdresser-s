'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Scissors } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FetchMyAppointments } from '@/app/_api/appointment-api';
import { useAuth } from '@/app/_context/auth-context';
import { AppointmentResponseDTO } from '@/app/_models/models';

export default function MyAppointmentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<AppointmentResponseDTO[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setPageLoading(true);
        setError(null);

        const data = await FetchMyAppointments();
        setAppointments(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            'Erreur lors du chargement des rendez-vous.'
        );
      } finally {
        setPageLoading(false);
      }
    };

    if (!loading && !user) {
      router.replace('/');
      return;
    }

    if (!loading && user) {
      loadAppointments();
    }
  }, [user, loading, router]);

  const now = new Date();

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => new Date(appointment.appointmentDate) >= now)
      .sort(
        (a, b) =>
          new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime()
      );
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => new Date(appointment.appointmentDate) < now)
      .sort(
        (a, b) =>
          new Date(b.appointmentDate).getTime() -
          new Date(a.appointmentDate).getTime()
      );
  }, [appointments]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-CA', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const formatPrice = (priceMin: number, priceMax?: number | null) => {
    if (priceMax && priceMax !== priceMin) {
      return `${priceMin}$ - ${priceMax}$`;
    }

    return `${priceMin}$`;
  };

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-black px-6 py-32 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <div className="mb-4 h-10 w-72 animate-pulse rounded bg-white/10" />
            <div className="h-5 w-96 animate-pulse rounded bg-white/5" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6"
              >
                <div className="animate-pulse space-y-3">
                  <div className="h-5 w-1/3 rounded bg-white/10" />
                  <div className="h-4 w-1/2 rounded bg-white/5" />
                  <div className="h-4 w-1/4 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-32 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            My Appointments
          </p>
          <h1 className="mb-4 text-5xl font-light">Mes rendez-vous</h1>
          <div className="mb-6 h-[1px] w-24 bg-[#D4AF37]" />
          <p className="max-w-2xl text-gray-300">
            Retrouvez ici vos prochains rendez-vous ainsi que l’historique de vos visites.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!error && (
          <div className="space-y-14">
            <section>
              <div className="mb-6 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
                <h2 className="text-2xl font-light">À venir</h2>
              </div>

              {upcomingAppointments.length === 0 ? (
                <div className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6 text-gray-400">
                  Aucun rendez-vous à venir.
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-[#D4AF37]" />
                            <h3 className="text-xl font-medium">
                              {appointment.hairStyleName}
                            </h3>
                          </div>

                          <div className="space-y-1 text-sm text-gray-300">
                            <p className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-[#D4AF37]" />
                              {formatDate(appointment.appointmentDate)}
                            </p>
                            <p>Statut : {appointment.status}</p>
                            <p>
                              Prix :{' '}
                              {formatPrice(
                                appointment.priceMin,
                                appointment.priceMax
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="self-start rounded-full border border-[#D4AF37]/30 px-4 py-2 text-sm text-[#D4AF37]">
                          Upcoming
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="mb-6 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
                <h2 className="text-2xl font-light">Historique</h2>
              </div>

              {pastAppointments.length === 0 ? (
                <div className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6 text-gray-400">
                  Aucun rendez-vous passé.
                </div>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-[#D4AF37]" />
                            <h3 className="text-xl font-medium">
                              {appointment.hairStyleName}
                            </h3>
                          </div>

                          <div className="space-y-1 text-sm text-gray-300">
                            <p className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-[#D4AF37]" />
                              {formatDate(appointment.appointmentDate)}
                            </p>
                            <p>Statut : {appointment.status}</p>
                            <p>
                              Prix :{' '}
                              {formatPrice(
                                appointment.priceMin,
                                appointment.priceMax
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="self-start rounded-full border border-white/10 px-4 py-2 text-sm text-gray-400">
                          Past
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}