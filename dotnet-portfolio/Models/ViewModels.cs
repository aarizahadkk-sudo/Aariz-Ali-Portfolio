using System.ComponentModel.DataAnnotations;

namespace PortfolioApp.Models;

public class AdminUser
{
    [Key]
    public int Id { get; set; }

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;
}

public class LoginViewModel
{
    [Required, EmailAddress]
    [Display(Name = "Email Address")]
    public string Email { get; set; } = string.Empty;

    [Required, DataType(DataType.Password)]
    [Display(Name = "Password")]
    public string Password { get; set; } = string.Empty;

    [Display(Name = "Remember this device")]
    public bool RememberMe { get; set; } = false;

    public string? ReturnUrl { get; set; }
}

public class HomeViewModel
{
    public Profile Profile { get; set; } = null!;
    public List<Project> Projects { get; set; } = new();
    public List<string> AllCategories { get; set; } = new();
}
