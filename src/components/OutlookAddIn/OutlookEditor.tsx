import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { VariableDetector } from '@/services/VariableProcessor/detector';
import { Variable, VariableStatus } from '@/services/VariableProcessor/types';
import { v4 as uuidv4 } from 'uuid';

export const OutlookEditor = () => {
  const [originalText, setOriginalText] = useState<string>('');
  const [variables, setVariables] = useState<Variable[]>([]);
  const lastVariableCount = useRef<number>(0);
  const errorCount = useRef<number>(0);
  const MAX_ERRORS = 3;

  const checkContent = async () => {
    try {
      if (!Office?.context?.mailbox?.item) {
        throw new Error('Outlook context not available');
      }

      const result = await new Promise<Office.AsyncResult<string>>((resolve) => {
        Office.context.mailbox.item.body.getAsync(Office.CoercionType.Text, resolve);
      });
      if (result.status !== Office.AsyncResultStatus.Succeeded) {
        throw new Error(`Failed to get email content: ${result.error?.message}`);
      }

      const currentText = result.value;
      
      // Reset error count on successful operation
      errorCount.current = 0;
      
      if (currentText !== originalText && currentText !== undefined) {
        setOriginalText(currentText);
        
        const detected = VariableDetector.detect(currentText);
        
        if (detected.variables.length > lastVariableCount.current) {
          lastVariableCount.current = detected.variables.length;
          setVariables(detected.variables);
          
          const highlightedHtml = detected.variables.reduce((html, variable) => {
            return html.replace(
              `[${variable.content}]`,
              `<span style="background-color: ${getHighlightColor(variable.status)}">[${variable.content}]</span>`
            );
          }, currentText);

          const setResult = await new Promise<Office.AsyncResult<void>>((resolve) => {
            Office.context.mailbox.item.body.setAsync(
              highlightedHtml,
              { coercionType: Office.CoercionType.Html },
              resolve
            );
          });

          if (setResult.status !== Office.AsyncResultStatus.Succeeded) {
            throw new Error(`Failed to update email content: ${setResult.error?.message}`);
          }
        }
      }
    } catch (error) {
      errorCount.current++;
      console.error('Error in OutlookEditor:', {
        error,
        errorCount: errorCount.current,
        timestamp: new Date().toISOString()
      });

      // Stop polling if too many errors
      if (errorCount.current >= MAX_ERRORS) {
        console.error('Too many errors, stopping content monitoring');
        clearInterval(pollingInterval.current);
      }
    }
  };

  const debouncedCheck = debounce(checkContent, 200);
  const pollingInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    checkContent();
    pollingInterval.current = setInterval(debouncedCheck, 200);

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
      debouncedCheck.cancel();
    };
  }, []);

  return null;
};

const getHighlightColor = (status: VariableStatus): string => {
  switch (status) {
    case VariableStatus.DETECTED:
      return '#ADD8E6'; // Light blue
    case VariableStatus.FILLED:
      return '#90EE90'; // Light green
    case VariableStatus.NOT_FOUND:
      return '#FFB6C1'; // Light red
    default:
      return 'transparent';
  }
};
