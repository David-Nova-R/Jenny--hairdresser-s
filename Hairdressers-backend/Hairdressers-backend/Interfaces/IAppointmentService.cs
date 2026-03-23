using Hairdressers_backend.Dtos;
using Models.Models;

namespace Hairdressers_backend.Interfaces
{
    public interface IAppointmentService
    {
        Task<Appointment> CreateAppointmentAsync(int userId, int hairStylesId, DateTime appointmentDate);
        Task CancelAppointmentAsync(int appointmentId);
        Task<List<AppointmentResponseDTO>> GetUserAppointmentsAsync(int userId);
        Task<List<AvailableDayWithSlotsDTO>> GetAvailableMonthAsync(int serviceId);
        Task<User?> GetUserBySupabaseIdAsync(string supabaseUserId);
        Task<Appointment?> GetAppointmentByIdAsync(int appointmentId);
    }
}
