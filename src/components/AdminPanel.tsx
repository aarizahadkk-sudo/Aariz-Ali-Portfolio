import React, { useState, useMemo } from 'react';
import { Profile, Project, AdminCredentials } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  FolderGit2,
  FileCode2,
  Plus,
  Trash2,
  Edit3,
  Save,
  Check,
  ExternalLink,
  Copy,
  Star,
  RotateCcw,
  Sparkles,
  Download,
  Shield,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Mail,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Database
} from 'lucide-react';
import { SupabaseSyncManager } from './SupabaseSyncManager';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onUpdateProfile: (updated: Profile) => void;
  projects: Project[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onResetFactoryData: () => void;
  adminCredentials: AdminCredentials;
  onUpdateAdminCredentials: (updated: AdminCredentials) => void;
  onLogout: () => void;
  onSyncProfileFromCloud?: (profile: Profile) => void;
  onSyncProjectsFromCloud?: (projects: Project[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onResetFactoryData,
  adminCredentials,
  onUpdateAdminCredentials,
  onLogout,
  onSyncProfileFromCloud,
  onSyncProjectsFromCloud,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'supabase' | 'security' | 'dotnet-hub'>('projects');

  // Profile form state
  const [profileForm, setProfileForm] = useState<Profile>(profile);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Security Email State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [emailAuthPassword, setEmailAuthPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  // Security Password State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Project modal state (editing or adding)
  const [isEditingProjectModalOpen, setIsEditingProjectModalOpen] = useState(false);
  const [currentProjectForm, setCurrentProjectForm] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'Enterprise',
    techStack: [],
    imageUrl: '',
    liveDemoUrl: '',
    githubUrl: '',
    featured: false,
    order: 1,
    metrics: '',
  });
  const [techStackInput, setTechStackInput] = useState('');

  // ASP.NET Core file viewer state
  const [selectedFileKey, setSelectedFileKey] = useState<string>('Program.cs');
  const [copiedCodeToast, setCopiedCodeToast] = useState(false);

  if (!isOpen) return null;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const handleOpenAddProject = () => {
    setCurrentProjectForm({
      id: '',
      title: '',
      description: '',
      category: 'Enterprise',
      techStack: ['.NET 9', 'ASP.NET Core', 'EF Core', 'SQL Server'],
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
      liveDemoUrl: 'https://',
      githubUrl: 'https://github.com/',
      featured: false,
      order: projects.length + 1,
      dateCreated: new Date().toISOString().split('T')[0],
      metrics: 'Sub-second Processing',
    });
    setTechStackInput('.NET 9, ASP.NET Core, EF Core, SQL Server');
    setIsEditingProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    setCurrentProjectForm({ ...proj });
    setTechStackInput(proj.techStack.join(', '));
    setIsEditingProjectModalOpen(true);
  };

  const handleSaveProjectModal = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (currentProjectForm.id) {
      // Edit existing
      onUpdateProject({
        ...(currentProjectForm as Project),
        techStack: tags,
      });
    } else {
      // Create new
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: currentProjectForm.title || 'Untitled Project',
        description: currentProjectForm.description || '',
        category: currentProjectForm.category || 'Enterprise',
        techStack: tags.length ? tags : ['.NET 9'],
        imageUrl:
          currentProjectForm.imageUrl ||
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
        liveDemoUrl: currentProjectForm.liveDemoUrl || '',
        githubUrl: currentProjectForm.githubUrl || '',
        featured: !!currentProjectForm.featured,
        order: Number(currentProjectForm.order) || projects.length + 1,
        dateCreated: new Date().toISOString().split('T')[0],
        metrics: currentProjectForm.metrics || '',
      };
      onAddProject(newProj);
    }

    setIsEditingProjectModalOpen(false);
  };

  // Password strength computation
  const passwordStrength = useMemo(() => {
    const pw = newPasswordInput;
    if (!pw) return { score: 0, label: 'Not entered', color: 'bg-slate-800', text: 'text-slate-500' };
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 8) score += 1;
    if (/\d/.test(pw)) score += 1;
    if (/[A-Z]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
    if (score === 3) return { score: 3, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
    return { score: 4, label: 'Enterprise Fortress', color: 'bg-cyan-400', text: 'text-cyan-300' };
  }, [newPasswordInput]);

  const handleChangeAdminEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    const cleanEmail = newAdminEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setEmailError('Please provide a valid administrative email address.');
      return;
    }

    if (emailAuthPassword !== adminCredentials.password) {
      setEmailError('Authentication failed: Current secret password is required to update email.');
      return;
    }

    onUpdateAdminCredentials({
      ...adminCredentials,
      email: cleanEmail,
      updatedAt: new Date().toISOString(),
    });

    setEmailSuccess(`Administrative login email successfully updated to: ${cleanEmail}`);
    setNewAdminEmail('');
    setEmailAuthPassword('');
    setTimeout(() => setEmailSuccess(null), 4000);
  };

  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (currentPasswordInput !== adminCredentials.password) {
      setPasswordError('Current secret password is incorrect.');
      return;
    }

    if (newPasswordInput.length < 6) {
      setPasswordError('New password must be at least 6 characters in length.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    onUpdateAdminCredentials({
      ...adminCredentials,
      password: newPasswordInput,
      updatedAt: new Date().toISOString(),
    });

    setPasswordSuccess('Administrative secret password successfully updated & hashed.');
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setTimeout(() => setPasswordSuccess(null), 4000);
  };

  // ASP.NET Core Solution Code Map for interactive viewer
  const DOTNET_FILES: Record<string, { lang: string; title: string; code: string }> = {
    'Program.cs': {
      lang: 'csharp',
      title: 'Program.cs (ASP.NET Core 9 Bootstrapper)',
      code: `using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using PortfolioApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure Entity Framework Core with SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Server=(localdb)\\\\mssqllocaldb;Database=PortfolioDb;Trusted_Connection=True;MultipleActiveResultSets=true";
    options.UseSqlServer(connectionString);
});

// Cookie-based Authentication for Admin Dashboard
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.Cookie.Name = "Portfolio.Admin.Session";
        options.Cookie.HttpOnly = true;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
    });

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Seed initial database content on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await ApplicationDbContext.SeedInitialDataAsync(dbContext);
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();`
    },
    'ApplicationDbContext.cs': {
      lang: 'csharp',
      title: 'Data/ApplicationDbContext.cs (EF Core Context)',
      code: `using Microsoft.EntityFrameworkCore;
using PortfolioApp.Models;

namespace PortfolioApp.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Seeds default admin user & principal profile
    }
}`
    },
    'Project.cs': {
      lang: 'csharp',
      title: 'Models/Project.cs (Domain Model)',
      code: `using System.ComponentModel.DataAnnotations;

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

    [Required]
    public string TechStackRaw { get; set; } = string.Empty;

    public string[] TechStack => TechStackRaw.Split(',', 
        StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

    public string ImageUrl { get; set; } = string.Empty;
    public string? LiveDemoUrl { get; set; }
    public string? GithubUrl { get; set; }
    public bool IsFeatured { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;
    public string? Metrics { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}`
    },
    'AdminController.cs': {
      lang: 'csharp',
      title: 'Controllers/AdminController.cs (Admin CRUD)',
      code: `using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApp.Data;
using PortfolioApp.Models;

namespace PortfolioApp.Controllers;

[Authorize]
public class AdminController : Controller
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context) => _context = context;

    public async Task<IActionResult> Index()
    {
        var profile = await _context.Profiles.FirstOrDefaultAsync() ?? new Profile();
        var projects = await _context.Projects.OrderBy(p => p.DisplayOrder).ToListAsync();
        ViewBag.Profile = profile;
        return View(projects);
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateProfile(Profile model)
    {
        // Updates name, headline, bio, LinkedIn, GitHub, and avatar
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateProject(Project project)
    {
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project != null) {
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Index));
    }
}`
    },
    'site.js': {
      lang: 'javascript',
      title: 'wwwroot/js/site.js (Padlock modal & Gmail Compose)',
      code: `// Pre-filled Gmail Compose Link Generator
const TARGET_EMAIL = 'Aarizahadkk@gmail.com';

function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const subject = encodeURIComponent(document.getElementById('contactSubject')?.value.trim() || '');
    const message = encodeURIComponent(document.getElementById('contactMessage')?.value.trim() || '');

    const gmailUrl = \`https://mail.google.com/mail/?view=cm&fs=1&to=\${TARGET_EMAIL}&su=\${subject}&body=\${message}\`;
    window.open(gmailUrl, '_blank');
}`
    }
  };

  const handleCopyCurrentCode = () => {
    const code = DOTNET_FILES[selectedFileKey]?.code || '';
    navigator.clipboard.writeText(code);
    setCopiedCodeToast(true);
    setTimeout(() => setCopiedCodeToast(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.84, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(217,119,6,0.2)]"
            >
              <FolderGit2 className="w-5 h-5" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-white">
                  Executive Admin Console
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dynamic Content &amp; EF Core Persistence Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResetFactoryData}
              title="Reset data to factory defaults"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/5 bg-slate-950/40">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 border-x border-white/10 shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projects Showcase CRUD ({projects.length})</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 border-x border-white/10 shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Social Links</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'supabase'
                ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-500 border-x border-white/10 shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Supabase Cloud DB</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 border-x border-white/10 shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Security &amp; Password</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('dotnet-hub')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'dotnet-hub'
                ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 border-x border-white/10 shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>ASP.NET Core Solution Files</span>
          </motion.button>
        </div>

        {/* Tab Body with Smooth Cross-Fade Transitions */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* TAB 1: PROJECTS MANAGEMENT */}
              {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    Managed Projects
                  </h3>
                  <p className="text-xs text-slate-400">
                    Create, update, or remove portfolio items rendered dynamically in the public grid.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProject}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Projects Table */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.02] border-b border-white/5 text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-4">Thumbnail</th>
                        <th className="py-3 px-4">Title &amp; Metrics</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Tech Stack</th>
                        <th className="py-3 px-4">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {projects.map((proj) => (
                        <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4">
                            <img
                              src={proj.imageUrl}
                              alt={proj.title}
                              className="w-14 h-9 object-cover rounded-lg bg-slate-900"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{proj.title}</div>
                            <div className="text-[11px] text-slate-500">{proj.metrics || 'Standard'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-slate-300">
                              {proj.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate">
                            <div className="flex flex-wrap gap-1">
                              {proj.techStack.slice(0, 3).map((t) => (
                                <span key={t} className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] text-slate-300">
                                  {t}
                                </span>
                              ))}
                              {proj.techStack.length > 3 && (
                                <span className="text-[10px] text-slate-500">
                                  +{proj.techStack.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {proj.featured ? (
                              <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span>Yes</span>
                              </span>
                            ) : (
                              <span className="text-slate-600">No</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProject(proj)}
                                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-amber-400 transition-colors"
                                title="Edit Project"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete project "${proj.title}"?`)) {
                                    onDeleteProject(proj.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                title="Delete Project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE MANAGEMENT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    Personal &amp; Executive Profile Settings
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live updates to profile photo, main bio, headline, and header social links.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>

              {profileSavedToast && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Profile details successfully persisted!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.headline}
                    onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Detailed Professional Bio
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    required
                    value={profileForm.avatarUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contact Email (Target for Inbound Gmail)
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    GitHub Profile URL (Header &amp; Footer Button)
                  </label>
                  <input
                    type="url"
                    value={profileForm.githubUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    LinkedIn Profile URL (Header Button)
                  </label>
                  <input
                    type="url"
                    value={profileForm.linkedinUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={profileForm.yearsExperience}
                    onChange={(e) => setProfileForm({ ...profileForm, yearsExperience: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Completed Systems / Projects Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={profileForm.completedProjects}
                    onChange={(e) => setProfileForm({ ...profileForm, completedProjects: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileForm.openForOpportunities}
                      onChange={(e) => setProfileForm({ ...profileForm, openForOpportunities: e.target.checked })}
                      className="rounded bg-slate-950 border-white/20 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-xs text-slate-300 font-medium">
                      Display "Available for Principal Architecture &amp; Advisory" status banner
                    </span>
                  </label>
                </div>
              </div>
            </form>
          )}

          {/* TAB: SUPABASE CLOUD DATABASE SYNC */}
          {activeTab === 'supabase' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <SupabaseSyncManager
                profile={profile}
                projects={projects}
                onSyncProfileFromCloud={(p) => {
                  onUpdateProfile(p);
                  setProfileForm(p);
                }}
                onSyncProjectsFromCloud={(remoteProjects) => {
                  if (onSyncProjectsFromCloud) {
                    onSyncProjectsFromCloud(remoteProjects);
                  }
                }}
              />
            </motion.div>
          )}

          {/* TAB: ADMIN SECURITY & CREDENTIALS */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Administrative Security &amp; Credentials</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Update administrative email and master password stored securely for console authentication.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Update Admin Email Card */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Change Admin Email</h4>
                      <div className="text-[11px] text-slate-400">Primary administrative account identifier</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Active Login Email:</span>
                    <span className="font-mono text-amber-300 font-semibold">{adminCredentials.email}</span>
                  </div>

                  {emailError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{emailError}</span>
                    </div>
                  )}

                  {emailSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{emailSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangeAdminEmail} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        New Administrative Email
                      </label>
                      <input
                        type="email"
                        required
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="newadmin@enterprise.net"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm Current Master Password
                      </label>
                      <input
                        type="password"
                        required
                        value={emailAuthPassword}
                        onChange={(e) => setEmailAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)] flex items-center justify-center gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Administrator Email</span>
                    </button>
                  </form>
                </div>

                {/* 2. Update Admin Password Card */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Change Master Password</h4>
                      <div className="text-[11px] text-slate-400">Secure authorization secret</div>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangeAdminPassword} className="space-y-3">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          value={currentPasswordInput}
                          onChange={(e) => setCurrentPasswordInput(e.target.value)}
                          placeholder="Current password"
                          className="w-full pl-3.5 pr-9 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        New Secret Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="New password (min 6 chars)"
                          className="w-full pl-3.5 pr-9 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Dynamic Password Strength Meter */}
                      {newPasswordInput && (
                        <div className="mt-2 space-y-1.5 p-2.5 rounded-lg bg-slate-900/90 border border-white/5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Security Grade:</span>
                            <span className={`font-mono font-bold ${passwordStrength.text}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'}`} />
                            <div className={`h-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'}`} />
                            <div className={`h-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'}`} />
                            <div className={`h-full ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-transparent'}`} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full pl-3.5 pr-9 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)] flex items-center justify-center gap-2 pt-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Save New Password</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* 3. Session Diagnostics & Logout */}
              <div className="p-4 rounded-2xl border border-white/10 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white">
                      SESSION PROTOCOL: ASP.NET Core Cookie Authentication
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Last Credentials Rotation: {new Date(adminCredentials.updatedAt).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Terminate Session (Logout)</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 3: ASP.NET CORE SOLUTION EXPLORER */}
          {activeTab === 'dotnet-hub' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    Complete ASP.NET Core Solution Architecture
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generated production-ready Models, EF Core DbContext, Controllers, Views, and site assets.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCurrentCode}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/25 transition-all"
                  >
                    {copiedCodeToast ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy File Content</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Solution File Selector Buttons */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(DOTNET_FILES).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFileKey(fileName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      selectedFileKey === fileName
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                        : 'bg-white/[0.04] text-slate-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    {fileName}
                  </button>
                ))}
              </div>

              {/* Code Viewer Panel */}
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 font-mono text-xs overflow-x-auto max-h-96 text-slate-300 leading-relaxed shadow-inner">
                <div className="text-[11px] text-amber-500/80 mb-2 pb-2 border-b border-white/5 font-semibold">
                  // {DOTNET_FILES[selectedFileKey]?.title}
                </div>
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={selectedFileKey}
                    initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <code>{DOTNET_FILES[selectedFileKey]?.code}</code>
                  </motion.pre>
                </AnimatePresence>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>All .NET project files are physically authored under <code>/dotnet-portfolio/</code>.</span>
              </div>
            </div>
          )}
          </motion.div>
        </AnimatePresence>
        </div>
      </motion.div>

      {/* Add / Edit Project Modal with Spring Pop In & Cross-Fading Backdrop */}
      {isEditingProjectModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h4 className="font-display text-base font-bold text-white">
                {currentProjectForm.id ? 'Modify Project Record' : 'Ingest New Architecture Project'}
              </h4>
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditingProjectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <form onSubmit={handleSaveProjectModal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={currentProjectForm.title}
                  onChange={(e) => setCurrentProjectForm({ ...currentProjectForm, title: e.target.value })}
                  placeholder="e.g. Distributed Event Gateway"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={currentProjectForm.category}
                    onChange={(e) =>
                      setCurrentProjectForm({
                        ...currentProjectForm,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Microservices">Microservices</option>
                    <option value="Cloud & API">Cloud &amp; API</option>
                    <option value="Full-Stack">Full-Stack</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Metric Highlight</label>
                  <input
                    type="text"
                    value={currentProjectForm.metrics || ''}
                    onChange={(e) => setCurrentProjectForm({ ...currentProjectForm, metrics: e.target.value })}
                    placeholder="e.g. 99.99% SLA · 15ms"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Scope &amp; Description</label>
                <textarea
                  rows={3}
                  required
                  value={currentProjectForm.description}
                  onChange={(e) => setCurrentProjectForm({ ...currentProjectForm, description: e.target.value })}
                  placeholder="Outline technical architecture, patterns, CQRS, messaging, database design..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Technologies (comma separated tags)
                </label>
                <input
                  type="text"
                  required
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder=".NET 9, EF Core, SQL Server, Redis, Docker"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  required
                  value={currentProjectForm.imageUrl}
                  onChange={(e) => setCurrentProjectForm({ ...currentProjectForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={currentProjectForm.liveDemoUrl || ''}
                    onChange={(e) => setCurrentProjectForm({ ...currentProjectForm, liveDemoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={currentProjectForm.githubUrl || ''}
                    onChange={(e) => setCurrentProjectForm({ ...currentProjectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProjectForm.featured || false}
                    onChange={(e) => setCurrentProjectForm({ ...currentProjectForm, featured: e.target.checked })}
                    className="rounded bg-slate-950 border-white/20 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-slate-300">Feature prominently</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditingProjectModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Persist Record</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
