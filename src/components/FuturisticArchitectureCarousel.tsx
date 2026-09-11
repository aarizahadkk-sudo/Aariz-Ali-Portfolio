import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Server,
  Database,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Activity,
  Code2,
  Sparkles
} from 'lucide-react';

interface Pillar {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  telemetry: string;
  codeSnippet: string;
  description: string;
  specTags: string[];
}

export const FuturisticArchitectureCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoCycle, setIsAutoCycle] = useState(true);

  const pillars: Pillar[] = [
    {
      id: 'webapi',
      icon: <Server className="w-6 h-6 text-amber-400" />,
      title: 'ASP.NET Core Web API & Minimal APIs',
      subtitle: 'Microservice High-Throughput Engine',
      telemetry: 'LATENCY: 4.2ms · IO: ASYNC STREAMING',
      codeSnippet: `app.MapGet("/api/v1/telemetry", async (ITelemetryService service, CancellationToken ct) =>
    Results.Ok(await service.GetActiveMetricsAsync(ct)))
    .RequireRateLimiting("fixed-tier")
    .RequireAuthorization("AdminPolicy");`,
      description:
        'Engineered for maximum IO throughput with asynchronous pipeline middlewares, custom rate limiters, RFC 7807 problem details, and OpenAPI specifications.',
      specTags: ['Async Pipelines', 'RFC 7807', 'RateLimiter', 'OpenAPI v3'],
    },
    {
      id: 'efcore',
      icon: <Database className="w-6 h-6 text-amber-400" />,
      title: 'Entity Framework Core & Dapper',
      subtitle: 'Dual-Engine Persistence Framework',
      telemetry: 'OPTIMISTIC CONCURRENCY · COMPILED QUERIES',
      codeSnippet: `var project = await _dbContext.Projects
    .AsNoTracking()
    .AsSplitQuery()
    .TagWith("Admin:FetchProjectGraph")
    .FirstOrDefaultAsync(p => p.Id == id);`,
      description:
        'Optimized Linq expressions with AsNoTracking splits, compiled query caches, optimistic concurrency tokens, and Dapper for critical sub-millisecond query paths.',
      specTags: ['AsNoTracking', 'SplitQuery', 'Dapper Sub-ms', 'DbInterceptors'],
    },
    {
      id: 'cqrs',
      icon: <Layers className="w-6 h-6 text-amber-400" />,
      title: 'CQRS & Event-Driven Architecture',
      subtitle: 'Clean Domain-Driven Decoupling',
      telemetry: 'EVENT BUS: RABBITMQ · MEDIATR PIPELINES',
      codeSnippet: `public record CreateProjectCommand(string Title, string Description) : IRequest<Result<int>>;

public class CreateProjectHandler : IRequestHandler<CreateProjectCommand, Result<int>> {
    // Pipeline behaviors: Validation, Logging, UnitOfWork
}`,
      description:
        'Decoupling write models from high-speed read projections via MediatR pipelines, outbox pattern reliability, and RabbitMQ event message brokers.',
      specTags: ['MediatR', 'Outbox Pattern', 'RabbitMQ', 'Domain Events'],
    },
    {
      id: 'redis',
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      title: 'Distributed Caching & Redis Cluster',
      subtitle: 'Sub-10ms Latency Hyper-Tier',
      telemetry: 'HIT RATIO: 98.4% · DISTRIBUTED LOCKS',
      codeSnippet: `var cached = await _cache.GetOrCreateAsync(cacheKey, async entry => {
    entry.SetAbsoluteExpiration(TimeSpan.FromHours(4));
    return await _repo.GetMetricsHeavyAsync();
});`,
      description:
        'Hybrid caching tiers with Redis multiplexers, cache invalidation stampede prevention, and automated background sync workers.',
      specTags: ['Redis Sentinel', 'L1/L2 Cache', 'Stampede Guard', 'RedLock'],
    },
    {
      id: 'security',
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      title: 'IdentityServer & OAuth 2.0 / OIDC',
      subtitle: 'Zero-Trust Enterprise Security',
      telemetry: 'CRYPTO: RS256 · TOKEN: PKCE & CLAIMS',
      codeSnippet: `services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts => {
        opts.TokenValidationParameters = new() { ValidateAudience = true, ValidateLifetime = true };
    });`,
      description:
        'Fine-grained RBAC claims transformation, JWT cryptographic signature verification, PKCE authorization flows, and secure cookie session architectures.',
      specTags: ['Zero-Trust', 'JWT RS256', 'PKCE OIDC', 'RBAC Claims'],
    },
    {
      id: 'resilience',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: 'Resilience Engineering with Polly',
      subtitle: 'Self-Healing Circuit Breaker Pipelines',
      telemetry: 'CIRCUIT: CLOSED · JITTER BACKOFF',
      codeSnippet: `var pipeline = new ResiliencePipelineBuilder()
    .AddRetry(new() { MaxRetryAttempts = 3, BackoffType = DelayBackoffType.Exponential })
    .AddCircuitBreaker(new() { SamplingDuration = TimeSpan.FromSeconds(10) })
    .Build();`,
      description:
        'Automatic circuit breakers, exponential jitter backoffs, fallbacks, and health checks integrated with Prometheus and Azure Application Insights.',
      specTags: ['Polly v8', 'Circuit Breaker', 'Jitter Backoff', 'Prometheus'],
    },
  ];

  const total = pillars.length;

  const nextPillar = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevPillar = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Autoplay timer
  useEffect(() => {
    if (!isAutoCycle) return;
    const t = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % total);
    }, 7000);
    return () => clearInterval(t);
  }, [isAutoCycle, total]);

  const activePillar = pillars[activeIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      filter: 'blur(6px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        opacity: { duration: 0.35, ease: 'easeOut' },
        x: { type: 'spring', stiffness: 280, damping: 24 },
        filter: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      filter: 'blur(6px)',
      transition: {
        opacity: { duration: 0.25, ease: 'easeIn' },
        x: { duration: 0.25 },
        filter: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="relative w-full rounded-3xl bg-slate-950/75 border border-amber-500/30 p-5 sm:p-8 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(217,119,6,0.25)]"
          >
            <Activity className="w-5 h-5 animate-pulse" />
          </motion.div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Holographic Architecture Matrix</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              INTERACTIVE NODE EXPLORER // C# &amp; EF CORE
            </p>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-slate-400 mr-2">
            <span className="text-amber-400 font-bold">{activeIndex + 1}</span> / {total}
          </div>
          <motion.button
            whileHover={{ scale: 1.12, x: -2 }}
            whileTap={{ scale: 0.88 }}
            onClick={prevPillar}
            aria-label="Previous architecture node"
            className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.12, x: 2 }}
            whileTap={{ scale: 0.88 }}
            onClick={nextPillar}
            aria-label="Next architecture node"
            className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Node Selector Pills with Cross-Fading Active Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {pillars.map((p, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setDirection(idx > activeIndex ? 1 : -1);
                setActiveIndex(idx);
              }}
              className={`relative p-2.5 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden ${
                isSelected
                  ? 'border-amber-500/80 shadow-[0_0_20px_rgba(217,119,6,0.35)]'
                  : 'bg-white/[0.03] border-white/5 hover:border-white/20 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activePillarGlow"
                  className="absolute inset-0 bg-gradient-to-br from-amber-500/25 to-amber-600/10 rounded-xl pointer-events-none"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center justify-between mb-1">
                <span className="text-xs">{p.icon}</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">0{idx + 1}</span>
              </div>
              <div className="relative z-10 text-[11px] font-semibold truncate text-white">
                {p.title.split('&')[0]}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Active Node Detailed Card with Pop In AnimatePresence */}
      <div className="relative min-h-[320px] rounded-2xl bg-slate-900/80 border border-white/10 p-6 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activePillar.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            {/* Left Pillar Specs */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="flex items-center gap-2">
                <motion.span
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-400"
                >
                  {activePillar.icon}
                </motion.span>
                <div>
                  <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wide">
                    {activePillar.subtitle}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                    {activePillar.title}
                  </h3>
                </div>
              </div>

              <div className="inline-block px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 font-mono text-[11px] text-cyan-300">
                {activePillar.telemetry}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activePillar.description}
              </p>

              {/* Spec Tags with spring pop */}
              <div className="flex flex-wrap gap-2 pt-1">
                {activePillar.specTags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 350, damping: 20 }}
                    whileHover={{ scale: 1.08 }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300 cursor-default"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Right Live C# Code Snippet Terminal with spring pop */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 280, damping: 20 }}
                className="rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-xs shadow-inner"
              >
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-300">Production .NET C# Pattern</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">// COMPILED</span>
                </div>
                <pre className="overflow-x-auto text-amber-200/90 leading-relaxed">
                  <code>{activePillar.codeSnippet}</code>
                </pre>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
