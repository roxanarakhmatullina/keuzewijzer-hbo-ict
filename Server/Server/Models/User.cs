using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Server.Models;

public class User : IdentityUser
{
    [PersonalData]   
    [Required]
    [MinLength(1)]
    [MaxLength(40)]
    public string? FirstName { get; set; }
        
    [PersonalData]
    [Required]
    [MinLength(1)]
    [MaxLength(40)]
    public string? LastName { get; set; }
    
    public bool TwoFactorEnabled { get; set; }
        
    public string? TwoFactorSecretKey { get; set; }
}