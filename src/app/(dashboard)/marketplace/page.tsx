"use client";

import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Leaf, 
  Zap, 
  Package, 
  Tag, 
  Star,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const products = [
  { id: 1, name: "Bio-Genic Tomato Seeds", category: "Seeds", price: 45.99, rating: 4.8, img: "https://picsum.photos/seed/seeds/400/300", tag: "Hot" },
  { id: 2, name: "Veridian-9 Organic Fertilizer", category: "Fertilizers", price: 120.00, rating: 4.9, img: "https://picsum.photos/seed/fert/400/300", tag: "Best Seller" },
  { id: 3, name: "Smart Soil pH Sensor X1", category: "IoT", price: 299.99, rating: 4.7, img: "https://picsum.photos/seed/iot/400/300", tag: "Futuristic" },
  { id: 4, name: "Autonomous Spray Drone", category: "Hardware", price: 2450.00, rating: 5.0, img: "https://picsum.photos/seed/drone/400/300", tag: "Premium" },
  { id: 5, name: "Nano-Nitrogen Booster", category: "Fertilizers", price: 89.00, rating: 4.6, img: "https://picsum.photos/seed/nano/400/300", tag: "New" },
  { id: 6, name: "Hydra-Smart Controller", category: "IoT", price: 155.50, rating: 4.8, img: "https://picsum.photos/seed/irrigation/400/300", tag: "Eco" },
];

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold text-foreground">
            Agri-Nexus <span className="text-primary">Marketplace</span>
          </h1>
          <p className="text-muted-foreground">Decentralized ecosystem for futuristic farming tools</p>
        </div>
        <Button className="bg-primary text-primary-foreground font-bold neon-glow">
          <ShoppingCart className="mr-2 h-5 w-5" /> View Cart (0)
        </Button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search bio-seeds, smart sensors, drones..." className="pl-10 bg-white/5 border-white/10" />
        </div>
        <Tabs defaultValue="all" className="w-full md:w-auto">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="seeds">Seeds</TabsTrigger>
            <TabsTrigger value="iot">IoT</TabsTrigger>
            <TabsTrigger value="drones">Drones</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" className="border-white/10 hover:bg-white/5">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="glass hover:border-primary/50 transition-all group overflow-hidden">
            <div className="relative aspect-video overflow-hidden">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary text-primary-foreground font-bold">{product.tag}</Badge>
              </div>
            </div>
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">{product.name}</CardTitle>
                <div className="flex items-center gap-1 text-accent">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs font-bold">{product.rating}</span>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-white/10">{product.category}</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold font-headline">${product.price}</span>
                <span className="text-xs text-muted-foreground mb-1">/ unit</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button className="flex-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground font-bold transition-all">
                Add to Cart
              </Button>
              <Button size="icon" variant="outline" className="border-white/10 hover:border-primary">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}