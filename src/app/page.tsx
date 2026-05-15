
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, ArrowRight, ShieldCheck, Zap, Bot, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Sprout className="h-12 w-12 animate-bounce text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Initializing AgriZen Neural Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary neon-glow text-primary-foreground">
              <Sprout className="h-6 w-6" />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight text-primary">
              AgriZen AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="bg-primary text-primary-foreground font-bold neon-glow" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="scanline" />
        <div className="container relative mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge variant="outline" className="animate-pulse border-primary/20 bg-primary/5 px-4 py-1 text-primary">
              AgriZen v4.0 is Live
            </Badge>
            <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:max-w-4xl">
              The Future of <span className="text-primary">Autonomous</span> Precision Agriculture
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              AgriZen AI leverages neural computer vision, autonomous drone fleets, and predictive analytics to transform your farm into a hyper-efficient, Zen-stabilized ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 bg-primary text-primary-foreground font-bold text-lg neon-glow" asChild>
                <Link href="/login">
                  Enter the Ecosystem <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 text-lg" asChild>
                <Link href="/marketplace">Explore Nexus</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-[120px] rounded-full" />
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black/20 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Neural Shielding",
                desc: "Real-time atmospheric monitoring and autonomous threat mitigation."
              },
              {
                icon: Bot,
                title: "Zen AI Assistant",
                desc: "Multilingual agronomist assistant available 24/7 in Tamil and English."
              },
              {
                icon: BarChart3,
                title: "Yield Prediction",
                desc: "Advanced neural engines forecasting harvests with 98% confidence."
              }
            ].map((feature, i) => (
              <div key={i} className="glass group p-8 rounded-2xl border-white/5 hover:border-primary/30 transition-all">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold font-headline mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-primary" />
            <span>&copy; 2024 AgriZen AI Ecosystem. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Security Protocol</Link>
            <Link href="#" className="hover:text-primary transition-colors">Neural Documentation</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
