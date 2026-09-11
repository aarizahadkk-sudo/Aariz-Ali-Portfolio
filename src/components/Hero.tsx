import React, { useState, useEffect } from 'react';
import { Profile } from '../types';
import { ArrowRight, Mail, ShieldCheck, Award, Server, Sparkles, Terminal, Code2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  profile: Profile;
}

const popIn = {
  hidden: { opacity: 0, scale: 0.75, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 20,
      delay: i * 0.09,
    },
  }),
};

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  const [telemetryIdx, setTelemetryIdx] = useState(0);
  const telemetryFeeds = [
    'Sub-15ms high-throughput Kafka & RabbitMQ event pipelines',
    'CQRS & Clean Architecture in ASP.NET Core & Minimal APIs',
    'Optimized EF Core compiled query splitting & Redis caching',
    'Zero-Trust IdentityServer with OAuth 2.0 PKCE Claims Security',
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setTelemetryIdx((prev) => (prev + 1) % telemetryFeeds.length);
    }, 3800);
    return () => clearInterval(t);
  }, [telemetryFeeds.length]);
  return (
    <section id="about" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Ambient luxury lighting elements with breathing pulse */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.28, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.22, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        className="absolute top-1/2 -left-32 w-80 h-80 bg-amber-700/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Status indicator - Spring Pop In */}
            {profile.openForOpportunities && (
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={popIn}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(217,119,6,0.2)] cursor-default"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-amber-400 tracking-wide uppercase">
                  Available for Principal Architecture &amp; Advisory
                </span>
              </motion.div>
            )}

            {/* Name - Spring Pop In */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={popIn}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-4"
            >
              Hi, I'm <span className="text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.35)]">{profile.name}</span>
            </motion.h1>

            {/* Title - Spring Pop In */}
            <motion.h2
              custom={2}
              initial="hidden"
              animate="visible"
              variants={popIn}
              className="text-xl sm:text-2xl text-slate-200 font-medium tracking-tight mb-5 flex items-center justify-center lg:justify-start gap-2"
            >
              <span>{profile.title}</span>
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
                className="inline-block text-amber-400"
              >
                <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
              </motion.span>
            </motion.h2>

            {/* Headline - Spring Pop In */}
            <motion.p
              custom={3}
              initial="hidden"
              animate="visible"
              variants={popIn}
              className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6"
            >
              {profile.headline}
            </motion.p>

            {/* Bio - Spring Pop In */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={popIn}
              className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6 pb-6 border-b border-white/10"
            >
              {profile.bio}
            </motion.div>

            {/* Live Cross-Fading Architectural Telemetry Bar */}
            <motion.div
              custom={4.5}
              initial="hidden"
              animate="visible"
              variants={popIn}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-amber-500/30 mb-8 max-w-xl mx-auto lg:mx-0 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>CORE //</span>
              </div>
              <div className="relative h-5 overflow-hidden w-full text-xs font-mono text-slate-300 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={telemetryIdx}
                    initial={{ opacity: 0, y: 7, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -7, filter: 'blur(3px)' }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="truncate text-amber-200/90 font-medium"
                  >
                    {telemetryFeeds[telemetryIdx]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* CTAs with spring pop-in & energetic hover */}
            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={popIn}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.07, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(217,119,6,0.4)] hover:shadow-[0_0_35px_rgba(217,119,6,0.6)] cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.07, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-amber-500/50 text-slate-200 hover:text-amber-400 font-medium text-sm backdrop-blur-md transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Initiate Contact</span>
              </motion.a>

              <motion.a
                href="#architecture"
                whileHover={{ scale: 1.07, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>.NET Architecture</span>
              </motion.a>
            </motion.div>

            {/* Metrics Counters - Staggered bouncy pop-ins */}
            <motion.div
              custom={6}
              initial="hidden"
              animate="visible"
              variants={popIn}
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-2 max-w-lg mx-auto lg:mx-0"
            >
              <motion.div
                whileHover={{ scale: 1.08, y: -3 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-amber-500/40 text-left shadow-lg cursor-default"
              >
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {profile.yearsExperience}+
                </div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                  Years Exp.
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.08, y: -3 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/30 hover:border-amber-500/60 text-left shadow-[0_0_20px_rgba(217,119,6,0.15)] cursor-default"
              >
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400">
                  {profile.completedProjects}+
                </div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                  Deployed
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.08, y: -3 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 text-left shadow-lg cursor-default"
              >
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  99.99%
                </div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                  Uptime SLA
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Right Avatar Card with Spring Pop In & Subtle Tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.65, y: 40, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 240,
              damping: 18,
              delay: 0.25,
            }}
            whileHover={{ scale: 1.03, rotate: 1 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Subtle gold glow ring */}
              <motion.div
                animate={{
                  opacity: [0.5, 0.85, 0.5],
                  scale: [0.98, 1.03, 0.98],
                }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -inset-2 rounded-3xl bg-gradient-to-b from-amber-500/40 via-amber-600/20 to-transparent blur-xl pointer-events-none"
              />
              
              <div className="relative rounded-3xl bg-slate-900/90 border border-amber-500/40 p-3 shadow-2xl backdrop-blur-xl">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 group">
                  <img
                    src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-108"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-40" />

                  {/* Corner holographic chip */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-amber-500/40 text-[10px] font-mono text-amber-300 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                    <Terminal className="w-3 h-3 text-amber-400" />
                    <span>C# 13 // .NET 9</span>
                  </div>
                </div>

                {/* Floating Certified Badge with Spring Pop */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.5 }}
                  whileHover={{ scale: 1.04 }}
                  className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-white/10 hover:border-amber-500/40 flex items-center gap-3 transition-colors cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(217,119,6,0.3)]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      ASP.NET Core &amp; EF Core
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                        VERIFIED
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Enterprise Systems Specialist
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
