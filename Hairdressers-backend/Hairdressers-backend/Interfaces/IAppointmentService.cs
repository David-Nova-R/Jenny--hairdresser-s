using Models.Models;

namespace Hairdressers_backend.Interfaces
{
    public interface IAppointmentService
    {
        Task<Appointment> CreateAppointmentAsync(int userId, int hairStylesId, DateTime appointmentDate);
        Task CancelAppointmentAsync(int appointmentId);
        Task<List<Appointment>> GetUserAppointmentsAsync(int userId);
    }
}
