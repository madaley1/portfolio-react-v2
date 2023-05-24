//Dependency Imports
import React from 'react';

// Style Imports
import { Inter } from 'next/font/google';
import '@/Styles/css/main.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Daley Development Portfolio',
  description: ''
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
