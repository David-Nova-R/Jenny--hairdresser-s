'use client';

import {
  Palette,
  Sparkles,
  Heart,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Scissors,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ImageWithFallback } from './ImageWithFallBack';
import AppointmentModal from './_components/appointment-modal';
import HairStyleSelectModal from './_components/hairstyle-select-modal';
import LoginModal from './_components/LoginModal';
import RegisterModal from './_components/RegisterModal';
import { useAuth } from './_context/auth-context';
import { useModal } from './_context/modal-context';
import { FetchAvailableSlots, FetchHairStyles, FetchVisibleReviews } from './_api/appointment-api';
import { AvailableDay, HairStyle, HairStyleWithPhotos, ReviewDisplayDTO } from './_models/models';

export default function HomePage() {
  const { user } = useAuth();
  const { activeModal, openModal, closeModal } = useModal();

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

  const reviewScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && (selectedHairStyle || pendingBooking)) {
      void handleLoginSuccess();
    }
  }, [user]);

  useEffect(() => {
    void loadGallery();
  }, []);
  useEffect(() => {
    void loadGallery();
    void loadReviews();
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);

  const uiHairStyles = useMemo(() => [{
    icon: Scissors,
    title: 'Haircuts',
    description: 'Precision cuts tailored to your unique style and personality.',
    price: 'From $80',
  },
  {
    icon: Palette,
    title: 'Coloring',
    description: 'Expert color services including highlights, balayage, and full color.',
    price: 'From $150',
  },
  {
    icon: Sparkles, title: 'Styling',
    description: 'Professional styling for special occasions and everyday elegance.',
    price: 'From $60',
  },
  {
    icon: Heart,
    title: 'Treatments',
    description: 'Luxurious treatments to restore and nourish your hair.',
    price: 'From $100',
  },], []);

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

  const scrollReviews = (direction: 'left' | 'right') => {
    if (!reviewScrollRef.current) return;

    const { clientWidth } = reviewScrollRef.current;

    reviewScrollRef.current.scrollBy({
      left: direction === 'left' ? -clientWidth : clientWidth,
      behavior: 'smooth',
    });
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
              Private Studio
            </span>
          </div>

          <h1 className="mb-6 text-6xl font-light tracking-tight md:text-7xl lg:text-8xl">
            Luxury Hair
            <br />
            Experience
          </h1>

          <div className="mx-auto mb-8 h-[1px] w-24 bg-[#D4AF37]" />

          <p className="mx-auto mb-12 max-w-2xl text-xl font-light text-gray-300 md:text-2xl">
            Personalized attention in an intimate home studio setting
          </p>

          <button
            className="rounded-full bg-[#D4AF37] px-12 py-4 text-lg tracking-wide text-black shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 hover:bg-[#F4D03F]"
            onClick={openHairStyleModal}
          >
            Book Appointment
          </button>
        </div>
      </section>

      <section id="HairStyles" className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              My HairStyles
            </span>
            <h2 className="mt-4 mb-6 text-5xl font-light md:text-6xl">
              Premium Treatments
            </h2>
            <div className="mx-auto h-[1px] w-24 bg-[#D4AF37]" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {uiHairStyles.map((hairStyle, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!user) {
                    setPendingBooking(true);
                    openModal('login');
                  } else {
                    void openHairStyleModal();
                  }
                }}
                className="group flex flex-col rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-8 text-left transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/10 cursor-pointer"
              >
                <div className="mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37] bg-black transition-all duration-300 group-hover:bg-[#D4AF37]">
                    <hairStyle.icon className="h-7 w-7 text-[#D4AF37] transition-colors duration-300 group-hover:text-black" />
                  </div>
                </div>
                <h3 className="mb-3 text-2xl font-normal">{hairStyle.title}</h3>
                <p className="mb-6 grow leading-relaxed text-gray-400">{hairStyle.description}</p>
                <p className="text-lg text-[#D4AF37]">{hairStyle.price}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              Portfolio
            </span>
            <h2 className="mt-4 mb-6 text-5xl font-light md:text-6xl">
              My Work
            </h2>
            <div className="mx-auto h-[1px] w-24 bg-[#D4AF37]" />
          </div>

          {galleryLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <span className="text-gray-400">Loading gallery...</span>
            </div>
          ) : allGalleryPhotos.length <= 4 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {allGalleryPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a] transition-all duration-300 hover:border-[#D4AF37]/50"
                >
                  <ImageWithFallback
                    src={photo.photoUrl}
                    alt={photo.hairStyleName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-medium text-white">{photo.hairStyleName}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[#D4AF37]/20 bg-black/80 p-3 text-white transition hover:border-[#D4AF37]/50 hover:bg-black md:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[#D4AF37]/20 bg-black/80 p-3 text-white transition hover:border-[#D4AF37]/50 hover:bg-black md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-16 bg-gradient-to-r from-black to-transparent md:block" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-16 bg-gradient-to-l from-black to-transparent md:block" />

              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth px-2 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {allGalleryPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative aspect-[4/5] w-[280px] min-w-[280px] overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a] transition-all duration-300 hover:border-[#D4AF37]/50"
                  >
                    <ImageWithFallback
                      src={photo.photoUrl}
                      alt={photo.hairStyleName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-sm font-medium text-white">{photo.hairStyleName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="booking" className="relative overflow-hidden bg-black px-6 py-24">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            Book Now
          </span>
          <h2 className="mt-4 mb-6 text-5xl font-light md:text-6xl">
            Ready for Your
            <br />
            Transformation?
          </h2>
          <div className="mx-auto mb-8 h-[1px] w-24 bg-[#D4AF37]" />
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
            Schedule your private appointment and experience personalized luxury
          </p>
          <button
            className="group inline-flex items-center gap-3 rounded-full bg-[#D4AF37] px-16 py-5 text-lg text-black shadow-2xl shadow-[#D4AF37]/30 transition-all duration-300 hover:bg-[#F4D03F]"
            onClick={openHairStyleModal}
          >
            <Calendar className="h-5 w-5 transition-transform group-hover:scale-110" />
            Book an Appointment
          </button>
        </div>
      </section>

      <section id="contact" className="bg-gradient-to-b from-black to-[#0a0a0a] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              Get in Touch
            </span>
            <h2 className="mt-4 mb-6 text-5xl font-light md:text-6xl">
              Visit My Studio
            </h2>
            <div className="mx-auto h-[1px] w-24 bg-[#D4AF37]" />
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37] bg-black">
                <MapPin className="h-8 w-8 text-[#D4AF37]" />
              </div>
              <h3 className="mb-3 text-xl">Location</h3>
              <p className="leading-relaxed text-gray-400">
                Private Home Studio
                <br />
                By Appointment Only
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37] bg-black">
                <Phone className="h-8 w-8 text-[#D4AF37]" />
              </div>
              <h3 className="mb-3 text-xl">Contact</h3>
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
              <h3 className="mb-3 text-xl">Hours</h3>
              <p className="leading-relaxed text-gray-400">
                Tue - Sat: 9AM - 6PM
                <br />
                By Appointment Only
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              Testimonials
            </span>
            <h2 className="mt-4 mb-6 text-5xl font-light md:text-6xl">
              Client Reviews
            </h2>
            <div className="mx-auto h-[1px] w-24 bg-[#D4AF37]" />
          </div>

          {reviewsLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <span className="text-gray-400">Loading reviews...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/20 bg-[#0a0a0a] text-gray-400">
              No reviews available yet.
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => scrollReviews('left')}
                className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[#D4AF37]/20 bg-black/80 p-3 text-white transition hover:border-[#D4AF37]/50 hover:bg-black md:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={() => scrollReviews('right')}
                className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[#D4AF37]/20 bg-black/80 p-3 text-white transition hover:border-[#D4AF37]/50 hover:bg-black md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-16 bg-gradient-to-r from-black to-transparent md:block" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-16 bg-gradient-to-l from-black to-transparent md:block" />

              <div
                ref={reviewScrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {reviews.map((review, index) => (
                  <div
                    key={`${review.authorName ?? 'review'}-${index}`}
                    className="min-w-[320px] max-w-[320px] rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-8 transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/10"
                  >
                    <div className="mb-4 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-4 w-4 ${starIndex < review.stars
                              ? 'fill-[#D4AF37] text-[#D4AF37]'
                              : 'text-gray-600'
                            }`}
                        />
                      ))}
                    </div>

                    <p className="mb-6 min-h-[96px] leading-relaxed text-gray-300">
                      “{review.text}”
                    </p>

                    <div className="border-t border-[#D4AF37]/10 pt-4">
                      <p className="text-sm font-medium text-white">
                        {review.authorName || 'Anonymous'}
                      </p>

                      {review.createdAt && (
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

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
    </div>
  );
}