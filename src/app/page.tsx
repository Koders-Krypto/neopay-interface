import Link from 'next/link'
import HeroImage from '../assets/hero-image.svg'
import Image from 'next/image'
import Card from '../components/Card'
import SendIcon from '../assets/icons/send.svg'
import SendButtonIcon from '../assets/icons/button-send.svg'
import QrIcon from '../assets/icons/qr.svg'
import QrButtonIcon from '../assets/icons/button-qr.svg'
import Typing from '../components/Typing'

export default function Page() {
  return (
    <>
      <main className="flex flex-col-reverse items-center justify-center min-h-screen gap-12 md:flex-row md:justify-between">
        <div className="self-start ml-4 space-y-6 md:ml-0 md:self-auto">
          <div className="flex flex-row gap-4 text-5xl font-bold leading-none uppercase md:text-7xl text-primary">
            <h1>Neopay -</h1>
            <Typing />
          </div>
          <h2 className="text-2xl font-bold leading-tight text-white uppercase md:text-3xl">
            Innovative Payment Solution Tailored for the{' '}
            <span className="underline decoration-primary">
              NEO Smart Economy
            </span>
          </h2>
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/app"
              className="px-4 py-2 text-lg text-white rounded-full shadow-md md:text-2xl bg-primary md:px-8"
            >
              Launch App
            </Link>
            <Link
              href="#readmore"
              className="text-lg md:text-2xl text-[#00E599] shadow-md border-2 border-primary px-4 md:px-8 py-1.5 rounded-full"
            >
              Read more
            </Link>
          </div>
        </div>
        <Image src={HeroImage} alt="" height={500} width={500} />
      </main>
      <section className="flex flex-col gap-6 md:flex-row" id="readmore">
        <Card
          image={SendIcon}
          buttonText="Send Payment"
          buttonIcon={SendButtonIcon}
          content="NeoPay is an open-source & hassle-free payment solution built on the Neo blockchain, that is straightforward to use. This payment and customizable option can be smoothly incorporated into any Dapps within the Neo Ecosystem by deploying the NeoPay Docker image."
        />
        <Card
          image={QrIcon}
          buttonText="Recieve Payment"
          buttonIcon={QrButtonIcon}
          content="Streamline customer payments with NeoPay's scan-and-pay feature. Effortlessly enable customers to make transactions by scanning the QR code, enhancing convenience and user experience which makes it easy and straightforward to use."
        />
      </section>
    </>
  )
}
