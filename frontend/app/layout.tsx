import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'SyncPlay - Collaborative Playlist Manager',
  description: 'Experience music together with realtime collaborative playlists',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-dark-400 text-white min-h-screen overflow-hidden responsive-container">
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a1b26',
                color: '#ffffff',
                border: '1px solid #00ffcc',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#00ffcc',
                  secondary: '#1a1b26',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff006e',
                  secondary: '#1a1b26',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}