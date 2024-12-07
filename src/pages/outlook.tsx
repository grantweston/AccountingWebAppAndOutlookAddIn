import { useEffect } from 'react';
import { OutlookEditor } from '@/components/OutlookAddIn/OutlookEditor';
import { OutlookToolbar } from '@/components/OutlookAddIn/OutlookToolbar';
import { isOfficeEnvironment } from '@/utils/environment';

export default function OutlookPage() {
  useEffect(() => {
    console.log('[OutlookPage] Mounting...');
    
    if (!isOfficeEnvironment()) {
      console.warn('[OutlookPage] Not in Office environment');
      console.debug('[OutlookPage] Window.Office:', typeof window !== 'undefined' ? !!window.Office : 'no window');
      return;
    }

    Office.onReady((info) => {
      console.log('[OutlookPage] Office.js Ready:', info);
      
      if (info.host === Office.HostType.Outlook) {
        console.log('[OutlookPage] Outlook Add-in initialized');
        try {
          console.log('[OutlookPage] Mailbox:', Office.context.mailbox);
          console.log('[OutlookPage] Current item:', Office.context.mailbox.item);
          console.log('[OutlookPage] Host info:', {
            platform: Office.context.platform,
            host: Office.context.host,
            diagnostics: Office.context.diagnostics
          });
        } catch (error) {
          console.error('[OutlookPage] Error accessing Office context:', error);
        }
      } else {
        console.warn('[OutlookPage] Not in Outlook context:', info.host);
      }
    }).catch(error => {
      console.error('[OutlookPage] Office.onReady error:', error);
    });

    return () => {
      console.log('[OutlookPage] Unmounting...');
    };
  }, []);

  return (
    <div className="outlook-container p-4">
      <h1 className="text-xl font-bold mb-4">Accountant Email Assistant</h1>
      <OutlookToolbar />
      <OutlookEditor />
    </div>
  );
}
