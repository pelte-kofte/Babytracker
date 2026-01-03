import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import ManageBabies from "@/pages/ManageBabies";
import BabyTracker from "@/pages/BabyTracker";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF9F6]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not logged in, only show public routes
  if (!user) {
    return (
      <Switch>
        <Route path="/" component={LandingPage} />
        {/* Redirect any other route to login/landing */}
        <Route component={() => {
            window.location.href = "/api/login";
            return null;
        }} />
      </Switch>
    );
  }

  // Authenticated Routes
  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">
      <Navigation />
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 min-w-0 overflow-auto">
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/babies" component={ManageBabies} />
          <Route path="/babies/:id/:tab?" component={BabyTracker} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
