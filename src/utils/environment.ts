export type AppEnvironment = 'outlook-addin' | 'web-app';

export const isOfficeEnvironment = (): boolean => {
  return typeof window !== 'undefined' && 'Office' in window;
};

export const waitForOffice = (): Promise<void> => {
  if (!isOfficeEnvironment()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    Office.onReady(() => resolve());
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