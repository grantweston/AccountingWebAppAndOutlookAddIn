import { useEffect, useState } from 'react';
import { OutlookEditor } from '@/components/OutlookAddIn/OutlookEditor';
import { OutlookToolbar } from '@/components/OutlookAddIn/OutlookToolbar';
import { isOfficeEnvironment } from '@/utils/environment';

export default function OutlookPage() {
  const [isOfficeReady, setIsOfficeReady] = useState(false);

  useEffect(() => {
    console.log('[OutlookPage] Mounting...');
    
    // Check if we're in Office environment
    if (!isOfficeEnvironment()) {
      console.warn('[OutlookPage] Not in Office environment');
      console.debug('[OutlookPage] Window.Office:', typeof window !== 'undefined' ? !!window.Office : 'no window');
      return;
    }

    // Wait for Office to be ready
    const initOffice = async () => {
      try {
        await new Promise((resolve) => {
          if (window.Office) {
            Office.onReady(() => resolve(true));
          } else {
            // Poll for Office object
            const interval = setInterval(() => {
              if (window.Office) {
                clearInterval(interval);
                Office.onReady(() => resolve(true));
              }
            }, 100);
          }
        });

        setIsOfficeReady(true);
        console.log('[OutlookPage] Office.js Ready');
      } catch (error) {
        console.error('[OutlookPage] Office initialization error:', error);
      }
    };

    initOffice();

    return () => {
      console.log('[OutlookPage] Unmounting...');
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
