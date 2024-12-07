import type { Office } from '@microsoft/office-js'

declare global {
  interface Window {
    Office: typeof Office & {
      initialized?: boolean;
    };
  }
  const Office: typeof Office & {
    initialize?: (reason?: string) => void;
  };
}

export {}