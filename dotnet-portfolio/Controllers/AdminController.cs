using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApp.Data;
using PortfolioApp.Models;

namespace PortfolioApp.Controllers;

[Authorize]
public class AdminController : Controller
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: /Admin
    public async Task<IActionResult> Index()
    {
        var profile = await _context.Profiles.FirstOrDefaultAsync() ?? new Profile();
        var projects = await _context.Projects.OrderBy(p => p.DisplayOrder).ToListAsync();

        ViewBag.Profile = profile;
        return View(projects);
    }

    // POST: /Admin/UpdateProfile
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateProfile(Profile model)
    {
        if (!ModelState.IsValid)
        {
            TempData["Error"] = "Invalid profile fields. Please check your inputs.";
            return RedirectToAction(nameof(Index));
        }

        var existing = await _context.Profiles.FirstOrDefaultAsync(p => p.Id == model.Id);
        if (existing == null)
        {
            model.UpdatedAt = DateTime.UtcNow;
            _context.Profiles.Add(model);
        }
        else
        {
            existing.Name = model.Name;
            existing.Title = model.Title;
            existing.Headline = model.Headline;
            existing.Bio = model.Bio;
            existing.Location = model.Location;
            existing.Email = model.Email;
            existing.AvatarUrl = model.AvatarUrl;
            existing.GithubUrl = model.GithubUrl;
            existing.LinkedinUrl = model.LinkedinUrl;
            existing.YearsExperience = model.YearsExperience;
            existing.CompletedProjects = model.CompletedProjects;
            existing.OpenForOpportunities = model.OpenForOpportunities;
            existing.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        TempData["Success"] = "Profile successfully updated.";
        return RedirectToAction(nameof(Index));
    }

    // GET: /Admin/CreateProject
    public IActionResult CreateProject()
    {
        return View("ProjectForm", new Project());
    }

    // POST: /Admin/CreateProject
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateProject(Project project)
    {
        if (ModelState.IsValid)
        {
            project.CreatedAt = DateTime.UtcNow;
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            TempData["Success"] = $"Project '{project.Title}' created successfully.";
            return RedirectToAction(nameof(Index));
        }

        return View("ProjectForm", project);
    }

    // GET: /Admin/EditProject/5
    public async Task<IActionResult> EditProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();
        return View("ProjectForm", project);
    }

    // POST: /Admin/EditProject/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditProject(int id, Project project)
    {
        if (id != project.Id) return BadRequest();

        if (ModelState.IsValid)
        {
            var existing = await _context.Projects.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = project.Title;
            existing.Description = project.Description;
            existing.Category = project.Category;
            existing.TechStackRaw = project.TechStackRaw;
            existing.ImageUrl = project.ImageUrl;
            existing.LiveDemoUrl = project.LiveDemoUrl;
            existing.GithubUrl = project.GithubUrl;
            existing.IsFeatured = project.IsFeatured;
            existing.DisplayOrder = project.DisplayOrder;
            existing.Metrics = project.Metrics;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            TempData["Success"] = $"Project '{project.Title}' updated.";
            return RedirectToAction(nameof(Index));
        }

        return View("ProjectForm", project);
    }

    // POST: /Admin/DeleteProject/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project != null)
        {
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            TempData["Success"] = $"Project '{project.Title}' deleted.";
        }
        return RedirectToAction(nameof(Index));
    }
}
