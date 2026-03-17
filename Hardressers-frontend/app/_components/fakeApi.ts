// Fake API calls for demo/testing
import { Service } from "./ServiceSelectModal";

export type FakeSlotResponse = {
  Day: string; // ISO date string
  AvailableSlots: string[];
};

export const fakeFetchServices = async (): Promise<Service[]> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 400));
  return [
    { id: 1, name: "Tinte permanente", priceMin: 35, priceMax: 90, durationMinutes: 60, durationMaxMinutes: 120 },
    { id: 2, name: "Tinte demipermanente", priceMin: 35, priceMax: 50, durationMinutes: 60, durationMaxMinutes: 120 },
    { id: 3, name: "Baño de color", priceMin: 35, priceMax: undefined, durationMinutes: 240, durationMaxMinutes: 360 },
    { id: 4, name: "Técnicas de mechas y efectos de luz", priceMin: 140, priceMax: 230, durationMinutes: 240, durationMaxMinutes: 360 },
    { id: 5, name: "Balayage", priceMin: 150, priceMax: 250, durationMinutes: 240, durationMaxMinutes: 360 },
    { id: 6, name: "Baby Lights", priceMin: 150, priceMax: 250, durationMinutes: 240, durationMaxMinutes: 360 },
    { id: 7, name: "Ombré", priceMin: 150, priceMax: 230, durationMinutes: 240, durationMaxMinutes: 360 },
    { id: 8, name: "Californianas", priceMin: 100, priceMax: 200, durationMinutes: 240, durationMaxMinutes: 360 },
    { id: 9, name: "Cortes dama", priceMin: 20, priceMax: undefined, durationMinutes: 60, durationMaxMinutes: undefined },
    { id: 10, name: "Permanente hombres", priceMin: 100, priceMax: undefined, durationMinutes: 180, durationMaxMinutes: undefined },
    { id: 11, name: "Keratina", priceMin: 140, priceMax: 250, durationMinutes: 300, durationMaxMinutes: 420 },
    { id: 12, name: "Aminoácido", priceMin: 150, priceMax: 300, durationMinutes: 240, durationMaxMinutes: 420 },
    { id: 13, name: "Terapia capilar", priceMin: 120, priceMax: 200, durationMinutes: 180, durationMaxMinutes: 240 },
    { id: 14, name: "Cepillados", priceMin: 30, priceMax: 50, durationMinutes: 60, durationMaxMinutes: 120 },
    { id: 15, name: "Peinados", priceMin: 35, priceMax: 70, durationMinutes: 60, durationMaxMinutes: 180 },
  ];
};

export const fakeFetchAvailableSlots = async (
  serviceId: number,
  year: number,
  month: number,
  duration: number
): Promise<FakeSlotResponse[]> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  // Return hardcoded slots for demo
  return [
    {
      Day: `${year}-${String(month).padStart(2, "0")}-17T00:00:00`,
      AvailableSlots: ["08:00", "08:30", "09:30", "10:00"]
    },
    {
      Day: `${year}-${String(month).padStart(2, "0")}-18T00:00:00`,
      AvailableSlots: ["08:00", "09:00", "10:30", "14:00"]
    },
    {
      Day: `${year}-${String(month).padStart(2, "0")}-21T00:00:00`,
      AvailableSlots: ["08:00", "09:00"]
    }
  ];
};
