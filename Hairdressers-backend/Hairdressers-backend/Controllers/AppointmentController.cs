using Hairdressers_backend.Dtos;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using System.Security.Claims;
using System.Text.Json;

namespace Hairdressers_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
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

        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetUserAppointments()
        {
            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (supabaseUserId == null)
                return Unauthorized(new { Message = "Utilisateur non authentifié." });

            var user = await _appointmentService.GetUserBySupabaseIdAsync(supabaseUserId);
            if (user == null)
                return NotFound(new { Message = "Utilisateur introuvable." });

            var appointments = await _appointmentService.GetUserAppointmentsAsync(user.Id);

            if (!appointments.Any())
                return Ok(new { Message = "Aucun rendez-vous trouvé.", Data = new List<AppointmentResponseDTO>() });

            return Ok(appointments);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetPendingAppointments()
        {
            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (supabaseUserId == null)
                return Unauthorized(new { Message = "Utilisateur non authentifié." });

            var user = await _appointmentService.GetUserBySupabaseIdAsync(supabaseUserId);
            if (user == null)
                return NotFound(new { Message = "Utilisateur introuvable." });

            if (!user.IsAdmin)
                return StatusCode(403, new { Message = "Accès refusé." });

            var appointments = await _appointmentService.GetPendingAppointmentsAsync();

            if (!appointments.Any())
                return Ok(new { Message = "Aucun rendez-vous en attente.", Data = new List<PendingAppointmentDTO>() });

            return Ok(appointments);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> PostAppointment([FromBody] AppointmentDTO dto)
        {
            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (supabaseUserId == null)
                return Unauthorized(new { Message = "Utilisateur non authentifié." });

            var user = await _appointmentService.GetUserBySupabaseIdAsync(supabaseUserId);
            if (user == null)
                return NotFound(new { Message = "Utilisateur introuvable." });

            try
            {
                var appointment = await _appointmentService.CreateAppointmentAsync(user.Id, dto.HairStyleId, dto.AppointmentDate);
                return Ok(new
                {
                    AppointmentId = appointment.Id,
                    UserId = user.Id,
                    HairStyleId = dto.HairStyleId,
                    appointment.AppointmentDate,
                    appointment.Status
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("{appointmentId}")]
        public async Task<ActionResult> AcceptAppointment(int appointmentId)
        {
            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (supabaseUserId == null)
                return Unauthorized(new { Message = "Utilisateur non authentifié." });

            var user = await _appointmentService.GetUserBySupabaseIdAsync(supabaseUserId);
            if (user == null)
                return NotFound(new { Message = "Utilisateur introuvable." });

            if (!user.IsAdmin)
                return StatusCode(403, new { Message = "Accès refusé." });

            try
            {
                await _appointmentService.AcceptAppointmentAsync(appointmentId);
                return Ok(new { Message = "Rendez-vous accepté et ajouté au calendrier avec succès." });
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
        [HttpDelete("{appointmentId}")]
        public async Task<ActionResult> CancelAppointment(int appointmentId)
        {
            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (supabaseUserId == null)
                return Unauthorized(new { Message = "Utilisateur non authentifié." });

            var user = await _appointmentService.GetUserBySupabaseIdAsync(supabaseUserId);
            if (user == null)
                return NotFound(new { Message = "Utilisateur introuvable." });

            try
            {
                var appointment = await _appointmentService.GetAppointmentByIdAsync(appointmentId);
                if (appointment == null)
                    return NotFound(new { Message = "Rendez-vous introuvable." });

                if (appointment.UserId != user.Id)
                    return StatusCode(403, new { Message = "Vous n'êtes pas autorisé à annuler ce rendez-vous." });

                if (appointment.Status == AppointmentStatus.Cancelled)
                    return BadRequest(new { Message = "Ce rendez-vous est déjà annulé." });

                if (appointment.Status == AppointmentStatus.Completed)
                    return BadRequest(new { Message = "Impossible d'annuler un rendez-vous déjà complété." });

                await _appointmentService.CancelAppointmentAsync(appointmentId);
                return Ok(new { Message = "Rendez-vous annulé avec succès." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<List<AvailableDayWithSlotsDTO>>> GetAvailableMonth([FromBody] AvailableMonthDTO dto)
        {
            try
            {
                var result = await _appointmentService.GetAvailableMonthAsync(dto.ServiceId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<AppointmentResponseDTO>?>> GetMyAppointmentHistoric()
        {
            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (supabaseUserId == null)
                return Unauthorized(new { Message = "Utilisateur non authentifié." });

            var user = await _appointmentService.GetUserBySupabaseIdAsync(supabaseUserId);
            if (user == null)
                return NotFound(new { Message = "Utilisateur introuvable." });

            try
            {
                var result = await _appointmentService.GetMyAppointmentsAsync(user.Id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> PutAppointmentStatus([FromBody] UpdateStatusDTO dto)
        {
            if (!IsAdmin())
                return Forbid();

            try
            {
                var updated = await _appointmentService.UpdateAppointmentStatusAsync(dto.AppointmentId, dto.Status);

                if (!updated)
                    return NotFound(new { message = "Appointment not found" });

                return Ok(new { message = "Status updated" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetAllAppointments([FromBody] GetAdminAppointmentDTO dto)
        {
            if (!IsAdmin())
                return Forbid();

            if (dto.PageNumber < 1)
                dto.PageNumber = 1;

            const int pageSize = 10;

            var result = await _appointmentService.GetAllAppointmentsAsync(dto.PageNumber, pageSize);

            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetAdminCalendarAppointments([FromBody] GetAdminCalendarAppointmentsDTO dto)
        {
            if (!IsAdmin())
                return Forbid();

            var result = await _appointmentService.GetAdminCalendarAppointmentsAsync(dto.WeekStart);

            return Ok(result);
        }
    }
}