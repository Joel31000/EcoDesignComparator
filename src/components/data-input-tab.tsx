import type { SimulationState } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectTypes, betonBasCarboneOptions, acierOptions } from "@/lib/data";
import { Package, Fuel, DollarSign, Sprout, Truck, Users, HardHat, Settings, Blend, Warehouse } from 'lucide-react';
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";

interface DataInputTabProps {
  state: SimulationState;
  onStateChange: (newState: Partial<SimulationState>) => void;
  onSliderChange: (key: keyof SimulationState, value: number[]) => void;
}

const InputField = ({ label, id, value, unit, onChange, type = "number", step }: { label: string, id: keyof SimulationState, value: string | number, unit: string, onChange: (id: keyof SimulationState, value: string) => void, type?: string, step?: string }) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <Label htmlFor={id} className="text-sm font-medium text-right">{label}</Label>
    <div className="col-span-2 flex items-center gap-2">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        className="flex-grow"
        step={step}
      />
      <span className="text-sm text-muted-foreground">{unit}</span>
    </div>
  </div>
);

const MaterialInputField = ({ label, idClassique, idEco, valueClassique, valueEco, unit, onChange }: {
  label: string,
  idClassique: keyof SimulationState,
  idEco: keyof SimulationState,
  valueClassique: string | number,
  valueEco: string | number,
  unit: string,
  onChange: (id: keyof SimulationState, value: string) => void
}) => (
    <div className="contents">
        <Label className="flex items-center font-semibold">{label}</Label>
        <Input id={idClassique} type="number" value={valueClassique} onChange={(e) => onChange(idClassique, e.target.value)} />
        <Input id={idEco} type="number" value={valueEco} onChange={(e) => onChange(idEco, e.target.value)} />
        <span className="flex items-center text-sm text-muted-foreground">{unit}</span>
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
    if (value === '' || isNaN(numValue)) {
      onStateChange({ [id]: value });
    } else {
      onStateChange({ [id]: numValue });
    }
  };

  const handleStringInputChange = (id: keyof SimulationState, value: string) => {
    onStateChange({ [id]: value });
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres Généraux du Projet</CardTitle>
          <CardDescription>Définissez les informations de base de votre projet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="projectDescription">Description du Projet</Label>
            <Input
              id="projectDescription"
              type="text"
              value={state.projectDescription}
              onChange={(e) => onStateChange({ projectDescription: e.target.value })}
              placeholder="Ex: Construction d'un pont de 50m"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectType">Type de Projet</Label>
              <Select value={state.projectType} onValueChange={(value) => onStateChange({ projectType: value })}>
                <SelectTrigger id="projectType" className="w-full md:w-[280px]">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Package className="text-primary"/>Quantités de Matériaux</CardTitle>
            <CardDescription>Quantités pour le scénario classique vs. éco-conçu (utilisé pour les modes Éco et Mixte).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-x-4 gap-y-3 items-center">
                <div></div>
                <Label className="text-xs text-muted-foreground font-semibold">Classique</Label>
                <Label className="text-xs text-muted-foreground font-semibold">Mixte &amp; Éco-conception</Label>
                <div></div>

                <MaterialInputField label="Béton" idClassique="volumeBeton" idEco="volumeBetonEco" valueClassique={state.volumeBeton} valueEco={state.volumeBetonEco} unit="m³" onChange={handleInputChange} />
                <MaterialInputField label="Acier" idClassique="poidsAcier" idEco="poidsAcierEco" valueClassique={state.poidsAcier} valueEco={state.poidsAcierEco} unit="tonnes" onChange={handleInputChange} />
                <MaterialInputField label="Cuivre" idClassique="poidsCuivre" idEco="poidsCuivreEco" valueClassique={state.poidsCuivre} valueEco={state.poidsCuivreEco} unit="tonnes" onChange={handleInputChange} />
                <MaterialInputField label="Enrobés" idClassique="volumeEnrobes" idEco="volumeEnrobesEco" valueClassique={state.volumeEnrobes} valueEco={state.volumeEnrobesEco} unit="m³" onChange={handleInputChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Truck className="text-primary"/>Transport & Déplacements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField label="Transport Marchandises" id="kmTransportMarchandises" value={state.kmTransportMarchandises} unit="km" onChange={handleInputChange} />
            <InputField label="Transports héliportés" id="heuresHelicoptere" value={state.heuresHelicoptere} unit="Heures" onChange={handleInputChange} />
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
          <CardTitle className="flex items-center gap-2"><Warehouse className="text-primary"/>Matériaux</CardTitle>
          <CardDescription>Paramètres spécifiques aux matériaux bas-carbone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr,1fr,2fr] gap-x-8 gap-y-4 items-end">
                <div className="space-y-2">
                    <Label htmlFor="betonBasCarboneEmpreinte">Type béton bas carbone</Label>
                    <Select
                        value={String(state.betonBasCarboneEmpreinte)}
                        onValueChange={(value) => onStateChange({ betonBasCarboneEmpreinte: Number(value) })}
                    >
                        <SelectTrigger id="betonBasCarboneEmpreinte">
                            <SelectValue placeholder="Sélectionner un type de béton" />
                        </SelectTrigger>
                        <SelectContent>
                            {betonBasCarboneOptions.map(option => (
                                <SelectItem key={option.name} value={String(option.empreinte)}>
                                    {option.name} ({option.empreinte} tCO₂eq/m³)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="flex items-center space-x-2 pb-2 justify-center">
                    <Checkbox id="isBetonArme" checked={state.isBetonArme} onCheckedChange={(checked) => onStateChange({ isBetonArme: !!checked })} />
                    <Label htmlFor="isBetonArme" className="text-sm font-medium leading-none">
                        Béton armé
                    </Label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="masseBetonBasCarbone">Masse ciment dans formulation</Label>
                    <div className="flex items-center gap-2">
                    <Input
                        id="masseBetonBasCarbone"
                        type="number"
                        value={state.masseBetonBasCarbone}
                        onChange={(e) => handleInputChange("masseBetonBasCarbone", e.target.value)}
                        className="flex-grow"
                    />
                    <span className="text-sm text-muted-foreground">Kg</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="empreinteAcierBasCarbone">Type d'acier/procédé</Label>
                <Select
                    value={String(state.empreinteAcierBasCarbone)}
                    onValueChange={(value) => onStateChange({ empreinteAcierBasCarbone: Number(value) })}
                >
                    <SelectTrigger id="empreinteAcierBasCarbone">
                        <SelectValue placeholder="Sélectionner un type d'acier" />
                    </SelectTrigger>
                    <SelectContent>
                        {acierOptions.map(option => (
                            <SelectItem key={option.name} value={String(option.empreinte)}>
                                {option.name} ({option.displayValue})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
       </Card>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Blend className="text-primary"/>Paramètres de Conception Mixte</CardTitle>
          <CardDescription>Ajustez le pourcentage de matériaux et méthodes éco-conçus pour la simulation "Mixte".</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <PercentageSlider label="Béton Bas Carbone" id="pctEcoBeton" value={state.pctEcoBeton} onSliderChange={onSliderChange} />
            <PercentageSlider label="Acier Bas Carbone" id="pctEcoAcier" value={state.pctEcoAcier} onSliderChange={onSliderChange} />
            <PercentageSlider label="Cuivre Recyclé" id="pctEcoCuivre" value={state.pctEcoCuivre} onSliderChange={onSliderChange} />
            <PercentageSlider label="Enrobé à Froid" id="pctEcoEnrobes" value={state.pctEcoEnrobes} onSliderChange={onSliderChange} />
            <PercentageSlider label="Déplacements Électriques" id="pctEcoDeplacements" value={state.pctEcoDeplacements} onSliderChange={onSliderChange} />
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DollarSign className="text-primary"/>Ajustement des Prix</CardTitle>
          <CardDescription>Ajustez les prix pour voir l'impact en temps réel.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <InputField label="Prix Béton Classique" id="prixBetonClassique" value={state.prixBetonClassique} unit="€/m³" onChange={handleInputChange} />
            <InputField label="Prix Béton Bas Carbone" id="prixBetonBasCarbone" value={state.prixBetonBasCarbone} unit="€/m³" onChange={handleInputChange} />
            <InputField label="Prix Acier Classique" id="prixAcierClassique" value={state.prixAcierClassique} unit="€/t" onChange={handleInputChange} />
            <InputField label="Prix Acier Bas Carbone" id="prixAcierBasCarbone" value={state.prixAcierBasCarbone} unit="€/t" onChange={handleInputChange} />
            <InputField label="Prix Cuivre Classique" id="prixCuivreClassique" value={state.prixCuivreClassique} unit="€/t" onChange={handleInputChange} />
            <InputField label="Prix Cuivre Recyclé" id="prixCuivreRecycle" value={state.prixCuivreRecycle} unit="€/t" onChange={handleInputChange} />
            <InputField label="Prix Enrobé à Chaud" id="prixEnrobeChaud" value={state.prixEnrobeChaud} unit="€/m³" onChange={handleInputChange} />
            <InputField label="Prix Enrobé à Froid" id="prixEnrobeFroid" value={state.prixEnrobeFroid} unit="€/m³" onChange={handleInputChange} />
            <InputField label="Prix horaire Hélicoptère" id="prixHeureHelicoptere" value={state.prixHeureHelicoptere} unit="€/heure" onChange={handleInputChange} />
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
                <InputField label="Prix de la Tonne de Carbone" id="prixTonneCarbone" value={state.prixTonneCarbone} unit="€/tCO₂" onChange={handleInputChange} />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
