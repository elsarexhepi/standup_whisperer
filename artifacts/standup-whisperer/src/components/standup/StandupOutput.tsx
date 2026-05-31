import { useState } from "react";
import { CheckCircle2, Copy, AlertCircle, Clock, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { StandupResult } from "@/pages/StandupPage";

interface StandupOutputProps {
  result: StandupResult | null;
  isLoading: boolean;
  error: string | null;
}

function SectionCard({
  icon,
  title,
  content,
  accentClass,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  accentClass: string;
}) {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="bg-card rounded-xl border border-card-border p-4 space-y-2.5">
      <div className="flex items-center gap-2">
        <span className={`flex items-center justify-center w-6 h-6 rounded-md ${accentClass}`}>
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {lines.map((line, i) => {
          const text = line.startsWith("- ") ? line.slice(2) : line;
          return (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/85 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
              <span>{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function buildPlainText(result: StandupResult): string {
  const fmt = (section: string) =>
    section
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => (l.startsWith("- ") ? l : `- ${l}`))
      .join("\n");

  return `*Yesterday*\n${fmt(result.yesterday)}\n\n*Today*\n${fmt(result.today)}\n\n*Blockers*\n${fmt(result.blockers)}`;
}

function buildSlackMarkdown(result: StandupResult): string {
  const fmt = (section: string) =>
    section
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => (l.startsWith("- ") ? l : `- ${l}`))
      .join("\n");

  return `:calendar: *Yesterday*\n${fmt(result.yesterday)}\n\n:dart: *Today*\n${fmt(result.today)}\n\n:warning: *Blockers*\n${fmt(result.blockers)}`;
}

export default function StandupOutput({ result, isLoading, error }: StandupOutputProps) {
  const { toast } = useToast();
  const [copiedType, setCopiedType] = useState<"plain" | "slack" | null>(null);

  const handleCopy = async (type: "plain" | "slack") => {
    if (!result) return;
    const text = type === "slack" ? buildSlackMarkdown(result) : buildPlainText(result);
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast({
      title: type === "slack" ? "Copied for Slack" : "Copied to clipboard",
      description:
        type === "slack"
          ? "Paste directly into Slack — emoji and bold formatting included."
          : "Plain text copied. Paste anywhere.",
    });
    setTimeout(() => setCopiedType(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="h-4 w-32 rounded shimmer" />
          <div className="h-3 w-48 rounded shimmer mt-1.5" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/40 rounded-xl p-4 space-y-2">
              <div className="h-4 w-24 rounded shimmer" />
              <div className="h-3 w-full rounded shimmer" />
              <div className="h-3 w-3/4 rounded shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-2xl border border-destructive/30 shadow-sm overflow-hidden">
        <div className="px-4 py-4 flex items-start gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-destructive/10 flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Generation failed</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Check your OpenAI API key and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-card rounded-2xl border border-dashed border-border shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
            <Hash className="w-7 h-7 text-accent-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Your standup will appear here</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
            Paste your notes above and click "Generate Standup" to get a structured update.
          </p>
          <div className="mt-6 flex flex-col gap-1.5 items-start text-xs text-muted-foreground bg-muted/50 rounded-xl px-4 py-3">
            <span className="font-medium text-foreground text-xs mb-0.5">Output sections:</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Yesterday — what you accomplished</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Today — what you're working on</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Blockers — any impediments</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Your Standup</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Ready to share with your team</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy("slack")}
            className="gap-1.5 text-xs h-8 px-3"
          >
            {copiedType === "slack" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <svg viewBox="0 0 54 54" className="w-3.5 h-3.5" fill="currentColor">
                <path d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386"/>
                <path d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387"/>
                <path d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386"/>
                <path d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.249m14.336 0v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.249a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387"/>
              </svg>
            )}
            {copiedType === "slack" ? "Copied!" : "Copy for Slack"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy("plain")}
            className="gap-1.5 text-xs h-8 px-3"
          >
            {copiedType === "plain" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copiedType === "plain" ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <SectionCard
          icon={<Clock className="w-3.5 h-3.5 text-blue-600" />}
          title="Yesterday"
          content={result.yesterday}
          accentClass="bg-blue-100 text-blue-600"
        />
        <SectionCard
          icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          title="Today"
          content={result.today}
          accentClass="bg-emerald-100 text-emerald-600"
        />
        <SectionCard
          icon={<AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
          title="Blockers"
          content={result.blockers}
          accentClass="bg-amber-100 text-amber-600"
        />
      </div>
    </div>
  );
}
