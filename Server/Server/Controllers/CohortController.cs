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
    public class CohortController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public CohortController(DataContext context, UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET: api/Cohort
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cohort>>> GetCohorts()
        {
            var cohorts = await _context.Cohorts
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.isAvailable
                })
                .Where(c => c.isAvailable == true)
                .OrderByDescending(ch => ch.Name)
                .ToListAsync();

            return Ok(cohorts);
        }
        
        [HttpGet("dashboard")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Cohort>>> GetDashboardCohorts()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var cohorts = await _context.Cohorts
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.isAvailable
                })
                .OrderByDescending(ch => ch.Name)
                .ToListAsync();

            return Ok(cohorts);
        }

        [HttpGet("{cohortId}/graduateProfiles")]
        public async Task<ActionResult> GetCohortGraduateProfiles(Guid cohortId)
        {
            var graduateProfiles = await _context.GraduateProfiles
                .Include(gp => gp.Cohorts)
                .Where(gp => gp.Cohorts.Any(c => c.Id == cohortId))
                .Select(gp => new
                {
                    gp.Id,
                    gp.Name,
                    gp.Color,
                    gp.Link,
                })
                .OrderBy(ch => ch.Name)
                .ToListAsync();

            if (graduateProfiles == null || !graduateProfiles.Any())
            {
                return NotFound(new { message = "No graduate profiles found for the given cohort ID." });
            }
            return Ok(graduateProfiles);
        }

        [HttpGet("{id}/clusters")]
        [Authorize]
        public async Task<ActionResult> GetCohortClusters(Guid id)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var clusters = await _context.Clusters
                .Include(cl => cl.Cohorts)
                .Where(cl => cl.Cohorts.Any(c => c.Id == id))
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Link,
                    c.Level,
                })
                .OrderBy(c => c.Level)
                .ThenBy(c => c.Name)
                .ToListAsync();

            if (clusters == null)
            {
                return NotFound();
            }
            
            return Ok(clusters);
        }


        // GET: api/Cohort/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Cohort>> GetCohort(Guid id)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var cohort = await _context.Cohorts.FindAsync(id);

            if (cohort == null)
            {
                return NotFound();
            }

            return cohort;
        }

        // PUT: api/Cohort/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutCohort(Guid id, Cohort cohort)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            if (id != cohort.Id)
            {
                return BadRequest();
            }

            _context.Entry(cohort).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CohortExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Cohort
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateCohort([FromBody] CohortDTO cohort)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var cohortExists = await _context.Cohorts.FirstOrDefaultAsync(c => c.Name.Equals(cohort.Name));
            if(cohortExists != null)
            {
                return BadRequest("Cohort already exists");
            }

            Cohort newCohort = new Cohort()
            {
                Name = cohort.Name
            };
            _context.Add(newCohort);
            try
            {
                await _context.SaveChangesAsync();
            } catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            
            return Ok();
        }
        
        [HttpPost("{id}")]
        [Authorize]
        public async Task<IActionResult> EditCohort(Guid id, Cohort cohort)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            if (id != cohort.Id)
            {
                return BadRequest();
            }

            _context.Entry(cohort).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CohortExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Cohort/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCohort(Guid id)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var cohort = await _context.Cohorts.FindAsync(id);
            if (cohort == null)
            {
                return NotFound();
            }

            _context.Cohorts.Remove(cohort);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CohortExists(Guid id)
        {
            return _context.Cohorts.Any(e => e.Id == id);
        }
    }
}
