"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  Zap,
  Globe,
  Shield,
  Heart,
  Lightbulb,
  Scale,
  ShieldCheck,
  Target,
} from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function AboutPage() {
  const { t } = useTranslation();
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const commitments = [
    { title: "Integrity & Transparency", icon: ShieldCheck },
    { title: "Reliability & Accuracy", icon: Target },
    { title: "Customer-Centered Service", icon: Heart },
    { title: "Efficiency & Innovation", icon: Lightbulb },
    { title: "Legal Compliance", icon: Scale },
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-secondary/10">
      {/* Hero Section */}
      <section className="relative px-4 py-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
            <span className="text-pretty">{t("aboutHeroTitle1")}</span>
            <br />
            <span className="text-primary">{t("aboutHeroTitle2")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {t("aboutHeroDesc")}
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
              <h2 className="text-3xl font-bold text-foreground">
                {t("vision")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("visionDesc")}
              </p>
              <div className="pt-4 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-muted-foreground">{t("visionPoint1")}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-muted-foreground">{t("visionPoint2")}</p>
              </div>
            </div>

            {/* Mission */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                {t("mission")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("missionDesc")}
              </p>
              <div className="pt-4 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">{t("missionPoint1")}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">{t("missionPoint2")}</p>
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
              {t("whyWeExist")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("whyWeExistDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Passenger Challenges */}
            <Card className="p-8 bg-gradient-to-br from-card to-secondary/5 border-border hover:border-primary/50 transition-colors">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {t("passengerChallenges")}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t("challenge1")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t("challenge2")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t("challenge3")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t("challenge4")}
                  </span>
                </li>
              </ul>
            </Card>

            {/* Operator Challenges */}
            <Card className="p-8 bg-gradient-to-br from-card to-secondary/5 border-border hover:border-primary/50 transition-colors">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {t("operatorChallenges")}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t("operator1")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t("operator2")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t("operator3")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t("operator4")}
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
          {/* Header Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t("whatWeOffer")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("whatWeOfferDesc")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Passengers */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                {t("forPassengers")}
              </h3>
              <motion.ul
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15, // Delay between each bullet point
                    },
                  },
                }}
              >
                {[t("p1"), t("p2"), t("p3"), t("p4"), t("p5"), t("p6")].map(
                  (text, index) => (
                    <motion.li
                      key={`passenger-bullet-${index}`}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.4 },
                        },
                      }}
                      className="flex items-start gap-3"
                    >
                      <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{text}</span>
                    </motion.li>
                  ),
                )}
              </motion.ul>
            </motion.div>

            {/* For Operators */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Globe className="w-6 h-6 text-primary" />
                {t("forOperators")}
              </h3>
              <motion.ul
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15, // Delay between each bullet point
                    },
                  },
                }}
              >
                {[t("o1"), t("o2"), t("o3"), t("o4"), t("o5"), t("o6")].map(
                  (text, index) => (
                    <motion.li
                      key={`operator-bullet-${index}`}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.4 },
                        },
                      }}
                      className="flex items-start gap-3"
                    >
                      <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{text}</span>
                    </motion.li>
                  ),
                )}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Built for Ethiopia Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
        {/* Optional subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/5 blur-3xl rounded-full -z-10 pointer-events-none" />

        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={cardVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Built for Ethiopia
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1: Inclusive Access */}
            <motion.div variants={cardVariants}>
              <Card className="h-full p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Inclusive Access
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  DANU is designed for Ethiopia&apos;s realities. Whether you
                  use a smartphone, basic phone, or prefer assisted booking, we
                  ensure inclusivity through multiple channels.
                </p>

                <motion.ul variants={listVariants} className="space-y-4">
                  {[
                    "Web and mobile applications",
                    "Multilingual call center support",
                    "SMS notifications",
                    "Secure mobile money integration",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      variants={listItemVariants}
                      className="flex items-center gap-4 group/item"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary/40 group-hover/item:bg-primary group-hover/item:scale-150 transition-all duration-300 flex-shrink-0" />
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </Card>
            </motion.div>

            {/* Card 2: Compliance & Impact */}
            <motion.div variants={cardVariants}>
              <Card className="h-full p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Compliance & Impact
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  We align with Ethiopia&apos;s national transport and digital
                  transformation goals, ensuring responsible and compliant
                  service delivery.
                </p>

                <motion.ul variants={listVariants} className="space-y-4">
                  {[
                    "Legally registered Ethiopian company",
                    "Full legal compliance",
                    "Digital intermediary model",
                    "Supporting national digital goals",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      variants={listItemVariants}
                      className="flex items-center gap-4 group/item"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary/40 group-hover/item:bg-primary group-hover/item:scale-150 transition-all duration-300 flex-shrink-0" />
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Our Commitment Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-card/40 border-t border-b border-border overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
            Our Commitment
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-8" />

          <p className="text-lg text-muted-foreground mb-16 leading-relaxed max-w-3xl mx-auto">
            We operate with integrity, transparency, and a customer-centered
            approach. Every decision we make is guided by our commitment to
            reliability, accuracy, and responsible innovation.
          </p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {commitments.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative p-6 rounded-2xl bg-background border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center gap-4"
                >
                  {/* Subtle hover background glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </div>

                  <p className="font-semibold text-foreground text-sm leading-tight">
                    {item.title}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>
      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            {t("joinDanu")}
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            {t("joinDanuDesc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 px-8"
            >
              <Link href="/login" className="flex items-center gap-2">
                {t("forPassengers")} <ArrowRight className="mt-1 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant={"outline"}
              size="lg"
              className="gap-2 bg-accent hover:bg-accent/90 px-8"
            >
              <Link href="/login" className="flex items-center gap-2">
                {t("forOperators")} <ArrowRight className="mt-1 w-4 h-4" />
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
