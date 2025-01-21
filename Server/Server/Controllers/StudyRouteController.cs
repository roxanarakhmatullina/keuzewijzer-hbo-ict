using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataTransferObjects;
using Server.Models;
using Server.Services;

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
                    .Where(c => c.Cohorts.Any(ch => ch.Id == cohortId) && c.GraduateProfiles.Any(gp => gp.Id == id))
                    .Include(c => c.Cohorts)
                    .Include(c => c.GraduateProfiles)
                    .Include(cl => cl.ClusterPrerequisites)
                    .Select(cl => new SmallClusterDTO()
                    {
                        Id = cl.Id,
                        Name = cl.Name,
                        Link = cl.Link,
                        Level = cl.Level,
                        FirstSemester = cl.FirstSemester,
                        LastSemester = cl.LastSemester,
                        IsRetaken = cl.IsRetaken,
                        RetakenCount = cl.RetakenCount,
                        IsLocked = cl.IsLocked,
                        IsFreeChoice = cl.IsFreeChoice,
                        Prerequisites = cl.ClusterPrerequisites.Select(pr => new PrerequisiteDTO()
                        {
                            Id = pr.PrerequisiteId,
                            Name = pr.Prerequisite.Name,
                        }).ToList()
                    })
                    .ToListAsync();

                var studyRoute = new List<StudyYearDTO>();

                // Create initial empty study route with 4 years
                for (var i = 0; i < 4; i++)
                {
                    studyRoute.Add(StudyRouteService.CreateNewStudyYear(cohort, i + 1));
                }

                // Process clusters by level
                for (var level = ClusterLevel.Level1; level <= ClusterLevel.Level3; level++)
                {
                    ProcessLevel(cohort, studyRoute, clusters, level);
                }
                

                // Handle retaken clusters and dependencies
                ProcessRetakenClusters(studyRoute, clusters);
                
                // Process Level 0 clusters for retakes
                studyRoute = ProcessLevel0Clusters(studyRoute, clusters);

                // Process Level 4 clusters after Level 0
                ProcessLevel(cohort, studyRoute, clusters, ClusterLevel.Level4);
                

                return Ok(studyRoute);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private void ProcessRetakenClusters(List<StudyYearDTO> studyRoute, List<SmallClusterDTO> clusters)
        {
            var retakenClusters = clusters.Where(cl => cl.IsRetaken).ToList();

            foreach (var retakenCluster in retakenClusters)
            {
                // Find the cluster's failed semester and add it to the next available semester
                var originalCluster = clusters.FirstOrDefault(cl => cl.Id == retakenCluster.Id);
                if (originalCluster != null)
                {
                    // Increment retaken count for the cluster
                    retakenCluster.RetakenCount++;

                    // Find the original cluster's semester
                    var failedClusterSemester = originalCluster.FirstSemester ? "FirstSemester" : "LastSemester";
                    var nextYear = studyRoute.FirstOrDefault(y =>
                        y.FirstSemester.Count == 0 || y.LastSemester.Count == 0);

                    // Try to add the retaken cluster to the next available slot
                    if (failedClusterSemester == "FirstSemester" && nextYear != null)
                    {
                        // If first semester is available, add to first semester
                        nextYear.FirstSemester.Add(retakenCluster);
                    }
                    else
                    {
                        // If last semester is available, add to last semester
                        nextYear.LastSemester.Add(retakenCluster);
                    }

                    // Handle any clusters that depend on the retaken cluster as a prerequisite
                    HandleDependentClusters(studyRoute, retakenCluster, nextYear);
                }
            }
        }

        private void HandleDependentClusters(List<StudyYearDTO> studyRoute, SmallClusterDTO retakenCluster,
            StudyYearDTO nextYear)
        {
            var dependentClusters = studyRoute
                .SelectMany(year => year.FirstSemester.Concat(year.LastSemester))
                .Where(c => c.Prerequisites.Any(p => p.Id == retakenCluster.Id))
                .ToList();

            foreach (var dependentCluster in dependentClusters)
            {
                // Move dependent clusters to the next year
                var nextYearSlot = nextYear.FirstSemester.Count <= nextYear.LastSemester.Count
                    ? nextYear.FirstSemester
                    : nextYear.LastSemester;

                nextYearSlot.Add(dependentCluster);
            }
        }

        private void ProcessLevel(
            Cohort cohort,
            List<StudyYearDTO> studyRoute,
            List<SmallClusterDTO> clusters,
            ClusterLevel targetLevel,
            Boolean checkPrerequisites = false
            )
        {
            var levelClusters = clusters
                .Where(cl => cl.Level == targetLevel)
                .OrderBy(cl => cl.Name)
                .ToList();

            if (!levelClusters.Any())
                return;

            StudyYearDTO currentYearForNonRetaken;

            if (studyRoute.Count <= (int)targetLevel - 1)
            {
                currentYearForNonRetaken = StudyRouteService.CreateNewStudyYear(cohort, studyRoute.Count + 1);
                studyRoute.Add(currentYearForNonRetaken);
            }
            else
            {
                currentYearForNonRetaken = studyRoute[(int)targetLevel - 1];
            }

            bool addedAnyCluster;
            do
            {
                addedAnyCluster = false;

                foreach (var cluster in levelClusters.ToList())
                {
                    // Check if at least one prerequisite is met or no prerequisites exist
                    var hasAtLeastOnePrerequisiteMet = cluster.Prerequisites.Any(pr => studyRoute
                        .Any(sy => sy.FirstSemester.Concat(sy.LastSemester).Any(cl => cl.Id == pr.Id)));


                    if (checkPrerequisites ? (hasAtLeastOnePrerequisiteMet || !cluster.Prerequisites.Any()) : true) // hasAtLeastOnePrerequisiteMet || !cluster.Prerequisites.Any()
                    {
                        // Add cluster to the appropriate semester
                        if (cluster.FirstSemester && !cluster.LastSemester)
                        {
                            currentYearForNonRetaken.FirstSemester.Add(cluster);
                        }
                        else if (!cluster.FirstSemester && cluster.LastSemester)
                        {
                            currentYearForNonRetaken.LastSemester.Add(cluster);
                        }
                        else
                        {
                            if (currentYearForNonRetaken.FirstSemester.Count <=
                                currentYearForNonRetaken.LastSemester.Count)
                                currentYearForNonRetaken.FirstSemester.Add(cluster);
                            else
                                currentYearForNonRetaken.LastSemester.Add(cluster);
                        }

                        levelClusters.Remove(cluster);
                        addedAnyCluster = true;
                    }
                }

                // Break if no clusters were added in this iteration
                if (!addedAnyCluster)
                {
                    break;
                }
            } while (levelClusters.Any());

            // Remove clusters that cannot be added
            clusters.RemoveAll(cl => cl.Level == targetLevel && !studyRoute
                .SelectMany(sy => sy.FirstSemester.Concat(sy.LastSemester))
                .Any(sc => sc.Id == cl.Id));
        }

        private List<StudyYearDTO> ProcessLevel0Clusters(List<StudyYearDTO> studyYears, List<SmallClusterDTO> clusters)
        {
            // Filter Level 0 clusters
            var level0Clusters = clusters
                .Where(cl => cl.Level == ClusterLevel.Level0)
                .OrderBy(cl => cl.Name)
                .ToList();

            // Count Level 3 clusters across all years and semesters
            var level3ClusterCount = studyYears.Sum(sy =>
                sy.FirstSemester.Count(cl => cl.Level == ClusterLevel.Level3) +
                sy.LastSemester.Count(cl => cl.Level == ClusterLevel.Level3));

            // Check if there are any retaken clusters
            var hasRetakenClusters = studyYears
                .SelectMany(sy => sy.FirstSemester.Concat(sy.LastSemester))
                .Any(cl => cl.IsRetaken);

            // Only proceed if there are no retaken clusters and there are fewer than 2 level 3 clusters
            if (!hasRetakenClusters && level3ClusterCount < 2)
            {
                Console.WriteLine("Adding Level 0 clusters...");

                // Iterate through all study years and fill empty semesters with level 0 clusters
                foreach (var year in studyYears)
                {
                    if (level0Clusters.Count == 0) break;

                    // Add Level 0 clusters to first semester if there's space
                    if (year.FirstSemester.Count == 0 && level0Clusters.Count > 0)
                    {
                        year.FirstSemester.Add(level0Clusters.First());
                        level0Clusters.RemoveAt(0);
                        Console.WriteLine($"Added Level 0 cluster {year.FirstSemester.Last().Name} to First Semester.");
                    }

                    // Add Level 0 clusters to last semester if there's space
                    if (year.LastSemester.Count == 0 && level0Clusters.Count > 0)
                    {
                        year.LastSemester.Add(level0Clusters.First());
                        level0Clusters.RemoveAt(0);
                        Console.WriteLine($"Added Level 0 cluster {year.LastSemester.Last().Name} to Last Semester.");
                    }

                    // If all Level 0 clusters have been added, break the loop
                    if (level0Clusters.Count == 0) break;
                }
            }
            else
            {
                // add level 0 cluster on empty space
                foreach (var year in studyYears)
                {
                    if (year.FirstSemester.Count == 0 && level0Clusters.Count > 0)
                    {
                        year.FirstSemester.Add(level0Clusters.First());
                        level0Clusters.RemoveAt(0);
                    }

                    if (year.LastSemester.Count == 0 && level0Clusters.Count > 0)
                    {
                        year.LastSemester.Add(level0Clusters.First());
                        level0Clusters.RemoveAt(0);
                    }
                }
            }

            return studyYears;
        }
    }
}