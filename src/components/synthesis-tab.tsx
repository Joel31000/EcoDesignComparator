'use client'

import type { CalculationResults } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useState } from "react";

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

const PIE_CHART_COLORS = ["#4d7c0f", "#a3e635", "#a1a1aa", "#64748b", "#334155", "#f97316", "#f59e0b", "#eab308"];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, unit } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={-8} textAnchor="middle" fill={fill} className="font-semibold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="hsl(var(--foreground))" className="text-xs font-bold">{payload.name}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={14} textAnchor={textAnchor} fill="hsl(var(--foreground))" className="text-xs">
        {unit === '€' ? formatCurrency(value) : `${formatNumber(value)} ${unit}`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={28} textAnchor={textAnchor} fill="hsl(var(--muted-foreground))" className="text-xs">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


const DonutChartCard = ({ title, data, total, unit }: { title: string, data: { name: string, value: number }[], total: number, unit: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const filteredData = data.filter(d => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
         <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={(props) => renderActiveShape({ ...props, unit })}
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                  ))}
              </Pie>
              <foreignObject x="50%" y="50%" width="120" height="70" style={{ transform: 'translate(-60px, -45px)' }}>
                 <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold text-base text-foreground mt-1">{unit === '€' ? formatCurrency(total) : `${formatNumber(total)} ${unit}`}</p>
                 </div>
              </foreignObject>
            </PieChart>
          </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

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
    
  const coutGlobalClassiqueAjuste = cout.totalClassique; 

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

  const getPieData = (type: 'cost' | 'carbon', scenario: 'classique' | 'mixte' | 'eco') => {
      let breakdown: any;
      if (type === 'cost') {
        breakdown = cout.breakdown;
      } else {
        breakdown = carbone.breakdown;
      }
      
      let data = [];
      
      if (type === 'cost') {
         data = Object.keys(breakdown)
          .filter(key => key !== 'coutCarbone' && (breakdown as any)[key][scenario] > 0)
          .map(key => ({
              name: capitalize(key),
              value: (breakdown as any)[key][scenario],
          }));
      } else {
        const carbonBreakdown = breakdown as typeof carbone.breakdown;
        data = Object.keys(carbonBreakdown)
          .filter(key => {
              const typedKey = key as keyof typeof carbonBreakdown;
              const scenarioData = carbonBreakdown[typedKey];
              if ('classique' in scenarioData) {
                  return scenarioData[scenario] > 0;
              }
              return false; // engins doesn't have all scenarios
          })
          .map(key => {
              const typedKey = key as keyof typeof carbonBreakdown;
              const scenarioData = carbonBreakdown[typedKey];
              return {
                  name: capitalize(key),
                  value: (scenarioData as any)[scenario],
              };
          });

        // Handle 'engins' separately as it has a different structure
        if (carbonBreakdown.engins[scenario as keyof typeof carbonBreakdown.engins] > 0) {
            data.push({ name: 'Engins', value: carbonBreakdown.engins[scenario as keyof typeof carbonBreakdown.engins] });
        }
      }

      return data;
  };

  const carbonPieData = {
      classique: getPieData('carbon', 'classique'),
      mixte: getPieData('carbon', 'mixte'),
      eco: getPieData('carbon', 'eco'),
  };

  const costPieData = {
      classique: getPieData('cost', 'classique'),
      mixte: getPieData('cost', 'mixte'),
      eco: getPieData('cost', 'eco'),
  };

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
      
      <Card>
          <CardHeader>
              <CardTitle>Répartition Détaillée par Conception</CardTitle>
              <CardDescription>Analyse détaillée des coûts et de l'empreinte carbone pour chaque scénario.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
              <div>
                  <h3 className="text-xl font-semibold mb-4">Répartition de l'Empreinte Carbone (tCO₂)</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                      <DonutChartCard title="Classique" data={carbonPieData.classique} total={carbone.totalClassique} unit="tCO₂" />
                      <DonutChartCard title="Mixte" data={carbonPieData.mixte} total={carbone.totalMixte} unit="tCO₂" />
                      <DonutChartCard title="Éco-conception" data={carbonPieData.eco} total={carbone.totalEco} unit="tCO₂" />
                  </div>
              </div>
              <div>
                  <h3 className="text-xl font-semibold mb-4">Répartition des Coûts (€)</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                      <DonutChartCard title="Classique" data={costPieData.classique} total={cout.totalClassique} unit="€" />
                      <DonutChartCard title="Mixte" data={costPieData.mixte} total={cout.coutGlobalMixteAjuste} unit="€" />
                      <DonutChartCard title="Éco-conception" data={costPieData.eco} total={cout.coutGlobalEcoAjuste} unit="€" />
                  </div>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
