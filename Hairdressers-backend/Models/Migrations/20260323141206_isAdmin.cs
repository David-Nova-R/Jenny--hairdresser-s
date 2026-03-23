using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Models.Migrations
{
    /// <inheritdoc />
    public partial class isAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoUrl",
                table: "HairStyles");

            migrationBuilder.AddColumn<bool>(
                name: "IsAdmin",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

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

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 9,
                column: "DurationMaxMinutes",
                value: 60);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 10,
                column: "DurationMaxMinutes",
                value: 60);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "IsAdmin",
                value: false);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "IsAdmin",
                value: false);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "IsAdmin",
                value: false);

            migrationBuilder.CreateIndex(
                name: "IX_HairStylePhotos_HairStyleId",
                table: "HairStylePhotos",
                column: "HairStyleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HairStylePhotos");

            migrationBuilder.DropColumn(
                name: "IsAdmin",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "PhotoUrl",
                table: "HairStyles",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 1,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 2,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 3,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 4,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 5,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 6,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 7,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 8,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "DurationMaxMinutes", "PhotoUrl" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "DurationMaxMinutes", "PhotoUrl" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 11,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 12,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 13,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 14,
                column: "PhotoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "HairStyles",
                keyColumn: "Id",
                keyValue: 15,
                column: "PhotoUrl",
                value: null);
        }
    }
}
