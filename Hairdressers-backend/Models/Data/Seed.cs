using Models.Models;

namespace Hairdressers_backend.Data
{
    public static class Seed
    {
        public static Service[] SeedServices()
        {
            return new Service[]
            {
                new Service
                {
                    Id = 1,
                    Name = "Coupe homme",
                    Description = "Coupe classique pour homme",
                    Price = 25.00m,
                    DurationMinutes = 30,
                    PhotoUrl = null
                },
                new Service
                {
                    Id = 2,
                    Name = "Coupe femme",
                    Description = "Coupe et brushing pour femme",
                    Price = 45.00m,
                    DurationMinutes = 60,
                    PhotoUrl = null
                },
                new Service
                {
                    Id = 3,
                    Name = "Coloration",
                    Description = "Coloration complète",
                    Price = 80.00m,
                    DurationMinutes = 120,
                    PhotoUrl = null
                },
                new Service
                {
                    Id = 4,
                    Name = "Barbe",
                    Description = "Taille et soin de la barbe",
                    Price = 15.00m,
                    DurationMinutes = 20,
                    PhotoUrl = null
                }
            };
        }

        public static User[] SeedUsers()
        {
            return new User[]
            {
                new User
                {
                    Id = 1,
                    SupabaseUserId = "11111111-1111-1111-1111-111111111111",
                    FirstName = "Jean",
                    LastName = "Tremblay",
                    PhoneNumber = "514-123-4567"
                },
                new User
                {
                    Id = 2,
                    SupabaseUserId = "22222222-2222-2222-2222-222222222222",
                    FirstName = "Marie",
                    LastName = "Dupont",
                    PhoneNumber = "438-987-6543"
                },
                new User
                {
                    Id = 3,
                    SupabaseUserId = "33333333-3333-3333-3333-333333333333",
                    FirstName = "Luc",
                    LastName = "Bernard",
                    PhoneNumber = "450-555-1234"
                }
            };
        }

        public static Appointment[] SeedAppointments()
        {
            return new Appointment[]
            {
                new Appointment
                {
                    Id = 1,
                    UserId = 1,
                    ServiceId = 1,
                    AppointmentDate = new DateTime(2025, 3, 10, 10, 0, 0, DateTimeKind.Utc),
                    Status = AppointmentStatus.Confirmed
                },
                new Appointment
                {
                    Id = 2,
                    UserId = 2,
                    ServiceId = 3,
                    AppointmentDate = new DateTime(2025, 3, 11, 14, 0, 0, DateTimeKind.Utc),
                    Status = AppointmentStatus.Pending
                },
                new Appointment
                {
                    Id = 3,
                    UserId = 3,
                    ServiceId = 4,
                    AppointmentDate = new DateTime(2025, 3, 12, 9, 0, 0, DateTimeKind.Utc),
                    Status = AppointmentStatus.Pending
                }
            };
        }
    }
}