import type { Metadata, Viewport } from 'next';
// import { Inter, Syne } from 'next/font/google';
import { Inter, Barlow_Condensed } from 'next/font/google';
import './globals.css';
import { ThemeProvider, themeInitScript } from '@/providers/ThemeProvider';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollIndicator from '@/components/layout/ScrollIndicator';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// const syne = Syne({
//   subsets: ['latin'],
//   variable: '--font-display',
//   weight: ['700', '800'],
//   display: 'swap',
// });

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rajan • Graphic Designer Portfolio',
  description: 'Graphic Designer specializing in poster designs, visual identity, branding, and creative artwork.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // className={`${inter.variable} ${syne.variable}`}
      className={`${inter.variable} ${barlowCondensed.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScrollProvider>
            <Navbar />
            <ScrollIndicator />
            {children}
            <Footer />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
