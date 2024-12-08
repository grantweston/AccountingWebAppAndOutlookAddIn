import './globals.css'
import type { Metadata } from 'next'
import { getEnvironment } from '@/utils/environment'

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
          <script 
            src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"
            type="text/javascript"
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