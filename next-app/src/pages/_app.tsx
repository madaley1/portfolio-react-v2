//Dependency Imports
import React from 'react';
import type { AppProps } from 'next/app';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

//Component Imports
import Layout from '@/components/Layout';

//Style Imports
import '@/Styles/css/main.css';

export default function App({ Component, pageProps }: AppProps) {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!key || !(typeof key === 'string')) {
    throw new Error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY not defined in .env.local');
  }
  return (
    <GoogleReCaptchaProvider reCaptchaKey={key}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GoogleReCaptchaProvider>
  );
}
