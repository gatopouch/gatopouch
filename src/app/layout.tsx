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
  title: "PurrfectPlay Kit — Le coffret interactif qui éveille l'instinct de chasseur de votre chat",
  description:
    "Offrez à votre chat des heures de jeu et de bonheur. Le PurrfectPlay Kit réunit 4 jouets interactifs premium qui stimulent son instinct naturel. Offre de lancement -30% + livraison offerte dès 39€.",
  keywords: [
    "jouet pour chat",
    "kit interactif chat",
    "jouet électronique chat",
    "plume pour chat",
    "cadeau chat",
    "accessoires chat",
    "PurrfectPlay",
  ],
  authors: [{ name: "PurrfectPlay" }],
  openGraph: {
    title: "PurrfectPlay Kit — Le coffret qui fait bondir de joie votre chat",
    description:
      "4 jouets interactifs premium pour réveiller l'instinct de chasseur de votre chat. -30% au lancement, livraison offerte dès 39€.",
    url: "https://purrfectplay.fr",
    siteName: "PurrfectPlay",
    type: "website",
    images: ["/images/hero-cat.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PurrfectPlay Kit — Le coffret qui fait bondir de joie votre chat",
    description:
      "4 jouets interactifs premium pour réveiller l'instinct de chasseur de votre chat. -30% au lancement.",
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
