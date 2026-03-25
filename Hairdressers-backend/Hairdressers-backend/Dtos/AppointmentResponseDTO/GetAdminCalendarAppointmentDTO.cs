namespace Hairdressers_backend.Dtos
{
    public class GetAdminCalendarAppointmentsDTO
    {
        public DateTime WeekStart { get; set; }
    }

    public class AdminCalendarAppointmentDTO
    {
        public int Id { get; set; }
        public string AppointmentDate { get; set; } = null!; public int Status { get; set; }
        public string? HairStyleName { get; set; }
        public string? UserName { get; set; }
        public decimal PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public string? Notes { get; set; }
        public int? ExternalDurationMinutes { get; set; }
    }
}