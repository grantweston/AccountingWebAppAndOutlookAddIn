const loadOfficeJs = () => {
  return new Promise<void>((resolve, reject) => {
    try {
      // If Office is already available, initialize it
      if (window.Office) {
        console.log('[OfficeLoader] Office object found, initializing...');
        Office.initialize = function(reason) {
          console.log('[OfficeLoader] Office initialized with reason:', reason);
          window.Office.initialized = true;
          resolve();
        };
        return;
      }

      console.log('[OfficeLoader] Loading Office.js script...');
      const script = document.createElement('script');
      script.src = 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js';
      script.async = false; // Load synchronously to ensure proper initialization
      
      script.onload = () => {
        console.log('[OfficeLoader] Office.js script loaded');
        Office.initialize = function(reason) {
          console.log('[OfficeLoader] Office initialized with reason:', reason);
          window.Office.initialized = true;
          resolve();
        };
      };
      
      script.onerror = (e) => {
        console.error('[OfficeLoader] Failed to load Office.js:', e);
        reject(new Error('Failed to load Office.js script'));
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error('[OfficeLoader] Error during Office.js loading:', error);
      reject(error);
    }
  });
};

export const initializeOffice = async () => {
  try {
    console.log('[OfficeLoader] Starting Office initialization...');
    await loadOfficeJs();
    console.log('[OfficeLoader] Office initialization complete');
    return true;
  } catch (error) {
    console.error('[OfficeLoader] Failed to initialize Office:', error);
    return false;
  }
}; 