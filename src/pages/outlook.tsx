import { useEffect, useState } from 'react';
import { OutlookEditor } from '@/components/OutlookAddIn/OutlookEditor';
import { OutlookToolbar } from '@/components/OutlookAddIn/OutlookToolbar';

export default function OutlookPage() {
  const [isOfficeReady, setIsOfficeReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    
    // In development, we can bypass the Office.js requirement
    if (isDev) {
      console.log('[OutlookPage] Development mode - bypassing Office.js check');
      setIsOfficeReady(true);
      setIsLoading(false);
      return;
    }

    if (typeof Office === 'undefined') {
      console.log('[OutlookPage] Waiting for Office.js...');
      const checkOffice = setInterval(() => {
        if (typeof Office !== 'undefined') {
          clearInterval(checkOffice);
          Office.onReady((info) => {
            console.log('[OutlookPage] Office.onReady:', info);
            setIsOfficeReady(true);
            setIsLoading(false);
          });
        }
      }, 100);

      return () => clearInterval(checkOffice);
    } else {
      Office.onReady((info) => {
        console.log('[OutlookPage] Office.onReady:', info);
        setIsOfficeReady(true);
        setIsLoading(false);
      });
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="outlook-container p-4">
      <h1 className="text-xl font-bold mb-4">Accountant Email Assistant</h1>
      <OutlookToolbar />
      {isOfficeReady && <OutlookEditor />}
    </div>
  );
}
