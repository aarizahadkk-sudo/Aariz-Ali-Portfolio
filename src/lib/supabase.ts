import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project ID detected from user dashboard URL: njhrbyvuybhkjepwqfai
export const SUPABASE_PROJECT_ID = 'njhrbyvuybhkjepwqfai';
export const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

// Key storage keys in localStorage for persistence & easy override
const STORAGE_KEY_URL = 'portfolio_supabase_url';
const STORAGE_KEY_ANON = 'portfolio_supabase_anon_key';

export function getStoredSupabaseConfig() {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ANON) : null;

  const url = storedUrl || envUrl || DEFAULT_SUPABASE_URL;
  const key = storedKey || envKey || '';

  return {
    url,
    anonKey: key,
    isConfigured: Boolean(url && key && key.length > 10),
  };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
    if (anonKey) localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
  }
}

export function clearStoredSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_ANON);
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUsedConfig = '';

export function getSupabase(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  const cacheSignature = `${config.url}::${config.anonKey}`;
  if (cachedClient && lastUsedConfig === cacheSignature) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey);
    lastUsedConfig = cacheSignature;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}
