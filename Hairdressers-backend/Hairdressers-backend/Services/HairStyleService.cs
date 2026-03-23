using Hairdressers_backend.Dtos;
using Hairdressers_backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Supabase;

namespace Hairdressers_backend.Services
{
    public class HairStyleService : IHairStyleService
    {
        private readonly AppDbContext _context;
        private readonly Client _supabase;
        private const string BucketName = "hairstyle-photos";

        public HairStyleService(AppDbContext context, Client supabase)
        {
            _context = context;
            _supabase = supabase;
        }

        public async Task<User?> GetUserBySupabaseIdAsync(string supabaseUserId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.SupabaseUserId == supabaseUserId);
        }

        public async Task<List<HairStyleDTO>> GetHairStylesAsync()
        {
            return await _context.HairStyles
                .Select(h => new HairStyleDTO(h))
                .ToListAsync();
        }

        public async Task<string> UploadPhotoAsync(int hairStyleId, IFormFile photo)
        {
            var hairStyle = await _context.HairStyles
                .FirstOrDefaultAsync(h => h.Id == hairStyleId)
                ?? throw new KeyNotFoundException("Service introuvable.");

            // Validation
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(photo.ContentType))
                throw new InvalidOperationException("Format non supporté. Utilisez JPG, PNG ou WEBP.");

            if (photo.Length > 5 * 1024 * 1024)
                throw new InvalidOperationException("L'image ne doit pas dépasser 5MB.");

            // Convertir en bytes
            using var memoryStream = new MemoryStream();
            await photo.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();

            // Nom unique pour éviter les conflits
            var fileName = $"{hairStyleId}/{Guid.NewGuid()}{Path.GetExtension(photo.FileName)}";

            // Upload dans Supabase Storage
            await _supabase.Storage
                .From(BucketName)
                .Upload(fileBytes, fileName, new Supabase.Storage.FileOptions
                {
                    ContentType = photo.ContentType,
                    Upsert = false
                });

            // Récupérer l'URL publique
            var publicUrl = _supabase.Storage
                .From(BucketName)
                .GetPublicUrl(fileName);

            // Sauvegarder dans la BD
            var hairStylePhoto = new HairStylePhoto
            {
                HairStyleId = hairStyleId,
                PhotoUrl = publicUrl
            };

            _context.HairStylePhotos.Add(hairStylePhoto);
            await _context.SaveChangesAsync();

            return publicUrl;
        }

        public async Task DeletePhotoAsync(int photoId)
        {
            var photo = await _context.HairStylePhotos
                .FirstOrDefaultAsync(p => p.Id == photoId)
                ?? throw new KeyNotFoundException("Photo introuvable.");

            // Extraire le nom du fichier depuis l'URL
            var uri = new Uri(photo.PhotoUrl);
            var fileName = string.Join("/", uri.Segments.Skip(
                uri.Segments.ToList().IndexOf(BucketName + "/") + 1
            ));

            // Supprimer de Supabase Storage
            await _supabase.Storage
                .From(BucketName)
                .Remove(new List<string> { fileName });

            // Supprimer de la BD
            _context.HairStylePhotos.Remove(photo);
            await _context.SaveChangesAsync();
        }

        public async Task<List<HairStylePhoto>> GetPhotosByHairStyleAsync(int hairStyleId)
        {
            return await _context.HairStylePhotos
                .Where(p => p.HairStyleId == hairStyleId)
                .ToListAsync();
        }
    }
}
