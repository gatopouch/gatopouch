"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Heart,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Headphones,
  PawPrint,
  Sparkles,
  Gift,
  Clock,
  Check,
  ChevronRight,
  Menu,
  X,
  Mail,
  Mouse as MouseIcon,
  Feather,
  Bell,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

/* Reusable Ball icon (lucide doesn't export a "Ball" icon directly) */
function Ball({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 0 20M2 12a10 10 0 0 1 20 0" />
    </svg>
  );
}

/* =========================================================================
   Countdown component for the flash offer
   ========================================================================= */
function Countdown() {
  const [time, setTime] = useState({ hours: 23, minutes: 47, seconds: 18 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              minutes = 59;
              seconds = 59;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      {[
        { label: "Heures", value: time.hours },
        { label: "Minutes", value: time.minutes },
        { label: "Secondes", value: time.seconds },
      ].map((item, i) => (
        <div key={item.label} className="flex items-center gap-3 md:gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-cinnamon-900 text-cream-50 rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 min-w-[64px] md:min-w-[80px] text-center shadow-lg">
              <span className="font-display font-bold text-2xl md:text-3xl tabular-nums">
                {pad(item.value)}
              </span>
            </div>
            <span className="text-xs md:text-sm mt-2 text-cinnamon-700 font-medium">
              {item.label}
            </span>
          </div>
          {i < 2 && (
            <span className="font-display text-2xl md:text-3xl text-peach-500 -mt-6">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================================================================
   Sticky Header
   ========================================================================= */
function Header({ onOrderClick }: { onOrderClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#kit", label: "Le Kit" },
    { href: "#benefices", label: "Bénéfices" },
    { href: "#avis", label: "Avis" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-peach-gradient text-cream-50 text-center text-xs md:text-sm font-medium py-2.5 px-4">
        <span className="inline-flex items-center gap-2 flex-wrap justify-center">
          <Truck className="w-3.5 h-3.5" />
          Livraison offerte dès 39€
          <span className="opacity-50 hidden sm:inline">•</span>
          <Sparkles className="w-3.5 h-3.5 hidden sm:inline" />
          <span className="hidden sm:inline">
            Offre de lancement -30% — quantités limitées
          </span>
        </span>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-cream-50/95 backdrop-blur-md shadow-md shadow-cinnamon-900/5"
            : "bg-cream-50/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-peach-gradient flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <PawPrint className="w-5 h-5 md:w-6 md:h-6 text-cream-50" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-lg md:text-xl text-cinnamon-900">
                  PurrfectPlay
                </span>
                <span className="text-[10px] md:text-xs text-cinnamon-700 -mt-1 hidden sm:block">
                  Coffret interactif pour chat
                </span>
              </div>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-full text-cinnamon-800 hover:bg-peach-300/30 hover:text-cinnamon-900 transition-colors font-medium text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA + mobile menu button */}
            <div className="flex items-center gap-2">
              <Button
                onClick={onOrderClick}
                className="hidden sm:inline-flex bg-peach-gradient text-cream-50 hover:opacity-90 shadow-md hover:shadow-lg transition-all rounded-full px-5 md:px-6 font-display font-semibold"
              >
                Je commande — 29,90€
              </Button>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 rounded-full hover:bg-peach-300/30 text-cinnamon-800"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-cream-50 border-t border-cinnamon-900/10"
            >
              <div className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-cinnamon-800 hover:bg-peach-300/30 font-medium"
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    onOrderClick();
                  }}
                  className="mt-2 bg-peach-gradient text-cream-50 rounded-full font-display font-semibold"
                >
                  Je commande — 29,90€
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

/* =========================================================================
   HERO Section
   ========================================================================= */
function Hero({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <section className="relative overflow-hidden bg-hero-gradient paw-pattern">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-peach-300/40 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-peach-400/30 blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Tag */}
            <Badge className="inline-flex items-center gap-1.5 bg-peach-300/40 text-cinnamon-800 border-peach-400/30 hover:bg-peach-300/50 px-4 py-1.5 mb-5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Offre de lancement — quantités limitées
            </Badge>

            {/* Title */}
            <h1 className="font-display font-extrabold text-cinnamon-900 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5">
              Le coffret qui fait{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-peach-500">bondir de joie</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C40 4 80 4 120 7C160 10 180 6 198 4"
                    stroke="oklch(0.78 0.11 50)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              votre chat
            </h1>

            {/* Subtitle */}
            <p className="text-cinnamon-700 text-lg md:text-xl mb-7 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              4 jouets interactifs premium réunis dans un coffret cadeau. Pour
              réveiller l&apos;instinct de chasseur de votre chat, stimuler son
              intelligence et créer des moments complices inoubliables.
            </p>

            {/* Price */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-7">
              <span className="font-display font-bold text-4xl md:text-5xl text-cinnamon-900">
                29,90€
              </span>
              <span className="font-display text-xl text-cinnamon-700/60 line-through">
                49,90€
              </span>
              <Badge className="bg-peach-gradient text-cream-50 hover:bg-peach-gradient px-3 py-1.5 rounded-full text-sm font-bold">
                -40%
              </Badge>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                onClick={onOrderClick}
                size="lg"
                className="bg-peach-gradient text-cream-50 hover:opacity-90 shadow-xl hover:shadow-2xl hover:shadow-peach-500/30 transition-all rounded-full px-8 py-6 font-display font-bold text-base group"
              >
                <span className="flex items-center gap-2">
                  <PawPrint className="w-5 h-5" />
                  Je commande mon coffret
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <a
                href="#kit"
                className="inline-flex items-center justify-center gap-2 px-6 py-6 rounded-full border border-cinnamon-900/15 text-cinnamon-800 hover:bg-cream-100 hover:border-cinnamon-900/25 transition-all font-medium"
              >
                <Play className="w-4 h-4" />
                Voir le contenu du kit
              </a>
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-cream-50 bg-peach-gradient flex items-center justify-center"
                    >
                      <PawPrint className="w-3.5 h-3.5 text-cream-50" />
                    </div>
                  ))}
                </div>
                <span className="text-cinnamon-700 font-medium">
                  2 847 chats conquis
                </span>
              </div>
              <span className="hidden sm:inline text-cinnamon-700/40">•</span>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-peach-500 fill-peach-500"
                    />
                  ))}
                </div>
                <span className="text-cinnamon-700 font-semibold">4,8/5</span>
                <span className="text-cinnamon-700/60">(2 847 avis)</span>
              </div>
            </div>
          </motion.div>

          {/* Right: hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              {/* Main image with floating animation */}
              <div className="animate-float">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-cinnamon-900/20 ring-4 ring-cream-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-cat.png"
                    alt="Chat joueur s'amusant avec le PurrfectPlay Kit"
                    className="w-full h-auto object-cover aspect-[1344/768]"
                  />
                </div>
              </div>

              {/* Floating badge: -30% */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute -top-5 -left-5 md:-top-6 md:-left-6 bg-peach-gradient text-cream-50 rounded-full w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center shadow-xl"
              >
                <span className="font-display font-extrabold text-xl md:text-2xl leading-none">
                  -30%
                </span>
                <span className="text-[10px] md:text-xs font-medium mt-0.5">
                  Lancement
                </span>
              </motion.div>

              {/* Floating badge: livraison */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -right-3 md:-bottom-5 md:-right-5 bg-cream-50 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5"
              >
                <div className="w-10 h-10 rounded-full bg-peach-300/40 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-cinnamon-800" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs text-cinnamon-700">Livraison</span>
                  <span className="font-display font-bold text-sm text-cinnamon-900">
                    offerte dès 39€
                  </span>
                </div>
              </motion.div>

              {/* Floating badge: satisfaction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="hidden md:flex absolute top-1/2 -right-8 bg-cream-50 rounded-2xl shadow-xl px-3 py-2 items-center gap-2"
              >
                <Heart className="w-4 h-4 text-peach-500 fill-peach-500" />
                <span className="font-display font-semibold text-xs text-cinnamon-900">
                  Satisfait ou remboursé
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   Trust badges strip
   ========================================================================= */
function TrustBadges() {
  const badges = [
    { icon: Truck, label: "Livraison 48h", sub: "Partout en France" },
    { icon: Shield, label: "Paiement sécurisé", sub: "CB, PayPal, Apple Pay" },
    { icon: RefreshCw, label: "Satisfait ou remboursé", sub: "Sous 30 jours" },
    { icon: Headphones, label: "Service client", sub: "Lun-Ven, 9h-18h" },
  ];
  return (
    <section className="bg-cream-100 border-y border-cinnamon-900/10 py-6">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-full bg-peach-300/40 flex items-center justify-center shrink-0">
                <b.icon className="w-5 h-5 text-cinnamon-800" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-semibold text-sm text-cinnamon-900">
                  {b.label}
                </span>
                <span className="text-xs text-cinnamon-700/70">{b.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   Benefits Section
   ========================================================================= */
function Benefits() {
  const benefits = [
    {
      icon: Feather,
      title: "Réveille l'instinct de chasse",
      desc: "Les plumes, sons et mouvements imitent les proies naturelles. Votre chat retrouve ses réflexes de chasseur, reste actif et épanoui.",
    },
    {
      icon: Sparkles,
      title: "Stimule l'intelligence",
      desc: "Les jouets interactifs stimulent la cognition et évitent l'ennui. Idéal contre les comportements destructeurs et l'obésité féline.",
    },
    {
      icon: Heart,
      title: "Crée du lien complice",
      desc: "La canne à pêche favorise le jeu interactif avec vous. Des moments de complicité qui renforcent votre relation avec votre chat.",
    },
    {
      icon: RefreshCw,
      title: "Anti-ennui garanti",
      desc: "4 jouets différents pour varier les plaisirs. Votre chat ne se lassera jamais grâce à la diversité des textures, sons et mouvements.",
    },
    {
      icon: Shield,
      title: "Sûr et durable",
      desc: "Matériaux non toxiques certifiés sans phtalates. Coutures renforcées et plumes naturelles pour un usage prolongé en toute sécurité.",
    },
    {
      icon: Gift,
      title: "Coffret cadeau premium",
      desc: "Une boîte élégante parfaite à offrir. Idéale pour Noël, un anniversaire ou simplement pour faire plaisir à un amoureux de chats.",
    },
  ];
  return (
    <section id="benefices" className="py-16 md:py-24 bg-cream-50 paw-pattern">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 hover:bg-peach-300/50 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
            Pourquoi votre chat va adorer
          </Badge>
          <h2 className="font-display font-extrabold text-cinnamon-900 text-3xl md:text-5xl leading-tight mb-4">
            Plus qu&apos;un jouet, un{" "}
            <span className="text-peach-500">bonheur quotidien</span>
          </h2>
          <p className="text-cinnamon-700 text-lg leading-relaxed">
            Chaque élément du PurrfectPlay Kit a été pensé avec des
            comportementalistes félins pour répondre aux besoins naturels de
            votre chat : chasser, sauter, bondir, réfléchir et câliner.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-7 shadow-sm hover:shadow-xl hover:shadow-peach-500/10 border border-cinnamon-900/5 hover:border-peach-400/30 transition-all hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-peach-gradient flex items-center justify-center mb-5 shadow-md">
                <b.icon className="w-7 h-7 text-cream-50" />
              </div>
              <h3 className="font-display font-bold text-lg text-cinnamon-900 mb-2">
                {b.title}
              </h3>
              <p className="text-cinnamon-700 leading-relaxed text-[15px]">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   How it works section
   ========================================================================= */
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Ouvrez le coffret",
      desc: "Découvrez 4 jouets soigneusement sélectionnés, prêts à l'emploi. Aucune batterie à insérer, aucun assemblage compliqué.",
    },
    {
      number: "02",
      title: "Choisissez le jouet du jour",
      desc: "Canne à plume, balle sonore, souris à catnip ou crinkle — alternez selon l'humeur de votre chat pour un renouveau quotidien.",
    },
    {
      number: "03",
      title: "Jouez 15 minutes par jour",
      desc: "C'est suffisant pour combler ses besoins d'activité. Observez-le bondir, chasser, ronronner de plaisir. Le bonheur à l'état pur.",
    },
  ];
  return (
    <section className="py-16 md:py-24 bg-cream-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="rounded-3xl overflow-hidden shadow-xl shadow-cinnamon-900/15 ring-4 ring-cream-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/howitworks-1.png"
                alt="Chaton jouant avec une canne à plume"
                className="w-full h-auto object-cover aspect-[1344/768]"
              />
            </div>
            {/* Stat overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-5 -right-5 md:-bottom-6 md:-right-6 bg-cream-50 rounded-2xl shadow-xl p-4 md:p-5 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-peach-gradient flex items-center justify-center">
                <Clock className="w-6 h-6 text-cream-50" />
              </div>
              <div className="leading-tight">
                <span className="font-display font-extrabold text-2xl text-cinnamon-900">
                  15 min/jour
                </span>
                <p className="text-xs text-cinnamon-700">
                  suffisent au bonheur de votre chat
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: steps */}
          <div className="order-1 lg:order-2">
            <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 hover:bg-peach-300/50 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
              Comment ça marche
            </Badge>
            <h2 className="font-display font-extrabold text-cinnamon-900 text-3xl md:text-5xl leading-tight mb-6">
              Le bonheur de votre chat en{" "}
              <span className="text-peach-500">3 étapes</span>
            </h2>
            <div className="space-y-5 md:space-y-6">
              {steps.map((s, i) => (
                <motion.div
                  key={s.number}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="flex gap-4 md:gap-5"
                >
                  <div className="shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-cream-50 border-2 border-peach-400/40 flex items-center justify-center font-display font-extrabold text-peach-500 text-lg md:text-xl">
                      {s.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg md:text-xl text-cinnamon-900 mb-1.5">
                      {s.title}
                    </h3>
                    <p className="text-cinnamon-700 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   Product showcase
   ========================================================================= */
function ProductShowcase({ onOrderClick }: { onOrderClick: () => void }) {
  const items = [
    {
      icon: Feather,
      name: "Canne à plume télescopique",
      desc: "Plumes naturelles, manche extensible jusqu'à 90 cm. Le must pour le jeu interactif.",
    },
    {
      icon: Ball,
      name: "Balle sonore rebondissante",
      desc: "Sonne, roule à chaque mouvement. Stimule le réflexe de chasse, faite en silicone souple non toxique.",
    },
    {
      icon: MouseIcon,
      name: "Souris à catnip premium",
      desc: "Remplie d'herbe à chat naturelle (catnip) de qualité supérieure. Effet euphorisant garanti pendant 20 min.",
    },
    {
      icon: Bell,
      name: "Crinkle jouet à froisser",
      desc: "Texture qui crée un bruit de papier froissé addictif. Idéal pour les chats craintifs ou âgés.",
    },
  ];
  return (
    <section id="kit" className="py-16 md:py-24 bg-cream-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: product image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-peach-gradient blur-3xl opacity-20 rounded-full" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-cream-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/product-kit.png"
                alt="PurrfectPlay Kit — coffret de 4 jouets pour chat"
                className="w-full h-auto object-cover aspect-square"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-peach-gradient text-cream-50 rounded-2xl shadow-xl p-3 md:p-4 flex flex-col items-center"
            >
              <span className="font-display font-extrabold text-2xl md:text-3xl">
                4
              </span>
              <span className="text-[10px] md:text-xs font-medium -mt-1">
                jouets inclus
              </span>
            </motion.div>
          </motion.div>

          {/* Right: items list */}
          <div>
            <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 hover:bg-peach-300/50 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
              Ce que contient le coffret
            </Badge>
            <h2 className="font-display font-extrabold text-cinnamon-900 text-3xl md:text-5xl leading-tight mb-4">
              4 jouets premium dans{" "}
              <span className="text-peach-500">un seul coffret</span>
            </h2>
            <p className="text-cinnamon-700 text-lg leading-relaxed mb-7">
              Chaque jouet a été sélectionné pour son efficacité et sa
              sécurité. Ensemble, ils couvrent tous les besoins de jeu de votre
              chat — de la stimulation physique à l&apos;éveil olfactif.
            </p>

            <div className="space-y-3.5 mb-8">
              {items.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4 items-start bg-white rounded-2xl p-4 border border-cinnamon-900/5 hover:border-peach-400/30 hover:shadow-md transition-all"
                >
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-peach-300/30 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-cinnamon-800" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display font-bold text-cinnamon-900">
                        {item.name}
                      </h3>
                      <Check className="w-5 h-5 text-peach-500 shrink-0 mt-0.5" />
                    </div>
                    <p className="text-sm text-cinnamon-700 leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-7 p-5 rounded-2xl bg-cream-100 border border-peach-400/20">
              <div>
                <span className="text-cinnamon-700 text-sm">Prix du coffret</span>
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-3xl text-cinnamon-900">
                    29,90€
                  </span>
                  <span className="text-lg text-cinnamon-700/60 line-through">
                    49,90€
                  </span>
                </div>
              </div>
              <div className="h-12 w-px bg-cinnamon-900/15" />
              <div>
                <span className="text-cinnamon-700 text-sm">Soit</span>
                <div className="font-display font-bold text-xl text-peach-500">
                  7,48€ / jouet
                </div>
              </div>
            </div>

            <Button
              onClick={onOrderClick}
              size="lg"
              className="bg-peach-gradient text-cream-50 hover:opacity-90 shadow-xl hover:shadow-2xl hover:shadow-peach-500/30 transition-all rounded-full px-8 py-6 font-display font-bold text-base w-full sm:w-auto"
            >
              <PawPrint className="w-5 h-5 mr-2" />
              Je commande mon coffret — 29,90€
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   Testimonials
   ========================================================================= */
function Testimonials() {
  const testimonials = [
    {
      name: "Camille D.",
      location: "Lyon",
      cat: "Mochi, British Shorthair, 3 ans",
      image: "/images/testimonial-1.png",
      rating: 5,
      text: "Mochi était devenu apathique, je m'inquiétais. Depuis le PurrfectPlay Kit, il bondit comme un chaton ! La canne à plume est son jouet préféré. Je le vois s'épanouir jour après jour. Le meilleur achat de l'année.",
    },
    {
      name: "Thomas L.",
      location: "Bordeaux",
      cat: "Pixel, chat noir, 5 ans",
      image: "/images/testimonial-2.png",
      rating: 5,
      text: "J'ai testé des dizaines de jouets, la plupart finissent au fond d'un tiroir. Ceux-ci, Pixel les réclame tous les soirs. La balle sonore est géniale pour le faire courir. La qualité est au rendez-vous, rien n'a cassé après 3 mois.",
    },
    {
      name: "Madeleine R.",
      location: "Nantes",
      cat: "Gribouille, Calico, 9 ans",
      image: "/images/testimonial-3.png",
      rating: 5,
      text: "À 9 ans, ma Gribouille bougeait de moins en moins. Le crinkle jouet l'a fait sortir de sa léthargie. Elle recommence à jouer comme avant. C'est touchant. Et le coffret est si joli que je l'ai offert à mon amie pour son chat.",
    },
  ];
  return (
    <section id="avis" className="py-16 md:py-24 bg-cream-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 hover:bg-peach-300/50 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
            Ils ont fait bondir leurs chats
          </Badge>
          <h2 className="font-display font-extrabold text-cinnamon-900 text-3xl md:text-5xl leading-tight mb-4">
            Ce que les amoureux de chats{" "}
            <span className="text-peach-500">en disent</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-peach-500 fill-peach-500"
                />
              ))}
            </div>
            <span className="font-display font-bold text-cinnamon-900">
              4,8/5
            </span>
            <span className="text-cinnamon-700">— 2 847 avis vérifiés</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-7">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-cream-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-cinnamon-900/5 border border-cinnamon-900/5 transition-all flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.image}
                  alt={`${t.name} et son chat`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cinnamon-900/80 via-cinnamon-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-cream-50">
                  <div className="font-display font-bold text-lg">{t.name}</div>
                  <div className="text-sm opacity-90">
                    {t.location} • {t.cat}
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-peach-gradient text-cream-50 rounded-full px-3 py-1.5 flex items-center gap-1 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-cream-50" />
                  {t.rating}.0
                </div>
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <p className="text-cinnamon-800 leading-relaxed text-[15px] flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 text-xs text-cinnamon-700/70 pt-3 border-t border-cinnamon-900/10">
                  <Check className="w-4 h-4 text-peach-500" />
                  Achat vérifié
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   Flash offer with countdown
   ========================================================================= */
function FlashOffer({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <section className="py-16 md:py-24 bg-cream-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-peach-gradient text-cream-50 shadow-2xl shadow-peach-500/30"
        >
          {/* Decorative paws */}
          <PawPrint className="absolute top-8 right-8 w-32 h-32 opacity-10" />
          <PawPrint className="absolute bottom-8 left-8 w-40 h-40 opacity-10 rotate-180" />

          <div className="relative p-8 md:p-12 lg:p-16 text-center">
            <Badge className="inline-flex items-center gap-1.5 bg-cream-50/20 text-cream-50 border-cream-50/30 hover:bg-cream-50/30 px-4 py-1.5 mb-5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Offre de lancement limitée
            </Badge>

            <h2 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl leading-tight mb-4">
              -30% sur le PurrfectPlay Kit
            </h2>
            <p className="text-cream-50/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Profitez du prix de lancement exceptionnel avant que les stocks ne
              soient épuisés. Votre chat mérite ce bonheur sans attendre.
            </p>

            <div className="mb-8">
              <p className="text-cream-50/80 text-sm font-medium mb-4 uppercase tracking-wider">
                L&apos;offre se termine dans
              </p>
              <Countdown />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <div className="flex items-center gap-2 bg-cream-50/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <Truck className="w-4 h-4" />
                <span className="font-medium">Livraison offerte dès 39€</span>
              </div>
              <div className="flex items-center gap-2 bg-cream-50/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <RefreshCw className="w-4 h-4" />
                <span className="font-medium">Satisfait ou remboursé 30j</span>
              </div>
              <div className="flex items-center gap-2 bg-cream-50/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Paiement 3x sans frais</span>
              </div>
            </div>

            <Button
              onClick={onOrderClick}
              size="lg"
              className="bg-cream-50 text-cinnamon-900 hover:bg-cream-50/95 shadow-2xl rounded-full px-10 py-6 font-display font-extrabold text-lg group"
            >
              <span className="flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-peach-500" />
                Je commande maintenant — 29,90€
              </span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-cream-50/70 text-xs mt-5 max-w-md mx-auto">
              Plus que 23 coffrets disponibles à ce prix. Après, retour au tarif
              normal 49,90€.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================================
   FAQ
   ========================================================================= */
function FAQ() {
  const faqs = [
    {
      q: "Mon chat est difficile, va-t-il vraiment aimer ?",
      a: "97% de nos clients rapportent que leur chat s'est intéressé au coffret dès les premières minutes. Le kit contient 4 jouets aux textures et mouvements très différents (plumes, sons, catnip, crinkle) — il y en a forcément un qui correspondra à la personnalité de votre chat. Et si vraiment aucun ne l'attire, vous êtes couvert par notre garantie satisfait ou remboursé 30 jours.",
    },
    {
      q: "Quels sont les délais de livraison ?",
      a: "Votre commande est expédiée sous 24h ouvrées depuis notre entrepôt en France. Comptez ensuite 48h à 72h pour la livraison via Colissimo en France métropolitaine. Un numéro de suivi vous est envoyé par e-mail dès l'expédition. La livraison est offerte dès 39€ d'achat (le coffret PurrfectPlay à 29,90€ + un petit accessoire et c'est livré !).",
    },
    {
      q: "Les jouets sont-ils sûrs pour mon chat ?",
      a: "Absolument. Tous nos jouets sont testés et certifiés sans substances toxiques (sans phtalates, sans BPA). Les plumes sont naturelles et teintes avec des colorants alimentaires. La souris contient du catnip 100% naturel. Nous recommandons de toujours superviser votre chat pendant le jeu et de retirer les petits éléments s'ils commencent à s'abîmer.",
    },
    {
      q: "Quelle est la garantie satisfait ou remboursé ?",
      a: "Vous avez 30 jours pour tester le coffret. Si votre chat ne s'y intéresse pas ou si vous n'êtes pas pleinement satisfait, contactez notre service client — nous vous remboursons intégralement, sans avoir à renvoyer le coffret (à 29,90€ ce serait disproportionné). Notre priorité, c'est le bonheur de votre chat.",
    },
    {
      q: "Est-ce un bon cadeau pour offrir ?",
      a: "Le PurrfectPlay Kit est pensé comme un coffret cadeau premium. L'emballage est élégant et soigné, parfait pour Noël, un anniveraire, une pendaison de crémaillère ou simplement pour faire plaisir à un proche amoureux de chats. Vous pouvez même ajouter une carte cadeau personnalisée au moment de la commande.",
    },
    {
      q: "Puis-je payer en plusieurs fois ?",
      a: "Oui ! Le paiement en 3 fois sans frais est disponible à partir de 60€ d'achat. Pour le coffret seul (29,90€), le paiement 3x est proposé à partir de 2 coffrets achetés. Nous acceptons également CB, PayPal, Apple Pay et Google Pay via une connexion sécurisée SSL.",
    },
  ];
  return (
    <section id="faq" className="py-16 md:py-24 bg-cream-100">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 hover:bg-peach-300/50 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
            Questions fréquentes
          </Badge>
          <h2 className="font-display font-extrabold text-cinnamon-900 text-3xl md:text-5xl leading-tight">
            Tout ce que vous voulez{" "}
            <span className="text-peach-500">savoir</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem
                value={`faq-${i}`}
                className="bg-cream-50 border border-cinnamon-900/5 rounded-2xl px-5 md:px-6 data-[state=open]:shadow-md data-[state=open]:border-peach-400/30 transition-all"
              >
                <AccordionTrigger className="font-display font-semibold text-cinnamon-900 text-base md:text-lg hover:no-underline text-left py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-cinnamon-700 leading-relaxed text-[15px] pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* =========================================================================
   Newsletter
   ========================================================================= */
function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Oups, email invalide",
        description: "Veuillez saisir une adresse e-mail valide.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Merci !",
      description:
        "Votre code -10% arrive dans votre boîte mail. Bienvenue dans la famille PurrfectPlay !",
    });
    setEmail("");
  };

  return (
    <section className="py-16 md:py-24 bg-cream-50">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-cinnamon-900 text-cream-50 p-8 md:p-12 lg:p-16"
        >
          <PawPrint className="absolute top-8 right-8 w-40 h-40 text-cream-50/5" />
          <PawPrint className="absolute bottom-8 left-8 w-52 h-52 text-cream-50/5 rotate-180" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="inline-flex items-center gap-1.5 bg-peach-400/20 text-peach-300 border-peach-400/30 hover:bg-peach-400/30 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
                <Gift className="w-3.5 h-3.5" />
                Code -10% à l&apos;inscription
              </Badge>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl leading-tight mb-4">
                Rejoignez la famille PurrfectPlay
              </h2>
              <p className="text-cream-50/80 text-base md:text-lg leading-relaxed">
                Conseils de comportementalistes, offres exclusives, nouveautés
                et histoires de chats comblés. Recevez{" "}
                <span className="text-peach-300 font-semibold">
                  -10% sur votre première commande
                </span>{" "}
                dès maintenant.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cinnamon-700/60" />
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-cream-50 text-cinnamon-900 border-cinnamon-900/15 pl-12 h-14 rounded-full text-base focus-visible:ring-peach-400"
                />
              </div>
              <Button
                type="submit"
                className="bg-peach-gradient text-cream-50 hover:opacity-90 shadow-xl rounded-full h-14 font-display font-bold text-base"
              >
                <Gift className="w-5 h-5 mr-2" />
                Recevoir mon code -10%
              </Button>
              <p className="text-cream-50/60 text-xs text-center mt-1">
                Pas de spam. Désinscription en 1 clic. RGPD friendly.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================================
   Footer
   ========================================================================= */
function Footer() {
  return (
    <footer className="bg-cinnamon-900 text-cream-50/80 py-12 md:py-16 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-peach-gradient flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-cream-50" />
              </div>
              <span className="font-display font-bold text-lg text-cream-50">
                PurrfectPlay
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Le bonheur des chats et de leurs humains, un coffret à la fois.
              Conçu avec amour par des amoureux de chats, pour des amoureux de
              chats.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-cream-50 mb-4 text-sm uppercase tracking-wider">
              Produit
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#kit" className="hover:text-peach-300 transition-colors">
                  Le coffret
                </a>
              </li>
              <li>
                <a href="#benefices" className="hover:text-peach-300 transition-colors">
                  Bénéfices
                </a>
              </li>
              <li>
                <a href="#avis" className="hover:text-peach-300 transition-colors">
                  Avis clients
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-peach-300 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-cream-50 mb-4 text-sm uppercase tracking-wider">
              Aide
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-peach-300 transition-colors">
                  Suivi de commande
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peach-300 transition-colors">
                  Livraison & retours
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peach-300 transition-colors">
                  Nous contacter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peach-300 transition-colors">
                  Guide du chat heureux
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-cream-50 mb-4 text-sm uppercase tracking-wider">
              Suivez-nous
            </h4>
            <p className="text-sm mb-4">
              Rejoignez 18 000 amoureux de chats sur Instagram.
            </p>
            <div className="flex gap-3 flex-wrap">
              {["Instagram", "TikTok", "Pinterest"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="px-4 py-2 rounded-full bg-cream-50/10 hover:bg-cream-50/20 text-xs font-medium transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream-50/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream-50/60">
          <p>© 2025 PurrfectPlay. Tous droits réservés. Fait en France.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-peach-300 transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-peach-300 transition-colors">
              CGV
            </a>
            <a href="#" className="hover:text-peach-300 transition-colors">
              Confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   MAIN LandingPage component — composes everything
   ========================================================================= */
export default function LandingPage() {
  const { toast } = useToast();

  const handleOrder = () => {
    toast({
      title: "Redirection vers la boutique...",
      description:
        "Vous allez être redirigé vers la commande du PurrfectPlay Kit à 29,90€.",
    });
    setTimeout(() => {
      window.open("https://kim2ts-ct.myshopify.com/", "_blank");
    }, 800);
  };

  return (
    <main className="min-h-screen flex flex-col bg-cream-50">
      <Header onOrderClick={handleOrder} />
      <Hero onOrderClick={handleOrder} />
      <TrustBadges />
      <Benefits />
      <HowItWorks />
      <ProductShowcase onOrderClick={handleOrder} />
      <Testimonials />
      <FlashOffer onOrderClick={handleOrder} />
      <FAQ />
      <Newsletter />
      <Footer />
    </main>
  );
}
