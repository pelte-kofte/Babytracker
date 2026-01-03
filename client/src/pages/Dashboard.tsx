import { useAuth } from "@/hooks/use-auth";
import { useBabies } from "@/hooks/use-babies";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Baby } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: babies, isLoading } = useBabies();

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your little ones today.
          </p>
        </div>
        <Link href="/babies">
          <Button className="rounded-full bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add Baby
          </Button>
        </Link>
      </div>

      {!babies || babies.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {babies.map((baby) => (
            <BabyCard key={baby.id} baby={baby} />
          ))}
        </div>
      )}
    </div>
  );
}

function BabyCard({ baby }: { baby: any }) {
  return (
    <Link href={`/babies/${baby.id}/feeding`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="group bg-white rounded-3xl p-6 shadow-lg shadow-black/5 border border-sage-light/50 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Baby className="w-24 h-24 text-primary" />
        </div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-3xl mb-4 border border-white shadow-sm">
            {baby.gender === 'girl' ? '👧' : baby.gender === 'boy' ? '👦' : '👶'}
          </div>
          
          <h3 className="font-display font-bold text-2xl text-foreground mb-1 group-hover:text-primary transition-colors">
            {baby.name}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-6">
            Born {new Date(baby.birthDate).toLocaleDateString()}
          </p>

          <div className="flex items-center text-sm font-medium text-primary">
            View Dashboard <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-sage-light flex flex-col items-center max-w-md mx-auto mt-12">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-4xl">
        👶
      </div>
      <h3 className="font-display font-bold text-2xl mb-2">No babies yet</h3>
      <p className="text-muted-foreground mb-8">
        Add your first baby profile to start tracking feedings, sleep, and memories.
      </p>
      <Link href="/babies">
        <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Your Baby
        </Button>
      </Link>
    </div>
  );
}
