using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class updated_prerequisites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clusters_Clusters_ClusterId",
                table: "Clusters");

            migrationBuilder.DropIndex(
                name: "IX_Clusters_ClusterId",
                table: "Clusters");

            migrationBuilder.DropColumn(
                name: "ClusterId",
                table: "Clusters");

            migrationBuilder.CreateTable(
                name: "ClusterPrerequisites",
                columns: table => new
                {
                    ClusterId = table.Column<Guid>(type: "uuid", nullable: false),
                    PrerequisiteId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClusterPrerequisites", x => new { x.ClusterId, x.PrerequisiteId });
                    table.ForeignKey(
                        name: "FK_ClusterPrerequisites_Clusters_ClusterId",
                        column: x => x.ClusterId,
                        principalTable: "Clusters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClusterPrerequisites_Clusters_PrerequisiteId",
                        column: x => x.PrerequisiteId,
                        principalTable: "Clusters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClusterPrerequisites_PrerequisiteId",
                table: "ClusterPrerequisites",
                column: "PrerequisiteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClusterPrerequisites");

            migrationBuilder.AddColumn<Guid>(
                name: "ClusterId",
                table: "Clusters",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clusters_ClusterId",
                table: "Clusters",
                column: "ClusterId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clusters_Clusters_ClusterId",
                table: "Clusters",
                column: "ClusterId",
                principalTable: "Clusters",
                principalColumn: "Id");
        }
    }
}
