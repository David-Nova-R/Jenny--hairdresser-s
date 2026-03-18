import React from 'react';
import { HairStyle } from '../_models/models';

interface AppointmentConfirmationProps {
  HairStyle: HairStyle;
  selectedDate: Date;
  selectedTime: string;
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  HairStyle,
  selectedDate,
  selectedTime,
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
      <div className="pb-4 border-b border-gray-200">
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
    </div>
  );
};

export default AppointmentConfirmation;
