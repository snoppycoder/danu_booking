"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Zap, Globe, Shield } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-secondary/10">
      {/* Hero Section */}
      <section className="relative px-4 py-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
            <span className="text-pretty">Transforming Ethiopia's</span>
            <br />
            <span className="text-primary">Intercity Travel</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            DANU Booking is modernizing the way people travel across Ethiopia
            through smart, accessible digital solutions.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Learn More
            </Button>
          </div> */}
        </div>

        {/* Hero Image Placeholder */}
        {/* <div className="rounded-2xl overflow-hidden h-96 flex items-center justify-center border border-border">
          <div className="text-center">
            <Globe className="w-24 h-24 text-primary mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Ethiopia&apos;s Travel Network
            </p>
          </div>
          <img
            src="/logo.png"
            alt="DANU Logo"
            className="w-48 h-48 opacity-70"
          />
        </div> */}
      </section>

      {/* Vision & Mission Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-card/40 border-t border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To become Ethiopia&apos;s most trusted and leading digital
                platform for intercity bus booking — delivering efficient,
                accessible, and transparent transportation services nationwide.
              </p>
              <div className="pt-4 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-muted-foreground">
                  Trusted by passengers and operators
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-muted-foreground">
                  Nationwide coverage and accessibility
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To simplify intercity travel by providing a reliable digital
                booking system that benefits passengers, bus operators, and
                partners through efficiency, accuracy, and convenience.
              </p>
              <div className="pt-4 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Simple, reliable digital solutions
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Benefits for all stakeholders
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why We Exist
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We saw real problems in Ethiopia&apos;s intercity transportation.
              We&apos;re here to solve them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Passenger Challenges */}
            <Card className="p-8 bg-gradient-to-br from-card to-secondary/5 border-border hover:border-primary/50 transition-colors">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Passenger Challenges
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Long ticket office queues
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Limited booking hours
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Uncertainty about seat availability
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Manual and inconvenient processes
                  </span>
                </li>
              </ul>
            </Card>

            {/* Operator Challenges */}
            <Card className="p-8 bg-gradient-to-br from-card to-secondary/5 border-border hover:border-primary/50 transition-colors">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Operator Challenges
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Unsold seats and lost revenue
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Manual paperwork and administration
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Limited market visibility
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Lack of reliable sales data
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions for passengers and bus operators across
              Ethiopia
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Passengers */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                For Passengers
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Search routes across Ethiopia
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Compare bus operators and services
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Select seats interactively
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Pay securely using mobile money
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Receive instant digital ticket confirmation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Get SMS reminders and updates
                  </span>
                </li>
              </ul>
            </div>

            {/* For Operators */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Globe className="w-6 h-6 text-primary" />
                For Bus Operators
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Increased seat occupancy
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Structured and reliable sales channel
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Real-time booking management
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Reduced administrative workload
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Access to wider national customer base
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Better visibility and sales data
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Ethiopia Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">
            Built for Ethiopia
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-card border-border">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                Inclusive Access
              </h3>
              <p className="text-muted-foreground mb-6">
                DANU is designed for Ethiopia&apos;s realities. Whether you use
                a smartphone, basic phone, or prefer assisted booking, we ensure
                inclusivity through multiple channels.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Web and mobile applications
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Multilingual call center support
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    SMS notifications
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Secure mobile money integration
                  </span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-card border-border">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                Compliance & Impact
              </h3>
              <p className="text-muted-foreground mb-6">
                We align with Ethiopia&apos;s national transport and digital
                transformation goals, ensuring responsible and compliant service
                delivery.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Legally registered Ethiopian company
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Full legal compliance
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Digital intermediary model
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Supporting national digital goals
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-card/40 border-t border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-8">
            Our Commitment
          </h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            We operate with integrity, transparency, and a customer-centered
            approach. Every decision we make is guided by our commitment to
            reliability, accuracy, and responsible innovation.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              "Integrity & Transparency",
              "Reliability & Accuracy",
              "Customer-Centered Service",
              "Efficiency & Innovation",
              "Legal Compliance",
            ].map((value, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
              >
                <p className="font-semibold text-foreground text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Join the DANU Network
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            DANU is more than a platform — it&apos;s a growing national network
            connecting passengers, bus operators, and partners across Ethiopia.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 px-8"
            >
              <Link href="/login" className="flex items-center gap-2">
                For Passengers <ArrowRight className="mt-1 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant={"outline"}
              size="lg"
              className="gap-2 bg-accent hover:bg-accent/90 px-8"
            >
              <Link href="/login" className="flex items-center gap-2">
                For Operators <ArrowRight className="mt-1 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 px-8"
            >
              <Link
                href="/passenger/contact"
                className="flex items-center gap-2"
              >
                Get In Touch <ArrowRight className="mt-1 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Let&apos;s Move Forward Together
          </h3>
          <p className="text-muted-foreground mb-8">
            Transportation powers economic growth, education, tourism, and
            family connection. By modernizing ticketing systems, DANU is
            building a more connected Ethiopia.
          </p>
        </div>
      </section>
    </main>
  );
}
