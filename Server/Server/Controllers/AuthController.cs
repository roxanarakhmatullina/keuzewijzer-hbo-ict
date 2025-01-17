using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Services;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly DataContext _context;
    private readonly EmailService _emailService;

    public AuthController(UserManager<IdentityUser> userManager, IConfiguration configuration, DataContext context, EmailService emailService)
    {
        _userManager = userManager;
        _configuration = configuration;
        _context = context;
        _emailService = emailService;
        WarmUp();
    }

    [HttpGet("Users")]
    [Authorize]
    public async Task<IActionResult> GetUsers()
    {
        var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var currentUser = await _userManager.FindByEmailAsync(email);
        var currentUserRole = await _userManager.GetRolesAsync(currentUser);
        if (!currentUserRole.Contains("Admin"))
            return Forbid();
        
        var users = _context.Users
            .Select(u => new
            {
                u.Id,
                u.Email
            })
            .ToList(); // Retrieve user data first

        // Get roles for each user asynchronously
        var userRoles = new List<object>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(user.Id));
            userRoles.Add(new
            {
                user.Id,
                user.Email,
                Role = roles
            });
        }

        return Ok(userRoles);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            return Unauthorized("Invalid credentials");

        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }
    
    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        // Get the email of the user
        var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
    
        // Get the role of the user
        var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        
        var twoFactorEnabled = User.Claims.FirstOrDefault(c => c.Type == "TwoFactorEnabled")?.Value;

        if (string.IsNullOrEmpty(email))
        {
            return NotFound("Email not found in claims.");
        }

        if (string.IsNullOrEmpty(role))
        {
            return NotFound("Role not found in claims.");
        }

        return Ok(new { Email = email, Role = role, TwoFactorAuthentication = twoFactorEnabled });
    }
    
    private async Task WarmUp() {
        var subject = "Account Keuzewijzer";
        var body = "Warm up";

        await _emailService.SendEmailAsync("noreply.keuzewijzer@gmail.com", subject, body);
    }
    
    [HttpPost("create-user")]
    [Authorize]
    public async Task<IActionResult> CreateUser([FromBody] RegisterModel register)
    {
        var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var currentUser = await _userManager.FindByEmailAsync(email);
        var currentUserRole = await _userManager.GetRolesAsync(currentUser);
        if (!currentUserRole.Contains("Admin"))
            return Forbid();
        
        var user = new IdentityUser { UserName = register.Email, Email = register.Email };
        // create random password with uppercases, lowercases, numbers and special characters
        var password = RandomPassword();
        
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);
        
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == register.Role);
        
        await _userManager.AddToRoleAsync(user, role.Name);
        
        // send email
        var subject = "Account Keuzewijzer";
        var body = $"Welkom bij de Keuzewijzer, Je account is aangemaakt. Je kunt inloggen met je e-mailadres en het volgende wachtwoord:  {password} Na dat je bent ingelogd, kun je je wachtwoord wijzigen. Met vriendelijke groet, Keuzewijzer";
        
        await _emailService.SendEmailAsync(register.Email, subject, body);
        
        return Ok("User created successfully");
    }

    private string GenerateJwtToken(IdentityUser user)
    {
        var secretKey = _configuration["JWT_SECRET"];  // Read secret from environment variable
        if (string.IsNullOrEmpty(secretKey))
        {
            throw new ArgumentException("JWT Secret is missing or empty in the environment variables.");
        }

        var authClaims = new[]
        {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, _userManager.GetRolesAsync(user).Result.FirstOrDefault()),
            new Claim("TwoFactorEnabled", user.TwoFactorEnabled.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Ensure the key length is valid
        var keyBytes = Encoding.UTF8.GetBytes(secretKey);
        if (keyBytes.Length < 16)
        {
            throw new ArgumentException("JWT Secret key is too short. It should be at least 16 bytes.");
        }

        var authSigningKey = new SymmetricSecurityKey(keyBytes);

        var expirationTime = DateTime.UtcNow.AddHours(2);
        
        var token = new JwtSecurityToken(
            issuer: _configuration["JWT_ISSUER"],  // Access issuer from environment variable
            audience: _configuration["JWT_AUDIENCE"],  // Access audience from environment variable
            expires: expirationTime,
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string RandomPassword(int length = 12)
    {
        const string validCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+[]{}|;:,.<>?";
        StringBuilder passwordBuilder = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < length; i++)
        {
            int index = random.Next(validCharacters.Length);
            passwordBuilder.Append(validCharacters[index]);
        }

        return passwordBuilder.ToString();
    }

    [HttpGet("roles")]
    [Authorize]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _context.Roles
            .Select(r => new
            {
                r.Id,
                r.Name
            })
            .ToListAsync();

        return Ok(roles);
    } 
    
    [HttpDelete("delete-user/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteUser(string id)
    {
        
        // if delete user is the same as the logged in user, return forbidden
        var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var currentUser = await _userManager.FindByEmailAsync(email);
        if (currentUser.Id == id)
            return Forbid();
        
        // check if current user's role is 'Admin'
        var currentUserRole = await _userManager.GetRolesAsync(currentUser);
        if (!currentUserRole.Contains("Admin"))
            return Forbid();
        
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound("User not found");

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok("User deleted successfully");
    }
    
    
    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
    {
        var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var currentUser = await _userManager.FindByEmailAsync(email);
        if (currentUser == null)
            return Forbid();

        var result = await _userManager.ChangePasswordAsync(currentUser, model.OldPassword, model.NewPassword);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok("Password changed successfully");
    }
}

public class RegisterModel
{
    public string Email { get; set; }
    public string Role { get; set; }
}

public class LoginModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class ChangePasswordModel
{
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}
