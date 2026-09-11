import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, ExternalLink, ShieldCheck, Terminal, ArrowDownToLine, ArrowUpToLine } from 'lucide-react';
import { motion } from 'motion/react';
import { getStoredSupabaseConfig, saveStoredSupabaseConfig, clearStoredSupabaseConfig } from '../lib/supabase';
import { testSupabaseConnection, saveRemoteProfile, saveRemoteProjects, fetchRemoteProfile, fetchRemoteProjects } from '../lib/portfolioService';
import { Profile, Project } from '../types';

interface SupabaseSyncManagerProps {
  profile: Profile;
  projects: Project[];
  onSyncProfileFromCloud: (profile: Profile) => void;
  onSyncProjectsFromCloud: (projects: Project[]) => void;
}

export const SupabaseSyncManager: React.FC<SupabaseSyncManagerProps> = ({
  profile,
  projects,
  onSyncProfileFromCloud,
  onSyncProjectsFromCloud,
}) => {
  const [config, setConfig] = useState(() => getStoredSupabaseConfig());
  const [supabaseUrl, setSupabaseUrl] = useState(config.url);
  const [anonKey, setAnonKey] = useState(config.anonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    checked: boolean;
    success: boolean;
    message: string;
  }>({
    checked: false,
    success: false,
    message: '',
  });

  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    // If configured on initial mount, test silently
    if (config.isConfigured && !connectionStatus.checked) {
      handleTestConnection();
    }
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = supabaseUrl.trim();
    const cleanKey = anonKey.trim();

    saveStoredSupabaseConfig(cleanUrl, cleanKey);
    const updated = getStoredSupabaseConfig();
    setConfig(updated);

    setActionNotice({
      type: 'success',
      message: 'Supabase credentials saved successfully. Now testing connection...',
    });

    setTimeout(() => {
      handleTestConnection();
    }, 200);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionStatus({ checked: false, success: false, message: '' });

    const result = await testSupabaseConnection();
    setIsTesting(false);
    setConnectionStatus({
      checked: true,
      success: result.success,
      message: result.message,
    });
  };

  const handlePushToCloud = async () => {
    setIsPushing(true);
    setActionNotice(null);

    try {
      const profileRes = await saveRemoteProfile(profile);
      if (!profileRes.success) {
        setActionNotice({
          type: 'error',
          message: `Failed to push profile: ${profileRes.error}. (Make sure you executed the SQL setup script below in Supabase)`,
        });
        setIsPushing(false);
        return;
      }

      const projectsRes = await saveRemoteProjects(projects);
      if (!projectsRes.success) {
        setActionNotice({
          type: 'error',
          message: `Failed to push projects: ${projectsRes.error}`,
        });
        setIsPushing(false);
        return;
      }

      setActionNotice({
        type: 'success',
        message: 'Successfully pushed all profile data and projects to your Supabase PostgreSQL cloud tables!',
      });
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err?.message || 'Error occurred while pushing to cloud.',
      });
    } finally {
      setIsPushing(false);
    }
  };

  const handlePullFromCloud = async () => {
    setIsPulling(true);
    setActionNotice(null);

    try {
      const cloudProfile = await fetchRemoteProfile();
      const cloudProjects = await fetchRemoteProjects();

      let syncedCount = 0;
      if (cloudProfile) {
        onSyncProfileFromCloud(cloudProfile);
        syncedCount++;
      }
      if (cloudProjects && cloudProjects.length > 0) {
        onSyncProjectsFromCloud(cloudProjects);
        syncedCount++;
      }

      if (syncedCount > 0) {
        setActionNotice({
          type: 'success',
          message: `Successfully pulled latest data from Supabase (${cloudProjects?.length || 0} projects synced)!`,
        });
      } else {
        setActionNotice({
          type: 'error',
          message: 'No cloud data found yet in Supabase. Click "Push Local Data to Supabase" first to populate your database.',
        });
      }
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err?.message || 'Failed to pull from Supabase.',
      });
    } finally {
      setIsPulling(false);
    }
  };

  const handleClearCredentials = () => {
    clearStoredSupabaseConfig();
    setAnonKey('');
    setConfig(getStoredSupabaseConfig());
    setConnectionStatus({ checked: false, success: false, message: '' });
    setActionNotice({ type: 'success', message: 'Credentials removed from browser storage.' });
  };

  const sqlSetupScript = `-- Run this in your Supabase SQL Editor (SQL Editor -> New Query)
-- 1. Create table for portfolio profile
CREATE TABLE IF NOT EXISTS public.portfolio_profiles (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create table for portfolio projects showcase
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- 4. Create public policies for seamless syncing
CREATE POLICY "Allow public read on profiles" 
  ON public.portfolio_profiles FOR SELECT USING (true);
CREATE POLICY "Allow write on profiles" 
  ON public.portfolio_profiles FOR ALL USING (true);

CREATE POLICY "Allow public read on projects" 
  ON public.portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Allow write on projects" 
  ON public.portfolio_projects FOR ALL USING (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSetupScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-white">
                Supabase Cloud Database Integration
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                connectionStatus.success
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                {connectionStatus.success ? 'Connected & Live' : config.isConfigured ? 'Connecting...' : 'Needs API Key'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Project ID: <code className="text-emerald-400 font-mono font-semibold">njhrbyvuybhkjepwqfai</code> (Personal Portfolio)
            </p>
          </div>
        </div>

        <a
          href="https://supabase.com/dashboard/project/njhrbyvuybhkjepwqfai/settings/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
        >
          <span>Open Supabase Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
            actionNotice.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
          }`}
        >
          {actionNotice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{actionNotice.message}</span>
        </motion.div>
      )}

      {/* Credentials Configuration Form */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Project API Key Configuration</h4>
          </div>
          {config.isConfigured && (
            <button
              onClick={handleClearCredentials}
              className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Clear API Key
            </button>
          )}
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              required
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://njhrbyvuybhkjepwqfai.supabase.co"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Publishable API Key (anon key / sb_publishable_...)
              </label>
              <span className="text-[11px] text-slate-400">
                Copy from your screenshot
              </span>
            </div>
            <input
              type="password"
              required
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="sb_publishable_... or your legacy anon public key"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/60"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Click the copy icon next to your key in the Supabase API Keys tab and paste it here.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save &amp; Connect Key</span>
            </button>

            <button
              type="button"
              disabled={isTesting}
              onClick={handleTestConnection}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing Connection...' : 'Test Connection'}</span>
            </button>
          </div>
        </form>

        {connectionStatus.checked && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            connectionStatus.success
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
          }`}>
            {connectionStatus.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            )}
            <span>{connectionStatus.message}</span>
          </div>
        )}
      </div>

      {/* Cloud Synchronization Controls */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-amber-400" />
          <span>Bi-Directional Cloud Synchronization</span>
        </h4>
        <p className="text-xs text-slate-400">
          Push your current portfolio profile &amp; showcase projects into Supabase, or pull down changes stored in your PostgreSQL tables.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            disabled={isPushing}
            onClick={handlePushToCloud}
            className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-white/10 hover:border-emerald-500/40 flex items-center justify-between group transition-all text-left cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center gap-1.5">
                <ArrowUpToLine className="w-3.5 h-3.5 text-emerald-400" />
                <span>Push Local Data to Supabase</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Uploads profile &amp; {projects.length} showcase projects
              </div>
            </div>
            {isPushing && <RefreshCw className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />}
          </button>

          <button
            type="button"
            disabled={isPulling}
            onClick={handlePullFromCloud}
            className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-white/10 hover:border-amber-500/40 flex items-center justify-between group transition-all text-left cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                <ArrowDownToLine className="w-3.5 h-3.5 text-amber-400" />
                <span>Pull Latest from Supabase</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Refreshes state from remote database
              </div>
            </div>
            {isPulling && <RefreshCw className="w-4 h-4 animate-spin text-amber-400 shrink-0" />}
          </button>
        </div>
      </div>

      {/* SQL Setup Script Helper */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Database Tables Setup Script</h4>
          </div>
          <button
            onClick={handleCopySql}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied SQL</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-400">
          In your Supabase dashboard, navigate to <strong className="text-slate-300">SQL Editor</strong> &rarr; <strong className="text-slate-300">New Query</strong>, paste this script, and click <strong className="text-emerald-400">Run</strong>.
        </p>

        <pre className="p-4 rounded-xl bg-slate-900 border border-white/5 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
          {sqlSetupScript}
        </pre>
      </div>
    </div>
  );
};
