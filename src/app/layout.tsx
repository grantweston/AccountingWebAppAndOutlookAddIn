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