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
                new PortfolioPhoto { Id = 2, PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/133fa5eb-8fb1-412b-9abe-22df867b6b35.jpg", Title = "Peinados", Order = 2, IsVisible = true, CreatedAt = new DateTime(2025, 5, 31, 0, 0, 0, DateTimeKind.Utc) },
                new PortfolioPhoto { Id = 3, PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/59e6263a-8aee-41b7-a7ce-2f48b19bd6e8.jpg", Title = "Peinados", Order = 3, IsVisible = true, CreatedAt = new DateTime(2025, 5, 31, 0, 0, 0, DateTimeKind.Utc) },
            };
        }

        public static HairStylePhoto[] SeedHairStylePhotos()
        {
            return new HairStylePhoto[]
            {
                //Keratina
                new HairStylePhoto 
                {
                    Id = 1,
                    HairStyleId = 15,
                    PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Keratina/20250312_183411.jpg"
                },
                //Peinados
                new HairStylePhoto 
                {
                    Id = 2,
                    HairStyleId = 14,
                    PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/133fa5eb-8fb1-412b-9abe-22df867b6b35.jpg"
                },
                new HairStylePhoto 
                {
                    Id = 3,
                    HairStyleId = 14,
                    PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/59e6263a-8aee-41b7-a7ce-2f48b19bd6e8.jpg"
                },
                //Baby Lights
                new HairStylePhoto
                {
                    Id = 4,
                    HairStyleId = 6,
                    PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Baby%20Lights/10f9cd65-5d3c-429b-af3a-3d05514e6b77.jpeg"
                },
                //Balayage
                new HairStylePhoto
                {
                    Id = 5,
                    HairStyleId = 5,
                    PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Balayage/08d4d444-33a0-4798-a05c-8867e24f69ab.jpeg"
                },
                //Ombré
                new HairStylePhoto
                {
                    Id = 6,
                    HairStyleId = 7,
                    PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Ombre/fb8bc548-c9ff-440b-abde-23936b379451.jpeg"
                },
                //Cortes dama
                new HairStylePhoto
                {
                    Id = 7,
                    HairStyleId = 9,
                    PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Cortes%20dama/b6a72487-72c1-424d-8790-aec3cc9ac5e5.jpeg"
                },
                //Tecnicas mechas y efectos de luz
                new HairStylePhoto
                {
                    Id = 8,
                    HairStyleId = 4,
                    PhotoUrl = "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Tecnicas%20de%20mechas%20y%20efectos%20de%20luz/0cd2564c-0c05-4ff3-be4f-ee996989c7a5.jpeg"
                },
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