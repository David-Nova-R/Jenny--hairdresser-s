using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models.Models
{
    public class Role
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [JsonIgnore]
        public virtual List<User> Users { get; set; } = new();
    }
}
