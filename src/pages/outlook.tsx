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

    const waitForOffice = () => {
      if (typeof window !== 'undefined' && window.Office) {
        window.Office.onReady((info: { host: Office.HostType; platform: Office.PlatformType }) => {
          console.log('[OutlookPage] Office.onReady:', info);
          setIsOfficeReady(true);
          setIsLoading(false);
        });
      } else {
        console.log('[OutlookPage] Waiting for Office.js...');
        setTimeout(waitForOffice, 100);
      }
    };

    waitForOffice();
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
