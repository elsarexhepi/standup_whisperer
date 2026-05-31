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

const PLACEHOLDER = `Paste your messy notes here...

Examples:
- worked on the auth bug, finally fixed the JWT token expiry issue that was blocking login
- had a long sync with design team about the new dashboard
- tomorrow need to review PR #342 and start the user settings page
- still waiting on backend API for the notification feature, asked Jake but no response yet
- deployed hotfix to staging`;

export default function NotesInput({
  notes,
  onChange,
  onGenerate,
  onClear,
  isLoading,
  hasResult,
}: NotesInputProps) {
  const charCount = notes.length;
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Your Notes</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Paste anything — bullet points, stream of consciousness, Slack messages
          </p>
        </div>
        {notes && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {wordCount} words · {charCount} chars
          </span>
        )}
      </div>

      <div className="relative">
        <textarea
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder={PLACEHOLDER}
          disabled={isLoading}
          className="w-full min-h-[240px] px-4 py-4 text-sm text-foreground bg-card resize-none outline-none placeholder:text-muted-foreground/60 disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed"
          style={{ fontFamily: "inherit" }}
        />
      </div>

      <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={isLoading || (!notes && !hasResult)}
          className="text-muted-foreground hover:text-foreground gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </Button>

        <Button
          onClick={onGenerate}
          disabled={isLoading || !notes.trim()}
          className="gap-2 px-5 shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
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
