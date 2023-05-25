//depdenency imports
import React, { PropsWithChildren } from 'react';

//component imports
import NavMenu from '@/components/NavMenu';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <NavMenu />
      {children}
    </>
  );
}
