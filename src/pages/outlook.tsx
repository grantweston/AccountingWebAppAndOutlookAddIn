import { useEffect } from 'react';
import { OutlookEditor } from '@/components/OutlookAddIn/OutlookEditor';
import { OutlookToolbar } from '@/components/OutlookAddIn/OutlookToolbar';
import { isOfficeEnvironment } from '@/utils/environment';

export default function OutlookPage() {
  useEffect(() => {
    console.log('OutlookPage mounted');
    
    if (!isOfficeEnvironment()) {
      console.warn('This page requires Outlook context');
      return;
    }

    Office.onReady((info) => {
      console.log('Office.js Ready:', info);
      if (info.host === Office.HostType.Outlook) {
        console.log('Outlook Add-in initialized');
        console.log('Current item:', Office.context.mailbox.item);
      }
    });
  }, []);

  return (
    <div className="outlook-container p-4">
      <h1 className="text-xl font-bold mb-4">Accountant Email Assistant</h1>
      <OutlookToolbar />
      <OutlookEditor />
    </div>
  );
}
