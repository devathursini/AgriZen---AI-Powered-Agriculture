
"use client";

import { useState } from "react";
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Trophy, 
  Globe, 
  Zap, 
  ArrowUpRight, 
  Heart, 
  Hash,
  Search,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const broadcasts = [
  {
    id: 1,
    author: "Elena Vance",
    handle: "@ev_agrotech",
    avatar: "https://picsum.photos/seed/elena/100/100",
    content: "Just achieved a 15% yield increase in Sector 4 using the new pulse irrigation strategy. Veridian IQ's neural engine is a game changer! 🌿⚡",
    tags: ["#SmartFarming", "#YieldGrowth"],
    likes: 142,
    comments: 24,
    time: "45m ago"
  },
  {
    id: 2,
    author: "Marcus Thorne",
    handle: "@mthorne_nexus",
    avatar: "https://picsum.photos/seed/marcus/100/100",
    content: "Warning: Seeing slight variations in soil pH across the North Boundary. Anyone else in the region noticing similar trends? #Agronomy #Help",
    tags: ["#SoilHealth", "#VeridianAlert"],
    likes: 89,
    comments: 56,
    time: "2h ago"
  }
];

const researchLabs = [
  { name: "Hydro-Neural Optimization", members: "1.2k", active: true },
  { name: "Vertical Bio-Lattice", members: "850", active: false },
  { name: "Drought Resistance Gen-3", members: "3.4k", active: true },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold text-foreground">
            Nexus <span className="text-primary">Community Hub</span>
          </h1>
          <p className="text-muted-foreground">Decentralized collective intelligence for the modern farmer</p>
        </div>
        <Button className="bg-primary text-primary-foreground font-bold neon-glow">
          <Plus className="mr-2 h-5 w-5" /> New Broadcast
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search broadcasts, farmers, or research labs..." className="pl-10 bg-white/5 border-white/10" />
          </div>

          {broadcasts.map((post) => (
            <Card key={post.id} className="glass hover:border-primary/30 transition-all group">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 border border-white/10 shrink-0">
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm">{post.author}</h4>
                        <p className="text-xs text-muted-foreground">{post.handle} • {post.time}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{post.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                      <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Heart className="h-4 w-4" /> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <MessageSquare className="h-4 w-4" /> {post.comments}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar Components */}
        <div className="space-y-6">
          {/* Global Rankings */}
          <Card className="glass overflow-hidden">
            <div className="h-1.5 bg-primary w-full" />
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" /> Nexus Leaderboard
              </CardTitle>
              <CardDescription>Top contributing farm entities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Sector 7G Labs", points: "14.2k", rank: 1 },
                { name: "Veridian North", points: "12.8k", rank: 2 },
                { name: "Horizon Fields", points: "9.5k", rank: 3 },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary">#{item.rank}</span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold">{item.points} XP</Badge>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
                View Full Rankings <ArrowUpRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          {/* Research Labs */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" /> Active Neural Labs
              </CardTitle>
              <CardDescription>Collaborative research groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {researchLabs.map((lab) => (
                <div key={lab.name} className="group cursor-pointer p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="text-xs font-bold">{lab.name}</h5>
                    {lab.active && <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
                    <span>{lab.members} Members</span>
                    <span className="group-hover:text-primary">Join Lab →</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Trending Nodes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["#AtmosphericShield", "#PulseIrrigation", "#DroneSwarm", "#BioGenetics", "#SustainableHarvest"].map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-white/5 hover:bg-white/10 cursor-pointer text-[10px]">
                    <Hash className="h-3 w-3 mr-1" /> {tag.replace('#', '')}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
