using System;
using System.ComponentModel.DataAnnotations;

namespace Models.Models
{
    public class PortfolioPhoto
    {
        public int Id { get; set; }

        [Required]
        public string PhotoUrl { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Title { get; set; }

        public int Order { get; set; } = 0;
        public bool IsVisible { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
