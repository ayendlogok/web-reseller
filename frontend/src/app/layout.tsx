import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import PubgBackground from '@/components/PubgBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PUBG Mobile Top-Up - Fast & Secure',
  description: 'Top up your PUBG Mobile UC instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col relative`}>
        <PubgBackground />
        
        <header className="fixed top-0 w-full z-50 glass-panel !rounded-none border-b border-t-0 border-x-0 border-slate-700">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600 tracking-tighter">
              KILAT<span className="text-white">TOPUP</span>
            </div>
            <nav className="flex gap-6 text-sm font-medium">
              <a href="/" className="hover:text-orange-400 transition-colors">Home</a>
              <a href="/track" className="hover:text-orange-400 transition-colors">Track Order</a>
            </nav>
          </div>
        </header>

        <main className="flex-grow pt-24 pb-12 container mx-auto px-4">
          {children}
        </main>

        <footer className="border-t border-slate-800 bg-slate-950 py-8">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} KilatTopup. All rights reserved.
          </div>
        </footer>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
