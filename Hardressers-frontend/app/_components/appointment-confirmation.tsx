'use client';

import React from 'react';
import { HairStyle } from '../_models/models';
import { useLang } from '../_context/language-context';
import { tr } from '../_config/translations';
import { getHairStyleDisplay } from '../_config/hairstyle-descriptions';

interface AppointmentConfirmationProps {
  HairStyle: HairStyle;
  selectedDate: Date;
  selectedTime: string;
  isLoading: boolean;
  isConfirmed: boolean;
  errorMessage?: string;
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  HairStyle,
  selectedDate,
  selectedTime,
  isLoading,
  isConfirmed,
  errorMessage,
}) => {
  const { lang } = useLang();

  const formattedDate = `${tr(`day_${selectedDate.getDay()}`, lang)} ${selectedDate.getDate()} ${tr(`month_${selectedDate.getMonth()}`, lang)} ${selectedDate.getFullYear()}`;

  const durationLabel = HairStyle.durationMaxMinutes
    ? `${HairStyle.durationMinutes} - ${HairStyle.durationMaxMinutes} min`
    : `${HairStyle.durationMinutes} min`;

  const priceLabel = HairStyle.priceMax
    ? `${HairStyle.priceMin} CAD - ${HairStyle.priceMax} CAD`
    : `${HairStyle.priceMin} CAD`;

  const serviceName = getHairStyleDisplay(HairStyle.name, lang).title;

  const InfoGrid = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">{tr('confirm_date', lang)}</p>
          <p className="text-lg font-semibold">{formattedDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">{tr('confirm_time', lang)}</p>
          <p className="text-lg font-semibold text-[#D4AF37]">{selectedTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600 mb-1">{tr('confirm_duration', lang)}</p>
          <p className="text-lg font-semibold">{durationLabel}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">{tr('confirm_price', lang)}</p>
          <p className="text-lg font-semibold text-[#D4AF37]">{priceLabel}</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-4">

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-2 mb-4">
          <svg className="animate-spin h-8 w-8 text-[#D4AF37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-gray-600 text-base">{tr('confirm_loading', lang)}</span>
        </div>
      )}

      {/* Success */}
      {!isLoading && !errorMessage && (
        <>
          <div className="pb-4 border-b border-gray-200 text-center">
            {isConfirmed && (
              <p className="text-2xl font-bold text-green-600 mb-1">{tr('confirm_success', lang)}</p>
            )}
            <p className="text-sm text-gray-600 mb-1">{tr('confirm_service', lang)}</p>
            <p className="text-2xl font-semibold text-[#D4AF37]">{serviceName}</p>
          </div>
          <InfoGrid />
        </>
      )}

      {/* Error */}
      {!isLoading && errorMessage && (
        <>
          <div className="pb-4 border-b border-gray-200 text-center">
            {isConfirmed && (
              <>
                <p className="text-2xl text-white mb-2 bg-red-600 p-2 rounded">{tr('confirm_error_title', lang)}</p>
                <p className="text-sm text-red-600 mb-1 bg-red-100 p-2 rounded">{errorMessage}</p>
              </>
            )}
            <p className="text-sm text-gray-600 mb-1">{tr('confirm_service', lang)}</p>
            <p className="text-2xl font-semibold text-[#D4AF37]">{serviceName}</p>
          </div>
          <InfoGrid />
        </>
      )}

    </div>
  );
};

export default AppointmentConfirmation;
