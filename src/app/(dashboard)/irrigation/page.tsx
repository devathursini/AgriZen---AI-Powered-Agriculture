
"use client";

import { useState } from "react";
import { 
  Droplets, 
  Wind, 
  Thermometer, 
  Zap, 
  Clock, 
  Plus, 
  Settings2, 
  Activity, 
  Waves,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  CloudRain
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from "recharts";
import { cn } from "@/lib/utils";

const moistureHistory = [
  { time: "00:00", moisture: 58 },
  { time: "04:00", moisture: 55 },
  { time: "08:00", moisture: 62 },
  { time: "12:00", moisture: 65 },
  { time: "16:00", moisture: 60 },
  { time: "20:00", moisture: 63 },
  { time: "23:59", moisture: 61 },
];

const zones = [
  { id: 1, name: "Sector Alpha", crop: "Tomatoes", moisture: 62, status: "Active", pressure: "4.2 bar" },
  { id: 2, name: "Sector Beta", crop: "Wheat", moisture: 45, status: "Idle", pressure: "0.0 bar" },
  { id: 3, name: "Greenhouse X", crop: "Orchids", moisture: 78, status: "Active", pressure: "2.8 bar" },
  { id: 4, name: "Sector Gamma", crop: "Corn", moisture: 52, status: "Scheduled", pressure: "0.0 bar" },
];

export default function IrrigationPage() {
  const [isAutonomous, setIsAutonomous] = useState(true);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold text-foreground">
            Smart <span className="text-primary">Irrigation Control</span>
          </h1>
          <p className="text-muted-foreground">Autonomous hydration management and moisture analytics</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-xl">
          <div className="flex items-center gap-2 px-3">
            <Zap className={cn("h-4 w-4", isAutonomous ? "text-primary" : "text-muted-foreground")} />
            <span className="text-sm font-medium">Autonomous Mode</span>
          </div>
          <Switch 
            checked={isAutonomous} 
            onCheckedChange={setIsAutonomous}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Water Used Today", value: "1,240L", icon: Waves, trend: "-12% (AI Saved)" },
          { label: "Avg. Moisture", value: "61%", icon: Droplets, trend: "Optimal" },
          { label: "Humidity Index", value: "48%", icon: CloudRain, trend: "Rising" },
          { label: "System Health", value: "Nominal", icon: Activity, trend: "99.9% Uptime" },
        ].map((stat, i) => (
          <Card key={i} className="glass neon-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
                <Badge variant="outline" className="border-primary/20 text-primary text-[10px] uppercase">Live</Badge>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold font-headline">{stat.value}</h3>
              <p className="text-[10px] text-primary mt-1 font-bold">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-between">
              Moisture Trends (24h)
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                Detailed Log <Activity className="ml-2 h-3 w-3" />
              </Button>
            </CardTitle>
            <CardDescription>Real-time soil hydration levels mapped across all sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moistureHistory}>
                  <defs>
                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF66" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#00FF66" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px'}}
                  />
                  <Area type="monotone" dataKey="moisture" stroke="#00FF66" fillOpacity={1} fill="url(#colorMoisture)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">AI Optimizer</CardTitle>
            <CardDescription>Machine learning water efficiency insights</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <p className="text-sm font-bold">Strategy: Pulse Irrigation</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Veridian AI detected a drop in Sector Beta soil retention. Switched to pulse irrigation to prevent surface runoff. 
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] uppercase font-bold text-primary">Efficiency Boost</span>
                <span className="text-sm font-bold">+18.5%</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground uppercase">Retention Rate</span>
                  <span className="font-bold">78%</span>
                </div>
                <Progress value={78} className="h-1.5 bg-white/5" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground uppercase">Evaporation Loss</span>
                  <span className="font-bold">12%</span>
                </div>
                <Progress value={12} className="h-1.5 bg-white/5" />
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground font-bold">
                Run Simulation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Sector Management</CardTitle>
              <CardDescription>Control individual irrigation zones</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="border-white/10">
              <Plus className="h-4 w-4 mr-2" /> Add Zone
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {zones.map((zone) => (
                <div key={zone.id} className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center border",
                      zone.status === "Active" ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-white/10 text-muted-foreground"
                    )}>
                      <Waves className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{zone.name}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{zone.crop} • {zone.pressure}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold">{zone.moisture}%</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Moisture</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={cn(
                        "text-[9px] uppercase font-bold px-2",
                        zone.status === "Active" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-muted-foreground"
                      )}>
                        {zone.status}
                      </Badge>
                      <Switch className="data-[state=checked]:bg-primary" defaultChecked={zone.status === "Active"} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-headline">Irrigation Schedule</CardTitle>
            <CardDescription>Upcoming autonomous watering events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { time: "Tomorrow, 05:00 AM", sector: "Sector Beta", duration: "45 mins", type: "Heavy Hydration" },
              { time: "Tomorrow, 08:30 AM", sector: "Sector Alpha", duration: "15 mins", type: "Maintenance Mist" },
              { time: "Wed, 04:00 AM", sector: "Sector Gamma", duration: "30 mins", type: "Standard Cycle" },
            ].map((event, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-bold">{event.sector}</p>
                    <Badge variant="outline" className="text-[9px] border-white/10 uppercase">{event.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {event.time}</span>
                    <span className="flex items-center gap-1"><Droplets className="h-3 w-3" /> {event.duration}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
              View Calendar <Calendar className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
