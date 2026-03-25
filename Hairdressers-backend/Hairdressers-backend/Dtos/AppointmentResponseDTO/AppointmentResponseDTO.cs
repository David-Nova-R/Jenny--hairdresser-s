using Models.Models;

namespace Hairdressers_backend.Dtos
{
    public class AppointmentResponseDTO
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? HairStyleId { get; set; }
        public string HairStyleName { get; set; } = string.Empty;
        public decimal PriceMin { get; set; }
        public decimal? PriceMax { get; set; }

        public AppointmentResponseDTO() { }

        public AppointmentResponseDTO(Appointment appointment)
        {
            Id = appointment.Id;
            AppointmentDate = appointment.AppointmentDate;
            Status = appointment.Status.ToString();

            HairStyleId = appointment.HairStyleId;

            // Si tu as une navigation HairStyle
            HairStyleName = appointment.HairStyle?.Name ?? string.Empty;
            PriceMin = appointment.HairStyle?.PriceMin ?? 0;
            PriceMax = appointment.HairStyle?.PriceMax;
        }
    }
}
