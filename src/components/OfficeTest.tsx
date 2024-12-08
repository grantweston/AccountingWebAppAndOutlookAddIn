import { useEffect, useState } from 'react';

export function OfficeTest() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    if (typeof Office === 'undefined') {
      setStatus('Office.js not loaded');
      return;
    }

    Office.onReady((info) => {
      setStatus(`Office.js ready: ${info.host}`);
    });
  }, []);

  return <div>{status}</div>;
} 