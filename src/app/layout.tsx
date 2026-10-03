import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Trico — Le sweat porte-chat qui garde votre chat contre vous, mains libres",
  description:
    "Le Trico est le sweat à capuche en polaire avec poche ventrale pour porter votre chat contre vous, mains libres. Câlins sans fin, à la maison comme en balade. Offre de lancement -29%, livraison offerte dès 49€.",
  keywords: [
    "sweat porte-chat",
    "sweat chat",
    "hoodie chat",
    "poche chat",
    "portable chat",
    "vêtement chat",
    "Trico",
    "sweat polaire chat",
    "cadeau amoureux chats",
  ],
  authors: [{ name: "Trico" }],
  openGraph: {
    title: "Trico — Le sweat porte-chat pour câlins mains libres",
    description:
      "Sweat à capuche en polaire avec poche ventrale pour porter votre chat contre vous. -29% au lancement, livraison offerte dès 49€.",
    url: "https://trico.fr",
    siteName: "Trico",
    type: "website",
    images: ["/images/trico-hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trico — Le sweat porte-chat pour câlins mains libres",
    description:
      "Sweat polaire avec poche ventrale pour porter votre chat contre vous. -29% au lancement.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-cream-50 text-cinnamon-900 font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
