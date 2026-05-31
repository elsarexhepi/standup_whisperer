import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary shadow-sm">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-none">
              Standup Whisperer
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Turn messy notes into clean standups
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
