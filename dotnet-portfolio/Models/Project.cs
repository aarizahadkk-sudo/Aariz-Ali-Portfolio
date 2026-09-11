using System.ComponentModel.DataAnnotations;

namespace PortfolioApp.Models;

public class Project
{
    [Key]
    public int Id { get; set; }

    [Required, StringLength(120)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required, StringLength(60)]
    public string Category { get; set; } = "Enterprise";

    /// <summary>
    /// Comma-separated list of tech tags, e.g. ".NET 9, EF Core, SQL Server, Docker"
    /// </summary>
    [Required]
    public string TechStackRaw { get; set; } = string.Empty;

    public string[] TechStack => TechStackRaw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

    public string ImageUrl { get; set; } = string.Empty;

    public string? LiveDemoUrl { get; set; }

    public string? GithubUrl { get; set; }

    public bool IsFeatured { get; set; } = false;

    public int DisplayOrder { get; set; } = 0;

    public string? Metrics { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}
