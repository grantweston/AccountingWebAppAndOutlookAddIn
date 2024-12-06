import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import type { HostType, PlatformType } from '@microsoft/office-js'

export const metadata: Metadata = {
  title: 'Accountant Email Assistant',
  description: 'Email assistant for accountants using Claude AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"
          strategy="beforeInteractive"
          onError={(e) => {
            console.warn('Office.js failed to load:', e)
            window.Office = {
              onReady: (callback?: (info: { host: HostType; platform: PlatformType }) => any) => {
                if (callback) {
                  callback({ 
                    host: 'Outlook' as HostType,
                    platform: 'PC' as PlatformType 
                  })
                }
                return Promise.resolve({ 
                  host: 'Outlook' as HostType,
                  platform: 'PC' as PlatformType 
                })
              }
            } as typeof Office
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <div id="office-container">
          {children}
        </div>
      </body>
    </html>
  )
} 