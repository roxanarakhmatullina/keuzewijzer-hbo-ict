using System.Security.Cryptography.Pkcs;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.Models;

namespace Server.Services;

public class StudyRouteService
{
    
    public static StudyYearDTO CreateNewStudyYear(Cohort cohort, int yearNumber)
    {
        int cohortYear = int.Parse(cohort.Name.Substring(2, 2)); // Extracts the cohort year as an integer.
        int startYear = cohortYear + yearNumber - 1; // Calculate the start year.

        return new StudyYearDTO
        {
            // Format the year as "startYear/XX" with zero-padded second part.
            Year = $"'{startYear}/'{startYear + 1:D2}",
            FirstSemester = new List<SmallClusterDTO>(),
            LastSemester = new List<SmallClusterDTO>()
        };
    }
}