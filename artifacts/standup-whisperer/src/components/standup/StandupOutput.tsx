import { useState } from "react";
import { CheckCircle2, Copy, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { StandupResult } from "@/pages/StandupPage";

interface StandupOutputProps {
  result: StandupResult | null;
  isLoading: boolean;
  error: string | null;
}

interface SectionConfig {
  key: keyof StandupResult;
  label: string;
  icon: React.ReactNode;
  stripe: string;
  dot: string;
  badge: string;
  badgeText: string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: "yesterday",
    label: "Yesterday",
    icon: <Clock className="w-3.5 h-3.5" />,
    stripe: "bg-blue-500",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-600 border-blue-100",
    badgeText: "Completed",
  },
  {
    key: "today",
    label: "Today",
    icon: <ArrowRight className="w-3.5 h-3.5" />,
    stripe: "bg-violet-500",
    dot: "bg-violet-400",
    badge: "bg-violet-50 text-violet-600 border-violet-100",
    badgeText: "In progress",
  },
  {
    key: "blockers",
    label: "Blockers",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    stripe: "bg-amber-400",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-600 border-amber-100",
    badgeText: "Needs attention",
  },
];

function SectionCard({ section, content }: { section: SectionConfig; content: string }) {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const isNoBlockers =
    section.key === "blockers" &&
    lines.length === 1 &&
    /no blockers/i.test(lines[0]);

  return (
    <div className="rounded-xl border border-card-border bg-white overflow-hidden shadow-sm shadow-black/[0.03]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-2.5">
          <span className={`flex items-center justify-center w-6 h-6 rounded-lg ${section.stripe} text-white`}>
            {section.icon}
          </span>
          <span className="text-sm font-semibold text-foreground">{section.label}</span>
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${section.badge}`}>
          {isNoBlockers ? "Clear" : section.badgeText}
        </span>
      </div>

      <ul className="px-4 py-3.5 space-y-2.5">
        {lines.map((line, i) => {
          const text = line.startsWith("- ") ? line.slice(2) : line;
          return (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
              <span className={`mt-[7px] w-1.5 h-1.5 rounded-full ${section.dot} flex-shrink-0 opacity-70`} />
              <span>{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const SlackIcon = () => (
  <svg viewBox="0 0 54 54" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386" />
    <path d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387" />
    <path d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386" />
    <path d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.249m14.336 0v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.249a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387" />
  </svg>
);

function buildPlainText(result: StandupResult): string {
  const fmt = (s: string) =>
    s.split("\n").map((l) => l.trim()).filter(Boolean)
      .map((l) => (l.startsWith("- ") ? l : `- ${l}`)).join("\n");
  return `Yesterday\n${fmt(result.yesterday)}\n\nToday\n${fmt(result.today)}\n\nBlockers\n${fmt(result.blockers)}`;
}

function buildSlackMarkdown(result: StandupResult): string {
  const fmt = (s: string) =>
    s.split("\n").map((l) => l.trim()).filter(Boolean)
      .map((l) => (l.startsWith("- ") ? l : `- ${l}`)).join("\n");
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

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-card-border bg-white shadow-sm shadow-black/[0.04] overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="space-y-2">
            <div className="shimmer h-3.5 w-28" />
            <div className="shimmer h-2.5 w-40" />
          </div>
          <div className="flex gap-2">
            <div className="shimmer h-8 w-28 rounded-lg" />
            <div className="shimmer h-8 w-20 rounded-lg" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          {SECTIONS.map((s) => (
            <div key={s.key} className="rounded-xl border border-card-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center justify-between">
                <div className="shimmer h-3.5 w-20 rounded" />
                <div className="shimmer h-5 w-16 rounded-full" />
              </div>
              <div className="px-4 py-3.5 space-y-2.5">
                <div className="shimmer h-3 w-full" />
                <div className="shimmer h-3 w-4/5" />
                {s.key !== "blockers" && <div className="shimmer h-3 w-3/5" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/25 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-5 flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div className="pt-0.5">
            <h3 className="text-sm font-semibold text-foreground">Generation failed</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{error}</p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Check your <code className="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">OPENAI_API_KEY</code> and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty state ── */
  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white/60 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary/10 border border-primary/10 flex items-center justify-center mb-5 shadow-sm">
            <Sparkles className="w-7 h-7 text-primary/60" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Your standup will appear here</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
            Paste your notes above and click{" "}
            <span className="font-medium text-foreground/70">Generate Standup</span> to get a structured update.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-3 w-full max-w-sm">
            {[
              { color: "bg-blue-500", label: "Yesterday", desc: "What you finished" },
              { color: "bg-violet-500", label: "Today", desc: "What's next" },
              { color: "bg-amber-400", label: "Blockers", desc: "Any impediments" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/60">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-xs font-semibold text-foreground">{item.label}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Result ── */
  return (
    <div className="rounded-2xl border border-card-border bg-white shadow-sm shadow-black/[0.04] overflow-hidden fade-slide-in">
      {/* Result header */}
      <div className="px-5 py-3.5 border-b border-border/60 bg-muted/10 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Ready
          </span>
          <span className="text-sm font-semibold text-foreground">Your standup</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy("slack")}
            className="h-8 px-3 gap-1.5 text-xs font-medium border-border/70 hover:bg-muted/60"
          >
            {copiedType === "slack" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            ) : (
              <SlackIcon />
            )}
            {copiedType === "slack" ? "Copied!" : "Copy for Slack"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy("plain")}
            className="h-8 px-3 gap-1.5 text-xs font-medium border-border/70 hover:bg-muted/60"
          >
            {copiedType === "plain" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copiedType === "plain" ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Section cards */}
      <div className="p-4 space-y-3">
        {SECTIONS.map((section) => (
          <SectionCard key={section.key} section={section} content={result[section.key]} />
        ))}
      </div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" />
    </svg>
  );
}
