import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { ToastProvider } from '@/components/providers/toaster-provider'
import { ConfettiProvider } from '@/components/providers/confetti-provider'
import { NProgressProvider } from '@/components/providers/nprogress-provider'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: 'Nexus Learning',
  description: "More Than Tuition - it's a Transformation.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <head>
          {/* Preconnect to the Clerk domain to speed up authentication checks */}
          <link rel="preconnect" href="https://clerk.nexus-learning.vercel.app" />

          {/* Preconnect to Google Fonts servers */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

          {/* Preload the main Poppins font file to accelerate text rendering */}
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </head>
        <body className={poppins.className}>
          <NProgressProvider>
            <ConfettiProvider />
            <ToastProvider />
            {children}
          </NProgressProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
