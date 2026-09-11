import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  Github,
  Star,
  Cpu,
  Activity,
  Maximize2,
  Terminal,
  Zap,
  Radio
} from 'lucide-react';

interface FuturisticProjectsCarouselProps {
  projects: Project[];
  onOpenProjectModal: (project: Project) => void;
}

export const FuturisticProjectsCarousel: React.FC<FuturisticProjectsCarouselProps> = ({
  projects,
  onOpenProjectModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [progressKey, setProgressKey] = useState(0);

  const total = projects.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgressKey((k) => k + 1);
  }, [total]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgressKey((k) => k + 1);
  }, [total]);

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    setProgressKey((k) => k + 1);
  };

  // Autoplay timer: 6 seconds per slide
  useEffect(() => {
    if (!isAutoplay || total <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoplay, nextSlide, total, progressKey]);

  if (!projects || projects.length === 0) return null;

  const currentProject = projects[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      filter: 'blur(6px)',
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        opacity: { duration: 0.4, ease: 'easeOut' },
        x: { type: 'spring', stiffness: 260, damping: 24 },
        scale: { type: 'spring', stiffness: 260, damping: 24 },
        filter: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      filter: 'blur(6px)',
      scale: 0.96,
      transition: {
        opacity: { duration: 0.28, ease: 'easeIn' },
        x: { duration: 0.28 },
        scale: { duration: 0.28 },
        filter: { duration: 0.25 },
      },
    }),
  };

  return (
    <div className="relative w-full rounded-3xl bg-slate-950/85 border border-amber-500/30 p-4 sm:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden mb-12">
      {/* Cinematic Ambient Cross-Fade Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProject.id + '-ambient-backdrop'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center filter blur-3xl pointer-events-none transform scale-110"
          style={{ backgroundImage: `url(${currentProject.imageUrl})` }}
        />
      </AnimatePresence>

      {/* Background Holographic Glow and Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cybernetic HUD Top Status Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10 font-mono text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span className="text-[11px] font-bold tracking-wider uppercase">HOLO-CAROUSEL // LIVE</span>
          </motion.div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>CORE.SYNC: 100%</span>
          </div>
        </div>

        {/* HUD Controls: Autoplay toggle, counter, navigation */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
              isAutoplay
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
            }`}
            title={isAutoplay ? 'Pause auto-cycle' : 'Enable auto-cycle'}
          >
            {isAutoplay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="font-semibold">{isAutoplay ? 'AUTO' : 'PAUSED'}</span>
          </motion.button>

          <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
            <span className="text-amber-400 font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-slate-500"> / </span>
            <span>{String(total).padStart(2, '0')}</span>
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.15, x: -2 }}
              whileTap={{ scale: 0.88 }}
              onClick={prevSlide}
              aria-label="Previous project"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 text-slate-300 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, x: 2 }}
              whileTap={{ scale: 0.88 }}
              onClick={nextSlide}
              aria-label="Next project"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 text-slate-300 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Slide Stage with AnimatePresence */}
      <div className="relative min-h-[460px] md:min-h-[380px] w-full overflow-hidden rounded-2xl bg-slate-900/60 border border-white/10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentProject.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full p-5 sm:p-8 flex flex-col lg:flex-row items-center gap-8 justify-between"
          >
            {/* Left Info Panel */}
            <div className="w-full lg:w-7/12 flex flex-col justify-center space-y-4 text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold tracking-wide">
                  {currentProject.category}
                </span>

                {currentProject.featured && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>Featured Architecture</span>
                  </span>
                )}

                {currentProject.metrics && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>{currentProject.metrics}</span>
                  </span>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 20 }}
              >
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {currentProject.title}
                </h3>
                <div className="text-[11px] font-mono text-slate-500 mt-1">
                  ID: SYS-{currentProject.id.slice(0, 8).toUpperCase()} · DEPLOYED: {currentProject.dateCreated}
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 md:line-clamp-4"
              >
                {currentProject.description}
              </motion.p>

              {/* Technology badges with staggered spring pop in */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-amber-400" />
                  <span>Integrated Architectural Modules</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentProject.techStack.map((tech, idx) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.2 + idx * 0.04,
                        type: 'spring',
                        stiffness: 350,
                        damping: 18,
                      }}
                      whileHover={{ scale: 1.1, y: -1 }}
                      className="px-2 py-0.5 rounded bg-slate-950/90 border border-white/10 hover:border-amber-500/40 text-slate-200 text-xs font-mono transition-colors cursor-default"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Action Buttons with spring hover */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-wrap items-center gap-3 pt-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenProjectModal(currentProject)}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(217,119,6,0.35)] hover:shadow-[0_0_28px_rgba(217,119,6,0.5)] cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Technical Deep Dive</span>
                </motion.button>

                {currentProject.githubUrl && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </motion.a>
                )}

                {currentProject.liveDemoUrl && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={currentProject.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Telemetry</span>
                  </motion.a>
                )}
              </motion.div>
            </div>

            {/* Right Holographic Visual Stage with spring pop */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                className="relative w-full max-w-md aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/30 shadow-2xl group"
              >
                <img
                  src={currentProject.imageUrl}
                  alt={currentProject.title}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Futuristic Laser Scanner Line Overlay */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80 animate-pulse pointer-events-none" />

                {/* Holographic Diagnostic Corner HUD */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-950/90 border border-amber-500/30 text-[10px] font-mono text-amber-300 backdrop-blur-md flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-amber-400" />
                  <span>ASP.NET 9 // ASYNC</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/10 backdrop-blur-md">
                  <span className="text-slate-400">TELEMETRY:</span>
                  <span className="text-emerald-400 font-semibold">HEALTHY · 99.99%</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Futuristic Progress Bar (Sync with Autoplay) */}
      <div className="relative mt-4 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
        {isAutoplay && (
          <motion.div
            key={progressKey}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-cyan-400 shadow-[0_0_10px_rgba(217,119,6,0.8)]"
          />
        )}
      </div>

      {/* Interactive Segmented Mini Carousel Thumbnails / Dots with Cross-Fading Glow */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 overflow-x-auto py-2">
        {projects.map((proj, idx) => {
          const isActive = idx === currentIndex;
          return (
            <motion.button
              key={proj.id}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => goToSlide(idx)}
              className={`relative group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300 cursor-pointer overflow-hidden ${
                isActive
                  ? 'border-amber-500 text-amber-300 shadow-[0_0_18px_rgba(217,119,6,0.35)]'
                  : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCarouselThumbGlow"
                  className="absolute inset-0 bg-gradient-to-r from-amber-500/25 to-amber-600/15 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 w-2 h-2 rounded-full transition-all ${
                  isActive ? 'bg-amber-400 scale-125' : 'bg-slate-600 group-hover:bg-slate-400'
                }`}
              />
              <span className="relative z-10 hidden md:inline truncate max-w-[120px] font-sans">
                {proj.title}
              </span>
              <span className="relative z-10 text-[10px] text-slate-400 font-bold">#{idx + 1}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
