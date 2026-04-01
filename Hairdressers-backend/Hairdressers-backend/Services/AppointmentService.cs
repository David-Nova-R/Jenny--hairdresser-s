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
        private readonly IEmailService _emailService;

        const int slotStepMinutes = 30;

        private static readonly TimeZoneInfo _torontoTz =
            TimeZoneInfo.FindSystemTimeZoneById("America/Toronto");

        // Retourne (heureDebut, heureFin) pour le jour donné, ou null si fermé
        private static (int debut, int fin)? GetWorkHours(DayOfWeek day) => day switch
        {
            DayOfWeek.Monday    => (12, 19),
            DayOfWeek.Tuesday   => (12, 19),
            DayOfWeek.Wednesday => (12, 19),
            DayOfWeek.Thursday  => (12, 19),
            DayOfWeek.Friday    => (9,  19),
            DayOfWeek.Saturday  => (8,  16),
            _                   => null
        };

        public AppointmentService(AppDbContext context, Client supabase, IGoogleCalendarService calendarService, IEmailService emailService)
        {
            _context = context;
            _supabase = supabase;
            _calendarService = calendarService;
            _emailService = emailService;
        }

        private static DateTime NormalizeLocalDateTime(DateTime value)
        {
            return DateTime.SpecifyKind(value, DateTimeKind.Unspecified);
        }

        public async Task<List<AppointmentResponseDTO>> GetUserAppointmentsAsync(int userId)
        {
            return await _context.Appointments
                .Where(a => a.UserId == userId)
                .Include(a => a.HairStyle)
                .Select(a => new AppointmentResponseDTO(a))
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
                    HairStyleId = a.HairStyleId!.Value,
                    HairStyleName = a.HairStyle!.Name,
                    PriceMin = a.HairStyle.PriceMin,
                    PriceMax = a.HairStyle.PriceMax,
                    ClientFirstName = a.User!.FirstName,
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

            var localAppointmentDate = NormalizeLocalDateTime(appointmentDate);

            var workHours = GetWorkHours(localAppointmentDate.DayOfWeek);
            if (workHours == null)
                throw new InvalidOperationException("Aucun rendez-vous ce jour-là.");

            var localDateUtc = DateTime.SpecifyKind(localAppointmentDate.Date, DateTimeKind.Utc);
            var isDayOff = await _context.DaysOff
                .AnyAsync(d => d.Date == localDateUtc);
            if (isDayOff)
                throw new InvalidOperationException("La styliste n'est pas disponible ce jour-là.");

            var duration = hairStyle.DurationMaxMinutes ?? hairStyle.DurationMinutes;
            var localEnd = localAppointmentDate.AddMinutes(duration);

            var localDay = localAppointmentDate.Date;
            var localStartWork = localDay.AddHours(workHours.Value.debut);
            var localEndWork = localDay.AddHours(workHours.Value.fin);

            if (localAppointmentDate < localStartWork || localEnd > localEndWork)
            {
                throw new InvalidOperationException("En dehors des heures de travail.");
            }

            var existingAppointments = await _context.Appointments
                .Include(a => a.HairStyle)
                .Where(a =>
                    a.AppointmentDate >= localDay &&
                    a.AppointmentDate < localDay.AddDays(1) &&
                    a.Status != AppointmentStatus.Cancelled)
                .ToListAsync();

            bool overlaps = existingAppointments.Any(a =>
            {

                if (a.Status == AppointmentStatus.Cancelled)
                    return false;

                var existingDuration = a.HairStyle?.DurationMaxMinutes
                    ?? a.HairStyle?.DurationMinutes
                    ?? a.ExternalDurationMinutes
                    ?? 60;

                var existingStartLocal = NormalizeLocalDateTime(a.AppointmentDate);
                var existingEndLocal = existingStartLocal.AddMinutes(existingDuration);

                return localAppointmentDate < existingEndLocal && localEnd > existingStartLocal;
            });

            if (overlaps)
            {
                throw new InvalidOperationException("Ce créneau n'est plus disponible.");
            }

            var appointment = new Appointment
            {
                UserId = userId,
                HairStyleId = hairStyle.Id,
                AppointmentDate = localAppointmentDate,
                Status = AppointmentStatus.Pending
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            await _emailService.SendAppointmentPendingAsync(user.Email, user.FirstName, hairStyle.Name, localAppointmentDate);

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

            var localStart = NormalizeLocalDateTime(appointment.AppointmentDate);
            var localEnd = localStart.AddMinutes(appointment.HairStyle!.DurationMinutes);

            var googleEventId = await _calendarService.CreateEventAsync(
                title: $"{appointment.HairStyle.Name} - {appointment.User!.FirstName} {appointment.User.LastName}",
                description: $"Servicio: {appointment.HairStyle.Name}\nPrecio: {appointment.HairStyle.PriceMin} - {appointment.HairStyle.PriceMax}$",
                start: localStart,
                end: localEnd
            );

            appointment.GoogleEventId = googleEventId;
            appointment.Status = AppointmentStatus.Confirmed;

            await _context.SaveChangesAsync();

            await _emailService.SendAppointmentAcceptedAsync(appointment.User!.Email, appointment.User.FirstName, appointment.HairStyle!.Name, appointment.AppointmentDate);
        }

        public async Task CancelAppointmentAsync(int appointmentId)
        {
            var appointment = await _context.Appointments
                .Include(a => a.User)
                .Include(a => a.HairStyle)
                .FirstOrDefaultAsync(a => a.Id == appointmentId)
                ?? throw new KeyNotFoundException("Rendez-vous introuvable.");

            if (!string.IsNullOrEmpty(appointment.GoogleEventId))
            {
                await _calendarService.DeleteEventAsync(appointment.GoogleEventId);
            }

            appointment.Status = AppointmentStatus.Cancelled;
            await _context.SaveChangesAsync();

            if (appointment.User != null && appointment.HairStyle != null)
                await _emailService.SendAppointmentCancelledAsync(appointment.User.Email, appointment.User.FirstName, appointment.HairStyle.Name, appointment.AppointmentDate);
        }

        public async Task CompletePassedAppointmentsAsync()
        {
            var nowToronto = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, _torontoTz).DateTime;

            var passedAppointments = await _context.Appointments
                .Where(a =>
                    a.Status == AppointmentStatus.Confirmed &&
                    a.AppointmentDate < nowToronto)
                .ToListAsync();

            foreach (var appointment in passedAppointments)
                appointment.Status = AppointmentStatus.Completed;

            if (passedAppointments.Any())
                await _context.SaveChangesAsync();
        }

        public async Task<List<AvailableDayWithSlotsDTO>> GetAvailableMonthAsync(int serviceId)
        {
            var hairStyle = await _context.HairStyles
                .FirstOrDefaultAsync(s => s.Id == serviceId)
                ?? throw new KeyNotFoundException("Service inexistant.");

            bool isKeratina = hairStyle.Name.ToLower().Contains("keratina");

            var today = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, _torontoTz).DateTime.Date;
            var lastDay = today.AddDays(30);
            var result = new List<AvailableDayWithSlotsDTO>();

            var todayUtc = DateTime.SpecifyKind(today, DateTimeKind.Utc);
            var lastDayUtc = DateTime.SpecifyKind(lastDay, DateTimeKind.Utc);
            var daysOff = (await _context.DaysOff
                .Where(d => d.Date >= todayUtc && d.Date <= lastDayUtc)
                .ToListAsync())
                .Select(d => d.Date.Date)
                .ToHashSet();

            for (var date = today; date <= lastDay; date = date.AddDays(1))
            {
                var workHours = GetWorkHours(date.DayOfWeek);
                if (workHours == null)
                    continue;

                if (daysOff.Contains(date.Date))
                    continue;

                var dayStart = date.Date;
                var dayEnd = dayStart.AddDays(1);

                var appointments = await _context.Appointments
                    .Include(a => a.HairStyle)
                    .Where(a =>
                        a.AppointmentDate >= dayStart &&
                        a.AppointmentDate < dayEnd)
                    .ToListAsync();

                var slots = new List<string>();
                var endOfDay = dayStart.AddHours(workHours.Value.fin);
                var currentSlot = dayStart.AddHours(workHours.Value.debut);

                var requestedDuration = hairStyle.DurationMaxMinutes ?? hairStyle.DurationMinutes;

                while (currentSlot.AddMinutes(requestedDuration) <= endOfDay)
                {
                    var slotStart = currentSlot;
                    var slotEnd = slotStart.AddMinutes(requestedDuration);

                    bool isTaken = appointments.Any(a =>
                    {
                        var apptDuration = a.HairStyle?.DurationMaxMinutes
                            ?? a.HairStyle?.DurationMinutes
                            ?? a.ExternalDurationMinutes
                            ?? 60;

                        var appointmentStart = NormalizeLocalDateTime(a.AppointmentDate);
                        var appointmentEnd = appointmentStart.AddMinutes(apptDuration);

                        bool overlaps = appointmentStart < slotEnd && appointmentEnd > slotStart;

                        if (!overlaps)
                            return false;

                        if (a.Status == AppointmentStatus.Confirmed ||
                        a.Status == AppointmentStatus.Pending ||
                        a.Status == AppointmentStatus.Completed ||
                        a.Status == AppointmentStatus.External)
                        {
                            return true;
                        }

                        //if (a.Status == AppointmentStatus.Pending && isKeratina)
                        //    return true;

                        //if (a.Status == AppointmentStatus.Pending && a.HairStyle != null)
                        //    return a.HairStyle.PriceMin >= hairStyle.PriceMin;

                        return false;
                    });

                    if (!isTaken)
                        slots.Add(slotStart.ToString("HH:mm"));

                    currentSlot = currentSlot.AddMinutes(slotStepMinutes);
                }

                if (slots.Any())
                {
                    result.Add(new AvailableDayWithSlotsDTO
                    {
                        Day = dayStart,
                        AvailableSlots = slots
                    });
                }
            }

            return result;
        }

        public async Task SyncFromGoogleCalendarAsync()
        {
            var salonTimeZone = TimeZoneInfo.FindSystemTimeZoneById("America/Toronto");

            var todayToronto = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, salonTimeZone).DateTime.Date;
            var timeMin = todayToronto;
            var timeMax = todayToronto.AddDays(60);

            var googleEvents = await _calendarService.GetAppointmentsAsync(timeMin, timeMax);

            var existingGoogleIds = (await _context.Appointments
                .Where(a => a.GoogleEventId != null)
                .Select(a => a.GoogleEventId)
                .ToListAsync()).ToHashSet();

            var externalAppointments = await _context.Appointments
                .Where(a => a.Status == AppointmentStatus.External)
                .ToListAsync();

            var googleEventIds = googleEvents.Select(e => e.Id).ToHashSet();

            foreach (var ext in externalAppointments)
            {
                if (ext.GoogleEventId != null && !googleEventIds.Contains(ext.GoogleEventId))
                    _context.Appointments.Remove(ext);
            }

            foreach (var ev in googleEvents)
            {
                if (existingGoogleIds.Contains(ev.Id))
                    continue;

                var startOffset = ev.Start?.DateTimeDateTimeOffset;
                var endOffset = ev.End?.DateTimeDateTimeOffset;

                if (startOffset == null)
                    continue;

                var startLocal = TimeZoneInfo.ConvertTime(startOffset.Value, salonTimeZone).DateTime;
                var endLocal = endOffset.HasValue
                    ? TimeZoneInfo.ConvertTime(endOffset.Value, salonTimeZone).DateTime
                    : startLocal.AddMinutes(60);

                startLocal = NormalizeLocalDateTime(startLocal);
                endLocal = NormalizeLocalDateTime(endLocal);

                var duration = (int)(endLocal - startLocal).TotalMinutes;

                _context.Appointments.Add(new Appointment
                {
                    GoogleEventId = ev.Id,
                    AppointmentDate = startLocal,
                    ExternalDurationMinutes = duration,
                    Notes = ev.Summary,
                    Status = AppointmentStatus.External
                });
            }

            await _context.SaveChangesAsync();
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
                .Where(a => a.UserId == userId)
                .Include(a => a.HairStyle)
                .Select(a => new AppointmentResponseDTO(a))
                .ToListAsync();
        }

        public async Task<bool> UpdateAppointmentStatusAsync(int appointmentId, int status)
        {
            var appointment = await _context.Appointments
                .Include(a => a.User)
                .Include(a => a.HairStyle)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
                return false;

            if (!Enum.IsDefined(typeof(AppointmentStatus), status))
                throw new ArgumentException("Invalid appointment status");

            appointment.Status = (AppointmentStatus)status;

            await _context.SaveChangesAsync();

            if ((AppointmentStatus)status == AppointmentStatus.Cancelled && appointment.User != null && appointment.HairStyle != null)
                await _emailService.SendAppointmentCancelledAsync(appointment.User.Email, appointment.User.FirstName, appointment.HairStyle.Name, appointment.AppointmentDate);

            return true;
        }

        public async Task<PagedResultDto<AdminAppointmentResponseDTO>> GetAllAppointmentsAsync(int pageNumber, int pageSize, string? searchQuery, int? status, string? dateFilterMode, DateTime? filterDate, DateTime? dateFrom, DateTime? dateTo)
        {
            var query = _context.Appointments
                .Include(a => a.User)
                .Include(a => a.HairStyle)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                var q = searchQuery.Trim().ToLower();
                query = query.Where(a =>
                    a.User != null &&
                    (a.User.FirstName.ToLower().Contains(q) ||
                     a.User.LastName.ToLower().Contains(q) ||
                     (a.User.FirstName + " " + a.User.LastName).ToLower().Contains(q)));
            }

            if (status.HasValue)
                query = query.Where(a => (int)a.Status == status.Value);

            if (!string.IsNullOrWhiteSpace(dateFilterMode))
            {
                switch (dateFilterMode.ToLower())
                {
                    case "exact" when filterDate.HasValue:
                        var exactDate = filterDate.Value.Date;
                        query = query.Where(a => a.AppointmentDate.Date == exactDate);
                        break;
                    case "week" when filterDate.HasValue:
                        var refDay = filterDate.Value.Date;
                        int diff = (int)refDay.DayOfWeek == 0 ? -6 : 1 - (int)refDay.DayOfWeek;
                        var weekStart = refDay.AddDays(diff);
                        var weekEnd = weekStart.AddDays(7);
                        query = query.Where(a => a.AppointmentDate.Date >= weekStart && a.AppointmentDate.Date < weekEnd);
                        break;
                    case "month" when filterDate.HasValue:
                        var monthStart = new DateTime(filterDate.Value.Year, filterDate.Value.Month, 1);
                        var monthEnd = monthStart.AddMonths(1);
                        query = query.Where(a => a.AppointmentDate.Date >= monthStart && a.AppointmentDate.Date < monthEnd);
                        break;
                    case "range":
                        if (dateFrom.HasValue)
                            query = query.Where(a => a.AppointmentDate >= dateFrom.Value);
                        if (dateTo.HasValue)
                            query = query.Where(a => a.AppointmentDate < dateTo.Value.AddDays(1));
                        break;
                }
            }

            query = query.OrderBy(a => a.Status).ThenByDescending(a => a.AppointmentDate);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new AdminAppointmentResponseDTO
                {
                    Id = a.Id,
                    AppointmentDate = a.AppointmentDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                    Status = a.Status,
                    UserName = a.User != null ? a.User.FirstName + " " + a.User.LastName : null,
                    UserEmail = a.User != null ? a.User.Email : null,
                    HairStyleName = a.HairStyle != null ? a.HairStyle.Name : null,
                    StyleNotes = a.StyleNotes
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

        public async Task UpdateStyleNotesAsync(int appointmentId, string? styleNotes)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId)
                ?? throw new KeyNotFoundException("Rendez-vous introuvable.");

            appointment.StyleNotes = styleNotes;
            await _context.SaveChangesAsync();
        }

        public async Task<List<AdminCalendarAppointmentDTO>> GetAdminCalendarAppointmentsAsync(DateTime weekStart)
        {
            if (weekStart == default)
                weekStart = DateTime.Today;

            weekStart = NormalizeLocalDateTime(weekStart);

            var start = weekStart.Date;
            var end = start.AddDays(7);

            return await _context.Appointments
                .Include(a => a.User)
                .Include(a => a.HairStyle)
                .Where(a => a.AppointmentDate >= start && a.AppointmentDate < end)
                .OrderBy(a => a.AppointmentDate)
                .Select(a => new AdminCalendarAppointmentDTO
                {
                    Id = a.Id,
                    AppointmentDate = a.AppointmentDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                    Status = (int)a.Status,
                    HairStyleName = a.Status == AppointmentStatus.External
                        ? "External"
                        : a.HairStyle != null
                            ? a.HairStyle.Name
                            : "Appointment",
                    UserName = a.User != null
                        ? a.User.FirstName + " " + a.User.LastName
                        : "Client",
                    PriceMin = a.HairStyle != null ? a.HairStyle.PriceMin : 0,
                    PriceMax = a.HairStyle != null ? a.HairStyle.PriceMax : null,
                    Notes = a.Notes,
                    StyleNotes = a.StyleNotes,
                    ExternalDurationMinutes = a.Status == AppointmentStatus.External
                        ? a.ExternalDurationMinutes
                        : a.HairStyle != null
                            ? (a.HairStyle.DurationMaxMinutes ?? a.HairStyle.DurationMinutes)
                            : 60
                })
                .ToListAsync();
        }
    }
}