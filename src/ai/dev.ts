'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-design.ts';
import '@/ai/flows/find-cement-plants.ts';
import '@/ai/flows/find-material-prices.ts';
