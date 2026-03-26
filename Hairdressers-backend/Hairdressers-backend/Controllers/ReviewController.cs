using Hairdressers_backend.Dtos;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace Hairdressers_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        private bool IsAdmin()
        {
            var appMetadata = User.FindFirst("app_metadata")?.Value;

            if (string.IsNullOrEmpty(appMetadata))
                return false;

            try
            {
                var json = JsonDocument.Parse(appMetadata);

                if (json.RootElement.TryGetProperty("isAdmin", out var isAdminProp))
                    return isAdminProp.GetBoolean();
            }
            catch
            {
                return false;
            }

            return false;
        }

        private string? GetSupabaseUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value;
        }

        [HttpGet]
        public async Task<ActionResult> GetVisibleReviews()
        {
            var reviews = await _reviewService.GetVisibleReviewsAsync();
            return Ok(reviews);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> PostReview([FromBody] ReviewDTO dto)
        {
            var supabaseUserId = GetSupabaseUserId();
            if (string.IsNullOrEmpty(supabaseUserId))
                return Unauthorized();

            try
            {
                await _reviewService.PostReviewAsync(supabaseUserId, dto);
                return Ok(new { Message = "Avis ajouté avec succès." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("{reviewId}")]
        public async Task<ActionResult> PutVisibilityReview(int reviewId)
        {
            if (!IsAdmin())
                return Forbid();

            try
            {
                await _reviewService.PutVisibilityReviewAsync(reviewId);
                return Ok(new { Message = "Visibilité de l'avis mise à jour." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("{reviewId}")]
        public async Task<ActionResult> DeleteReview(int reviewId)
        {
            var supabaseUserId = GetSupabaseUserId();
            if (string.IsNullOrEmpty(supabaseUserId))
                return Unauthorized();

            try
            {
                await _reviewService.DeleteReviewAsync(reviewId, supabaseUserId, IsAdmin());
                return Ok(new { Message = "Avis supprimé avec succès." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetAllReviews()
        {
            if (!IsAdmin())
                return Forbid();

            var reviews = await _reviewService.GetAllReviewsAsync();
            return Ok(reviews);
        }
    }
}