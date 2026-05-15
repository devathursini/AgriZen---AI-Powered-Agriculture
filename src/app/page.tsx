
"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip
} from "recharts";
import { 
  CloudSun, 
  Droplet, 
  Thermometer, 
  Activity, 
  TrendingUp,
  ArrowRight,
  Dna,
  Bot,
  ShoppingCart,
  Loader2,
  FileText,
  LogIn,
  ExternalLink,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import DashboardLayout from "./(dashboard)/layout";
import { cn } from "@/lib/utils";
import { aiGeneratedComprehensiveFarmReport } from "@/ai/flows/ai-generated-comprehensive-farm-report-flow";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, useAuth, useCollection } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const chartData = [
  { name: "Mon", health: 85, yield: 65 },
  { name: "Tue", health: 88, yield: 70 },
  { name: "Wed", health: 75, yield: 68 },
  { name: "Thu", health: 92, yield: 80 },
  { name: "Fri", health: 90, yield: 85 },
  { name: "Sat", health: 95, yield: 90 },
  { name: "Sun", health: 88, yield: 82 },
];

const StatCard = ({ icon: Icon, title, value, sub, trend }: any) => (
  <Card className="glass neon-border relative overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="font-headline text-3xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-primary" />
          <span className="text-xs font-bold text-primary">{trend} increase</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  const reportsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "reports"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(3)
    );
  }, [db, user]);

  const { data: recentReports, loading: reportsLoading } = useCollection(reportsQuery);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  const handleGenerateReport = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate and save reports.",
        action: (
          <Button variant="outline" size="sm" onClick={handleSignIn}>
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button>
        )
      });
      return;
    }

    setIsGenerating(true);
    try {
      const cropType = "Bio-Genic Tomato";
      const result = await aiGeneratedComprehensiveFarmReport({
        farmerName: user.displayName || "Nexus Farmer",
        farmLocation: "Sector 7G, Veridian Prime",
        cropType: cropType,
        plantingDate: "2024-01-15",
        weatherData: {
          temperature: 24.5,
          humidity: 62,
          rainProbability: 12
        },
        soilData: {
          soilType: "Loamy-Nexus",
          phValue: 6.2,
          moistureLevel: 58
        },
        reportTimestamp: new Date().toISOString()
      });

      const reportData = {
        userId: user.uid,
        reportUrl: result.reportUrl,
        cropType: cropType,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      };

      addDoc(collection(db, "reports"), reportData)
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: "reports",
            operation: "create",
            requestResourceData: reportData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: "Report Generated",
        description: "Your AI farm report is ready and has been saved to your history.",
        action: (
          <Button variant="outline" size="sm" asChild>
            <a href={result.reportUrl} target="_blank" rel="noopener noreferrer">View PDF</a>
          </Button>
        )
      });
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "An unexpected error occurred during report generation."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-headline text-4xl font-bold text-foreground">
              Nexus <span className="text-primary">Control Hub</span>
            </h1>
            <p className="text-muted-foreground">Autonomous Farming Ecosystem Live Status</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1">
              <Activity className="mr-2 h-3 w-3 animate-pulse" /> Live
            </Badge>
            <Button 
              onClick={handleGenerateReport} 
              disabled={isGenerating || userLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold min-w-[160px] neon-glow"
            >
              {isGenerating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><FileText className="mr-2 h-4 w-4" /> Generate Report</>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Thermometer} title="Avg. Temp" value="24.5°C" sub="Optimal Range" trend="+2.4%" />
          <StatCard icon={Droplet} title="Soil Moisture" value="62%" sub="Slightly Low" trend="-0.5%" />
          <StatCard icon={CloudSun} title="Solar Intensity" value="850 W/m²" sub="High Efficiency" trend="+12%" />
          <StatCard icon={Activity} title="Yield Index" value="94.2" sub="Record Season" trend="+18.5%" />
        </div>

        <div className="grid gap-6 lg:grid-cols-7">
          <Card className="glass lg:col-span-4 border-white/5">
            <CardHeader>
              <CardTitle className="font-headline">Ecosystem Vitality</CardTitle>
              <CardDescription>Real-time health and yield metrics across all sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                    <RechartsTooltip 
                      contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px'}}
                      itemStyle={{color: 'hsl(var(--primary))'}}
                    />
                    <Area type="monotone" dataKey="health" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorHealth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass lg:col-span-3 border-white/5">
            <CardHeader>
              <CardTitle className="font-headline">Recent Intelligence</CardTitle>
              <CardDescription>Your latest AI-generated farm reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              ) : recentReports && recentReports.length > 0 ? (
                recentReports.map((report: any) => (
                  <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold truncate max-w-[150px]">{report.cropType}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Report Saved</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild className="text-primary hover:bg-primary/10">
                      <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground">No reports generated yet.</p>
                </div>
              )}
              <Button variant="outline" asChild className="w-full border-white/10 hover:bg-white/5">
                <Link href="/reports">View All Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/diagnosis" className="group">
            <Card className="glass h-full hover:border-primary/50 transition-all overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <Dna className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-headline">Neural Diagnosis</CardTitle>
                <CardDescription>Scan crops using high-precision computer vision AI.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/assistant" className="group">
            <Card className="glass h-full hover:border-primary/50 transition-all overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <Bot className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-headline">Veridian AI</CardTitle>
                <CardDescription>Talk to your digital agronomist for expert advice.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/marketplace" className="group">
            <Card className="glass h-full hover:border-primary/50 transition-all overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-headline">Agri-Nexus</CardTitle>
                <CardDescription>Access the futuristic marketplace for smart tools.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
