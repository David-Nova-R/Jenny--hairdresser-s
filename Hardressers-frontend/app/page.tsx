'use client';

import {

  MapPin,
  Clock,
  Calendar,
  Phone,
} from 'lucide-react';

const COLOR_SERVICES = new Set([
  'Tinte permanente',
  'Tinte demipermanente',
  'Baño de color',
  'Técnicas de mechas y efectos de luz',
  'Balayage',
  'Baby Lights',
  'Ombré',
  'Californianas',
]);
import { useEffect, useMemo, useRef, useState } from 'react';

import { ImageWithFallback } from './ImageWithFallBack';
import AppointmentModal from './_components/appointment-modal';
import HairStyleSelectModal from './_components/hairstyle-select-modal';
import LoginModal from './_components/LoginModal';
import RegisterModal from './_components/RegisterModal';
import { useAuth } from './_context/auth-context';
import { useModal } from './_context/modal-context';
import { useLang } from './_context/language-context';
import ServerErrorModal from './_components/ServerErrorModal';
import { FetchAvailableSlots, FetchHairStyles, FetchVisibleReviews } from './_api/appointment-api';
import { AvailableDay, HairStyle, HairStyleWithPhotos, ReviewDisplayDTO } from './_models/models';
import { tr } from './_config/translations';
import ReviewsSection from './_components/sections/review-section';
import GallerySection from './_components/sections/gallery-section';
import ServicesSection from './_components/sections/service-section';
import ReviewModal from './_components/review-modal';

export default function HomePage() {
  const { user } = useAuth();
  const { activeModal, openModal, closeModal } = useModal();
  const { lang } = useLang();

  const [selectedHairStyle, setSelectedHairStyle] = useState<HairStyle | null>(null);
  const [bookingHairStyles, setBookingHairStyles] = useState<HairStyle[]>([]);
  const [hairStylesLoading, setHairStylesLoading] = useState(false);
  const [slots, setSlots] = useState<AvailableDay[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [galleryHairStyles, setGalleryHairStyles] = useState<HairStyleWithPhotos[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(false);
  const [reviews, setReviews] = useState<ReviewDisplayDTO[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [highlightBooking, setHighlightBooking] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [pageHairStyles, setPageHairStyles] = useState<HairStyle[]>([]);
  const [pageHairStylesLoading, setPageHairStylesLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);


  useEffect(() => {
    const handleHighlight = () => {
      setHighlightBooking(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHighlightBooking(true));
      });
      setTimeout(() => setHighlightBooking(false), 3100);
    };
    window.addEventListener('highlightBookingBtn', handleHighlight);
    return () => window.removeEventListener('highlightBookingBtn', handleHighlight);
  }, []);

  useEffect(() => {
    if (user && (selectedHairStyle || pendingBooking)) {
      void handleLoginSuccess();
    }
  }, [user]);

  useEffect(() => {
    FetchHairStyles()
      .then(setPageHairStyles)
      .catch((err: any) => { if (!err?.response) setServerError(true); })
      .finally(() => setPageHairStylesLoading(false));
  }, []);
  useEffect(() => {
    void loadGallery();
  }, []);
  useEffect(() => {
    void loadGallery();
    void loadReviews();
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadGallery = async () => {
    try {
      setGalleryLoading(true);
      const data = await FetchHairStyles();
      setGalleryHairStyles(data);
    } catch (err) {
      console.error('Failed to load gallery:', err);
      setGalleryHairStyles([]);
    } finally {
      setGalleryLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const { clientWidth } = scrollRef.current;

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -clientWidth : clientWidth,
      behavior: 'smooth',
    });
  };

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await FetchVisibleReviews();
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const openHairStyleModal = async () => {
    openModal('hairstyle');
    setSelectedHairStyle(null);
    setBookingHairStyles([]);
    setSlots([]);
    setHairStylesLoading(true);

    try {
      const data = await FetchHairStyles();
      setBookingHairStyles(data);
    } catch (err: any) {
      if (!err?.response) {
        closeModal();
        setServerError(true);
      }
    } finally {
      setHairStylesLoading(false);
    }
  };

  const allGalleryPhotos = galleryHairStyles.flatMap((hairStyle) =>
    (hairStyle.photos ?? []).map((photo) => ({
      ...photo,
      hairStyleName: hairStyle.name,
    }))
  );

  const openCalendarModal = async (hairStyle: HairStyle) => {
    setSelectedHairStyle(hairStyle);
    openModal('calendar');
    setSlots([]);
    setSlotsLoading(true);

    try {
      const now = new Date();
      const slotData = await FetchAvailableSlots(
        hairStyle.id,
        now.getFullYear(),
        now.getMonth() + 1
      );
      setSlots(slotData);
    } finally {
      setSlotsLoading(false);
    }
  };
  const servicesScrollRef = useRef<HTMLDivElement>(null);

  const scrollServices = (direction: 'left' | 'right') => {
    if (!servicesScrollRef.current) return;

    const firstCard = servicesScrollRef.current.querySelector('[data-service-card]') as HTMLElement | null;
    if (!firstCard) return;

    const gap = 16;
    const amount = firstCard.offsetWidth + gap;

    servicesScrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };
  const handleHairStyleSelect = async (hairStyle: HairStyle) => {
    if (!user) {
      setSelectedHairStyle(hairStyle);
      openModal('login');
      return;
    }

    await openCalendarModal(hairStyle);
  };

  const handleLoginSuccess = async () => {
    if (selectedHairStyle) {
      await openCalendarModal(selectedHairStyle);
    } else if (pendingBooking) {
      setPendingBooking(false);
      await openHairStyleModal();
    } else {
      closeModal();
    }
  };

  const handleBackToHairStyle = () => {
    openModal('hairstyle');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section id="hero" className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBoYWlyJTIwc3R5bGlzdCUyMHdvcmtpbmd8ZW58MXx8fHwxNzczMjM3NzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Luxury hair salon"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>

        <div className="relative z-10 max-w-4xl px-6 text-center">
          <div className="mb-6 inline-block rounded-full border border-[#D4AF37] px-6 py-2">
            <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              {tr('hero_badge', lang)}
            </span>
          </div>

          <h1 className="mb-6 text-6xl font-light tracking-tight md:text-7xl lg:text-8xl">
            {tr('hero_title_1', lang)}
            <br />
            {tr('hero_title_2', lang)}
          </h1>

          <div className="mx-auto mb-8 h-[1px] w-24 bg-[#D4AF37]" />

          <p className="mx-auto mb-12 max-w-2xl text-xl font-light text-gray-300 md:text-2xl">
            {tr('hero_subtitle', lang)}
          </p>

          <button
            className="rounded-full bg-[#D4AF37] px-12 py-4 text-lg tracking-wide text-black shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 hover:bg-[#F4D03F]"
            onClick={openHairStyleModal}
          >
            {tr('hero_book_btn', lang)}
          </button>
        </div>
      </section>

      <ServicesSection
        lang={lang}
        loading={pageHairStylesLoading}
        pageHairStyles={pageHairStyles}
        onSelect={handleHairStyleSelect}
      />

      <GallerySection
        lang={lang}
        loading={galleryLoading}
        photos={allGalleryPhotos}
      />
      <section id="booking" className="relative overflow-hidden bg-black px-6 py-24">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            {tr('booking_badge', lang)}
          </span>
          <h2 className="mt-4 mb-6 text-5xl font-light md:text-6xl">
            {tr('booking_title_1', lang)}
            <br />
            {tr('booking_title_2', lang)}
          </h2>
          <div className="mx-auto mb-8 h-[1px] w-24 bg-[#D4AF37]" />
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
            {tr('booking_subtitle', lang)}
          </p>
          <button
            className={`group inline-flex items-center gap-3 rounded-full bg-[#D4AF37] px-16 py-5 text-lg text-black shadow-2xl shadow-[#D4AF37]/30 transition-all duration-300 hover:bg-[#F4D03F]${highlightBooking ? ' booking-highlight' : ''}`}
            onClick={openHairStyleModal}
          >
            <Calendar className="h-5 w-5 transition-transform group-hover:scale-110" />
            {tr('booking_btn', lang)}
          </button>
        </div>
      </section>

      <section id="contact" className="bg-gradient-to-b from-black to-[#0a0a0a] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              {tr('contact_badge', lang)}
            </span>
            <h2 className="mt-4 mb-6 text-5xl font-light md:text-6xl">
              {tr('contact_title', lang)}
            </h2>
            <div className="mx-auto h-[1px] w-24 bg-[#D4AF37]" />
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37] bg-black">
                <MapPin className="h-8 w-8 text-[#D4AF37]" />
              </div>
              <h3 className="mb-3 text-xl">{tr('contact_location', lang)}</h3>
              <p className="leading-relaxed text-gray-400">
                {tr('contact_location_1', lang)}
                <br />
                {tr('contact_location_2', lang)}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37] bg-black">
                <Phone className="h-8 w-8 text-[#D4AF37]" />
              </div>
              <h3 className="mb-3 text-xl">{tr('contact_contact', lang)}</h3>
              <p className="leading-relaxed text-gray-400">
                +1 (555) 123-4567
                <br />
                hello@luxuryhair.com
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37] bg-black">
                <Clock className="h-8 w-8 text-[#D4AF37]" />
              </div>
              <h3 className="mb-3 text-xl">{tr('contact_hours', lang)}</h3>
              <p className="leading-relaxed text-gray-400">
                {tr('contact_hours_1', lang)}
                <br />
                {tr('contact_hours_2', lang)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection
        reviews={reviews}
        loading={reviewsLoading}
      />

      <section className="bg-black px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            {tr('review_badge', lang)}
          </span>

          <h2 className="mt-4 mb-6 text-4xl font-light md:text-5xl">
            {tr('review_title', lang)}
          </h2>

          <div className="mx-auto mb-8 h-[1px] w-24 bg-[#D4AF37]" />

          <p className="mx-auto mb-8 max-w-2xl text-gray-300">
            {tr('review_subtitle', lang)}
          </p>

          <button
            onClick={() => {
              if (!user) {
                openModal('login');
                return;
              }
              setReviewModalOpen(true);
            }}
            className="rounded-full bg-[#D4AF37] px-10 py-4 text-black transition hover:bg-[#F4D03F]"
          >
            {tr('review_btn', lang)}
          </button>
        </div>
      </section>

      <ReviewModal
        show={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSuccess={() => {
          void loadReviews();
        }}
      />

      <HairStyleSelectModal
        show={activeModal === 'hairstyle'}
        HairStyles={bookingHairStyles}
        onSelect={handleHairStyleSelect}
        onClose={closeModal}
        loading={hairStylesLoading}
      />

      {selectedHairStyle && (
        <AppointmentModal
          show={activeModal === 'calendar'}
          onClose={closeModal}
          onBackToHairStyle={handleBackToHairStyle}
          slots={slots}
          selectedHairStyle={selectedHairStyle}
          slotsLoading={slotsLoading}
        />
      )}

      <LoginModal
        show={activeModal === 'login'}
        onClose={closeModal}
        onSwitchToRegister={() => openModal('register')}
      />

      <RegisterModal
        show={activeModal === 'register'}
        onClose={closeModal}
        onSwitchToLogin={() => openModal('login')}
      />

      <ServerErrorModal
        show={serverError}
        onClose={() => setServerError(false)}
      />
    </div>
  );
}