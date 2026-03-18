namespace Hairdressers_backend.Interfaces
{
    public interface IGoogleCalendarService
    {
        Task<string> CreateEventAsync(string title, string description, DateTime start, DateTime end);
        Task DeleteEventAsync(string eventId);
    }
}
