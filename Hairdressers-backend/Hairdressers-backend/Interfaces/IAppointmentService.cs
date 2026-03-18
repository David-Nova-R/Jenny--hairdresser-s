using Models.Models;

namespace Hairdressers_backend.Interfaces
{
    public interface IAppointmentService
    {
        Task<Appointment> CreateAppointmentAsync(int userId, int serviceId, DateTime appointmentDate);
        Task CancelAppointmentAsync(int appointmentId);
        Task<List<Appointment>> GetUserAppointmentsAsync(int userId);
    }
}
