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
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Building, Phone, Mail, Pin } from 'lucide-react';
import { findNearbyCementPlants, FindCementPlantsOutput } from '@/ai/flows/find-cement-plants';
import { DropdownMenuItem } from './ui/dropdown-menu';

interface CementPlantsDialogProps {
  projectLocation: string;
  projectGpsCoordinates: string;
}

export function CementPlantsDialog({ projectLocation, projectGpsCoordinates }: CementPlantsDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FindCementPlantsOutput | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    const location = projectGpsCoordinates || projectLocation;
    if (!location) {
      toast({
        title: 'Localisation manquante',
        description: "Veuillez renseigner la localisation ou les coordonnées GPS du projet dans l'onglet 'Données d'Entrée'.",
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);

    try {
      const searchResult = await findNearbyCementPlants({ location });
      setResult(searchResult);
    } catch (error) {
      console.error('Erreur lors de la recherche de cimenteries:', error);
      toast({
        title: 'Erreur de recherche',
        description: "Impossible de trouver les cimenteries à proximité. Veuillez réessayer.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset state when dialog is closed
  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setResult(null);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Recherche cimenteries de proximité
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Recherche de Cimenteries à Proximité</DialogTitle>
          <DialogDescription>
            Trouvez les cimenteries les plus proches de votre projet pour optimiser la logistique et réduire les coûts de transport.
          </DialogDescription>
        </DialogHeader>

        {!result && !isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
              <p>
                L'IA va rechercher sur internet les 5 cimenteries les plus proches de votre projet situé à :
                <br />
                <strong className="text-primary">{projectGpsCoordinates || projectLocation || "Localisation non définie"}</strong>
              </p>
              <Button onClick={handleSearch} disabled={!projectGpsCoordinates && !projectLocation}>
                  <Search className="mr-2 h-4 w-4" />
                  Lancer la recherche
              </Button>
            </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center p-8 space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Recherche en cours...</p>
          </div>
        )}
        
        {result && (
            <div className='space-y-4 max-h-[60vh] overflow-y-auto pr-2'>
              {result.plants.length > 0 ? (
                <ul className="space-y-4">
                  {result.plants.map((plant, index) => (
                    <li key={index} className="border rounded-lg p-4 space-y-2">
                       <div className="flex items-center justify-between">
                         <h3 className="font-semibold text-lg flex items-center gap-2"><Building className="text-primary"/>{plant.name}</h3>
                         <div className="font-bold text-primary">{plant.distance} km</div>
                       </div>
                       <p className="text-sm text-muted-foreground flex items-center gap-2"><Pin size={16}/>{plant.address}</p>
                       <div className="flex items-center gap-6 text-sm">
                          {plant.phone && <div className="flex items-center gap-2"><Phone size={16}/> {plant.phone}</div>}
                          {plant.email && <div className="flex items-center gap-2"><Mail size={16}/> {plant.email}</div>}
                       </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center p-8">Aucune cimenterie n'a été trouvée dans un rayon de 50km.</p>
              )}
            </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
          {result && (
             <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Nouvelle recherche
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
