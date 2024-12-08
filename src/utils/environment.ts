export type AppEnvironment = 'outlook-addin' | 'web-app';

export const isOfficeEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check URL parameters for Outlook context
  const urlParams = new URLSearchParams(window.location.search);
  const isOutlookHost = window.location.hostname.includes('outlook.com') || 
                       window.location.hostname.includes('office.com') ||
                       window.location.hostname.includes('live.com');
  
  // Check if we're in an iframe
  const isInIframe = window.self !== window.top;
  
  console.log('[Environment] Context check:', {
    isInIframe,
    isOutlookHost,
    hostname: window.location.hostname,
    search: window.location.search,
    hasOffice: 'Office' in window
  });

  // Return true if we're either in Outlook host or in an iframe
  return isInIframe || isOutlookHost;
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