import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import NotesInput from "@/components/standup/NotesInput";
import StandupOutput from "@/components/standup/StandupOutput";
import Header from "@/components/standup/Header";

export interface StandupResult {
  yesterday: string;
  today: string;
  blockers: string;
}

export default function StandupPage() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<StandupResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!notes.trim()) {
      toast({
        title: "Notes required",
        description: "Please paste some notes before generating.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const response = await fetch(`${base}/api/standup/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate standup");
      }

      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setNotes("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-mesh">
      <Header />

      <main className="max-w-3xl mx-auto px-5 pt-10 pb-16 sm:px-6">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Turn messy notes into{" "}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              clean standups
            </span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-md mx-auto">
            Paste anything from your workday — the AI organises it into Yesterday, Today, and Blockers in seconds.
          </p>
        </div>

        <div className="space-y-5">
          <NotesInput
            notes={notes}
            onChange={setNotes}
            onGenerate={handleGenerate}
            onClear={handleClear}
            isLoading={isLoading}
            hasResult={!!result}
          />
          <StandupOutput
            result={result}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}
