using System;
using System.ComponentModel.DataAnnotations;

namespace Models.Models
{
    public class DayOff
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        [MaxLength(200)]
        public string? Reason { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
