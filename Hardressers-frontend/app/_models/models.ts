export interface HairStyle {
  id: number;
  name: string;
  description?: string;
  priceMin: number;
  priceMax?: number;
  durationMinutes: number;
  durationMaxMinutes?: number;
  photoUrl?: string;
}

export interface HairStyleSelectModalProps {
  HairStyles: HairStyle[];
  onSelect: (HairStyle: HairStyle) => void;
  onClose: () => void;
}

export interface AvailableDay {
  day: string;
  availableSlots: string[];
}
export interface AppointmentModalProps {
  show: boolean;
  onClose: () => void;
  onBackToHairStyle?: () => void;
  onDaySelect?: (day: number) => void;
  slots?: AvailableDay[];
  selectedHairStyle?: HairStyle | null;
  slotsLoading?: boolean;
}