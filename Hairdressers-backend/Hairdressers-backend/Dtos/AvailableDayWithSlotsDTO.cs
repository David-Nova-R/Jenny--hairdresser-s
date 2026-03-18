namespace Hairdressers_backend.Dtos
{
    public class AvailableDayWithSlotsDTO
    {
        public DateTime Day { get; set; }
        public List<string> AvailableSlots { get; set; } = new();
    }

}
