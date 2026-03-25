using Models.Models;

namespace Hairdressers_backend.Dtos
{
    public class HairStyleDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public int DurationMinutes { get; set; }
        public int? DurationMaxMinutes { get; set; }
        public List<string> PhotoUrls { get; set; } = new();

        public HairStyleDTO(HairStyle hairStyle)
        {
            Id = hairStyle.Id;
            Name = hairStyle.Name;
            Description = hairStyle.Description;
            PriceMin = hairStyle.PriceMin;
            PriceMax = hairStyle.PriceMax;
            DurationMinutes = hairStyle.DurationMinutes;
            DurationMaxMinutes = hairStyle.DurationMaxMinutes;
            PhotoUrls = hairStyle.Photos.Select(p => p.PhotoUrl).ToList();
        }
    }
}
