namespace Server.DataTransferObjects;

public class CategoryCohortClusterDTO
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public Guid CohortId { get; set; }
    public List<Guid> ClusterIds { get; set; } = new List<Guid>();
}