export type AppEnvironment = 'outlook-addin' | 'web-app';

export const isOfficeEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'Office' in window && window.Office !== undefined && window.Office !== null;
};

export const waitForOffice = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!isOfficeEnvironment()) {
      resolve();
      return;
    }

    if (window.Office?.initialized) {
      resolve();
    } else {
      window.Office.onReady(() => resolve());
    }
  });
};

export const getEnvironment = (): AppEnvironment => {
  return isOfficeEnvironment() ? 'outlook-addin' : 'web-app';
};

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // In development, warn but don't throw
    if (process.env.NODE_ENV === 'development') {
      console.warn('Missing Supabase environment variables');
      return { url: '', key: '' };
    }
    throw new Error('Missing Supabase environment variables');
  }

  return { url, key };
} 