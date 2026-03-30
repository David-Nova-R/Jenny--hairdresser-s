using Models.Models;

namespace Hairdressers_backend.Data
{
    public static class Seed
    {
        public static Role[] SeedRoles()
        {
            return new Role[]
            {
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "Styliste" },
                new Role { Id = 3, Name = "Client" },
            };
        }

        public static HairStyle[] SeedServices()
        {
            return new HairStyle[]
            {
                new HairStyle { Id = 1, Name = "Tinte permanente", PriceMin = 35, PriceMax = 90, DurationMinutes = 60, DurationMaxMinutes = 120 },
                new HairStyle { Id = 2, Name = "Tinte demipermanente", PriceMin = 35, PriceMax = 50, DurationMinutes = 60, DurationMaxMinutes = 120 },
                new HairStyle { Id = 3, Name = "Baño de color", PriceMin = 35, PriceMax = null, DurationMinutes = 240, DurationMaxMinutes = 360 },
                new HairStyle { Id = 4, Name = "Técnicas de mechas y efectos de luz", PriceMin = 140, PriceMax = 230, DurationMinutes = 240, DurationMaxMinutes = 360 },
                new HairStyle { Id = 5, Name = "Balayage", PriceMin = 150, PriceMax = 250, DurationMinutes = 240, DurationMaxMinutes = 360 },
                new HairStyle { Id = 6, Name = "Baby Lights", PriceMin = 150, PriceMax = 250, DurationMinutes = 240, DurationMaxMinutes = 360 },
                new HairStyle { Id = 7, Name = "Ombré", PriceMin = 150, PriceMax = 230, DurationMinutes = 240, DurationMaxMinutes = 360 },
                new HairStyle { Id = 8, Name = "Californianas", PriceMin = 100, PriceMax = 200, DurationMinutes = 240, DurationMaxMinutes = 360 },
                new HairStyle { Id = 9, Name = "Cortes dama", PriceMin = 20, PriceMax = null, DurationMinutes = 60, DurationMaxMinutes = 60 },
                new HairStyle { Id = 10, Name = "Permanente hombres", PriceMin = 100, PriceMax = null, DurationMinutes = 180, DurationMaxMinutes = 60 },
                new HairStyle { Id = 11, Name = "Aminoácido", PriceMin = 150, PriceMax = 300, DurationMinutes = 240, DurationMaxMinutes = 420 },
                new HairStyle { Id = 12, Name = "Terapia capilar", PriceMin = 120, PriceMax = 200, DurationMinutes = 180, DurationMaxMinutes = 240 },
                new HairStyle { Id = 13, Name = "Cepillados", PriceMin = 30, PriceMax = 50, DurationMinutes = 60, DurationMaxMinutes = 120 },
                new HairStyle { Id = 14, Name = "Peinados", PriceMin = 35, PriceMax = 70, DurationMinutes = 60, DurationMaxMinutes = 180 },
                new HairStyle { Id = 15, Name = "Keratina", PriceMin = 140, PriceMax = 250, DurationMinutes = 300, DurationMaxMinutes = 420 },
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
                    PhoneNumber = "514-123-4567",
                    RoleId = 3
                },
                new User
                {
                    Id = 2,
                    SupabaseUserId = "22222222-2222-2222-2222-222222222222",
                    FirstName = "Marie",
                    LastName = "Dupont",
                    PhoneNumber = "438-987-6543",
                    RoleId = 3
                },
                new User
                {
                    Id = 3,
                    SupabaseUserId = "33333333-3333-3333-3333-333333333333",
                    FirstName = "Luc",
                    LastName = "Bernard",
                    PhoneNumber = "450-555-1234",
                    RoleId = 3
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
                    HairStyleId = 1,
                    AppointmentDate = new DateTime(2025, 3, 10, 10, 0, 0, DateTimeKind.Unspecified),
                    Status = AppointmentStatus.Confirmed
                },
                new Appointment
                {
                    Id = 2,
                    UserId = 2,
                    HairStyleId = 3,
                    AppointmentDate = new DateTime(2025, 3, 11, 14, 0, 0, DateTimeKind.Unspecified),
                    Status = AppointmentStatus.Pending
                },
                new Appointment
                {
                    Id = 3,
                    UserId = 3,
                    HairStyleId = 4,
                    AppointmentDate = new DateTime(2025, 3, 12, 9, 0, 0, DateTimeKind.Unspecified),
                    Status = AppointmentStatus.Pending
                }
            };
        }

        public static Review[] SeedReviews()
        {
            return new Review[]
            {
        new Review
        {
            Id = 1,
            UserId = 1,
            Text = "Excellent service, très professionnelle.",
            Stars = 5,
            IsVisible = true,
            CreatedAt = DateTime.UtcNow.AddDays(-10)
        },
        new Review
        {
            Id = 2,
            UserId = 2,
            Text = "Très bon résultat, je recommande !",
            Stars = 5,
            IsVisible = true,
            CreatedAt = DateTime.UtcNow.AddDays(-8)
        },
        new Review
        {
            Id = 3,
            UserId = 3,
            Text = "Service rapide et efficace.",
            Stars = 4,
            IsVisible = true,
            CreatedAt = DateTime.UtcNow.AddDays(-5)
        },
        new Review
        {
            Id = 4,
            UserId = 1,
            Text = "Bonne expérience globale.",
            Stars = 4,
            IsVisible = false,
            CreatedAt = DateTime.UtcNow.AddDays(-3)
        },
        new Review
        {
            Id = 5,
            UserId = 2,
            Text = "Je reviendrai sûrement !",
            Stars = 5,
            IsVisible = true,
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        }
            };
        }
    }
}