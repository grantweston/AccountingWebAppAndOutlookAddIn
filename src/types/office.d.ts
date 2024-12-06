declare namespace Office {
  enum AsyncResultStatus {
    Succeeded = "succeeded",
    Failed = "failed"
  }

  enum CoercionType {
    Text = "text",
    Html = "html"
  }

  enum HostType {
    Outlook = "Outlook"
  }

  interface AsyncResult<T = any> {
    status: AsyncResultStatus;
    value?: T;
    error?: {
      message: string;
    };
  }

  const context: {
    mailbox: {
      item: {
        body: {
          getAsync(coercionType: CoercionType, callback: (result: AsyncResult<string>) => void): void;
          setAsync(content: string, options: { coercionType: CoercionType }, callback?: (result: AsyncResult) => void): void;
        };
      };
    };
  };

  function onReady(callback: (info: { host: HostType }) => void): void;
}

declare global {
  interface Window {
    Office: typeof Office;
  }
  const Office: typeof Office;
} 