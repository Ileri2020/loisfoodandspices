import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, Truck, Star, ShieldCheck, CreditCard, ShoppingCart, Store, Banknote, Wallet } from 'lucide-react'
import { SearchInput } from './searchcomponent'
import { RiseAndFadeText } from './textctrl'
import { useAppContext } from '@/hooks/useAppContext'
import { motion } from "framer-motion"

interface HeroProps { 
  variant?: 'modern-split' | 'immersive';
}

const BackgroundEffects = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Icon Marquee - Background Layer */}
      <div className="absolute bottom-20 left-0 w-full opacity-[0.04]">
        <IconMarquee />
      </div>

      {/* Flowing Ribbon 1 - Optimized for Mobile (Smaller & Lower Opacity) */}
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, 5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[10%] left-[5%] w-[150px] h-[150px] md:w-[300px] md:h-[300px] bg-accent/10 md:bg-accent/20 rounded-full blur-[60px] md:blur-[80px]"
      />
      {/* Flowing Ribbon 2 - Optimized for Mobile */}
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-[20%] right-[10%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-primary/10 md:bg-primary/20 rounded-full blur-[80px] md:blur-[100px]"
      />

      {/* Horizontal Flowing Wave - Extends Right to Left */}
      <div className="absolute top-1/2 left-0 w-[200%] h-32 opacity-[0.04] md:opacity-[0.06] text-accent flex overflow-hidden">
        <motion.div
          className="flex w-full"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <WaveSVG />
          <WaveSVG />
        </motion.div>
      </div>
    </div>
  )
}

const WaveSVG = () => (
  <svg className="w-1/2 h-full flex-shrink-0" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path
      fill="currentColor"
      fillOpacity="1"
      d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </svg>
)

const IconMarquee = () => {
  const icons = [
    { Icon: ShoppingCart, key: 'cart' },
    { Icon: CreditCard, key: 'card' },
    { Icon: Store, key: 'store' },
    { Icon: Banknote, key: 'banknote' },
    { Icon: Wallet, key: 'wallet' },
  ];

  // Duplicate for seamless loop
  const marqueeIcons = [...icons, ...icons, ...icons, ...icons, ...icons, ...icons];

  return (
    <motion.div
      className="flex items-center space-x-24 whitespace-nowrap"
      animate={{ x: [0, -1000] }}
      transition={{
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear",
        },
      }}
    >
      {marqueeIcons.map((item, index) => (
        <div key={index} className="flex items-center text-foreground">
          <item.Icon className="h-12 w-12 opacity-80" />
        </div>
      ))}
    </motion.div>
  );
};

const Hero = ({ variant = 'modern-split' }: HeroProps) => {
  const { user } = useAppContext();

  // Common Elements
  const DynamicText = () => (
    <RiseAndFadeText
      texts={[
        "From Loyz Foods and Spices",
        "Card & Bank Transfer Payments",
        "Login With Google or Facebook",
        "Naturally Processed Spices",
        "Quality You Can Trust",
        "Trusted by Homes and Businesses",
        "Fast & Reliable Delivery",
        "Carefully Packed for Freshness",
        "Customer Satisfaction Guaranteed",
        "Premium Products, Fair Prices",
        "Authentic Nigerian Spice Blends",
        "Locally Sourced, Globally Delivered",
        "Traditional Taste, Modern Quality",
        "Export-Standard Food Products",
        "Crafted for Every Kitchen",
        "Pure. Natural. Flavorful.",
        "Freshness in Every Pack",
        "Spices That Elevate Your Meals",
        "Taste You Can Trust",
        "Quality Without Compromise",
      ]}
      className="text-2xl mt-2 font-semibold text-muted-foreground overflow-hidden"
    />
  );

  const buttonBounce = {
    y: [0, -4, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const CTAButtons = () => (
    <div className={`flex flex-col gap-3 sm:flex-row z-10`}>
      <Link href="/" className='w-full max-w-52'>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={buttonBounce} // Gentle bounce
        >
          <Button className={`h-12 gap-1.5 px-8 transition-all duration-200 bg-accent hover:bg-accent/90 w-full text-white font-bold text-lg shadow-xl shadow-accent/20`} size="lg">
            Shop Now <ArrowRight className="h-5 w-5 animate-pulse" />
          </Button>
        </motion.div>
      </Link>
      {user?.id === "nil" && (
        <Link href="/account" className="w-full max-w-52">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={buttonBounce} // Gentle bounce
            transition={{ delay: 0.2 }} // slight offset
          >
            <Button
              className="h-12 px-8 w-full border-2 border-accent text-accent hover:bg-accent/10 transition-colors duration-200 font-semibold"
              size="lg"
              variant="outline"
            >
              Login
            </Button>
          </motion.div>
        </Link>
      )}
    </div>
  );

  const TrustBadges = () => (
    <div className={`flex flex-wrap gap-5 text-sm text-muted-foreground mt-4`}>
      <div className="flex items-center gap-1.5">
        <Truck className="h-5 w-5 text-primary" />
        <span>Free shipping over ₦200,000</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-5 w-5 text-primary" />
        <span>24/7 Customer Support</span>
      </div>
    </div>
  );

  // --- VARIANT 1: MODERN SPLIT (Default) ---
  if (variant === 'modern-split') {
    return (
      <div className="relative overflow-hidden py-8 md:py-20 bg-background">

        {/* Background Effects (Includes Marquee in background) */}
        <BackgroundEffects />

        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-8"
            >
              <div className="flex z-50 md:hidden w-full justify-center items-center">
                <SearchInput />
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-accent/10 text-accent hover:bg-accent/20">
                  <Star className="mr-1 h-3 w-3 fill-accent" />
                  #1 Choice for Spices
                </div>
                <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="block text-foreground">Your One-Stop Shop for</span>
                  <span className="block text-accent">Food and Spice Blends</span>
                </h1>
                <DynamicText />
                <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                  Discover premium products at competitive prices, with fast shipping and exceptional customer service.
                </p>
              </div>

              <CTAButtons />

              <TrustBadges />
            </motion.div>

            {/* Right Visuals - Dynamic Composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative hidden lg:block h-[500px] w-full"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Main Image Blob */}
                <div className="relative w-[400px] h-[400px] bg-accent/10 rounded-full animate-blob mix-blend-multiply filter blur-xl opacity-70"></div>
                <div className="relative w-[400px] h-[400px] bg-primary/10 rounded-full animate-blob animation-delay-2000 mix-blend-multiply filter blur-xl opacity-70 -ml-20"></div>

                {/* Main Product Image */}
                <img
                  src="/mission-burrito-fast-food-shawarma-kati-roll-breakfast-6dd86711999109a88eae948201cd24bf.png"
                  alt="Delicious Food"
                  className="relative z-10 w-[450px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Cards (Desktop) */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-10 right-10 bg-card p-3 rounded-xl shadow-xl border border-border/50 z-20 flex items-center gap-3"
                >
                  <div className="bg-green-100 p-2 rounded-full">
                    <ShieldCheck className="text-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">100% Natural</p>
                    <p className="text-[10px] text-muted-foreground">Certified Quality</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-20 left-0 bg-card p-3 rounded-xl shadow-xl border border-border/50 z-20 flex items-center gap-3"
                >
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Truck className="text-orange-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Fast Delivery</p>
                    <p className="text-[10px] text-muted-foreground">Nationwide Shipping</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // --- VARIANT 2: IMMERSIVE (Visual Feast) ---
  if (variant === 'immersive') {
    return (
      <div className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Full Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/small chops 1.jpg" // Fallback: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d"
            alt="Spices Background"
            className="w-full h-full object-cover scale-105"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-md bg-black/30 p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl"
            >
              <div className="flex z-50 md:hidden w-full justify-center items-center mb-6">
                <SearchInput />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-md">
                Your One-Stop Shop for <br />
                <span className="text-accent">Food and Spice Blends</span>
              </h1>

              <div className="text-gray-200 mb-8">
                <DynamicText />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" className='w-full sm:w-auto'>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full sm:w-auto px-8 py-6 text-lg bg-accent hover:bg-accent/90 text-white border-none shadow-lg shadow-accent/20">
                      Shop Collection
                    </Button>
                  </motion.div>
                </Link>
                {user?.id === "nil" && (
                  <Link href="/account" className='w-full sm:w-auto'>
                    <Button variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-black bg-transparent">
                      Login Account
                    </Button>
                  </Link>
                )}
              </div>

              <div className={`flex flex-wrap gap-5 text-sm text-gray-300 mt-8`}>
                <div className="flex items-center gap-1.5">
                  <Truck className="h-5 w-5 text-accent" />
                  <span>Free shipping over ₦200,000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-5 w-5 text-accent" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Hero
