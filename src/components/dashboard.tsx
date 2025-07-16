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
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 md:w-auto mb-6">
        <TabsTrigger value="data-input">Données d'Entrée</TabsTrigger>
        <TabsTrigger value="comparison">Comparaison Détaillée</TabsTrigger>
        <TabsTrigger value="synthesis">Synthèse &amp; Visualisation</TabsTrigger>
      </TabsList>
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
