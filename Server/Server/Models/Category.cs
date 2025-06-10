using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Server.Models;

[Index(nameof(Name), IsUnique = true)]
public class Category
{
    [Key]
    public Guid Id  { get; set; }

    [Required]
    [MaxLength(128)]
    public string Name { get; set; }

    public virtual ICollection<CategoryCohortCluster> CategoryCohortClusters { get; set; } = new List<CategoryCohortCluster>();
}