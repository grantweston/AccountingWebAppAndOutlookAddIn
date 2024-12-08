import { useEffect, useState } from 'react';
import { OutlookToolbar } from '@/components/OutlookAddIn/OutlookToolbar';

export default function OutlookPage() {
  const [isOfficeReady, setIsOfficeReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (typeof Office === 'undefined') {
        throw new Error('Office.js not loaded');
      }

      Office.onReady((info) => {
        if (info.host === Office.HostType.Outlook) {
          console.log('Office is ready in Outlook');
          setIsOfficeReady(true);
        } else {
          setError('This add-in only works in Outlook');
        }
        setIsLoading(false);
      });

      const timeout = setTimeout(() => {
        if (!isOfficeReady) {
          setError('Office.js initialization timeout');
          setIsLoading(false);
        }
      }, 10000);

      return () => clearTimeout(timeout);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="outlook-container p-4">
      <h1 className="text-lg font-bold mb-4">Accountant Email Assistant</h1>
      {isLoading && <div>Loading Office.js...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!isLoading && !error && isOfficeReady && <OutlookToolbar />}
    </div>
  );
}
