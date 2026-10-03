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
  title: "GatoPouch — Le sweat porte-chat qui garde votre chat contre vous, mains libres",
  description:
    "Le GatoPouch est le sweat à capuche en polaire avec poche ventrale pour porter votre chat contre vous, mains libres. Câlins sans fin, à la maison comme en balade. Dès 54,99€, Pack de 2 recommandé 94,98€, livraison offerte dès 69€ (livraison 6 à 12 jours).",
  keywords: [
    "sweat porte-chat",
    "sweat chat",
    "hoodie chat",
    "poche chat",
    "portable chat",
    "vêtement chat",
    "GatoPouch",
    "sweat polaire chat",
    "cadeau amoureux chats",
  ],
  authors: [{ name: "GatoPouch" }],
  openGraph: {
    title: "GatoPouch — Le sweat porte-chat pour câlins mains libres",
    description:
      "Sweat à capuche en polaire avec poche ventrale pour porter votre chat contre vous. -29% au lancement, livraison offerte dès 49€.",
    url: "https://trico.fr",
    siteName: "GatoPouch",
    type: "website",
    images: ["/images/trico-hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GatoPouch — Le sweat porte-chat pour câlins mains libres",
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
