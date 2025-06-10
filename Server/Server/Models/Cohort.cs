using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Server.Models;

[Index(nameof(Name), IsUnique = true)]
public class Cohort
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(128)]
    public string Name { get; set; } // The name of the cohort (e.g., "2024")
    
    public Boolean isAvailable { get; set; } = false; // Used to show if the cohort is available for selection

    public virtual ICollection<GraduateProfile> GraduateProfiles { get; set; } = new List<GraduateProfile>();
    public virtual ICollection<Cluster> Clusters { get; set; } = new List<Cluster>();
}