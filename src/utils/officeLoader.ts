const loadOfficeJs = () => {
  return new Promise<void>((resolve, reject) => {
    // If we're not in an iframe, we're not in Outlook
    if (window.self === window.top) {
      reject(new Error('Not in Outlook context'));
      return;
    }

    // If Office.js is already loaded, just initialize it
    if (window.Office) {
      Office.initialize = () => {
        console.log('[OfficeLoader] Office initialized via Office.initialize');
        window.Office.initialized = true;
        resolve();
      };
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js';
    script.async = true;
    
    script.onload = () => {
      Office.initialize = () => {
        console.log('[OfficeLoader] Office initialized after script load');
        window.Office.initialized = true;
        resolve();
      };
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