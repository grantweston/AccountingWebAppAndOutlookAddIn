import './globals.css'
import type { Metadata } from 'next'
import { getEnvironment } from '@/utils/environment'
import Script from 'next/script'
import { initializeOffice } from '@/utils/officeLoader'

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
            id="office-loader"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (${initializeOffice.toString()})()
                  .then(() => console.log('[Layout] Office initialization complete'))
                  .catch(err => console.error('[Layout] Office initialization failed:', err));
              `
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