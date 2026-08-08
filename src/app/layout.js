import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Itinera AI - Smart AI Travel Planner',
  description: 'Interactive AI-powered travel itinerary generator tailored to your travel companions and budget.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
