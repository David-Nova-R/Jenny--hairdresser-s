import React, { useState } from 'react';
import { HairStyleSelectModalProps } from '../_models/models';


const HairStyleSelectModal: React.FC<HairStyleSelectModalProps> = ({
  show,
  HairStyles,
  onSelect,
  onClose,
  loading,
}) => {
   if (!show) return null;
  const [selected, setSelected] = useState<number | null>(null);

  const handleNext = () => {
    if (selected !== null) {
      const hairStyle = HairStyles.find((s) => s.id === selected);
      if (hairStyle) onSelect(hairStyle);
    }
  };

  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <li key={index}>
        <div className="w-full rounded-lg border border-gray-200 px-4 py-3">
          <div className="animate-pulse space-y-3">
            <div className="h-5 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
          </div>
        </div>
      </li>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="relative flex max-h-[75vh] w-full max-w-[500px] flex-col rounded-xl bg-white text-black shadow-2xl"
        style={{ width: '400px', maxWidth: '90vw' }}
      >
        <button
          className="absolute top-4 right-4 text-2xl leading-none text-gray-400 transition-colors hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="shrink-0 px-8 pt-12 pb-4">
          <h3 className="text-2xl font-semibold">Choisissez un HairStyle</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-4">
          {loading ? (
            <ul className="space-y-4">{renderSkeletons()}</ul>
          ) : (
            <ul className="space-y-4">
              {HairStyles.map((hairStyle) => (
                <li key={hairStyle.id}>
                  <button
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                      selected === hairStyle.id
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                        : 'border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black'
                    }`}
                    onClick={() => setSelected(hairStyle.id)}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold">{hairStyle.name}</span>
                      {hairStyle.description && (
                        <span
                          className={`text-sm ${
                            selected === hairStyle.id ? 'text-black/80' : 'text-gray-600'
                          }`}
                        >
                          {hairStyle.description}
                        </span>
                      )}
                      <span
                        className={`text-sm ${
                          selected === hairStyle.id ? 'text-black/80' : 'text-gray-600'
                        }`}
                      >
                        {hairStyle.priceMin}€
                        {hairStyle.priceMax ? ` - ${hairStyle.priceMax}€` : ''} |{' '}
                        {hairStyle.durationMinutes} min
                        {hairStyle.durationMaxMinutes
                          ? ` - ${hairStyle.durationMaxMinutes} min`
                          : ''}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex shrink-0 gap-3 rounded-b-xl border-t border-gray-200 bg-white p-4">
          <button
            className={`flex-1 rounded-full px-6 py-2 font-semibold transition-all duration-200 ${
              selected === null || loading
                ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                : 'bg-[#D4AF37] text-black hover:bg-[#F4D03F]'
            }`}
            onClick={handleNext}
            disabled={selected === null || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HairStyleSelectModal;