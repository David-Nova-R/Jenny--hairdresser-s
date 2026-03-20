using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Models.Models
{
    public class HairStyle
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public int DurationMinutes { get; set; }
        public int DurationMaxMinutes { get; set; } 
        public string? PhotoUrl { get; set; }

        [JsonIgnore]
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
