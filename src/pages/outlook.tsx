import { useEffect, useState } from 'react';
import { OutlookToolbar } from '@/components/OutlookAddIn/OutlookToolbar';

export default function OutlookPage() {
  const [isOfficeReady, setIsOfficeReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isOfficeContext = urlParams.has('_host');
    
    if (!isOfficeContext) {
      console.log('[OutlookPage] Not in Office context');
      setIsLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      console.error('[OutlookPage] Office.js load timeout');
      setIsLoading(false);
    }, 10000);

    const waitForOffice = () => {
      if (typeof window !== 'undefined' && window.Office) {
        clearTimeout(timeout);
        window.Office.onReady((info) => {
          console.log('[OutlookPage] Office.onReady:', info);
          setIsOfficeReady(true);
          setIsLoading(false);
        });
      } else {
        setTimeout(waitForOffice, 100);
      }
    };

    waitForOffice();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="outlook-container p-4">
      <h1 className="text-lg font-bold mb-4">Accountant Email Assistant</h1>
      {isOfficeReady ? (
        <OutlookToolbar />
      ) : (
        <div>Loading Office.js... {isLoading ? 'Initializing...' : 'Waiting for Outlook context'}</div>
      )}
    </div>
  );
}
