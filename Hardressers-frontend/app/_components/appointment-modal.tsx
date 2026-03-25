import React, { useState } from 'react';
import AppointmentConfirmation from './appointment-confirmation';
import { AppointmentModalProps } from '../_models/models';
import { postAppointment } from '../_api/appointment-api';
import { setServers } from 'dns';

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  show,
  onClose,
  onBackToHairStyle,
  onDaySelect,
  slots = [],
  selectedHairStyle,
  slotsLoading = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<'calendar' | 'confirmation'>('calendar');
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return now.getMonth();
  });
  const [year, setYear] = useState(() => {
    const now = new Date();
    return now.getFullYear();
  });
  const [error, setError] = useState<string | undefined>(undefined);

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper: Check if a day has available slots
  const getDaySlotsIfAvailable = (checkDate: Date) => {
    const dateStr = checkDate.toISOString().split('T')[0];
    const slotData = slots.find(s => s.day.startsWith(dateStr));
    return slotData?.availableSlots || [];
  };

  const isAvailableDay = (checkDate: Date) => {
    return getDaySlotsIfAvailable(checkDate).length > 0;
  };

  // Get days grid for selected month
  const getMonthDaysGrid = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const startIdx = firstDay.getDay(); // Sun = 0
    const firstVisibleDay = new Date(year, month, 1 - startIdx);

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(firstVisibleDay);
      date.setDate(firstVisibleDay.getDate() + i);

      return {
        date,
        isCurrentMonth: date.getMonth() === month,
      };
    });
  };

  const goToMonthOfDay = (day: Date) => {
    if (day.getMonth() !== month || day.getFullYear() !== year) {
      setMonth(day.getMonth());
      setYear(day.getFullYear());
    }

    handleDaySelect(day);
    setSelectedTime(null);
  };

  // Get previous and next month info
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const handleDaySelect = (day: Date) => {
    setSelectedDay(day);
    if (onDaySelect) onDaySelect(day.getDate());
  };
  const handlePrevMonth = () => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    setMonth(prevMonth);
    setYear(prevYear);

    const prevSelectedDay =
      getMonthDaysGrid(prevYear, prevMonth).find((d) => d.isCurrentMonth)?.date || null;

    setSelectedDay(prevSelectedDay);

    if (prevSelectedDay && onDaySelect) {
      onDaySelect(prevSelectedDay.getDate());
    }
  };

  const handleNextMonth = () => {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    setMonth(nextMonth);
    setYear(nextYear);

    const nextSelectedDay =
      getMonthDaysGrid(nextYear, nextMonth).find((d) => d.isCurrentMonth)?.date || null;

    setSelectedDay(nextSelectedDay);

    if (nextSelectedDay && onDaySelect) {
      onDaySelect(nextSelectedDay.getDate());
    }
  };

  const handleConfirmAppointment = async () => {
    if (!selectedDay || !selectedTime || !selectedHairStyle) {
      return;
    }

    try {
      // Combine selected date and time into ISO string
      const appointmentDate = new Date(
        selectedDay.getFullYear(),
        selectedDay.getMonth(),
        selectedDay.getDate(),
        parseInt(selectedTime.split(':')[0]),
        parseInt(selectedTime.split(':')[1])
      ).toISOString();

      // Post appointment to backend
      setIsLoading(true)
      await postAppointment(appointmentDate, selectedHairStyle.id);

    } catch (error: any) {
      console.error('Failed to confirm appointment:', error);
      setError(error.message || 'Erreur lors de la réservation');
    } finally {
      setIsLoading(false)
      setIsConfirmed(true);

    }
  };

  if (!show) return null;

  const monthGrid = getMonthDaysGrid(year, month);
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white text-black rounded-xl shadow-2xl min-w-[320px] max-w-[500px] w-full max-h-[90vh] flex flex-col relative">
        {/* Close button X */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors text-2xl leading-none"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pt-12">
          {step === 'calendar' ? (
            <>
              {selectedHairStyle && (
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">HairStyle selected:</p>
                  <p className="text-xl font-semibold">{selectedHairStyle.name}</p>
                </div>
              )}
              {slotsLoading && (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <svg className="animate-spin h-10 w-10 text-[#D4AF37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <p className="text-gray-600">Loading available days...</p>
                </div>
              )}
              {!slotsLoading && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      className="px-2 py-1 text-xl font-bold text-[#D4AF37] hover:text-black"
                      onClick={handlePrevMonth}
                      aria-label="Mois précédent"
                    >
                      &#8592;
                    </button>
                    <span className="text-xl font-semibold">
                      {monthNames[month]} {year}
                    </span>
                    <button
                      className="px-2 py-1 text-xl font-bold text-[#D4AF37] hover:text-black"
                      onClick={handleNextMonth}
                      aria-label="Mois suivant"
                    >
                      &#8594;
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {weekdayNames.map((name) => (
                      <div key={name} className="text-center font-medium text-gray-700 text-sm">{name}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {monthGrid.map(({ date: day, isCurrentMonth }, idx) => {
                      const hasSlots = isAvailableDay(day);
                      const isSelected =
                        selectedDay && day.toDateString() === selectedDay.toDateString();

                      return (
                        <button
                          key={`${day.toISOString()}-${idx}`}
                          className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 ${isSelected
                            ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                            : isCurrentMonth
                              ? hasSlots
                                ? 'bg-gray-100 border-black text-black hover:bg-gray-400 hover:border-gray-400 hover:text-white'
                                : 'bg-gray-100 border-gray-300 text-gray-300 cursor-not-allowed'
                              : hasSlots
                                ? 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-200 hover:border-gray-400'
                                : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                            }`}
                          onClick={() => goToMonthOfDay(day)}
                          disabled={isCurrentMonth && !hasSlots}
                          title={hasSlots ? 'Day has available slots' : 'No available slots'}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                  {selectedDay && (
                    <div>
                      <div className="text-sm text-[#D4AF37] mb-3 font-semibold">
                        {weekdayNames[selectedDay.getDay()]} {selectedDay.getDate()}/{selectedDay.getMonth() + 1}/{selectedDay.getFullYear()}
                      </div>

                      {slotsLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <svg className="animate-spin h-8 w-8 text-[#D4AF37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            <div className="text-gray-500">Loading available times...</div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-600 mb-3 font-semibold">Select time:</p>

                          <div>
                            {getDaySlotsIfAvailable(selectedDay).length > 0 ? (
                              <div className="overflow-x-auto pb-5">
                                <div className="flex gap-2 min-w-max">
                                  {getDaySlotsIfAvailable(selectedDay).map((time) => (
                                    <button
                                      key={time}
                                      className={`px-4 py-2 rounded-lg border whitespace-nowrap transition-all duration-200 font-semibold ${selectedTime === time
                                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                                        : 'bg-gray-100 border-gray-400 text-black hover:bg-gray-200 hover:border-[#D4AF37]'
                                        }`}
                                      onClick={() => setSelectedTime(time)}
                                    >
                                      {time}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className=" flex items-center justify-center align-middle pb-5.5">
                                <p className="text-gray-500 py-2">No available times for this day</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {selectedHairStyle && selectedDay && selectedTime && (
                <AppointmentConfirmation
                  HairStyle={selectedHairStyle}
                  selectedDate={selectedDay}
                  selectedTime={selectedTime}
                  isLoading={isLoading}
                  isConfirmed={isConfirmed}
                  errorMessage={error}
                />
              )}
            </>
          )}
        </div>

        {/* Footer with buttons */}
        {!slotsLoading && (
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white flex gap-3 rounded-b-xl">
            {step === 'calendar' ? (
              <>
                <button
                  className="flex-1 px-6 py-2 rounded-full bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200 font-semibold"
                  onClick={() => onBackToHairStyle ? onBackToHairStyle() : onClose()}
                >
                  Back
                </button>
                <button
                  className={`flex-1 px-6 py-2 rounded-full transition-all duration-200 font-semibold ${selectedDay && selectedTime
                    ? 'bg-[#D4AF37] text-black hover:bg-[#F4D03F]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  onClick={() => setStep('confirmation')}
                  disabled={!selectedDay || !selectedTime}
                >
                  Next
                </button>
              </>
            ) : (
              !isLoading && !isConfirmed && <>
                <button
                  className="flex-1 px-6 py-2 rounded-full bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200 font-semibold"
                  onClick={() => setStep('calendar')}
                >
                  Back
                </button>
                <button
                  className="flex-1 px-6 py-2 rounded-full bg-[#D4AF37] text-black hover:bg-[#F4D03F] transition-all duration-200 font-semibold"
                  onClick={handleConfirmAppointment}
                >
                  Confirm
                </button>
              </>)}
            {
              isConfirmed && <button
                className="flex-1 px-6 py-2 rounded-full bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200 font-semibold"
                onClick={onClose}
              >
                Close
              </button>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
