import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
          <Leaf className="h-6 w-6" />
          <h1>EcoDesign Comparator</h1>
        </div>
      </div>
    </header>
  );
}
