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
      console.warn('[OutlookPage] Not in Office environment', {
        window: typeof window,
        Office: typeof window !== 'undefined' ? typeof window.Office : 'no window',
        environment: process.env.NODE_ENV
      });
      return;
    }

    if (window.Office) {
      console.log('[OutlookPage] Setting up Office.initialize');
      Office.initialize = function(reason) {
        console.log('[OutlookPage] Office initialized', {
          reason,
          context: Office.context,
          host: Office.context?.host,
          platform: Office.context?.platform,
          diagnostics: Office.context?.diagnostics
        });
        try {
          setIsOfficeReady(true);
          console.log('[OutlookPage] State updated: isOfficeReady = true');
        } catch (error) {
          console.error('[OutlookPage] Error in initialize callback:', error);
        }
      };
    } else {
      console.error('[OutlookPage] Office object not available when setting initialize');
    }

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
