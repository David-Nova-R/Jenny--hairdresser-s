namespace Hairdressers_backend.Interfaces
{
    public interface IEmailService
    {
        Task SendAppointmentPendingAsync(string toEmail, string firstName, string serviceName, DateTime appointmentDate);
        Task SendAppointmentAcceptedAsync(string toEmail, string firstName, string serviceName, DateTime appointmentDate);
        Task SendAppointmentCancelledAsync(string toEmail, string firstName, string serviceName, DateTime appointmentDate);
    }
}
