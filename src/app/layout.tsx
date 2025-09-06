import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Patrick_Hand, Dela_Gothic_One } from 'next/font/google';
import { cn } from '@/lib/utils';

const patrickHand = Patrick_Hand({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sans' 
});

const delaGothicOne = Dela_Gothic_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'sILLYtEXT - Universal Text Utility Suite',
    template: '%s | sILLYtEXT',
  },
  description: 'A comprehensive suite of free online text utilities: case converter, word counter, text reverser, whitespace remover, duplicate line remover, text diff tool, and encoder/decoder. Boost your productivity with sILLYtEXT.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", patrickHand.variable, delaGothicOne.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
