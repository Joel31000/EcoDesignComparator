'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { projectTypes } from '@/lib/data';
import { suggestDataResources, SuggestDataResourcesInput } from '@/ai/flows/suggest-data-resources';
import { Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function AISuggestion() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<SuggestDataResourcesInput>({
    missingInformation: '',
    projectType: 'Travaux',
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!input.missingInformation) {
      toast({
        title: 'Information manquante',
        description: 'Veuillez décrire les données que vous recherchez.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestDataResources(input);
      setSuggestions(result.suggestedResources);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les suggestions. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Besoin d'aide pour trouver des données ?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Suggestion de Sources de Données par IA</DialogTitle>
          <DialogDescription>
            Décrivez les données manquantes pour votre simulation, et notre assistant IA vous proposera des sources pertinentes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="missingInformation" className="text-right">
              Données
            </Label>
            <Input
              id="missingInformation"
              value={input.missingInformation}
              onChange={(e) => setInput({ ...input, missingInformation: e.target.value })}
              className="col-span-3"
              placeholder="Ex: Empreinte carbone du béton de chanvre"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectType" className="text-right">
              Type Projet
            </Label>
            <div className="col-span-3">
              <Select value={input.projectType} onValueChange={(value) => setInput({ ...input, projectType: value })}>
                <SelectTrigger id="projectType">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4">Recherche des sources...</p>
          </div>
        )}
        {suggestions.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h4 className="mb-2 font-semibold">Sources Suggérées :</h4>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {suggestions.map((s, i) => (
                  <li key={i} className="text-muted-foreground">
                    <a href={s} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
                        {s}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? 'Recherche...' : 'Obtenir des suggestions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
