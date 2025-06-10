using System.ComponentModel.DataAnnotations;

namespace Server.DataTransferObjects;

public class CohortDTO
{
    [Required]
    [MinLength(1)]
    [MaxLength(40)]
    public string Name { get; set; }

    [Required] public Boolean IsAvailable { get; set; } = false;
}