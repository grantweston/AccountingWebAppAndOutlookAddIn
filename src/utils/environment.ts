export type AppEnvironment = 'outlook-addin' | 'web-app';

export const isOfficeEnvironment = (): boolean => {
  return typeof window !== 'undefined' && 'Office' in window;
};

export const waitForOffice = (): Promise<void> => {
  if (!isOfficeEnvironment()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    Office.onReady(() => resolve());
  });
};

export const getEnvironment = (): AppEnvironment => {
  return isOfficeEnvironment() ? 'outlook-addin' : 'web-app';
}; 