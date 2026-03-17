import React, { useState } from 'react';

export interface Service {
  id: number;
  name: string;
  description?: string;
  priceMin: number;
  priceMax?: number;
  durationMinutes: number;
  durationMaxMinutes?: number;
  photoUrl?: string;
}

interface ServiceSelectModalProps {
  services: Service[];
  onSelect: (service: Service) => void;
  onClose: () => void;
}

const ServiceSelectModal: React.FC<ServiceSelectModalProps> = ({ services, onSelect, onClose }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleNext = () => {
    if (selected !== null) {
      const service = services.find(s => s.id === selected);
      if (service) onSelect(service);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
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
          <h3 className="text-2xl mb-4 font-semibold">Choisissez un service</h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-4">
          <ul className="space-y-4">
            {services.map(service => (
              <li key={service.id}>
                <button
                  className={`w-full text-left border rounded-lg px-4 py-3 transition-all duration-200 ${selected === service.id ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black'}`}
                  onClick={() => setSelected(service.id)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg">{service.name}</span>
                    {service.description && <span className="text-gray-600 text-sm">{service.description}</span>}
                    <span className="text-gray-600 text-sm">
                      {service.priceMin}€
                      {service.priceMax ? ` - ${service.priceMax}€` : ''} | {service.durationMinutes} min{service.durationMaxMinutes ? ` - ${service.durationMaxMinutes} min` : ''}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
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

export default ServiceSelectModal;
