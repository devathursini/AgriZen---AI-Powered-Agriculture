"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { 
  Dna, 
  Calendar, 
  Search,
  Filter,
  Trash2,
  Loader2,
  ChevronRight,
  AlertCircle,
  History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, query, where, orderBy, deleteDoc, doc } from "firebase/firestore";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DiagnosisDate = ({ timestamp }: { timestamp: string }) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    try {
      setFormattedDate(format(new Date(timestamp), 'PPP p'));
    } catch (e) {
      setFormattedDate('Invalid Date');
    }
  }, [timestamp]);

  if (!formattedDate) return <span className="animate-pulse bg-white/5 h-3 w-24 rounded" />;
  return <>{formattedDate}</>;
};

export default function DiagnosisHistoryPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [search, setSearch] = useState("");

  const diagnosesQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "diagnoses"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [db, user]);

  const { data: diagnoses, loading } = useCollection(diagnosesQuery);

  const filteredDiagnoses = useMemo(() => {
    if (!diagnoses) return [];
    return diagnoses.filter(d => 
      d.identification?.commonName?.toLowerCase().includes(search.toLowerCase()) ||
      d.diagnosis?.diseaseName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [diagnoses, search]);

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "diagnoses", id));
    } catch (err) {
      console.error("Failed to delete diagnosis:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold text-foreground">
            Diagnosis <span className="text-primary">History</span>
          </h1>
          <p className="text-muted-foreground">Chronicle of your farm's neural health insights</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground font-bold neon-glow">
          <Link href="/diagnosis"><Dna className="mr-2 h-4 w-4" /> New Diagnosis</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by plant or disease..." 
            className="pl-10 bg-white/5 border-white/10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-white/10 hover:bg-white/5">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground uppercase tracking-widest text-xs">Accessing Neural Records...</p>
          </div>
        ) : filteredDiagnoses && filteredDiagnoses.length > 0 ? (
          filteredDiagnoses.map((d: any) => (
            <Card key={d.id} className="glass hover:border-primary/30 transition-all group overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden shrink-0">
                    <img 
                      src={d.imageUri} 
                      alt={d.identification?.commonName} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/80 md:from-transparent to-transparent" />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg font-headline">{d.identification?.commonName}</h3>
                        <Badge className={cn(
                          "text-[10px] uppercase font-bold",
                          d.diagnosis?.isHealthy ? "bg-primary text-primary-foreground" : "bg-destructive text-white"
                        )}>
                          {d.diagnosis?.isHealthy ? "Healthy" : "Threat Detected"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> <DiagnosisDate timestamp={d.timestamp} />
                        </span>
                        <span className="h-1 w-1 rounded-full bg-white/10" />
                        <span className="text-primary font-mono">{d.diagnosis?.confidenceScore}% Confidence</span>
                      </div>
                      {!d.diagnosis?.isHealthy && (
                        <div className="flex items-center gap-2 p-2 rounded bg-destructive/5 border border-destructive/10 text-xs text-destructive mt-2">
                          <AlertCircle className="h-3 w-3" />
                          <span className="font-bold">{d.diagnosis?.diseaseName}</span>
                          <span className="text-muted-foreground truncate opacity-70">— {d.diagnosis?.description}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5" asChild>
                          <Link href={`/diagnosis?view=${d.id}`}>
                            Details <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-white/10 hover:text-destructive hover:bg-destructive/10" 
                        onClick={() => handleDelete(d.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="glass border-white/5 flex flex-col items-center justify-center p-20 text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
              <History className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-headline">Neural Records Empty</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">You haven't saved any AI crop diagnoses yet. Run a scan to build your farm's health history.</p>
            </div>
            <Button asChild className="bg-primary text-primary-foreground font-bold neon-glow px-8">
              <Link href="/diagnosis">Start First Diagnosis</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}