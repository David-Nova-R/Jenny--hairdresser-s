using Hairdressers_backend.Controllers;
using Hairdressers_backend.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using Moq;
using System.Security.Claims;
using Xunit;

namespace Hairdressers_backend.Tests.Controllers
{
    public class HairStylesControllerTests
    {
        private readonly Mock<IHairStyleService> _serviceMock;

        public HairStylesControllerTests()
        {
            _serviceMock = new Mock<IHairStyleService>();
        }

        // ─── Helpers ────────────────────────────────────────────────────────────────

        private HairStylesController BuildController(string? supabaseUserId = "user-abc")
        {
            var controller = new HairStylesController(_serviceMock.Object);
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
            FirstName = "Jenny",
            LastName = "Test"
        };

        private static Mock<IFormFile> BuildFormFile(string contentType = "image/jpeg", long size = 1024)
        {
            var mock = new Mock<IFormFile>();
            mock.Setup(f => f.ContentType).Returns(contentType);
            mock.Setup(f => f.Length).Returns(size);
            mock.Setup(f => f.FileName).Returns("photo.jpg");
            return mock;
        }

        // ─── GetHairStyles ──────────────────────────────────────────────────────────

        [Fact]
        public async Task GetHairStyles_Returns200_WithList()
        {
            var styles = new List<HairStyleDTO>();
            _serviceMock.Setup(s => s.GetHairStylesAsync()).ReturnsAsync(styles);
            var controller = BuildController();
            var result = await controller.GetHairStyles() as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
            Assert.Equal(styles, result.Value);
        }

        // ─── UploadPhoto ────────────────────────────────────────────────────────────

        [Fact]
        public async Task UploadPhoto_Returns200_WhenSuccess()
        {
            _serviceMock.Setup(s => s.UploadPhotoAsync(1, It.IsAny<IFormFile>())).ReturnsAsync("https://storage/photo.jpg");
            var controller = BuildController();
            var result = await controller.UploadPhoto(1, BuildFormFile().Object) as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
        }

        [Fact]
        public async Task UploadPhoto_Returns404_WhenHairStyleNotFound()
        {
            _serviceMock.Setup(s => s.UploadPhotoAsync(999, It.IsAny<IFormFile>())).ThrowsAsync(new KeyNotFoundException("Service introuvable."));
            var controller = BuildController();
            var result = await controller.UploadPhoto(999, BuildFormFile().Object) as NotFoundObjectResult;
            Assert.Equal(404, result!.StatusCode);
        }

        [Fact]
        public async Task UploadPhoto_Returns400_WhenInvalidOperation()
        {
            _serviceMock.Setup(s => s.UploadPhotoAsync(1, It.IsAny<IFormFile>())).ThrowsAsync(new InvalidOperationException("Format non supporté."));
            var controller = BuildController();
            var result = await controller.UploadPhoto(1, BuildFormFile().Object) as BadRequestObjectResult;
            Assert.Equal(400, result!.StatusCode);
        }

        // ─── DeletePhoto ────────────────────────────────────────────────────────────

        [Fact]
        public async Task DeletePhoto_Returns200_WhenSuccess()
        {
            _serviceMock.Setup(s => s.DeletePhotoAsync(1)).Returns(Task.CompletedTask);
            var controller = BuildController();
            var result = await controller.DeletePhoto(1) as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
        }

        [Fact]
        public async Task DeletePhoto_Returns404_WhenPhotoNotFound()
        {
            _serviceMock.Setup(s => s.DeletePhotoAsync(999)).ThrowsAsync(new KeyNotFoundException("Photo introuvable."));
            var controller = BuildController();
            var result = await controller.DeletePhoto(999) as NotFoundObjectResult;
            Assert.Equal(404, result!.StatusCode);
        }

        // ─── GetPhotos ──────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetPhotos_Returns200_WithPhotoList()
        {
            var photos = new List<HairStylePhoto>
            {
                new HairStylePhoto { Id = 1, HairStyleId = 3, PhotoUrl = "https://storage/a.jpg" }
            };
            _serviceMock.Setup(s => s.GetPhotosByHairStyleAsync(3)).ReturnsAsync(photos);
            var controller = BuildController();
            var result = await controller.GetPhotos(3) as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
            Assert.Equal(photos, result.Value);
        }

        [Fact]
        public async Task GetPhotos_Returns200_WithEmptyList_WhenNoPhotos()
        {
            _serviceMock.Setup(s => s.GetPhotosByHairStyleAsync(5)).ReturnsAsync(new List<HairStylePhoto>());
            var controller = BuildController();
            var result = await controller.GetPhotos(5) as OkObjectResult;
            Assert.Equal(200, result!.StatusCode);
        }
    }
}
