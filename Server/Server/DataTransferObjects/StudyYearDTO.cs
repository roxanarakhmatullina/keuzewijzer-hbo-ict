namespace Server.DataTransferObjects;

public class StudyYearDTO
{
    public string Year { get; set; }
    public List<SmallClusterDTO> FirstSemester { get; set; }
    public List<SmallClusterDTO> LastSemester { get; set; }
}
