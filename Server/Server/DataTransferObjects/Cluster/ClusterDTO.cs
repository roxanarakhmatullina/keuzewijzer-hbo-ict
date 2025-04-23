using System.ComponentModel.DataAnnotations;
using Server.Models;

namespace Server.DataTransferObjects;

public class ClusterDTO
{
    [Required]
    [MinLength(1)]
    [MaxLength(128)]
    public string Name { get; set; }
    
    public string? Link { get; set; }
    
    [Required]
    public Boolean FirstSemester { get; set; } = false;

    [Required] 
    public Boolean LastSemester { get; set; } = false;
    [Required]
    public Boolean  Zwolle { get; set; } = false;

    [Required] 
    public Boolean Almere { get; set; } = false;

    

    [Required] 
    public Boolean IsFreeChoice { get; set; } = false;

    [Required]
    public Boolean IsLocked { get; set; } = false;
    
    public Boolean IsRetaken { get; set; } = false; // Used for frontend to show if the cluster is retaken

    [Required]
    public ClusterLevel Level { get; set; }
    public List<Guid> PrerequisiteIds { get; set; }
    
    [Required]
    public List<Guid> CohortIds { get; set; }
    
    [Required]
    public List<Guid> GraduateProfileIds { get; set; }
    public Guid Id { get; internal set; }
}