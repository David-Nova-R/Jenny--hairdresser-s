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
        Task<List<AppointmentResponseDTO>?> GetMyAppointmentsAsync(int userId);
        Task<bool> UpdateAppointmentStatusAsync(int appointmentId, int status);
        Task<PagedResultDto<AdminAppointmentResponseDTO>> GetAllAppointmentsAsync(int pageNumber, int pageSize, string? searchQuery, int? status, string? dateFilterMode, DateTime? filterDate, DateTime? dateFrom, DateTime? dateTo);
        Task AcceptAppointmentAsync(int appointmentId);
        Task<List<PendingAppointmentDTO>> GetPendingAppointmentsAsync();
        Task SyncFromGoogleCalendarAsync();
        Task CompletePassedAppointmentsAsync();
        Task<List<AdminCalendarAppointmentDTO>> GetAdminCalendarAppointmentsAsync(DateTime weekStart);
        Task UpdateStyleNotesAsync(int appointmentId, string? styleNotes);
    }
}
