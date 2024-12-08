import './globals.css'
import type { Metadata } from 'next'
import { getEnvironment } from '@/utils/environment'
import Script from 'next/script'

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
                console.log('[Layout] Office.js loaded, window.Office:', !!window.Office);
                if (window.Office) {
                  console.log('[Layout] Office API version:', window.Office.context?.apiVersion);
                }
              }}
              onError={(e) => {
                console.error('[Layout] Failed to load Office.js:', e);
              }}
            />
            <Script
              id="office-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function initOffice() {
                    const checkInterval = setInterval(() => {
                      console.log('[Layout] Checking for Office object...', {
                        hasWindow: typeof window !== 'undefined',
                        hasOffice: typeof window !== 'undefined' && 'Office' in window,
                        initialized: window?.Office?.initialized
                      });
                      
                      if (typeof Office !== 'undefined') {
                        clearInterval(checkInterval);
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
                      }
                    }, 100);

                    // Clear interval after 30 seconds to prevent infinite checking
                    setTimeout(() => clearInterval(checkInterval), 30000);
                  })();
                `
              }}
            />
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