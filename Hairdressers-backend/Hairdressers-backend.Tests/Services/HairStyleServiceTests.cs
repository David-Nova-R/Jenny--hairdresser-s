using Hairdressers_backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Moq;
using Xunit;

namespace Hairdressers_backend.Tests.Services
{
    public class HairStyleServiceTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly HairStyleService _service;

        public HairStyleServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _context.Database.EnsureCreated(); // seed: 15 HairStyles, 3 Users

            // Supabase.Client est null → valide pour les tests qui n'atteignent pas le storage
            _service = new HairStyleService(_context, null!);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        // ─── Helpers ────────────────────────────────────────────────────────────────

        private static Mock<IFormFile> BuildFormFile(string contentType, long sizeBytes)
        {
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.ContentType).Returns(contentType);
            fileMock.Setup(f => f.Length).Returns(sizeBytes);
            fileMock.Setup(f => f.FileName).Returns("photo.jpg");
            fileMock.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
                    .Returns(Task.CompletedTask);
            return fileMock;
        }

        // ─── GetHairStylesAsync ─────────────────────────────────────────────────────

        [Fact]
        public async Task GetHairStyles_ReturnsAllSeededStyles()
        {
            var result = await _service.GetHairStylesAsync();

            Assert.Equal(15, result.Count);
        }

        [Fact]
        public async Task GetHairStyles_ReturnsEmptyPhotos_WhenNoPhotosAdded()
        {
            var result = await _service.GetHairStylesAsync();

            Assert.All(result, hs => Assert.Empty(hs.Photos));
        }

        [Fact]
        public async Task GetHairStyles_ReturnsPhotos_WhenPhotosExist()
        {
            _context.HairStylePhotos.AddRange(
                new HairStylePhoto { HairStyleId = 1, PhotoUrl = "https://storage/photo1.jpg" },
                new HairStylePhoto { HairStyleId = 1, PhotoUrl = "https://storage/photo2.jpg" }
            );
            await _context.SaveChangesAsync();

            var result = await _service.GetHairStylesAsync();

            var corte = result.First(hs => hs.Id == 1);
            Assert.Equal(2, corte.Photos.Count);
            Assert.Contains(corte.Photos, p => p.PhotoUrl == "https://storage/photo1.jpg");
            Assert.Contains(corte.Photos, p => p.PhotoUrl == "https://storage/photo2.jpg");
        }

        [Fact]
        public async Task GetHairStyles_PhotosOnlyAttachedToCorrectStyle()
        {
            _context.HairStylePhotos.Add(
                new HairStylePhoto { HairStyleId = 2, PhotoUrl = "https://storage/photo-style2.jpg" }
            );
            await _context.SaveChangesAsync();

            var result = await _service.GetHairStylesAsync();

            var style1 = result.First(hs => hs.Id == 1);
            var style2 = result.First(hs => hs.Id == 2);

            Assert.Empty(style1.Photos);
            Assert.Single(style2.Photos);
            Assert.Equal("https://storage/photo-style2.jpg", style2.Photos[0].PhotoUrl);
        }

        // ─── GetUserBySupabaseIdAsync ───────────────────────────────────────────────

        [Fact]
        public async Task GetUserBySupabaseId_ReturnsUser_WhenExists()
        {
            var result = await _service.GetUserBySupabaseIdAsync("11111111-1111-1111-1111-111111111111");

            Assert.NotNull(result);
            Assert.Equal("Jean", result.FirstName);
        }

        [Fact]
        public async Task GetUserBySupabaseId_ReturnsNull_WhenNotFound()
        {
            var result = await _service.GetUserBySupabaseIdAsync("nonexistent-id");

            Assert.Null(result);
        }

        // ─── GetPhotosByHairStyleAsync ──────────────────────────────────────────────

        [Fact]
        public async Task GetPhotos_ReturnsPhotos_WhenStyleHasPhotos()
        {
            _context.HairStylePhotos.AddRange(
                new HairStylePhoto { HairStyleId = 3, PhotoUrl = "https://storage/a.jpg" },
                new HairStylePhoto { HairStyleId = 3, PhotoUrl = "https://storage/b.jpg" }
            );
            await _context.SaveChangesAsync();

            var result = await _service.GetPhotosByHairStyleAsync(3);

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetPhotos_ReturnsEmpty_WhenStyleHasNoPhotos()
        {
            var result = await _service.GetPhotosByHairStyleAsync(5);

            Assert.Empty(result);
        }

        [Fact]
        public async Task GetPhotos_ReturnsOnlyPhotosForRequestedStyle()
        {
            _context.HairStylePhotos.AddRange(
                new HairStylePhoto { HairStyleId = 4, PhotoUrl = "https://storage/style4.jpg" },
                new HairStylePhoto { HairStyleId = 5, PhotoUrl = "https://storage/style5.jpg" }
            );
            await _context.SaveChangesAsync();

            var result = await _service.GetPhotosByHairStyleAsync(4);

            Assert.Single(result);
            Assert.Equal("https://storage/style4.jpg", result[0].PhotoUrl);
        }

        // ─── UploadPhotoAsync — validations (avant l'appel Supabase) ───────────────

        [Fact]
        public async Task UploadPhoto_ThrowsKeyNotFound_WhenHairStyleDoesNotExist()
        {
            var file = BuildFormFile("image/jpeg", 1024);

            await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _service.UploadPhotoAsync(999, file.Object)
            );
        }

        [Fact]
        public async Task UploadPhoto_ThrowsInvalidOperation_WhenContentTypeUnsupported()
        {
            var file = BuildFormFile("image/gif", 1024);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.UploadPhotoAsync(1, file.Object)
            );
        }

        [Fact]
        public async Task UploadPhoto_ThrowsInvalidOperation_WhenFileTooLarge()
        {
            var sixMb = 6L * 1024 * 1024;
            var file = BuildFormFile("image/jpeg", sixMb);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.UploadPhotoAsync(1, file.Object)
            );
        }

        [Theory]
        [InlineData("image/jpeg")]
        [InlineData("image/png")]
        [InlineData("image/webp")]
        public async Task UploadPhoto_AcceptsValidContentTypes_UpToSupabaseCall(string contentType)
        {
            // Passe les validations et crash sur Supabase null → NullReferenceException
            // Ce test vérifie que les types valides ne sont pas rejetés par la validation
            var file = BuildFormFile(contentType, 1024);

            var ex = await Record.ExceptionAsync(
                () => _service.UploadPhotoAsync(1, file.Object)
            );

            Assert.IsNotType<InvalidOperationException>(ex);
        }

        // ─── DeletePhotoAsync — validation ─────────────────────────────────────────

        [Fact]
        public async Task DeletePhoto_ThrowsKeyNotFound_WhenPhotoDoesNotExist()
        {
            await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _service.DeletePhotoAsync(999)
            );
        }
    }
}
