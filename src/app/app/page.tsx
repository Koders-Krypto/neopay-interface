'use client'

import { Tab } from '@headlessui/react'
import { Fragment, SVGProps } from 'react'
import ReceiveTab from '../../components/ReceiveTab'
import SendTab from '../../components/SendTab'

const CameraIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
    />
  </svg>
)

const QrIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
    />
  </svg>
)

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Tab.Group
        as="div"
        className="bg-black/60 rounded-xl shadow-md text-white p-6 max-w-sm w-full"
      >
        <Tab.List className="bg-black/50 rounded-lg p-1 flex mb-4">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`flex-1 px-4 py-1.5 rounded-md shadow-md focus:outline-none flex items-center justify-center gap-2 ${
                  selected ? 'bg-primary' : 'bg-transparent'
                }`}
              >
                <CameraIcon
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                />
                Send
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`flex-1 px-4 py-1.5 rounded-md shadow-md focus:outline-none flex items-center justify-center gap-2 ${
                  selected ? 'bg-primary' : 'bg-transparent'
                }`}
              >
                <QrIcon
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                />
                Recieve
              </button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <SendTab />
          </Tab.Panel>
          <Tab.Panel>
            <ReceiveTab />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
