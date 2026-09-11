import { Profile, Project } from '../types';
import { getSupabase } from './supabase';

/**
 * SQL migration schema that the user can execute in Supabase SQL Editor:
 * 
 * CREATE TABLE IF NOT EXISTS portfolio_profiles (
 *   id TEXT PRIMARY KEY DEFAULT 'main',
 *   data JSONB NOT NULL,
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * CREATE TABLE IF NOT EXISTS portfolio_projects (
 *   id TEXT PRIMARY KEY,
 *   data JSONB NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * ALTER TABLE portfolio_profiles ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Allow public read profiles" ON portfolio_profiles FOR SELECT USING (true);
 * CREATE POLICY "Allow all write profiles" ON portfolio_profiles FOR ALL USING (true);
 * 
 * CREATE POLICY "Allow public read projects" ON portfolio_projects FOR SELECT USING (true);
 * CREATE POLICY "Allow all write projects" ON portfolio_projects FOR ALL USING (true);
 */

export async function fetchRemoteProfile(): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('portfolio_profiles')
      .select('data')
      .eq('id', 'main')
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetchRemoteProfile error (table might need to be created):', error.message);
      return null;
    }

    return (data?.data as Profile) || null;
  } catch (err) {
    console.warn('Supabase fetchRemoteProfile exception:', err);
    return null;
  }
}

export async function saveRemoteProfile(profile: Profile): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase client is not connected' };

  try {
    const { error } = await supabase
      .from('portfolio_profiles')
      .upsert({
        id: 'main',
        data: profile,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unknown network error' };
  }
}

export async function fetchRemoteProjects(): Promise<Project[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('data');

    if (error) {
      console.warn('Supabase fetchRemoteProjects error:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;
    return data.map((row: any) => row.data as Project);
  } catch (err) {
    console.warn('Supabase fetchRemoteProjects exception:', err);
    return null;
  }
}

export async function saveRemoteProjects(projects: Project[]): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase client is not connected' };

  try {
    // Delete existing rows and re-insert bulk
    const { error: deleteError } = await supabase
      .from('portfolio_projects')
      .delete()
      .neq('id', '___non_existent___');

    if (deleteError) {
      console.warn('Could not clear projects table:', deleteError.message);
    }

    const rows = projects.map((p) => ({
      id: p.id,
      data: p,
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('portfolio_projects').insert(rows);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unknown network error' };
  }
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, message: 'Please enter your Supabase project API key (anon key).' };
  }

  try {
    // Test a basic lightweight query
    const { error } = await supabase.from('portfolio_profiles').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! The database tables need to be initialized with our 1-click SQL script.',
        };
      }
      return { success: false, message: `Supabase Error (${error.code || 'API'}): ${error.message}` };
    }
    return { success: true, message: 'Connected successfully to Supabase database!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to ping Supabase.' };
  }
}
