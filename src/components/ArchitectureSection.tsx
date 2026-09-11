import React, { useState } from 'react';
import { Cpu, Database, Server, Layers, ShieldCheck, Zap, Radio, LayoutGrid, Sparkles } from 'lucide-react';
import { FuturisticArchitectureCarousel } from './FuturisticArchitectureCarousel';
import { motion, AnimatePresence } from 'motion/react';

export const ArchitectureSection: React.FC = () => {
  const [activeView, setActiveView] = useState<'carousel' | 'grid'>('carousel');

  const pillars = [
    {
      icon: <Server className="w-6 h-6 text-amber-400" />,
      title: 'ASP.NET Core Web API & Minimal APIs',
      subtitle: 'Microservice Backbone',
      description:
        'Engineered for maximum IO throughput with asynchronous pipeline middlewares, custom rate limiters, RFC 7807 problem details, and OpenAPI specifications.',
    },
    {
      icon: <Database className="w-6 h-6 text-amber-400" />,
      title: 'Entity Framework Core & Dapper',
      subtitle: 'Dual-Engine Persistence',
      description:
        'Optimized Linq expressions with AsNoTracking splits, compiled query caches, optimistic concurrency tokens, and Dapper for critical sub-millisecond query paths.',
    },
    {
      icon: <Layers className="w-6 h-6 text-amber-400" />,
      title: 'CQRS & Event-Driven Patterns',
      subtitle: 'Clean Architecture',
      description:
        'Decoupling write models from high-speed read projections via MediatR pipelines, outbox pattern reliability, and RabbitMQ event message brokers.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      title: 'Distributed Caching & Redis',
      subtitle: 'Sub-10ms Latencies',
      description:
        'Hybrid caching tiers with Redis multiplexers, cache invalidation stampede prevention, and automated background sync workers.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      title: 'IdentityServer & OAuth 2.0 / OIDC',
      subtitle: 'Zero-Trust Security',
      description:
        'Fine-grained RBAC claims transformation, JWT cryptographic signature verification, PKCE authorization flows, and secure cookie session architectures.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: 'Resilience Engineering (Polly)',
      subtitle: 'Fault Tolerant Pipelines',
      description:
        'Automatic circuit breakers, exponential jitter backoffs, fallbacks, and health checks integrated with Prometheus and Azure Application Insights.',
    },
  ];

  return (
    <section id="architecture" className="py-20 relative bg-slate-950/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Spring Pop-In */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 35 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Architectural Competencies</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Production .NET Core Architecture
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
              Standards-compliant, highly testable, and cloud-native patterns crafted for high-volume enterprise scale.
            </p>
          </div>

          {/* Mode Switcher with bouncy spring pop */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-white/10 shadow-lg">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView('carousel')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'carousel'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>Holographic Carousel</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView('grid')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'grid'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Pillars Matrix</span>
            </motion.button>
          </div>
        </motion.div>

        {/* View Content with Smooth Cross-Fade Transitions */}
        <AnimatePresence mode="wait">
          {activeView === 'carousel' ? (
            <motion.div
              key="carousel-view"
              initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <FuturisticArchitectureCarousel />
            </motion.div>
          ) : (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {pillars.map((pillar, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.78, y: 35 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 20,
                    delay: idx * 0.08,
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    transition: { type: 'spring', stiffness: 350, damping: 18 }
                  }}
                  className="p-6 rounded-2xl bg-slate-900/75 border border-white/10 hover:border-amber-500/50 transition-colors duration-300 shadow-xl hover:shadow-[0_15px_35px_-5px_rgba(217,119,6,0.2)] cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
                  >
                    {pillar.icon}
                  </motion.div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    {pillar.subtitle}
                  </div>
                  <h3 className="font-display text-base font-bold text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
