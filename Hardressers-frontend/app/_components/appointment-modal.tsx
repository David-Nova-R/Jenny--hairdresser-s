import React, { useState } from 'react';
import AppointmentConfirmation from './appointment-confirmation';
import { AppointmentModalProps } from '../_models/models';
import { postAppointment } from '../_api/appointment-api';

const AppointmentModal: React.FC<AppointmentModalProps> = ({ 
  show, 
  onClose,
  onBackToHairStyle,
  onDaySelect, 
  slots = [], 
  selectedHairStyle,
  slotsLoading = false 
}) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
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

  const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startIdx = (firstDay.getDay() + 6) % 7; // Align Monday=0
    const grid = [];
    // Fill empty slots before 1st
    for (let i = 0; i < startIdx; i++) grid.push(null);
    // Fill days
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push(new Date(year, month, d));
    }
    // Fill empty slots after last day to complete grid
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
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
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(null);
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
      await postAppointment(appointmentDate, selectedHairStyle.id);

      // Close modal on success
      onClose();
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
      // You can add error handling here (e.g., show error message to user)
    }
  };

  if (!show) return null;

  const monthGrid = getMonthDaysGrid(year, month);
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
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
        <div className="flex-1 overflow-y-auto p-8 pt-12">
          {step === 'calendar' ? (
            <>
              {selectedHairStyle && (
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">HairStyle selected:</p>
                  <p className="text-xl font-semibold">{selectedHairStyle.name}</p>
                </div>
              )}
              {slotsLoading && (
                <div className="text-center py-8">
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
                    {monthGrid.map((day, idx) => {
                      const hasSlots = day ? isAvailableDay(day) : false;
                      return day ? (
                        <button
                          key={day.toISOString()}
                          className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 ${
                            selectedDay && day.toDateString() === selectedDay.toDateString()
                              ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                              : hasSlots
                              ? 'bg-gray-100 border-black text-black hover:bg-gray-400 hover:border-gray-400 hover:text-white'
                              : 'bg-gray-100 border-gray-300 text-gray-300 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            handleDaySelect(day);
                            setSelectedTime(null);
                          }}
                          disabled={!hasSlots}
                          title={hasSlots ? 'Day has available slots' : 'No available slots'}
                        >
                          {day.getDate()}
                        </button>
                      ) : (
                        <div
                          key={idx}
                          className="w-10 h-10 flex items-center justify-center"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-300 border border-gray-400 opacity-60" />
                        </div>
                      );
                    })}
                  </div>
                  {selectedDay && (
                    <div className="mb-6">
                      <div className="text-sm text-[#D4AF37] mb-3 font-semibold">
                        {weekdayNames[selectedDay.getDay() === 0 ? 6 : selectedDay.getDay() - 1]} {selectedDay.getDate()}/{selectedDay.getMonth() + 1}/{selectedDay.getFullYear()}
                      </div>
                      {slotsLoading ? (
                        <div className="text-gray-500">Loading available times...</div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-600 mb-3 font-semibold">Select time:</p>
                          <div className="flex flex-wrap gap-2">
                            {getDaySlotsIfAvailable(selectedDay).length > 0 ? (
                              getDaySlotsIfAvailable(selectedDay).map((time) => (
                                <button
                                  key={time}
                                  className={`px-4 py-2 rounded-lg border transition-all duration-200 font-semibold ${
                                    selectedTime === time
                                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                                      : 'bg-gray-100 border-gray-400 text-black hover:bg-gray-200 hover:border-[#D4AF37]'
                                  }`}
                                  onClick={() => setSelectedTime(time)}
                                >
                                  {time}
                                </button>
                              ))
                            ) : (
                              <p className="text-gray-500">No available times for this day</p>
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
                  className={`flex-1 px-6 py-2 rounded-full transition-all duration-200 font-semibold ${
                    selectedDay && selectedTime
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
              <>
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
