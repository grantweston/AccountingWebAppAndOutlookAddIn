import '../app/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import { initializeOffice } from '@/utils/environment';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initializeOffice();
  }, []);

  return <Component {...pageProps} />
}