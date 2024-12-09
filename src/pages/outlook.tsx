import { useEffect } from 'react';
import { OutlookEditor } from '@/components/OutlookAddIn/OutlookEditor';
import { isOfficeEnvironment } from '@/utils/environment';

export default function OutlookPage() {
  useEffect(() => {
    if (!isOfficeEnvironment()) {
      console.warn('This page requires Outlook context');
      return;
    }

    Office.onReady((info) => {
      if (info.host === Office.HostType.Outlook) {
        console.log('Outlook Add-in initialized');
      }
    });
  }, []);

  return (
    <div className="outlook-container">
      <OutlookEditor />
    </div>
  );
}
