using Hairdressers_backend.Dtos;
using Hairdressers_backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Supabase;

namespace Hairdressers_backend.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;
        private readonly Client _supabase;

        public ReviewService(AppDbContext context, Client supabase)
        {
            _context = context;
            _supabase = supabase;
        }

        public async Task PostReviewAsync(string supabaseUserId, ReviewDTO dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.SupabaseUserId == supabaseUserId)
                ?? throw new KeyNotFoundException("Utilisateur introuvable.");

            if (string.IsNullOrWhiteSpace(dto.Text))
                throw new InvalidOperationException("Le texte de l'avis est requis.");

            if (dto.Stars < 1 || dto.Stars > 10)
                throw new InvalidOperationException("Le nombre d'étoiles doit être entre 1 et 10.");

            var review = new Review
            {
                Text = dto.Text.Trim(),
                Stars = dto.Stars,
                IsVisible = false,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow.AddHours(-4)
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
        }

        public async Task PutVisibilityReviewAsync(int reviewId)
        {
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.Id == reviewId)
                ?? throw new KeyNotFoundException("Avis introuvable.");

            review.IsVisible = !review.IsVisible;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteReviewAsync(int reviewId, string supabaseUserId, bool isAdmin)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == reviewId)
                ?? throw new KeyNotFoundException("Avis introuvable.");

            var isOwner = review.User?.SupabaseUserId == supabaseUserId;

            if (!isAdmin && !isOwner)
                throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à supprimer cet avis.");

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ReviewDisplayDTO>> GetVisibleReviewsAsync()
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.IsVisible)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDisplayDTO
                {
                    AuthorName = r.User != null
                        ? (r.User.FirstName + " " + r.User.LastName).Trim()
                        : null,
                    Text = r.Text,
                    Stars = r.Stars,
                    CreatedAt = r.CreatedAt
                }).ToListAsync();
        }

        public async Task<List<AdminReviewDTO>> GetAllReviewsAsync()
        {
            return await _context.Reviews
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new AdminReviewDTO
                {
                    Id = r.Id,
                    AuthorName = r.User != null
                        ? (r.User.FirstName + " " + r.User.LastName).Trim()
                        : null,
                    Text = r.Text,
                    Stars = r.Stars,
                    IsVisible = r.IsVisible,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }
    }
}
