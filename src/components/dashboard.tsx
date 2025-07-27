
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { DataInputTab } from "./data-input-tab";
import { ComparisonTab } from "./comparison-tab";
import { SynthesisTab } from "./synthesis-tab";
import type { SimulationState, CalculationResults } from "@/types";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { OptimizationDialog } from './optimization-dialog';

interface DashboardProps {
  state: SimulationState;
  onStateChange: (newState: Partial<SimulationState>) => void;
  onSliderChange: (key: keyof SimulationState, value: number[]) => void;
  results: CalculationResults;
}

export function Dashboard({ state, onStateChange, onSliderChange, results }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('data-input');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportToPDF = async () => {
    setIsExporting(true);
    const input = document.getElementById(activeTab);
    if (input) {
      try {
        const canvas = await html2canvas(input, {
          scale: 2, // Augmente la résolution
          useCORS: true,
          logging: false,
          backgroundColor: null, // Fond transparent pour que le CSS du thème s'applique
        });
        const imgData = canvas.toDataURL('image/png');
        
        // orientation 'l' pour paysage
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        
        let newImgWidth = pdfWidth;
        let newImgHeight = newImgWidth / ratio;

        if (newImgHeight > pdfHeight) {
          newImgHeight = pdfHeight;
          newImgWidth = newImgHeight * ratio;
        }

        const x = (pdfWidth - newImgWidth) / 2;
        const y = (pdfHeight - newImgHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, newImgWidth, newImgHeight);
        pdf.save(`export-${activeTab}.pdf`);
      } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
      } finally {
        setIsExporting(false);
      }
    } else {
      console.error("Element à exporter non trouvé");
      setIsExporting(false);
    }
  };

  return (
    <Tabs defaultValue="data-input" className="w-full" onValueChange={setActiveTab}>
      <div className="relative flex items-center justify-center mb-8">
        <TabsList className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-4 p-2 h-auto gap-2 bg-transparent">
          <TabsTrigger 
            value="data-input" 
            className="py-3 text-base text-foreground font-semibold shadow-md transition-all
                       bg-[hsl(var(--tab-1))] 
                       data-[state=active]:bg-[hsl(var(--tab-1-active))] data-[state=active]:text-primary-foreground data-[state=active]:scale-105"
          >
            Données d'Entrée
          </TabsTrigger>
          <TabsTrigger 
            value="comparison" 
            className="py-3 text-base text-foreground font-semibold shadow-md transition-all
                       bg-[hsl(var(--tab-2))] 
                       data-[state=active]:bg-[hsl(var(--tab-2-active))] data-[state=active]:text-primary-foreground data-[state=active]:scale-105"
          >
            Comparaison Détaillée
          </TabsTrigger>
          <TabsTrigger 
            value="synthesis" 
            className="py-3 text-base text-foreground font-semibold shadow-md transition-all
                       bg-[hsl(var(--tab-3))] 
                       data-[state=active]:bg-[hsl(var(--tab-3-active))] data-[state=active]:text-primary-foreground data-[state=active]:scale-105"
          >
            Synthèse &amp; Visualisation
          </TabsTrigger>
          <OptimizationDialog simulationState={state} calculationResults={results} onStateChange={onStateChange}/>
        </TabsList>
         <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <Button onClick={handleExportToPDF} disabled={isExporting}>
                {isExporting ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <Download />
                )}
                <span className="ml-2 hidden md:inline">
                    {isExporting ? 'Export en cours...' : 'Téléchargement en PDF'}
                </span>
            </Button>
        </div>
      </div>
      <TabsContent value="data-input" id="data-input">
        <DataInputTab state={state} onStateChange={onStateChange} onSliderChange={onSliderChange} />
      </TabsContent>
      <TabsContent value="comparison" id="comparison">
        <ComparisonTab results={results} />
      </TabsContent>
      <TabsContent value="synthesis" id="synthesis">
        <SynthesisTab results={results} />
      </TabsContent>
    </Tabs>
  );
}
