namespace Server.DataTransferObjects;

public class CategoryDetailsDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<CohortDetailsDTO> Cohorts { get; set; } = new List<CohortDetailsDTO>();
    public List<ClusterDTO> Clusters { get; set; } = new List<ClusterDTO>();
}