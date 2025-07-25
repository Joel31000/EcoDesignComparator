'use client'

import type { CalculationResults } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface SynthesisTabProps {
  results: CalculationResults;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
const formatNumber = (value: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="mb-2 font-medium">{label}</p>
        <div className="space-y-1">
          {payload.map((p: any) => (
            <div key={p.dataKey} style={{ color: p.color }} className="flex justify-between items-center gap-4">
              <span>{p.name}:</span>
              <span className="font-bold">{p.unit === '€' ? formatCurrency(p.value) : `${formatNumber(p.value)} ${p.unit}`}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1');

export function SynthesisTab({ results }: SynthesisTabProps) {
  const { cout, carbone, amortissement, amortissementMixte } = results;

  const barChartData = Object.keys(cout.breakdown)
    .filter((key) => key !== 'coutCarbone')
    .map((key) => ({
      name: capitalize(key),
      ClassiqueCoût: cout.breakdown[key as keyof typeof cout.breakdown].classique,
      MixteCoût: cout.breakdown[key as keyof typeof cout.breakdown].mixte,
      'Éco-conceptionCoût': cout.breakdown[key as keyof typeof cout.breakdown].eco,
      ClassiqueCarbone: carbone.breakdown[key as keyof typeof carbone.breakdown]?.classique ?? 0,
      MixteCarbone: carbone.breakdown[key as keyof typeof carbone.breakdown]?.mixte ?? 0,
      'Éco-conceptionCarbone': carbone.breakdown[key as keyof typeof carbone.breakdown]?.eco ?? 0,
    }));
    
  const coutGlobalClassiqueAjuste = cout.totalClassique; // Référence, pas d'ajustement sur lui-même

  const summaryData = [
    {
      name: 'Classique',
      coutGlobal: coutGlobalClassiqueAjuste,
      coutGlobalEcartPct: 0,
      carboneTotal: carbone.totalClassique,
      economieCarbone: 0,
      economieCarbonePct: 0,
      surcout: 0,
      amortissement: -1,
    },
    {
      name: 'Mixte',
      coutGlobal: cout.coutGlobalMixteAjuste,
      coutGlobalEcartPct: coutGlobalClassiqueAjuste > 0 ? ((cout.coutGlobalMixteAjuste - coutGlobalClassiqueAjuste) / coutGlobalClassiqueAjuste) * 100 : 0,
      carboneTotal: carbone.totalMixte,
      economieCarbone: carbone.economieTCO2Mixte,
      economieCarbonePct: carbone.totalClassique > 0 ? (carbone.economieTCO2Mixte / carbone.totalClassique) * 100 : 0,
      surcout: cout.surcoutMixte,
      amortissement: amortissementMixte,
    },
    {
      name: 'Éco-conception',
      coutGlobal: cout.coutGlobalEcoAjuste,
      coutGlobalEcartPct: coutGlobalClassiqueAjuste > 0 ? ((cout.coutGlobalEcoAjuste - coutGlobalClassiqueAjuste) / coutGlobalClassiqueAjuste) * 100 : 0,
      carboneTotal: carbone.totalEco,
      economieCarbone: carbone.economieTCO2,
      economieCarbonePct: carbone.totalClassique > 0 ? (carbone.economieTCO2 / carbone.totalClassique) * 100 : 0,
      surcout: cout.surcout,
      amortissement: amortissement,
    },
  ];

  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle>Bilan Comparatif Global</CardTitle>
          <CardDescription>Synthèse des trois scénarios de conception.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Scénario</TableHead>
                        <TableHead className="text-right">Coût Global (après valeur carbone)</TableHead>
                        <TableHead className="text-right">Empreinte Carbone</TableHead>
                        <TableHead className="text-right">Économie Carbone (vs. Classique)</TableHead>
                        <TableHead className="text-right">Surcoût Initial (vs. Classique)</TableHead>
                        <TableHead className="text-right">Amortissement</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {summaryData.map((item) => (
                        <TableRow key={item.name} className="font-medium">
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(item.coutGlobal)}
                                {item.name !== 'Classique' && (
                                    <span className={`ml-2 font-normal ${item.coutGlobalEcartPct > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ({item.coutGlobalEcartPct > 0 ? '+' : ''}{formatNumber(item.coutGlobalEcartPct)}%)
                                    </span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">{formatNumber(item.carboneTotal)} tCO₂</TableCell>
                            <TableCell className="text-right">
                                {item.name === 'Classique' 
                                 ? `0 tCO₂` 
                                 : `${formatNumber(item.economieCarbone)} tCO₂ (${formatNumber(item.economieCarbonePct)}%)`}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(item.surcout)}</TableCell>
                            <TableCell className="text-right">
                                {item.amortissement > 0 ? `${formatNumber(item.amortissement)} ans` : <Badge variant="secondary">N/A</Badge>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
       </Card>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Comparatif des Coûts par Poste</CardTitle>
            <CardDescription>Visualisation des coûts pour chaque catégorie.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${Number(value)/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }}/>
                <Legend iconSize={10} />
                <Bar dataKey="ClassiqueCoût" name="Classique" fill="#a1a1aa" radius={[4, 4, 0, 0]} unit="€" />
                <Bar dataKey="MixteCoût" name="Mixte" fill="#a3e635" radius={[4, 4, 0, 0]} unit="€" />
                <Bar dataKey="Éco-conceptionCoût" name="Éco-conception" fill="#4d7c0f" radius={[4, 4, 0, 0]} unit="€" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Comparatif Carbone par Poste</CardTitle>
            <CardDescription>Visualisation de l'empreinte carbone pour chaque catégorie.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} t`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }}/>
                <Legend iconSize={10} />
                <Bar dataKey="ClassiqueCarbone" name="Classique" fill="#a1a1aa" radius={[4, 4, 0, 0]} unit="tCO₂" />
                <Bar dataKey="MixteCarbone" name="Mixte" fill="#a3e635" radius={[4, 4, 0, 0]} unit="tCO₂" />
                <Bar dataKey="Éco-conceptionCarbone" name="Éco-conception" fill="#4d7c0f" radius={[4, 4, 0, 0]} unit="tCO₂" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
