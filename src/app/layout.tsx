import { Toaster } from 'react-hot-toast'
import '../../styles/global.css'
import { Providers } from './providers'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Neopay - Simply Scan and Pay`,
  description: `Neopay - Scan and pay with ease send in any token and recieve in your choice of token`,
  openGraph: {
    title: 'NeoPay - Simply Scan and Pay',
    url: 'https://neopaynetwork.com/',
    description: `Neopay - Scan and pay with ease send in any token and recieve in your choice of token`,
    images: [
      {
        url: 'https://neopaynetwork.com/og/neopay-og.png',
        secureUrl: 'https://neopaynetwork.com/og/neopay-og.png',
        alt: 'NeoPay - Simply Scan and Pay',
        width: 1200,
        height: 630,
        type: 'image/png',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://neopaynetwork.com/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeoPay - Simply Scan and Pay',
    description: `Neopay - Scan and pay with ease send in any token and recieve in your choice of token`,
    creator: '@NeoPay',
    images: ['https://neopaynetwork.com/og/neopay-og.png'],
  },
  robots: {
    index: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        style={{
          background:
            'linear-gradient(96.5deg,rgba(39, 103, 187, 1) 10.4%,rgba(16, 72, 144, 1) 87.7%)',
        }}
      >
        <Toaster position="bottom-center" reverseOrder={false} />
        <Providers>
          <Navbar />
          <div className="max-w-7xl mx-auto px-4">{children}</div>
        </Providers>
        <Footer />
      </body>
    </html>
  )
}
