import React, { useState } from 'react';
import { HairStyleSelectModalProps } from '../_models/models';

const HairStyleSelectModal: React.FC<HairStyleSelectModalProps> = ({ HairStyles, onSelect, onClose, loading }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleNext = () => {
    if (selected !== null) {
      const HairStyle = HairStyles.find(s => s.id === selected);
      if (HairStyle) onSelect(HairStyle);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white text-black rounded-xl shadow-2xl min-w-[320px] max-w-[500px] w-full max-h-[75vh] flex flex-col relative" style={{width: '400px', maxWidth: '90vw'}}>
        {/* Close button X */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors text-2xl leading-none"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="p-8 pb-4 pt-12 flex-shrink-0">
          <h3 className="text-2xl mb-4 font-semibold">Choisissez un HairStyle</h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-4">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-32 gap-4">
              <svg className="animate-spin h-10 w-10 text-[#D4AF37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span className="text-gray-600 text-lg">Chargement des HairStyles...</span>
            </div>
          ) : (
            <ul className="space-y-4">
              {HairStyles.map(HairStyle => (
                <li key={HairStyle.id}>
                  <button
                    className={`w-full text-left border rounded-lg px-4 py-3 transition-all duration-200 ${selected === HairStyle.id ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black'}`}
                    onClick={() => setSelected(HairStyle.id)}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg">{HairStyle.name}</span>
                      {HairStyle.description && <span className="text-gray-600 text-sm">{HairStyle.description}</span>}
                      <span className="text-gray-600 text-sm">
                        {HairStyle.priceMin}€
                        {HairStyle.priceMax ? ` - ${HairStyle.priceMax}€` : ''} | {HairStyle.durationMinutes} min{HairStyle.durationMaxMinutes ? ` - ${HairStyle.durationMaxMinutes} min` : ''}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with only Next button */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white flex gap-3 rounded-b-xl">
          <button
            className={`flex-1 px-6 py-2 rounded-full transition-all duration-200 font-semibold ${selected === null ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#D4AF37] text-black hover:bg-[#F4D03F]'}`}
            onClick={handleNext}
            disabled={selected === null}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HairStyleSelectModal;
