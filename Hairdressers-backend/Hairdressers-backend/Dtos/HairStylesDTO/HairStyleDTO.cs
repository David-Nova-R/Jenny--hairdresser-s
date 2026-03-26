using Hairdressers_backend.Dtos.HairStylesDTO;
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
        public List<HairStylePhotoDTO> Photos { get; set; }

        public HairStyleDTO(HairStyle hairStyle)
        {
            Id = hairStyle.Id;
            Name = hairStyle.Name;
            Description = hairStyle.Description;
            PriceMin = hairStyle.PriceMin;
            PriceMax = hairStyle.PriceMax;
            DurationMinutes = hairStyle.DurationMinutes;
            DurationMaxMinutes = hairStyle.DurationMaxMinutes;
            Photos = hairStyle.Photos.Select(p => new HairStylePhotoDTO
            {
                Id = p.Id,
                HairStyleId = p.HairStyleId,
                PhotoUrl = p.PhotoUrl
            }).ToList();
        }
    }
}
