import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  Github,
  Star,
  Search,
  Sparkles,
  X,
  Layers,
  LayoutGrid,
  Radio,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { FuturisticProjectsCarousel } from './FuturisticProjectsCarousel';

interface ProjectsShowcaseProps {
  projects: Project[];
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'carousel' | 'grid'>('both');

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.techStack.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Pop in on scroll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 35 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineered Systems</span>
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Featured Projects &amp; Case Studies
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
              High-concurrency platforms, domain-driven microservices, and modern .NET cloud infrastructure.
            </p>
          </div>

          {/* Search & View Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* View Mode Switcher with spring pop buttons */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-white/10 w-full sm:w-auto justify-center shadow-lg">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('both')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'both'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(217,119,6,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Showcase Carousel + Grid"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>All-in-One</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('carousel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(217,119,6,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Holographic Carousel Mode"
              >
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>Carousel</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(217,119,6,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Architecture Grid Mode"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </motion.button>
            </div>

            {/* Search Bar with Spring focus */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tech, title, scope..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/30 transition-all shadow-inner"
              />
            </div>
          </div>
        </motion.div>

        {/* 1. FUTURISTIC CAROUSEL SPOTLIGHT WITH CROSS-FADE */}
        <AnimatePresence mode="wait">
          {(viewMode === 'both' || viewMode === 'carousel') && (
            <motion.div
              key="carousel-spotlight"
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <FuturisticProjectsCarousel
                projects={projects}
                onOpenProjectModal={(proj) => setActiveModalProject(proj)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. ARCHITECTURE MATRIX GRID WITH CROSS-FADE */}
        <AnimatePresence mode="wait">
          {(viewMode === 'both' || viewMode === 'grid') && (
            <motion.div
              key="architecture-grid"
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
            {/* Category Filter Pills with Cross-Fading Glow Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pt-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, idx) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <motion.button
                      key={cat}
                      initial={{ opacity: 0, scale: 0.7, y: 15 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 18,
                        delay: idx * 0.05,
                      }}
                      whileHover={{ scale: 1.06, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setSelectedCategory(cat)}
                      className={`relative px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'border-amber-500/80 text-amber-300 shadow-[0_0_20px_rgba(217,119,6,0.35)]'
                          : 'bg-white/[0.04] text-slate-400 border border-white/10 hover:border-amber-500/30 hover:text-slate-200'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeCategoryPillGlow"
                          className="absolute inset-0 bg-gradient-to-r from-amber-500/25 to-amber-600/15 pointer-events-none"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-xs font-mono text-slate-400 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5"
              >
                Displaying <span className="text-amber-400 font-bold">{filteredProjects.length}</span> verified systems
              </motion.div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                className="text-center py-16 rounded-2xl border border-white/10 bg-slate-900/40"
              >
                <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No projects matched your query criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-3 text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, idx) => (
                    <motion.div
                      layout
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.76, y: 35 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: (idx % 3) * 0.08,
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.025,
                        transition: { type: 'spring', stiffness: 350, damping: 18 }
                      }}
                      className="group relative bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-colors duration-300 flex flex-col hover:shadow-[0_15px_40px_-10px_rgba(217,119,6,0.25)]"
                    >
                      {/* Project Image Banner */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                        {/* Category and Featured Badges with Pop In */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-white/10 text-amber-400 text-xs font-semibold backdrop-blur-md shadow-sm">
                            {project.category}
                          </span>
                          {project.featured && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/25 border border-amber-500/50 text-amber-300 text-xs font-bold backdrop-blur-md shadow-[0_0_12px_rgba(217,119,6,0.3)]">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>Core Architecture</span>
                            </span>
                          )}
                        </div>

                        {/* Performance Metric Pill */}
                        {project.metrics && (
                          <div className="absolute bottom-3 left-3 text-[11px] font-mono text-emerald-300 px-2.5 py-0.5 rounded bg-slate-950/85 border border-emerald-500/40 backdrop-blur-md shadow">
                            {project.metrics}
                          </div>
                        )}
                      </div>

                      {/* Content Box */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        {/* Tech Stack Pills with spring hover */}
                        <div className="flex flex-wrap gap-1.5 my-4 pt-2 border-t border-white/5">
                          {project.techStack.map((tech) => (
                            <motion.span
                              key={tech}
                              whileHover={{ scale: 1.1, y: -1 }}
                              className="px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 text-[11px] font-mono border border-white/10 hover:border-amber-500/40 hover:text-amber-300 transition-colors cursor-default"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <motion.button
                            whileHover={{ scale: 1.05, x: 2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveModalProject(project)}
                            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 group/btn cursor-pointer"
                          >
                            <span>Explore Blueprint</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                          </motion.button>

                          <div className="flex items-center gap-2">
                            {project.githubUrl && (
                              <motion.a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Inspect Source Code"
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                              >
                                <Github className="w-3.5 h-3.5" />
                              </motion.a>
                            )}
                            {project.liveDemoUrl && (
                              <motion.a
                                href={project.liveDemoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View Deployment"
                                whileHover={{ scale: 1.15, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

      {/* Project Detail Modal with Cross-Fading Backdrop & Spring Pop */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.72, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.78, y: 25 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/50 rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header Image */}
              <div className="relative aspect-[21/9] w-full bg-slate-950">
                <img
                  src={activeModalProject.imageUrl}
                  alt={activeModalProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveModalProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-slate-300 hover:text-white hover:bg-black/90 transition-colors cursor-pointer border border-white/10"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                    {activeModalProject.category}
                  </span>
                  {activeModalProject.metrics && (
                    <span className="text-xs text-emerald-400 font-mono font-bold bg-slate-950 px-2.5 py-1 rounded border border-emerald-500/30">
                      {activeModalProject.metrics}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold text-white">
                  {activeModalProject.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeModalProject.description}
                </p>

                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                    Complete Technology Matrix
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeModalProject.techStack.map((tech) => (
                      <motion.span
                        key={tech}
                        whileHover={{ scale: 1.1 }}
                        className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10 text-slate-200 text-xs font-mono"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  {activeModalProject.liveDemoUrl && (
                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      href={activeModalProject.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,119,6,0.35)] cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Live Deployment</span>
                    </motion.a>
                  )}
                  {activeModalProject.githubUrl && (
                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      href={activeModalProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Github className="w-4 h-4" />
                      <span>Browse C# Repository</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
