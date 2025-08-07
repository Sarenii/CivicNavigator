import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Layout from '@/components/common/Layout'
import Providers from '@/components/utils/providers'

export const metadata: Metadata = {
  title: 'CitizenNavigator',
  description: 'Municipal services chatbot and incident reporting system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Providers>
            <Layout>
              {children}
            </Layout>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}









