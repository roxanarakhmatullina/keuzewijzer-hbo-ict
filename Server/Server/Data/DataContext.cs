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
}