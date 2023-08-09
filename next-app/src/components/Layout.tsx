//depdenency imports
import React, { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

//component imports
import NavMenu from '@/components/NavMenu';

export default function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  return (
    <>
      <NavMenu key={router.asPath} />
      {children}
    </>
  );
}
