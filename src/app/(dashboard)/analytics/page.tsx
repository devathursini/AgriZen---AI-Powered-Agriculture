"use client";

import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Zap, 
  Database, 
  ArrowUpRight,
  Brain,
  Loader2,
  AlertCircle,
  Sprout,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { neuralYieldPrediction, type YieldPredictionOutput } from "@/ai/flows/neural-yield-prediction-engine";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const yieldData = [
  { month: "Jan", actual: 4000, projected: 4400 },
  { month: "Feb", actual: 3000, projected: 3200 },
  { month: "Mar", actual: 2000, projected: 2100 },
  { month: "Apr", actual: 2780, projected: 3000 },
  { month: "May", actual: 1890, projected: 2000 },
  { month: "Jun", actual: 2390, projected: 2500 },
  { month: "Jul", actual: 3490, projected: 3800 },
];

const cropDistribution = [
  { name: 'Tomato', value: 400 },
  { name: 'Wheat', value: 300 },
  { name: 'Corn', value: 300 },
  { name: 'Potato', value: 200 },
];

const COLORS = ['#00FF66', '#CFFF00', '#00e5ff', '#7c4dff'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<YieldPredictionOutput | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cropType: "Tomato",
    areaSize: 10,
    soilPh: 6.5,
    expectedRainfall: 500,
    avgTemperature: 25,
  });

  const handlePredict = async () => {
    setLoading(true);
    try {
      const result = await neuralYieldPrediction(formData);
      setPrediction(result);
      toast({
        title: "Prediction Complete",
        description: "AI has calculated your expected yield index.",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "The neural engine was unable to process your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-4xl font-bold text-foreground">
          Agro-Predictive <span className="text-primary">Engine</span>
        </h1>
        <p className="text-muted-foreground">Advanced harvesting trends and profit estimation</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Season Accuracy", value: "98.2%", icon: Target, trend: "+2%" },
          { label: "Data Points/Sec", value: "14.2k", icon: Database, trend: "+24%" },
          { label: "Predictive Confidence", value: "High", icon: Activity, trend: "Stable" },
          { label: "Profit Forecast", value: "$428k", icon: TrendingUp, trend: "+12.5%" },
        ].map((stat, i) => (
          <Card key={i} className="glass neon-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
                <Badge variant="outline" className="border-primary/20 text-primary text-[10px]">{stat.trend}</Badge>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold font-headline">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Yield Prediction Tool */}
        <Card className="glass lg:col-span-1 border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" /> Neural Yield Predictor
            </CardTitle>
            <CardDescription>Calculate expected harvest using AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase">Crop Type</Label>
              <Select value={formData.cropType} onValueChange={(v) => setFormData({...formData, cropType: v})}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tomato">Tomato</SelectItem>
                  <SelectItem value="Wheat">Wheat</SelectItem>
                  <SelectItem value="Corn">Corn</SelectItem>
                  <SelectItem value="Potato">Potato</SelectItem>
                  <SelectItem value="Rice">Rice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase">Area (Acres)</Label>
                <Input 
                  type="number" 
                  value={formData.areaSize} 
                  onChange={(e) => setFormData({...formData, areaSize: Number(e.target.value)})}
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase">Soil pH</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  value={formData.soilPh} 
                  onChange={(e) => setFormData({...formData, soilPh: Number(e.target.value)})}
                  className="bg-white/5 border-white/10" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase">Rainfall (mm)</Label>
                <Input 
                  type="number" 
                  value={formData.expectedRainfall} 
                  onChange={(e) => setFormData({...formData, expectedRainfall: Number(e.target.value)})}
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase">Temp (°C)</Label>
                <Input 
                  type="number" 
                  value={formData.avgTemperature} 
                  onChange={(e) => setFormData({...formData, avgTemperature: Number(e.target.value)})}
                  className="bg-white/5 border-white/10" 
                />
              </div>
            </div>
            <Button 
              onClick={handlePredict} 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold neon-glow mt-4"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Run Prediction"}
            </Button>
          </CardContent>
        </Card>

        {/* Prediction Results */}
        <Card className="glass lg:col-span-2 relative overflow-hidden">
          {prediction && (
            <div className="absolute top-0 right-0 p-4">
              <Badge className="bg-primary/20 text-primary border-primary/20">AI Verified</Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle className="font-headline">Prediction Analytics</CardTitle>
            <CardDescription>AI-generated yield insights and risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {prediction ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Predicted Total</p>
                    <div className="flex items-center gap-2">
                      <Sprout className="h-4 w-4 text-primary" />
                      <p className="text-2xl font-bold font-headline">{prediction.predictedYield} Tons</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Est. Market Value</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-accent" />
                      <p className="text-2xl font-bold font-headline">${prediction.marketValueEstimation.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">AI Confidence</p>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <p className="text-2xl font-bold font-headline">{prediction.confidenceScore}%</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-3 w-3" /> Risk Factors
                    </h4>
                    <div className="space-y-2">
                      {prediction.riskFactors.map((risk, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                          {risk}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                      <Zap className="h-3 w-3" /> Optimization Steps
                    </h4>
                    <div className="space-y-2">
                      {prediction.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
                <Brain className="h-12 w-12 opacity-10" />
                <div className="space-y-1">
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Neural Link</p>
                  <p className="text-xs">Input your farm parameters and run the prediction engine.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-between">
              Yield Forecasting
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                   <div className="h-2 w-2 rounded-full bg-primary" />
                   <span className="text-[10px] text-muted-foreground uppercase">Actual</span>
                </div>
                <div className="flex items-center gap-1">
                   <div className="h-2 w-2 rounded-full bg-accent" />
                   <span className="text-[10px] text-muted-foreground uppercase">Projected</span>
                </div>
              </div>
            </CardTitle>
            <CardDescription>Comparison between real-time data and AI-simulated yield models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldData}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF66" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#00FF66" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px'}}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#00FF66" fillOpacity={1} fill="url(#colorActual)" strokeWidth={3} />
                  <Area type="monotone" dataKey="projected" stroke="#CFFF00" fill="transparent" strokeDasharray="5 5" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-headline">Crop Distribution</CardTitle>
            <CardDescription>Visual breakdown of land utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cropDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {cropDistribution.map((crop, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{backgroundColor: COLORS[i]}} />
                    <span>{crop.name}</span>
                  </div>
                  <span className="font-bold">{((crop.value/1200)*100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass overflow-hidden">
          <div className="h-2 bg-primary w-1/3" />
          <CardHeader>
            <CardTitle className="font-headline text-lg">Autonomous Optimization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Veridian IQ's neural engine suggests moving to a crop-rotation cycle in Sector B. Soil pH is trending towards 6.2, which is optimal for pulse crops.
            </p>
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
              Apply Recommendation <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="glass overflow-hidden">
          <div className="h-2 bg-accent w-2/3" />
          <CardHeader>
            <CardTitle className="font-headline text-lg">Weather Risk Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Long-term forecast indicates an 18% increase in storm frequency. Veridian recommends upgrading drone hulls to weatherproof Alloy-7.
            </p>
            <Button variant="outline" className="border-accent/20 text-accent hover:bg-accent/10">
              Check Inventory <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
