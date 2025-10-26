"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Check,
  Database,
  Lock,
  Search,
  Share2,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";
import { UserProfile } from "@/components/layout/user-profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 },
};

const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav
        animate={{ y: 0 }}
        className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ y: -100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Certificate</span>
          </motion.div>
          <div className="flex items-center gap-4">
            <Link href="#features">
              <Button variant="ghost">Features</Button>
            </Link>
            <Link href="#pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <UserProfile />
            <ModeToggle />
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          animate="animate"
          className="mx-auto max-w-4xl space-y-8"
          initial="initial"
          variants={staggerContainer}
        >
          <motion.h1
            className="font-bold text-5xl tracking-tight md:text-7xl"
            variants={fadeInUp}
          >
            Your Guarantee of <span className="text-primary">Authenticity</span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-xl md:text-2xl"
            variants={fadeInUp}
          >
            Digital certification for your valuable items
          </motion.p>
          <motion.div
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            variants={fadeInUp}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#pricing">
                <Button className="w-full sm:w-auto" size="lg">
                  Get Started
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#features">
                <Button
                  className="w-full sm:w-auto"
                  size="lg"
                  variant="outline"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem vs Solution */}
      <section className="border-y bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid gap-8 md:grid-cols-2"
            initial="initial"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
            whileInView="animate"
          >
            {/* Paper Certificate Limits */}
            <motion.div variants={slideInLeft}>
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <X className="h-5 w-5 text-destructive" />
                    Paper Certificate Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <X className="mt-1 h-4 w-4 text-destructive" />
                    <p className="text-sm">
                      Can easily be damaged, lost, or falsified
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="mt-1 h-4 w-4 text-destructive" />
                    <p className="text-sm">
                      Even original papers don't always guarantee authenticity
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="mt-1 h-4 w-4 text-destructive" />
                    <p className="text-sm">Not instantly accessible</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Digital Certificate Advantages */}
            <motion.div variants={slideInRight}>
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    Digital Certificate Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <p className="text-sm">
                      Universal and tamper-proof: one valid proof worldwide
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <p className="text-sm">
                      Accessible anywhere, anytime: maintain control of your
                      assets
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <p className="text-sm">
                      Durable: not dependent on fragile media or storage
                      location
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24" id="features">
        <motion.div
          className="mb-16 text-center"
          initial="initial"
          variants={fadeInUp}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="animate"
        >
          <h2 className="mb-4 font-bold text-4xl">
            Authenticate, Manage, and Enhance Your Exceptional Items
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete platform designed for trust and transparency
          </p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="initial"
          variants={staggerContainer}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="animate"
        >
          <motion.div variants={scaleIn}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <Lock className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Unfalsifiable Digital Certificate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  An encrypted, timestamped, and online-accessible certificate.
                  Guaranteed traceability. Ideal for sales, insurance, or
                  succession.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <Shield className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Expert & Transparent Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Each item is verified by our qualified specialist partners.
                  Receive a reliable certificate based on concrete, independent
                  analysis.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <Database className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Personal Space, Smart Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Manage all your certified items from a dedicated space. Add
                  documents, photos, history — and track their evolution.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <Share2 className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Quick Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Transfer your certificate via secure link or QR code. Instant
                  proof to share with buyer, expert, or insurer.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <Bell className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Automated Maintenance Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Receive personalized reminders for revisions, inspections, or
                  cleaning. Preserve the value of your assets effortlessly.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <Search className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Global Search Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Access millions of registered and certified items. Verify
                  history, avoid counterfeits, buy with complete peace of mind.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="border-y bg-muted/50 py-24" id="pricing">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center"
            initial="initial"
            variants={fadeInUp}
            viewport={{ once: true, margin: "-100px" }}
            whileInView="animate"
          >
            <h2 className="mb-4 font-bold text-4xl">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground">
              From free basic registration to full-service premium experience
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            initial="initial"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
            whileInView="animate"
          >
            {/* Initium - Free */}
            <motion.div variants={fadeInUp}>
              <Card className="relative h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Initium</CardTitle>
                  <CardDescription>
                    <span className="font-bold text-3xl">Free</span>
                    <span className="text-sm"> (then 5€)</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Free registration (freemium), proof of traceability, entry
                    point into Certificate
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Online registration</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Unique Certificate ID generation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>QR code</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Minimal client dashboard</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>"Not verified" status display</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Creation history</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Visus - 50€ */}
            <motion.div variants={fadeInUp}>
              <Card className="relative h-full border-primary transition-shadow hover:shadow-lg">
                <div className="-top-3 -translate-x-1/2 absolute left-1/2 rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground text-xs">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Visus</CardTitle>
                  <CardDescription>
                    <span className="font-bold text-3xl">50€</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Light certification Activation verified remotely,
                    certificate tied to owner identity
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Online registration</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Proof of ownership</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>At-home verification</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Identity verification</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Link identity between client and item</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Certificate update</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Light history</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Choose Visus</Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Custodia - 125€ */}
            <motion.div variants={fadeInUp}>
              <Card className="relative h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Custodia</CardTitle>
                  <CardDescription>
                    <span className="font-bold text-3xl">125€</span>
                    <span className="text-sm"> (then 150€)</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Physical quality control, expert verification, professional
                    certification
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Physical registration</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Physical verification</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Identity verification</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Privacy mode</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Quality control</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>HD photos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Digital certificate</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Revision reminder</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Value estimation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Price tracking</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Complete history</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Choose Custodia
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Imperium - 250€ */}
            <motion.div variants={fadeInUp}>
              <Card className="relative h-full border-primary/50 bg-primary/5 transition-shadow hover:shadow-lg">
                <div className="-top-3 -translate-x-1/2 absolute left-1/2 rounded-full bg-gradient-to-r from-primary to-primary/70 px-3 py-1 font-semibold text-primary-foreground text-xs">
                  Premium
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Imperium</CardTitle>
                  <CardDescription>
                    <span className="font-bold text-3xl">250€</span>
                    <span className="text-sm"> (then 300€)</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Complete full-service experience, logistics included,
                    maximum security, heritage value
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Complete transport</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Physical registration</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Physical verification</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Identity verification</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Privacy mode</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Quality control</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Revision reminder</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>UHD photos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>In-depth control</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Digital certificate</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>NFT certificate</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>NFC physical card (metal)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Complete history</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Stolen passive mode</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Premium prime mode</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Choose Imperium</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          className="mb-16 text-center"
          initial="initial"
          variants={fadeInUp}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="animate"
        >
          <h2 className="mb-4 font-bold text-4xl">They Already Trust Us</h2>
        </motion.div>
        <motion.div
          className="grid gap-8 md:grid-cols-4"
          initial="initial"
          variants={staggerContainer}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="animate"
        >
          <motion.div variants={scaleIn}>
            <Card className="h-full text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="font-bold text-4xl text-primary">
                  100+
                </CardTitle>
                <CardDescription>Pre-registered Members</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
          {/* Partner Experts removed (partner UI reset) */}
          <motion.div variants={scaleIn}>
            <Card className="h-full text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="font-bold text-4xl text-primary">
                  30+
                </CardTitle>
                <CardDescription>Referenced Brands</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
          <motion.div variants={scaleIn}>
            <Card className="h-full text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="font-bold text-4xl text-primary">
                  300+
                </CardTitle>
                <CardDescription>Cataloged References</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="border-y bg-primary py-24 text-primary-foreground">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial="initial"
          variants={staggerContainer}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="animate"
        >
          <motion.h2 className="mb-4 font-bold text-4xl" variants={fadeInUp}>
            One Platform. All Your Certainties.
          </motion.h2>
          <motion.p className="mb-8 text-xl opacity-90" variants={fadeInUp}>
            Start certifying your valuable items today
          </motion.p>
          <motion.div variants={fadeInUp}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#pricing">
                <Button
                  className="bg-background text-foreground hover:bg-background/90"
                  size="lg"
                  variant="secondary"
                >
                  Get Started Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <motion.div
          className="container mx-auto px-4"
          initial="initial"
          variants={fadeIn}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="animate"
        >
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Certificate</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Digital certification for your valuable items.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Services</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="#pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="#features">Features</Link>
                </li>
                <li>
                  <Link href="/search">Search</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-muted-foreground text-sm">
            <p>© 2025 Certificate. All rights reserved.</p>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
