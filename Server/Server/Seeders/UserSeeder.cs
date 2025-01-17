using Microsoft.AspNetCore.Identity;

public class UserSeeder
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<UserSeeder> _logger;
    private readonly RoleManager<IdentityRole> _roleManager;
    
    public UserSeeder(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, ILogger<UserSeeder> logger)
    {
        _userManager = userManager;
        _logger = logger;
        _roleManager = roleManager;
    }

    public async Task SeedRootUserAsync()
    {
        var roles = new[] { "Admin", "Maintainer" };

        foreach (var role in roles)
        {
            var roleExist = await _roleManager.RoleExistsAsync(role);
            if (!roleExist)
            {
                var newRole = new IdentityRole(role);
                await _roleManager.CreateAsync(newRole);
            }
        }


        const string rootEmail = "root@keuzewijzerhboict.nl"; // Email for the root user
        const string rootUsername = "root";         // Username for the root user

        // Check if the root user already exists
        var existingUser = await _userManager.FindByNameAsync(rootUsername);
        if (existingUser == null)
        {
            // Generate a password that meets the default password policy
            var randomPassword = GenerateCompliantPassword();

            // Create the root user
            var rootUser = new IdentityUser
            {
                UserName = rootUsername,
                Email = rootEmail,
                EmailConfirmed = true,
            };

            var result = await _userManager.CreateAsync(rootUser, randomPassword);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(rootUser, "Admin");
                _logger.LogInformation($"Root user created successfully!");
                _logger.LogInformation($"Username: {rootUsername}");
                _logger.LogInformation($"Email: {rootEmail}");
                _logger.LogInformation($"Password: {randomPassword}");
            }
            else
            {
                _logger.LogError("Failed to create the root user:");
                foreach (var error in result.Errors)
                {
                    _logger.LogError($"- {error.Description}");
                }
            }
        }
        else
        {
            _logger.LogInformation("Root user already exists. No action taken.");
        }
    }

    private string GenerateCompliantPassword()
    {
        var random = new Random();
        var length = 12;

        // Generate a password with at least 1 uppercase, 1 special character, 1 digit
        string password = $"{GenerateRandomString(1, true)}"     // At least 1 uppercase letter
                          + $"{GenerateRandomString(1, false)}"    // At least 1 lowercase letter
                          + $"{GenerateRandomDigit()}"              // At least 1 digit
                          + $"{GenerateRandomSpecialChar()}"         // At least 1 special character
                          + $"{GenerateRandomString(length - 4, false)}";  // Fill the rest with lowercase letters

        // Shuffle the password to randomize the order
        password = new string(password.ToCharArray().OrderBy(c => random.Next()).ToArray());

        return password;
    }

    private string GenerateRandomString(int length, bool isUppercase)
    {
        var random = new Random();
        var chars = "abcdefghijklmnopqrstuvwxyz";
        if (isUppercase) chars = chars.ToUpper();
        return new string(Enumerable.Range(0, length).Select(_ => chars[random.Next(chars.Length)]).ToArray());
    }

    private string GenerateRandomDigit()
    {
        var random = new Random();
        var digits = "0123456789";
        return digits[random.Next(digits.Length)].ToString();
    }

    private string GenerateRandomSpecialChar()
    {
        var specialChars = "!@#$%^&*()_-+=<>?/|";
        var random = new Random();
        return specialChars[random.Next(specialChars.Length)].ToString();
    }
}