import { useEffect, useState } from 'react';
import { OutlookEditor } from '@/components/OutlookAddIn/OutlookEditor';
import { OutlookToolbar } from '@/components/OutlookAddIn/OutlookToolbar';

export default function OutlookPage() {
  const [isOfficeReady, setIsOfficeReady] = useState(false);

  useEffect(() => {
    if (typeof Office === 'undefined') {
      console.error('[OutlookPage] Office.js not loaded');
      return;
    }

    Office.onReady((info) => {
      console.log('[OutlookPage] Office.onReady:', info);
      setIsOfficeReady(true);
    });
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
