
"use client";

import { useMemo } from "react";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Calendar, 
  Search,
  Filter,
  Trash2,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, query, where, orderBy, deleteDoc, doc } from "firebase/firestore";
import { format } from "date-fns";

export default function ReportsPage() {
  const { user } = useUser();
  const db = useFirestore();

  const reportsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "reports"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
  }, [db, user]);

  const { data: reports, loading } = useCollection(reportsQuery);

  const handleDelete = async (reportId: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "reports", reportId));
    } catch (err) {
      console.error("Failed to delete report:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-4xl font-bold text-foreground">
          Farm <span className="text-primary">Intelligence Reports</span>
        </h1>
        <p className="text-muted-foreground">History of AI-generated agricultural analysis and PDF exports</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports by crop or date..." className="pl-10 bg-white/5 border-white/10" />
        </div>
        <Button variant="outline" className="border-white/10 hover:bg-white/5">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground uppercase tracking-widest text-xs">Accessing Neural Archives...</p>
          </div>
        ) : reports && reports.length > 0 ? (
          reports.map((report: any) => (
            <Card key={report.id} className="glass hover:border-primary/30 transition-all group">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg font-headline">Farm Report: {report.cropType}</h3>
                        <Badge variant="outline" className="text-[10px] uppercase border-primary/20 text-primary">AI Generated</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {format(new Date(report.timestamp), 'PPP p')}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-white/10" />
                        <span>PDF Format</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild className="border-white/10 hover:bg-white/5">
                      <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> View
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" className="border-white/10 hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(report.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="glass border-white/5 flex flex-col items-center justify-center p-20 text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
              <FileText className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-headline">No Reports Found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">Generate your first comprehensive farm report from the dashboard to see it here.</p>
            </div>
            <Button asChild className="bg-primary text-primary-foreground font-bold neon-glow px-8">
              <a href="/">Go to Dashboard</a>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
