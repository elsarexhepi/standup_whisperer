import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border/60 bg-white/70 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-md shadow-primary/30">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Standup Whisperer
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/70 border border-border/60 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
          AI-powered
        </span>
      </div>
    </header>
  );
}
