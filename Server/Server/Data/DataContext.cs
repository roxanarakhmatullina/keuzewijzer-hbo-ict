using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Server.Data;

public class DataContext : IdentityDbContext<IdentityUser>
{
  public DataContext(DbContextOptions<DataContext> options) : base(options) { }
  
  public DbSet<GraduateProfile> GraduateProfiles { get; set; }
  public DbSet<Cohort> Cohorts { get; set; }
  public DbSet<Cluster> Clusters { get; set; }
  public DbSet<ClusterPrerequisite> ClusterPrerequisites { get; set; }
  public DbSet<Category> Categories { get; set; }
  public DbSet<CategoryCohortCluster> CategoryCohortClusters { get; set; }

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

    modelBuilder.Entity<CategoryCohortCluster>()
      .HasOne(ccc => ccc.Category)
      .WithMany(c => c.CategoryCohortClusters)
      .HasForeignKey(ccc => ccc.CategoryId);
    
    modelBuilder.Entity<CategoryCohortCluster>()
      .HasOne(ccc => ccc.Cohort)
      .WithMany()
      .HasForeignKey(ccc => ccc.CohortId);
    
    modelBuilder.Entity<CategoryCohortCluster>()
      .HasOne(ccc => ccc.Cluster)
      .WithMany()
      .HasForeignKey(ccc => ccc.ClusterId);
  }
}
