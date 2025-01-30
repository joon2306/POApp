import React from 'react'
import type { AppProps } from 'next/app'

import '../styles/globals.css'
import { GlobalUiProvider } from '../provider/GlobalUiProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (

    <GlobalUiProvider>
      <Component {...pageProps} />
    </GlobalUiProvider>
  )
}

export default MyApp
