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
    
    // Navigation properties for many-to-many relationships
    public virtual ICollection<Cluster> Prerequisites { get; set; } = new List<Cluster>();
    public virtual ICollection<GraduateProfile> GraduateProfiles { get; set; } = new List<GraduateProfile>();
    public virtual ICollection<Cohort> Cohorts { get; set; } = new List<Cohort>();
}