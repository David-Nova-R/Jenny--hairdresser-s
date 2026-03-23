'use client';

import { Scissors, Palette, Sparkles, Heart, Calendar, Phone, MapPin, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './ImageWithFallBack';
import AppointmentModal from './_components/appointment-modal';
import { AvailableDay, HairStyle } from './_models/models';
import { FetchAvailableSlots, FetchHairStyles } from './_api/appointment-api';
import HairStyleSelectModal from './_components/hairstyle-select-modal';
import { useAuth } from './_hooks/auth-context';
import LoginModal from './_components/LoginModal';
import RegisterModal from './_components/RegisterModal';

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function App() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  // Booking modal state
  const [showHairStyleModal, setShowHairStyleModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedHairStyle, setSelectedHairStyle] = useState<HairStyle | null>(null);
  const [bookingHairStyles, setBookingHairStyles] = useState<HairStyle[]>([]);
  const [HairStylesLoading, setHairStylesLoading] = useState(false);
  const [slots, setSlots] = useState<AvailableDay[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Authentication modals state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto proceed to calendar after successful login
  useEffect(() => {
    if (user && showLoginModal && selectedHairStyle) {
      handleLoginSuccess();
    }
  }, [user, showLoginModal, selectedHairStyle]);

  // Open HairStyle modal and fetch HairStyles
  const handleBookClick = async () => {
    setShowHairStyleModal(true);
    setSelectedHairStyle(null);
    setShowCalendarModal(false);
    setBookingHairStyles([]);
    setSlots([]);
    setHairStylesLoading(true);
    try {
      setHairStylesLoading(true);
      const data = await FetchHairStyles();
      setBookingHairStyles(data);
    } finally {
      setHairStylesLoading(false);
    }
  };

  // After HairStyle selection, fetch available slots
  const handleHairStyleSelect = async (HairStyle: HairStyle) => {
    // Check if user is authenticated
    if (!user) {
      // Save the selected hairstyle for later
      setSelectedHairStyle(HairStyle);
      setShowHairStyleModal(false);
      setShowLoginModal(true);
      return;
    }

    setSelectedHairStyle(HairStyle);
    setShowHairStyleModal(false);
    setShowCalendarModal(true);
    setSlots([]);
    setSlotsLoading(true);
    try {
      const now = new Date();
      setSlotsLoading(true);
      const slotData = await FetchAvailableSlots(
        HairStyle.id,
        now.getFullYear(),
        now.getMonth() + 1,
      );
      setSlots(slotData);
    } finally {
      setSlotsLoading(false);
    }
  };

  // Close modals
  const handleCloseHairStyleModal = () => {
    setShowHairStyleModal(false);
    setSelectedHairStyle(null);
    setBookingHairStyles([]);
  };

  const handleCloseCalendarModal = () => {
    setShowCalendarModal(false);
    // Optionally keep selectedHairStyle to go back to HairStyle selection
  };

  const handleBackToHairStyle = () => {
    // Go back to HairStyle selection
    setShowCalendarModal(false);
    setShowHairStyleModal(true);
  };

  // Handle successful login - proceed with appointment booking
  const handleLoginSuccess = async () => {
    setShowLoginModal(false);
    if (selectedHairStyle) {
      // Show calendar modal with the selected hairstyle
      setShowCalendarModal(true);
      setSlots([]);
      setSlotsLoading(true);
      try {
        const now = new Date();
        const slotData = await FetchAvailableSlots(
          selectedHairStyle.id,
          now.getFullYear(),
          now.getMonth() + 1,
        );
        setSlots(slotData);
      } finally {
        setSlotsLoading(false);
      }
    }
  };

  // UI HairStyles for the display cards
  const uiHairStyles = [
    {
      icon: Scissors,
      title: 'Haircuts',
      description: 'Precision cuts tailored to your unique style and personality.',
      price: 'From $80'
    },
    {
      icon: Palette,
      title: 'Coloring',
      description: 'Expert color HairStyles including highlights, balayage, and full color.',
      price: 'From $150'
    },
    {
      icon: Sparkles,
      title: 'Styling',
      description: 'Professional styling for special occasions and everyday elegance.',
      price: 'From $60'
    },
    {
      icon: Heart,
      title: 'Treatments',
      description: 'Luxurious treatments to restore and nourish your hair.',
      price: 'From $100'
    }
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9uZGUlMjBiYWxheWFnZSUyMGhhaXJ8ZW58MXx8fHwxNzczMjM3NzUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1703705632900-4cb9361015e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnVuZXR0ZSUyMGxheWVycyUyMGhhaXJjdXR8ZW58MXx8fHwxNzczMjM3NzUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1647929369523-00965586f722?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBoYWlyJTIwY29sb3IlMjB0cmFuc2Zvcm1hdGlvbnxlbnwxfHx8fDE3NzMyMzc3NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1765490372652-13e7ce0f5dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXZ5JTIwaGFpciUyMHN0eWxpbmd8ZW58MXx8fHwxNzczMjM3NzUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1623104086040-35e17b8a8819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwY29sb3JpbmclMjBhcHBvaW50bWVudHxlbnwxfHx8fDE3NzMyMzc3NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1563798163029-5448a0ffd596?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGdldHRpbmclMjBoYWlyY3V0JTIwc2Fsb258ZW58MXx8fHwxNzczMjIxMDg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-[#D4AF37]/20 py-4'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
              <Scissors className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <span className="text-xl tracking-wider font-light">
              LUXURY <span className="text-[#D4AF37]">HAIR</span>
            </span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('HairStyles')}
              className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
            >
              HairStyles
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
            >
              Contact
            </button>
            
            {/* Auth and Booking Buttons - Grouped Together */}
            <div className="flex items-center gap-3 ml-auto">
              {user ? (
                <div className="flex items-center gap-3 border-x border-[#D4AF37]/20 px-3">
                  <span className="text-gray-300 text-sm">{user.email}</span>
                  <button
                    onClick={() => logout()}
                    className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-[#D4AF37] text-black px-6 py-2 rounded-full hover:bg-[#F4D03F] transition-all duration-300 shadow-lg shadow-[#D4AF37]/20"
                >
                  Login
                </button>
              )}
              
              <button
                onClick={() => scrollToSection('booking')}
                className="bg-[#D4AF37] text-black px-6 py-2 rounded-full hover:bg-[#F4D03F] transition-all duration-300 shadow-lg shadow-[#D4AF37]/20"
              >
                Book Now
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBoYWlyJTIwc3R5bGlzdCUyMHdvcmtpbmd8ZW58MXx8fHwxNzczMjM3NzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Luxury hair salon"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="mb-6 inline-block border border-[#D4AF37] px-6 py-2 rounded-full">
            <span className="text-[#D4AF37] tracking-[0.3em] text-sm uppercase">Private Studio</span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl mb-6 tracking-tight font-light hero-letter-spacing">
            Luxury Hair<br />Experience
          </h1>
          <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
            Personalized attention in an intimate home studio setting
          </p>
          <button
            className="bg-[#D4AF37] text-black px-12 py-4 rounded-full hover:bg-[#F4D03F] transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 text-lg tracking-wide"
            onClick={handleBookClick}
          >
            Book Appointment
          </button>
        </div>
      </section>

      {/* HairStyles Section */}
      <section id="HairStyles" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase">My HairStyles</span>
            <h2 className="text-5xl md:text-6xl mt-4 mb-6 font-light">Premium Treatments</h2>
            <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {uiHairStyles.map((HairStyle, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-[#0a0a0a] to-black border border-[#D4AF37]/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-300 group hover:shadow-xl hover:shadow-[#D4AF37]/10"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-black border border-[#D4AF37] flex items-center justify-center group-hover:bg-[#D4AF37] transition-all duration-300">
                    <HairStyle.icon className="w-7 h-7 text-[#D4AF37] group-hover:text-black transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="text-2xl mb-3 font-normal">{HairStyle.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{HairStyle.description}</p>
                <p className="text-[#D4AF37] text-lg">{HairStyle.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase">Portfolio</span>
            <h2 className="text-5xl md:text-6xl mt-4 mb-6 font-light">My Work</h2>
            <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl aspect-square border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <ImageWithFallback
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1638474368314-59198edde028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyc3R5bGlzdCUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzE1NTY3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Your stylist"
                className="w-full h-[600px] object-cover rounded-2xl border border-[#D4AF37]/20"
              />
            </div>

            <div>
              <span className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase">About Me</span>
              <h2 className="text-5xl md:text-6xl mt-4 mb-6 font-light">Passion Meets<br />Expertise</h2>
              <div className="w-24 h-[1px] bg-[#D4AF37] mb-8"></div>

              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                With over 15 years of experience, I've dedicated my career to the art of hair styling. Working from my private home studio allows me to provide you with undivided attention and a truly personalized experience.
              </p>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Every appointment is a one-on-one consultation where we focus entirely on bringing your vision to life. I use only premium products and the latest techniques to ensure you leave feeling confident and beautiful.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#D4AF37]/20">
                <div>
                  <div className="text-4xl text-[#D4AF37] mb-2 font-light">15+</div>
                  <div className="text-gray-400">Years Experience</div>
                </div>
                <div>
                  <div className="text-4xl text-[#D4AF37] mb-2 font-light">100%</div>
                  <div className="text-gray-400">Personal Attention</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-24 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#D4AF37] rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#D4AF37] rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase">Book Now</span>
          <h2 className="text-5xl md:text-6xl mt-4 mb-6 font-light">
            Ready for Your<br />Transformation?
          </h2>
          <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mb-8"></div>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Schedule your private appointment and experience personalized luxury
          </p>

          <button className="bg-[#D4AF37] text-black px-16 py-5 rounded-full hover:bg-[#F4D03F] transition-all duration-300 shadow-2xl shadow-[#D4AF37]/30 text-lg inline-flex items-center gap-3 group" onClick={handleBookClick}>
            <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Book an Appointment
          </button>

          {/* HairStyle selection modal */}
          {showHairStyleModal && (
            <HairStyleSelectModal
              HairStyles={bookingHairStyles}
              onSelect={handleHairStyleSelect}
              onClose={handleCloseHairStyleModal}
              loading={HairStylesLoading}
            />
          )}

          {/* Calendar modal (AppointmentModal) */}
          {showCalendarModal && selectedHairStyle && (
            <AppointmentModal
              show={showCalendarModal}
              onClose={handleCloseCalendarModal}
              onBackToHairStyle={handleBackToHairStyle}
              slots={slots}
              selectedHairStyle={selectedHairStyle}
              slotsLoading={slotsLoading}
            />
          )}

          {/* Login Modal */}
          <LoginModal
            show={showLoginModal}
            onClose={() => {
              setShowLoginModal(false);
              setShowHairStyleModal(true);
              setSelectedHairStyle(null);
            }}
            onSwitchToRegister={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
          />

          {/* Register Modal */}
          <RegisterModal
            show={showRegisterModal}
            onClose={() => {
              setShowRegisterModal(false);
              setShowHairStyleModal(true);
              setSelectedHairStyle(null);
            }}
            onSwitchToLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase">Get in Touch</span>
            <h2 className="text-5xl md:text-6xl mt-4 mb-6 font-light">Visit My Studio</h2>
            <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border border-[#D4AF37] flex items-center justify-center mx-auto mb-6 bg-black">
                <MapPin className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl mb-3">Location</h3>
              <p className="text-gray-400 leading-relaxed">
                Private Home Studio<br />
                By Appointment Only
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full border border-[#D4AF37] flex items-center justify-center mx-auto mb-6 bg-black">
                <Phone className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl mb-3">Contact</h3>
              <p className="text-gray-400 leading-relaxed">
                +1 (555) 123-4567<br />
                hello@luxuryhair.com
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full border border-[#D4AF37] flex items-center justify-center mx-auto mb-6 bg-black">
                <Clock className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl mb-3">Hours</h3>
              <p className="text-gray-400 leading-relaxed">
                Tue - Sat: 9AM - 6PM<br />
                By Appointment Only
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Luxury Hair Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}