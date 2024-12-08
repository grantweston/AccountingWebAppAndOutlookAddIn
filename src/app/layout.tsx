import './globals.css'
import type { Metadata } from 'next'
import { waitForOffice, getEnvironment } from '@/utils/environment'
import Script from 'next/script'

// Use the global Office types defined in office.d.ts
type HostType = Office.HostType
type PlatformType = Office.PlatformType

export const metadata: Metadata = {
  title: 'Accountant Email Assistant',
  description: 'Email assistant for accountants using Claude AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const environment = getEnvironment();
  
  return (
    <html lang="en">
      <head>
        {environment === 'outlook-addin' && (
          <>
            <Script 
              src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"
              strategy="beforeInteractive"
              onLoad={() => {
                console.log('[Layout] Office.js loaded');
              }}
              onError={(e) => {
                console.error('[Layout] Failed to load Office.js:', e);
              }}
            />
            <Script
              id="office-init"
              strategy="afterInteractive"
            >
              {`
                (function initOffice() {
                  console.log('[Layout] Starting Office initialization');
                  
                  if (typeof Office === 'undefined') {
                    console.log('[Layout] Office not found, retrying in 100ms');
                    setTimeout(initOffice, 100);
                    return;
                  }

                  try {
                    console.log('[Layout] Setting up Office.initialize');
                    Office.initialize = function(reason) {
                      console.log('[Layout] Office initialized!', {
                        reason,
                        hasContext: !!Office.context,
                        hasMailbox: !!Office.context?.mailbox,
                        timestamp: new Date().toISOString()
                      });
                      window.Office.initialized = true;
                    };
                  } catch (error) {
                    console.error('[Layout] Error during initialization:', error);
                  }
                })();
              `}
            </Script>
          </>
        )}
      </head>
      <body suppressHydrationWarning={true}>
        <div id="office-container">
          {children}
        </div>
      </body>
    </html>
  )
} 