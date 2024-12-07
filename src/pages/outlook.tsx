import { useEffect } from 'react';
import { OutlookEditor } from '@/components/OutlookAddIn/OutlookEditor';
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
    <div className="outlook-container">
      <h1>Accountant Email Assistant</h1>
      <OutlookEditor />
    </div>
  );
}
