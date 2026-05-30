import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/automind/Navbar";
import { Hero } from "@/components/automind/Hero";
import { Sectors } from "@/components/automind/Sectors";
import { HowItWorks } from "@/components/automind/HowItWorks";
import { WhyUs } from "@/components/automind/WhyUs";
import { Contact } from "@/components/automind/Contact";
import { Footer } from "@/components/automind/Footer";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoMind — Automazioni AI per PMI italiane" },
      { name: "description", content: "AutoMind costruisce sistemi automatici su misura per PMI: rispondono alle email, gestiscono prenotazioni e seguono i clienti. Demo gratuita." },
      { property: "og:title", content: "AutoMind — Automazioni AI per PMI italiane" },
      { property: "og:description", content: "Sistemi AI su misura per automatizzare il lavoro ripetitivo della tua azienda." },
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
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
