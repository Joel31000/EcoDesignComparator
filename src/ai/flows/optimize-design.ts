'use server';
/**
 * @fileOverview A Genkit flow to optimize the design of a construction project.
 *
 * - optimizeDesign - A function that finds the optimal mix of eco-friendly materials
 *   to maximize carbon savings within a given budget constraint.
 * - OptimizeDesignInput - The input type for the optimizeDesign function.
 * - OptimizeDesignOutput - The return type for the optimizeDesign function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { SimulationState, OptimizationInput, OptimizationOutput } from '@/types';
import { calculate } from '@/lib/calculator';

// Define Zod schemas that correspond to the TypeScript interfaces in `src/types/index.ts`.
// This is necessary because Genkit flows require Zod schemas for input and output validation.

const SimulationStateSchema = z.object({
    projectDescription: z.string(),
    projectType: z.string(),
    projectLocation: z.string(),
    projectGpsCoordinates: z.string(),
    volumeBeton: z.number(),
    poidsAcier: z.number(),
    poidsCuivre: z.number(),
    poidsAluminium: z.number(),
    volumeEnrobes: z.number(),
    volumeBetonEco: z.number(),
    poidsAcierEco: z.number(),
    poidsCuivreEco: z.number(),
    poidsAluminiumEco: z.number(),
    volumeEnrobesEco: z.number(),
    kmTransportMarchandises: z.number(),
    kmDeplacementsPersonnel: z.number(),
    kwhEnergie: z.number(),
    heuresHelicoptere: z.number(),
    prixKwhDiesel: z.number(),
    prixBetonClassique: z.number(),
    prixBetonBasCarbone: z.number(),
    prixAcierClassique: z.number(),
    prixAcierBasCarbone: z.number(),
    prixEnrobeChaud: z.number(),
    prixEnrobeFroid: z.number(),
    prixCuivreClassique: z.number(),
    prixCuivreRecycle: z.number(),
    prixAluminiumClassique: z.number(),
    prixAluminiumBasCarbone: z.number(),
    prixKmCamionDiesel: z.number(),
    prixKmCamionElectrique: z.number(),
    prixKmVoitureEssence: z.number(),
    prixKmVoitureElectrique: z.number(),
    prixKmAutobusEssence: z.number(),
    prixKmAutobusElectrique: z.number(),
    prixHeureHelicoptere: z.number(),
    co2EnginsClassique: z.number(),
    co2EnginsEco: z.number(),
    prixTonneCarbone: z.number(),
    dureeDeVie: z.number(),
    pctEcoBeton: z.number(),
    pctEcoAcier: z.number(),
    pctEcoCuivre: z.number(),
    pctEcoAluminium: z.number(),
    pctEcoEnrobes: z.number(),
    pctEcoDeplacements: z.number(),
    betonBasCarboneEmpreinte: z.number(),
    masseBetonBasCarbone: z.number(),
    isBetonArme: z.boolean(),
    empreinteAcierBasCarbone: z.number(),
    empreinteAluminiumBasCarbone: z.number(),
});

const OptimizeDesignInputSchema = z.object({
  simulationState: SimulationStateSchema,
  maxSurcoutPercentage: z.number().describe("Le pourcentage de surcoût maximum que l'utilisateur est prêt à accepter pour l'éco-conception."),
});
export type OptimizeDesignInput = z.infer<typeof OptimizeDesignInputSchema>;


const OptimizeDesignOutputSchema = z.object({
  optimizedPercentages: z.object({
    pctEcoBeton: z.number().describe("Pourcentage optimisé de béton bas carbone à utiliser."),
    pctEcoAcier: z.number().describe("Pourcentage optimisé d'acier bas carbone à utiliser."),
    pctEcoCuivre: z.number().describe("Pourcentage optimisé de cuivre recyclé à utiliser."),
    pctEcoAluminium: z.number().describe("Pourcentage optimisé d'aluminium bas carbone à utiliser."),
    pctEcoEnrobes: z.number().describe("Pourcentage optimisé d'enrobé à froid à utiliser."),
    pctEcoDeplacements: z.number().describe("Pourcentage optimisé de déplacements électriques à utiliser."),
  }),
  optimizedMetrics: z.object({
    coutTotal: z.number().describe("Le coût total du projet avec les pourcentages optimisés."),
    carboneTotal: z.number().describe("L'empreinte carbone totale du projet avec les pourcentages optimisés."),
    surcout: z.number().describe("Le surcoût engendré par rapport au scénario classique."),
    economieCarbone: z.number().describe("L'économie de carbone réalisée par rapport au scénario classique."),
  }),
  explanation: z.string().describe("Une explication textuelle de la stratégie d'optimisation et des résultats obtenus."),
});
export type OptimizeDesignOutput = z.infer<typeof OptimizeDesignOutputSchema>;


export async function optimizeDesign(input: OptimizationInput): Promise<OptimizationOutput> {
  return optimizeDesignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeDesignPrompt',
  input: { schema: OptimizeDesignInputSchema },
  output: { schema: OptimizeDesignOutputSchema },
  prompt: `
    Vous êtes un expert en optimisation de projets de construction durable.
    Votre objectif est de trouver la meilleure combinaison de matériaux et de méthodes écologiques pour minimiser l'empreinte carbone (maximiser l'économie de carbone) tout en respectant une contrainte budgétaire stricte définie par l'utilisateur.

    Voici les données de la simulation pour le scénario classique et éco-conçu :
    - Données de simulation : {{{json simulationState}}}
    - Surcoût maximum admissible par l'utilisateur : {{{maxSurcoutPercentage}}}%

    Les leviers d'optimisation sont les pourcentages de matériaux et méthodes écologiques à utiliser (de 0 à 100%):
    - pctEcoBeton: Le pourcentage de béton qui sera remplacé par du béton bas carbone.
    - pctEcoAcier: Le pourcentage d'acier qui sera remplacé par de l'acier bas carbone.
    - pctEcoCuivre: Le pourcentage de cuivre qui sera remplacé par du cuivre recyclé.
    - pctEcoAluminium: Le pourcentage d'aluminium qui sera remplacé par de l'aluminium bas carbone.
    - pctEcoEnrobes: Le pourcentage d'enrobés qui seront remplacés par des enrobés à froid.
    - pctEcoDeplacements: Le pourcentage de déplacements du personnel qui seront effectués avec des véhicules électriques.

    Votre tâche est de déterminer les valeurs optimales pour ces 6 pourcentages.

    Stratégie d'optimisation :
    1.  Analysez l'impact de chaque levier sur le coût et l'empreinte carbone. Identifiez les leviers les plus efficaces (ceux qui réduisent le plus de carbone pour le moins de coût).
    2.  Priorisez l'augmentation des pourcentages pour les leviers les plus efficaces en premier.
    3.  Ajustez itérativement les 6 pourcentages pour trouver la combinaison qui maximise l'économie de carbone SANS que le surcoût total initial (avant prise en compte de la valeur du carbone) ne dépasse le pourcentage maximum autorisé par l'utilisateur.
    4.  Le surcoût se calcule comme suit : (coût_total_optimisé - coût_total_classique) / coût_total_classique. Ce ratio doit être inférieur ou égal à maxSurcoutPercentage / 100.
    5.  Calculez les métriques finales (coût total, carbone total, surcoût, économie carbone) pour la solution optimisée que vous proposez.

    Réponse attendue :
    Vous devez fournir les pourcentages optimisés, les métriques résultantes, et une brève explication de votre approche, justifiant pourquoi la combinaison choisie est la meilleure. L'explication doit être claire, concise et mettre en avant la logique (par ex. "Nous avons maximisé l'utilisation du cuivre recyclé car il offre la plus grande réduction de carbone pour un surcoût modéré...").
  `,
});

const optimizeDesignFlow = ai.defineFlow(
  {
    name: 'optimizeDesignFlow',
    inputSchema: OptimizeDesignInputSchema,
    outputSchema: OptimizeDesignOutputSchema,
  },
  async (input) => {
    // LLM-based optimization.
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("L'IA n'a pas pu générer une optimisation.");
    }
    return output;
  }
);
