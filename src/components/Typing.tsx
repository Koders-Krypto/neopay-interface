'use client'
import Typewriter from 'typewriter-effect'

export default function Typing() {
  return (
    <Typewriter
      options={{
        strings: ['Scan', 'Pay', 'Swap'],
        autoStart: true,
        loop: true,
      }}
    />
  )
}
