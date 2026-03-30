using Hairdressers_backend.Dtos.PortfolioDTO;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hairdressers_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class PortfolioController : ControllerBase
    {
        private readonly IPortfolioService _portfolioService;

        public PortfolioController(IPortfolioService portfolioService)
        {
            _portfolioService = portfolioService;
        }

        [HttpGet]
        public async Task<ActionResult> GetPortfolio()
        {
            var photos = await _portfolioService.GetVisiblePhotosAsync();
            return Ok(photos);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetAllPortfolioPhotos()
        {
            var photos = await _portfolioService.GetAllPhotosAsync();
            return Ok(photos);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> UploadPortfolioPhoto(IFormFile photo, [FromForm] string? title, [FromForm] int order = 0)
        {
            try
            {
                var result = await _portfolioService.UploadPhotoAsync(photo, title, order);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("{photoId}")]
        public async Task<ActionResult> DeletePortfolioPhoto(int photoId)
        {
            try
            {
                await _portfolioService.DeletePhotoAsync(photoId);
                return Ok(new { Message = "Photo supprimée avec succès." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("{photoId}")]
        public async Task<ActionResult> UpdatePortfolioPhoto(int photoId, [FromBody] UpdatePortfolioPhotoDTO dto)
        {
            try
            {
                await _portfolioService.UpdatePhotoAsync(photoId, dto.IsVisible, dto.Order, dto.Title);
                return Ok(new { Message = "Photo mise à jour avec succès." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }
    }
}
