import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FlamVoyager - AI Travel Planner',
  description: 'AI-powered interactive travel itinerary generator built for Flam Frontend Internship Assignment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
