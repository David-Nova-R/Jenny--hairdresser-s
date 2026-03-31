using Hairdressers_backend.Dtos;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using System.Security.Claims;

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
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = ex.Message, Type = ex.GetType().Name });
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
            if (dto.PageNumber < 1)
                dto.PageNumber = 1;

            const int pageSize = 10;

            var result = await _appointmentService.GetAllAppointmentsAsync(
                dto.PageNumber,
                pageSize,
                dto.SearchQuery,
                dto.Status,
                dto.DateFrom,
                dto.DateTo
            );

            return Ok(result);
        }

        [Authorize]
        [HttpGet("{appointmentId}")]
        public async Task<IActionResult> GetAppointmentById(int appointmentId)
        {
            var appointment = await _appointmentService.GetAppointmentByIdAsync(appointmentId);

            if (appointment == null)
                return NotFound(new { Message = "Rendez-vous introuvable." });

            return Ok(appointment);
        }

        [Authorize]
        [HttpPut("{appointmentId}")]
        public async Task<IActionResult> UpdateStyleNotes(int appointmentId, [FromBody] UpdateStyleNotesDTO dto)
        {
            try
            {
                await _appointmentService.UpdateStyleNotesAsync(appointmentId, dto.StyleNotes);
                return Ok(new { Message = "Notes mises à jour avec succès." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetAdminCalendarAppointments([FromBody] GetAdminCalendarAppointmentsDTO dto)
        {
            var result = await _appointmentService.GetAdminCalendarAppointmentsAsync(dto.WeekStart);

            return Ok(result);
        }

    }
}