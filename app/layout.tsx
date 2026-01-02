import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientHeader from './ClientHeader';  // Global client header
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

// In return (at root level)
<Script
  src="https://js.stripe.com/v3/"
  strategy="beforeInteractive"
/>

export const metadata: Metadata = {
  title: 'Smartgeocode',
  description: 'Geocode app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientHeader />
        {children}
      </body>
    </html>
  );
}