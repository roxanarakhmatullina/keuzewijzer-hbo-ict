using Server.Models;

namespace Server.DataTransferObjects;

public class SmallClusterDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Link { get; set; }
    public Boolean FirstSemester { get; set; }
    public Boolean LastSemester { get; set; }
    public Boolean Zwolle { get; set; }
    public Boolean Almere { get; set; }
    public string AvailabilityStatus { get; set; }
    public ClusterLevel Level { get; set; }
    public Boolean IsFreeChoice { get; set; }
    public Boolean IsLocked { get; set; }
    public Boolean IsRetaken { get; set; }
    public int RetakenCount { get; set; }
    public List<PrerequisiteDTO> Prerequisites { get; set; }
}