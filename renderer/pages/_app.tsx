import React from 'react'
import type { AppProps } from 'next/app'

import '../styles/globals.css'
import { GlobalUiProvider } from '../provider/GlobalUiProvider'
import { CalendarStatusProvider } from '../provider/CalendarStatusProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (

    <CalendarStatusProvider>
      <GlobalUiProvider>
        <Component {...pageProps} />
      </GlobalUiProvider>
    </CalendarStatusProvider>
  )
}

export default MyApp
