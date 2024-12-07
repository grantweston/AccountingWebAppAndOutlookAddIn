import { useEffect, useState } from 'react';
import { OutlookEditor } from '@/components/OutlookAddIn/OutlookEditor';
import { OutlookToolbar } from '@/components/OutlookAddIn/OutlookToolbar';
import { isOfficeEnvironment } from '@/utils/environment';

export default function OutlookPage() {
  const [isOfficeReady, setIsOfficeReady] = useState(false);

  useEffect(() => {
    console.log('[OutlookPage] Mounting...', {
      hasWindow: typeof window !== 'undefined',
      hasOffice: typeof window !== 'undefined' && 'Office' in window,
      officeObject: typeof window !== 'undefined' ? window.Office : 'no window'
    });
    
    if (!isOfficeEnvironment()) {
      console.warn('[OutlookPage] Not in Office environment');
      return;
    }

    // Wait for Office to be initialized
    const checkOfficeReady = () => {
      if (window.Office?.initialized) {
        console.log('[OutlookPage] Office is ready');
        setIsOfficeReady(true);
      } else {
        console.log('[OutlookPage] Office not ready, retrying...');
        setTimeout(checkOfficeReady, 100);
      }
    };

    checkOfficeReady();

    return () => {
      console.log('[OutlookPage] Unmounting');
    };
  }, []);

  if (!isOfficeReady) {
    return <div>Loading Office.js...</div>;
  }

  return (
    <div className="outlook-container p-4">
      <h1 className="text-xl font-bold mb-4">Accountant Email Assistant</h1>
      <OutlookToolbar />
      <OutlookEditor />
    </div>
  );
}
