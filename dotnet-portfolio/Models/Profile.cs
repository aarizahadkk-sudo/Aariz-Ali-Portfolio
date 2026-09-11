using System.ComponentModel.DataAnnotations;

namespace PortfolioApp.Models;

public class Profile
{
    [Key]
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; } = "Aariz Ahad";

    [Required, StringLength(150)]
    public string Title { get; set; } = "Principal Full-Stack .NET Architect";

    [Required, StringLength(300)]
    public string Headline { get; set; } = "Engineering mission-critical enterprise systems with ASP.NET Core, EF Core & Distributed Cloud Architectures.";

    [Required]
    public string Bio { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = "Aarizahadkk@gmail.com";

    public string Location { get; set; } = "Available Globally / Remote";

    public string AvatarUrl { get; set; } = string.Empty;

    [Url]
    public string GithubUrl { get; set; } = "https://github.com/aarizahad";

    [Url]
    public string LinkedinUrl { get; set; } = "https://linkedin.com/in/aarizahad";

    public int YearsExperience { get; set; } = 8;

    public int CompletedProjects { get; set; } = 45;

    public bool OpenForOpportunities { get; set; } = true;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
