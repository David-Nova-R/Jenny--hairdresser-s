using Google.Apis.Calendar.v3;
using Hairdressers_backend.Dtos;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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

            var salonTimeZone = TimeZoneInfo.FindSystemTimeZoneById("America/Montreal");

            // 🔥 convertir ce que le backend reçoit (UTC) en LOCAL salon
            var localAppointmentDate = TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.SpecifyKind(appointmentDate, DateTimeKind.Utc),
                salonTimeZone
            );

            if (localAppointmentDate.DayOfWeek == DayOfWeek.Saturday ||
                localAppointmentDate.DayOfWeek == DayOfWeek.Sunday)
            {
                throw new InvalidOperationException("Aucun rendez-vous la fin de semaine.");
            }

            var duration = hairStyle.DurationMaxMinutes ?? hairStyle.DurationMinutes;

            var localEnd = localAppointmentDate.AddMinutes(duration);

            var localDay = localAppointmentDate.Date;
            var localStartWork = localDay.AddHours(heureDebut);
            var localEndWork = localDay.AddHours(heureFin);

            if (localAppointmentDate < localStartWork || localEnd > localEndWork)
            {
                throw new InvalidOperationException("En dehors des heures de travail.");
            }

            // 🔥 reconvertir en UTC pour DB
            var appointmentUtc = TimeZoneInfo.ConvertTimeToUtc(localAppointmentDate, salonTimeZone);
            var endUtc = appointmentUtc.AddMinutes(duration);

            var dayStartUtc = TimeZoneInfo.ConvertTimeToUtc(localDay, salonTimeZone);
            var dayEndUtc = TimeZoneInfo.ConvertTimeToUtc(localDay.AddDays(1), salonTimeZone);

            var existingAppointments = await _context.Appointments
                .Include(a => a.HairStyle)
                .Where(a =>
                    a.AppointmentDate >= dayStartUtc &&
                    a.AppointmentDate < dayEndUtc &&
                    a.Status != AppointmentStatus.Cancelled)
                .ToListAsync();

            bool overlaps = existingAppointments.Any(a =>
            {
                var existingDuration = a.HairStyle.DurationMaxMinutes ?? a.HairStyle.DurationMinutes;
                var existingStartUtc = a.AppointmentDate;
                var existingEndUtc = existingStartUtc.AddMinutes(existingDuration);

                return appointmentUtc < existingEndUtc && endUtc > existingStartUtc;
            });

            if (overlaps)
            {
                throw new InvalidOperationException("Ce créneau n'est plus disponible.");
            }

            var appointment = new Appointment
            {
                UserId = userId,
                HairStyleId = hairStyle.Id,
                AppointmentDate = appointmentUtc,
                Status = AppointmentStatus.Pending
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            var googleEventId = await _calendarService.CreateEventAsync(
                title: $"{hairStyle.Name} - {user.FirstName} {user.LastName}",
                description: $"Service: {hairStyle.Name}\nPrix: {hairStyle.PriceMin} - {hairStyle.PriceMax}$",
                start: appointmentUtc,
                end: endUtc
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

        public async Task<bool> UpdateAppointmentStatusAsync(int appointmentId, int status)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);

            if (appointment == null)
                return false;

            if (!Enum.IsDefined(typeof(AppointmentStatus), status))
                throw new ArgumentException("Invalid appointment status");

            appointment.Status = (AppointmentStatus)status;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<PagedResultDto<AdminAppointmentResponseDTO>> GetAllAppointmentsAsync(int pageNumber, int pageSize)
        {
            var query = _context.Appointments
                .Include(a => a.User)
                .Include(a => a.HairStyle)
                .OrderByDescending(a => a.AppointmentDate);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new AdminAppointmentResponseDTO
                {
                    Id = a.Id,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status,
                    UserName = a.User != null ? a.User.FirstName + " " + a.User.LastName : null,
                    UserEmail = a.User != null ? a.User.Email : null,
                    HairStyleName = a.HairStyle != null ? a.HairStyle.Name : null
                })
                .ToListAsync();

            return new PagedResultDto<AdminAppointmentResponseDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}
