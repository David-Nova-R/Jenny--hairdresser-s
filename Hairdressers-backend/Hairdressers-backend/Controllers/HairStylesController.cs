using Hairdressers_backend.Data;
using Hairdressers_backend.Dtos;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using System.Security.Claims;
using System.Text.Json;

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

        [HttpGet]
        public async Task<ActionResult> GetHairStyles()
        {
            var hairStyles = await _hairStyleService.GetHairStylesAsync();
            return Ok(hairStyles);
        }
        [Authorize]
        [HttpPost("{hairStyleId}")]
        public async Task<ActionResult> UploadPhoto(int hairStyleId, [FromForm] UploadHairstylePhotoRequest dto)
        {
            if (!IsAdmin())
                return Forbid();

            try
            {
                var url = await _hairStyleService.UploadPhotoAsync(hairStyleId, dto.Photo);
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
            if (!IsAdmin())
                return Forbid();

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