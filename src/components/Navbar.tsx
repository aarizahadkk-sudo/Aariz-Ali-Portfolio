import React from 'react';
import { Profile } from '../types';
import { Github, Linkedin, ShieldCheck, LogOut, Sliders, Terminal, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  profile: Profile;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  isAdmin,
  onOpenAdmin,
  onLogout,
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with spring hover */}
        <motion.a
          href="#about"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="flex items-center gap-3 group"
        >
          <motion.div
            whileHover={{ rotate: 8, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 15 }}
            className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm tracking-tight shadow-[0_0_15px_rgba(217,119,6,0.25)] group-hover:border-amber-400"
          >
            .NET
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-white text-lg tracking-tight group-hover:text-amber-400 transition-colors">
              {profile.name.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Principal .NET Architect
            </span>
          </div>
        </motion.a>

        {/* Navigation Links with bouncy spring hover */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300">
          {[
            { href: '#about', label: 'About' },
            { href: '#projects', label: 'Projects' },
            { href: '#architecture', label: 'Architecture' },
            { href: '#contact', label: 'Contact' },
          ].map((item, idx) => (
            <motion.a
              key={item.href}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05, type: 'spring', stiffness: 300, damping: 18 }}
              whileHover={{ scale: 1.1, color: '#fbbf24' }}
              whileTap={{ scale: 0.95 }}
              className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-white/[0.04] transition-colors"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        {/* Action Controls & Editable Social Links */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="flex items-center gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold shadow-[0_0_15px_rgba(217,119,6,0.25)] cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={onLogout}
                title="Log out admin session"
                className="p-1.5 rounded-lg border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2.5">
              {profile.githubUrl && (
                <motion.a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 18 }}
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all"
                >
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">GitHub</span>
                </motion.a>
              )}
              {profile.linkedinUrl && (
                <motion.a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 18 }}
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(217,119,6,0.35)] hover:shadow-[0_0_22px_rgba(217,119,6,0.55)] cursor-pointer"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </motion.a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};
