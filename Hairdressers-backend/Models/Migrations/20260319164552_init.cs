using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Models.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    DurationMaxMinutes = table.Column<int>(type: "integer", nullable: true),
                    PhotoUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HairStyles", x => x.Id);
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
                    PhoneNumber = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppointmentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    HairStyleId = table.Column<int>(type: "integer", nullable: false)
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

            migrationBuilder.InsertData(
                table: "HairStyles",
                columns: new[] { "Id", "Description", "DurationMaxMinutes", "DurationMinutes", "Name", "PhotoUrl", "PriceMax", "PriceMin" },
                values: new object[,]
                {
                    { 1, null, 120, 60, "Tinte permanente", null, 90m, 35m },
                    { 2, null, 120, 60, "Tinte demipermanente", null, 50m, 35m },
                    { 3, null, 360, 240, "Baño de color", null, null, 35m },
                    { 4, null, 360, 240, "Técnicas de mechas y efectos de luz", null, 230m, 140m },
                    { 5, null, 360, 240, "Balayage", null, 250m, 150m },
                    { 6, null, 360, 240, "Baby Lights", null, 250m, 150m },
                    { 7, null, 360, 240, "Ombré", null, 230m, 150m },
                    { 8, null, 360, 240, "Californianas", null, 200m, 100m },
                    { 9, null, null, 60, "Cortes dama", null, null, 20m },
                    { 10, null, null, 180, "Permanente hombres", null, null, 100m },
                    { 11, null, 420, 300, "Keratina", null, 250m, 140m },
                    { 12, null, 420, 240, "Aminoácido", null, 300m, 150m },
                    { 13, null, 240, 180, "Terapia capilar", null, 200m, 120m },
                    { 14, null, 120, 60, "Cepillados", null, 50m, 30m },
                    { 15, null, 180, 60, "Peinados", null, 70m, 35m }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "FirstName", "LastName", "PhoneNumber", "SupabaseUserId" },
                values: new object[,]
                {
                    { 1, "Jean", "Tremblay", "514-123-4567", "11111111-1111-1111-1111-111111111111" },
                    { 2, "Marie", "Dupont", "438-987-6543", "22222222-2222-2222-2222-222222222222" },
                    { 3, "Luc", "Bernard", "450-555-1234", "33333333-3333-3333-3333-333333333333" }
                });

            migrationBuilder.InsertData(
                table: "Appointments",
                columns: new[] { "Id", "AppointmentDate", "HairStyleId", "Status", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 3, 10, 10, 0, 0, 0, DateTimeKind.Utc), 1, 1, 1 },
                    { 2, new DateTime(2025, 3, 11, 14, 0, 0, 0, DateTimeKind.Utc), 3, 0, 2 },
                    { 3, new DateTime(2025, 3, 12, 9, 0, 0, 0, DateTimeKind.Utc), 4, 0, 3 }
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
                name: "HairStyles");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
