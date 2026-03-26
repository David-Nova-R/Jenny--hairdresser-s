using Hairdressers_backend.Controllers;
using Hairdressers_backend.Dtos;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using Moq;
using System.Security.Claims;
using Xunit;

namespace Hairdressers_backend.Tests.Controllers
{
    public class AppointmentControllerTests
    {
        private readonly Mock<IAppointmentService> _serviceMock;

        public AppointmentControllerTests()
        {
            _serviceMock = new Mock<IAppointmentService>();
        }

        // ─── Helpers ────────────────────────────────────────────────────────────────

        private AppointmentController BuildController(string? supabaseUserId = "user-abc")
        {
            var controller = new AppointmentController(_serviceMock.Object);
            var claims = supabaseUserId != null
                ? new List<Claim> { new Claim(ClaimTypes.NameIdentifier, supabaseUserId) }
                : new List<Claim>();

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(claims, "Test"))
                }
            };
            return controller;
        }

        private User MakeUser(int id) => new User
        {
            Id = id,
            SupabaseUserId = "user-abc",
            FirstName = "Jean",
            LastName = "Test"
        };

        // ─── GetUserAppointments ────────────────────────────────────────────────────

        [Fact]
        public async Task GetUserAppointments_Returns401_WhenNoClaimInToken()
        {
            var controller = BuildController(supabaseUserId: null);
            var result = await controller.GetUserAppointments() as ObjectResult;
            Assert.Equal(401, result!.StatusCode);
        }

        [Fact]
        public async Task GetUserAppointments_Returns404_WhenUserNotFound()
        {
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync((User?)null);
            var controller = BuildController();
            var result = await controller.GetUserAppointments() as NotFoundObjectResult;
            Assert.Equal(404, result!.StatusCode);
        }

        [Fact]
        public async Task GetUserAppointments_Returns200WithEmptyMessage_WhenNoAppointments()
        {
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.GetUserAppointmentsAsync(1)).ReturnsAsync(new List<AppointmentResponseDTO>());
            var controller = BuildController();
            var result = await controller.GetUserAppointments() as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
        }

        [Fact]
        public async Task GetUserAppointments_Returns200WithList_WhenAppointmentsExist()
        {
            var appointments = new List<AppointmentResponseDTO>
            {
                new AppointmentResponseDTO { Id = 1, HairStyleName = "Corte" }
            };
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.GetUserAppointmentsAsync(1)).ReturnsAsync(appointments);
            var controller = BuildController();
            var result = await controller.GetUserAppointments() as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
            Assert.Equal(appointments, result.Value);
        }

        // ─── GetPendingAppointments ─────────────────────────────────────────────────

        [Fact]
        public async Task GetPendingAppointments_Returns401_WhenNoClaimInToken()
        {
            var controller = BuildController(supabaseUserId: null);
            var result = await controller.GetPendingAppointments() as ObjectResult;
            Assert.Equal(401, result!.StatusCode);
        }

        [Fact]
        public async Task GetPendingAppointments_Returns200_WhenHasPending()
        {
            var pending = new List<PendingAppointmentDTO> { new PendingAppointmentDTO { Id = 1 } };
            _serviceMock.Setup(s => s.GetPendingAppointmentsAsync()).ReturnsAsync(pending);
            var controller = BuildController();
            var result = await controller.GetPendingAppointments() as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
            Assert.Equal(pending, result.Value);
        }

        [Fact]
        public async Task GetPendingAppointments_Returns200WithEmptyMessage_WhenNoPending()
        {
            _serviceMock.Setup(s => s.GetPendingAppointmentsAsync()).ReturnsAsync(new List<PendingAppointmentDTO>());
            var controller = BuildController();
            var result = await controller.GetPendingAppointments() as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
        }

        // ─── PostAppointment ────────────────────────────────────────────────────────

        [Fact]
        public async Task PostAppointment_Returns401_WhenNoClaimInToken()
        {
            var controller = BuildController(supabaseUserId: null);
            var result = await controller.PostAppointment(new AppointmentDTO()) as ObjectResult;
            Assert.Equal(401, result!.StatusCode);
        }

        [Fact]
        public async Task PostAppointment_Returns404_WhenUserNotFound()
        {
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync((User?)null);
            var controller = BuildController();
            var result = await controller.PostAppointment(new AppointmentDTO()) as NotFoundObjectResult;
            Assert.Equal(404, result!.StatusCode);
        }

        [Fact]
        public async Task PostAppointment_Returns200_OnSuccess()
        {
            var dto = new AppointmentDTO { HairStyleId = 1, AppointmentDate = DateTime.UtcNow.AddDays(3) };
            var createdAppointment = new Appointment { Id = 10, AppointmentDate = dto.AppointmentDate, Status = AppointmentStatus.Pending };
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.CreateAppointmentAsync(1, 1, dto.AppointmentDate)).ReturnsAsync(createdAppointment);
            var controller = BuildController();
            var result = await controller.PostAppointment(dto) as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
        }

        [Fact]
        public async Task PostAppointment_Returns404_WhenHairStyleNotFound()
        {
            var dto = new AppointmentDTO { HairStyleId = 999, AppointmentDate = DateTime.UtcNow.AddDays(1) };
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.CreateAppointmentAsync(It.IsAny<int>(), 999, It.IsAny<DateTime>()))
                        .ThrowsAsync(new KeyNotFoundException("Service introuvable."));
            var controller = BuildController();
            var result = await controller.PostAppointment(dto) as NotFoundObjectResult;
            Assert.Equal(404, result!.StatusCode);
        }

        // ─── AcceptAppointment ──────────────────────────────────────────────────────

        [Fact]
        public async Task AcceptAppointment_Returns200_WhenSuccess()
        {
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.AcceptAppointmentAsync(5)).Returns(Task.CompletedTask);
            var controller = BuildController();
            var result = await controller.AcceptAppointment(5) as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
        }

        [Fact]
        public async Task AcceptAppointment_Returns404_WhenAppointmentNotFound()
        {
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.AcceptAppointmentAsync(99)).ThrowsAsync(new KeyNotFoundException());
            var controller = BuildController();
            var result = await controller.AcceptAppointment(99) as NotFoundObjectResult;
            Assert.Equal(404, result!.StatusCode);
        }

        [Fact]
        public async Task AcceptAppointment_Returns400_WhenAppointmentNotPending()
        {
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.AcceptAppointmentAsync(2)).ThrowsAsync(new InvalidOperationException("Seulement un rendez-vous en attente peut être accepté."));
            var controller = BuildController();
            var result = await controller.AcceptAppointment(2) as BadRequestObjectResult;
            Assert.Equal(400, result!.StatusCode);
        }

        // ─── CancelAppointment ──────────────────────────────────────────────────────

        [Fact]
        public async Task CancelAppointment_Returns404_WhenAppointmentNotFound()
        {
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.GetAppointmentByIdAsync(99)).ReturnsAsync((Appointment?)null);
            var controller = BuildController();
            var result = await controller.CancelAppointment(99) as NotFoundObjectResult;
            Assert.Equal(404, result!.StatusCode);
        }

        [Fact]
        public async Task CancelAppointment_Returns403_WhenAppointmentBelongsToOtherUser()
        {
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.GetAppointmentByIdAsync(5)).ReturnsAsync(new Appointment { Id = 5, UserId = 2, Status = AppointmentStatus.Pending });
            var controller = BuildController();
            var result = await controller.CancelAppointment(5) as ObjectResult;
            Assert.Equal(403, result!.StatusCode);
        }

        [Fact]
        public async Task CancelAppointment_Returns400_WhenAlreadyCancelled()
        {
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.GetAppointmentByIdAsync(5)).ReturnsAsync(new Appointment { Id = 5, UserId = 1, Status = AppointmentStatus.Cancelled });
            var controller = BuildController();
            var result = await controller.CancelAppointment(5) as BadRequestObjectResult;
            Assert.Equal(400, result!.StatusCode);
        }

        [Fact]
        public async Task CancelAppointment_Returns400_WhenAlreadyCompleted()
        {
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.GetAppointmentByIdAsync(5)).ReturnsAsync(new Appointment { Id = 5, UserId = 1, Status = AppointmentStatus.Completed });
            var controller = BuildController();
            var result = await controller.CancelAppointment(5) as BadRequestObjectResult;
            Assert.Equal(400, result!.StatusCode);
        }

        [Fact]
        public async Task CancelAppointment_Returns200_OnSuccess()
        {
            _serviceMock.Setup(s => s.GetUserBySupabaseIdAsync("user-abc")).ReturnsAsync(MakeUser(1));
            _serviceMock.Setup(s => s.GetAppointmentByIdAsync(5)).ReturnsAsync(new Appointment { Id = 5, UserId = 1, Status = AppointmentStatus.Pending });
            _serviceMock.Setup(s => s.CancelAppointmentAsync(5)).Returns(Task.CompletedTask);
            var controller = BuildController();
            var result = await controller.CancelAppointment(5) as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
        }

        // ─── GetAvailableMonth ──────────────────────────────────────────────────────

        [Fact]
        public async Task GetAvailableMonth_Returns200_WithSlots()
        {
            var slots = new List<AvailableDayWithSlotsDTO> { new AvailableDayWithSlotsDTO { Day = DateTime.Today, AvailableSlots = new List<string> { "08:00" } } };
            _serviceMock.Setup(s => s.GetAvailableMonthAsync(1)).ReturnsAsync(slots);
            var controller = BuildController();
            var actionResult = await controller.GetAvailableMonth(new AvailableMonthDTO { ServiceId = 1 });
            var result = actionResult.Result as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
            Assert.Equal(slots, result.Value);
        }

        [Fact]
        public async Task GetAvailableMonth_Returns400_WhenServiceNotFound()
        {
            _serviceMock.Setup(s => s.GetAvailableMonthAsync(999)).ThrowsAsync(new KeyNotFoundException("Service inexistant."));
            var controller = BuildController();
            var actionResult = await controller.GetAvailableMonth(new AvailableMonthDTO { ServiceId = 999 });
            var result = actionResult.Result as BadRequestObjectResult;
            Assert.Equal(400, result!.StatusCode);
        }
    }
}
