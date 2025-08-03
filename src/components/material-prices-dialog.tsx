'use client';

import { useState, useMemo } from 'react';
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
import { Loader2, Search, Tag, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { findMaterialPrices, FindMaterialPricesOutput } from '@/ai/flows/find-material-prices';
import { DropdownMenuItem } from './ui/dropdown-menu';
import type { SimulationState } from '@/types';
import { betonBasCarboneOptions, acierOptions, aluminiumOptions } from '@/lib/data';

interface MaterialPricesDialogProps {
  simulationState: SimulationState;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);

export function MaterialPricesDialog({ simulationState }: MaterialPricesDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FindMaterialPricesOutput | null>(null);
  const { toast } = useToast();

  const materialsToSearch = useMemo(() => {
    const materials = [];
    if (simulationState.volumeBeton > 0) {
      const betonName = betonBasCarboneOptions.find(o => o.empreinte === simulationState.betonBasCarboneEmpreinte)?.name || 'Béton bas carbone';
      materials.push({ materialName: 'Béton classique', unit: 'm³' });
      materials.push({ materialName: betonName, unit: 'm³' });
    }
    if (simulationState.poidsAcier > 0) {
      const acierName = acierOptions.find(o => o.empreinte === simulationState.empreinteAcierBasCarbone)?.name || 'Acier bas carbone';
      materials.push({ materialName: 'Acier classique', unit: 'tonne' });
      materials.push({ materialName: acierName, unit: 'tonne' });
    }
    if (simulationState.poidsCuivre > 0) {
        materials.push({ materialName: 'Cuivre classique', unit: 'tonne' });
        materials.push({ materialName: 'Cuivre recyclé', unit: 'tonne' });
    }
    if (simulationState.poidsAluminium > 0) {
        const aluName = aluminiumOptions.find(o => o.empreinte === simulationState.empreinteAluminiumBasCarbone)?.name || 'Aluminium bas carbone';
        materials.push({ materialName: 'Aluminium classique', unit: 'tonne' });
        materials.push({ materialName: aluName, unit: 'tonne' });
    }
    if (simulationState.volumeEnrobes > 0) {
        materials.push({ materialName: 'Enrobé à chaud', unit: 'm³' });
        materials.push({ materialName: 'Enrobé à froid', unit: 'm³' });
    }
    return materials;
  }, [simulationState]);

  const handleSearch = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const searchResult = await findMaterialPrices({ materials: materialsToSearch });
      setResult(searchResult);
    } catch (error) {
      console.error('Erreur lors de la recherche de prix:', error);
      toast({
        title: 'Erreur de recherche',
        description: "Impossible de trouver les prix des matériaux. Veuillez réessayer.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
            Recherche prix matériaux sélectionnés
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Recherche des Prix des Matériaux</DialogTitle>
          <DialogDescription>
            Trouvez les prix moyens actualisés pour les matériaux de votre projet sur des sites de fournisseurs professionnels.
          </DialogDescription>
        </DialogHeader>

        {!result && !isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
              <p className='mb-4'>
                L'IA va rechercher les prix pour les matériaux suivants :
              </p>
              <ul className="list-disc list-inside bg-muted/50 p-4 rounded-md">
                 {materialsToSearch.map(m => <li key={m.materialName}>{m.materialName}</li>)}
              </ul>
              <Button onClick={handleSearch} disabled={materialsToSearch.length === 0}>
                  <Search className="mr-2 h-4 w-4" />
                  {materialsToSearch.length > 0 ? 'Lancer la recherche' : 'Aucun matériau à rechercher'}
              </Button>
            </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center p-8 space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Recherche des prix en cours...</p>
          </div>
        )}
        
        {result && (
            <div className='space-y-4 max-h-[60vh] overflow-y-auto pr-2'>
              {result.results.length > 0 ? (
                <ul className="space-y-4">
                  {result.results.map((item, index) => (
                    <li key={index} className="border rounded-lg p-4 space-y-3">
                       <div className="flex items-center justify-between">
                         <h3 className="font-semibold text-lg flex items-center gap-2"><Tag className="text-primary"/>{item.materialName}</h3>
                         <div className="font-bold text-primary text-lg">{formatCurrency(item.averagePrice)} / {item.unit}</div>
                       </div>
                       <div className="space-y-2 pl-2">
                         <h4 className='font-medium text-sm flex items-center gap-2'><LinkIcon size={16}/> Sources</h4>
                         <ul className='list-disc list-inside text-sm text-muted-foreground'>
                            {item.sources.map((source, s_idx) => (
                                <li key={s_idx}>
                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className='hover:text-primary underline flex items-center gap-1'>
                                        {source.name} <ExternalLink size={12}/>
                                    </a>
                                </li>
                            ))}
                         </ul>
                       </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center p-8">Aucun prix n'a pu être trouvé pour les matériaux spécifiés.</p>
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
