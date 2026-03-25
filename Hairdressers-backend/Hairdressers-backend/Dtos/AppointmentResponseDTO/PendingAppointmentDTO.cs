namespace Hairdressers_backend.Dtos
{
    public class PendingAppointmentDTO
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public int HairStyleId { get; set; }
        public string HairStyleName { get; set; } = string.Empty;
        public decimal PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public string ClientFirstName { get; set; } = string.Empty;
        public string ClientLastName { get; set; } = string.Empty;
        public string? ClientPhone { get; set; }
    }
}
