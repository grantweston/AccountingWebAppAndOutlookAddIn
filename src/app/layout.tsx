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
                console.log('[Layout] Office.js loaded');
              }}
            />
            <Script
              id="office-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  if (window.Office) {
                    Office.onReady(function(info) {
                      console.log('[Layout] Office.onReady called:', info);
                      window.Office.initialized = true;
                    });
                  }
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