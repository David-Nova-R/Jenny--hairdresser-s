using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Models.Migrations
{
    /// <inheritdoc />
<<<<<<<< HEAD:Hairdressers-backend/Models/Migrations/20260330185651_init.cs
    public partial class init : Migration
========
    public partial class dayoff : Migration
>>>>>>>> origin/Emails:Hairdressers-backend/Models/Migrations/20260330040640_dayoff.cs
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DaysOff",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Reason = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DaysOff", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HairStyles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    PriceMin = table.Column<decimal>(type: "numeric", nullable: false),
                    PriceMax = table.Column<decimal>(type: "numeric", nullable: true),
                    DurationMinutes = table.Column<int>(type: "integer", nullable: false),
                    DurationMaxMinutes = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HairStyles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PortfolioPhotos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PhotoUrl = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    IsVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioPhotos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HairStylePhotos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PhotoUrl = table.Column<string>(type: "text", nullable: false),
                    HairStyleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HairStylePhotos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HairStylePhotos_HairStyles_HairStyleId",
                        column: x => x.HairStyleId,
                        principalTable: "HairStyles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SupabaseUserId = table.Column<string>(type: "text", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppointmentDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    GoogleEventId = table.Column<string>(type: "text", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    ExternalDurationMinutes = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: true),
                    HairStyleId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointments_HairStyles_HairStyleId",
                        column: x => x.HairStyleId,
                        principalTable: "HairStyles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Text = table.Column<string>(type: "text", nullable: false),
                    Stars = table.Column<int>(type: "integer", nullable: false),
                    IsVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "HairStyles",
                columns: new[] { "Id", "Description", "DurationMaxMinutes", "DurationMinutes", "Name", "PriceMax", "PriceMin" },
                values: new object[,]
                {
                    { 1, null, 120, 60, "Tinte permanente", 90m, 35m },
                    { 2, null, 120, 60, "Tinte demipermanente", 50m, 35m },
                    { 3, null, 360, 240, "Baño de color", null, 35m },
                    { 4, null, 360, 240, "Técnicas de mechas y efectos de luz", 230m, 140m },
                    { 5, null, 360, 240, "Balayage", 250m, 150m },
                    { 6, null, 360, 240, "Baby Lights", 250m, 150m },
                    { 7, null, 360, 240, "Ombré", 230m, 150m },
                    { 8, null, 360, 240, "Californianas", 200m, 100m },
                    { 9, null, 60, 60, "Cortes dama", null, 20m },
                    { 10, null, 60, 180, "Permanente hombres", null, 100m },
                    { 11, null, 420, 240, "Aminoácido", 300m, 150m },
                    { 12, null, 240, 180, "Terapia capilar", 200m, 120m },
                    { 13, null, 120, 60, "Cepillados", 50m, 30m },
                    { 14, null, 180, 60, "Peinados", 70m, 35m },
                    { 15, null, 420, 300, "Keratina", 250m, 140m }
<<<<<<<< HEAD:Hairdressers-backend/Models/Migrations/20260330185651_init.cs
========
                });

            migrationBuilder.InsertData(
                table: "PortfolioPhotos",
                columns: new[] { "Id", "CreatedAt", "IsVisible", "Order", "PhotoUrl", "Title" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 3, 12, 0, 0, 0, 0, DateTimeKind.Utc), true, 1, "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Keratina/20250312_183411.jpg", "Keratina" },
                    { 2, new DateTime(2025, 5, 31, 0, 0, 0, 0, DateTimeKind.Utc), true, 2, "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/20250531_161043.jpg", "Peinados" },
                    { 3, new DateTime(2025, 5, 31, 0, 0, 0, 0, DateTimeKind.Utc), true, 3, "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/20250531_161047.jpg", "Peinados" }
>>>>>>>> origin/Emails:Hairdressers-backend/Models/Migrations/20260330040640_dayoff.cs
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "Styliste" },
                    { 3, "Client" }
                });

            migrationBuilder.InsertData(
                table: "HairStylePhotos",
                columns: new[] { "Id", "HairStyleId", "PhotoUrl" },
                values: new object[,]
                {
                    { 1, 11, "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Keratina/20250312_183411.jpg" },
                    { 2, 15, "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/20250531_161043.jpg" },
                    { 3, 15, "https://rzkdwiobufxosrkksooc.supabase.co/storage/v1/object/public/hairstyle-photos/Peinados/20250531_161047.jpg" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "FirstName", "LastName", "PhoneNumber", "RoleId", "SupabaseUserId" },
                values: new object[] { 1, "test@gmail.com", "Test", "Tingtong", "514-000-0000", 1, "280c0a73-c068-485b-a594-e2c1e0917a54" });

            migrationBuilder.InsertData(
                table: "Appointments",
                columns: new[] { "Id", "AppointmentDate", "ExternalDurationMinutes", "GoogleEventId", "HairStyleId", "Notes", "Status", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 3, 10, 10, 0, 0, 0, DateTimeKind.Unspecified), null, null, 1, null, 1, 1 },
                    { 2, new DateTime(2025, 3, 11, 14, 0, 0, 0, DateTimeKind.Unspecified), null, null, 3, null, 0, 1 },
                    { 3, new DateTime(2025, 3, 12, 9, 0, 0, 0, DateTimeKind.Unspecified), null, null, 4, null, 0, 1 }
                });

            migrationBuilder.InsertData(
                table: "Reviews",
                columns: new[] { "Id", "CreatedAt", "IsVisible", "Stars", "Text", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 3, 20, 18, 56, 50, 825, DateTimeKind.Utc).AddTicks(3127), true, 5, "Excellent service, très professionnelle.", 1 },
                    { 2, new DateTime(2026, 3, 22, 18, 56, 50, 825, DateTimeKind.Utc).AddTicks(3138), true, 5, "Très bon résultat, je recommande !", 2 },
                    { 3, new DateTime(2026, 3, 25, 18, 56, 50, 825, DateTimeKind.Utc).AddTicks(3139), true, 4, "Service rapide et efficace.", 3 },
                    { 4, new DateTime(2026, 3, 27, 18, 56, 50, 825, DateTimeKind.Utc).AddTicks(3142), false, 4, "Bonne expérience globale.", 1 },
                    { 5, new DateTime(2026, 3, 29, 18, 56, 50, 825, DateTimeKind.Utc).AddTicks(3144), true, 5, "Je reviendrai sûrement !", 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_HairStyleId",
                table: "Appointments",
                column: "HairStyleId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_UserId",
                table: "Appointments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_HairStylePhotos_HairStyleId",
                table: "HairStylePhotos",
                column: "HairStyleId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_SupabaseUserId",
                table: "Users",
                column: "SupabaseUserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "DaysOff");

            migrationBuilder.DropTable(
                name: "HairStylePhotos");

            migrationBuilder.DropTable(
<<<<<<<< HEAD:Hairdressers-backend/Models/Migrations/20260330185651_init.cs
                name: "Reviews");
========
                name: "PortfolioPhotos");

            migrationBuilder.DropTable(
                name: "Users");
>>>>>>>> origin/Emails:Hairdressers-backend/Models/Migrations/20260330040640_dayoff.cs

            migrationBuilder.DropTable(
                name: "HairStyles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
