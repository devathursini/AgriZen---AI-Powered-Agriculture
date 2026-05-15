"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Mic, 
  Globe, 
  MoreHorizontal,
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { veridianAIAssistantChatbot } from "@/ai/flows/veridian-ai-assistant-chatbot";
import { cn } from "@/lib/utils";

type Message = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await veridianAIAssistantChatbot({
        query: input,
        history: messages
      });
      const modelMessage: Message = { role: 'model', parts: [{ text: response.response }] };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="font-headline text-4xl font-bold text-foreground">
          Veridian <span className="text-primary">Assistant</span>
        </h1>
        <p className="text-muted-foreground">Context-aware AI Agronomist in Tamil & English</p>
      </div>

      <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden neon-border">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <Bot className="h-20 w-20 text-primary relative" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-bold font-headline">Welcome to Veridian IQ</h3>
                <p className="text-muted-foreground">I can help you with crop disease identification, irrigation schedules, market trends, and more. Try asking something like:</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Tomato leaf turning yellow",
                  "Organic pest control for rice",
                  "Market price trend for wheat",
                  "Best fertilizer for corn in clay soil"
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-left hover:border-primary/50 hover:bg-white/10 transition-all group flex items-center justify-between"
                  >
                    {prompt}
                    <Plus className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-4",
              msg.role === 'user' ? "flex-row-reverse" : ""
            )}>
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center border shrink-0",
                msg.role === 'model' ? "bg-primary/10 border-primary/20" : "bg-white/5 border-white/10"
              )}>
                {msg.role === 'model' ? <Bot className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-muted-foreground" />}
              </div>
              <div className={cn(
                "max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed",
                msg.role === 'model' ? "bg-white/5 text-foreground" : "bg-primary text-primary-foreground font-medium"
              )}>
                {msg.parts[0].text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex gap-2">
                <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background/50 border-t border-white/5">
          <div className="relative flex items-center gap-4 max-w-4xl mx-auto">
            <div className="flex gap-2">
               <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                 <Mic className="h-5 w-5" />
               </Button>
               <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                 <Globe className="h-5 w-5" />
               </Button>
            </div>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Veridian about your farm..."
              className="flex-1 bg-white/5 border-white/10 focus-visible:ring-primary h-12"
            />
            <Button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground h-12 px-6 font-bold neon-glow"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-3 flex justify-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">AI can make mistakes. Verify critical data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}