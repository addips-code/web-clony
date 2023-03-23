import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { ChainId, ThirdwebProvider, useChainId } from "@thirdweb-dev/react";

export default function App({ Component, pageProps }: AppProps) {
  return(
    <ThirdwebProvider activeChain={ChainId.Mainnet}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  )
}