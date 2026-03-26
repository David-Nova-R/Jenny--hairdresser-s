using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Models.Migrations
{
    /// <inheritdoc />
    public partial class Review : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Reviews",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "Reviews",
                type: "integer",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Reviews",
                columns: new[] { "Id", "CreatedAt", "IsVisible", "Stars", "Text", "UserId", "UserId1" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 3, 16, 19, 52, 52, 905, DateTimeKind.Utc).AddTicks(1107), true, 5, "Excellent service, très professionnelle.", 1, null },
                    { 2, new DateTime(2026, 3, 18, 19, 52, 52, 905, DateTimeKind.Utc).AddTicks(1116), true, 5, "Très bon résultat, je recommande !", 2, null },
                    { 3, new DateTime(2026, 3, 21, 19, 52, 52, 905, DateTimeKind.Utc).AddTicks(1118), true, 4, "Service rapide et efficace.", 3, null },
                    { 4, new DateTime(2026, 3, 23, 19, 52, 52, 905, DateTimeKind.Utc).AddTicks(1120), false, 4, "Bonne expérience globale.", 1, null },
                    { 5, new DateTime(2026, 3, 25, 19, 52, 52, 905, DateTimeKind.Utc).AddTicks(1122), true, 5, "Je reviendrai sûrement !", 2, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId1",
                table: "Reviews",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Users_UserId1",
                table: "Reviews",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Users_UserId1",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_UserId1",
                table: "Reviews");

            migrationBuilder.DeleteData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Reviews");
        }
    }
}
