"use client";

import { useState } from "react";
import { 
  ShieldAlert, 
  Flame, 
  Wind, 
  Radio, 
  Bell, 
  ShieldCheck, 
  History,
  LifeBuoy,
  PhoneCall,
  Map
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const activeAlerts = [
  { 
    id: 1, 
    type: "Critical", 
    title: "Localized Wildfire Detection", 
    location: "Sector Delta Boundary", 
    time: "2 mins ago", 
    icon: Flame, 
    color: "text-destructive",
    description: "Heat signature detected. Autonomous suppression drones deployed."
  },
  { 
    id: 2, 
    type: "Warning", 
    title: "High Velocity Wind Gusts", 
    location: "Global Farm Grid", 
    time: "15 mins ago", 
    icon: Wind, 
    color: "text-accent",
    description: "Speeds exceeding 80km/h. Secure all light hardware."
  },
];

const sectorStatus = [
  { name: "Sector Alpha", status: "Secure", health: 100 },
  { name: "Sector Beta", status: "Secure", health: 98 },
  { name: "Sector Gamma", status: "Monitoring", health: 85 },
  { name: "Sector Delta", status: "Emergency", health: 42 },
];

export default function DisasterCenterPage() {
  const [isEmergencyBroadcast, setIsEmergencyBroadcast] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold text-foreground">
            AgriZen <span className="text-destructive">Response Center</span>
          </h1>
          <p className="text-muted-foreground">Strategic emergency management and threat mitigation hub</p>
        </div>
        <Button 
          variant={isEmergencyBroadcast ? "default" : "destructive"}
          className={cn("font-bold h-12 px-6 neon-glow transition-all", isEmergencyBroadcast && "bg-primary")}
          onClick={() => setIsEmergencyBroadcast(!isEmergencyBroadcast)}
        >
          {isEmergencyBroadcast ? <ShieldCheck className="mr-2 h-5 w-5" /> : <Radio className="mr-2 h-5 w-5 animate-pulse" />}
          {isEmergencyBroadcast ? "All Clear Broadcast" : "Initiate Emergency Broadcast"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Threats */}
        <Card className="glass lg:col-span-2 border-destructive/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldAlert className="h-24 w-24 text-destructive" />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline flex items-center gap-2">
                <Bell className="h-5 w-5 text-destructive animate-bounce" /> 
                Active Neural Threats
              </CardTitle>
              <Badge variant="destructive" className="animate-pulse">Live Feed</Badge>
            </div>
            <CardDescription>Real-time emergency detection and automated response logs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className="flex gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/10 hover:bg-destructive/10 transition-colors">
                <div className={cn("h-12 w-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/5", alert.color)}>
                  <alert.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">{alert.title}</h4>
                    <span className="text-[10px] text-muted-foreground uppercase">{alert.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{alert.description}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="outline" className="text-[9px] uppercase border-destructive/20 text-destructive">{alert.type}</Badge>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{alert.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rapid Response Team */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-headline">Nexus Support</CardTitle>
            <CardDescription>Emergency contact and coordination</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
              <div className="flex items-center gap-3">
                <LifeBuoy className="h-5 w-5 text-primary" />
                <p className="text-sm font-bold">AgriZen Rapid Response</p>
              </div>
              <p className="text-xs text-muted-foreground">Priority access to autonomous repair drones and emergency agricultural consultants.</p>
              <Button className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground font-bold">
                <PhoneCall className="mr-2 h-4 w-4" /> Request Drone Support
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Emergency Protocols</h4>
              <div className="grid gap-2">
                {["Evacuation Route 7G", "Flood Barrier Activation", "Crop Shield Lockdown"].map((protocol, i) => (
                  <Button key={i} variant="outline" className="justify-start border-white/5 hover:border-primary/50 text-xs">
                    <Map className="mr-2 h-3 w-3 text-primary" /> {protocol}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Sector Integrity */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-headline">Sector Integrity Map</CardTitle>
            <CardDescription>Structural and biological health of farm zones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sectorStatus.map((sector) => (
              <div key={sector.name} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">{sector.name}</span>
                  <Badge className={cn(
                    "text-[9px] px-2",
                    sector.status === "Secure" ? "bg-primary/20 text-primary" : (sector.status === "Emergency" ? "bg-destructive text-white" : "bg-accent/20 text-accent")
                  )}>
                    {sector.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={sector.health} className={cn(
                    "h-1.5 flex-1",
                    sector.health < 50 ? "bg-destructive/20" : "bg-white/5"
                  )} />
                  <span className="text-[10px] font-bold w-8">{sector.health}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Historical Logs */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-headline">Threat Archive</CardTitle>
            <CardDescription>Past mitigation and event history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { date: "Oct 12", event: "Minor Irrigation Leak", result: "Resolved", icon: ShieldCheck },
              { date: "Sep 28", event: "Frost Risk Detected", result: "Shielded", icon: ShieldCheck },
              { date: "Aug 15", event: "Pest Migration", result: "Diverted", icon: ShieldCheck },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
                    <History className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{log.event}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{log.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <log.icon className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase">{log.result}</span>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
              View Detailed Archives <History className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
