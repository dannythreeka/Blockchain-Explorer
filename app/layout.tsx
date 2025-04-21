import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { Author } from 'next/dist/lib/metadata/types/metadata-types';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Blockchain Explorer - On-Chain Insights',
  description:
    'Explore blockchain data, accounts, blocks, transactions, and more. A tool to help developers build and analyze smart contracts with ease.',
  keywords: [
    'Blockchain',
    'Explorer',
    'Smart Contracts',
    'On-Chain Data',
    'Ethereum',
    'Transactions',
    'Blocks',
  ],
  authors: {
    url: 'https://github.com/dannythreeka',
    name: 'dannythreeka',
  } as Author,
  viewport: 'width=device-width, initial-scale=1.0',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div>
          <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-md z-10">
            <nav className="flex justify-around">
              <Link href="/accounts">Accounts</Link>
              <Link href="/blocks">Blocks</Link>
              <Link href="/transactions">Transactions</Link>
              <Link href="/contracts">Contracts</Link>
              <Link href="/events">Events</Link>
              <Link href="/logs">Logs</Link>
              <Link href="/settings">Settings</Link>
            </nav>
          </header>
          <main className="pt-16">{children}</main>
        </div>
      </body>
    </html>
  );
}
