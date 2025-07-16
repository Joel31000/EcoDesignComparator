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
    const isPositive = value > 0;
    const isNegative = value < 0;
    const Icon = isNegative ? ArrowDown : isPositive ? ArrowUp : Minus;
    const color = isNegative ? 'text-green-600' : isPositive ? 'text-red-600' : 'text-muted-foreground';

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
    { label: 'Valeur du Carbone', data: cout.breakdown.coutCarbone },
  ];

  const carbonItems = [
    { label: 'Béton', data: carbone.breakdown.beton },
    { label: 'Acier', data: carbone.breakdown.acier },
    { label: 'Cuivre', data: carbone.breakdown.cuivre },
    { label: 'Enrobés', data: carbone.breakdown.enrobes },
    { label: 'Transport Marchandises', data: carbone.breakdown.transportMarchandises },
    { label: 'Déplacements Personnel', data: carbone.breakdown.deplacementsPersonnel },
    { label: 'Énergie', data: carbone.breakdown.energie },
    { label: 'Engins de chantier', data: carbone.breakdown.engins },
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
                <TableHead className="text-right">Éco-conception</TableHead>
                <TableHead className="text-right">Différence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costItems.map(item => (
                <TableRow key={item.label}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.data.classique)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.data.eco)}</TableCell>
                  <DiffCell value={item.data.diff} unit="€" />
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/50">
                <TableHead>Coût Global</TableHead>
                <TableHead className="text-right">{formatCurrency(cout.totalClassique)}</TableHead>
                <TableHead className="text-right">{formatCurrency(cout.coutGlobalEcoAjuste)}</TableHead>
                <DiffCell value={cout.coutGlobalEcoAjuste - cout.totalClassique} unit="€" />
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
                <TableHead className="text-right">Éco-conception</TableHead>
                <TableHead className="text-right">Différence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carbonItems.map(item => (
                <TableRow key={item.label}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.data.classique)} tCO₂</TableCell>
                  <TableCell className="text-right">{formatNumber(item.data.eco)} tCO₂</TableCell>
                  <DiffCell value={item.data.diff} unit=" tCO₂" />
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/50">
                <TableHead>Total Carbone</TableHead>
                <TableHead className="text-right">{formatNumber(carbone.totalClassique)} tCO₂</TableHead>
                <TableHead className="text-right">{formatNumber(carbone.totalEco)} tCO₂</TableHead>
                <DiffCell value={carbone.totalEco - carbone.totalClassique} unit=" tCO₂" />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
