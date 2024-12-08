import { useEffect, useState } from 'react';

declare const Office: any; // Temporary type fix

export const OutlookEditor = () => {
  const [isReady, setIsReady] = useState(false);
  const [emailContent, setEmailContent] = useState('');

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    const initializeOffice = () => {
      // Wait for Office to be defined
      if (typeof Office === 'undefined') {
        console.log('[OutlookEditor] Waiting for Office.js...');
        setTimeout(initializeOffice, 100);
        return;
      }

      console.log('[OutlookEditor] Office object found, initializing...');
      
      Office.initialize = function(reason: string) {
        console.log('[OutlookEditor] Office initialized:', reason);
        setIsReady(true);
        checkContent();
      };
    };

    initializeOffice();
  }, []);

  const checkContent = async () => {
    try {
      if (!Office?.context?.mailbox?.item) {
        console.log('[OutlookEditor] No mailbox item available');
        return;
      }

      const result = await new Promise<any>((resolve) => {
        Office.context.mailbox.item.body.getAsync('text', resolve);
      });

      if (result.status === 'succeeded') {
        setEmailContent(result.value);
      }
    } catch (error) {
      console.error('[OutlookEditor] Error getting email content:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Email Content</h2>
      {isReady ? (
        <div>
          <textarea
            value={emailContent}
            readOnly
            className="w-full h-48 p-2 border rounded"
          />
        </div>
      ) : (
        <div>Initializing Office.js...</div>
      )}
    </div>
  );
};
