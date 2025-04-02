using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Server.Models;

[Index(nameof(CategoryId), nameof(CohortId), nameof(ClusterId), IsUnique = true)]
public class CategoryCohortCluster
{
    [Key]
    public Guid Id { get; set; }

    // Foreign keys
    [Required]
    public Guid CategoryId { get; set; }

    [Required]
    public Guid CohortId { get; set; }

    [Required]
    public Guid ClusterId { get; set; }


    // Navigaton properties
    public Category Category { get; set; } = null!;
    public Cohort Cohort { get; set; } = null!;
    public Cluster Cluster { get; set; } = null!;
}