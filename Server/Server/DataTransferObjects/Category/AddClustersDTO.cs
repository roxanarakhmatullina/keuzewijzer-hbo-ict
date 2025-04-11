using System.ComponentModel.DataAnnotations;

namespace Server.DataTransferObjects;

public class AddClustersDTO
{
    [Required]
    public List<Guid> ClusterIds { get; set; } = new();
}