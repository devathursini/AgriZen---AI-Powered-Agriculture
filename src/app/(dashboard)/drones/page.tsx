
"use client";

import { useState } from "react";
import { 
  Plane, 
  Cpu, 
  Battery, 
  Navigation, 
  Zap, 
  Shield, 
  Settings, 
  Plus, 
  Crosshair, 
  Activity,
  ArrowUpRight,
  Radio,
  Map as MapIcon,
  Droplets,
  Eye,
  ArrowUp,
  ArrowDown,
  Home,
  Wind
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const initialDroneFleet = [
  { id: "NX-01", model: "Aero-Spray v4", battery: 88, status: "In Flight", task: "Crop Spraying - Sector A", health: 98, temp: "32°C" },
  { id: "NX-02", model: "Sentinel Eye", battery: 42, status: "Returning", task: "Surveillance - North Boundary", health: 95, temp: "38°C" },
  { id: "NX-03", model: "Hydro-Mist Drone", battery: 100, status: "Docked", task: "Ready", health: 100, temp: "24°C" },
  { id: "NX-04", model: "Bio-Mapper", battery: 15, status: "Charging", task: "Recharging", health: 92, temp: "45°C" },
];

export default function DroneControlPage() {
  const [fleet, setFleet] = useState(initialDroneFleet);
  const { toast } = useToast();

  const handleCommand = (droneId: string, command: string) => {
    toast({
      title: "Command Transmitted",
      description: `Neural link established with ${droneId}. Executing ${command}...`,
    });
  };

  const dispatchMission = (mission: string) => {
    toast({
      title: "Mission Dispatched",
      description: `Swarm intelligence coordinating for ${mission}. Units deploying immediately.`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold text-foreground">
            Drone <span className="text-primary">Fleet Control</span>
          </h1>
          <p className="text-muted-foreground">Autonomous aerial operations and mission dispatching</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-white/10 hover:bg-white/5">
             <Settings className="mr-2 h-4 w-4" /> Config
           </Button>
           <Button className="bg-primary text-primary-foreground font-bold neon-glow">
             <Plus className="mr-2 h-5 w-5" /> Deploy New Unit
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Units", value: "2", icon: Plane, sub: "In Mission" },
          { label: "Fleet Health", value: "96%", icon: Shield, sub: "Average Vitality" },
          { label: "Docked/Charging", value: "2", icon: Zap, sub: "Nexus Base" },
          { label: "Signal Latency", value: "14ms", icon: Radio, sub: "Neural Link" },
        ].map((stat, i) => (
          <Card key={i} className="glass neon-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
                <Badge variant="outline" className="border-primary/20 text-primary text-[10px] uppercase">Live</Badge>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold font-headline">{stat.value}</h3>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission Dispatcher */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" /> Neural Mission Dispatcher
          </CardTitle>
          <CardDescription>Select strategic mission profiles for autonomous swarm deployment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button onClick={() => dispatchMission("Crop Spraying")} className="h-20 flex flex-col gap-2 bg-white/5 border-white/10 hover:border-primary/50 hover:bg-primary/5 group">
              <Droplets className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Crop Spraying</span>
            </Button>
            <Button onClick={() => dispatchMission("Field Mapping")} className="h-20 flex flex-col gap-2 bg-white/5 border-white/10 hover:border-primary/50 hover:bg-primary/5 group">
              <MapIcon className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Field Mapping</span>
            </Button>
            <Button onClick={() => dispatchMission("Livestock Monitoring")} className="h-20 flex flex-col gap-2 bg-white/5 border-white/10 hover:border-primary/50 hover:bg-primary/5 group">
              <Eye className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Livestock</span>
            </Button>
            <Button onClick={() => dispatchMission("Takeoff All Units")} className="h-20 flex flex-col gap-2 bg-primary/10 border-primary/20 hover:bg-primary hover:text-primary-foreground group">
              <ArrowUp className="h-6 w-6 group-hover:animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Takeoff All</span>
            </Button>
            <Button onClick={() => dispatchMission("Land All Units")} className="h-20 flex flex-col gap-2 bg-destructive/10 border-destructive/20 hover:bg-destructive hover:text-white group">
              <ArrowDown className="h-6 w-6 group-hover:animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Land All</span>
            </Button>
            <Button onClick={() => dispatchMission("Return All to Nexus")} className="h-20 flex flex-col gap-2 bg-white/5 border-white/10 hover:border-accent/50 hover:bg-accent/10 group">
              <Home className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Return All</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Fleet Monitor */}
        <Card className="glass lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Unit Vitals & Controls</CardTitle>
              <CardDescription>Real-time telemetry and manual override commands</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fleet.map((drone) => (
              <div key={drone.id} className="group flex flex-col p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center border",
                      drone.status === "In Flight" ? "bg-primary/10 border-primary/20 text-primary animate-pulse" : "bg-white/5 border-white/10 text-muted-foreground"
                    )}>
                      <Plane className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        {drone.id} 
                        <Badge variant="outline" className={cn(
                          "text-[9px] px-1.5 py-0",
                          drone.status === "In Flight" ? "bg-primary/20 text-primary border-primary/20" : "bg-white/10 text-muted-foreground"
                        )}>
                          {drone.status}
                        </Badge>
                      </h4>
                      <p className="text-xs text-muted-foreground">{drone.model}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-white/10 hover:border-primary hover:text-primary text-[10px] font-bold h-8"
                      onClick={() => handleCommand(drone.id, "Takeoff")}
                      disabled={drone.status === "In Flight" || drone.status === "Charging"}
                    >
                      <ArrowUp className="mr-1 h-3 w-3" /> TAKEOFF
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-white/10 hover:border-destructive hover:text-destructive text-[10px] font-bold h-8"
                      onClick={() => handleCommand(drone.id, "Emergency Landing")}
                      disabled={drone.status === "Docked" || drone.status === "Charging"}
                    >
                      <ArrowDown className="mr-1 h-3 w-3" /> LAND
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-white/10 hover:border-accent hover:text-accent text-[10px] font-bold h-8"
                      onClick={() => handleCommand(drone.id, "Return Home")}
                      disabled={drone.status === "Docked" || drone.status === "Charging" || drone.status === "Returning"}
                    >
                      <Home className="mr-1 h-3 w-3" /> HOME
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                      <span>Battery</span>
                      <span className={drone.battery < 20 ? "text-destructive" : ""}>{drone.battery}%</span>
                    </div>
                    <Progress value={drone.battery} className={cn("h-1.5", drone.battery < 20 ? "bg-destructive/20" : "bg-white/5")} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Current Task</p>
                    <p className="text-xs font-medium truncate">{drone.task}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Thermal Index</p>
                    <p className="text-xs font-medium">{drone.temp}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Health</p>
                    <p className="text-xs font-medium text-primary">{drone.health}%</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Map Overlay */}
        <Card className="glass relative overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Nexus Grid Overlay</CardTitle>
            <CardDescription>Live positioning and sector coverage</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 relative flex items-center justify-center">
             <div className="absolute inset-4 rounded-xl bg-black/40 border border-white/5 overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[url('https://picsum.photos/seed/drone-map/600/600')] bg-cover grayscale" />
                <div className="scanline" />
                
                {/* Radar visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-48 w-48 rounded-full border border-primary/20 animate-ping opacity-20" />
                  <div className="h-32 w-32 rounded-full border border-primary/40 animate-pulse" />
                  <div className="h-1 w-1 rounded-full bg-primary neon-glow" />
                </div>

                {/* Drone markers */}
                <div className="absolute top-1/4 left-1/3 h-2 w-2 rounded-full bg-primary animate-bounce" />
                <div className="absolute bottom-1/3 right-1/4 h-2 w-2 rounded-full bg-accent animate-pulse" />
             </div>
             <div className="z-10 text-center space-y-4 p-8">
                <Button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground font-bold">
                  <Navigation className="mr-2 h-4 w-4" /> Open Full Grid
                </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mission Scheduler */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-headline">Active Mission Queue</CardTitle>
            <CardDescription>Scheduled autonomous task distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { time: "14:00", unit: "NX-03", mission: "Hydro-Neural Spraying", sector: "Sector Beta", priority: "Critical", icon: Droplets },
              { time: "15:30", unit: "NX-01", mission: "Livestock Bio-Thermal Scan", sector: "Pasture North", priority: "High", icon: Eye },
              { time: "16:45", unit: "NX-04", mission: "Topographical Field Mapping", sector: "Global Perimeter", priority: "Normal", icon: MapIcon },
            ].map((mission, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10 shrink-0">
                  <mission.icon className={cn("h-5 w-5", mission.mission.includes("Spraying") ? "text-primary" : (mission.mission.includes("Mapping") ? "text-accent" : "text-blue-400"))} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-bold">{mission.mission}</p>
                    <Badge variant="outline" className={cn(
                      "text-[9px] uppercase",
                      mission.priority === "Critical" ? "border-destructive/20 text-destructive" : (mission.priority === "High" ? "border-accent/20 text-accent" : "border-primary/20 text-primary")
                    )}>{mission.priority}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono">{mission.time}</span>
                    <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> {mission.sector}</span>
                    <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> {mission.unit}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
              View Detailed Mission Log <ArrowUpRight className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        {/* Maintenance Status */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-headline">Nexus Dock Vitals</CardTitle>
            <CardDescription>Ground station maintenance and repair logs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Battery className="h-4 w-4 text-primary" />
                  <span className="text-sm">Dock 1 (Rapid Charging)</span>
                </div>
                <Badge className="bg-primary/20 text-primary text-[9px]">ACTIVE</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Cpu className="h-4 w-4 text-accent" />
                  <span className="text-sm">Drone NX-04 (Firmware Update)</span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">45% COMPLETE</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <div className="flex items-center gap-3">
                  <Crosshair className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Sprayer Nozzle Malfunction (NX-02)</span>
                </div>
                <Button variant="link" className="text-destructive text-[10px] p-0 font-bold uppercase">SERVICE NOW</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
