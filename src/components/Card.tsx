'use client'

import Image from 'next/image'

type Props = {
  image: string
  content: string
  buttonText: string
  buttonIcon: string
}

export default function Card({
  buttonIcon,
  buttonText,
  content,
  image,
}: Props) {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 space-y-6 text-center text-white shadow-md bg-black/90 rounded-3xl">
      <div className="absolute top-[-3rem] p-1 rounded-full bg-black shadow-md border border-primary">
        <Image src={image} width={80} height={80} alt={buttonText} />
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <p>{content}</p>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary">
          <Image src={buttonIcon} alt={buttonText} height={'20'} width={'20'} />
          {buttonText}
        </button>
      </div>
    </div>
  )
}
