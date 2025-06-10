namespace Server.DataTransferObjects;

public class CategoryDetailDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<CohortClustersDetailDTO> CohortClusters { get; set; }
}

public class CohortClustersDetailDTO
{
    public Guid CohortId { get; set; }
    public string CohortName { get; set; }
    public List<ClusterDetailDTO> Clusters { get; set; } = new();
}

public class ClusterDetailDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}