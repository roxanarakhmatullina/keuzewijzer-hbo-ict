using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clusters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Link = table.Column<string>(type: "text", nullable: true),
                    FirstSemester = table.Column<bool>(type: "boolean", nullable: false),
                    LastSemester = table.Column<bool>(type: "boolean", nullable: false),
                    IsFreeChoice = table.Column<bool>(type: "boolean", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    IsLocked = table.Column<bool>(type: "boolean", nullable: false),
                    IsRetaken = table.Column<bool>(type: "boolean", nullable: false),
                    ClusterId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clusters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Clusters_Clusters_ClusterId",
                        column: x => x.ClusterId,
                        principalTable: "Clusters",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Cohorts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cohorts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GraduateProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    Link = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GraduateProfiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ClusterCohort",
                columns: table => new
                {
                    ClustersId = table.Column<Guid>(type: "uuid", nullable: false),
                    CohortsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClusterCohort", x => new { x.ClustersId, x.CohortsId });
                    table.ForeignKey(
                        name: "FK_ClusterCohort_Clusters_ClustersId",
                        column: x => x.ClustersId,
                        principalTable: "Clusters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClusterCohort_Cohorts_CohortsId",
                        column: x => x.CohortsId,
                        principalTable: "Cohorts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClusterGraduateProfile",
                columns: table => new
                {
                    ClustersId = table.Column<Guid>(type: "uuid", nullable: false),
                    GraduateProfilesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClusterGraduateProfile", x => new { x.ClustersId, x.GraduateProfilesId });
                    table.ForeignKey(
                        name: "FK_ClusterGraduateProfile_Clusters_ClustersId",
                        column: x => x.ClustersId,
                        principalTable: "Clusters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClusterGraduateProfile_GraduateProfiles_GraduateProfilesId",
                        column: x => x.GraduateProfilesId,
                        principalTable: "GraduateProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CohortGraduateProfile",
                columns: table => new
                {
                    CohortsId = table.Column<Guid>(type: "uuid", nullable: false),
                    GraduateProfilesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CohortGraduateProfile", x => new { x.CohortsId, x.GraduateProfilesId });
                    table.ForeignKey(
                        name: "FK_CohortGraduateProfile_Cohorts_CohortsId",
                        column: x => x.CohortsId,
                        principalTable: "Cohorts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CohortGraduateProfile_GraduateProfiles_GraduateProfilesId",
                        column: x => x.GraduateProfilesId,
                        principalTable: "GraduateProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClusterCohort_CohortsId",
                table: "ClusterCohort",
                column: "CohortsId");

            migrationBuilder.CreateIndex(
                name: "IX_ClusterGraduateProfile_GraduateProfilesId",
                table: "ClusterGraduateProfile",
                column: "GraduateProfilesId");

            migrationBuilder.CreateIndex(
                name: "IX_Clusters_ClusterId",
                table: "Clusters",
                column: "ClusterId");

            migrationBuilder.CreateIndex(
                name: "IX_CohortGraduateProfile_GraduateProfilesId",
                table: "CohortGraduateProfile",
                column: "GraduateProfilesId");

            migrationBuilder.CreateIndex(
                name: "IX_Cohorts_Name",
                table: "Cohorts",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GraduateProfiles_Color",
                table: "GraduateProfiles",
                column: "Color",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClusterCohort");

            migrationBuilder.DropTable(
                name: "ClusterGraduateProfile");

            migrationBuilder.DropTable(
                name: "CohortGraduateProfile");

            migrationBuilder.DropTable(
                name: "Clusters");

            migrationBuilder.DropTable(
                name: "Cohorts");

            migrationBuilder.DropTable(
                name: "GraduateProfiles");
        }
    }
}
