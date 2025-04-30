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
    public class GraduateProfileController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public GraduateProfileController(DataContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        
        // GET: api/GraduateProfile
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<GraduateProfile>>> GetGraduateProfiles()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var returnGraduateProfiles = await _context.GraduateProfiles
                .Include(gp => gp.Cohorts)
                .Select(gp => new
                {
                    gp.Id,
                    gp.Name,
                    gp.Color,
                    gp.Zwolle,
                    gp.Almere,
                    cohortIds = gp.Cohorts.Select(ch => ch.Id)
                })
                .OrderBy(gp => gp.Name)
                .ToListAsync();
            return Ok(returnGraduateProfiles);
        }

        [HttpGet("{id}/cohorts/")]
        public async Task<ActionResult> GetGraduateProfileCohorts(Guid id)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var cohorts = await _context.Cohorts
                .Include(c => c.GraduateProfiles)
                .Where(c => c.GraduateProfiles.Any(gp => gp.Id == id))
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                })
                .ToListAsync();

            if (cohorts == null)
            {
                return NotFound();
            }

            return Ok(cohorts);
        }
        
        [HttpGet("{id}/clusters/")]
        [Authorize]
        public async Task<ActionResult> GetGraduateProfileClusters(Guid id)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var graduateProfile = await _context.GraduateProfiles
                .Include(gp => gp.Cohorts)
                .ThenInclude(c => c.Clusters)
                .FirstOrDefaultAsync(gp => gp.Id == id);
            if (graduateProfile == null)
            {
                return NotFound();
            }

            var clusters = graduateProfile.Cohorts
                .SelectMany(c => c.Clusters)
                .Select(cl => new
                {
                    cl.Id,
                    cl.Name,
                    cl.Link,
                    cl.Zwolle,
                    cl.Almere,
                });

            return Ok(clusters);
        }

        // GET: api/GraduateProfile/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<GraduateProfile>> GetGraduateProfile(Guid id)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var graduateProfile = await _context.GraduateProfiles.FindAsync(id);

            if (graduateProfile == null)
            {
                return NotFound();
            }

            return graduateProfile;
        }

        // PUT: api/GraduateProfile/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutGraduateProfile(Guid id, GraduateProfile graduateProfile)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            if (id != graduateProfile.Id)
            {
                return BadRequest();
            }

            _context.Entry(graduateProfile).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GraduateProfileExists(id))
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

        [HttpPost("{id}")]
        [Authorize]
        public async Task<IActionResult> EditGraduateProfile(Guid id, GraduateProfileDTO graduate)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var graduateProfile = await _context.GraduateProfiles
                .Include(g => g.Cohorts) // Include Cohorts to check existing relationships
                .FirstOrDefaultAsync(g => g.Id == id);
    
            if (graduateProfile == null)
            {
                return NotFound();
            }

            graduateProfile.Name = graduate.Name;
            graduateProfile.Color = graduate.Color;
            graduateProfile.Link = graduate.Link;
            graduateProfile.Zwolle = graduate.Zwolle;
            graduateProfile.Almere = graduate.Almere;

            // Fetch Cohorts from the database using the provided cohort IDs
            var cohorts = await _context.Cohorts
                .Where(c => graduate.CohortIds.Contains(c.Id))
                .ToListAsync();

            if (cohorts.Count != graduate.CohortIds.Count)
            {
                return BadRequest("Some cohort IDs are invalid.");
            }

            // Remove Cohorts that are no longer associated with this GraduateProfile
            graduateProfile.Cohorts.Where(c => !graduate.CohortIds.Contains(c.Id))
                .ToList()
                .ForEach(c => graduateProfile.Cohorts.Remove(c));

            // Add new Cohorts that are not already associated
            foreach (var cohort in cohorts)
            {
                if (!graduateProfile.Cohorts.Contains(cohort))
                {
                    graduateProfile.Cohorts.Add(cohort);
                }
            }

            _context.Entry(graduateProfile).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GraduateProfileExists(id))
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

        // POST: api/GraduateProfile
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> PostGraduateProfile(GraduateProfileDTO graduateProfile)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var graduateProfileExists = await _context.GraduateProfiles.FirstOrDefaultAsync(e => e.Name == graduateProfile.Name);
            if(graduateProfileExists != null)
            {
                return BadRequest("Graduate profile already exists");
            }
            
            var cohorts = await _context.Cohorts
                .Where(c => graduateProfile.CohortIds.Contains(c.Id))
                .ToListAsync();
            
            GraduateProfile newGraduateProfile = new GraduateProfile
            {
                Name = graduateProfile.Name,
                Color = graduateProfile.Color,
                Link = graduateProfile.Link,
                Zwolle = graduateProfile.Zwolle,
                Almere = graduateProfile.Almere,
                Cohorts = cohorts,
            };
            
            _context.Add(newGraduateProfile);
            try {
                await _context.SaveChangesAsync();
            } catch (Exception e) {
                return BadRequest(e.Message);
            }

            return Ok();
        }

        // DELETE: api/GraduateProfile/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteGraduateProfile(Guid id)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var currentUser = await _userManager.FindByEmailAsync(email);
            var currentUserRole = await _userManager.GetRolesAsync(currentUser);
            if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
                return Forbid();
            
            var graduateProfile = await _context.GraduateProfiles.FindAsync(id);
            if (graduateProfile == null)
            {
                return NotFound();
            }

            _context.GraduateProfiles.Remove(graduateProfile);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GraduateProfileExists(Guid id)
        {
            return _context.GraduateProfiles.Any(e => e.Id == id);
        }
    }
}

