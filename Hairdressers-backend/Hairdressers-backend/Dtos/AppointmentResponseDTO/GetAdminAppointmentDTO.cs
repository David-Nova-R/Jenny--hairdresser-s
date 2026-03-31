namespace Hairdressers_backend.Dtos
{
    public class GetAdminAppointmentDTO
    {
        public int PageNumber { get; set; } = 1;
        public string? SearchQuery { get; set; }
        public int? Status { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
