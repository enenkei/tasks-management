'use client'

import Image from 'next/image'
import React from 'react'

const Error = () => {
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image src={'/images/warning-error-svgrepo-com.png'} width='300' height='300' alt='Error' />
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a href="/project" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go back home</a>
        {/* <a href="#" className="text-sm font-semibold text-gray-900 dark:text-gray-200">Contact support <span aria-hidden="true">&rarr;</span></a> */}
      </div>
    </div>
  )
}

export default Error
