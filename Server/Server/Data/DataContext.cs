using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Server.Models;

namespace Server.Data;
using Microsoft.EntityFrameworkCore;

public class DataContext : IdentityDbContext<IdentityUser>
{
  public DataContext(DbContextOptions<DataContext> options) : base(options) { }
  
  public DbSet<GraduateProfile> GraduateProfiles { get; set; }
  public DbSet<Cohort> Cohorts { get; set; }
  public DbSet<Cluster> Clusters { get; set; }
  
  public DbSet<ClusterPrerequisite> ClusterPrerequisites { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<ClusterPrerequisite>()
      .HasKey(cp => new { cp.ClusterId, cp.PrerequisiteId });

    modelBuilder.Entity<ClusterPrerequisite>()
      .HasOne(cp => cp.Cluster)
      .WithMany(c => c.ClusterPrerequisites)
      .HasForeignKey(cp => cp.ClusterId);

    modelBuilder.Entity<ClusterPrerequisite>()
      .HasOne(cp => cp.Prerequisite)
      .WithMany()
      .HasForeignKey(cp => cp.PrerequisiteId);
  }
}
