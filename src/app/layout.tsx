import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SareyBoth — Video Editor · Photo Editor · Poster Designer',
  description:
    'Editorial 3D Brutalist Gallery Atrium & Portfolio of SareyBoth. Commercial video editing, color grading, high-end photo retouching, and typography poster design in Phnom Penh, Cambodia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full w-full bg-[#060709] antialiased`}
    >
      <body className="h-full w-full overflow-hidden bg-[#060709] text-neutral-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
