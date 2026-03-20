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

        public AppointmentService(AppDbContext context, Client supabase,IGoogleCalendarService calendarService)
        {
            _context = context;
            _supabase = supabase;
            _calendarService = calendarService;
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

            // Créer l'événement dans Google Calendar
            var endDate = appointmentDate.AddMinutes(hairStyle.DurationMaxMinutes);
            var googleEventId = await _calendarService.CreateEventAsync(
                title: $"{hairStyle.Name} - {user.FirstName} {user.LastName} ",
                description: $"Servicio: {hairStyle.Name}\nPrecio:{hairStyle.PriceMin} - {hairStyle.PriceMax}$",
                start: appointmentDate,
                end: endDate
            );

            // Sauvegarder l'ID de l'événement Google pour pouvoir le supprimer plus tard
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
    }
}
