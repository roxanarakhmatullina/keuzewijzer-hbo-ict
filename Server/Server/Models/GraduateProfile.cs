using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models;

[Index(nameof(Color), IsUnique = true)]
public class GraduateProfile
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    [MinLength(1)]
    [MaxLength(128)]
    public string Name { get; set; }
    
    [Required]
    public string Color { get; set; } // Set the color for the graduate profile
    
    public string? Link { get; set; }  // Link to information about a graduate profile

    [Required]
    public Boolean Zwolle { get; set; } = false;

    [Required] 
    public Boolean Almere { get; set; } = false;

    public virtual ICollection<Cluster> Clusters { get; set; } = new List<Cluster>();
    public virtual ICollection<Cohort> Cohorts { get; set; } = new List<Cohort>();
}