import type { Office } from '@microsoft/office-js'

declare global {
  interface Window {
    Office: typeof Office;
  }
  const Office: typeof Office;
}