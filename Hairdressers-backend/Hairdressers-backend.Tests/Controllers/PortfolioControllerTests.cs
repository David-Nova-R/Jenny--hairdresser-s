using Hairdressers_backend.Controllers;
using Hairdressers_backend.Dtos.PortfolioDTO;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using Moq;
using Xunit;

namespace Hairdressers_backend.Tests.Controllers
{
    public class PortfolioControllerTests
    {
        private readonly Mock<IPortfolioService> _serviceMock;
        private readonly PortfolioController _controller;

        public PortfolioControllerTests()
        {
            _serviceMock = new Mock<IPortfolioService>();
            _controller = new PortfolioController(_serviceMock.Object);
        }

        private static Mock<IFormFile> BuildFormFile(string contentType = "image/jpeg", long size = 1024)
        {
            var mock = new Mock<IFormFile>();
            mock.Setup(f => f.ContentType).Returns(contentType);
            mock.Setup(f => f.Length).Returns(size);
            mock.Setup(f => f.FileName).Returns("photo.jpg");
            return mock;
        }

        // ─── GetPortfolio ────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetPortfolio_Returns200_WithVisiblePhotos()
        {
            var photos = new List<PortfolioPhoto>
            {
                new PortfolioPhoto { Id = 1, PhotoUrl = "https://storage/a.jpg", IsVisible = true, Order = 1 }
            };
            _serviceMock.Setup(s => s.GetVisiblePhotosAsync()).ReturnsAsync(photos);

            var result = await _controller.GetPortfolio() as OkObjectResult;

            Assert.Equal(200, result!.StatusCode);
            Assert.Equal(photos, result.Value);
        }

        [Fact]
        public async Task GetPortfolio_Returns200_WithEmptyList()
        {
            _serviceMock.Setup(s => s.GetVisiblePhotosAsync()).ReturnsAsync(new List<PortfolioPhoto>());

            var result = await _controller.GetPortfolio() as OkObjectResult;

            Assert.Equal(200, result!.StatusCode);
        }

        // ─── GetAllPortfolioPhotos ───────────────────────────────────────────────────

        [Fact]
        public async Task GetAllPortfolioPhotos_Returns200_WithAllPhotos()
        {
            var photos = new List<PortfolioPhoto>
            {
                new PortfolioPhoto { Id = 1, IsVisible = true, Order = 1 },
                new PortfolioPhoto { Id = 2, IsVisible = false, Order = 2 }
            };
            _serviceMock.Setup(s => s.GetAllPhotosAsync()).ReturnsAsync(photos);

            var result = await _controller.GetAllPortfolioPhotos() as OkObjectResult;

            Assert.Equal(200, result!.StatusCode);
            Assert.Equal(photos, result.Value);
        }

        // ─── UploadPortfolioPhoto ────────────────────────────────────────────────────

        [Fact]
        public async Task UploadPortfolioPhoto_Returns200_WhenSuccess()
        {
            var created = new PortfolioPhoto { Id = 1, PhotoUrl = "https://storage/new.jpg", Order = 1, IsVisible = true };
            _serviceMock.Setup(s => s.UploadPhotoAsync(It.IsAny<IFormFile>(), "Titre", 1)).ReturnsAsync(created);

            var result = await _controller.UploadPortfolioPhoto(BuildFormFile().Object, "Titre", 1) as OkObjectResult;

            Assert.Equal(200, result!.StatusCode);
            Assert.Equal(created, result.Value);
        }

        [Fact]
        public async Task UploadPortfolioPhoto_Returns400_WhenInvalidOperation()
        {
            _serviceMock.Setup(s => s.UploadPhotoAsync(It.IsAny<IFormFile>(), It.IsAny<string?>(), It.IsAny<int>()))
                .ThrowsAsync(new InvalidOperationException("Format non supporté."));

            var result = await _controller.UploadPortfolioPhoto(BuildFormFile().Object, null, 0) as BadRequestObjectResult;

            Assert.Equal(400, result!.StatusCode);
        }

        // ─── DeletePortfolioPhoto ────────────────────────────────────────────────────

        [Fact]
        public async Task DeletePortfolioPhoto_Returns200_WhenSuccess()
        {
            _serviceMock.Setup(s => s.DeletePhotoAsync(1)).Returns(Task.CompletedTask);

            var result = await _controller.DeletePortfolioPhoto(1) as OkObjectResult;

            Assert.Equal(200, result!.StatusCode);
        }

        [Fact]
        public async Task DeletePortfolioPhoto_Returns404_WhenNotFound()
        {
            _serviceMock.Setup(s => s.DeletePhotoAsync(999))
                .ThrowsAsync(new KeyNotFoundException("Photo introuvable."));

            var result = await _controller.DeletePortfolioPhoto(999) as NotFoundObjectResult;

            Assert.Equal(404, result!.StatusCode);
        }

        // ─── UpdatePortfolioPhoto ────────────────────────────────────────────────────

        [Fact]
        public async Task UpdatePortfolioPhoto_Returns200_WhenSuccess()
        {
            _serviceMock.Setup(s => s.UpdatePhotoAsync(1, false, 3, "Nouveau titre")).Returns(Task.CompletedTask);
            var dto = new UpdatePortfolioPhotoDTO { IsVisible = false, Order = 3, Title = "Nouveau titre" };

            var result = await _controller.UpdatePortfolioPhoto(1, dto) as OkObjectResult;

            Assert.Equal(200, result!.StatusCode);
        }

        [Fact]
        public async Task UpdatePortfolioPhoto_Returns404_WhenNotFound()
        {
            _serviceMock.Setup(s => s.UpdatePhotoAsync(999, It.IsAny<bool>(), It.IsAny<int>(), It.IsAny<string?>()))
                .ThrowsAsync(new KeyNotFoundException("Photo introuvable."));
            var dto = new UpdatePortfolioPhotoDTO { IsVisible = true, Order = 1, Title = null };

            var result = await _controller.UpdatePortfolioPhoto(999, dto) as NotFoundObjectResult;

            Assert.Equal(404, result!.StatusCode);
        }
    }
}
