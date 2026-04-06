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
  nav_reviews: { es: 'Reseñas', fr: 'Avis', en: 'Reviews' },

  // ── Hero ────────────────────────────────────────────────
  hero_badge:         { es: 'Estudio Privado',  fr: 'Studio Privé',     en: 'Private Studio' },
  hero_title_1:       { es: 'Experiencia',      fr: 'Expérience',       en: 'Luxury' },
  hero_title_2:       { es: 'de Lujo',          fr: 'de Luxe',          en: 'Experience' },
  hero_subtitle:      {
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
  gallery_loading: { es: 'Cargando galería...', fr: 'Chargement galerie...', en: 'Loading gallery...' },
  gallery_empty: { es: 'Aún no hay fotos disponibles.', fr: 'Aucune photo disponible pour l\'instant.', en: 'No photos available yet.' },

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
  contact_contact:    { es: 'Contacto',         fr: 'Contact',          en: 'Contact' },
  contact_hours:      { es: 'Horarios',         fr: 'Horaires',         en: 'Hours' },
  contact_hours_1:    { es: 'Lun - Jue: 12PM - 7PM', fr: 'Lun - Jeu: 12h - 19h',   en: 'Mon - Thu: 12PM - 7PM' },
  contact_hours_2:    { es: 'Vie: 9AM - 7PM  •  Sáb: 8AM - 4PM', fr: 'Ven: 9h - 19h  •  Sam: 8h - 16h', en: 'Fri: 9AM - 7PM  •  Sat: 8AM - 4PM' },
  contact_social:     { es: 'Síguenos',             fr: 'Suivez-nous',              en: 'Follow Us' },

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

  // ── Login modal ──────────────────────────────────────────
  login_title: { es: 'Iniciar sesión', fr: 'Connexion', en: 'Sign In' },
  login_email_label: { es: 'Correo electrónico', fr: 'Adresse e-mail', en: 'Email' },
  login_email_ph: { es: 'tu@email.com', fr: 'votre@email.com', en: 'your@email.com' },
  login_password_label: { es: 'Contraseña', fr: 'Mot de passe', en: 'Password' },
  login_btn: { es: 'Iniciar sesión', fr: 'Se connecter', en: 'Sign In' },
  login_btn_loading: { es: 'Conectando...', fr: 'Connexion...', en: 'Signing in...' },
  login_error_not_confirmed: { es: 'Tu dirección de correo no está confirmada. Haz clic en el enlace enviado a tu bandeja de entrada.', fr: "Votre adresse e-mail n'est pas encore confirmée. Veuillez cliquer sur le lien reçu dans votre boîte mail.", en: 'Your email address is not confirmed yet. Please click the link sent to your inbox.' },
  login_error_credentials: { es: 'Correo o contraseña incorrectos.', fr: 'Email ou mot de passe incorrect.', en: 'Incorrect email or password.' },
  login_error_generic: { es: 'Ocurrió un error al iniciar sesión.', fr: 'Une erreur est survenue lors de la connexion.', en: 'An error occurred while signing in.' },
  login_resend_missing_email: { es: 'Por favor ingresa tu correo electrónico.', fr: 'Veuillez entrer votre adresse e-mail.', en: 'Please enter your email address.' },
  login_resend_success: { es: 'Se envió un nuevo correo de confirmación. Revisa tu carpeta de spam.', fr: 'Un nouvel e-mail de confirmation a été envoyé. Pensez à vérifier vos indésirables.', en: 'A new confirmation email has been sent. Check your spam folder.' },
  login_resend_error: { es: 'No se pudo reenviar el correo de confirmación.', fr: "Impossible de renvoyer l'e-mail de confirmation.", en: 'Could not resend the confirmation email.' },
  login_resend_btn: { es: 'Reenviar correo de confirmación', fr: "Renvoyer l'e-mail de confirmation", en: 'Resend confirmation email' },
  login_resend_btn_loading: { es: 'Enviando...', fr: "Envoi de l'e-mail...", en: 'Sending...' },
  login_no_account: { es: '¿Aún no tienes cuenta?', fr: 'Pas encore de compte ?', en: 'No account yet?' },
  login_switch_register: { es: 'Registrarse', fr: "S'inscrire", en: 'Sign Up' },

  // ── Register modal ───────────────────────────────────────
  register_title: { es: 'Crear una cuenta', fr: 'Créer un compte', en: 'Create an Account' },
  register_firstname_label: { es: 'Nombre', fr: 'Prénom', en: 'First Name' },
  register_firstname_ph: { es: 'Tu nombre', fr: 'Votre prénom', en: 'Your first name' },
  register_lastname_label: { es: 'Apellido', fr: 'Nom', en: 'Last Name' },
  register_lastname_ph: { es: 'Tu apellido', fr: 'Votre nom', en: 'Your last name' },
  register_phone_label: { es: 'Teléfono', fr: 'Téléphone', en: 'Phone' },
  register_password_label: { es: 'Contraseña', fr: 'Mot de passe', en: 'Password' },
  register_confirm_label: { es: 'Confirmar contraseña', fr: 'Confirmer le mot de passe', en: 'Confirm Password' },
  register_btn: { es: 'Registrarse', fr: "S'inscrire", en: 'Sign Up' },
  register_btn_loading: { es: 'Registrando...', fr: 'Inscription...', en: 'Signing up...' },
  register_error_passwords: { es: 'Las contraseñas no coinciden.', fr: 'Les mots de passe ne correspondent pas.', en: 'Passwords do not match.' },
  register_error_generic: { es: 'Ocurrió un error al registrarse.', fr: "Une erreur est survenue lors de l'inscription.", en: 'An error occurred while signing up.' },
  email_confirmed_banner:  { es: '¡Tu correo fue confirmado! Ya puedes reservar tu cita.', fr: 'Votre adresse e-mail est confirmée ! Vous pouvez maintenant prendre rendez-vous.', en: 'Your email has been confirmed! You can now book an appointment.' },
  booking_unverified:      { es: 'Debes confirmar tu correo electrónico antes de reservar.', fr: 'Veuillez confirmer votre adresse e-mail avant de réserver.', en: 'Please confirm your email address before booking.' },
  register_success_title: { es: '¡Registro exitoso!', fr: 'Inscription réussie', en: 'Registration Successful' },
  register_success_body: { es: 'Tu cuenta fue creada. Confirma tu correo electrónico haciendo clic en el enlace enviado antes de iniciar sesión.', fr: 'Votre compte a été créé. Veuillez confirmer votre adresse e-mail en cliquant sur le lien envoyé avant de vous connecter.', en: 'Your account has been created. Please confirm your email address by clicking the link sent to your inbox before signing in.' },
  register_go_login: { es: 'Ir a iniciar sesión', fr: 'Aller à la connexion', en: 'Go to Sign In' },
  register_has_account: { es: '¿Ya tienes cuenta?', fr: 'Déjà inscrit ?', en: 'Already have an account?' },
  register_switch_login: { es: 'Iniciar sesión', fr: 'Se connecter', en: 'Sign In' },

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
  appt_style_notes: { es: 'Notas de estilo', fr: 'Notes de style', en: 'Style notes' },
  appt_style_notes_add: { es: 'Añadir notas', fr: 'Ajouter des notes', en: 'Add notes' },
  appt_style_notes_edit: { es: 'Editar notas', fr: 'Modifier les notes', en: 'Edit notes' },
  appt_style_notes_ph: { es: 'Ej: Keratina 2 partes Olaplex...', fr: 'Ex: Kératine 2 parts Olaplex...', en: 'E.g.: Keratin 2 parts Olaplex...' },
  appt_style_notes_save: { es: 'Guardar', fr: 'Sauvegarder', en: 'Save' },
  appt_style_notes_cancel: { es: 'Cancelar', fr: 'Annuler', en: 'Cancel' },
  appt_style_notes_saved: { es: 'Notas guardadas ✓', fr: 'Notes sauvegardées ✓', en: 'Notes saved ✓' },
  appt_style_notes_error: { es: 'Error al guardar', fr: 'Erreur de sauvegarde', en: 'Error saving' },

  // ── Appointment search / filters ─────────────────────────
  search_placeholder: { es: 'Buscar cliente...', fr: 'Rechercher un client...', en: 'Search client...' },
  search_clear: { es: 'Limpiar filtros', fr: 'Effacer les filtres', en: 'Clear filters' },
  search_period_all: { es: 'Todo', fr: 'Tout', en: 'All' },
  search_period_today: { es: 'Hoy', fr: "Aujourd'hui", en: 'Today' },
  search_period_week: { es: 'Esta semana', fr: 'Cette semaine', en: 'This week' },
  search_period_month: { es: 'Este mes', fr: 'Ce mois', en: 'This month' },
  search_period_custom: { es: 'Personalizado', fr: 'Personnalisé', en: 'Custom' },
  search_date_from: { es: 'Desde', fr: 'Du', en: 'From' },
  search_date_to: { es: 'Hasta', fr: 'Au', en: 'To' },
  search_status_all: { es: 'Todos los estados', fr: 'Tous les statuts', en: 'All statuses' },
  search_results_one: { es: '1 cita encontrada', fr: '1 rendez-vous trouvé', en: '1 appointment found' },
  search_results_many: { es: '{n} citas encontradas', fr: '{n} rendez-vous trouvés', en: '{n} appointments found' },
  search_results_none: { es: 'Sin resultados', fr: 'Aucun résultat', en: 'No results' },

  // ── User management ──────────────────────────────────────
  admin_tab_users:       { es: 'Usuarios',                   fr: 'Utilisateurs',            en: 'Users' },
  users_title:           { es: 'Gestión de usuarios',        fr: 'Gestion des utilisateurs',en: 'User management' },
  users_subtitle:        { es: 'Busca clientes y consulta sus citas.', fr: 'Recherchez des clients et consultez leurs rendez-vous.', en: 'Search clients and view their appointments.' },
  users_search_ph:       { es: 'Buscar por nombre o email...', fr: 'Rechercher par nom ou email...', en: 'Search by name or email...' },
  users_role_all:        { es: 'Todos los roles',            fr: 'Tous les rôles',          en: 'All roles' },
  users_role_admin:      { es: 'Admin',                      fr: 'Admin',                   en: 'Admin' },
  users_role_styliste:   { es: 'Estilista',                  fr: 'Styliste',                en: 'Stylist' },
  users_role_client:     { es: 'Cliente',                    fr: 'Client',                  en: 'Client' },
  users_empty:           { es: 'No se encontraron usuarios.', fr: 'Aucun utilisateur trouvé.', en: 'No users found.' },
  users_no_appts:        { es: 'Sin citas',                  fr: 'Aucun rendez-vous',       en: 'No appointments' },
  users_appts_count_one: { es: '1 cita',                     fr: '1 rendez-vous',           en: '1 appt' },
  users_appts_count:     { es: '{n} citas',                  fr: '{n} rendez-vous',         en: '{n} appts' },
  users_see_appts:       { es: 'Ver citas',                  fr: 'Voir les RDV',            en: 'View appts' },
  users_hide_appts:      { es: 'Ocultar',                    fr: 'Masquer',                 en: 'Hide' },
  users_refresh_user:    { es: 'Actualizar',                 fr: 'Actualiser',              en: 'Refresh' },
  users_total:           { es: '{n} usuarios',               fr: '{n} utilisateurs',        en: '{n} users' },
  users_date_label:      { es: 'Filtrar por fecha de cita',  fr: 'Filtrer par date de RDV', en: 'Filter by appt date' },
  users_date_exact:      { es: 'Día exacto',                 fr: 'Jour exact',              en: 'Exact day' },
  users_date_week:       { es: 'Semana',                     fr: 'Semaine',                 en: 'Week' },
  users_date_month:      { es: 'Mes',                        fr: 'Mois',                    en: 'Month' },
  users_sort_label:      { es: 'Ordenar por citas',          fr: 'Trier par rendez-vous',   en: 'Sort by appts' },
  users_sort_asc:        { es: 'Menos primero',              fr: 'Moins d\'abord',          en: 'Fewest first' },
  users_sort_desc:       { es: 'Más primero',                fr: 'Plus d\'abord',           en: 'Most first' },

  // ── Days off ─────────────────────────────────────────────
  admin_tab_photos: { es: 'Fotos', fr: 'Photos', en: 'Photos' },
  admin_tab_reviews: { es: 'Reseñas', fr: 'Avis', en: 'Reviews' },

  // ── Reviews (public + admin) ──────────────────────────────
  reviews_badge: { es: 'Testimonios', fr: 'Témoignages', en: 'Testimonials' },
  reviews_title: { es: 'Reseñas de clientes', fr: 'Avis clients', en: 'Client Reviews' },
  reviews_loading: { es: 'Cargando reseñas...', fr: 'Chargement des avis...', en: 'Loading reviews...' },
  reviews_empty: { es: 'Aún no hay reseñas.', fr: 'Aucun avis disponible.', en: 'No reviews available yet.' },
  reviews_anonymous: { es: 'Anónimo', fr: 'Anonyme', en: 'Anonymous' },
  reviews_admin_subtitle: { es: 'Gestiona la visibilidad y elimina reseñas.', fr: 'Gérez la visibilité et supprimez les avis.', en: 'Manage visibility and delete reviews.' },
  reviews_admin_empty: { es: 'No se encontraron reseñas.', fr: 'Aucun avis trouvé.', en: 'No reviews found.' },
  reviews_visible: { es: 'Visible', fr: 'Visible', en: 'Visible' },
  reviews_hidden: { es: 'Oculta', fr: 'Masqué', en: 'Hidden' },
  reviews_hide: { es: 'Ocultar', fr: 'Masquer', en: 'Hide' },
  reviews_show: { es: 'Mostrar', fr: 'Afficher', en: 'Show' },
  reviews_error_load: { es: 'Error al cargar reseñas.', fr: 'Erreur de chargement des avis.', en: 'Failed to load reviews.' },
  reviews_error_visibility: { es: 'Error al actualizar visibilidad.', fr: 'Erreur lors de la mise à jour.', en: 'Failed to update review visibility.' },
  reviews_error_delete: { es: 'Error al eliminar la reseña.', fr: 'Erreur lors de la suppression.', en: 'Failed to delete review.' },

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

  // ── Portfolio admin manager ──────────────────────────────
  portfolio_admin_title: { es: 'Portafolio', fr: 'Portfolio', en: 'Portfolio' },
  portfolio_admin_subtitle: { es: 'Arrastra para reordenar · oculta fotos al banco · elimina permanentemente', fr: 'Glissez pour réordonner · masquez vers le banc · supprimez définitivement', en: 'Drag to reorder · hide to bench · permanently delete' },
  portfolio_admin_error: { es: 'No se pudo cargar el portafolio.', fr: 'Impossible de charger le portfolio.', en: 'Could not load portfolio.' },
  admin_tab_portfolio: { es: 'Portafolio', fr: 'Portfolio', en: 'Portfolio' },

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
    es: 'Deja una nota y un mensaje.',
    fr: 'Laisse une note ainsi qu’un message.',
    en: 'Leave a rating and a message.',
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

  // ── Register validations ─────────────────────────
  register_error_email_invalid: {
    es: 'Por favor ingresa un correo electrónico válido.',
    fr: 'Veuillez entrer une adresse email valide.',
    en: 'Please enter a valid email address.',
  },
  register_error_phone_invalid: {
    es: 'Por favor ingresa un número de teléfono válido.',
    fr: 'Veuillez entrer un numéro de téléphone valide.',
    en: 'Please enter a valid phone number.',
  },
  register_error_password_rules: {
    es: 'La contraseña debe tener al menos 6 caracteres, 1 número y 1 símbolo.',
    fr: 'Le mot de passe doit contenir au moins 6 caractères, 1 chiffre et 1 symbole.',
    en: 'Password must be at least 6 characters, include 1 number and 1 symbol.',
  },
};

export function tr(key: string, lang: Lang): string {
  return t[key]?.[lang] ?? key;
}

