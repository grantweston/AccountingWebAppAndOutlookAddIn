const loadOfficeJs = () => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js';
    script.async = true;
    script.onload = () => {
      if (window.Office) {
        Office.onReady(() => {
          console.log('[OfficeLoader] Office.js loaded and ready');
          window.Office.initialized = true;
          resolve();
        });
      } else {
        reject(new Error('Office.js failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Office.js script'));
    document.head.appendChild(script);
  });
};

export const initializeOffice = async () => {
  try {
    await loadOfficeJs();
    return true;
  } catch (error) {
    console.error('[OfficeLoader] Failed to initialize Office:', error);
    return false;
  }
}; 