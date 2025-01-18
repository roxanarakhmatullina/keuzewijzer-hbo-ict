using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public enum ClusterLevel
{
    [Description("Level 0")]
    Level0 = 0,
        
    [Description("Level 1")]
    Level1 = 1,

    [Description("Level 2")]
    Level2 = 2,

    [Description("Level 3")]
    Level3 = 3,
    
    [Description("Level 4")]
    Level4 = 4
}

public class ClusterPrerequisite
{
    public Guid ClusterId { get; set; }
    public Cluster Cluster { get; set; }
    
    public Guid PrerequisiteId { get; set; }
    public Cluster Prerequisite { get; set; }
}

public class Cluster
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    [MinLength(1)]
    [MaxLength(128)]
    public string Name { get; set; }
    
    public string? Link { get; set; } // If you want to link to information about a cluster
    
    [Required]
    public Boolean FirstSemester { get; set; } = false;

    [Required] 
    public Boolean LastSemester { get; set; } = false;

    [Required] 
    public Boolean IsFreeChoice { get; set; } = false;

    [Required] 
    public ClusterLevel Level { get; set; } = ClusterLevel.Level1;

    [Required]
    public Boolean IsLocked { get; set; } = false;
    
    public Boolean IsRetaken { get; set; } = false; // Used for frontend to show if the cluster is retaken
    public int RetakenCount { get; set; } = 0; // Used for frontend to show if the cluster is retaken

    // Navigation properties for many-to-many relationships
    public virtual ICollection<ClusterPrerequisite> ClusterPrerequisites { get; set; } = new List<ClusterPrerequisite>();
    public virtual ICollection<GraduateProfile> GraduateProfiles { get; set; } = new List<GraduateProfile>();
    public virtual ICollection<Cohort> Cohorts { get; set; } = new List<Cohort>();
}