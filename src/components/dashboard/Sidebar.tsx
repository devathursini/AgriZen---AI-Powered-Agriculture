
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Bot, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Droplets, 
  Settings, 
  LogOut,
  Sprout,
  CloudRain,
  ShieldAlert,
  Dna,
  FileText,
  LogIn,
  Loader2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Plane
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React, { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Dna, label: "Crop Diagnosis", href: "/diagnosis" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Plane, label: "Drone Control", href: "/drones" },
  { icon: Bot, label: "AI Assistant", href: "/assistant" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Droplets, label: "Smart Irrigation", href: "/irrigation" },
  { icon: ShoppingCart, label: "Marketplace", href: "/marketplace" },
  { icon: Users, label: "Nexus Community", href: "/community" },
  { icon: CloudRain, label: "Weather Shield", href: "/weather" },
  { icon: ShieldAlert, label: "Disaster Center", href: "/alerts" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-4318523135-2e5de";

  const handleSignIn = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      const errorMsg = error.message?.toLowerCase() || "";
      const isIdentityBlocked = errorMsg.includes('identitytoolkit') || 
                                error.code?.includes('api-blocked') ||
                                errorMsg.includes('blocked') ||
                                errorMsg.includes('requests-to-this-api-identitytoolkit');
      
      if (isIdentityBlocked) {
        setAuthError("identity-blocked");
        toast({
          variant: "destructive",
          title: "Critical Setup Required",
          description: "Authentication is blocked. Please use the links in the sidebar to enable the service.",
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Could not complete sign in.",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border/50">
      <div className="flex h-20 items-center gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary neon-glow text-primary-foreground">
          <Sprout className="h-6 w-6" />
        </div>
        <span className="font-headline text-xl font-bold tracking-tight text-primary">
          AgriZen AI
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {authError === "identity-blocked" && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <div className="space-y-2">
              <AlertTitle className="text-xs font-bold uppercase tracking-wider">PROJECT SETUP REQUIRED</AlertTitle>
              <AlertDescription className="text-[10px] leading-normal">
                <p className="mb-2 font-bold text-destructive">Authentication is currently disabled.</p>
                <div className="space-y-2 p-3 bg-black/40 rounded border border-destructive/20">
                  <p className="text-[9px] text-muted-foreground mb-1">STEP 1:</p>
                  <a 
                    href={`https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=${projectId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-destructive underline font-bold group hover:text-white transition-colors"
                  >
                    Enable Identity API <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                  <p className="text-[9px] text-muted-foreground mb-1 mt-2">STEP 2:</p>
                  <a 
                    href={`https://console.firebase.google.com/project/${projectId}/authentication/providers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-destructive underline font-bold group hover:text-white transition-colors"
                  >
                    Enable Google Sign-In <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-[9px] h-8 mt-3 border-destructive/40 hover:bg-destructive text-white"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="mr-1 h-3 w-3" /> Click Here After Enabling
                </Button>
              </AlertDescription>
            </div>
          </Alert>
        )}

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/10 text-primary neon-border" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border/50 p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-3">
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {user.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate">{user.displayName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button 
              onClick={handleSignIn}
              variant="outline" 
              className="w-full border-primary/20 text-primary hover:bg-primary/10 font-bold"
            >
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
            <p className="text-[9px] text-muted-foreground text-center px-2">
              Sync farm data to the AgriZen cloud.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
