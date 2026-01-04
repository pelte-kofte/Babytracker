import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Moon, Sun, Camera, CheckCircle2, Scale } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-primary/20">
      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-green-100/50 rounded-full blur-3xl opacity-60 blob-shape" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-pink-100/50 rounded-full blur-3xl opacity-60 blob-shape" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <span className="font-display font-bold text-2xl text-foreground">Bebek Takip</span>
        </div>
        <div className="flex gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/api/login">
              <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <main className="relative z-10 px-6 pt-12 pb-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.h1 variants={item} className="font-display text-5xl md:text-7xl font-bold leading-[1.1] text-foreground">
              Parenting made <span className="text-primary">simple</span> & <span className="text-[#E88D67]">memorable</span>.
            </motion.h1>
            
            <motion.p variants={item} className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Track feedings, sleep, and precious moments in one beautiful, calm space. Designed to help you focus on what matters most.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
              <Link href={user ? "/dashboard" : "/api/login"}>
                <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95 shadow-xl">
                  Start Your Journey
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg border-2 hover:bg-white/50">
                Learn More
              </Button>
            </motion.div>

            <motion.div variants={item} className="pt-8 flex items-center gap-8 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span>Secure & Private</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            {/* Hero Image / Composition */}
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-12">
                {/* Feature Card 1 */}
                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-white/50 backdrop-blur-sm transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-500">
                    <Sun className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">Feeding Tracker</h3>
                  <p className="text-sm text-muted-foreground">Log nursing, bottles, and solids with ease. Spot patterns naturally.</p>
                </div>
                
                {/* Feature Card 2 */}
                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-white/50 backdrop-blur-sm transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 text-purple-500">
                    <Moon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">Sleep Patterns</h3>
                  <p className="text-sm text-muted-foreground">Understand your baby's rhythm and improve sleep quality for everyone.</p>
                </div>
              </div>

              <div className="space-y-4">
                 {/* Feature Card 3 */}
                 <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-white/50 backdrop-blur-sm transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-green-600">
                    <Scale className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">Growth Charts</h3>
                  <p className="text-sm text-muted-foreground">Visualize height and weight changes over time with beautiful charts.</p>
                </div>

                {/* Feature Card 4 */}
                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-white/50 backdrop-blur-sm transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="h-12 w-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-4 text-pink-500">
                    <Camera className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">Precious Memories</h3>
                  <p className="text-sm text-muted-foreground">Save milestones and funny moments. They grow up so fast!</p>
                </div>
              </div>
            </div>
            
            {/* Abstract Decorative Elements behind grid */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/30 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
