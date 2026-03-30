using Hairdressers_backend.Services;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Xunit;

namespace Hairdressers_backend.Tests.Services
{
    public class DayOffServiceTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly DayOffService _service;

        public DayOffServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _service = new DayOffService(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        // ─── GetDaysOffAsync ─────────────────────────────────────────────────────────

        [Fact]
        public async Task GetDaysOff_ReturnsEmpty_WhenNoDaysOff()
        {
            var result = await _service.GetDaysOffAsync();

            Assert.Empty(result);
        }

        [Fact]
        public async Task GetDaysOff_ReturnsAllDaysOff()
        {
            _context.DaysOff.AddRange(
                new DayOff { Date = new DateTime(2026, 4, 1), Reason = "Congé" },
                new DayOff { Date = new DateTime(2026, 4, 10), Reason = "Vacances" }
            );
            await _context.SaveChangesAsync();

            var result = await _service.GetDaysOffAsync();

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetDaysOff_ReturnsOrderedByDate()
        {
            _context.DaysOff.AddRange(
                new DayOff { Date = new DateTime(2026, 5, 15) },
                new DayOff { Date = new DateTime(2026, 4, 1) },
                new DayOff { Date = new DateTime(2026, 6, 20) }
            );
            await _context.SaveChangesAsync();

            var result = await _service.GetDaysOffAsync();

            Assert.Equal(new DateTime(2026, 4, 1), result[0].Date);
            Assert.Equal(new DateTime(2026, 5, 15), result[1].Date);
            Assert.Equal(new DateTime(2026, 6, 20), result[2].Date);
        }

        // ─── AddDayOffAsync ──────────────────────────────────────────────────────────

        [Fact]
        public async Task AddDayOff_PersistsDayOff_WithCorrectData()
        {
            var date = new DateTime(2026, 7, 14, 12, 30, 0);
            var result = await _service.AddDayOffAsync(date, "Fête nationale");

            Assert.NotEqual(0, result.Id);
            Assert.Equal(date.Date, result.Date);
            Assert.Equal("Fête nationale", result.Reason);
        }

        [Fact]
        public async Task AddDayOff_StoresDatePart_Only()
        {
            var dateWithTime = new DateTime(2026, 8, 1, 15, 45, 0);
            var result = await _service.AddDayOffAsync(dateWithTime, null);

            // La méthode fait date.Date donc seule la partie date est gardée
            Assert.Equal(dateWithTime.Date, result.Date);
            Assert.Equal(TimeSpan.Zero, result.Date.TimeOfDay);
        }

        [Fact]
        public async Task AddDayOff_AcceptsNullReason()
        {
            var result = await _service.AddDayOffAsync(new DateTime(2026, 9, 1), null);

            Assert.Null(result.Reason);
        }

        [Fact]
        public async Task AddDayOff_IsFoundInDb_AfterSave()
        {
            await _service.AddDayOffAsync(new DateTime(2026, 10, 5), "Test");

            var inDb = await _context.DaysOff.FirstOrDefaultAsync(d => d.Reason == "Test");
            Assert.NotNull(inDb);
        }

        // ─── RemoveDayOffAsync ───────────────────────────────────────────────────────

        [Fact]
        public async Task RemoveDayOff_DeletesDayOff_WhenExists()
        {
            var dayOff = new DayOff { Date = new DateTime(2026, 4, 1), Reason = "À supprimer" };
            _context.DaysOff.Add(dayOff);
            await _context.SaveChangesAsync();

            await _service.RemoveDayOffAsync(dayOff.Id);

            var inDb = await _context.DaysOff.FirstOrDefaultAsync(d => d.Id == dayOff.Id);
            Assert.Null(inDb);
        }

        [Fact]
        public async Task RemoveDayOff_ThrowsKeyNotFound_WhenIdDoesNotExist()
        {
            await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _service.RemoveDayOffAsync(9999)
            );
        }
    }
}
