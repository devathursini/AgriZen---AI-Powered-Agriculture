
"use client";

import { useState } from "react";
import { 
  CloudSun, 
  Wind, 
  Thermometer, 
  ShieldAlert, 
  Zap, 
  CloudRain, 
  Sun, 
  Tornado,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { cn } from "@/lib/utils";

const stabilityData = [
  { time: "00:00", stability: 98 },
  { time: "04:00", stability: 97 },
  { time: "08:00", stability: 92 },
  { time: "12:00", stability: 88 },
  { time: "16:00", stability: 85 },
  { time: "20:00", stability: 94 },
  { time: "23:59", stability: 96 },
];

const forecast = [
  { day: "Today", temp: "24°C", condition: "Optimal", icon: Sun, color: "text-primary" },
  { day: "Tue", temp: "26°C", condition: "Heat Risk", icon: Thermometer, color: "text-accent" },
  { day: "Wed", temp: "19°C", condition: "Storm Alert", icon: CloudRain, color: "text-blue-400" },
  { day: "Thu", temp: "22°C", condition: "Wind Shift", icon: Wind, color: "text-muted-foreground" },
];

export default function WeatherShieldPage() {
  const [isShieldActive, setIsShieldActive] = useState(true);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold text-foreground">
            Weather <span className="text-primary">Shield Defense</span>
          </h1>
          <p className="text-muted-foreground">Neural atmospheric monitoring and autonomous crop protection</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-xl">
          <div className="flex items-center gap-2 px-3">
            <ShieldCheck className={cn("h-4 w-4", isShieldActive ? "text-primary" : "text-muted-foreground")} />
            <span className="text-sm font-medium">Auto-Shield Activation</span>
          </div>
          <Switch 
            checked={isShieldActive} 
            onCheckedChange={setIsShieldActive}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Stability Index", value: "94.2%", icon: Activity, trend: "Stable" },
          { label: "Wind Velocity", value: "12 km/h", icon: Wind, trend: "+2%" },
          { label: "UV Radiation", value: "High", icon: Sun, trend: "Warning" },
          { label: "Storm Distance", value: "142 km", icon: Tornado, trend: "Approaching" },
        ].map((stat, i) => (
          <Card key={i} className="glass neon-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
                <Badge variant="outline" className={cn(
                  "text-[10px] uppercase",
                  stat.trend === "Warning" ? "border-accent/20 text-accent" : "border-primary/20 text-primary"
                )}>{stat.trend}</Badge>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold font-headline">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-between">
              Atmospheric Stability (24h)
              <div className="flex items-center gap-1">
                 <div className="h-2 w-2 rounded-full bg-primary" />
                 <span className="text-[10px] text-muted-foreground uppercase">Stability Score</span>
              </div>
            </CardTitle>
            <CardDescription>Real-time neural tracking of weather consistency over your sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stabilityData}>
                  <defs>
                    <linearGradient id="colorStability" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF66" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#00FF66" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} domain={[80, 100]} />
                  <RechartsTooltip 
                    contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px'}}
                  />
                  <Area type="monotone" dataKey="stability" stroke="#00FF66" fillOpacity={1} fill="url(#colorStability)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-headline">Neural Forecast</CardTitle>
            <CardDescription>AI predictions for upcoming climate shifts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {forecast.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn("h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0", item.color)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{item.day}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-headline font-bold">{item.temp}</p>
                  <p className="text-[9px] text-primary font-bold">ACCURACY 98%</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
              Full 10-Day Report <History className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <ShieldAlert className="h-12 w-12 text-accent/20" />
          </div>
          <CardHeader>
            <CardTitle className="font-headline">Threat Mitigation</CardTitle>
            <CardDescription>Current AI-orchestrated defense protocols</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
               <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 space-y-2">
                 <div className="flex items-center gap-2 text-accent">
                   <AlertTriangle className="h-4 w-4" />
                   <span className="text-sm font-bold">Heat Wave Protocol v2.4</span>
                 </div>
                 <p className="text-xs text-muted-foreground">Increasing atmospheric misting in Sector Alpha to lower leaf temperature by 3°C.</p>
                 <Progress value={65} className="h-1 bg-accent/20 mt-2" />
               </div>

               <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                 <div className="flex items-center gap-2 text-primary">
                   <ShieldCheck className="h-4 w-4" />
                   <span className="text-sm font-bold">Wind Stabilization Active</span>
                 </div>
                 <p className="text-xs text-muted-foreground">Autonomous drones positioned to monitor lattice integrity in Sector Gamma.</p>
                 <Progress value={100} className="h-1 bg-primary/20 mt-2" />
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-headline">Global Crop Sentinel</CardTitle>
            <CardDescription>Satellite-linked climate vulnerability map</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video rounded-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/map/800/400')] bg-cover grayscale" />
               <div className="scanline" />
               <div className="relative z-10 text-center space-y-4">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/50 text-primary text-xs font-bold animate-pulse">
                   <Zap className="h-3 w-3" /> LIVE SATELLITE FEED
                 </div>
                 <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Atmospheric layers nominal • Sector 7G Secure</p>
                 <Button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground font-bold">
                   Initialize Deep Scan
                 </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
