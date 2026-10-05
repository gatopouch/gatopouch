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
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Loader2,
  WashingMachine,
  Ruler,
  Palette,
  Shirt,
  Baby,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  ContactModal,
  PrivacyPolicyModal,
  TermsModal,
  ReturnsModal,
  ShippingModal,
} from "./modals";
import { LocaleSwitcher } from "./locale-switcher";

/* =========================================================================
   Countdown component for the flash offer
   ========================================================================= */
function Countdown() {
  const [time, setTime] = useState({ hours: 47, minutes: 32, seconds: 11 });

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
              hours = 47;
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
    { href: "#produit", label: "Le GatoPouch" },
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
          Livraison offerte dès 69€
          <span className="opacity-50 hidden sm:inline">•</span>
          <Sparkles className="w-3.5 h-3.5 hidden sm:inline" />
          <span className="hidden sm:inline">
            Pack de 2 recommandé — économisez 15€
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
                  GatoPouch
                </span>
                <span className="text-[10px] md:text-xs text-cinnamon-700 -mt-1 hidden sm:block">
                  Sweat Porte-Chat
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
              <ContactModal>
                <button className="px-4 py-2 rounded-full text-cinnamon-800 hover:bg-peach-300/30 hover:text-cinnamon-900 transition-colors font-medium text-sm">
                  Contact
                </button>
              </ContactModal>
            </nav>

            {/* CTA + mobile menu button */}
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <Button
                onClick={onOrderClick}
                className="hidden sm:inline-flex bg-peach-gradient text-cream-50 hover:opacity-90 shadow-md hover:shadow-lg transition-all rounded-full px-5 md:px-6 font-display font-semibold"
              >
                Je commande — 54,99€
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
                <ContactModal>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-left px-4 py-3 rounded-xl text-cinnamon-800 hover:bg-peach-300/30 font-medium"
                  >
                    Contact
                  </button>
                </ContactModal>
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    onOrderClick();
                  }}
                  className="mt-2 bg-peach-gradient text-cream-50 rounded-full font-display font-semibold"
                >
                  Je commande — 54,99€
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
              Le sweat qui porte{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-peach-500">votre chat</span>
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
              contre vous
            </h1>

            {/* Subtitle */}
            <p className="text-cinnamon-700 text-lg md:text-xl mb-7 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Le GatoPouch est le sweat à capuche en polaire avec poche ventrale
              pour votre chat. Gardez-le tout contre vous, mains libres, à la
              maison comme en balade. Le bonheur partagé, en mouvement.
            </p>

            {/* Price */}
            <div className="flex flex-col items-center lg:items-start gap-3 mb-7">
              <div className="flex items-center gap-3">
                <span className="text-cinnamon-700 text-sm font-medium uppercase tracking-wider">
                  Dès
                </span>
                <span className="font-display font-extrabold text-5xl md:text-6xl text-cinnamon-900">
                  54,99€
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge className="bg-peach-gradient text-cream-50 hover:bg-peach-gradient px-3 py-1.5 rounded-full text-xs font-bold">
                  Pack de 2 recommandé
                </Badge>
                <span className="text-cinnamon-700">
                  <span className="font-display font-bold text-cinnamon-900">
                    94,98€
                  </span>{" "}
                  · économise 15€ + livraison offerte
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                onClick={onOrderClick}
                size="lg"
                className="bg-peach-gradient text-cream-50 hover:opacity-90 shadow-xl hover:shadow-2xl hover:shadow-peach-500/30 transition-all rounded-full px-8 py-6 font-display font-bold text-base group"
              >
                <span className="flex items-center gap-2">
                  <Shirt className="w-5 h-5" />
                  Je commande mon GatoPouch
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <a
                href="#packs"
                className="inline-flex items-center justify-center gap-2 px-6 py-6 rounded-full border border-cinnamon-900/15 text-cinnamon-800 hover:bg-cream-100 hover:border-cinnamon-900/25 transition-all font-medium"
              >
                <Gift className="w-4 h-4" />
                Voir les packs & économies
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
                  1 432 chats câlinés
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
                <span className="text-cinnamon-700 font-semibold">4,9/5</span>
                <span className="text-cinnamon-700/60">(1 432 avis)</span>
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
                    src="/images/trico-hero.png"
                    alt="Femme portant son chat dans le sweat GatoPouch, moment complice"
                    className="w-full h-auto object-cover aspect-[1344/1598]"
                  />
                </div>
              </div>

              {/* Floating badge: -15€ */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute -top-5 -left-5 md:-top-6 md:-left-6 bg-peach-gradient text-cream-50 rounded-full w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center shadow-xl"
              >
                <span className="font-display font-extrabold text-xl md:text-2xl leading-none">
                  -15€
                </span>
                <span className="text-[10px] md:text-xs font-medium mt-0.5">
                  Pack de 2
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
                    offerte dès 69€
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
    { icon: Truck, label: "Livraison 6-12j", sub: "Partout en Europe" },
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
      icon: Heart,
      title: "Câlins mains libres",
      desc: "Portez votre chat blotti contre votre cœur, partout où vous allez. Sans occuper vos bras, profitez d'une tendresse continue, au bureau comme en balade.",
    },
    {
      icon: Sparkles,
      title: "Confort polaire premium",
      desc: "Tissu sherpa épais (300g/m²), ultra-doux et bien chaud. Vous et votre chat restez au chaud même les jours d'hiver glacial ou de climatisation poussée.",
    },
    {
      icon: Shield,
      title: "Sécurité rassurante",
      desc: "L'ouverture circulaire élastiquée maintient votre chat en place sans le serrer. Le cordon coulissant ajuste la taille d'ouverture selon sa morphologie.",
    },
    {
      icon: PawPrint,
      title: "Télétravail complice",
      desc: "Votre chat blotti contre vous pendant que vous travaillez. Fini les chats qui marchent sur le clavier : il ronronne dans sa poche, serein et présent.",
    },
    {
      icon: WashingMachine,
      title: "Lavable en machine",
      desc: "Matière résistante lavable à 30° en machine. Pas de déformation, pas de boulochage. La polaire garde sa douceur lavage après lavage.",
    },
    {
      icon: Gift,
      title: "Cadeau parfait",
      desc: "Emballage soigné et premium. Idéal pour Noël, la fête des mères, un anniversaire ou pour surprendre un proche amoureux de chats. Le cadeau qui émeut.",
    },
  ];
  return (
    <section id="benefices" className="py-16 md:py-24 bg-cream-50 paw-pattern">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 hover:bg-peach-300/50 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
            Pourquoi vous allez l'adorer
          </Badge>
          <h2 className="font-display font-extrabold text-cinnamon-900 text-3xl md:text-5xl leading-tight mb-4">
            Plus qu&apos;un sweat, un{" "}
            <span className="text-peach-500">cocon partagé</span>
          </h2>
          <p className="text-cinnamon-700 text-lg leading-relaxed">
            Le GatoPouch a été pensé avec des comportementalistes félins et des
            designers textile. Chaque détail répond à un besoin : rapprocher
            votre chat de vous, en toute sécurité, en toutes circonstances.
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
      title: "Enfilez le GatoPouch",
      desc: "Comme un sweat à capuche classique. La polaire épaisse vous enveloppe de douceur. Ajustez le capuchon à votre guise avec les cordons.",
    },
    {
      number: "02",
      title: "Invitez votre chat",
      desc: "Par la poche ventrale. La grande ouverture circulaire élastiquée facilite l'entrée. Votre chat s'y glisse naturellement, attiré par votre chaleur.",
    },
    {
      number: "03",
      title: "Ajustez le cordon",
      desc: "Sous la poche, tirez le cordon coulissant pour adapter la taille d'ouverture à votre chat. Il est maintenu confortablement, sans pression.",
    },
    {
      number: "04",
      title: "Savourez le moment",
      desc: "Mains libres ! Travaillez, marchez, lisez, prenez un café. Votre chat ronronne contre vous, présent et apaisé. Le bonheur à l'état pur.",
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
                src="/images/trico-howitworks.png"
                alt="Femme télétravaillant avec son chat dans le sweat GatoPouch"
                className="w-full h-auto object-cover aspect-[1344/1598]"
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
                <PawPrint className="w-6 h-6 text-cream-50" />
              </div>
              <div className="leading-tight">
                <span className="font-display font-extrabold text-2xl text-cinnamon-900">
                  Mains libres
                </span>
                <p className="text-xs text-cinnamon-700">
                  télétravail, balade, lecture...
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
              Le câlin partagé en{" "}
              <span className="text-peach-500">4 étapes</span>
            </h2>
            <div className="space-y-5 md:space-y-6">
              {steps.map((s, i) => (
                <motion.div
                  key={s.number}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
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
  const features = [
    {
      icon: Shirt,
      name: "Polaire sherpa épaisse 300g/m²",
      desc: "Tissu ultra-doux, chaud et respirant. Confort cocooning pour vous et votre chat.",
    },
    {
      icon: PawPrint,
      name: "Poche ventrale renforcée",
      desc: "Ouverture circulaire élastiquée pour le confort et la sécurité. Soutient le chat sans le comprimer.",
    },
    {
      icon: Sparkles,
      name: "Cordon coulissant ajustable",
      desc: "Sous la poche, ajustez la taille d'ouverture selon la morphologie de votre chat.",
    },
    {
      icon: Shield,
      name: "Poches latérales zippées",
      desc: "Pour clés, téléphone, friandises. Tout ce dont vous avez besoin, à portée de main.",
    },
    {
      icon: Palette,
      name: "Capuchon réglable premium",
      desc: "Cordons avec embouts métalliques. Ajustez à votre tour de tête. Détail qualité.",
    },
    {
      icon: Gift,
      name: "Patch cuir signature",
      desc: "Étiquette en simili-cuir cousue bas-gauche. Le détail qui fait la différence.",
    },
  ];
  return (
    <section id="produit" className="py-16 md:py-24 bg-cream-50">
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
                src="/images/trico-showcase.png"
                alt="GatoPouch Sweat Porte-Chat — homme caressant son chat à travers la poche"
                className="w-full h-auto object-cover aspect-[1344/1598]"
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
                7
              </span>
              <span className="text-[10px] md:text-xs font-medium -mt-1">
                coloris
              </span>
            </motion.div>
          </motion.div>

          {/* Right: features list */}
          <div>
            <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 hover:bg-peach-300/50 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
              Le sweat en détail
            </Badge>
            <h2 className="font-display font-extrabold text-cinnamon-900 text-3xl md:text-5xl leading-tight mb-4">
              Le sweat pensé pour{" "}
              <span className="text-peach-500">votre chat</span>
            </h2>
            <p className="text-cinnamon-700 text-lg leading-relaxed mb-7">
              Chaque détail du GatoPouch a été sélectionné pour le confort de votre
              chat et le vôtre. De la polaire épaisse à l&apos;ouverture
              élastiquée sécurisante, tout est pensé pour des heures de câlins
              sans stress.
            </p>

            <div className="space-y-3.5 mb-8">
              {features.map((item, i) => (
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

            {/* Colors + sizes */}
            <div className="grid grid-cols-2 gap-4 mb-7">
              <div className="p-4 rounded-2xl bg-cream-100 border border-peach-400/20">
                <div className="flex items-center gap-2 text-cinnamon-700 text-xs mb-2 font-semibold uppercase tracking-wider">
                  <Palette className="w-3.5 h-3.5" />
                  Coloris
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-8 h-8 rounded-full bg-[#4A5D23] ring-2 ring-cream-50 shadow-md" title="Vert militaire" />
                  <div className="w-8 h-8 rounded-full bg-[#E8B4C4] ring-2 ring-cream-50 shadow-md" title="Rose poudré" />
                  <div className="w-8 h-8 rounded-full bg-[#C8102E] ring-2 ring-cream-50 shadow-md" title="Rouge vif" />
                  <div className="w-8 h-8 rounded-full bg-[#A8D5BA] ring-2 ring-cream-50 shadow-md" title="Vert menthe" />
                  <div className="w-8 h-8 rounded-full bg-[#1B2838] ring-2 ring-cream-50 shadow-md" title="Bleu marine" />
                  <div className="w-8 h-8 rounded-full bg-[#E8D9C0] ring-2 ring-cream-50 shadow-md" title="Beige crème" />
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] ring-2 ring-cream-50 shadow-md" title="Noir" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-cream-100 border border-peach-400/20">
                <div className="flex items-center gap-2 text-cinnamon-700 text-xs mb-2 font-semibold uppercase tracking-wider">
                  <Ruler className="w-3.5 h-3.5" />
                  6 tailles
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["S", "M", "L", "XL", "2XL", "3XL"].map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md bg-cream-50 text-xs font-medium text-cinnamon-800 border border-cinnamon-900/10"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-4 mb-7 p-5 rounded-2xl bg-cream-100 border border-peach-400/20">
              <div>
                <span className="text-cinnamon-700 text-sm">Prix unitaire</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-extrabold text-3xl text-cinnamon-900">
                    54,99€
                  </span>
                </div>
              </div>
              <div className="h-12 w-px bg-cinnamon-900/15" />
              <div>
                <span className="text-cinnamon-700 text-sm">Pack de 2 (recommandé)</span>
                <div className="font-display font-bold text-xl text-peach-500">
                  94,98€
                </div>
                <span className="text-xs text-cinnamon-700/70">économie 15€ + livraison offerte</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onOrderClick}
                size="lg"
                className="bg-peach-gradient text-cream-50 hover:opacity-90 shadow-xl hover:shadow-2xl hover:shadow-peach-500/30 transition-all rounded-full px-8 py-6 font-display font-bold text-base flex-1"
              >
                <Shirt className="w-5 h-5 mr-2" />
                Je commande — 54,99€
              </Button>
              <a
                href="#packs"
                className="inline-flex items-center justify-center gap-2 px-6 py-6 rounded-full border-2 border-peach-400/40 text-cinnamon-800 hover:bg-peach-300/20 transition-all font-display font-semibold"
              >
                <Gift className="w-5 h-5" />
                Voir les 3 packs
              </a>
            </div>
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
      text: "En télétravail, Mochi me réclamait sans cesse ou marchait sur le clavier. Avec le GatoPouch, il est blotti contre moi pendant 4h d'affilée, je peux travailler sereinement. C'est devenu son endroit préféré de la maison. Le meilleur achat pour ma vie pro !",
    },
    {
      name: "Thomas L.",
      location: "Bordeaux",
      cat: "Pixel, chat noir, 5 ans",
      image: "/images/testimonial-2.png",
      rating: 5,
      text: "Pixel est un chat très câlin mais envahissant. Le GatoPouch a changé notre relation : je le porte partout, il ronronne, et j'ai mes deux bras pour mes activités. La polaire est ultra douce, on sent la qualité. Et lavé 3 fois, il est nickel.",
    },
    {
      name: "Madeleine R.",
      location: "Nantes",
      cat: "Gribouille, Calico, 9 ans",
      image: "/images/testimonial-3.png",
      rating: 5,
      text: "À 9 ans, Gribouille est devenue très collante. Le GatoPouch me permet de la garder contre moi quand je cuisine, lis, travaille. Elle est heureuse et moi aussi. Mon petit-fils me l'a offert pour mon anniversaire, c'est le cadeau le plus touchant reçu.",
    },
  ];
  return (
    <section id="avis" className="py-16 md:py-24 bg-cream-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 hover:bg-peach-300/50 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
            Ils ont adopté le GatoPouch
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
              4,9/5
            </span>
            <span className="text-cinnamon-700">— 1 432 avis vérifiés</span>
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
              <div className="relative h-[533px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.image}
                  alt={`${t.name} et son chat ${t.cat.split(",")[0]}`}
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
              Pack de 3 GatoPouch — économisez 34,98€
            </h2>
            <p className="text-cream-50/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Le meilleur deal : 3 sweats à 129,99€ au lieu de 164,97€. Idéal
              pour équiper toute la famille ou offrir en cadeau. Livraison
              offerte et économies garanties.
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
                <span className="font-medium">Livraison offerte</span>
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
                <Gift className="w-5 h-5 text-peach-500" />
                Je commande le Pack de 3 — 129,99€
              </span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-cream-50/70 text-xs mt-5 max-w-md mx-auto">
              Plus que 47 packs disponibles à ce prix. Après, retour au tarif
              normal 164,97€.
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
      q: "Mon chat n'aime pas être porté, s'y habituera-t-il ?",
      a: "La grande majorité des chats s'habitue en 2 à 5 séances courtes (5 min au début). L'astuce : placez une friandise dans la poche, laissez-le explorer à son rythme. L'élastique de l'ouverture ne le comprime pas, il se sent en sécurité. 92% de nos clients rapportent que leur chat réclame le GatoPouch après une semaine !",
    },
    {
      q: "Quelles tailles sont disponibles ?",
      a: "Le GatoPouch existe en 5 tailles : S, M, L, XL, XXL. Pour choisir, prenez votre tour de poitrine habituel. Si vous êtes entre deux tailles, prenez la plus grande pour plus de confort et de liberté de mouvement pour votre chat. Un guide des tailles détaillé est envoyé après commande.",
    },
    {
      q: "Convient à tous les chats, quel poids ?",
      a: "Le GatoPouch convient aux chats de 2,5 kg à 7 kg. La poche renforcée et l'élastique ont été testés pour soutenir jusqu'à 8 kg sans déformation. Pour les chats au-delà de 7 kg (Maine Coon), nous recommandons la taille XL ou XXL et des sessions plus courtes (le poids peut être inconfortable).",
    },
    {
      q: "Lavable en machine ?",
      a: "Oui ! Le GatoPouch se lave en machine à 30° cycle doux, essorage 600 tr/min maximum. Pas de sèche-linge (le sherpa peut boulocher). Faites sécher à plat à l'air libre. La polaire garde sa douceur, sa couleur et sa forme lavage après lavage. Recommandé une fois par semaine.",
    },
    {
      q: "Est-ce que ça ne risque pas de blesser mon chat ?",
      a: "Absolument pas, à condition de respecter le poids maximum (7-8 kg) et d'écouter votre chat. L'ouverture élastiquée ne serre jamais, le cordon coulissant ne sert qu'à ajuster la taille d'entrée. Ne forcez jamais un chat réticent. Nous conseillons de toujours superviser et de faire des sessions de 30 min maximum au début.",
    },
    {
      q: "Quels sont les délais de livraison ?",
      a: "Votre GatoPouch est expédié sous 24h ouvrées depuis notre entrepôt. Comptez ensuite 6 à 12 jours pour la livraison (selon votre pays et la période). Un numéro de suivi vous est envoyé par e-mail dès l'expédition. La livraison est offerte dès 69€ d'achat — atteint automatiquement dès le Pack de 2 à 94,98€ (donc les packs sont toujours livrés gratuitement !).",
    },
    {
      q: "Quelle matière ? Est-ce bien chaud ?",
      a: "Le GatoPouch est en polaire sherpa épaisse 300g/m², ultra-douce et bien chaude. Idéale pour l'automne, l'hiver, le printemps frais et les bureaux climatisés. Le tissu est respirant : ni vous ni votre chat ne transpirez. Le sherpa est durable, résistant aux accrocs des griffes (avec une tape moderate, votre chat comprend vite).",
    },
    {
      q: "Puis-je payer en plusieurs fois ?",
      a: "Oui ! Le paiement en 3x sans frais est disponible dès 60€ d'achat. Le Pack de 2 à 94,98€ peut être payé en 3x 31,66€, et le Pack de 3 à 129,99€ en 3x 43,33€. Idéal pour offrir en cadeau sans avancer tout le budget. Nous acceptons CB, PayPal, Apple Pay et Google Pay via une connexion sécurisée SSL. Vos données bancaires ne sont jamais stockées.",
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Oups, email invalide",
        description: "Veuillez saisir une adresse e-mail valide.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Erreur d'envoi");
      }
      toast({
        title: "Merci !",
        description: data.message,
      });
      setEmail("");
    } catch (err) {
      toast({
        title: "Erreur d'envoi",
        description:
          err instanceof Error
            ? err.message
            : "Veuillez réessayer ou nous écrire à contact@gatopouch.com",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                Rejoignez la famille GatoPouch
              </h2>
              <p className="text-cream-50/80 text-base md:text-lg leading-relaxed">
                Conseils d&apos;adaption du chat, offres exclusives,
                nouveautés et histoires de câlins partagés. Recevez{" "}
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
                disabled={loading}
                className="bg-peach-gradient text-cream-50 hover:opacity-90 shadow-xl rounded-full h-14 font-display font-bold text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5 mr-2" />
                    Recevoir mon code -10%
                  </>
                )}
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
                GatoPouch
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Le sweat porte-chat qui rapproche les chats et leurs humains, un
              câlin à la fois. Conçu avec amour par des amoureux de chats,
              pour des amoureux de chats.
            </p>
            <div className="mt-4 text-xs text-cream-50/60 space-y-1">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-peach-400 shrink-0" />
                <span>Calle Almería 83, 29018 Málaga, España</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-peach-400 shrink-0" />
                <a
                  href="https://www.gatopouch.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-peach-300 transition-colors"
                >
                  www.gatopouch.com
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-cream-50 mb-4 text-sm uppercase tracking-wider">
              Produit
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#produit" className="hover:text-peach-300 transition-colors">
                  Le GatoPouch
                </a>
              </li>
              <li>
                <a href="#benefices" className="hover:text-peach-300 transition-colors">
                  Bénéfices
                </a>
              </li>
              <li>
                <a href="#packs" className="hover:text-peach-300 transition-colors">
                  Packs & tarifs
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
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:contact@gatopouch.com"
                  className="hover:text-peach-300 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-peach-400" />
                  contact@gatopouch.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@gatopouch.com"
                  className="hover:text-peach-300 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-peach-400" />
                  support@gatopouch.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+34670040447"
                  className="hover:text-peach-300 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-peach-400" />
                  +34 670 04 04 47
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/34670040447"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-peach-300 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-peach-400" />
                  WhatsApp
                </a>
              </li>
              <li className="pt-2">
                <ContactModal>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-peach-gradient text-cream-50 hover:opacity-90 transition-all text-xs font-display font-semibold">
                    <Mail className="w-3.5 h-3.5" />
                    Formulaire de contact
                  </button>
                </ContactModal>
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
            <div className="flex gap-3 flex-wrap mb-6">
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
          <p>© 2025 GatoPouch. Tous droits réservés. Basé à Málaga, España.</p>
          <div className="flex flex-wrap gap-4">
            <PrivacyPolicyModal />
            <TermsModal />
            <ReturnsModal />
            <ShippingModal />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   Packs Section — Choose your pack
   ========================================================================= */
function PacksSection({ onOrderClick }: { onOrderClick: () => void }) {
  const packs = [
    {
      name: "1 GatoPouch",
      subtitle: "Découverte",
      quantity: "1 sweat",
      price: "54,99€",
      oldPrice: null,
      saving: null,
      perUnit: "54,99€ / sweat",
      features: [
        "Choix de la couleur parmi 7 coloris",
        "Choix de la taille (S à 3XL)",
        "Livraison en 6 à 12 jours",
        "Satisfait ou remboursé 30j",
      ],
      highlighted: false,
      badge: null,
    },
    {
      name: "Pack de 2 GatoPouch",
      subtitle: "Recommandé",
      quantity: "2 sweats",
      price: "94,98€",
      oldPrice: "109,98€",
      saving: "Économisez 15€",
      perUnit: "47,49€ / sweat",
      features: [
        "Couleur et taille personnalisables pour chaque sweat",
        "Livraison OFFERTE",
        "Le plus populaire — idéal pour cadeau",
        "Paiement 3x sans frais (3× 31,66€)",
      ],
      highlighted: true,
      badge: "Recommandé",
    },
    {
      name: "Pack de 3 GatoPouch",
      subtitle: "Meilleure offre",
      quantity: "3 sweats",
      price: "129,99€",
      oldPrice: "164,97€",
      saving: "Économisez 34,98€",
      perUnit: "43,33€ / sweat",
      features: [
        "Couleur et taille personnalisables pour chaque sweat",
        "Livraison OFFERTE",
        "Économie maximale — 21% de réduction",
        "Paiement 3x sans frais (3× 43,33€)",
      ],
      highlighted: false,
      badge: "Meilleure offre",
    },
  ];

  return (
    <section id="packs" className="py-16 md:py-24 bg-cream-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 hover:bg-peach-300/50 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
            Choisis ton pack
          </Badge>
          <h2 className="font-display font-extrabold text-cinnamon-900 text-3xl md:text-5xl leading-tight mb-4">
            Plus vous prenez de GatoPouch,{" "}
            <span className="text-peach-500">plus vous économisez</span>
          </h2>
          <p className="text-cinnamon-700 text-lg leading-relaxed">
            Offrez un GatoPouch à votre moitié, votre sœur ou votre meilleure amie
            amoureuse de chats. Ou gardez-en plusieurs pour varier les
            couleurs selon les saisons et vos humeurs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-7 items-stretch">
          {packs.map((pack, i) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col rounded-3xl p-6 md:p-8 transition-all ${
                pack.highlighted
                  ? "bg-cinnamon-900 text-cream-50 shadow-2xl shadow-cinnamon-900/30 md:-translate-y-4 ring-4 ring-peach-400"
                  : "bg-cream-50 text-cinnamon-900 shadow-md hover:shadow-xl border border-cinnamon-900/5"
              }`}
            >
              {/* Badge */}
              {pack.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-peach-gradient text-cream-50 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                  {pack.badge}
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <div
                  className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                    pack.highlighted ? "text-peach-300" : "text-cinnamon-700"
                  }`}
                >
                  {pack.subtitle}
                </div>
                <h3 className="font-display font-extrabold text-2xl md:text-3xl mb-1">
                  {pack.name}
                </h3>
                <p
                  className={`text-sm ${
                    pack.highlighted
                      ? "text-cream-50/70"
                      : "text-cinnamon-700/70"
                  }`}
                >
                  {pack.quantity}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="font-display font-extrabold text-4xl md:text-5xl">
                    {pack.price}
                  </span>
                  {pack.oldPrice && (
                    <span
                      className={`text-lg line-through ${
                        pack.highlighted
                          ? "text-cream-50/50"
                          : "text-cinnamon-700/50"
                      }`}
                    >
                      {pack.oldPrice}
                    </span>
                  )}
                </div>
                {pack.saving && (
                  <div
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                      pack.highlighted
                        ? "bg-peach-400/30 text-peach-300"
                        : "bg-peach-300/40 text-cinnamon-800"
                    }`}
                  >
                    {pack.saving}
                  </div>
                )}
                <p
                  className={`text-xs mt-2 ${
                    pack.highlighted
                      ? "text-cream-50/60"
                      : "text-cinnamon-700/60"
                  }`}
                >
                  {pack.perUnit}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {pack.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        pack.highlighted ? "text-peach-300" : "text-peach-500"
                      }`}
                    />
                    <span
                      className={
                        pack.highlighted
                          ? "text-cream-50/90"
                          : "text-cinnamon-800"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                onClick={onOrderClick}
                size="lg"
                className={`w-full rounded-full py-5 font-display font-bold text-sm ${
                  pack.highlighted
                    ? "bg-peach-gradient text-cream-50 hover:opacity-90 shadow-lg"
                    : "bg-cream-100 text-cinnamon-900 hover:bg-cream-200 border border-cinnamon-900/10"
                }`}
              >
                {pack.highlighted ? "Choisir ce pack" : "Sélectionner"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom reassurance */}
        <div className="mt-10 md:mt-12 text-center">
          <p className="text-cinnamon-700 text-sm mb-4">
            Tous les packs sont personnalisables : couleur et taille
            indépendantes pour chaque GatoPouch.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 bg-cream-50 rounded-full px-4 py-2 text-xs text-cinnamon-700 border border-cinnamon-900/5">
              <Shield className="w-3.5 h-3.5 text-peach-500" />
              Paiement 100% sécurisé
            </div>
            <div className="flex items-center gap-2 bg-cream-50 rounded-full px-4 py-2 text-xs text-cinnamon-700 border border-cinnamon-900/5">
              <Truck className="w-3.5 h-3.5 text-peach-500" />
              Expédié sous 24h · livré en 6-12j
            </div>
            <div className="flex items-center gap-2 bg-cream-50 rounded-full px-4 py-2 text-xs text-cinnamon-700 border border-cinnamon-900/5">
              <RefreshCw className="w-3.5 h-3.5 text-peach-500" />
              Remboursé sous 30j
            </div>
          </div>
        </div>
      </div>
    </section>
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
        "Vous allez être redirigé vers la commande du GatoPouch Sweat Porte-Chat.",
    });
    setTimeout(() => {
      window.open("https://gatopouch.com/products/sudadera-con-bolsillo-para-gato-sherpa-ultra-suave", "_blank");
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
      <PacksSection onOrderClick={handleOrder} />
      <Testimonials />
      <FlashOffer onOrderClick={handleOrder} />
      <FAQ />
      <Newsletter />
      <Footer />
    </main>
  );
}
