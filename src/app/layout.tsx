import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { waitForOffice, getEnvironment } from '@/utils/environment'

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
          <Script 
            src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"
            strategy="beforeInteractive"
            async={false}
            defer={false}
            id="office-js"
            onLoad={() => {
              console.log('[Layout] Office.js script loaded', {
                hasOffice: typeof window !== 'undefined' && 'Office' in window,
                officeObject: typeof window !== 'undefined' ? window.Office : 'no window',
                environment: process.env.NODE_ENV
              });
              if (window.Office) {
                console.log('[Layout] Setting up Office.initialize');
                Office.initialize = function(reason) {
                  console.log('[Layout] Office initialized from script load', {
                    reason,
                    timestamp: new Date().toISOString()
                  });
                };
              } else {
                console.error('[Layout] Office object not available after script load');
              }
            }}
            onError={(e) => {
              console.error('[Layout] Error loading Office.js:', {
                error: e,
                timestamp: new Date().toISOString()
              });
            }}
          />
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