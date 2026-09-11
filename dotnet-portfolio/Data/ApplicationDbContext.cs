using Microsoft.EntityFrameworkCore;
using PortfolioApp.Models;

namespace PortfolioApp.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Profile>().HasData(new Profile
        {
            Id = 1,
            Name = "Aariz Ahad",
            Title = "Principal Full-Stack .NET Architect",
            Headline = "Engineering mission-critical enterprise systems with ASP.NET Core, EF Core & Distributed Cloud Architectures.",
            Bio = "Passionate Principal Software Engineer with 8+ years designing high-throughput distributed microservices, domain-driven enterprise architectures, and responsive web platforms. Specializing in modern .NET 9, Entity Framework Core, Azure PaaS, and robust event-driven backend ecosystems.",
            Location = "Available Globally / Remote",
            Email = "Aarizahadkk@gmail.com",
            AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
            GithubUrl = "https://github.com/aarizahad",
            LinkedinUrl = "https://linkedin.com/in/aarizahad",
            YearsExperience = 8,
            CompletedProjects = 45,
            OpenForOpportunities = true,
            UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });

        modelBuilder.Entity<AdminUser>().HasData(new AdminUser
        {
            Id = 1,
            Email = "admin@portfolio.net",
            // BCrypt hashed default password: "admin123"
            PasswordHash = "$2a$11$q9hBqJ37fU3gH5vM8m4Iqe.r6kP0Qo5B7Q2Hj.h4PzZ6dF1lK7yCe",
            LastLoginAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });
    }

    public static async Task SeedInitialDataAsync(ApplicationDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (!await context.Projects.AnyAsync())
        {
            var seedProjects = new List<Project>
            {
                new Project
                {
                    Title = "NexusCore Cloud ERP & Billing Engine",
                    Description = "Enterprise resource planning engine handling multi-tenant recurring billing, audit logging, and financial ledger calculations using ASP.NET Core Web API, EF Core, and SQL Server.",
                    Category = "Enterprise",
                    TechStackRaw = ".NET 9, ASP.NET Core, EF Core, SQL Server, Redis, Docker",
                    ImageUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
                    LiveDemoUrl = "https://nexuscore-demo.azurewebsites.net",
                    GithubUrl = "https://github.com/aarizahad/nexuscore-erp",
                    IsFeatured = true,
                    DisplayOrder = 1,
                    Metrics = "99.99% Uptime · 15ms Avg Latency",
                    CreatedAt = DateTime.UtcNow.AddMonths(-3)
                },
                new Project
                {
                    Title = "AuraPay Distributed Microservices Gateway",
                    Description = "High-throughput payment gateway utilizing CQRS, MediatR, and RabbitMQ message queues. Includes resilient circuit breaker patterns via Polly and tokenized PCI-DSS compliant processing.",
                    Category = "Microservices",
                    TechStackRaw = "C# 13, MediatR, RabbitMQ, Polly, PostgreSQL, Kubernetes",
                    ImageUrl = "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
                    LiveDemoUrl = "https://aurapay-gateway.azurewebsites.net",
                    GithubUrl = "https://github.com/aarizahad/aurapay-microservices",
                    IsFeatured = true,
                    DisplayOrder = 2,
                    Metrics = "12,000+ Transactions / Sec",
                    CreatedAt = DateTime.UtcNow.AddMonths(-5)
                },
                new Project
                {
                    Title = "Vanguard Health Telemetry Portal",
                    Description = "Real-time patient biometric tracking and medical audit platform built with ASP.NET Core SignalR hubs, EF Core code-first migrations, and a responsive Bootstrap 5 glassmorphism clinical cockpit.",
                    Category = "Full-Stack",
                    TechStackRaw = "ASP.NET Core MVC, SignalR, EF Core, Bootstrap 5, Azure IoT",
                    ImageUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
                    LiveDemoUrl = "https://vanguard-telemetry.azurewebsites.net",
                    GithubUrl = "https://github.com/aarizahad/vanguard-health-portal",
                    IsFeatured = true,
                    DisplayOrder = 3,
                    Metrics = "Real-Time Biometric Streams",
                    CreatedAt = DateTime.UtcNow.AddMonths(-7)
                }
            };

            await context.Projects.AddRangeAsync(seedProjects);
            await context.SaveChangesAsync();
        }
    }
}
