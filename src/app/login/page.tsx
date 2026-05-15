
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sprout, LogIn, Loader2, AlertCircle, Key, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth, useUser } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function LoginPage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-4318523135-2e5de";

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    setAuthError(null);
    setSigningIn(true);
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
          description: "Your project's API Key is currently restricting authentication.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message || "Could not complete sign in.",
        });
      }
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 relative overflow-hidden">
      <div className="scanline" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <Card className="glass w-full max-w-md border-white/5 relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary neon-glow text-primary-foreground">
            <Sprout className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <CardTitle className="font-headline text-3xl font-bold tracking-tight text-primary">
              AgriZen AI
            </CardTitle>
            <CardDescription className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
              Autonomous Ecosystem Access
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {authError === "identity-blocked" ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <div className="space-y-2">
                  <AlertTitle className="text-xs font-bold uppercase tracking-wider">PROJECT KEY RESTRICTED</AlertTitle>
                  <AlertDescription className="text-[11px] leading-relaxed">
                    Google is blocking this request because the <strong>Identity Toolkit API</strong> is not allowed on your API key.
                  </AlertDescription>
                </div>
              </Alert>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" /> Step-by-Step Fix
                </h4>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-muted-foreground uppercase">1. Edit API Key</p>
                    <a 
                      href="https://console.cloud.google.com/apis/credentials" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5 hover:border-primary/50 text-xs font-bold text-white transition-all group"
                    >
                      Open Credentials Console <ExternalLink className="h-3 w-3 group-hover:text-primary" />
                    </a>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      Find your key (likely named "Browser key"), click it, and set <strong>API Restrictions</strong> to "Don't restrict" OR add "Identity Toolkit API".
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-muted-foreground uppercase">2. Enable Provider</p>
                    <a 
                      href={`https://console.firebase.google.com/project/${projectId}/authentication/providers`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5 hover:border-primary/50 text-xs font-bold text-white transition-all group"
                    >
                      Enable Google Sign-In <ExternalLink className="h-3 w-3 group-hover:text-primary" />
                    </a>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs h-10 border-primary/20 hover:bg-primary text-white"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="mr-2 h-3 w-3" /> I've done this, refresh now
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground leading-relaxed">
                Connect your neural link to access personalized farm analytics, AI diagnosis, and autonomous drone fleets.
              </p>
              <Button 
                onClick={handleSignIn}
                disabled={signingIn}
                className="w-full h-12 bg-primary text-primary-foreground font-bold text-lg neon-glow"
              >
                {signingIn ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <><LogIn className="mr-2 h-5 w-5" /> Sign In with Google</>
                )}
              </Button>
            </div>
          )}
          
          <div className="pt-4 border-t border-white/5 flex items-center justify-center">
             <Button variant="link" asChild className="text-muted-foreground hover:text-primary text-xs">
               <Link href="/">Return to Home</Link>
             </Button>
          </div>
        </CardContent>
      </Card>

      <div className="absolute top-0 right-0 p-20 opacity-10 blur-3xl">
        <div className="h-64 w-64 rounded-full bg-primary" />
      </div>
      <div className="absolute bottom-0 left-0 p-20 opacity-10 blur-3xl">
        <div className="h-64 w-64 rounded-full bg-accent" />
      </div>
    </div>
  );
}
