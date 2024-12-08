import { useEffect, useState } from 'react';
import { OutlookToolbar } from '@/components/OutlookAddIn/OutlookToolbar';

export default function OutlookPage() {
  const [isOfficeReady, setIsOfficeReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Run this before component mounts
  useEffect(() => {
    Office.onReady((info) => {
      console.log('Office is ready:', info);
      setIsOfficeReady(true);
      setIsLoading(false);
    });

    // Fallback timeout
    const timeout = setTimeout(() => {
      if (!isOfficeReady) {
        console.error('[OutlookPage] Office.js load timeout');
        setIsLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, []); // Empty deps array means this runs once on mount

  return (
    <div className="outlook-container p-4">
      <h1 className="text-lg font-bold mb-4">Accountant Email Assistant</h1>
      {isLoading && <div>Loading Office.js...</div>}
      {!isLoading && !isOfficeReady && <div>Office not ready or not in Outlook environment.</div>}
      {isOfficeReady && <OutlookToolbar />}
    </div>
  );
}
