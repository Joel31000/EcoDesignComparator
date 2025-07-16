'use client';

import { useState } from 'react';
import { Dashboard } from '@/components/dashboard';
import { Header } from '@/components/header';
import type { SimulationState } from '@/types';
import { defaultSimulationState } from '@/lib/data';
import { calculate } from '@/lib/calculator';

export default function Home() {
    const [state, setState] = useState<SimulationState>(defaultSimulationState);
    
    const handleStateChange = (newState: Partial<SimulationState>) => {
      setState(prevState => ({ ...prevState, ...newState }));
    };

    const handleSliderChange = (key: keyof SimulationState, value: number[]) => {
      setState(prevState => ({ ...prevState, [key]: value[0] }));
    }

    const results = calculate(state);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-grow p-4 md:p-8">
              <Dashboard state={state} onStateChange={handleStateChange} onSliderChange={handleSliderChange} results={results} />
            </main>
        </div>
    );
}
