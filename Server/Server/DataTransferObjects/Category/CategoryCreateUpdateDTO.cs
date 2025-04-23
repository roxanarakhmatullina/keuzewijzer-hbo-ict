using System.ComponentModel.DataAnnotations;

namespace Server.DataTransferObjects;

public class CategoryCreateUpdateDTO
{
    [Required]
    [MaxLength(128)]
    public string Name { get; set; }

    // For each cohort -> list of clusters.
    public List<CohortClustersDTO> CohortClusters { get; set; } = new();
}

public class CohortClustersDTO
{
    [Required]
    public Guid CohortId { get; set; }
    
    public List<Guid> ClusterIds { get; set; } = new();
}