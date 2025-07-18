import type { SimulationState } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectTypes } from "@/lib/data";
import { AISuggestion } from "./ai-suggestion";
import { Package, Fuel, DollarSign, Sprout, Truck, Users, HardHat, Settings, Blend } from 'lucide-react';

interface DataInputTabProps {
  state: SimulationState;
  onStateChange: (newState: Partial<SimulationState>) => void;
  onSliderChange: (key: keyof SimulationState, value: number[]) => void;
}

const InputField = ({ label, id, value, unit, onChange }: { label: string, id: keyof SimulationState, value: number, unit: string, onChange: (id: keyof SimulationState, value: string) => void }) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <Label htmlFor={id} className="text-sm font-medium text-right">{label}</Label>
    <div className="col-span-2 flex items-center gap-2">
      <Input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        className="flex-grow"
      />
      <span className="text-sm text-muted-foreground">{unit}</span>
    </div>
  </div>
);

const PriceSlider = ({ label, id, value, min, max, step, unit, onSliderChange }: { label: string, id: keyof SimulationState, value: number, min: number, max: number, step: number, unit: string, onSliderChange: (key: keyof SimulationState, value: number[]) => void }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <span className="text-sm font-semibold text-primary">{value.toLocaleString('fr-FR')} {unit}</span>
    </div>
    <Slider
      id={id}
      value={[value]}
      onValueChange={(val) => onSliderChange(id, val)}
      min={min}
      max={max}
      step={step}
    />
  </div>
);

const PercentageSlider = ({ label, id, value, onSliderChange }: { label: string, id: keyof SimulationState, value: number, onSliderChange: (key: keyof SimulationState, value: number[]) => void }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <span className="text-sm font-semibold text-primary">{value}%</span>
    </div>
    <Slider
      id={id}
      value={[value]}
      onValueChange={(val) => onSliderChange(id, val)}
      min={0}
      max={100}
      step={1}
    />
  </div>
);

export function DataInputTab({ state, onStateChange, onSliderChange }: DataInputTabProps) {
  const handleInputChange = (id: keyof SimulationState, value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      onStateChange({ [id]: numValue });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres Généraux du Projet</CardTitle>
          <CardDescription>Définissez les informations de base de votre projet.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="projectType">Type de Projet</Label>
            <Select value={state.projectType} onValueChange={(value) => onStateChange({ projectType: value })}>
              <SelectTrigger id="projectType">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
             <AISuggestion />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Package className="text-primary"/>Quantités de Matériaux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField label="Béton" id="volumeBeton" value={state.volumeBeton} unit="m³" onChange={handleInputChange} />
            <InputField label="Acier" id="poidsAcier" value={state.poidsAcier} unit="tonnes" onChange={handleInputChange} />
            <InputField label="Cuivre" id="poidsCuivre" value={state.poidsCuivre} unit="tonnes" onChange={handleInputChange} />
            <InputField label="Enrobés" id="volumeEnrobes" value={state.volumeEnrobes} unit="m³" onChange={handleInputChange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Truck className="text-primary"/>Transport & Déplacements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField label="Transport Marchandises" id="kmTransportMarchandises" value={state.kmTransportMarchandises} unit="km" onChange={handleInputChange} />
            <InputField label="Déplacements Personnel" id="kmDeplacementsPersonnel" value={state.kmDeplacementsPersonnel} unit="km" onChange={handleInputChange} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Fuel className="text-primary"/>Énergie & Chantier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField label="Énergie sur Chantier" id="kwhEnergie" value={state.kwhEnergie} unit="kWh" onChange={handleInputChange} />
             <InputField label="Émissions Engins (Classique)" id="co2EnginsClassique" value={state.co2EnginsClassique} unit="tCO₂" onChange={handleInputChange} />
             <InputField label="Émissions Engins (Éco)" id="co2EnginsEco" value={state.co2EnginsEco} unit="tCO₂" onChange={handleInputChange} />
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Blend className="text-primary"/>Paramètres de Conception Mixte</CardTitle>
          <CardDescription>Ajustez le pourcentage de matériaux éco-conçus pour la simulation "Mixte".</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            <PercentageSlider label="Béton Bas Carbone" id="pctEcoBeton" value={state.pctEcoBeton} onSliderChange={onSliderChange} />
            <PercentageSlider label="Acier Bas Carbone" id="pctEcoAcier" value={state.pctEcoAcier} onSliderChange={onSliderChange} />
            <PercentageSlider label="Cuivre Recyclé" id="pctEcoCuivre" value={state.pctEcoCuivre} onSliderChange={onSliderChange} />
            <PercentageSlider label="Enrobé à Froid" id="pctEcoEnrobes" value={state.pctEcoEnrobes} onSliderChange={onSliderChange} />
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DollarSign className="text-primary"/>Ajustement des Prix</CardTitle>
          <CardDescription>Utilisez les curseurs pour ajuster les prix et voir l'impact en temps réel.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <PriceSlider label="Prix Béton Classique" id="prixBetonClassique" value={state.prixBetonClassique} min={100} max={300} step={5} unit="€/m³" onSliderChange={onSliderChange} />
            <PriceSlider label="Prix Béton Bas Carbone" id="prixBetonBasCarbone" value={state.prixBetonBasCarbone} min={100} max={300} step={5} unit="€/m³" onSliderChange={onSliderChange} />
            <PriceSlider label="Prix Acier Classique" id="prixAcierClassique" value={state.prixAcierClassique} min={700} max={1200} step={10} unit="€/t" onSliderChange={onSliderChange} />
            <PriceSlider label="Prix Acier Bas Carbone" id="prixAcierBasCarbone" value={state.prixAcierBasCarbone} min={800} max={1300} step={10} unit="€/t" onSliderChange={onSliderChange} />
            <PriceSlider label="Prix Cuivre Classique" id="prixCuivreClassique" value={state.prixCuivreClassique} min={7000} max={12000} step={100} unit="€/t" onSliderChange={onSliderChange} />
            <PriceSlider label="Prix Cuivre Recyclé" id="prixCuivreRecycle" value={state.prixCuivreRecycle} min={6000} max={11000} step={100} unit="€/t" onSliderChange={onSliderChange} />
            <PriceSlider label="Prix Enrobé à Chaud" id="prixEnrobeChaud" value={state.prixEnrobeChaud} min={50} max={150} step={5} unit="€/m³" onSliderChange={onSliderChange} />
            <PriceSlider label="Prix Enrobé à Froid" id="prixEnrobeFroid" value={state.prixEnrobeFroid} min={60} max={160} step={5} unit="€/m³" onSliderChange={onSliderChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings className="text-primary"/>Paramètres de Simulation</CardTitle>
          <CardDescription>Ajustez les variables globales pour la simulation financière et carbone.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <InputField label="Durée de vie de l'ouvrage" id="dureeDeVie" value={state.dureeDeVie} unit="ans" onChange={handleInputChange} />
            </div>
            <div className="space-y-4">
                <PriceSlider label="Prix de la Tonne de Carbone" id="prixTonneCarbone" value={state.prixTonneCarbone} min={0} max={500} step={10} unit="€/tCO₂" onSliderChange={onSliderChange} />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
