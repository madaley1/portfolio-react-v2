//Dependency Imports
import React from 'react';
import type { AppProps } from 'next/app';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

//Component Imports
import Layout from '@/components/Layout';

//Style Imports
import '@/Styles/sass/Global.scss';
import '@/Styles/sass/pages/page.scss';

export default function App({ Component, pageProps }: AppProps) {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!key || !(typeof key === 'string')) {
    throw new Error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY not defined in .env');
  }
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={key}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GoogleReCaptchaProvider>
  );
}
