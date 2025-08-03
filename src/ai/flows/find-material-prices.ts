'use server';
/**
 * @fileOverview A Genkit flow to find current prices for selected construction materials.
 *
 * - findMaterialPrices - A function that finds prices for a list of materials.
 * - FindMaterialPricesInput - The input type for the findMaterialPrices function.
 * - FindMaterialPricesOutput - The return type for the findMaterialPrices function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define Zod schemas for input and output
const MaterialToSearchSchema = z.object({
  materialName: z.string().describe("Le nom du matériau à rechercher (ex: 'Béton B25', 'Acier recyclé')."),
  unit: z.string().describe("L'unité de mesure pour le prix (ex: 'm³', 'tonne')."),
});

const FindMaterialPricesInputSchema = z.object({
  materials: z.array(MaterialToSearchSchema).describe("La liste des matériaux pour lesquels trouver un prix."),
});
export type FindMaterialPricesInput = z.infer<typeof FindMaterialPricesInputSchema>;

const SourceSchema = z.object({
    name: z.string().describe("Le nom du site web ou du fournisseur source."),
    url: z.string().url().describe("L'URL directe vers la page du produit ou de la liste de prix."),
});

const MaterialPriceResultSchema = z.object({
  materialName: z.string().describe("Le nom du matériau."),
  averagePrice: z.number().describe("Le prix moyen trouvé en euros."),
  unit: z.string().describe("L'unité correspondant au prix."),
  sources: z.array(SourceSchema).describe("La liste des sources utilisées pour déterminer le prix moyen."),
});

const FindMaterialPricesOutputSchema = z.object({
  results: z.array(MaterialPriceResultSchema).describe("Une liste des résultats de prix pour chaque matériau recherché."),
});
export type FindMaterialPricesOutput = z.infer<typeof FindMaterialPricesOutputSchema>;


// Define the search tool
const searchTool = ai.defineTool(
  {
    name: 'internetSearch',
    description: 'Recherche sur internet pour trouver des informations.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.any(),
  },
  async (input) => {
    // In a real implementation, this would call a search engine API.
    // For this example, we simulate a search call.
    console.log(`Simulating internet search for: ${input.query}`);
    // This is a placeholder
    return {
        results: `Résultats de recherche simulés pour "${input.query}". Dans une vraie application, cela renverrait des données réelles issues d'un moteur de recherche.`
    }
  }
);


// Define the prompt
const findPricesPrompt = ai.definePrompt({
  name: 'findMaterialPricesPrompt',
  input: { schema: FindMaterialPricesInputSchema },
  output: { schema: FindMaterialPricesOutputSchema },
  tools: [searchTool],
  prompt: `
    Tu es un assistant expert en achat de matériaux de construction.
    Ta mission est de trouver les prix actuels pour les matériaux suivants: {{{json materials}}}.

    Voici les étapes à suivre :
    1.  Pour chaque matériau dans la liste, utilise l'outil de recherche internet pour trouver son prix.
    2.  Concentre ta recherche sur des sites de grossistes ou de fournisseurs professionnels en France (ex: Point.P, Leroy Merlin Pro, etc.). Privilégie les sources fiables et récentes.
    3.  Pour chaque matériau, collecte 2 à 3 prix provenant de sources différentes.
    4.  Calcule le prix moyen en euros pour chaque matériau basé sur les prix collectés.
    5.  Retourne une liste de résultats, où chaque élément contient le nom du matériau, le prix moyen calculé, l'unité, et la liste des sources (nom du site et URL directe) que tu as utilisées.
    6.  Si tu ne trouves pas de prix pour un matériau, ne l'inclus pas dans la liste des résultats.
    `,
});

// Define the flow
const findMaterialPricesFlow = ai.defineFlow(
  {
    name: 'findMaterialPricesFlow',
    inputSchema: FindMaterialPricesInputSchema,
    outputSchema: FindMaterialPricesOutputSchema,
  },
  async (input) => {
    if (input.materials.length === 0) {
        return { results: [] };
    }
    const { output } = await findPricesPrompt(input);
    if (!output) {
      throw new Error("L'IA n'a pas pu trouver de prix pour les matériaux demandés.");
    }
    return output;
  }
);


// Exported wrapper function
export async function findMaterialPrices(input: FindMaterialPricesInput): Promise<FindMaterialPricesOutput> {
  return findMaterialPricesFlow(input);
}
