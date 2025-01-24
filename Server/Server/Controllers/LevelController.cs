using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Models;

namespace Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LevelController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public LevelController(DataContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetLevels()
    {
        var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var currentUser = await _userManager.FindByEmailAsync(email);
        var currentUserRole = await _userManager.GetRolesAsync(currentUser);
        if (!currentUserRole.Contains("Admin") && !currentUserRole.Contains("Maintainer"))
            return Forbid();
        
        var enumValues = Enum.GetValues(typeof(ClusterLevel));
        var enumList = new List<string>();

        foreach (var value in enumValues)
        {
            enumList.Add(value.ToString());
        }

        return Ok(enumList);
    }
}