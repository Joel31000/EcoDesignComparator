

'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Download, Loader2, Sparkles } from 'lucide-react';
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
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: null, 
        });
        const imgData = canvas.toDataURL('image/png');
        
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <TabsList className="bg-transparent p-0 gap-1">
            <TabsTrigger 
              value="data-input" 
              className="text-base text-muted-foreground font-semibold transition-all
                        data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              Données d'Entrée
            </TabsTrigger>
            <TabsTrigger 
              value="comparison" 
              className="text-base text-muted-foreground font-semibold transition-all
                        data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              Comparaison Détaillée
            </TabsTrigger>
            <TabsTrigger 
              value="synthesis" 
              className="text-base text-muted-foreground font-semibold transition-all
                        data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              Synthèse &amp; Visualisation
            </TabsTrigger>
          </TabsList>
          
          <OptimizationDialog simulationState={state} calculationResults={results} onStateChange={onStateChange} />

        </div>

         <div>
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
