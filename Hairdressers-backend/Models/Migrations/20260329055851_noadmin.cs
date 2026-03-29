using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Models.Migrations
{
    /// <inheritdoc />
    public partial class noadmin : Migration
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
                    DurationMaxMinutes = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HairStyles", x => x.Id);
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
                    { 11, null, 420, 300, "Keratina", 250m, 140m },
                    { 12, null, 420, 240, "Aminoácido", 300m, 150m },
                    { 13, null, 240, 180, "Terapia capilar", 200m, 120m },
                    { 14, null, 120, 60, "Cepillados", 50m, 30m },
                    { 15, null, 180, 60, "Peinados", 70m, 35m }
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
                table: "Users",
                columns: new[] { "Id", "Email", "FirstName", "LastName", "PhoneNumber", "RoleId", "SupabaseUserId" },
                values: new object[,]
                {
                    { 1, "", "Jean", "Tremblay", "514-123-4567", 3, "11111111-1111-1111-1111-111111111111" },
                    { 2, "", "Marie", "Dupont", "438-987-6543", 3, "22222222-2222-2222-2222-222222222222" },
                    { 3, "", "Luc", "Bernard", "450-555-1234", 3, "33333333-3333-3333-3333-333333333333" }
                });

            migrationBuilder.InsertData(
                table: "Appointments",
                columns: new[] { "Id", "AppointmentDate", "ExternalDurationMinutes", "GoogleEventId", "HairStyleId", "Notes", "Status", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 3, 10, 10, 0, 0, 0, DateTimeKind.Unspecified), null, null, 1, null, 1, 1 },
                    { 2, new DateTime(2025, 3, 11, 14, 0, 0, 0, DateTimeKind.Unspecified), null, null, 3, null, 0, 2 },
                    { 3, new DateTime(2025, 3, 12, 9, 0, 0, 0, DateTimeKind.Unspecified), null, null, 4, null, 0, 3 }
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
                name: "HairStylePhotos");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "HairStyles");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
