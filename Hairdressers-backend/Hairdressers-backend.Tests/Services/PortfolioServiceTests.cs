using Hairdressers_backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Moq;
using Xunit;

namespace Hairdressers_backend.Tests.Services
{
    public class PortfolioServiceTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly PortfolioService _service;

        public PortfolioServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            // Supabase.Client est null → valide pour les tests qui n'atteignent pas le storage
            _service = new PortfolioService(_context, null!);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        // ─── Helpers ────────────────────────────────────────────────────────────────

        private static Mock<IFormFile> BuildFormFile(string contentType, long sizeBytes = 1024)
        {
            var mock = new Mock<IFormFile>();
            mock.Setup(f => f.ContentType).Returns(contentType);
            mock.Setup(f => f.Length).Returns(sizeBytes);
            mock.Setup(f => f.FileName).Returns("photo.jpg");
            mock.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);
            return mock;
        }

        private async Task<PortfolioPhoto> AddPhoto(bool isVisible, int order, string? title = null)
        {
            var photo = new PortfolioPhoto
            {
                PhotoUrl = $"https://storage/photo-{Guid.NewGuid()}.jpg",
                Title = title,
                Order = order,
                IsVisible = isVisible,
                CreatedAt = DateTime.UtcNow
            };
            _context.PortfolioPhotos.Add(photo);
            await _context.SaveChangesAsync();
            return photo;
        }

        // ─── GetVisiblePhotosAsync ───────────────────────────────────────────────────

        [Fact]
        public async Task GetVisiblePhotos_ReturnsOnlyVisiblePhotos()
        {
            await AddPhoto(isVisible: true, order: 1);
            await AddPhoto(isVisible: false, order: 2);
            await AddPhoto(isVisible: true, order: 3);

            var result = await _service.GetVisiblePhotosAsync();

            Assert.Equal(2, result.Count);
            Assert.All(result, p => Assert.True(p.IsVisible));
        }

        [Fact]
        public async Task GetVisiblePhotos_ReturnsOrderedByOrder()
        {
            await AddPhoto(isVisible: true, order: 3);
            await AddPhoto(isVisible: true, order: 1);
            await AddPhoto(isVisible: true, order: 2);

            var result = await _service.GetVisiblePhotosAsync();

            Assert.Equal(1, result[0].Order);
            Assert.Equal(2, result[1].Order);
            Assert.Equal(3, result[2].Order);
        }

        [Fact]
        public async Task GetVisiblePhotos_ReturnsEmpty_WhenNoVisiblePhotos()
        {
            await AddPhoto(isVisible: false, order: 1);

            var result = await _service.GetVisiblePhotosAsync();

            Assert.Empty(result);
        }

        // ─── GetAllPhotosAsync ───────────────────────────────────────────────────────

        [Fact]
        public async Task GetAllPhotos_ReturnsAllPhotos_VisibleAndHidden()
        {
            await AddPhoto(isVisible: true, order: 1);
            await AddPhoto(isVisible: false, order: 2);

            var result = await _service.GetAllPhotosAsync();

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetAllPhotos_ReturnsOrderedByOrder()
        {
            await AddPhoto(isVisible: false, order: 5);
            await AddPhoto(isVisible: true, order: 1);

            var result = await _service.GetAllPhotosAsync();

            Assert.Equal(1, result[0].Order);
            Assert.Equal(5, result[1].Order);
        }

        // ─── UploadPhotoAsync — validations (avant l'appel Supabase) ─────────────────

        [Fact]
        public async Task UploadPhoto_ThrowsInvalidOperation_WhenContentTypeUnsupported()
        {
            var file = BuildFormFile("image/gif");

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.UploadPhotoAsync(file.Object, "Titre", 0)
            );
        }

        [Fact]
        public async Task UploadPhoto_ThrowsInvalidOperation_WhenFileTooLarge()
        {
            var sixMb = 6L * 1024 * 1024;
            var file = BuildFormFile("image/jpeg", sixMb);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.UploadPhotoAsync(file.Object, "Titre", 0)
            );
        }

        [Theory]
        [InlineData("image/jpeg")]
        [InlineData("image/png")]
        [InlineData("image/webp")]
        public async Task UploadPhoto_PassesValidation_ForSupportedContentTypes(string contentType)
        {
            var file = BuildFormFile(contentType);

            // Passe la validation et crash sur Supabase null → pas une InvalidOperationException
            var ex = await Record.ExceptionAsync(
                () => _service.UploadPhotoAsync(file.Object, "Titre", 0)
            );

            Assert.IsNotType<InvalidOperationException>(ex);
        }

        // ─── DeletePhotoAsync ────────────────────────────────────────────────────────

        [Fact]
        public async Task DeletePhoto_ThrowsKeyNotFound_WhenPhotoDoesNotExist()
        {
            await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _service.DeletePhotoAsync(9999)
            );
        }

        // ─── UpdatePhotoAsync ────────────────────────────────────────────────────────

        [Fact]
        public async Task UpdatePhoto_ThrowsKeyNotFound_WhenPhotoDoesNotExist()
        {
            await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _service.UpdatePhotoAsync(9999, true, 1, "Titre")
            );
        }

        [Fact]
        public async Task UpdatePhoto_UpdatesFields_WhenPhotoExists()
        {
            var photo = await AddPhoto(isVisible: true, order: 1, title: "Ancien titre");

            await _service.UpdatePhotoAsync(photo.Id, isVisible: false, order: 5, title: "Nouveau titre");

            var updated = await _context.PortfolioPhotos.FindAsync(photo.Id);
            Assert.NotNull(updated);
            Assert.False(updated.IsVisible);
            Assert.Equal(5, updated.Order);
            Assert.Equal("Nouveau titre", updated.Title);
        }

        [Fact]
        public async Task UpdatePhoto_AcceptsNullTitle()
        {
            var photo = await AddPhoto(isVisible: true, order: 1, title: "Titre");

            await _service.UpdatePhotoAsync(photo.Id, isVisible: true, order: 1, title: null);

            var updated = await _context.PortfolioPhotos.FindAsync(photo.Id);
            Assert.Null(updated!.Title);
        }
    }
}
