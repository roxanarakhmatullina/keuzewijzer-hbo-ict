using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
                    c.Level
                })
                .OrderBy(c => c.Level)
                .ThenBy(c => c.Name)
                .ToListAsync();
            return Ok(clusters);
        }

        // GET: api/Cluster/5
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
                .Include(c => c.Cohorts)
                .Include(c => c.GraduateProfiles)
                .Include(c => c.Prerequisites)
                .FirstOrDefaultAsync(cl => cl.Id == id);

            if (cluster == null)
            {
                return BadRequest();
            }
            
            var clusterObject = new
            {
                Id = cluster.Id,
                Name = cluster.Name,
                Link = cluster.Link,
                FirstSemester = cluster.FirstSemester,
                LastSemester = cluster.LastSemester,
                IsLocked = cluster.IsLocked,
                IsFreeChoice = cluster.IsFreeChoice,
                Level = cluster.Level,
                CohortIds = cluster.Cohorts.Select(c => c.Id).ToList(),
                GraduateProfileIds = cluster.GraduateProfiles.Select(g => g.Id).ToList(),
                PrerequisiteIds = cluster.Prerequisites.Select(p => p.Id).ToList(),
            };
            
            return Ok(clusterObject);
        }

        // PUT: api/Cluster/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{id}")]
        [Authorize]
        public async Task<IActionResult> PutCluster(Guid id, [FromBody] ClusterDTO cluster)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var cohorts = new List<Cohort>();
            var graduateProfiles = new List<GraduateProfile>();
            var prerequisites = new List<Cluster>();
            try
            {
                cohorts = await _context.Cohorts
                    .Where(c => cluster.CohortIds.Contains(c.Id))
                    .ToListAsync();

                graduateProfiles = await _context.GraduateProfiles
                    .Where(g => cluster.GraduateProfileIds.Contains(g.Id))
                    .ToListAsync();
                prerequisites = await _context.Clusters
                    .Where(c => cluster.PrerequisiteIds.Contains(c.Id))
                    .ToListAsync();
            } catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            var clusterToUpdate = await _context.Clusters
                .Include(c => c.Cohorts)
                .Include(c => c.GraduateProfiles)
                .Include(c => c.Prerequisites)
                .FirstOrDefaultAsync(cl => cl.Id == id);

            if (clusterToUpdate == null)
            {
                return BadRequest();
            }

            clusterToUpdate.Name = cluster.Name;
            clusterToUpdate.Link = cluster.Link;
            clusterToUpdate.FirstSemester = cluster.FirstSemester;
            clusterToUpdate.LastSemester = cluster.LastSemester;
            clusterToUpdate.IsLocked = cluster.IsLocked;
            clusterToUpdate.IsFreeChoice = cluster.IsFreeChoice;
            clusterToUpdate.Level = cluster.Level;
            clusterToUpdate.Prerequisites = prerequisites;
            clusterToUpdate.Cohorts = cohorts;
            clusterToUpdate.GraduateProfiles = graduateProfiles;

            try
            {
                await _context.SaveChangesAsync();
            } catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            return Ok();
        }

        // POST: api/Cluster
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Cluster>> PostCluster([FromBody] ClusterDTO cluster)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var cohorts = new List<Cohort>();
            var graduateProfiles = new List<GraduateProfile>();
            var prerequisites = new List<Cluster>();
            try
            {
                cohorts = await _context.Cohorts
                    .Where(c => cluster.CohortIds.Contains(c.Id))
                    .ToListAsync();

                graduateProfiles = await _context.GraduateProfiles
                    .Where(g => cluster.GraduateProfileIds.Contains(g.Id))
                    .ToListAsync();
                prerequisites = await _context.Clusters
                    .Where(c => cluster.PrerequisiteIds.Contains(c.Id))
                    .ToListAsync();
            } catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            Cluster newCluster = new Cluster
            {
                Name = cluster.Name,
                Link = cluster.Link,
                FirstSemester = cluster.FirstSemester,
                LastSemester = cluster.LastSemester,
                IsLocked = cluster.IsLocked,
                IsFreeChoice = cluster.IsFreeChoice,
                Level = cluster.Level,
                Prerequisites = prerequisites,
                Cohorts = cohorts,
                GraduateProfiles = graduateProfiles,
            };
            
            
            _context.Add(newCluster);

            try
            {
                await _context.SaveChangesAsync();
            } catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            return Ok();
        }

        // DELETE: api/Cluster/5
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
            {
                return NotFound();
            }

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
