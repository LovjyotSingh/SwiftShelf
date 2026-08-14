import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import CyberBackground from '@/components/CyberBackground';

export const metadata: Metadata = {
  title: 'SwiftShelf | High-Concurrency AI E-Commerce Platform',
  description:
    'Ultra-modern e-commerce platform with 2-Phase Redis Stock Locks, Multimodal AI Visual Search, and Real-Time Business Intelligence.',
  keywords: [
    'e-commerce',
    'Next.js 15',
    'Redis Lock',
    'pgvector',
    'High Concurrency',
  ],
  authors: [{ name: 'Lovjyot Singh' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen relative">
        <CyberBackground />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
