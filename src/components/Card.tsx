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
    <div className="flex-1 bg-black/60 text-white p-8 shadow-md rounded-3xl space-y-6">
      <Image src={image} width={100} height={100} alt={buttonText} />
      <p>{content}</p>
      <button className="bg-primary px-4 py-2 rounded-full flex items-center gap-2">
        <Image src={buttonIcon} alt={buttonText} height={'20'} width={'20'} />
        {buttonText}
      </button>
    </div>
  )
}
