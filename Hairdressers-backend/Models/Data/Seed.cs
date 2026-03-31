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

        public static PortfolioPhoto[] SeedPortfolioPhotos()
        {
            return new PortfolioPhoto[]
            {
                new PortfolioPhoto { Id = 1, PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Keratina/20250312_183411.jpg", Title = "Keratina", Order = 1, IsVisible = true, CreatedAt = new DateTime(2025, 3, 12, 0, 0, 0, DateTimeKind.Utc) },
                new PortfolioPhoto { Id = 2, PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/20250531_161043.jpg", Title = "Peinados", Order = 2, IsVisible = true, CreatedAt = new DateTime(2025, 5, 31, 0, 0, 0, DateTimeKind.Utc) },
                new PortfolioPhoto { Id = 3, PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/20250531_161047.jpg", Title = "Peinados", Order = 3, IsVisible = true, CreatedAt = new DateTime(2025, 5, 31, 0, 0, 0, DateTimeKind.Utc) },
            };
        }

        public static HairStylePhoto[] SeedHairStylePhotos()
        {
            return new HairStylePhoto[]
            {
                new HairStylePhoto { Id = 1, HairStyleId = 11, PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Keratina/20250312_183411.jpg" },
                new HairStylePhoto { Id = 2, HairStyleId = 15, PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/20250531_161043.jpg" },
                new HairStylePhoto { Id = 3, HairStyleId = 15, PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/20250531_161047.jpg" },
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

        public static Appointment[] SeedAppointments()
        {
            return Array.Empty<Appointment>();
        }
    }
}