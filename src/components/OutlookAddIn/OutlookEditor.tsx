import { useEffect, useState } from 'react';

export const OutlookEditor = () => {
  const [isReady, setIsReady] = useState(false);
  const [emailContent, setEmailContent] = useState('');

  useEffect(() => {
    const waitForOffice = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[OutlookEditor] Development mode - bypassing Office checks');
        setIsReady(true);
        return;
      }

      Office.onReady(() => {
        console.log('[OutlookEditor] Office is ready');
        setIsReady(true);
        checkContent();
      });
    };

    waitForOffice();
  }, []);

  const checkContent = async () => {
    try {
      if (!Office?.context?.mailbox?.item) {
        console.log('[OutlookEditor] No mailbox item available');
        return;
      }

      const result = await new Promise<Office.AsyncResult<string>>((resolve) => {
        Office.context.mailbox.item.body.getAsync(Office.CoercionType.Text, resolve);
      });

      if (result.status === Office.AsyncResultStatus.Succeeded) {
        setEmailContent(result.value);
      }
    } catch (error) {
      console.error('[OutlookEditor] Error getting email content:', error);
    }
  };

  // Actually show something on screen
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
        <div>Loading email content...</div>
      )}
    </div>
  );
};
