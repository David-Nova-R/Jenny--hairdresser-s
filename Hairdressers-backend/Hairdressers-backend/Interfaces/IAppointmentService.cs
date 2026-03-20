using Hairdressers_backend.Dtos;
using Models.Models;

namespace Hairdressers_backend.Interfaces
{
    public interface IAppointmentService
    {
        Task<Appointment> CreateAppointmentAsync(int userId, int hairStylesId, DateTime appointmentDate);
        Task CancelAppointmentAsync(int appointmentId);
        Task<List<AppointmentResponseDTO>> GetUserAppointmentsAsync(int userId);
    }
}
