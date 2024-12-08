export type AppEnvironment = 'outlook-addin' | 'web-app';

export const isOfficeEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if we're in an iframe (Outlook add-ins run in iframes)
  const isInIframe = window.self !== window.top;
  
  // Check for Office context
  const hasOffice = 'Office' in window && window.Office !== undefined;
  
  console.log('[Environment] Environment check:', {
    isInIframe,
    hasOffice,
    hasContext: hasOffice && 'context' in window.Office,
    url: window.location.href
  });

  return isInIframe && hasOffice;
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