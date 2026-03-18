using Hairdressers_backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Supabase;

namespace Hairdressers_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {

        private readonly AppDbContext _context;
        private readonly Client _supabase;

        public AppointmentController(AppDbContext context, Client supabase)
        {
            _context = context;
            _supabase = supabase;
        }

        [HttpPost]
        public async Task<ActionResult> PostAppointment([FromBody] AppointmentDTO dto)
        {

            var supabaseUserId = User.FindFirst("sub")?.Value;
            if (supabaseUserId == null)
                return Unauthorized();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.SupabaseUserId == supabaseUserId);
            if (user == null)
                return NotFound();

            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.Id == dto.ServiceId);
            if (service == null)
                return BadRequest("Service inexistant.");

            var appointment = new Appointment
            {
                UserId = user.Id,
                ServiceId = service.Id,
                User = user,
                Service = service,
                AppointmentDate = dto.AppointmentDate,
                Status = AppointmentStatus.Pending
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                AppointmentId = appointment.Id,
                UserId = user.Id,
                ServiceId = service.Id,
                appointment.AppointmentDate,
                appointment.Status
            });
        }

        [HttpGet]
        public async Task<ActionResult<List<AvailableDayWithSlotsDTO>>> GetAvailableMonth([FromBody] AvailableMonthDTO dto)
        {
            var service = await _context.Services.FirstOrDefaultAsync(s => s.Id == dto.ServiceId);
            if (service == null)
                return BadRequest("Service inexistant.");

            var firstDay = new DateTime(dto.Year, dto.Month, 1);
            var lastDay = firstDay.AddMonths(1).AddDays(-1);

            var result = new List<AvailableDayWithSlotsDTO>();

            for (var date = firstDay; date <= lastDay; date = date.AddDays(1))
            {
                if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                    continue;

                var appointments = await _context.Appointments
                    .Where(a => a.ServiceId == dto.ServiceId && a.AppointmentDate.Date == date.Date)
                    .ToListAsync();

                var slots = new List<string>();

                for (int hour = 8; hour < 16; hour++)
                {
                    for (int minute = 0; minute < 60; minute += dto.AppointmentDurationInMinutes)
                    {
                        var slotStart = date.Date.AddHours(hour).AddMinutes(minute);
                        var slotEnd = slotStart.AddMinutes(dto.AppointmentDurationInMinutes);

                        bool isTaken = appointments.Any(a =>
                            a.AppointmentDate < slotEnd &&
                            a.AppointmentDate.AddMinutes(dto.AppointmentDurationInMinutes) > slotStart
                        );

                        if (!isTaken)
                            slots.Add(slotStart.ToString("HH:mm"));
                    }
                }

                if (slots.Any())
                {
                    result.Add(new AvailableDayWithSlotsDTO
                    {
                        Day = date.Date,
                        AvailableSlots = slots
                    });
                }
            }

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Models.Models.Service>>> GetServices()
        {
            List<Service> services = await _context.Services.ToListAsync();
            return Ok(services);
        }
    }
}
