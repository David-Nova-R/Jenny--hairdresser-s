using Hairdressers_backend.Dtos;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Supabase;
using System.Security.Claims;

namespace Hairdressers_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {

        private readonly AppDbContext _context;
        private readonly Client _supabase;
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(AppDbContext context, Client supabase,IAppointmentService appointmentService)
        {
            _context = context;
            _supabase = supabase;
            _appointmentService = appointmentService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetUserAppointments()
        {
            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (supabaseUserId == null)
                return Unauthorized(new { Message = "Utilisateur non authentifié." });

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.SupabaseUserId == supabaseUserId);
            if (user == null)
                return NotFound(new { Message = "Utilisateur introuvable." });

            var appointments = await _appointmentService.GetUserAppointmentsAsync(user.Id);

            if (!appointments.Any())
                return Ok(new { Message = "Aucun rendez-vous trouvé.", Data = new List<Appointment>() });

            return Ok(appointments);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> PostAppointment([FromBody] AppointmentDTO dto)
        {

            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (supabaseUserId == null)
                return Unauthorized();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.SupabaseUserId == supabaseUserId);
            if (user == null)
                return NotFound();

            var hairStyles = await _context.HairStyles
                .FirstOrDefaultAsync(s => s.Id == dto.HairStyleId);
            if (hairStyles == null)
                return BadRequest("Service inexistant.");

            var appointment = await _appointmentService.CreateAppointmentAsync(user.Id, hairStyles.Id,dto.AppointmentDate);

            return Ok(new
            {
                AppointmentId = appointment.Id,
                UserId = user.Id,
                ServiceId = hairStyles.Id,
                appointment.AppointmentDate,
                appointment.Status
            });
        }

        [Authorize]
        [HttpDelete("{appointmentId}")]
        public async Task<ActionResult> CancelAppointment(int appointmentId)
        {
            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (supabaseUserId == null)
                return Unauthorized(new { Message = "Utilisateur non authentifié." });

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.SupabaseUserId == supabaseUserId);
            if (user == null)
                return NotFound(new { Message = "Utilisateur introuvable." });

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId);
            if (appointment == null)
                return NotFound(new { Message = "Rendez-vous introuvable." });

            // Vérification que le rendez-vous appartient bien à l'utilisateur
            if (appointment.UserId != user.Id)
                return StatusCode(403, new { Message = "Vous n'êtes pas autorisé à annuler ce rendez-vous." });

            // Vérification que le rendez-vous n'est pas déjà annulé
            if (appointment.Status == AppointmentStatus.Cancelled)
                return BadRequest(new { Message = "Ce rendez-vous est déjà annulé." });

            // Vérification que le rendez-vous n'est pas déjà complété
            if (appointment.Status == AppointmentStatus.Completed)
                return BadRequest(new { Message = "Impossible d'annuler un rendez-vous déjà complété." });

            await _appointmentService.CancelAppointmentAsync(appointmentId);

            return Ok(new { Message = "Rendez-vous annulé avec succès." });
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HairStyle>>> GetHairStyles()
        {
            var hairStyles = await _context.HairStyles.Select(h => new HairStyleDTO(h)).ToListAsync();
            return Ok(hairStyles);
        }
    }
}
