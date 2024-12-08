import { Html, Head, Main, NextScript } from "next/document";
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"
          strategy="beforeInteractive"
          id="office-js"
          onLoad={() => {
            console.log('[Document] Office.js loaded');
            // Add global error handler
            window.onerror = function(msg, url, line, col, error) {
              console.error('[Global Error]', { msg, url, line, col, error });
              return false;
            };
            // Add unhandled promise rejection handler
            window.onunhandledrejection = function(event) {
              console.error('[Unhandled Promise]', event.reason);
            };
          }}
          onError={(e) => {
            console.error('[Document] Error loading Office.js:', e);
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
