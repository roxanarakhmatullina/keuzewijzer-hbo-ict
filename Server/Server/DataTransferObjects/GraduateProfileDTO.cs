using System.ComponentModel.DataAnnotations;
using Server.Models;

namespace Server.DataTransferObjects;

public class GraduateProfileDTO
{

    public string? Link { get; set; }
    
    [Required]
    [MinLength(1)]
    [MaxLength(128)]
    public string Name { get; set; }
    
    [Required]
    [MinLength(7)]
    [MaxLength(7)]
    [RegularExpression("^#[0-9A-Fa-f]{6}$")]
    public string Color { get; set; }
    
    
    [Required]
    public List<Guid> CohortIds { get; set; }

    public Boolean Almere { get; set; }
    public Boolean Zwolle { get; set; }

}