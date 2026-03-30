import { Lang } from '../_context/language-context';

export const t: Record<string, Record<Lang, string>> = {
  // ── Navbar ──────────────────────────────────────────────
  nav_services: { es: 'Servicios', fr: 'Services', en: 'Services' },
  nav_gallery: { es: 'Galería', fr: 'Galerie', en: 'Gallery' },
  nav_about: { es: 'Sobre mí', fr: 'À propos', en: 'About' },
  nav_contact: { es: 'Contacto', fr: 'Contact', en: 'Contact' },
  nav_book_now: { es: 'Reservar', fr: 'Réserver', en: 'Book Now' },
  nav_login: { es: 'Iniciar sesión', fr: 'Connexion', en: 'Login' },
  nav_logout: { es: 'Cerrar sesión', fr: 'Déconnexion', en: 'Logout' },
  nav_appointments: { es: 'Mis citas', fr: 'Mes rendez-vous', en: 'My Appointments' },

  // ── Hero ────────────────────────────────────────────────
  hero_badge: { es: 'Estudio Privado', fr: 'Studio Privé', en: 'Private Studio' },
  hero_title_1: { es: 'Experiencia', fr: 'Expérience', en: 'Luxury Hair' },
  hero_title_2: { es: 'de Lujo', fr: 'Capillaire', en: 'Experience' },
  hero_subtitle: {
    es: 'Atención personalizada en un íntimo estudio privado',
    fr: 'Attention personnalisée dans un cadre intime et privé',
    en: 'Personalized attention in an intimate home studio setting',
  },
  hero_book_btn: { es: 'Reservar cita', fr: 'Prendre rendez-vous', en: 'Book Appointment' },

  // ── Services section ────────────────────────────────────
  services_badge: { es: 'Mis Servicios', fr: 'Mes Services', en: 'My Services' },
  services_title: { es: 'Tratamientos Premium', fr: 'Traitements Premium', en: 'Premium Treatments' },
  services_from: { es: 'Desde', fr: 'À partir de', en: 'From' },

  // ── Gallery section ─────────────────────────────────────
  gallery_badge: { es: 'Portafolio', fr: 'Portfolio', en: 'Portfolio' },
  gallery_title: { es: 'Mi Trabajo', fr: 'Mon Travail', en: 'My Work' },

  // ── Booking section ─────────────────────────────────────
  booking_badge: { es: 'Reservar', fr: 'Réserver', en: 'Book Now' },
  booking_title_1: { es: '¿Lista para tu', fr: 'Prête pour votre', en: 'Ready for Your' },
  booking_title_2: { es: 'Transformación?', fr: 'Transformation ?', en: 'Transformation?' },
  booking_subtitle: {
    es: 'Agenda tu cita privada y vive una experiencia de lujo personalizada',
    fr: 'Planifiez votre rendez-vous privé et vivez une expérience de luxe',
    en: 'Schedule your private appointment and experience personalized luxury',
  },
  booking_btn: { es: 'Reservar una cita', fr: 'Prendre un rendez-vous', en: 'Book an Appointment' },

  // ── Contact section ─────────────────────────────────────
  contact_badge: { es: 'Contáctanos', fr: 'Contactez-nous', en: 'Get in Touch' },
  contact_title: { es: 'Visita Mi Estudio', fr: 'Visitez Mon Studio', en: 'Visit My Studio' },
  contact_location: { es: 'Ubicación', fr: 'Adresse', en: 'Location' },
  contact_location_1: { es: 'Estudio Privado en Casa', fr: 'Studio Privé à Domicile', en: 'Private Home Studio' },
  contact_location_2: { es: 'Solo con cita previa', fr: 'Sur rendez-vous uniquement', en: 'By Appointment Only' },
  contact_contact: { es: 'Contacto', fr: 'Contact', en: 'Contact' },
  contact_hours: { es: 'Horarios', fr: 'Horaires', en: 'Hours' },
  contact_hours_1: { es: 'Mar - Sáb: 9AM - 6PM', fr: 'Mar - Sam: 9h - 18h', en: 'Tue - Sat: 9AM - 6PM' },
  contact_hours_2: { es: 'Solo con cita previa', fr: 'Sur rendez-vous uniquement', en: 'By Appointment Only' },

  // ── Footer ───────────────────────────────────────────────
  footer_rights: {
    es: '© 2026 M&D. Todos los derechos reservados.',
    fr: '© 2026 M&D. Tous droits réservés.',
    en: '© 2026 M&D. All rights reserved.',
  },

  // ── My appointments page ─────────────────────────────────
  appt_badge: { es: 'Mis Citas', fr: 'Mes Rendez-vous', en: 'My Appointments' },
  appt_title: { es: 'Mis citas', fr: 'Mes rendez-vous', en: 'My Appointments' },
  appt_subtitle: { es: 'Encuentra aquí tus próximas citas y el historial de tus visitas.', fr: 'Retrouvez ici vos prochains rendez-vous et l\'historique de vos visites.', en: 'Find your upcoming appointments and visit history here.' },
  appt_upcoming: { es: 'Próximas', fr: 'À venir', en: 'Upcoming' },
  appt_history: { es: 'Historial', fr: 'Historique', en: 'History' },
  appt_none_upcoming: { es: 'No hay citas próximas.', fr: 'Aucun rendez-vous à venir.', en: 'No upcoming appointments.' },
  appt_none_past: { es: 'No hay citas pasadas.', fr: 'Aucun rendez-vous passé.', en: 'No past appointments.' },
  appt_status: { es: 'Estado', fr: 'Statut', en: 'Status' },
  appt_price: { es: 'Precio', fr: 'Prix', en: 'Price' },
  appt_badge_upcoming: { es: 'Próxima', fr: 'À venir', en: 'Upcoming' },
  appt_badge_past: { es: 'Pasada', fr: 'Passée', en: 'Past' },
  appt_error: { es: 'Error al cargar las citas.', fr: 'Erreur lors du chargement des rendez-vous.', en: 'Error loading appointments.' },
  status_0: { es: 'Pendiente', fr: 'En attente', en: 'Pending' },
  status_1: { es: 'Confirmada', fr: 'Confirmé', en: 'Confirmed' },
  status_2: { es: 'Cancelada', fr: 'Annulé', en: 'Cancelled' },
  status_3: { es: 'Completada', fr: 'Terminé', en: 'Completed' },
  status_4: { es: 'Externo', fr: 'Externe', en: 'External' },

  // ── Hairstyle select modal ───────────────────────────────
  modal_choose: { es: 'Elige un servicio', fr: 'Choisissez un service', en: 'Choose a service' },
  modal_next: { es: 'Siguiente', fr: 'Suivant', en: 'Next' },

  // ── Appointment confirmation ──────────────────────────────
  confirm_loading: { es: 'Verificando...', fr: 'Vérification...', en: 'Verifying...' },
  confirm_success: { es: '¡Tu cita está confirmada!', fr: 'Votre rendez-vous est confirmé !', en: 'Your appointment is confirmed!' },
  confirm_error_title: { es: 'Error al reservar. Por favor intenta más tarde.', fr: 'Erreur lors de la réservation. Veuillez réessayer.', en: 'Booking error. Please try again later.' },
  confirm_service: { es: 'Servicio', fr: 'Service', en: 'Service' },
  confirm_date: { es: 'Fecha', fr: 'Date', en: 'Date' },
  confirm_time: { es: 'Hora', fr: 'Heure', en: 'Time' },
  confirm_duration: { es: 'Duración', fr: 'Durée', en: 'Duration' },
  confirm_price: { es: 'Precio', fr: 'Prix', en: 'Price' },

  // ── Appointment modal ────────────────────────────────────
  modal_service_selected: { es: 'Servicio seleccionado:', fr: 'Service sélectionné :', en: 'Selected service:' },
  modal_loading_days: { es: 'Cargando días disponibles...', fr: 'Chargement des jours disponibles...', en: 'Loading available days...' },
  modal_loading_times: { es: 'Cargando horarios...', fr: 'Chargement des horaires...', en: 'Loading available times...' },
  modal_select_time: { es: 'Selecciona un horario:', fr: 'Choisissez un horaire :', en: 'Select a time:' },
  modal_no_times: { es: 'No hay horarios disponibles para este día.', fr: 'Aucun horaire disponible pour ce jour.', en: 'No available times for this day.' },
  modal_back: { es: 'Volver', fr: 'Retour', en: 'Back' },
  modal_confirm: { es: 'Confirmar', fr: 'Confirmer', en: 'Confirm' },
  modal_close: { es: 'Cerrar', fr: 'Fermer', en: 'Close' },

  // Mois
  month_0: { es: 'Enero', fr: 'Janvier', en: 'January' },
  month_1: { es: 'Febrero', fr: 'Février', en: 'February' },
  month_2: { es: 'Marzo', fr: 'Mars', en: 'March' },
  month_3: { es: 'Abril', fr: 'Avril', en: 'April' },
  month_4: { es: 'Mayo', fr: 'Mai', en: 'May' },
  month_5: { es: 'Junio', fr: 'Juin', en: 'June' },
  month_6: { es: 'Julio', fr: 'Juillet', en: 'July' },
  month_7: { es: 'Agosto', fr: 'Août', en: 'August' },
  month_8: { es: 'Septiembre', fr: 'Septembre', en: 'September' },
  month_9: { es: 'Octubre', fr: 'Octobre', en: 'October' },
  month_10: { es: 'Noviembre', fr: 'Novembre', en: 'November' },
  month_11: { es: 'Diciembre', fr: 'Décembre', en: 'December' },

  // Jours
  day_0: { es: 'Domingo', fr: 'Dimanche', en: 'Sunday' },
  day_1: { es: 'Lunes', fr: 'Lundi', en: 'Monday' },
  day_2: { es: 'Martes', fr: 'Mardi', en: 'Tuesday' },
  day_3: { es: 'Miércoles', fr: 'Mercredi', en: 'Wednesday' },
  day_4: { es: 'Jueves', fr: 'Jeudi', en: 'Thursday' },
  day_5: { es: 'Viernes', fr: 'Vendredi', en: 'Friday' },
  day_6: { es: 'Sábado', fr: 'Samedi', en: 'Saturday' },

  // ── Admin dashboard ──────────────────────────────────────
  admin_title: { es: 'Panel de administración', fr: 'Tableau de bord', en: 'Admin Dashboard' },
  admin_subtitle: { es: 'Gestiona las citas y el contenido del sitio.', fr: 'Gérez les rendez-vous et le contenu du site.', en: 'Manage appointments and website content.' },
  admin_tab_appts: { es: 'Citas', fr: 'Rendez-vous', en: 'Appointments' },
  admin_tab_calendar: { es: 'Calendario', fr: 'Calendrier', en: 'Calendar' },
  admin_appts_title: { es: 'Citas', fr: 'Rendez-vous', en: 'Appointments' },
  admin_appts_subtitle: { es: 'Ver todas las citas y modificar su estado.', fr: 'Voir tous les rendez-vous et modifier leur statut.', en: 'View all appointments and update their status.' },
  admin_refresh: { es: 'Actualizar', fr: 'Actualiser', en: 'Refresh' },
  admin_no_appts: { es: 'No se encontraron citas.', fr: 'Aucun rendez-vous trouvé.', en: 'No appointments found.' },
  admin_status_label: { es: 'Estado', fr: 'Statut', en: 'Status' },
  admin_updating: { es: 'Guardando...', fr: 'Mise à jour...', en: 'Updating...' },
  admin_prev: { es: 'Anterior', fr: 'Précédent', en: 'Previous' },
  admin_next: { es: 'Siguiente', fr: 'Suivant', en: 'Next' },
  admin_page_of: { es: 'Página {n} de {t}', fr: 'Page {n} sur {t}', en: 'Page {n} of {t}' },
  admin_legend: { es: 'Leyenda', fr: 'Légende', en: 'Legend' },
  admin_view_day: { es: 'Día', fr: 'Jour', en: 'Day' },
  admin_view_week: { es: 'Semana', fr: 'Semaine', en: 'Week' },
  admin_view_month: { es: 'Mes', fr: 'Mois', en: 'Month' },
  admin_btn_confirm: { es: 'Confirmar', fr: 'Confirmer', en: 'Confirm' },
  admin_btn_complete: { es: 'Completar', fr: 'Terminer', en: 'Complete' },
  admin_btn_cancel: { es: 'Cancelar', fr: 'Annuler', en: 'Cancel' },
  admin_unknown: { es: 'Desconocido', fr: 'Inconnu', en: 'Unknown' },
  admin_client: { es: 'Cliente', fr: 'Client', en: 'Client' },
  admin_appointment: { es: 'Cita', fr: 'Rendez-vous', en: 'Appointment' },
  admin_external_note: { es: 'Externo', fr: 'Externe', en: 'External' },

  // ── Days off ─────────────────────────────────────────────
  admin_tab_daysoff: { es: 'Días libres', fr: 'Jours off', en: 'Days Off' },
  daysoff_title: { es: 'Días de indisponibilidad', fr: 'Jours d\'indisponibilité', en: 'Unavailable Days' },
  daysoff_subtitle: { es: 'Gestiona los días en que no estás disponible para citas.', fr: 'Gérez les jours où vous n\'êtes pas disponible pour des rendez-vous.', en: 'Manage days when you are not available for appointments.' },
  daysoff_add_title: { es: 'Añadir un día libre', fr: 'Ajouter un jour off', en: 'Add a Day Off' },
  daysoff_date_label: { es: 'Fecha', fr: 'Date', en: 'Date' },
  daysoff_reason_label: { es: 'Motivo (opcional)', fr: 'Motif (optionnel)', en: 'Reason (optional)' },
  daysoff_reason_ph: { es: 'Vacaciones, enfermedad...', fr: 'Vacances, maladie...', en: 'Vacation, illness...' },
  daysoff_add_btn: { es: 'Añadir', fr: 'Ajouter', en: 'Add' },
  daysoff_none: { es: 'No hay días libres registrados.', fr: 'Aucun jour off enregistré.', en: 'No days off registered.' },
  daysoff_delete_confirm: { es: '¿Eliminar este día libre?', fr: 'Supprimer ce jour off ?', en: 'Delete this day off?' },
  daysoff_upcoming: { es: 'Próximos', fr: 'À venir', en: 'Upcoming' },
  daysoff_past: { es: 'Pasados', fr: 'Passés', en: 'Past' },
  daysoff_selected: { es: 'Seleccionado', fr: 'Sélectionné', en: 'Selected' },
  daysoff_already: { es: 'Ya existe', fr: 'Déjà ajouté', en: 'Already added' },

  // ── Portfolio editor ─────────────────────────────────────
  editor_toggle: { es: 'Editar portafolio', fr: 'Modifier portfolio', en: 'Edit Portfolio' },
  editor_done: { es: 'Terminar edición', fr: 'Terminer l\'édition', en: 'Done Editing' },
  editor_add: { es: 'Añadir foto', fr: 'Ajouter une photo', en: 'Add Photo' },
  editor_add_btn: { es: 'Añadir', fr: 'Ajouter', en: 'Add' },
  editor_hidden: { es: 'Oculta', fr: 'Masquée', en: 'Hidden' },
  editor_saving: { es: 'Guardando orden...', fr: 'Sauvegarde ordre...', en: 'Saving order...' },
  editor_url_placeholder: { es: 'Seleccionar imagen', fr: 'Sélectionner image', en: 'Select image' },
  editor_title_placeholder: { es: 'Título (opcional)', fr: 'Titre (optionnel)', en: 'Title (optional)' },
  editor_active: { es: 'Fotos activas', fr: 'Photos actives', en: 'Active photos' },
  editor_bench: { es: 'Fotos ocultas', fr: 'Photos masquées', en: 'Hidden photos' },
  editor_restore: { es: 'Restaurar', fr: 'Restaurer', en: 'Restore' },
  editor_delete_confirm: { es: '¿Eliminar definitivamente', fr: 'Supprimer définitivement', en: 'Permanently delete' },
  editor_delete_title: { es: '¿Eliminar esta foto?', fr: 'Supprimer cette photo ?', en: 'Delete this photo?' },
  editor_delete_body: { es: 'Esta acción es permanente y no se puede deshacer.', fr: 'Cette action est permanente et irréversible.', en: 'This action is permanent and cannot be undone.' },
  editor_delete_confirm_btn: { es: 'Eliminar', fr: 'Supprimer', en: 'Delete' },

  // ── Server error modal ───────────────────────────────────
  error_title: { es: 'Ocurrió un problema', fr: 'Un problème est survenu', en: 'A problem occurred' },
  error_body: {
    es: 'Algo salió mal de nuestra parte. Por favor intenta más tarde.',
    fr: 'Quelque chose s\'est mal passé. Veuillez réessayer plus tard.',
    en: 'Something went wrong on our end. Please try again later.',
  },
  error_contact_hint: {
    es: '¿Desea reservar de todas formas? Contáctenos directamente:',
    fr: 'Vous souhaitez quand même réserver ? Contactez-nous :',
    en: 'Want to book anyway? Contact us directly:',
  },
  // ── Reviews ─────────────────────────────────────
  review_badge: {
    es: 'Opiniones',
    fr: 'Avis',
    en: 'Reviews',
  },
  review_title: {
    es: 'Comparte tu experiencia',
    fr: 'Partage ton expérience',
    en: 'Share your experience',
  },
  review_subtitle: {
    es: 'Deja una nota de 5 estrellas con posibilidad de medias estrellas, y un mensaje.',
    fr: 'Laisse une note sur 5 étoiles avec demi-étoiles possibles, ainsi qu’un message.',
    en: 'Leave a 5-star rating with half-stars and a message.',
  },
  review_btn: {
    es: 'Dejar una opinión',
    fr: 'Laisser un avis',
    en: 'Leave a review',
  },

  // Modal
  review_modal_title: {
    es: 'Dejar una opinión',
    fr: 'Laisser un avis',
    en: 'Leave a review',
  },
  review_modal_rating_info: {
    es: 'Nota sobre 5 estrellas con medias estrellas posibles.',
    fr: 'Note sur 5 étoiles, avec demi-étoiles possibles.',
    en: 'Rating out of 5 stars, half-stars allowed.',
  },
  review_selected: {
    es: 'Nota seleccionada',
    fr: 'Note sélectionnée',
    en: 'Selected rating',
  },
  review_text_placeholder: {
    es: 'Escribe tu opinión aquí...',
    fr: 'Écris ton avis ici...',
    en: 'Write your review here...',
  },
  review_submit: {
    es: 'Enviar opinión',
    fr: "Envoyer l'avis",
    en: 'Submit review',
  },
  review_loading: {
    es: 'Enviando...',
    fr: 'Envoi...',
    en: 'Sending...',
  },
  review_success: {
    es: '¡Gracias! Tu opinión fue enviada.',
    fr: 'Merci ! Votre avis a bien été envoyé.',
    en: 'Thank you! Your review has been submitted.',
  },
  review_error_text_required: {
    es: 'El texto es obligatorio.',
    fr: "Le texte de l'avis est requis.",
    en: 'Review text is required.',
  },
  review_error_rating_required: {
    es: 'Por favor selecciona una nota.',
    fr: 'Veuillez sélectionner une note.',
    en: 'Please select a rating.',
  },
  review_error_generic: {
    es: 'Ocurrió un error al enviar.',
    fr: "Une erreur est survenue lors de l'envoi.",
    en: 'An error occurred while sending.',
  },
};

export function tr(key: string, lang: Lang): string {
  return t[key]?.[lang] ?? key;
}

