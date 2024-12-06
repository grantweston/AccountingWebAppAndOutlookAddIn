import { useEffect } from 'react';
import { OutlookEditor } from '@/components/OutlookAddIn/OutlookEditor';

export default function OutlookPage() {
  useEffect(() => {
    // Initialize Office.js
    Office.onReady((info) => {
      if (info.host === Office.HostType.Outlook) {
        console.log('Outlook Add-in initialized');
      }
    });
  }, []);

  return (
    <div className="outlook-container">
      <OutlookEditor />
      {/* Task pane UI will go here later */}
    </div>
  );
}
