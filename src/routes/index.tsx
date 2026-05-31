import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/automind/Navbar";
import { Hero } from "@/components/automind/Hero";
import { Sectors } from "@/components/automind/Sectors";
import { HowItWorks } from "@/components/automind/HowItWorks";
import { WhyUs } from "@/components/automind/WhyUs";
import { ProofBanner } from "@/components/automind/ProofBanner";
import { Testimonials } from "@/components/automind/Testimonials";
import { Contact } from "@/components/automind/Contact";
import { Footer } from "@/components/automind/Footer";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoMind — Automazioni AI per PMI italiane" },
      { name: "description", content: "Automatizziamo i processi ripetitivi della tua azienda con sistemi AI su misura. Risposta email, prenotazioni, follow-up clienti. Prova gratuita 7 giorni." },
      { property: "og:title", content: "AutoMind — Automazioni AI per PMI italiane" },
      { property: "og:description", content: "Sistemi AI su misura per automatizzare il lavoro ripetitivo della tua azienda. Prova gratuita di 7 giorni, nessun impegno." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Sectors />
        <HowItWorks />
        <WhyUs />
        <ProofBanner />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
