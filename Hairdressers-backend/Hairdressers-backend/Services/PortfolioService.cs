using Hairdressers_backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Supabase;

namespace Hairdressers_backend.Services
{
    public class PortfolioService : IPortfolioService
    {
        private readonly AppDbContext _context;
        private readonly Client _supabase;
        private const string BucketName = "portfolio";

        public PortfolioService(AppDbContext context, Client supabase)
        {
            _context = context;
            _supabase = supabase;
        }

        public async Task<List<PortfolioPhoto>> GetVisiblePhotosAsync()
        {
            return await _context.PortfolioPhotos
                .Where(p => p.IsVisible)
                .OrderBy(p => p.Order)
                .ToListAsync();
        }

        public async Task<List<PortfolioPhoto>> GetAllPhotosAsync()
        {
            return await _context.PortfolioPhotos
                .OrderBy(p => p.Order)
                .ToListAsync();
        }

        public async Task<PortfolioPhoto> UploadPhotoAsync(IFormFile photo, string? title, int order)
        {
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(photo.ContentType))
                throw new InvalidOperationException("Format non supporté. Utilisez JPG, PNG ou WEBP.");

            if (photo.Length > 5 * 1024 * 1024)
                throw new InvalidOperationException("L'image ne doit pas dépasser 5MB.");

            using var memoryStream = new MemoryStream();
            await photo.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(photo.FileName)}";

            await _supabase.Storage
                .From(BucketName)
                .Upload(fileBytes, fileName, new Supabase.Storage.FileOptions
                {
                    ContentType = photo.ContentType,
                    Upsert = false
                });

            var publicUrl = _supabase.Storage
                .From(BucketName)
                .GetPublicUrl(fileName);

            var portfolioPhoto = new PortfolioPhoto
            {
                PhotoUrl = publicUrl,
                Title = title,
                Order = order,
                IsVisible = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.PortfolioPhotos.Add(portfolioPhoto);
            await _context.SaveChangesAsync();

            return portfolioPhoto;
        }

        public async Task DeletePhotoAsync(int photoId)
        {
            var photo = await _context.PortfolioPhotos
                .FirstOrDefaultAsync(p => p.Id == photoId)
                ?? throw new KeyNotFoundException("Photo introuvable.");

            var marker = $"/object/public/{BucketName}/";
            var markerIndex = photo.PhotoUrl.IndexOf(marker);
            if (markerIndex != -1)
            {
                var fileName = photo.PhotoUrl[(markerIndex + marker.Length)..];
                await _supabase.Storage
                    .From(BucketName)
                    .Remove(new List<string> { fileName });
            }

            _context.PortfolioPhotos.Remove(photo);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePhotoAsync(int photoId, bool isVisible, int order, string? title)
        {
            var photo = await _context.PortfolioPhotos
                .FirstOrDefaultAsync(p => p.Id == photoId)
                ?? throw new KeyNotFoundException("Photo introuvable.");

            photo.IsVisible = isVisible;
            photo.Order = order;
            photo.Title = title;

            await _context.SaveChangesAsync();
        }
    }
}
