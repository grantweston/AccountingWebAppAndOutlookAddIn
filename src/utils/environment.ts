export type AppEnvironment = 'outlook-addin' | 'web-app';

let isOfficeReadyFlag = false;

export const setOfficeReady = () => {
  isOfficeReadyFlag = true;
};

export const isOfficeReady = () => isOfficeReadyFlag;

export const initializeOffice = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    Office.onReady((info) => {
      console.log('[Environment] Office initialized:', info);
      setOfficeReady();
      resolve();
    });

    // Fallback timeout after 10s
    setTimeout(() => {
      if (!isOfficeReadyFlag) {
        console.warn('[Environment] Office.js initialization timed out');
        resolve();
      }
    }, 10000);
  });
};

export const getEnvironment = (): AppEnvironment => {
  // For now, always return outlook-addin. Adjust this as needed.
  return 'outlook-addin';
};

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Missing Supabase environment variables');
      return { url: '', key: '' };
    }
    throw new Error('Missing Supabase environment variables');
  }

  return { url, key };
}