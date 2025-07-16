'use client'

import type { CalculationResults } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { DollarSign, Leaf, TrendingUp, Clock } from "lucide-react";

interface SynthesisTabProps {
  results: CalculationResults;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
const formatNumber = (value: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              Classique
            </span>
            <span className="font-bold text-primary">
              Éco-conception
            </span>
          </div>
          <div className="flex flex-col space-y-1">
             <span className="text-[0.70rem] uppercase text-muted-foreground">
              {payload[0].unit}
            </span>
            <span className="font-bold">
              {formatNumber(payload[0].value)}
            </span>
            <span className="font-bold text-primary">
              {formatNumber(payload[1].value)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export function SynthesisTab({ results }: SynthesisTabProps) {
  const { cout, carbone, amortissement } = results;

  const costChartData = Object.entries(cout.breakdown)
    .filter(([key]) => key !== 'coutCarbone')
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      Classique: value.classique,
      'Éco-conception': value.eco,
      unit: '€'
    }));

  const carbonChartData = Object.entries(carbone.breakdown).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    Classique: value.classique,
    'Éco-conception': value.eco,
    unit: 'tCO₂'
  }));

  const surcoutAjuste = cout.coutGlobalEcoAjuste - cout.totalClassique;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Économie Carbone</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatNumber(carbone.economieTCO2)} tCO₂</div>
            <p className="text-xs text-muted-foreground">
              Équivalent à {formatCurrency(carbone.economieEuros)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bilan Financier Global</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${surcoutAjuste > 0 ? 'text-red-600' : 'text-primary'}`}>
              {formatCurrency(surcoutAjuste)}
            </div>
            <p className="text-xs text-muted-foreground">
              {surcoutAjuste > 0 ? "Surcoût" : "Économie"} après valorisation du carbone
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Surcoût Initial</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(cout.surcout)}</div>
            <p className="text-xs text-muted-foreground">
              Investissement supplémentaire pour l'éco-conception
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amortissement</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {amortissement > 0 ? `${formatNumber(amortissement)} ans` : <Badge variant="secondary">N/A</Badge>}
            </div>
             <p className="text-xs text-muted-foreground">
              Temps de retour sur investissement
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Comparatif des Coûts par Poste</CardTitle>
            <CardDescription>Visualisation des coûts pour chaque catégorie.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }}/>
                <Legend iconSize={10} />
                <Bar dataKey="Classique" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Éco-conception" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
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
              <BarChart data={carbonChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} t`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }}/>
                <Legend iconSize={10} />
                <Bar dataKey="Classique" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Éco-conception" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
