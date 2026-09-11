using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApp.Data;
using PortfolioApp.Models;

namespace PortfolioApp.Controllers;

public class HomeController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<HomeController> _logger;

    public HomeController(ApplicationDbContext context, ILogger<HomeController> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IActionResult> Index()
    {
        var profile = await _context.Profiles.FirstOrDefaultAsync() ?? new Profile();
        var projects = await _context.Projects
            .OrderByDescending(p => p.IsFeatured)
            .ThenBy(p => p.DisplayOrder)
            .ToListAsync();

        var categories = projects.Select(p => p.Category).Distinct().ToList();

        var model = new HomeViewModel
        {
            Profile = profile,
            Projects = projects,
            AllCategories = categories
        };

        return View(model);
    }

    [HttpGet]
    public async Task<IActionResult> GetProjectsJson()
    {
        var projects = await _context.Projects
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Description,
                p.Category,
                TechStack = p.TechStack,
                p.ImageUrl,
                p.LiveDemoUrl,
                p.GithubUrl,
                p.IsFeatured,
                p.Metrics
            })
            .ToListAsync();

        return Json(projects);
    }
}
