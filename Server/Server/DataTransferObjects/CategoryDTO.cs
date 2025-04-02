using System.ComponentModel.DataAnnotations;

namespace Server.DataTransferObjects;

public class CategoryDTO
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(128)]
    public string Name { get; set; }
}