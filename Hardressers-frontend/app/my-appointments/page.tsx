'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Scissors } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FetchMyAppointments } from '@/app/_api/appointment-api';
import { useAuth } from '@/app/_context/auth-context';
import { useLang } from '@/app/_context/language-context';
import { AppointmentResponseDTO } from '@/app/_models/models';
import { tr } from '@/app/_config/translations';
import { getHairStyleDisplay } from '@/app/_config/hairstyle-descriptions';

// Normalise le statut qu'il vienne en chiffre ou en string ("Confirmed", "1", etc.)
const normalizeStatus = (status: string | number): number => {
  const n = Number(status);
  if (!isNaN(n)) return n;
  const map: Record<string, number> = {
    pending: 0, confirmed: 1, cancelled: 2, completed: 3, external: 4,
  };
  return map[String(status).toLowerCase()] ?? 0;
};

const STATUS_COLORS: Record<number, string> = {
  0: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  1: 'border-blue-500/40  bg-blue-500/10  text-blue-300',
  2: 'border-rose-500/40  bg-rose-500/10  text-rose-300',
  3: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  4: 'border-blue-500/40  bg-blue-500/10  text-blue-300', // External = traité comme Confirmé côté client
};

const STATUS_DOT: Record<number, string> = {
  0: 'bg-amber-400',
  1: 'bg-blue-400',
  2: 'bg-rose-400',
  3: 'bg-emerald-400',
  4: 'bg-blue-400', // idem
};

export default function MyAppointmentsPage() {
  const { user, loading } = useAuth();
  const { lang } = useLang();
  const router = useRouter();

  const [appointments, setAppointments] = useState<AppointmentResponseDTO[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) { router.replace('/'); return; }
    if (!loading && user) {
      FetchMyAppointments()
        .then(setAppointments)
        .catch((err: any) => setError(err?.response?.data?.message ?? tr('appt_error', lang)))
        .finally(() => setPageLoading(false));
    }
  }, [user, loading]);

  const now = new Date();

  const upcoming = useMemo(() =>
    appointments
      .filter(a => new Date(a.appointmentDate) >= now)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()),
    [appointments]);

  const past = useMemo(() =>
    appointments
      .filter(a => new Date(a.appointmentDate) < now)
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()),
    [appointments]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(
      lang === 'es' ? 'es-MX' : lang === 'fr' ? 'fr-CA' : 'en-CA',
      { dateStyle: 'medium', timeStyle: 'short' }
    );

  const statusLabel = (status: string | number) => {
    const num = normalizeStatus(status);
    // Status 4 (External) s'affiche comme "Confirmé" pour le client
    const displayNum = num === 4 ? 1 : num;
    return tr(`status_${displayNum}`, lang);
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-black px-6 py-32 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <div className="mb-4 h-10 w-72 animate-pulse rounded bg-white/10" />
            <div className="h-5 w-96 animate-pulse rounded bg-white/5" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6">
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

  // ── Appointment card ──────────────────────────────────────────────────────
  const AppCard = ({ appt }: { appt: AppointmentResponseDTO }) => {
    const statusNum = normalizeStatus(appt.status);
    const statusCls = STATUS_COLORS[statusNum] ?? 'border-gray-500/40 bg-gray-500/10 text-gray-300';
    const dotCls    = STATUS_DOT[statusNum] ?? 'bg-gray-400';
    const displayName = getHairStyleDisplay(appt.hairStyleName, lang).title;

    return (
      <div className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            {/* Service name */}
            <div className="mb-3 flex items-center gap-2">
              <Scissors className="h-4 w-4 shrink-0 text-[#D4AF37]" />
              <h3 className="text-xl font-medium text-white">{displayName}</h3>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              {/* Date */}
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                {formatDate(appt.appointmentDate)}
              </p>

              {/* Price */}
              <p className="flex items-center gap-2 text-gray-400">
                <span className="text-[#D4AF37]">{tr('appt_price', lang)} :</span>
                {appt.priceMax && appt.priceMax !== appt.priceMin
                  ? `${appt.priceMin} – ${appt.priceMax} CAD`
                  : `${appt.priceMin} CAD`}
              </p>
            </div>
          </div>

          {/* Real status badge */}
          <div className={`self-start flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${statusCls}`}>
            <span className={`h-2 w-2 rounded-full ${dotCls}`} />
            {statusLabel(appt.status)}
          </div>
        </div>
      </div>
    );
  };

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black px-6 py-32 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-12">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            {tr('appt_badge', lang)}
          </p>
          <h1 className="mb-4 text-5xl font-light">{tr('appt_title', lang)}</h1>
          <div className="mb-6 h-[1px] w-24 bg-[#D4AF37]" />
          <p className="max-w-2xl text-gray-300">{tr('appt_subtitle', lang)}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!error && (
          <div className="space-y-14">
            {/* Upcoming */}
            <section>
              <div className="mb-6 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
                <h2 className="text-2xl font-light">{tr('appt_upcoming', lang)}</h2>
              </div>

              {upcoming.length === 0 ? (
                <div className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6 text-gray-400">
                  {tr('appt_none_upcoming', lang)}
                </div>
              ) : (
                <div className="space-y-4">
                  {upcoming.map(a => (
                    <AppCard key={a.id} appt={a} />
                  ))}
                </div>
              )}
            </section>

            {/* History */}
            <section>
              <div className="mb-6 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
                <h2 className="text-2xl font-light">{tr('appt_history', lang)}</h2>
              </div>

              {past.length === 0 ? (
                <div className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6 text-gray-400">
                  {tr('appt_none_past', lang)}
                </div>
              ) : (
                <div className="space-y-4">
                  {past.map(a => (
                    <AppCard key={a.id} appt={a} />
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
