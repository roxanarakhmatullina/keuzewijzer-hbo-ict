using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataTransferObjects;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudyRouteController : ControllerBase
    {
        private readonly DataContext _context;

        public StudyRouteController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("cohort/{cohortId}/graduateProfile/{id}")]
        public async Task<ActionResult> GetStudyRoutes(Guid cohortId, Guid id)
        {
            var cohort = await _context.Cohorts.FirstOrDefaultAsync(c => c.Id.Equals(cohortId));
            if (cohort == null) return BadRequest("Cohort not found");

            var graduateProfile = await _context.GraduateProfiles.FirstOrDefaultAsync(gp => gp.Id.Equals(id));
            if (graduateProfile == null) return BadRequest("Graduate profile not found");

            try
            {
                var clusters = await _context.Clusters
                    .Include(c => c.Cohorts)
                    .Where(c => c.Cohorts.Any(ch => ch.Id == cohortId))
                    .Include(c => c.GraduateProfiles)
                    .Where(c => c.GraduateProfiles.Any(gp => gp.Id == id))
                    .Include(cl => cl.Prerequisites)
                    .Select(cl => new SmallClusterDTO()
                    {
                        Id = cl.Id,
                        Name = cl.Name,
                        Link = cl.Link,
                        Level = cl.Level,
                        FirstSemester = cl.FirstSemester,
                        LastSemester = cl.LastSemester,
                        IsRetaken = cl.IsRetaken,
                        IsLocked = cl.IsLocked,
                        IsFreeChoice = cl.IsFreeChoice,
                        Prerequisites = cl.Prerequisites.Select(pr => new PrerequisiteDTO()
                        {
                            Id = pr.Id,
                            Name = pr.Name
                        }).ToList()
                    })
                    .ToListAsync();

                // Create studyRoute
                var studyRoute = new List<StudyYearDTO>();

                // Process levels 1 to 4 clusters
                for (var level = ClusterLevel.Level1; level <= ClusterLevel.Level4; level++)
                {
                    int requiredPreviousClusters =
                        level == ClusterLevel.Level1 ? 0 : level == ClusterLevel.Level2 ? 2 : 1;
                    int studyRouteIndex = level == ClusterLevel.Level1 ? -1 : (int)level - 2;

                    var studyYear = ProcessClusters(cohort, studyRoute, clusters, level, requiredPreviousClusters,
                        studyRouteIndex);
                    if (studyYear != null)
                    {
                        studyRoute.Add(studyYear);

                        // Remove processed clusters
                        clusters.RemoveAll(cl => studyYear.FirstSemester.Any(c => c.Id.Equals(cl.Id)));
                        clusters.RemoveAll(cl => studyYear.LastSemester.Any(c => c.Id.Equals(cl.Id)));
                    }
                }

                // Process level 0 clusters
                studyRoute = ProcessLevel0Clusters(studyRoute, clusters);

                return Ok(studyRoute);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateStudyRoute([FromBody] ValidateStudyRouteDTO validateStudyRouteDto)
        {
            var cohort = await _context.Cohorts.FirstOrDefaultAsync(c => c.Id.Equals(validateStudyRouteDto.CohortId));
            if (cohort == null) return BadRequest("Cohort not found");

            var graduateProfile = await _context.GraduateProfiles.FirstOrDefaultAsync(gp =>
                gp.Id.Equals(validateStudyRouteDto.GraduateProfileId));
            if (graduateProfile == null) return BadRequest("Graduate profile not found");

            // Get all the clusters in the send study route to validate.
            var sendRouteClusters = validateStudyRouteDto.StudyRoute.StudyYears
                .SelectMany(sy => sy.FirstSemester.Concat(sy.LastSemester))
                .ToList();

            // Check if clusters match clusters in the database
            var clustersCount = await _context.Clusters
                .Include(c => c.Cohorts)
                .Where(c => c.Cohorts.Any(ch => ch.Id == validateStudyRouteDto.CohortId))
                .Include(c => c.GraduateProfiles)
                .Where(c => c.GraduateProfiles.Any(gp => gp.Id == validateStudyRouteDto.GraduateProfileId))
                .Include(cl => cl.Prerequisites)
                .CountAsync();

            if (sendRouteClusters.Count != clustersCount) return BadRequest("Study route is not valid");

            var studyRoute = new List<StudyYearDTO>();

            // Process clusters for levels 1 to 4
            for (var level = ClusterLevel.Level1; level <= ClusterLevel.Level4; level++)
            {
                int requiredPreviousClusters = level switch
                {
                    ClusterLevel.Level1 => 0,
                    ClusterLevel.Level2 => 2,
                    _ => 1
                };

                // Ensure valid index
                int studyRouteIndex = Math.Max(0, (int)level - 2);

                var studyYear = ProcessClusters(cohort, studyRoute, sendRouteClusters, level, requiredPreviousClusters,
                    studyRouteIndex);
                if (studyYear != null)
                {
                    studyRoute.Add(studyYear);

                    // Remove processed clusters
                    sendRouteClusters.RemoveAll(cl => studyYear.FirstSemester.Any(c => c.Id.Equals(cl.Id)));
                    sendRouteClusters.RemoveAll(cl => studyYear.LastSemester.Any(c => c.Id.Equals(cl.Id)));
                }
            }

            // Process level 0 clusters
            studyRoute = ProcessLevel0Clusters(studyRoute, sendRouteClusters);

            return Ok(studyRoute);
        }

        private List<StudyYearDTO> ProcessLevel0Clusters(List<StudyYearDTO> studyYears,
            List<SmallClusterDTO> clusters)
        {
            // Create a copy to avoid modifying the original list directly
            List<StudyYearDTO> newStudyYears = new List<StudyYearDTO>(studyYears);
            List<SmallClusterDTO> newLevelZeroClusters = clusters.Where(cl => cl.Level.Equals(ClusterLevel.Level0))
                .OrderBy(cl => cl.Name).ToList();

            // Counter to track how many Level 0 clusters have been added
            var countLevel0Clusters = 0;

            // Iterate over each study year
            for (int i = 0; i < newStudyYears.Count; i++)
            {

                // Check if the first semester is empty and no clusters are already present
                if (newStudyYears[i].FirstSemester != null && newStudyYears[i].FirstSemester.Count == 0)
                {
                    countLevel0Clusters++;
                    newStudyYears[i].FirstSemester.Add(newLevelZeroClusters.First());
                    // remove the added cluster from the list
                    newLevelZeroClusters.RemoveAt(0);

                    continue;
                }

                // Check if the last semester is empty and no clusters are already present
                if (newStudyYears[i].LastSemester != null && newStudyYears[i].LastSemester.Count == 0)
                {
                    countLevel0Clusters++;
                    newStudyYears[i].LastSemester.Add(newLevelZeroClusters.First());
                    // remove the added cluster from the list
                    newLevelZeroClusters.RemoveAt(0);
                }
            }

            return newStudyYears;
        }


        private StudyYearDTO ProcessClusters(
            Cohort cohort,
            List<StudyYearDTO> studyRouteDto,
            List<SmallClusterDTO> clusters,
            ClusterLevel targetLevel,
            int requiredPreviousLevelClusters,
            int studyRouteIndex)
        {
            // Validate and adjust studyRouteIndex
            while (studyRouteDto.Count <= studyRouteIndex)
            {
                studyRouteDto.Add(new StudyYearDTO
                {
                    FirstSemester = new List<SmallClusterDTO>(),
                    LastSemester = new List<SmallClusterDTO>()
                });
            }

            // Check if the required number of clusters from the previous level exist
            if (studyRouteIndex >= 0 && requiredPreviousLevelClusters > 0)
            {
                var countPreviousLevelClusters = studyRouteDto[studyRouteIndex].FirstSemester
                                                     .Count(cl => cl.Level == targetLevel - 1)
                                                 + studyRouteDto[studyRouteIndex].LastSemester
                                                     .Count(cl => cl.Level == targetLevel - 1);

                if (countPreviousLevelClusters < requiredPreviousLevelClusters)
                {
                    return null;
                }
            }

            // Filter clusters for the target level
            var levelClusters = clusters
                .Where(cl => cl.Level == targetLevel)
                .OrderBy(cl => cl.Name)
                .ToList();

            if (!levelClusters.Any())
                return null;

            // Handle retaken clusters and add them to the correct position
            var retakenClusters = clusters.Where(cl => cl.IsRetaken).ToList();
            foreach (var retakenCluster in retakenClusters)
            {
                var originalCluster = new SmallClusterDTO
                {
                    Name = retakenCluster.Name,
                    Level = retakenCluster.Level,
                    FirstSemester = retakenCluster.FirstSemester,
                    LastSemester = retakenCluster.LastSemester,
                    IsRetaken = false
                };

                // Insert the original cluster directly after the failed cluster
                if (retakenCluster.FirstSemester) studyRouteDto[studyRouteIndex].FirstSemester.Insert(0, originalCluster);
                else if (retakenCluster.LastSemester) studyRouteDto[studyRouteIndex].LastSemester.Insert(0, originalCluster);

                // Remove the retaken flag from the original cluster
                clusters.Remove(retakenCluster);
                clusters.Add(originalCluster);
            }

            // Assign clusters to semesters with conflict resolution
            var studyYearClusters = new StudyYearDTO
            {
                Year =
                    $"{int.Parse(cohort.Name.Substring(2, 2)) + (int)targetLevel - 1}/{int.Parse(cohort.Name.Substring(2, 2)) + (int)targetLevel:D2}",
                FirstSemester = new List<SmallClusterDTO>(),
                LastSemester = new List<SmallClusterDTO>()
            };

            var alternatingFlag = true; // Helps alternate between semesters for conflicts
            foreach (var cluster in levelClusters)
            {
                if (cluster.FirstSemester && cluster.LastSemester)
                {
                    if (alternatingFlag) studyYearClusters.FirstSemester.Add(cluster);
                    else studyYearClusters.LastSemester.Add(cluster);

                    alternatingFlag = !alternatingFlag; // Toggle for next conflict
                }
                else if (cluster.FirstSemester) studyYearClusters.FirstSemester.Add(cluster);
                else if (cluster.LastSemester) studyYearClusters.LastSemester.Add(cluster);
            }

            return studyYearClusters;
        }
    }

    public class ValidateStudyRouteDTO
    {
        public Guid CohortId { get; set; }
        public Guid GraduateProfileId { get; set; }
        public StudyRouteDTO StudyRoute { get; set; }
    }
}