import { useState, useEffect } from 'react';
import { isOfficeReady } from '@/utils/environment';

export const useOutlookEmail = () => {
  const [emailContent, setEmailContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEmailContent = async () => {
      if (!isOfficeReady()) return;

      try {
        const item = Office.context.mailbox.item;
        if (!item) return;

        item.body.getAsync(Office.CoercionType.Text, (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            setEmailContent(result.value);
          }
        });
      } catch (error) {
        console.error('Failed to load email:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmailContent();
  }, []);

  const updateEmail = async (newContent: string) => {
    if (!isOfficeReady()) return;

    try {
      const item = Office.context.mailbox.item;
      if (!item) return;

      await new Promise((resolve, reject) => {
        item.body.setAsync(
          newContent,
          { coercionType: Office.CoercionType.Text },
          (result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
              resolve(result);
            } else {
              reject(result.error);
            }
          }
        );
      });

      setEmailContent(newContent);
    } catch (error) {
      console.error('Failed to update email:', error);
    }
  };

  return {
    emailContent,
    isLoading,
    updateEmail
  };
};