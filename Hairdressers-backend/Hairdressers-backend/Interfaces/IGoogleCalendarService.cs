using Google.Apis.Calendar.v3.Data;

namespace Hairdressers_backend.Interfaces
{
    public interface IGoogleCalendarService
    {
        Task<string> CreateEventAsync(string title, string description, DateTime start, DateTime end);
        Task DeleteEventAsync(string eventId);
        Task<IList<Event>> GetAppointmentsAsync(DateTime? timeMin = null, DateTime? timeMax = null);
    }
}
