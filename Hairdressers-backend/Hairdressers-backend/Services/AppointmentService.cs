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

        public AppointmentService(AppDbContext context, Client supabase)
        {
            _context = context;
            _supabase = supabase;
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

        public Task<List<Appointment>> GetUserAppointmentsAsync(int userId)
        {
            throw new NotImplementedException();
        }
        
        public Task CancelAppointmentAsync(int appointmentId)
        {
            throw new NotImplementedException();
        }
    }
}
