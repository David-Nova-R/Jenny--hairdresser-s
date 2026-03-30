using Hairdressers_backend.Controllers;
using Hairdressers_backend.Dtos.DayOffDTO;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using Moq;
using Xunit;

namespace Hairdressers_backend.Tests.Controllers
{
    public class DayOffControllerTests
    {
        private readonly Mock<IDayOffService> _serviceMock;
        private readonly DayOffController _controller;

        public DayOffControllerTests()
        {
            _serviceMock = new Mock<IDayOffService>();
            _controller = new DayOffController(_serviceMock.Object);
        }

        // ─── GetDaysOff ──────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetDaysOff_Returns200_WithEmptyList()
        {
            _serviceMock.Setup(s => s.GetDaysOffAsync()).ReturnsAsync(new List<DayOff>());

            var result = await _controller.GetDaysOff() as OkObjectResult;

            Assert.Equal(200, result!.StatusCode);
        }

        [Fact]
        public async Task GetDaysOff_Returns200_WithDaysOff()
        {
            var daysOff = new List<DayOff>
            {
                new DayOff { Id = 1, Date = new DateTime(2026, 4, 1), Reason = "Congé" },
                new DayOff { Id = 2, Date = new DateTime(2026, 5, 1), Reason = "Fête" }
            };
            _serviceMock.Setup(s => s.GetDaysOffAsync()).ReturnsAsync(daysOff);

            var result = await _controller.GetDaysOff() as OkObjectResult;

            Assert.Equal(200, result!.StatusCode);
            Assert.Equal(daysOff, result.Value);
        }

        // ─── AddDayOff ───────────────────────────────────────────────────────────────

        [Fact]
        public async Task AddDayOff_Returns200_WithCreatedDayOff()
        {
            var dto = new AddDayOffDTO { Date = new DateTime(2026, 7, 14), Reason = "Fête nationale" };
            var created = new DayOff { Id = 1, Date = dto.Date, Reason = dto.Reason };
            _serviceMock.Setup(s => s.AddDayOffAsync(dto.Date, dto.Reason)).ReturnsAsync(created);

            var result = await _controller.AddDayOff(dto) as OkObjectResult;

            Assert.Equal(200, result!.StatusCode);
            Assert.Equal(created, result.Value);
        }

        [Fact]
        public async Task AddDayOff_Returns200_WithNullReason()
        {
            var dto = new AddDayOffDTO { Date = new DateTime(2026, 8, 1), Reason = null };
            var created = new DayOff { Id = 2, Date = dto.Date, Reason = null };
            _serviceMock.Setup(s => s.AddDayOffAsync(dto.Date, null)).ReturnsAsync(created);

            var result = await _controller.AddDayOff(dto) as OkObjectResult;

            Assert.Equal(200, result!.StatusCode);
        }

        // ─── RemoveDayOff ────────────────────────────────────────────────────────────

        [Fact]
        public async Task RemoveDayOff_Returns200_WhenSuccess()
        {
            _serviceMock.Setup(s => s.RemoveDayOffAsync(1)).Returns(Task.CompletedTask);

            var result = await _controller.RemoveDayOff(1) as OkObjectResult;

            Assert.Equal(200, result!.StatusCode);
        }

        [Fact]
        public async Task RemoveDayOff_Returns404_WhenNotFound()
        {
            _serviceMock.Setup(s => s.RemoveDayOffAsync(999))
                .ThrowsAsync(new KeyNotFoundException("Journée off introuvable."));

            var result = await _controller.RemoveDayOff(999) as NotFoundObjectResult;

            Assert.Equal(404, result!.StatusCode);
        }
    }
}
