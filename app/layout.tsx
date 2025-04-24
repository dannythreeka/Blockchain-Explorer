import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { Author } from 'next/dist/lib/metadata/types/metadata-types';
import { ThemeProvider } from '../utils/theme/ThemeProvider';
import { ThemeToggle } from './_components/ThemeToggle';

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
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-900 dark:text-white bg-white text-black`}
      >
        <ThemeProvider>
          <div>
            <header className="fixed top-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 shadow-md z-10">
              <div className="flex justify-between items-center">
                <nav className="flex space-x-6">
                  <Link
                    href="/accounts"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Accounts
                  </Link>
                  <Link
                    href="/blocks"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Blocks
                  </Link>
                  <Link
                    href="/transactions"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Transactions
                  </Link>
                  <Link
                    href="/contracts"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Contracts
                  </Link>
                  <Link
                    href="/events"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Events
                  </Link>
                  <Link
                    href="/logs"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Logs
                  </Link>
                  <Link
                    href="/settings"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Settings
                  </Link>
                </nav>
                <ThemeToggle />
              </div>
            </header>
            <main className="pt-16 min-h-screen">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
