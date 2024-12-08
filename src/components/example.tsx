import { useEffect, useState } from 'react';
import { isOfficeReady } from '@/utils/environment';

export function ExampleComponent() {
  const [ready, setReady] = useState(isOfficeReady());

  useEffect(() => {
    if (!ready) {
      const checkInterval = setInterval(() => {
        if (isOfficeReady()) {
          setReady(true);
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, [ready]);

  if (!ready) return <div>Waiting for Office...</div>;

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
} 