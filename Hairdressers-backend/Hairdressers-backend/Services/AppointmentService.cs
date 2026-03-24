using Google.Apis.Calendar.v3;
using Hairdressers_backend.Dtos;
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
        const int heureDebut = 8;
        const int heureFin = 17;
        const int slotStepMinutes = 30;

        public AppointmentService(AppDbContext context, Client supabase,IGoogleCalendarService calendarService)
        {
            _context = context;
            _supabase = supabase;
            _calendarService = calendarService;
        }

        public async Task<List<AppointmentResponseDTO>> GetUserAppointmentsAsync(int userId)
        {
             return await _context.Appointments
                .Where(a => a.UserId == userId).Include(a => a.HairStyle)
                .Select(a => new AppointmentResponseDTO(a))
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

            // IMPORTANT: PostgreSQL timestamp with time zone => UTC only
            if (appointmentDate.Kind == DateTimeKind.Unspecified)
            {
                appointmentDate = DateTime.SpecifyKind(appointmentDate, DateTimeKind.Utc);
            }
            else if (appointmentDate.Kind == DateTimeKind.Local)
            {
                appointmentDate = appointmentDate.ToUniversalTime();
            }

            var requestedDuration = hairStyle.DurationMaxMinutes ?? hairStyle.DurationMinutes;
            var requestedEnd = appointmentDate.AddMinutes(requestedDuration);

            // Heures de travail
            var day = appointmentDate.Date;
            var workStart = day.AddHours(heureDebut);
            var workEnd = day.AddHours(heureFin);

            // Vérifier jours ouvrables
            if (appointmentDate.DayOfWeek == DayOfWeek.Saturday ||
                appointmentDate.DayOfWeek == DayOfWeek.Sunday)
            {
                throw new InvalidOperationException("Aucun rendez-vous n'est disponible la fin de semaine.");
            }

            // Vérifier que le rendez-vous est dans les heures de travail
            if (appointmentDate < workStart || requestedEnd > workEnd)
            {
                throw new InvalidOperationException("Ce rendez-vous est en dehors des heures de travail.");
            }

            var dayStart = day;
            var dayEnd = dayStart.AddDays(1);

            var existingAppointments = await _context.Appointments
                .Include(a => a.HairStyle)
                .Where(a =>
                    a.AppointmentDate >= dayStart &&
                    a.AppointmentDate < dayEnd &&
                    a.Status != AppointmentStatus.Cancelled)
                .ToListAsync();

            bool overlaps = existingAppointments.Any(a =>
            {
                var existingDuration = a.HairStyle.DurationMaxMinutes ?? a.HairStyle.DurationMinutes;
                var existingStart = a.AppointmentDate;
                var existingEnd = existingStart.AddMinutes(existingDuration);

                return appointmentDate < existingEnd && requestedEnd > existingStart;
            });

            if (overlaps)
            {
                throw new InvalidOperationException("Ce créneau n'est plus disponible.");
            }

            var appointment = new Appointment
            {
                UserId = userId,
                HairStyleId = hairStyle.Id,
                AppointmentDate = appointmentDate,
                Status = AppointmentStatus.Pending
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            var googleEventId = await _calendarService.CreateEventAsync(
                title: $"{hairStyle.Name} - {user.FirstName} {user.LastName}",
                description: $"Service: {hairStyle.Name}\nPrix: {hairStyle.PriceMin} - {hairStyle.PriceMax}$",
                start: appointmentDate,
                end: requestedEnd
            );

            appointment.GoogleEventId = googleEventId;
            await _context.SaveChangesAsync();

            return appointment;
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

            var salonTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");

            var localToday = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, salonTimeZone).Date;
            var localLastDay = localToday.AddDays(30);

            var requestedDuration = hairStyle.DurationMaxMinutes ?? hairStyle.DurationMinutes;

            var result = new List<AvailableDayWithSlotsDTO>();

            for (var localDate = localToday; localDate <= localLastDay; localDate = localDate.AddDays(1))
            {
                if (localDate.DayOfWeek == DayOfWeek.Saturday || localDate.DayOfWeek == DayOfWeek.Sunday)
                    continue;

                var localWorkStart = localDate.AddHours(heureDebut);
                var localWorkEnd = localDate.AddHours(heureFin);

                var utcWorkStart = TimeZoneInfo.ConvertTimeToUtc(localWorkStart, salonTimeZone);
                var utcWorkEnd = TimeZoneInfo.ConvertTimeToUtc(localWorkEnd, salonTimeZone);

                var appointments = await _context.Appointments
                    .Include(a => a.HairStyle)
                    .Where(a =>
                        a.AppointmentDate >= utcWorkStart &&
                        a.AppointmentDate < utcWorkEnd &&
                        a.Status != AppointmentStatus.Cancelled)
                    .OrderBy(a => a.AppointmentDate)
                    .ToListAsync();

                var availableSlots = new List<string>();
                var localCurrentSlot = localWorkStart;

                while (localCurrentSlot.AddMinutes(requestedDuration) <= localWorkEnd)
                {
                    var localSlotStart = localCurrentSlot;
                    var localSlotEnd = localSlotStart.AddMinutes(requestedDuration);

                    var utcSlotStart = TimeZoneInfo.ConvertTimeToUtc(localSlotStart, salonTimeZone);
                    var utcSlotEnd = TimeZoneInfo.ConvertTimeToUtc(localSlotEnd, salonTimeZone);

                    bool overlaps = appointments.Any(a =>
                    {
                        var existingStartUtc = a.AppointmentDate;
                        var existingDuration = a.HairStyle.DurationMaxMinutes ?? a.HairStyle.DurationMinutes;
                        var existingEndUtc = existingStartUtc.AddMinutes(existingDuration);

                        return utcSlotStart < existingEndUtc && utcSlotEnd > existingStartUtc;
                    });

                    if (!overlaps)
                    {
                        availableSlots.Add(localSlotStart.ToString("HH:mm"));
                    }

                    localCurrentSlot = localCurrentSlot.AddMinutes(slotStepMinutes);
                }

                if (availableSlots.Any())
                {
                    result.Add(new AvailableDayWithSlotsDTO
                    {
                        Day = localDate,
                        AvailableSlots = availableSlots
                    });
                }
            }

            return result;
        }
        public async Task<User?> GetUserBySupabaseIdAsync(string supabaseUserId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.SupabaseUserId == supabaseUserId);
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(int appointmentId)
        {
            return await _context.Appointments.FirstOrDefaultAsync(a => a.Id == appointmentId);
        }

        public async Task<List<AppointmentResponseDTO>?> GetMyAppointmentsAsync(int userId)
        {
            return await _context.Appointments
                .Where(a => a.UserId == userId).Include(a => a.HairStyle)
                .Select(a => new AppointmentResponseDTO(a))
                .ToListAsync();
        }
    }
}
