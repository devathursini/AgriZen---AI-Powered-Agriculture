
"use client";

import { useState, useRef } from "react";
import { 
  Camera, 
  Upload, 
  Dna, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  X,
  RefreshCw,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { neuralCropDiagnosisRecommendations, type NeuralCropDiagnosisRecommendationsOutput } from "@/ai/flows/neural-crop-diagnosis-recommendations";
import { cn } from "@/lib/utils";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { useToast } from "@/hooks/use-toast";

export default function DiagnosisPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<NeuralCropDiagnosisRecommendationsOutput | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUri = canvasRef.current.toDataURL("image/jpeg");
        setImage(dataUri);
        setShowCamera(false);
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const diagnosis = await neuralCropDiagnosisRecommendations({
        photoDataUri: image,
      });
      setResult(diagnosis);
    } catch (err: any) {
      console.error(err);
      const isApiKeyError = err.message?.includes("API key") || err.message?.includes("400");
      toast({
        variant: "destructive",
        title: isApiKeyError ? "AI Configuration Required" : "Analysis Failed",
        description: isApiKeyError 
          ? "The Gemini API key is missing or invalid. Please add a valid GEMINI_API_KEY to your .env file."
          : "Please ensure your image is clear and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async () => {
    if (!result || !user || !db) return;
    setSaving(true);

    const diagnosisData = {
      userId: user.uid,
      imageUri: image,
      identification: result.identification,
      diagnosis: result.diagnosis,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp()
    };

    addDoc(collection(db, "diagnoses"), diagnosisData)
      .then(() => {
        toast({
          title: "Report Saved",
          description: "Diagnosis has been stored in your history."
        });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: "diagnoses",
          operation: "create",
          requestResourceData: diagnosisData,
        });
        errorEmitter.emit("permission-error", permissionError);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-4xl font-bold text-foreground">
          Neural <span className="text-primary">Vision Diagnosis</span>
        </h1>
        <p className="text-muted-foreground">High-precision AI analysis for crop diseases and pests</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="glass neon-border overflow-hidden relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Camera className="h-5 w-5 text-primary" /> Capture or Upload
              </CardTitle>
              <CardDescription>Provide a clear photo of the leaf or crop for best results</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-8">
              {!image && !showCamera ? (
                <div className="flex flex-col items-center gap-6 py-12">
                  <div className="flex gap-4">
                    <Button onClick={startCamera} className="bg-primary text-primary-foreground font-bold h-14 px-8 neon-glow">
                      <Camera className="mr-2 h-5 w-5" /> Open Camera
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5">
                        <Upload className="mr-2 h-5 w-5" /> Upload Photo
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Supports JPEG, PNG, WEBP</p>
                </div>
              ) : showCamera ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
                  <div className="scanline" />
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                    <Button onClick={capturePhoto} className="bg-primary text-primary-foreground rounded-full h-16 w-16 p-0 shadow-lg neon-glow">
                      <Camera className="h-8 w-8" />
                    </Button>
                    <Button onClick={() => setShowCamera(false)} variant="destructive" className="rounded-full h-16 w-16 p-0">
                      <X className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full space-y-4">
                  <div className="relative aspect-video rounded-xl overflow-hidden ring-1 ring-white/10 group">
                    <img src={image!} alt="To diagnose" className="w-full h-full object-cover" />
                    {!loading && !result && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button onClick={reset} variant="destructive">Remove Image</Button>
                      </div>
                    )}
                  </div>
                  {!result && (
                    <Button 
                      onClick={runAnalysis} 
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground font-bold h-14 neon-glow"
                    >
                      {loading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Neural Processing...</>
                      ) : (
                        <><RefreshCw className="mr-2 h-5 w-5" /> Run AI Diagnosis</>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
            <canvas ref={canvasRef} className="hidden" />
          </Card>

          {loading && (
            <Card className="glass border-primary/20 animate-pulse">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Dna className="h-8 w-8 text-primary animate-spin" />
                  <div className="space-y-1">
                    <p className="font-bold">Analyzing cellular structures...</p>
                    <p className="text-xs text-muted-foreground">Identifying phenotype markers and disease vectors</p>
                  </div>
                </div>
                <Progress value={66} className="h-2 bg-white/5" />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <Card className="glass neon-border border-primary/30">
                <CardHeader className="border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="font-headline text-2xl">Analysis Report</CardTitle>
                      <CardDescription>Generated by Veridian Vision Engine</CardDescription>
                    </div>
                    <Badge className={cn(
                      "px-4 py-1 font-bold",
                      result.diagnosis.isHealthy ? "bg-primary text-primary-foreground" : "bg-destructive text-white"
                    )}>
                      {result.diagnosis.isHealthy ? "HEALTHY" : "THREAT DETECTED"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-xl bg-white/5 space-y-1 border border-white/5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Identified Plant</p>
                      <p className="font-bold text-lg">{result.identification.commonName}</p>
                      <p className="text-xs italic text-muted-foreground">{result.identification.latinName}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 space-y-1 border border-white/5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Confidence Score</p>
                      <p className="font-bold text-lg text-primary">{result.diagnosis.confidenceScore}%</p>
                      <Progress value={result.diagnosis.confidenceScore} className="h-1 bg-white/10" />
                    </div>
                  </div>

                  {!result.diagnosis.isHealthy && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                        <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-1" />
                        <div className="space-y-1">
                          <p className="font-bold text-lg text-destructive">{result.diagnosis.diseaseName}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {result.diagnosis.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-primary" /> Recommended Treatments
                        </h4>
                        <div className="grid gap-2">
                          {result.diagnosis.treatmentSuggestions.map((s, i) => (
                            <div key={i} className="flex gap-3 text-sm p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                              <span className="text-primary font-bold">0{i+1}.</span>
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex gap-4">
                    <Button variant="outline" className="flex-1 border-white/10" onClick={reset}>
                      <RefreshCw className="mr-2 h-4 w-4" /> New Scan
                    </Button>
                    <Button 
                      className="flex-1 bg-primary text-primary-foreground font-bold neon-glow"
                      onClick={saveReport}
                      disabled={saving || !user}
                    >
                      {saving ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                      ) : (
                        <><FileText className="mr-2 h-4 w-4" /> Save Report</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-accent/20">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase text-accent tracking-widest font-headline">Expert Advice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm italic leading-relaxed text-muted-foreground">
                    "Based on current satellite weather forecasts, humidity in your region will rise by 15% tomorrow. This might accelerate the spread of the detected condition. Consider applying organic fungicides immediately."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                       <Dna className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Dr. Elena Veridian</p>
                      <p className="text-[10px] text-muted-foreground">Lead Plant Pathologist</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="glass border-white/5 flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                <Dna className="h-10 w-10 text-muted-foreground opacity-20" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-headline">Diagnosis System Idle</h3>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm">Upload an image to trigger the neural processing engine and receive deep plant insights.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
