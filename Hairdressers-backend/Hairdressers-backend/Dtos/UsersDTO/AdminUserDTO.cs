namespace Hairdressers_backend.Dtos
{
    public class AdminUserDTO
    {
        public int Id { get; set; }
        public string SupabaseUserId { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? RoleName { get; set; }
        public List<AdminUserAppointmentDTO> Appointments { get; set; } = new();
    }

    public class AdminUserAppointmentDTO
    {
        public int Id { get; set; }
        public string AppointmentDate { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? HairStyleName { get; set; }
        public decimal PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public string? StyleNotes { get; set; }
    }
}
