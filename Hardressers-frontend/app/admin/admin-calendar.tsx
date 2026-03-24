'use client';

import { useState } from 'react';
import { addDays, startOfWeek, format } from 'date-fns';
import { AppointmentResponseDTO } from '@/app/_models/models';
import { UpdateAppointmentStatusAdmin } from '@/app/_api/appointment-api';
import { Loader2 } from 'lucide-react';

type Props = {
  appointments: AppointmentResponseDTO[];
  setAppointments: React.Dispatch<React.SetStateAction<AppointmentResponseDTO[]>>;
};

const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i);

export default function AdminCalendar({ appointments, setAppointments }: Props) {
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const handleStatusChange = async (
    appointment: AppointmentResponseDTO,
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
          a.id === appointment.id
            ? { ...a, status: String(newStatus) as typeof a.status }
            : a
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
        date.getDate() === day.getDate() &&
        date.getMonth() === day.getMonth() &&
        date.getFullYear() === day.getFullYear() &&
        date.getHours() === hour
      );
    });
  };

  const getColor = (status: string | number) => {
    switch (Number(status)) {
      case 0:
        return 'bg-yellow-600';
      case 1:
        return 'bg-blue-600';
      case 3:
        return 'bg-green-600';
      default:
        return 'bg-red-600';
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
          {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d')}
        </h2>

        <button
          onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
          className="rounded-full border border-[#D4AF37]/20 px-4 py-2 text-sm text-[#D4AF37]"
        >
          Next
        </button>
      </div>

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
                        a.status
                      )}`}
                    >
                      <div className="font-semibold">
                        {a.hairStyleName || 'Appointment'}
                      </div>

                      <div>
                        {new Date(a.appointmentDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>

                      <div>
                        {a.priceMin}
                        {a.priceMax != null ? ` - ${a.priceMax}` : ''} $
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
    </div>
  );
}