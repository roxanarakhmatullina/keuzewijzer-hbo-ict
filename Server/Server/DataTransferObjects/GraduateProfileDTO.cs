using System.ComponentModel.DataAnnotations;
using Server.Models;

namespace Server.DataTransferObjects;

public class GraduateProfileDTO
{
    [Required]
    [MinLength(1)]
    [MaxLength(128)]
    public string Name { get; set; }
    
    [Required]
    [MinLength(7)]
    [MaxLength(7)]
    [RegularExpression("^#[0-9A-Fa-f]{6}$")]
    public string Color { get; set; }
    
    [Url]
    public string? Link { get; set; }
    
    [Required]
    public List<Guid> CohortIds { get; set; }
}