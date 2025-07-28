import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 font-headline text-xl font-bold text-primary">
          <Leaf className="h-7 w-7" />
          <h1>EcoDesign Comparator</h1>
        </div>
      </div>
    </header>
  );
}
