using System.Reflection.Emit;
using Hairdressers_backend.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;

namespace Models.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<HairStylePhoto> HairStylePhotos { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<HairStyle> HairStyles { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<PortfolioPhoto> PortfolioPhotos { get; set; }
        public DbSet<DayOff> DaysOff { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Role
            builder.Entity<Role>().HasIndex(r => r.Name).IsUnique();

            // User
            builder.Entity<User>().HasIndex(u => u.SupabaseUserId).IsUnique();
            builder.Entity<User>().HasOne(u => u.Role).WithMany(r => r.Users).HasForeignKey(u => u.RoleId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);

            // Appointment -> User (nullable pour les rendez-vous externes)
            builder.Entity<Appointment>().HasOne(a => a.User).WithMany(u => u.Appointments).HasForeignKey(a => a.UserId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);

            // Appointment -> Service (nullable pour les rendez-vous externes)
            builder.Entity<Appointment>().HasOne(a => a.HairStyle).WithMany(s => s.Appointments).HasForeignKey(a => a.HairStyleId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
            // Appointment -> Sauves les heures en heure normal
            builder.Entity<Appointment>().Property(a => a.AppointmentDate).HasColumnType("timestamp without time zone");

            // HairStyle photos
            builder.Entity<HairStylePhoto>().HasOne(p => p.HairStyle).WithMany(h => h.Photos).HasForeignKey(p => p.HairStyleId).OnDelete(DeleteBehavior.Cascade);

            // Reviews
            builder.Entity<Review>().HasOne(r => r.User).WithMany(u => u.Reviews).HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);

            // Seeds
            builder.Entity<Role>().HasData(Seed.SeedRoles());
            builder.Entity<HairStyle>().HasData(Seed.SeedServices());
            builder.Entity<HairStylePhoto>().HasData(Seed.SeedHairStylePhotos());
            builder.Entity<PortfolioPhoto>().HasData(Seed.SeedPortfolioPhotos());
            builder.Entity<User>().HasData(Seed.SeedUsers());
            builder.Entity<Appointment>().HasData(Seed.SeedAppointments());
            builder.Entity<Review>().HasData(Seed.SeedReviews());

        }
    }
}
