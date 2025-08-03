'use server';
/**
 * @fileOverview A Genkit flow to find nearby cement plants.
 *
 * - findNearbyCementPlants - A function that finds cement plants near a given location.
 * - FindCementPlantsInput - The input type for the findNearbyCementPlants function.
 * - FindCementPlantsOutput - The return type for the findNearbyCementPlants function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Tool } from 'genkit/tool';

// Define Zod schemas for input and output
const FindCementPlantsInputSchema = z.object({
  location: z.string().describe("L'adresse ou les coordonnées GPS du chantier. Utiliser les coordonnées GPS si disponibles."),
});
export type FindCementPlantsInput = z.infer<typeof FindCementPlantsInputSchema>;

const CementPlantSchema = z.object({
  name: z.string().describe("Le nom de la cimenterie."),
  address: z.string().describe("L'adresse complète de la cimenterie."),
  distance: z.number().describe("La distance en kilomètres entre le chantier et la cimenterie."),
  phone: z.string().optional().describe("Le numéro de téléphone de la cimenterie."),
  email: z.string().optional().describe("L'adresse e-mail de contact de la cimenterie."),
});

const FindCementPlantsOutputSchema = z.object({
  plants: z.array(CementPlantSchema).describe("Une liste des 5 cimenteries les plus proches, triées par distance croissante."),
});
export type FindCementPlantsOutput = z.infer<typeof FindCementPlantsOutputSchema>;

// Define the search tool
const searchTool: Tool = {
  name: 'internetSearch',
  description: 'Recherche sur internet pour trouver des informations.',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.any(),
  async execute(input) {
    // In a real implementation, this would call a search engine API.
    // For this example, we simulate a search call.
    console.log(`Simulating internet search for: ${input.query}`);
    const fetch = (await import('node-fetch')).default;
    // This is a placeholder and would need a proper search API in a real app
    // For example, using Google's Custom Search JSON API
    // const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_CX&q=${encodeURIComponent(input.query)}`);
    // const data = await response.json();
    // return data;
    return {
        results: `Résultats de recherche simulés pour "${input.query}". Dans une vraie application, cela renverrait des données réelles.`
    }
  },
};


// Define the prompt
const findPlantsPrompt = ai.definePrompt({
  name: 'findCementPlantsPrompt',
  input: { schema: FindCementPlantsInputSchema },
  output: { schema: FindCementPlantsOutputSchema },
  tools: [searchTool],
  prompt: `
    Tu es un assistant expert en logistique de construction.
    Ta mission est de trouver les 5 cimenteries les plus proches d'un chantier situé à : {{{location}}}.

    Voici les étapes à suivre :
    1.  Utilise l'outil de recherche internet pour trouver les cimenteries dans un rayon de 50 km autour de la localisation fournie.
    2.  Pour chaque cimenterie trouvée, recherche son adresse complète, un numéro de téléphone et une adresse e-mail de contact si possible.
    3.  Calcule la distance approximative (à vol d'oiseau) en kilomètres entre le chantier et chaque cimenterie.
    4.  Trie les résultats pour ne garder que les 5 cimenteries les plus proches.
    5.  Retourne la liste triée, en remplissant tous les champs demandés dans le schéma de sortie. Si une information (téléphone, email) n'est pas trouvée, laisse le champ vide.
    `,
});

// Define the flow
const findCementPlantsFlow = ai.defineFlow(
  {
    name: 'findCementPlantsFlow',
    inputSchema: FindCementPlantsInputSchema,
    outputSchema: FindCementPlantsOutputSchema,
  },
  async (input) => {
    const { output } = await findPlantsPrompt(input);
    if (!output) {
      throw new Error("L'IA n'a pas pu trouver de cimenteries.");
    }
    // Sort by distance just in case the model didn't
    output.plants.sort((a, b) => a.distance - b.distance);
    return output;
  }
);


// Exported wrapper function
export async function findNearbyCementPlants(input: FindCementPlantsInput): Promise<FindCementPlantsOutput> {
  return findCementPlantsFlow(input);
}
