using Google.Apis.Calendar.v3.Data;
using Hairdressers_backend.Interfaces;
using Hairdressers_backend.Services;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Moq;
using Xunit;

namespace Hairdressers_backend.Tests.Services
{
    public class AppointmentServiceTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly Mock<IGoogleCalendarService> _calendarMock;
        private readonly Mock<IEmailService> _emailMock;
        private readonly AppointmentService _service;

        public AppointmentServiceTests()
        {
            // BD en mémoire isolée par test (Guid unique = pas de pollution entre tests)
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _context.Database.EnsureCreated(); // applique les seeds (HairStyles, Users, Appointments)

            _calendarMock = new Mock<IGoogleCalendarService>();
            _emailMock = new Mock<IEmailService>();

            // Supabase.Client n'est pas utilisé dans les méthodes testées → null
            _service = new AppointmentService(_context, null!, _calendarMock.Object, _emailMock.Object);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        // ─── Helpers ────────────────────────────────────────────────────────────────

        private static Event BuildGoogleEvent(string id, string title, DateTime start, int durationMinutes)
        {
            var end = start.AddMinutes(durationMinutes);
            return new Event
            {
                Id = id,
                Summary = title,
                Start = new EventDateTime { DateTimeDateTimeOffset = new DateTimeOffset(start, TimeSpan.Zero) },
                End = new EventDateTime { DateTimeDateTimeOffset = new DateTimeOffset(end, TimeSpan.Zero) }
            };
        }

        // ─── SyncFromGoogleCalendarAsync ────────────────────────────────────────────

        [Fact]
        public async Task Sync_AddsExternalAppointment_WhenGoogleEventNotInDb()
        {
            var futureDate = DateTime.UtcNow.AddDays(5).Date.AddHours(10);
            var googleEvent = BuildGoogleEvent("gcal-001", "Vivi hija mechas y corte", futureDate, 120);

            _calendarMock
                .Setup(s => s.GetAppointmentsAsync(It.IsAny<DateTime?>(), It.IsAny<DateTime?>()))
                .ReturnsAsync(new List<Event> { googleEvent });

            await _service.SyncFromGoogleCalendarAsync();

            var added = await _context.Appointments
                .FirstOrDefaultAsync(a => a.GoogleEventId == "gcal-001");

            Assert.NotNull(added);
            Assert.Equal(AppointmentStatus.External, added.Status);
            Assert.Equal("Vivi hija mechas y corte", added.Notes);
            Assert.Equal(120, added.ExternalDurationMinutes);
            Assert.Null(added.UserId);
            Assert.Null(added.HairStyleId);
        }

        [Fact]
        public async Task Sync_DoesNotDuplicate_WhenGoogleEventAlreadyInDb()
        {
            var futureDate = DateTime.UtcNow.AddDays(5).Date.AddHours(10);

            // L'event est déjà en BD
            _context.Appointments.Add(new Appointment
            {
                Id = 100,
                GoogleEventId = "gcal-002",
                AppointmentDate = futureDate,
                ExternalDurationMinutes = 60,
                Notes = "Déjà syncé",
                Status = AppointmentStatus.External
            });
            await _context.SaveChangesAsync();

            var googleEvent = BuildGoogleEvent("gcal-002", "Déjà syncé", futureDate, 60);

            _calendarMock
                .Setup(s => s.GetAppointmentsAsync(It.IsAny<DateTime?>(), It.IsAny<DateTime?>()))
                .ReturnsAsync(new List<Event> { googleEvent });

            await _service.SyncFromGoogleCalendarAsync();

            var count = await _context.Appointments
                .CountAsync(a => a.GoogleEventId == "gcal-002");

            Assert.Equal(1, count);
        }

        [Fact]
        public async Task Sync_RemovesExternalAppointment_WhenEventDeletedFromGoogle()
        {
            var futureDate = DateTime.UtcNow.AddDays(5).Date.AddHours(10);

            // External en BD mais plus dans Google
            _context.Appointments.Add(new Appointment
            {
                Id = 101,
                GoogleEventId = "gcal-003",
                AppointmentDate = futureDate,
                ExternalDurationMinutes = 60,
                Notes = "Supprimé dans Google",
                Status = AppointmentStatus.External
            });
            await _context.SaveChangesAsync();

            // Google retourne une liste vide
            _calendarMock
                .Setup(s => s.GetAppointmentsAsync(It.IsAny<DateTime?>(), It.IsAny<DateTime?>()))
                .ReturnsAsync(new List<Event>());

            await _service.SyncFromGoogleCalendarAsync();

            var deleted = await _context.Appointments
                .FirstOrDefaultAsync(a => a.GoogleEventId == "gcal-003");

            Assert.Null(deleted);
        }

        [Fact]
        public async Task Sync_DoesNotRemoveConfirmedAppointment_WhenEventMissingFromGoogle()
        {
            var futureDate = DateTime.UtcNow.AddDays(5).Date.AddHours(10);

            // Confirmed (créé via le service) — ne doit jamais être supprimé par la sync
            _context.Appointments.Add(new Appointment
            {
                Id = 102,
                GoogleEventId = "gcal-004",
                AppointmentDate = futureDate,
                UserId = 1,
                HairStyleId = 1,
                Status = AppointmentStatus.Confirmed
            });
            await _context.SaveChangesAsync();

            _calendarMock
                .Setup(s => s.GetAppointmentsAsync(It.IsAny<DateTime?>(), It.IsAny<DateTime?>()))
                .ReturnsAsync(new List<Event>());

            await _service.SyncFromGoogleCalendarAsync();

            var stillThere = await _context.Appointments
                .FirstOrDefaultAsync(a => a.GoogleEventId == "gcal-004");

            Assert.NotNull(stillThere);
            Assert.Equal(AppointmentStatus.Confirmed, stillThere.Status);
        }

        [Fact]
        public async Task Sync_SetsCorrectDuration_FromGoogleEventStartEnd()
        {
            var start = DateTime.UtcNow.AddDays(3).Date.AddHours(9);
            var googleEvent = BuildGoogleEvent("gcal-005", "Balayage Marina", start, 240);

            _calendarMock
                .Setup(s => s.GetAppointmentsAsync(It.IsAny<DateTime?>(), It.IsAny<DateTime?>()))
                .ReturnsAsync(new List<Event> { googleEvent });

            await _service.SyncFromGoogleCalendarAsync();

            var added = await _context.Appointments
                .FirstOrDefaultAsync(a => a.GoogleEventId == "gcal-005");

            Assert.NotNull(added);
            Assert.Equal(240, added.ExternalDurationMinutes);
        }

        // ─── GetAvailableMonthAsync ─────────────────────────────────────────────────

        [Fact]
        public async Task GetAvailableMonth_BlocksSlot_WhenExternalAppointmentCoversIt()
        {
            // Cortes dama = 60 min (Id = 9, seedé)
            var serviceId = 9;

            // Trouver le prochain lundi (jour ouvrable)
            var testDate = DateTime.UtcNow.Date.AddDays(1);
            while (testDate.DayOfWeek == DayOfWeek.Saturday || testDate.DayOfWeek == DayOfWeek.Sunday)
                testDate = testDate.AddDays(1);

            // External qui bloque 8h–9h
            var blockedSlot = testDate.AddHours(8);
            _context.Appointments.Add(new Appointment
            {
                Id = 200,
                GoogleEventId = "gcal-block",
                AppointmentDate = blockedSlot,
                ExternalDurationMinutes = 60,
                Notes = "Bloc externe",
                Status = AppointmentStatus.External
            });
            await _context.SaveChangesAsync();

            var result = await _service.GetAvailableMonthAsync(serviceId);

            var dayResult = result.FirstOrDefault(d => d.Day.Date == testDate);
            Assert.NotNull(dayResult);
            Assert.DoesNotContain("08:00", dayResult.AvailableSlots);
        }

        [Fact]
        public async Task GetAvailableMonth_SlotIsAvailable_WhenNoAppointmentCoversIt()
        {
            // Cortes dama = 60 min (Id = 9, seedé)
            var serviceId = 9;

            var testDate = DateTime.UtcNow.Date.AddDays(1);
            while (testDate.DayOfWeek == DayOfWeek.Saturday || testDate.DayOfWeek == DayOfWeek.Sunday)
                testDate = testDate.AddDays(1);

            // Aucun appointment pour ce jour

            var result = await _service.GetAvailableMonthAsync(serviceId);

            var dayResult = result.FirstOrDefault(d => d.Day.Date == testDate);
            Assert.NotNull(dayResult);
            Assert.Contains("08:00", dayResult.AvailableSlots);
        }
    }
}
