import { Toaster } from 'react-hot-toast'
import '../../styles/global.css'
import { Providers } from './providers'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
const noto = Noto_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

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
      <body className={noto.className + ' background'}>
        <Toaster position="bottom-center" reverseOrder={false} />
        <Providers>
          <Navbar />
          <div className="px-4 mx-auto max-w-7xl">{children}</div>
        </Providers>
        <Footer />
      </body>
    </html>
  )
}
