'use client';

import React, { useState } from 'react';
import AppointmentConfirmation from './appointment-confirmation';
import { AppointmentModalProps } from '../_models/models';
import { postAppointment } from '../_api/appointment-api';
import { useLang } from '../_context/language-context';
import { tr } from '../_config/translations';
import { getHairStyleDisplay } from '../_config/hairstyle-descriptions';

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  show,
  onClose,
  onBackToHairStyle,
  onDaySelect,
  slots = [],
  selectedHairStyle,
  slotsLoading = false,
}) => {
  const { lang } = useLang();

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date(new Date().setHours(0, 0, 0, 0)));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<'calendar' | 'confirmation'>('calendar');
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [error, setError] = useState<string | undefined>(undefined);

  // Remet tout à zéro à chaque ouverture du modal
  React.useEffect(() => {
    if (show) {
      setIsLoading(false);
      setIsConfirmed(false);
      setSelectedTime(null);
      setStep('calendar');
      setError(undefined);
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      setSelectedDay(today);
      setMonth(today.getMonth());
      setYear(today.getFullYear());
    }
  }, [show]);

  // Jours de la semaine traduits (courts)
  const weekdayShort = [
    tr('day_0', lang).slice(0, 3),
    tr('day_1', lang).slice(0, 3),
    tr('day_2', lang).slice(0, 3),
    tr('day_3', lang).slice(0, 3),
    tr('day_4', lang).slice(0, 3),
    tr('day_5', lang).slice(0, 3),
    tr('day_6', lang).slice(0, 3),
  ];

  const getDaySlotsIfAvailable = (checkDate: Date) => {
    const dateStr = checkDate.toISOString().split('T')[0];
    return slots.find(s => s.day.startsWith(dateStr))?.availableSlots || [];
  };

  const isAvailableDay = (checkDate: Date) => getDaySlotsIfAvailable(checkDate).length > 0;

  const getMonthDaysGrid = (y: number, m: number) => {
    const firstDay = new Date(y, m, 1);
    const startIdx = firstDay.getDay();
    const firstVisible = new Date(y, m, 1 - startIdx);
    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(firstVisible);
      date.setDate(firstVisible.getDate() + i);
      return { date, isCurrentMonth: date.getMonth() === m };
    });
  };

  const goToMonthOfDay = (day: Date) => {
    if (day.getMonth() !== month || day.getFullYear() !== year) {
      setMonth(day.getMonth());
      setYear(day.getFullYear());
    }
    setSelectedDay(day);
    setSelectedTime(null);
    if (onDaySelect) onDaySelect(day.getDate());
  };

  const handlePrevMonth = () => {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    setMonth(m); setYear(y);
    const first = getMonthDaysGrid(y, m).find(d => d.isCurrentMonth)?.date || null;
    setSelectedDay(first);
    if (first && onDaySelect) onDaySelect(first.getDate());
  };

  const handleNextMonth = () => {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    setMonth(m); setYear(y);
    const first = getMonthDaysGrid(y, m).find(d => d.isCurrentMonth)?.date || null;
    setSelectedDay(first);
    if (first && onDaySelect) onDaySelect(first.getDate());
  };

  const handleConfirmAppointment = async () => {
    if (!selectedDay || !selectedTime || !selectedHairStyle) return;
    try {
      setIsLoading(true);
      const appointmentDate = `${selectedDay.toLocaleDateString('sv-SE')}T${selectedTime}:00`;
      await postAppointment(appointmentDate, selectedHairStyle.id);
    } catch (err: any) {
      setError(err.message || tr('confirm_error_title', lang));
    } finally {
      setIsLoading(false);
      setIsConfirmed(true);
    }
  };

  if (!show) return null;

  const monthGrid = getMonthDaysGrid(year, month);
  const monthLabel = `${tr(`month_${month}`, lang)} ${year}`;
  const serviceName = selectedHairStyle ? getHairStyleDisplay(selectedHairStyle.name, lang).title : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white text-black rounded-xl shadow-2xl min-w-[320px] max-w-[500px] w-full max-h-[90vh] flex flex-col relative">

        {/* Close */}
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
              {/* Service sélectionné */}
              {selectedHairStyle && (
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">{tr('modal_service_selected', lang)}</p>
                  <p className="text-xl font-semibold">{serviceName}</p>
                </div>
              )}

              {/* Loading days */}
              {slotsLoading && (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <svg className="animate-spin h-10 w-10 text-[#D4AF37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <p className="text-gray-600">{tr('modal_loading_days', lang)}</p>
                </div>
              )}

              {!slotsLoading && (
                <>
                  {/* Navigation mois */}
                  <div className="flex items-center justify-between mb-4">
                    <button className="px-2 py-1 text-xl font-bold text-[#D4AF37] hover:text-black" onClick={handlePrevMonth}>&#8592;</button>
                    <span className="text-xl font-semibold capitalize">{monthLabel}</span>
                    <button className="px-2 py-1 text-xl font-bold text-[#D4AF37] hover:text-black" onClick={handleNextMonth}>&#8594;</button>
                  </div>

                  {/* En-têtes jours */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {weekdayShort.map(name => (
                      <div key={name} className="text-center font-medium text-gray-700 text-sm">{name}</div>
                    ))}
                  </div>

                  {/* Grille jours */}
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {monthGrid.map(({ date: day, isCurrentMonth }, idx) => {
                      const hasSlots = isAvailableDay(day);
                      const isSelected = selectedDay && day.toDateString() === selectedDay.toDateString();
                      return (
                        <button
                          key={`${day.toISOString()}-${idx}`}
                          className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 ${
                            isSelected
                              ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                              : isCurrentMonth
                                ? hasSlots
                                  ? 'bg-gray-100 border-black text-black hover:bg-gray-400 hover:border-gray-400 hover:text-white'
                                  : 'bg-gray-100 border-gray-300 text-gray-300 cursor-not-allowed'
                                : hasSlots
                                  ? 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-200'
                                  : 'bg-gray-50 border-gray-200 text-gray-400'
                          }`}
                          onClick={() => goToMonthOfDay(day)}
                          disabled={isCurrentMonth && !hasSlots}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sélection d'heure */}
                  {selectedDay && (
                    <div>
                      <div className="text-sm text-[#D4AF37] mb-3 font-semibold capitalize">
                        {tr(`day_${selectedDay.getDay()}`, lang)} {selectedDay.getDate()} {tr(`month_${selectedDay.getMonth()}`, lang)} {selectedDay.getFullYear()}
                      </div>

                      {slotsLoading ? (
                        <div className="flex flex-col items-center gap-4 py-4">
                          <svg className="animate-spin h-8 w-8 text-[#D4AF37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          <p className="text-gray-500">{tr('modal_loading_times', lang)}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-600 mb-3 font-semibold">{tr('modal_select_time', lang)}</p>
                          {getDaySlotsIfAvailable(selectedDay).length > 0 ? (
                            <div className="overflow-x-auto pb-5">
                              <div className="flex gap-2 min-w-max">
                                {getDaySlotsIfAvailable(selectedDay).map(time => (
                                  <button
                                    key={time}
                                    className={`px-4 py-2 rounded-lg border whitespace-nowrap transition-all duration-200 font-semibold ${
                                      selectedTime === time
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
                            <p className="text-gray-500 py-2 pb-5">{tr('modal_no_times', lang)}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            selectedHairStyle && selectedDay && selectedTime && (
              <AppointmentConfirmation
                HairStyle={selectedHairStyle}
                selectedDate={selectedDay}
                selectedTime={selectedTime}
                isLoading={isLoading}
                isConfirmed={isConfirmed}
                errorMessage={error}
              />
            )
          )}
        </div>

        {/* Footer */}
        {!slotsLoading && (
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white flex gap-3 rounded-b-xl">
            {step === 'calendar' ? (
              <>
                <button
                  className="flex-1 px-6 py-2 rounded-full bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200 font-semibold"
                  onClick={() => onBackToHairStyle ? onBackToHairStyle() : onClose()}
                >
                  {tr('modal_back', lang)}
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
                  {tr('modal_next', lang)}
                </button>
              </>
            ) : (
              !isLoading && !isConfirmed && (
                <>
                  <button
                    className="flex-1 px-6 py-2 rounded-full bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200 font-semibold"
                    onClick={() => setStep('calendar')}
                  >
                    {tr('modal_back', lang)}
                  </button>
                  <button
                    className="flex-1 px-6 py-2 rounded-full bg-[#D4AF37] text-black hover:bg-[#F4D03F] transition-all duration-200 font-semibold"
                    onClick={handleConfirmAppointment}
                  >
                    {tr('modal_confirm', lang)}
                  </button>
                </>
              )
            )}
            {isConfirmed && (
              <button
                className="flex-1 px-6 py-2 rounded-full bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200 font-semibold"
                onClick={onClose}
              >
                {tr('modal_close', lang)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
