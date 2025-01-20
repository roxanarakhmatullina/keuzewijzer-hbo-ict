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
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Level,
                })
                .OrderBy(c => c.Level)
                .ThenBy(c => c.Name)
                .ToListAsync();

            return Ok(clusters);
        }

        // GET: api/Cluster/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Cluster>> GetCluster(Guid id)
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

            var clusterDto = new
            {
                cluster.Id,
                cluster.Name,
                cluster.Link,
                cluster.FirstSemester,
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
            cluster.IsFreeChoice = clusterDto.IsFreeChoice;
            cluster.IsLocked = clusterDto.IsLocked;
            cluster.Level = clusterDto.Level;

            // Fetch new prerequisites and check existing ones
            var newPrerequisites = await _context.Clusters
                .Where(c => clusterDto.PrerequisiteIds.Contains(c.Id))
                .ToListAsync();

            // Get current prerequisites
            var existingPrerequisites = cluster.ClusterPrerequisites.Select(cp => cp.Prerequisite).ToList();

            // Add new prerequisites that aren't already in the existing list
            foreach (var newPrerequisite in newPrerequisites)
            {
                if (!existingPrerequisites.Contains(newPrerequisite))
                {
                    // Check if this prerequisite is already in the ClusterPrerequisites table
                    if (!_context.ClusterPrerequisites.Any(cp =>
                            cp.ClusterId == cluster.Id && cp.PrerequisiteId == newPrerequisite.Id))
                    {
                        cluster.ClusterPrerequisites.Add(new ClusterPrerequisite
                        {
                            Cluster = cluster,
                            Prerequisite = newPrerequisite
                        });
                    }
                }
            }

            // Remove prerequisites that are no longer in the new list
            foreach (var existingPrerequisite in existingPrerequisites)
            {
                if (!clusterDto.PrerequisiteIds.Contains(existingPrerequisite.Id))
                {
                    var clusterPrerequisite =
                        cluster.ClusterPrerequisites.First(cp => cp.PrerequisiteId == existingPrerequisite.Id);
                    cluster.ClusterPrerequisites.Remove(clusterPrerequisite);
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
        public async Task<ActionResult<Cluster>> PostCluster([FromBody] ClusterDTO clusterDto)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();

            var prerequisites = await _context.Clusters
                .Where(c => clusterDto.PrerequisiteIds.Contains(c.Id))
                .ToListAsync();

            var graduateProfiles = await _context.GraduateProfiles
                .Where(g => clusterDto.GraduateProfileIds.Contains(g.Id))
                .ToListAsync();

            var cohorts = await _context.Cohorts
                .Where(co => clusterDto.CohortIds.Contains(co.Id))
                .ToListAsync();

            var newCluster = new Cluster
            {
                Name = clusterDto.Name,
                Link = clusterDto.Link,
                FirstSemester = clusterDto.FirstSemester,
                LastSemester = clusterDto.LastSemester,
                IsFreeChoice = clusterDto.IsFreeChoice,
                IsLocked = clusterDto.IsLocked,
                Level = clusterDto.Level,
                ClusterPrerequisites = prerequisites.Select(p => new ClusterPrerequisite
                {
                    Cluster = null,
                    Prerequisite = p
                }).ToList(),
                GraduateProfiles = graduateProfiles,
                Cohorts = cohorts
            };

            _context.Clusters.Add(newCluster);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCluster), new { id = newCluster.Id }, newCluster);
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