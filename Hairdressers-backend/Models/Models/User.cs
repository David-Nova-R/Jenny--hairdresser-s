using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Models.Models
{
    public class User
    {
        public int Id { get; set; }

        // Le GUID qui vient de Supabase Auth
        [Required]
        public string SupabaseUserId { get; set; } = string.Empty;

        [MaxLength(100)]
        [Required(ErrorMessage = "Le prénom est requis")]
        public string FirstName { get; set; } = string.Empty;

        [MaxLength(100)]
        [Required(ErrorMessage = "Le nom est requis")]
        public string LastName { get; set; } = string.Empty;

        [Phone]
        [RegularExpression(@"^\d{3}-\d{3}-\d{4}$", ErrorMessage = "Format requis: XXX-XXX-XXXX")]
        public string? PhoneNumber { get; set; }

        // Navigation
        [JsonIgnore]
        public virtual List<Appointment> Appointments { get; set; } = new();
    }
}
