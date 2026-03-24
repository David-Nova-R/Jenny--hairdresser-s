using Models.Models;

namespace Hairdressers_backend.Dtos
{
    public class AdminAppointmentResponseDTO
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public AppointmentStatus Status { get; set; }

        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? HairStyleName { get; set; }
    }
}
