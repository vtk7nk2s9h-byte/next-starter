import "../app/ui/global.css";
import { Header } from "@/components/ui/header-3";
import MaroonDataWires from "@/components/ui/maroon-data-wires";
import { themeScript } from "./ui/theme-script";
import { inter } from "./ui/fonts";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The head script sets data-theme/class on <html> before React hydrates,
    // so the server and client markup differ here by design.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <MaroonDataWires />
        <Header />
        {children}
      </body>
    </html>
  );
}
