import type { CalculationResults } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface ComparisonTabProps {
  results: CalculationResults;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
const formatNumber = (value: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);

const DiffCell = ({ value, unit = '' }: { value: number, unit?: string }) => {
    if (value === 0 || !value) {
        return (
            <TableCell className="text-right font-medium text-muted-foreground">
                <div className="flex items-center justify-end gap-1">
                    <Minus className="h-4 w-4"/>
                    <span>{unit === '€' ? formatCurrency(0) : `0${unit}`}</span>
                </div>
            </TableCell>
        );
    }
    const isPositive = value > 0;
    const isNegative = value < 0;
    const Icon = isNegative ? ArrowDown : ArrowUp;
    const color = isNegative ? 'text-green-600' : 'text-red-600';

    return (
        <TableCell className={`text-right font-medium ${color}`}>
            <div className="flex items-center justify-end gap-1">
                <Icon className="h-4 w-4"/>
                <span>{unit === '€' ? formatCurrency(Math.abs(value)) : `${formatNumber(Math.abs(value))}${unit}`}</span>
            </div>
        </TableCell>
    )
}

export function ComparisonTab({ results }: ComparisonTabProps) {
  const { cout, carbone } = results;

  const costItems = [
    { label: 'Béton', data: cout.breakdown.beton },
    { label: 'Acier', data: cout.breakdown.acier },
    { label: 'Cuivre', data: cout.breakdown.cuivre },
    { label: 'Enrobés', data: cout.breakdown.enrobes },
    { label: 'Transport Marchandises', data: cout.breakdown.transportMarchandises },
    { label: 'Déplacements Personnel', data: cout.breakdown.deplacementsPersonnel },
    { label: 'Énergie', data: cout.breakdown.energie },
    { label: 'Valeur du Carbone', data: { classique: 0, mixte: cout.breakdown.coutCarbone.mixte, eco: cout.breakdown.coutCarbone.eco, diff: 0 } },
  ];

  const carbonItems = [
    { label: 'Béton', data: carbone.breakdown.beton },
    { label: 'Acier', data: carbone.breakdown.acier },
    { label: 'Cuivre', data: carbone.breakdown.cuivre },
    { label: 'Enrobés', data: carbone.breakdown.enrobes },
    { label: 'Transport Marchandises', data: carbone.breakdown.transportMarchandises },
    { label: 'Déplacements Personnel', data: carbone.breakdown.deplacementsPersonnel },
    { label: 'Énergie', data: carbone.breakdown.energie },
    { label: 'Engins de chantier', data: {classique: carbone.breakdown.engins.classique, eco: carbone.breakdown.engins.eco, mixte: carbone.breakdown.engins.classique, diff: carbone.breakdown.engins.eco - carbone.breakdown.engins.classique} },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Analyse des Coûts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poste</TableHead>
                <TableHead className="text-right">Classique</TableHead>
                <TableHead className="text-right">Mixte</TableHead>
                <TableHead className="text-right">Éco-conception</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costItems.map(item => (
                <TableRow key={item.label}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.data.classique)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.data.mixte)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.data.eco)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold">Coût Global</TableHead>
                <TableHead className="text-right font-bold">{formatCurrency(cout.totalClassique)}</TableHead>
                <TableHead className="text-right font-bold">{formatCurrency(cout.coutGlobalMixteAjuste)}</TableHead>
                <TableHead className="text-right font-bold">{formatCurrency(cout.coutGlobalEcoAjuste)}</TableHead>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Analyse de l'Empreinte Carbone</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poste</TableHead>
                <TableHead className="text-right">Classique</TableHead>
                <TableHead className="text-right">Mixte</TableHead>
                <TableHead className="text-right">Éco-conception</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carbonItems.map(item => (
                <TableRow key={item.label}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.data.classique)} tCO₂</TableCell>
                  <TableCell className="text-right">{formatNumber(item.data.mixte)} tCO₂</TableCell>
                  <TableCell className="text-right">{formatNumber(item.data.eco)} tCO₂</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold">Total Carbone</TableHead>
                <TableHead className="text-right font-bold">{formatNumber(carbone.totalClassique)} tCO₂</TableHead>
                <TableHead className="text-right font-bold">{formatNumber(carbone.totalMixte)} tCO₂</TableHead>
                <TableHead className="text-right font-bold">{formatNumber(carbone.totalEco)} tCO₂</TableHead>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
