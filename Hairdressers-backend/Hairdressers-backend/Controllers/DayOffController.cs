using Hairdressers_backend.Dtos.DayOffDTO;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hairdressers_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class DayOffController : ControllerBase
    {
        private readonly IDayOffService _dayOffService;

        public DayOffController(IDayOffService dayOffService)
        {
            _dayOffService = dayOffService;
        }

        [HttpGet]
        public async Task<ActionResult> GetDaysOff()
        {
            var daysOff = await _dayOffService.GetDaysOffAsync();
            return Ok(daysOff);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> AddDayOff([FromBody] AddDayOffDTO dto)
        {
            var dayOff = await _dayOffService.AddDayOffAsync(dto.Date, dto.Reason);
            return Ok(dayOff);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveDayOff(int id)
        {
            try
            {
                await _dayOffService.RemoveDayOffAsync(id);
                return Ok(new { Message = "Journée off supprimée avec succès." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }
    }
}
