//Dependency Imports
import React from 'react';
import type { AppProps } from 'next/app';

//Component Imports
import Layout from '@/components/Layout';

//Style Imports
import '@/Styles/css/main.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
