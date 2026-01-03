import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Baby, 
  LayoutDashboard, 
  Utensils, 
  Moon, 
  Scale, 
  Image as ImageIcon, 
  LogOut,
  Menu,
  X,
  Droplets
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || location === "/") return null;

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/babies", label: "My Babies", icon: Baby },
  ];

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-sage-light flex items-center justify-between px-4 z-50">
        <Link href="/dashboard" className="text-xl font-display font-bold text-primary">
          Bebek Takip
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] max-w-[300px] bg-[#FAF9F6]">
            <div className="flex flex-col h-full py-6">
              <div className="mb-8 px-4">
                <h2 className="text-2xl font-display font-bold text-primary">Bebek Takip</h2>
                <p className="text-sm text-muted-foreground mt-1">Growing together.</p>
              </div>
              
              <nav className="flex-1 space-y-2 px-2">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                    <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive(link.href) 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                      }
                    `}>
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </div>
                  </Link>
                ))}
              </nav>

              <div className="px-4 py-4 border-t border-sage-light">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                    {user.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt={user.name || "User"} className="h-full w-full object-cover" />
                    ) : (
                      (user.name?.[0] || "U").toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="hidden lg:flex fixed top-0 left-0 bottom-0 w-72 bg-[#FAF9F6] border-r border-sage-light flex-col z-40"
      >
        <div className="h-24 flex items-center px-8 border-b border-sage-light/50">
          <Link href="/dashboard" className="text-2xl font-display font-bold text-primary flex items-center gap-2">
            <span className="bg-primary/10 p-2 rounded-xl text-primary">🌱</span>
            Bebek Takip
          </Link>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className={`
                flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer
                ${isActive(link.href) 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-1" 
                  : "text-muted-foreground hover:bg-white hover:shadow-sm hover:text-foreground hover:translate-x-1"
                }
              `}>
                <link.icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-sage-light/50 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
             <div className="h-10 w-10 rounded-full bg-white shadow-sm border border-sage-light flex items-center justify-center text-primary font-bold overflow-hidden">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.name || "User"} className="h-full w-full object-cover" />
                ) : (
                  (user.name?.[0] || "U").toUpperCase()
                )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </motion.div>
    </>
  );
}
