using Models.Models;

namespace Hairdressers_backend.Interfaces
{
    public interface IDayOffService
    {
        Task<List<DayOff>> GetDaysOffAsync();
        Task<DayOff> AddDayOffAsync(DateTime date, string? reason);
        Task RemoveDayOffAsync(int id);
    }
}
