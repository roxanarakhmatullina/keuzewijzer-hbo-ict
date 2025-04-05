using System.ComponentModel.DataAnnotations;

namespace Server.DataTransferObjects;

public class CategoryCreateDTO
{
    [Required]
    [MaxLength(128)]
    public string Name { get; set; }
}