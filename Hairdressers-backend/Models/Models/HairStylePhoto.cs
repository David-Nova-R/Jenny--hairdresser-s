using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Models.Models
{
    public class HairStylePhoto
    {
        public int Id { get; set; }
        public string PhotoUrl { get; set; } = string.Empty;
        public int HairStyleId { get; set; }

        [JsonIgnore]
        public virtual HairStyle HairStyle { get; set; } = null!;
    }
}
