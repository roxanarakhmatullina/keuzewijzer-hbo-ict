using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClusterController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public ClusterController(DataContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Cluster
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Cluster>>> GetClusters()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();

            var clusters = await _context.Clusters
                .Include(cl => cl.GraduateProfiles)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Level,
                    Colors = c.GraduateProfiles.Select(gp => gp.Color)
                })
                .OrderBy(c => c.Level)
                .ThenBy(c => c.Name)
                .ToListAsync();

            return Ok(clusters);
        }

        // GET: api/Cluster/{id}
        [HttpGet("{id}")]
        // The endpoint is commented out to allow access without authorization for client use
        //[Authorize]
        public async Task<ActionResult<Cluster>> GetCluster(Guid id)
        {
            //TODO: Check if user is admin or maintainer
            // var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            // var currentUser = await _userManager.FindByEmailAsync(email);
            // var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            // if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
            //     return Forbid();

            var cluster = await _context.Clusters
                .Include(c => c.ClusterPrerequisites)
                .Include(c => c.GraduateProfiles)
                .Include(c => c.Cohorts)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cluster == null)
                return NotFound();

            var clusterDto = new
            {
                cluster.Id,
                cluster.Name,
                cluster.Link,
                cluster.FirstSemester,
                cluster.Zwolle,
                cluster.Almere,
                cluster.LastSemester,
                cluster.IsLocked,
                cluster.IsFreeChoice,
                cluster.Level,
                PrerequisiteIds = cluster.ClusterPrerequisites.Select(cp => cp.PrerequisiteId).ToList(),
                GraduateProfileIds = cluster.GraduateProfiles.Select(g => g.Id).ToList(),
                CohortIds = cluster.Cohorts.Select(co => co.Id).ToList()
            };

            return Ok(clusterDto);
        }

        // PUT: api/Cluster/{id}
        [HttpPost("{id}")]
        [Authorize]
        public async Task<IActionResult> PutCluster(Guid id, [FromBody] ClusterDTO clusterDto)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();

            var cluster = await _context.Clusters
                .Include(c => c.ClusterPrerequisites)
                .Include(c => c.GraduateProfiles)
                .Include(c => c.Cohorts)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cluster == null)
                return NotFound();

            // Update basic properties
            cluster.Name = clusterDto.Name;
            cluster.Link = clusterDto.Link;
            cluster.FirstSemester = clusterDto.FirstSemester;
            cluster.LastSemester = clusterDto.LastSemester;
            cluster.Zwolle = clusterDto.Zwolle;
            cluster.Almere = clusterDto.Almere;
            cluster.IsFreeChoice = clusterDto.IsFreeChoice;
            cluster.IsLocked = clusterDto.IsLocked;
            cluster.Level = clusterDto.Level;

            var graduateProfiles = await _context.GraduateProfiles
                .Where(g => clusterDto.GraduateProfileIds.Contains(g.Id))
                .ToListAsync();

            var cohorts = await _context.Cohorts
                .Where(co => clusterDto.CohortIds.Contains(co.Id))
                .ToListAsync();

            // Fetch new prerequisites and check existing ones
            var newPrerequisites = await _context.Clusters
                .Where(c => clusterDto.PrerequisiteIds.Contains(c.Id))
                .ToListAsync();

            cluster.GraduateProfiles = graduateProfiles;
            cluster.Cohorts = cohorts;

            // get cluster prerequisites
            var clusterPrerequisites = cluster.ClusterPrerequisites.ToList();
            
            // Remove prerequisites that are not in the new list
            foreach (var cp in clusterPrerequisites)
            {
                if (!clusterDto.PrerequisiteIds.Contains(cp.PrerequisiteId))
                {
                    cluster.ClusterPrerequisites.Remove(cp);
                }
            }
            
            // Add new prerequisites that are not in the old list
            foreach (var newPrerequisite in newPrerequisites)
            {
                if (!clusterPrerequisites.Any(cp => cp.PrerequisiteId == newPrerequisite.Id))
                {
                    cluster.ClusterPrerequisites.Add(new ClusterPrerequisite
                    {
                        Cluster = cluster,
                        Prerequisite = newPrerequisite
                    });
                }
            }
            
            

            // Update GraduateProfiles and Cohorts similarly (same logic as before)
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClusterExists(id))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        // POST: api/Cluster
        [HttpPost]
        [Authorize]
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Cluster>> PostCluster([FromBody] ClusterDTO clusterDto)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();

            // Fetch prerequisites, graduate profiles, and cohorts by their IDs
            var prerequisites = await _context.Clusters
                .Where(c => clusterDto.PrerequisiteIds.Contains(c.Id))
                .ToListAsync();

            var graduateProfiles = await _context.GraduateProfiles
                .Where(g => clusterDto.GraduateProfileIds.Contains(g.Id))
                .ToListAsync();

            var cohorts = await _context.Cohorts
                .Where(co => clusterDto.CohortIds.Contains(co.Id))
                .ToListAsync();

            // Create the new Cluster entity
            var newCluster = new Cluster
            {
                Name = clusterDto.Name,
                Link = clusterDto.Link,
                FirstSemester = clusterDto.FirstSemester,
                LastSemester = clusterDto.LastSemester,
                Zwolle = clusterDto.Zwolle,
                Almere = clusterDto.Almere,
                IsFreeChoice = clusterDto.IsFreeChoice,
                IsLocked = clusterDto.IsLocked,
                Level = clusterDto.Level,
                // Assign the relationships without causing circular references
                ClusterPrerequisites = prerequisites.Select(p => new ClusterPrerequisite
                {
                    Prerequisite = p // Only store the reference to the prerequisite
                }).ToList(),
                GraduateProfiles = graduateProfiles,
                Cohorts = cohorts
            };

            // Add the new cluster to the context
            _context.Clusters.Add(newCluster);
            await _context.SaveChangesAsync();

            // Return the created cluster without any unnecessary circular references
            var clusterDtoResult = new
            {
                newCluster.Id,
                newCluster.Name,
                newCluster.Link,
                newCluster.FirstSemester,
                newCluster.LastSemester,
                newCluster.Zwolle,
                newCluster.Almere, 
                newCluster.IsFreeChoice,
                newCluster.IsLocked,
                newCluster.Level,
                PrerequisiteIds = newCluster.ClusterPrerequisites.Select(cp => cp.PrerequisiteId).ToList(),
                GraduateProfileIds = newCluster.GraduateProfiles.Select(g => g.Id).ToList(),
                CohortIds = newCluster.Cohorts.Select(co => co.Id).ToList()
            };

            return CreatedAtAction(nameof(GetCluster), new { id = newCluster.Id }, clusterDtoResult);
        }

        // DELETE: api/Cluster/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCluster(Guid id)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();

            var cluster = await _context.Clusters.FindAsync(id);

            if (cluster == null)
                return NotFound();

            _context.Clusters.Remove(cluster);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool ClusterExists(Guid id)
        {
            return _context.Clusters.Any(e => e.Id == id);
        }
    }
}