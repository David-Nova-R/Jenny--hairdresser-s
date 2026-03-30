using Hairdressers_backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;

namespace Hairdressers_backend.Services
{
    public class DayOffService : IDayOffService
    {
        private readonly AppDbContext _context;

        public DayOffService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DayOff>> GetDaysOffAsync()
        {
            return await _context.DaysOff
                .OrderBy(d => d.Date)
                .ToListAsync();
        }

        public async Task<DayOff> AddDayOffAsync(DateTime date, string? reason)
        {
            var dayOff = new DayOff
            {
                Date = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc),
                Reason = reason,
                CreatedAt = DateTime.UtcNow
            };

            _context.DaysOff.Add(dayOff);
            await _context.SaveChangesAsync();

            return dayOff;
        }

        public async Task RemoveDayOffAsync(int id)
        {
            var dayOff = await _context.DaysOff
                .FirstOrDefaultAsync(d => d.Id == id)
                ?? throw new KeyNotFoundException("Journée off introuvable.");

            _context.DaysOff.Remove(dayOff);
            await _context.SaveChangesAsync();
        }
    }
}
