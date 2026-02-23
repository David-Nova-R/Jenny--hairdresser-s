using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Models
{
    public enum AppointmentStatus
    {
        Pending,
        Confirmed,
        Cancelled,
        Completed
    }

    public class Appointment
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

        // Clés étrangères
        public int UserId { get; set; }
        public int ServiceId { get; set; }

        // Navigation
        public User User { get; set; } = null!;
        public Service Service { get; set; } = null!;
    }
}
