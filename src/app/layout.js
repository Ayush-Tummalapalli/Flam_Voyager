import './globals.css';

export const metadata = {
  title: 'Itinera AI - Smart AI Travel Planner',
  description: 'Interactive AI-powered travel itinerary generator tailored to your travel companions and budget.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
