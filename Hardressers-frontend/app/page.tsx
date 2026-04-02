'use client';

import { MapPin, Clock, Calendar, Phone, Instagram } from 'lucide-react';

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
import { useEffect, useRef, useState } from 'react';

import { ImageWithFallback } from './ImageWithFallBack';
import AppointmentModal from './_components/appointment-modal';
import HairStyleSelectModal from './_components/hairstyle-select-modal';
import LoginModal from './_components/LoginModal';
import RegisterModal from './_components/RegisterModal';
import { useAuth } from './_context/auth-context';
import { useModal } from './_context/modal-context';
import { useLang } from './_context/language-context';
import ServerErrorModal from './_components/ServerErrorModal';
import { FetchAvailableSlots, FetchHairStyles, FetchPortfolioPhotos, FetchAllPortfolioPhotosAdmin, FetchVisibleReviews } from './_api/appointment-api';
import { AvailableDay, HairStyle, PortfolioPhoto, ReviewDisplayDTO } from './_models/models';
import { tr } from './_config/translations';
import ReviewsSection from './_components/sections/review-section';
import GallerySection from './_components/sections/gallery-section';
import ServicesSection from './_components/sections/service-section';
import ReviewModal from './_components/review-modal';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { activeModal, openModal, closeModal } = useModal();
  const { lang } = useLang();

  const [selectedHairStyle, setSelectedHairStyle] = useState<HairStyle | null>(null);
  const [bookingHairStyles, setBookingHairStyles] = useState<HairStyle[]>([]);
  const [hairStylesLoading, setHairStylesLoading] = useState(false);
  const [slots, setSlots] = useState<AvailableDay[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [portfolioPhotos, setPortfolioPhotos] = useState<PortfolioPhoto[]>([]);
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
    void loadReviews();
  }, []);
  useEffect(() => {
    if (!authLoading) void loadGallery();
  }, [authLoading]);
  const loadGallery = async () => {
    try {
      setGalleryLoading(true);
      const isAdmin = !!user?.app_metadata?.isAdmin;
      const data = isAdmin
        ? await FetchAllPortfolioPhotosAdmin()
        : await FetchPortfolioPhotos();
      setPortfolioPhotos([...data].sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Failed to load gallery:', err);
      setPortfolioPhotos([]);
    } finally {
      setGalleryLoading(false);
    }
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
        photos={portfolioPhotos}
        onPhotosChange={setPortfolioPhotos}
        isAdmin={!!user?.app_metadata?.isAdmin}
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

      <section id="Contact" className="bg-gradient-to-b from-black to-[#0a0a0a] px-6 py-24">
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
                <a href="tel:+15142334466" className="transition hover:text-[#D4AF37]">
                  +1 514 233-4466
                </a>
                <br />
                <a href="mailto:jplambar@gmail.com" className="transition hover:text-[#D4AF37]">
                  jplambar@gmail.com
                </a>
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

          {/* Social media */}
          <div className="mt-16 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-16 bg-[#D4AF37]/30" />
              <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]/70">
                {tr('contact_social', lang)}
              </span>
              <div className="h-[1px] w-16 bg-[#D4AF37]/30" />
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/jennyrengifo01?igsh=MXMxN2QwdGprbTJubA=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]"
              >
                <Instagram className="h-6 w-6 text-[#D4AF37] transition-colors group-hover:text-black" />
              </a>

              <a
                href="https://wa.me/15142334466"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#D4AF37] transition-colors group-hover:fill-black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
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