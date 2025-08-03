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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { SimulationState, CalculationResults, OptimizationOutput } from '@/types';
import { optimizeDesign } from '@/ai/flows/optimize-design';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DropdownMenuItem } from './ui/dropdown-menu';


interface OptimizationDialogProps {
  simulationState: SimulationState;
  calculationResults: CalculationResults;
  onStateChange: (newState: Partial<SimulationState>) => void;
  isMenuItem?: boolean;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
const formatNumber = (value: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);


export function OptimizationDialog({ simulationState, calculationResults, onStateChange, isMenuItem }: OptimizationDialogProps) {
  const [open, setOpen] = useState(false);
  const [maxSurcout, setMaxSurcout] = useState<number | string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizationOutput | null>(null);
  const { toast } = useToast();

  const isEcoCheaper = calculationResults.cout.coutGlobalEcoAjuste <= calculationResults.cout.totalClassique;

  const handleOpenTrigger = (e: React.MouseEvent) => {
    setResult(null);
    setMaxSurcout('');
    if (isEcoCheaper) {
      e.preventDefault();
      toast({
        title: 'Optimisation non nécessaire',
        description: 'Le design "Éco-conception" est déjà plus économique que le design classique. Vous réalisez déjà des économies !',
        variant: 'default',
        duration: 5000,
      });
    } else {
      // Allow dialog to open by not preventing default
    }
  };

  const handleOptimization = async () => {
    const surcoutValue = Number(maxSurcout);
    if (isNaN(surcoutValue) || surcoutValue < 0) {
      toast({
        title: 'Entrée invalide',
        description: 'Veuillez saisir un pourcentage de surcoût valide.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);

    try {
      const optimizationResult = await optimizeDesign({
        simulationState,
        maxSurcoutPercentage: surcoutValue,
      });
      setResult(optimizationResult);
      // Automatically apply the new percentages to the main state
      onStateChange(optimizationResult.optimizedPercentages);
    } catch (error) {
      console.error('Error during optimization:', error);
      toast({
        title: 'Erreur d\'optimisation',
        description: 'Impossible de calculer le scénario optimisé. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExportPDF = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const pageMargin = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - (pageMargin * 2);

    doc.setFontSize(18);
    doc.text('Rapport d\'Optimisation de Design', pageMargin, 22);
    
    doc.setFontSize(12);
    doc.text(`Basé sur un surcoût maximum admissible de ${maxSurcout}%.`, pageMargin, 32);
    
    doc.setFontSize(10);
    const explanationLines = doc.splitTextToSize(result.explanation, textWidth);
    doc.text(explanationLines, pageMargin, 42);

    const lastTextY = 42 + (explanationLines.length * 5); // Approximate height of the text block
    
    (doc as any).autoTable({
        startY: lastTextY + 10,
        head: [['Indicateur', 'Valeur']],
        body: [
            ['Coût Total Optimisé', formatCurrency(result.optimizedMetrics.coutTotal)],
            ['Empreinte Carbone Optimisée', `${formatNumber(result.optimizedMetrics.carboneTotal)} tCO₂`],
            ['Surcoût vs. Classique', `${formatCurrency(result.optimizedMetrics.surcout)}`],
            ['Économie Carbone vs. Classique', `${formatNumber(result.optimizedMetrics.economieCarbone)} tCO₂`],
        ],
        theme: 'striped'
    });
    
    (doc as any).autoTable({
        startY: (doc as any).autoTable.previous.finalY + 10,
        head: [['Matériau / Méthode Éco', 'Pourcentage Recommandé']],
        body: Object.entries(result.optimizedPercentages).map(([key, value]) => [key.replace('pctEco', ''), `${formatNumber(value)}%`]),
        theme: 'grid'
    });
    
    doc.save('rapport_optimisation_design.pdf');
  }

  const TriggerComponent = isMenuItem ? DropdownMenuItem : Button;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TriggerComponent
          onClick={handleOpenTrigger}
          onSelect={isEcoCheaper ? (e) => e.preventDefault() : undefined}
          className={isMenuItem ? 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50' : `py-3 text-base text-foreground font-semibold shadow-md transition-all
                     bg-purple-200 dark:bg-purple-800
                     hover:bg-purple-300 dark:hover:bg-purple-700
                     text-purple-900 dark:text-purple-100
                     data-[state=active]:scale-105`}
        >
          <Sparkles className="mr-2" />
          Optimisation du design
        </TriggerComponent>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Optimisation du Design</DialogTitle>
          <DialogDescription>
            Trouvez la meilleure combinaison pour réduire votre empreinte carbone tout en respectant votre budget.
          </DialogDescription>
        </DialogHeader>

        {!result && !isLoading && (
            <div className="grid gap-4 py-4">
              <p>
                Le scénario "Éco-conception" complet représente un surcoût de <strong>{formatCurrency(calculationResults.cout.surcout)}</strong>.
              </p>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxSurcout" className="text-right col-span-3">
                  Quel est le pourcentage de surcoût maximum admissible pour ce projet ?
                </Label>
                <div className="col-span-1 flex items-center">
                    <Input
                      id="maxSurcout"
                      type="number"
                      value={maxSurcout}
                      onChange={(e) => setMaxSurcout(e.target.value)}
                      className="text-right"
                      placeholder="Ex: 5"
                    />
                    <span className="ml-2 font-semibold">%</span>
                </div>
              </div>
            </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4">Optimisation en cours...</p>
          </div>
        )}
        
        {result && (
            <div className='space-y-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Scénario Optimisé</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{result.explanation}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="font-semibold">Coût total optimisé:</div>
                            <div>{formatCurrency(result.optimizedMetrics.coutTotal)}</div>
                            <div className="font-semibold">Surcoût vs. Classique:</div>
                            <div>{formatCurrency(result.optimizedMetrics.surcout)}</div>
                            <div className="font-semibold">Empreinte carbone optimisée:</div>
                            <div>{formatNumber(result.optimizedMetrics.carboneTotal)} tCO₂</div>
                            <div className="font-semibold">Économie carbone vs. Classique:</div>
                            <div className="text-green-600 font-bold">{formatNumber(result.optimizedMetrics.economieCarbone)} tCO₂</div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Répartition Éco-Matériaux Suggérée</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={Object.entries(result.optimizedPercentages).map(([name, value]) => ({ name: name.replace('pctEco', ''), value }))} layout="vertical" margin={{ left: 30, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" unit="%" domain={[0, 100]} />
                                <YAxis type="category" dataKey="name" width={80} />
                                <Tooltip formatter={(value) => `${formatNumber(Number(value))}%`} />
                                <Bar dataKey="value" name="Pourcentage" fill="hsl(var(--primary))" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        )}


        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
          {!result && !isLoading && (
              <Button onClick={handleOptimization} disabled={isLoading || !maxSurcout}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isLoading ? 'Calcul en cours...' : 'Lancer l\'optimisation'}
                </Button>
          )}
          {result && (
              <Button onClick={handleExportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le Rapport
              </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
