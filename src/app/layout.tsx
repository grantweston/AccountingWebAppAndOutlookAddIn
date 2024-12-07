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
              id="office-js"
            />
            <Script
              id="office-init"
              strategy="afterInteractive"
            >
              {`
                function initializeOffice() {
                  console.log('[Layout] Injecting Office.js initialization');
                  if (window.Office) {
                    Office.initialize = function(reason) {
                      console.log('[Layout] Office initialized with reason:', reason);
                      window.Office.initialized = true;
                    };
                  } else {
                    console.error('[Layout] Office object not available during initialization');
                    setTimeout(initializeOffice, 100); // retry if Office isn't available
                  }
                }
                initializeOffice();
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