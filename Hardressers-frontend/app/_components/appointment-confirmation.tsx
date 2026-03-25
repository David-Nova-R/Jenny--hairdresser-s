import React from 'react';
import { HairStyle } from '../_models/models';

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
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const weekdayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const formattedDate = `${weekdayNames[selectedDate.getDay()]} ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  const durationLabel = HairStyle.durationMaxMinutes
    ? `${HairStyle.durationMinutes} - ${HairStyle.durationMaxMinutes} min`
    : `${HairStyle.durationMinutes} min`;
  const priceLabel = HairStyle.priceMax
    ? `€${HairStyle.priceMin} - €${HairStyle.priceMax}`
    : `€${HairStyle.priceMin}`;

  return (
    <div className="space-y-4">
      {/* Spinner — visible seulement pendant le loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-2 mb-4">
          <svg className="animate-spin h-8 w-8 text-[#D4AF37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-gray-600 text-base">Attente de vérification...</span>
        </div>
      )}
      {!isLoading && !errorMessage && (
        <>
          <div className="pb-4 border-b border-gray-200 text-center">
            {isConfirmed && (
              <p className="text-2xl font-bold text-green-600 mb-1">Votre rendez-vous est confirmé !</p>
            )}
            <p className="text-sm text-gray-600 mb-1">HairStyle</p>
            <p className="text-2xl font-semibold text-[#D4AF37]">{HairStyle.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Date</p>
              <p className="text-lg font-semibold">{formattedDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Time</p>
              <p className="text-lg font-semibold text-[#D4AF37]">{selectedTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Duration</p>
              <p className="text-lg font-semibold">{durationLabel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Price</p>
              <p className="text-lg font-semibold text-[#D4AF37]">{priceLabel}</p>
            </div>
          </div>
        </>)}
      {errorMessage && !isLoading && (
        <>
          <div className="pb-4 border-b border-gray-200 text-center">
            {isConfirmed && (
              <>
                <p className="text-2xl text-white mb-2 bg-red-600 p-2 rounded">Erreur lors de la réservation ! <br /> Veuillez réessayer plus tard.</p>
                <p className="text-1xl text-red-600 mb-1 bg-red-100 p-2 rounded">{errorMessage}</p>
              </>
            )}
            <p className="text-sm text-gray-600 mb-1">HairStyle</p>
            <p className="text-2xl font-semibold text-[#D4AF37]">{HairStyle.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Date</p>
              <p className="text-lg font-semibold">{formattedDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Time</p>
              <p className="text-lg font-semibold text-[#D4AF37]">{selectedTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Duration</p>
              <p className="text-lg font-semibold">{durationLabel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Price</p>
              <p className="text-lg font-semibold text-[#D4AF37]">{priceLabel}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentConfirmation;
