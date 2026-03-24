namespace Hairdressers_backend.Dtos.AppointmentResponseDTO
{
    public class AvailableDayWithSlotsDTO
    {
        public DateTime Day { get; set; }
        public List<string> AvailableSlots { get; set; } = new();
    }

}
