import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SwiftShelf | High-Concurrency AI E-Commerce Platform',
  description:
    'Ultra-modern e-commerce platform with 2-Phase Redis Stock Locks, Multimodal AI Visual Search, 3D WebGL Customizer, and Real-Time Business Intelligence.',
  keywords: [
    'e-commerce',
    'Next.js 15',
    'Redis Lock',
    'pgvector',
    'Stripe Checkout',
    'Three.js',
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
    <html lang="en" className="dark">
      <body className="antialiased bg-[#090B10] text-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
