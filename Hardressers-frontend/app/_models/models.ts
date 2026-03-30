export interface HairStyle {
  id: number;
  name: string;
  description?: string;
  priceMin: number;
  priceMax?: number;
  durationMinutes: number;
  durationMaxMinutes?: number;
  photoUrls?: string[];
}

export interface HairStyleSelectModalProps {
  show: boolean;
  HairStyles: HairStyle[];
  onSelect: (hairStyle: HairStyle) => void;
  onClose: () => void;
  loading: boolean;
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

export interface AppointmentResponseDTO {
  id: number;
  appointmentDate: string;
  status: string;
  hairStyleId: number;
  hairStyleName: string;
  priceMin: number;
  priceMax?: number | null;
}

export type AppointmentDTO = {
  id: number;
  appointmentDate: string;
  status: number;
  hairStyleName: string;
  userName?: string;
};

export interface DayOff {
  id: number;
  date: string;
  reason?: string | null;
  createdAt: string;
}

export interface PortfolioPhoto {
  id: number;
  photoUrl: string;
  title?: string | null;
  order: number;
  isVisible: boolean;
  createdAt: string;
}

export type AdminCalendarAppointmentDTO = {
  id: number;
  appointmentDate: string;
  status: number;
  hairStyleName?: string | null;
  userName?: string | null;
  priceMin: number;
  priceMax?: number | null;
  notes?: string | null;
  externalDurationMinutes?: number | null;
};

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

export interface HairStylePhoto {
  id: number;
  hairStyleId: number;
  photoUrl: string;
}

export type HairStyleWithPhotos = HairStyle & {
  photos?: HairStylePhoto[];
};

export interface AdminReviewDTO {
  id: number;
  authorName?: string;
  text: string;
  stars: number;
  isVisible: boolean;
  createdAt: string;
}

export interface ReviewDisplayDTO {
  authorName?: string;
  text: string;
  stars: number;
  createdAt?: string;
}