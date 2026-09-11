import React, { useState, useEffect } from 'react';
import { Profile, Project, AdminSession, AdminCredentials } from './types';
import { INITIAL_PROFILE, INITIAL_PROJECTS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { ArchitectureSection } from './components/ArchitectureSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { AnimatePresence } from 'motion/react';
import { fetchRemoteProfile, fetchRemoteProjects } from './lib/portfolioService';
import { getStoredSupabaseConfig } from './lib/supabase';

const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  email: 'aarizahadkk@gmail.com',
  password: 'admin123',
  updatedAt: new Date().toISOString(),
};

export default function App() {
  // Profile state with local persistence
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('portfolio_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }
    return INITIAL_PROFILE;
  });

  // Projects state with local persistence
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved projects', e);
      }
    }
    return INITIAL_PROJECTS;
  });

  // Admin credentials state (Email & Password change support)
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    const saved = localStorage.getItem('portfolio_admin_credentials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved admin credentials', e);
      }
    }
    return DEFAULT_ADMIN_CREDENTIALS;
  });

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const session = localStorage.getItem('portfolio_admin_session');
    if (session) {
      try {
        const parsed: AdminSession = JSON.parse(session);
        // Expire after 12 hours
        if (Date.now() - parsed.loginTimestamp < 12 * 60 * 60 * 1000) {
          return parsed.isAuthenticated;
        }
      } catch (e) {
        console.error('Failed to parse admin session', e);
      }
    }
    return false;
  });

  // Modals visibility state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio_admin_credentials', JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  // Try hydrating from Supabase Cloud if configured
  useEffect(() => {
    const config = getStoredSupabaseConfig();
    if (config.isConfigured) {
      fetchRemoteProfile().then((cloudProf) => {
        if (cloudProf) setProfile(cloudProf);
      }).catch(console.error);

      fetchRemoteProjects().then((cloudProjects) => {
        if (cloudProjects && cloudProjects.length > 0) setProjects(cloudProjects);
      }).catch(console.error);
    }
  }, []);

  // Admin session handlers
  const handleLoginSuccess = (email: string) => {
    const session: AdminSession = {
      isAuthenticated: true,
      userEmail: email,
      loginTimestamp: Date.now(),
    };
    localStorage.setItem('portfolio_admin_session', JSON.stringify(session));
    setIsAdmin(true);
    setIsLoginModalOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_admin_session');
    setIsAdmin(false);
    setIsAdminPanelOpen(false);
  };

  const handleUpdateAdminCredentials = (updated: AdminCredentials) => {
    setAdminCredentials(updated);
  };

  // Profile update handler
  const handleUpdateProfile = (updated: Profile) => {
    setProfile(updated);
  };

  // Project CRUD handlers
  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleResetFactoryData = () => {
    if (
      window.confirm(
        'Reset all portfolio profile and project data to original factory defaults?'
      )
    ) {
      setProfile(INITIAL_PROFILE);
      setProjects(INITIAL_PROJECTS);
      localStorage.removeItem('portfolio_profile');
      localStorage.removeItem('portfolio_projects');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-amber-500 selection:text-white flex flex-col font-sans">
      {/* Top Glass Navigation */}
      <Navbar
        profile={profile}
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Page Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero profile={profile} />

        {/* Dynamic Projects Showcase Grid */}
        <ProjectsShowcase projects={projects} />

        {/* Architectural Competencies Section */}
        <ArchitectureSection />

        {/* Interactive Contact Section with Gmail Compose pre-fill */}
        <ContactSection targetEmail={profile.email || 'Aarizahadkk@gmail.com'} />
      </main>

      {/* Footer with Extreme Bottom-Left Padlock */}
      <Footer
        isAdmin={isAdmin}
        onTriggerAdminAuth={() => setIsLoginModalOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />

      {/* Hidden Admin Authentication Modal with Spring Pop In */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <AdminLoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            adminCredentials={adminCredentials}
          />
        )}
      </AnimatePresence>

      {/* Internal Admin Panel Dashboard with Spring Pop In */}
      <AnimatePresence>
        {isAdminPanelOpen && (
          <AdminPanel
            isOpen={isAdminPanelOpen}
            onClose={() => setIsAdminPanelOpen(false)}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            projects={projects}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onResetFactoryData={handleResetFactoryData}
            adminCredentials={adminCredentials}
            onUpdateAdminCredentials={handleUpdateAdminCredentials}
            onLogout={handleLogout}
            onSyncProfileFromCloud={(remoteProf) => setProfile(remoteProf)}
            onSyncProjectsFromCloud={(remoteProj) => setProjects(remoteProj)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
