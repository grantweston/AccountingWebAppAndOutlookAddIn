import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { getEnvironment } from '@/utils/environment'

export const metadata: Metadata = {
  title: 'Accountant Email Assistant',
  description: 'Email assistant for accountants using Claude AI'
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
            onLoad={() => console.log('Office.js loaded')}
            onError={(e) => console.error('Office.js failed to load:', e)}
          />
        )}
      </head>
      <body>
        <div id="office-container">
          {children}
        </div>
      </body>
    </html>
  )
}