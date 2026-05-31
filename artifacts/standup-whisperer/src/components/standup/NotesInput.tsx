import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesInputProps {
  notes: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
  hasResult: boolean;
}

const PLACEHOLDER = `Paste your messy notes here…

Examples:
- worked on the auth bug, finally fixed the JWT token expiry issue blocking login
- long sync with design team about the new dashboard layout
- tomorrow: review PR #342 and start the user settings page
- still waiting on backend API for notifications — asked Jake, no reply yet
- deployed hotfix to staging`;

export default function NotesInput({
  notes,
  onChange,
  onGenerate,
  onClear,
  isLoading,
  hasResult,
}: NotesInputProps) {
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <div className="rounded-2xl border border-card-border bg-white shadow-sm shadow-black/[0.04] overflow-hidden transition-shadow duration-200 focus-within:shadow-md focus-within:shadow-primary/[0.08] focus-within:border-primary/30">

      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Your notes</h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Bullet points, stream of consciousness, Slack threads — anything goes
          </p>
        </div>
        {notes && (
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground/70 mt-0.5">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        disabled={isLoading}
        className="notes-textarea w-full min-h-[220px] px-5 py-2 text-sm text-foreground bg-white resize-none placeholder:text-muted-foreground/45 disabled:opacity-50 disabled:cursor-not-allowed leading-[1.7] transition-all duration-150"
        style={{ fontFamily: "inherit" }}
      />

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={isLoading || (!notes && !hasResult)}
          className="h-8 px-3 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </Button>

        <Button
          onClick={onGenerate}
          disabled={isLoading || !notes.trim()}
          className="h-9 px-5 gap-2 text-sm font-medium bg-gradient-to-b from-primary to-primary/90 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:brightness-105 transition-all duration-150 disabled:opacity-40 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Standup
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
