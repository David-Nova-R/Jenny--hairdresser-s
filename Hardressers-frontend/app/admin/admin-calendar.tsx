'use client';

import { useEffect, useState } from 'react';
import { addDays, startOfWeek, format } from 'date-fns';
import {
  FetchAdminCalendarAppointments,
  UpdateAppointmentStatusAdmin,
} from '@/app/_api/appointment-api';
import { Loader2 } from 'lucide-react';

type AdminCalendarAppointmentDTO = {
  id: number;
  appointmentDate: string;
  status: number;
  hairStyleName?: string | null;
  userName?: string | null;
  priceMin: number;
  priceMax?: number | null;
  notes?: string | null;
  externalDurationMinutes?: number | null;
};

const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i);

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
        weekStartDate.toISOString()
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
      await UpdateAppointmentStatusAdmin(appointment.id, newStatus);

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

  const getAppointmentsForSlot = (day: Date, hour: number) => {
    return appointments.filter((a) => {
      const date = new Date(a.appointmentDate);

      return (
        date.getFullYear() === day.getFullYear() &&
        date.getMonth() === day.getMonth() &&
        date.getDate() === day.getDate() &&
        date.getHours() === hour
      );
    });
  };

  const getColor = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-yellow-600';
      case 1:
        return 'bg-blue-600';
      case 2:
        return 'bg-red-600';
      case 3:
        return 'bg-green-600';
      case 4:
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const isLoading = (id: number) => loadingIds.includes(id);

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
          className="rounded-full border border-[#D4AF37]/20 px-4 py-2 text-sm text-[#D4AF37]"
        >
          Prev
        </button>

        <h2 className="text-lg font-medium">
          {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d, yyyy')}
        </h2>

        <button
          onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
          className="rounded-full border border-[#D4AF37]/20 px-4 py-2 text-sm text-[#D4AF37]"
        >
          Next
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
        </div>
      ) : (
        <div className="grid grid-cols-8 border border-[#D4AF37]/20">
          <div>
            <div className="h-12 border-b border-[#D4AF37]/10" />
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-24 border-b border-[#D4AF37]/10 p-2 text-xs text-gray-400"
              >
                {hour}:00
              </div>
            ))}
          </div>

          {days.map((day, i) => (
            <div key={i} className="border-l border-[#D4AF37]/10">
              <div className="h-12 border-b border-[#D4AF37]/10 py-2 text-center text-sm">
                {format(day, 'EEE d')}
              </div>

              {HOURS.map((hour) => {
                const slotAppointments = getAppointmentsForSlot(day, hour);

                return (
                  <div
                    key={hour}
                    className="relative h-24 border-b border-[#D4AF37]/10"
                  >
                    {slotAppointments.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => handleStatusChange(a, 'complete')}
                        onDoubleClick={() => handleStatusChange(a, 'confirm')}
                        className={`absolute inset-1 flex cursor-pointer flex-col justify-between rounded p-2 text-xs text-white ${getColor(
                          Number(a.status)
                        )}`}
                      >
                        <div className="font-semibold">
                          {a.hairStyleName || 'Appointment'}
                        </div>

                        <div>{a.userName || 'Client'}</div>

                        <div>
                          {new Date(a.appointmentDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>

                        <div>
                          {a.status === 4
                            ? a.notes || 'External'
                            : `${a.priceMin}${a.priceMax != null ? ` - ${a.priceMax}` : ''} $`}
                        </div>

                        {isLoading(a.id) && (
                          <div className="mt-1 flex justify-center">
                            <Loader2 className="h-3 w-3 animate-spin" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}