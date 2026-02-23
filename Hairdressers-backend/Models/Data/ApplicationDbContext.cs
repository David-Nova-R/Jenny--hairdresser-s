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

        public DbSet<User> Users { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // User
            builder.Entity<User>() .HasIndex(u => u.SupabaseUserId).IsUnique();

            // Appointment -> User
            builder.Entity<Appointment>().HasOne(a => a.User).WithMany(u => u.Appointments) .HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.Restrict);

            // Appointment -> Service
            builder.Entity<Appointment>().HasOne(a => a.Service).WithMany(s => s.Appointments).HasForeignKey(a => a.ServiceId).OnDelete(DeleteBehavior.Restrict);

            // Seeds
            builder.Entity<Service>().HasData(Seed.SeedServices());
            builder.Entity<User>().HasData(Seed.SeedUsers());
            builder.Entity<Appointment>().HasData(Seed.SeedAppointments());
        }
    }
}
