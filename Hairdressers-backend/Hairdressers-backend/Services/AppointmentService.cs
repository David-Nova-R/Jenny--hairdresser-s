using Google.Apis.Calendar.v3;
using Hairdressers_backend.Dtos.AppointmentResponseDTO;
using Hairdressers_backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Supabase;

namespace Hairdressers_backend.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;
        private readonly Client _supabase;
        private readonly IGoogleCalendarService _calendarService;

        public AppointmentService(AppDbContext context, Client supabase,IGoogleCalendarService calendarService)
        {
            _context = context;
            _supabase = supabase;
            _calendarService = calendarService;
        }

        public async Task<User?> GetUserBySupabaseIdAsync(string supabaseUserId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.SupabaseUserId == supabaseUserId);
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(int appointmentId)
        {
            return await _context.Appointments.FirstOrDefaultAsync(a => a.Id == appointmentId);
        }

        public async Task<List<AppointmentResponseDTO>> GetUserAppointmentsAsync(int userId)
        {
            return await _context.Appointments
                .Where(a => a.UserId == userId)
                .Select(a => new AppointmentResponseDTO
                {
                    Id = a.Id,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status.ToString(),
                    HairStyleId = a.HairStyleId,
                    HairStyleName = a.HairStyle.Name,
                    PriceMin = a.HairStyle.PriceMin,
                    PriceMax = a.HairStyle.PriceMax
                })
                .ToListAsync();
        }

        public async Task<List<PendingAppointmentDTO>> GetPendingAppointmentsAsync()
        {
            return await _context.Appointments
                .Include(a => a.HairStyle)
                .Include(a => a.User)
                .Where(a => a.Status == AppointmentStatus.Pending)
                .OrderBy(a => a.AppointmentDate)
                .Select(a => new PendingAppointmentDTO
                {
                    Id = a.Id,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status.ToString(),
                    HairStyleId = a.HairStyleId,
                    HairStyleName = a.HairStyle.Name,
                    PriceMin = a.HairStyle.PriceMin,
                    PriceMax = a.HairStyle.PriceMax,
                    ClientFirstName = a.User.FirstName,
                    ClientLastName = a.User.LastName,
                    ClientPhone = a.User.PhoneNumber
                })
                .ToListAsync();
        }

        public async Task<Appointment> CreateAppointmentAsync(int userId, int hairStylesId, DateTime appointmentDate)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new KeyNotFoundException("Utilisateur introuvable.");

            var hairStyle = await _context.HairStyles
                .FirstOrDefaultAsync(s => s.Id == hairStylesId)
                ?? throw new KeyNotFoundException("Service introuvable.");

            var appointment = new Appointment
            {
                UserId = userId,
                HairStyleId = hairStyle.Id,
                AppointmentDate = appointmentDate,
                Status = AppointmentStatus.Pending
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return appointment;
        }

        public async Task AcceptAppointmentAsync(int appointmentId)
        {
            var appointment = await _context.Appointments
                .Include(a => a.HairStyle)
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == appointmentId)
                ?? throw new KeyNotFoundException("Rendez-vous introuvable.");

            if (appointment.Status != AppointmentStatus.Pending)
                throw new InvalidOperationException("Seulement un rendez-vous en attente peut être accepté.");

            // Créer l'événement dans Google Calendar
            var endDate = appointment.AppointmentDate.AddMinutes(appointment.HairStyle.DurationMinutes);
            var googleEventId = await _calendarService.CreateEventAsync(
                title: $"{appointment.HairStyle.Name} - {appointment.User.FirstName} {appointment.User.LastName}",
                description: $"Servicio: {appointment.HairStyle.Name}\nPrecio: {appointment.HairStyle.PriceMin} - {appointment.HairStyle.PriceMax}$",
                start: appointment.AppointmentDate,
                end: endDate
            );

            appointment.GoogleEventId = googleEventId;
            appointment.Status = AppointmentStatus.Confirmed;
            await _context.SaveChangesAsync();
        }

        public async Task CancelAppointmentAsync(int appointmentId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId)
                ?? throw new KeyNotFoundException("Rendez-vous introuvable.");

            // Supprimer l'événement Google Calendar si il existe
            if (!string.IsNullOrEmpty(appointment.GoogleEventId))
            {
                await _calendarService.DeleteEventAsync(appointment.GoogleEventId);
            }

            appointment.Status = AppointmentStatus.Cancelled;
            await _context.SaveChangesAsync();
        }

        public async Task<List<AvailableDayWithSlotsDTO>> GetAvailableMonthAsync(int serviceId)
        {
            var hairStyle = await _context.HairStyles
                .FirstOrDefaultAsync(s => s.Id == serviceId)
                ?? throw new KeyNotFoundException("Service inexistant.");

            bool isKeratina = hairStyle.Name.ToLower().Contains("keratina");

            var today = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, DateTime.UtcNow.Day, 0, 0, 0, DateTimeKind.Utc);
            var lastDay = today.AddDays(30);
            var result = new List<AvailableDayWithSlotsDTO>();

            for (var date = today; date <= lastDay; date = date.AddDays(1))
            {
                if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                    continue;

                var dayStart = date;
                var dayEnd = date.AddDays(1);

                var appointments = await _context.Appointments
                    .Include(a => a.HairStyle)
                    .Where(a =>
                        a.AppointmentDate >= dayStart &&
                        a.AppointmentDate < dayEnd &&
                        (a.Status == AppointmentStatus.Confirmed || a.Status == AppointmentStatus.Pending))
                    .ToListAsync();

                var slots = new List<string>();
                var endOfDay = date.AddHours(17);
                var currentSlot = date.AddHours(8);

                while (currentSlot.AddMinutes(hairStyle.DurationMinutes) <= endOfDay)
                {
                    var slotStart = currentSlot;
                    var slotEnd = slotStart.AddMinutes(hairStyle.DurationMinutes);

                    bool isTaken = appointments.Any(a =>
                    {
                        bool overlaps = a.AppointmentDate < slotEnd &&
                                        a.AppointmentDate.AddMinutes(a.HairStyle.DurationMinutes) > slotStart;

                        if (!overlaps) return false;

                        // Confirmed bloque toujours
                        if (a.Status == AppointmentStatus.Confirmed) return true;

                        // Pending + Keratina bloque toujours
                        if (a.Status == AppointmentStatus.Pending && isKeratina) return true;

                        // Pending → bloque seulement si le service pending a un PriceMin >= au service demandé
                        if (a.Status == AppointmentStatus.Pending)
                            return a.HairStyle.PriceMin >= hairStyle.PriceMin;

                        return false;
                    });

                    if (!isTaken)
                        slots.Add(slotStart.ToString("HH:mm"));

                    currentSlot = currentSlot.AddMinutes(hairStyle.DurationMinutes);
                }

                if (slots.Any())
                {
                    result.Add(new AvailableDayWithSlotsDTO
                    {
                        Day = date,
                        AvailableSlots = slots
                    });
                }
            }

            return result;
        }
    }
}
