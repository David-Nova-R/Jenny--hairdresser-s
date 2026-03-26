using Hairdressers_backend.Dtos;
using Hairdressers_backend.Dtos;

namespace Hairdressers_backend.Interfaces
{
    public interface IReviewService
    {
        Task PostReviewAsync(string supabaseUserId, ReviewDTO dto);
        Task PutVisibilityReviewAsync(int reviewId);
        Task DeleteReviewAsync(int reviewId, string supabaseUserId, bool isAdmin);
        Task<List<ReviewDisplayDTO>> GetVisibleReviewsAsync();
        Task<List<AdminReviewDTO>> GetAllReviewsAsync();
    }
}
