using Hairdressers_backend.Data;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using System.Security.Claims;

namespace Hairdressers_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class HairStylesController : ControllerBase
    {
        private readonly IHairStyleService _hairStyleService;

        public HairStylesController(IHairStyleService hairStyleService)
        {
            _hairStyleService = hairStyleService;
        }

        [HttpGet]
        public async Task<ActionResult> GetHairStyles()
        {
            var hairStyles = await _hairStyleService.GetHairStylesAsync();
            return Ok(hairStyles);
        }
        [Authorize]
        [HttpPost("{hairStyleId}")]
        public async Task<ActionResult> UploadPhoto(int hairStyleId, IFormFile photo)
        {
            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (supabaseUserId == null)
                return Unauthorized(new { Message = "Utilisateur non authentifié." });

            var user = await _hairStyleService.GetUserBySupabaseIdAsync(supabaseUserId);
            if (user == null)
                return NotFound(new { Message = "Utilisateur introuvable." });

            if (!user.IsAdmin)
                return StatusCode(403, new { Message = "Accès refusé." });

            try
            {
                var url = await _hairStyleService.UploadPhotoAsync(hairStyleId, photo);
                return Ok(new { Message = "Photo uploadée avec succès.", Url = url });
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
        [HttpDelete("{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (supabaseUserId == null)
                return Unauthorized(new { Message = "Utilisateur non authentifié." });

            var user = await _hairStyleService.GetUserBySupabaseIdAsync(supabaseUserId);
            if (user == null)
                return NotFound(new { Message = "Utilisateur introuvable." });

            if (!user.IsAdmin)
                return StatusCode(403, new { Message = "Accès refusé." });

            try
            {
                await _hairStyleService.DeletePhotoAsync(photoId);
                return Ok(new { Message = "Photo supprimée avec succès." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        [HttpGet("{hairStyleId}")]
        public async Task<ActionResult> GetPhotos(int hairStyleId)
        {
            try
            {
                var photos = await _hairStyleService.GetPhotosByHairStyleAsync(hairStyleId);
                return Ok(photos);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }
    }
}