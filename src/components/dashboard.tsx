import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataInputTab } from "./data-input-tab";
import { ComparisonTab } from "./comparison-tab";
import { SynthesisTab } from "./synthesis-tab";
import type { SimulationState, CalculationResults } from "@/types";

interface DashboardProps {
  state: SimulationState;
  onStateChange: (newState: Partial<SimulationState>) => void;
  onSliderChange: (key: keyof SimulationState, value: number[]) => void;
  results: CalculationResults;
}

export function Dashboard({ state, onStateChange, onSliderChange, results }: DashboardProps) {
  return (
    <Tabs defaultValue="data-input" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="grid w-full max-w-lg grid-cols-1 md:grid-cols-3 p-2 h-auto">
          <TabsTrigger value="data-input" className="py-2.5 text-base">Données d'Entrée</TabsTrigger>
          <TabsTrigger value="comparison" className="py-2.5 text-base">Comparaison Détaillée</TabsTrigger>
          <TabsTrigger value="synthesis" className="py-2.5 text-base">Synthèse &amp; Visualisation</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="data-input">
        <DataInputTab state={state} onStateChange={onStateChange} onSliderChange={onSliderChange} />
      </TabsContent>
      <TabsContent value="comparison">
        <ComparisonTab results={results} />
      </TabsContent>
      <TabsContent value="synthesis">
        <SynthesisTab results={results} />
      </TabsContent>
    </Tabs>
  );
}
