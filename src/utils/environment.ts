export type AppEnvironment = 'outlook-addin' | 'web-app';

export const isOfficeEnvironment = (): boolean => {
  console.log('[Environment] Checking Office environment', {
    hasWindow: typeof window !== 'undefined',
    hasOffice: typeof window !== 'undefined' && 'Office' in window,
    officeState: typeof window !== 'undefined' ? window.Office : 'no window'
  });
  
  if (typeof window === 'undefined') {
    console.log('[Environment] No window object');
    return false;
  }
  
  const hasOffice = 'Office' in window && window.Office !== undefined && window.Office !== null;
  console.log('[Environment] Office check result:', hasOffice);
  return hasOffice;
};

export const waitForOffice = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('Office' in window)) {
      resolve();
      return;
    }

    Office.onReady(() => {
      console.log('[Environment] Office is ready');
      resolve();
    });
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