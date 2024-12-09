declare namespace Office {
  enum HostType {
    Outlook = "Outlook"
  }

  enum PlatformType {
    PC = "PC",
    MAC = "MAC",
    WEB = "WEB"
  }

  interface MailboxItem {
    body: {
      getAsync(coercionType: CoercionType, callback: (result: AsyncResult<string>) => void): void;
      setAsync(content: string, options: { coercionType: CoercionType }, callback?: (result: AsyncResult) => void): void;
    };
  }

  interface Mailbox {
    item: MailboxItem;
  }

  interface Context {
    mailbox: Mailbox;
  }

  const context: Context;
  function onReady(callback: (info: { host: HostType; platform: PlatformType }) => void): void;
}

declare global {
  interface Window {
    Office: typeof Office;
  }
  const Office: typeof Office;
} 