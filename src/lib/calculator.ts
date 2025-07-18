import type { SimulationState, CalculationResults, Breakdown } from '@/types';
import { carbonFootprints } from './data';

function calculateBreakdown(classique: number, eco: number, mixte: number): Breakdown {
  return { classique, eco, mixte, diff: eco - classique };
}

const calculateMixed = (classique: number, eco: number, pctEco: number) => {
    return (classique * (1 - pctEco / 100)) + (eco * (pctEco / 100));
}

export function calculate(state: SimulationState): CalculationResults {
  // Cost Calculations
  const coutBetonClassique = state.volumeBeton * state.prixBetonClassique;
  const coutBetonEco = state.volumeBeton * state.prixBetonBasCarbone;
  const coutBetonMixte = calculateMixed(coutBetonClassique, coutBetonEco, state.pctEcoBeton);

  const coutAcierClassique = state.poidsAcier * state.prixAcierClassique;
  const coutAcierEco = state.poidsAcier * state.prixAcierBasCarbone;
  const coutAcierMixte = calculateMixed(coutAcierClassique, coutAcierEco, state.pctEcoAcier);

  const coutCuivreClassique = state.poidsCuivre * state.prixCuivreClassique;
  const coutCuivreEco = state.poidsCuivre * state.prixCuivreRecycle;
  const coutCuivreMixte = calculateMixed(coutCuivreClassique, coutCuivreEco, state.pctEcoCuivre);

  const coutEnrobesClassique = state.volumeEnrobes * state.prixEnrobeChaud;
  const coutEnrobesEco = state.volumeEnrobes * state.prixEnrobeFroid;
  const coutEnrobesMixte = calculateMixed(coutEnrobesClassique, coutEnrobesEco, state.pctEcoEnrobes);

  // For transport, personnel, energy, we assume they are linked to the global choice, not materials.
  // We'll consider them fully "eco" for eco and "classique" for mixte/classique for simplicity.
  // A more complex model could link them to material percentages.
  const coutTransportMarchandisesClassique = state.kmTransportMarchandises * state.prixKmCamionDiesel;
  const coutTransportMarchandisesEco = state.kmTransportMarchandises * state.prixKmCamionElectrique;

  const coutDeplacementsPersonnelClassique = state.kmDeplacementsPersonnel * state.prixKmVoitureEssence;
  const coutDeplacementsPersonnelEco = state.kmDeplacementsPersonnel * state.prixKmVoitureElectrique;

  const coutEnergieClassique = state.kwhEnergie * state.prixKwhDiesel;
  const coutEnergieEco = state.kwhEnergie * state.prixKwhDiesel * 0.8; // Assuming 20% energy reduction for eco-design

  const coutEnginsClassique = 0; // Cost is embedded in material prices, this is for carbon
  const coutEnginsEco = 0;
  
  // Carbon Footprint Calculations (in tonnes CO2)
  const carboneBetonClassique = state.volumeBeton * carbonFootprints.betonClassique;
  const carboneBetonEco = state.volumeBeton * carbonFootprints.betonBasCarbone;
  const carboneBetonMixte = calculateMixed(carboneBetonClassique, carboneBetonEco, state.pctEcoBeton);

  const carboneAcierClassique = state.poidsAcier * carbonFootprints.acierClassique;
  const carboneAcierEco = state.poidsAcier * carbonFootprints.acierBasCarbone;
  const carboneAcierMixte = calculateMixed(carboneAcierClassique, carboneAcierEco, state.pctEcoAcier);

  const carboneCuivreClassique = state.poidsCuivre * carbonFootprints.cuivreClassique;
  const carboneCuivreEco = state.poidsCuivre * carbonFootprints.cuivreRecycle;
  const carboneCuivreMixte = calculateMixed(carboneCuivreClassique, carboneCuivreEco, state.pctEcoCuivre);

  const carboneEnrobesClassique = state.volumeEnrobes * carbonFootprints.enrobeChaud;
  const carboneEnrobesEco = state.volumeEnrobes * carbonFootprints.enrobeFroid;
  const carboneEnrobesMixte = calculateMixed(carboneEnrobesClassique, carboneEnrobesEco, state.pctEcoEnrobes);

  const carboneTransportMarchandisesClassique = state.kmTransportMarchandises * carbonFootprints.camionDiesel;
  const carboneTransportMarchandisesEco = state.kmTransportMarchandises * carbonFootprints.camionElectrique;

  const carboneDeplacementsPersonnelClassique = state.kmDeplacementsPersonnel * carbonFootprints.voitureEssence;
  const carboneDeplacementsPersonnelEco = state.kmDeplacementsPersonnel * carbonFootprints.voireElectrique;

  const carboneEnergieClassique = state.kwhEnergie * carbonFootprints.kwhDiesel;
  const carboneEnergieEco = state.kwhEnergie * carbonFootprints.kwhDiesel * 0.8; // Assuming 20% energy reduction
  
  const carboneEnginsClassique = state.co2EnginsClassique;
  const carboneEnginsEco = state.co2EnginsEco;

  // Totals
  const totalCoutClassique = coutBetonClassique + coutAcierClassique + coutCuivreClassique + coutEnrobesClassique + coutTransportMarchandisesClassique + coutDeplacementsPersonnelClassique + coutEnergieClassique;
  const totalCoutEco = coutBetonEco + coutAcierEco + coutCuivreEco + coutEnrobesEco + coutTransportMarchandisesEco + coutDeplacementsPersonnelEco + coutEnergieEco;
  const totalCoutMixte = coutBetonMixte + coutAcierMixte + coutCuivreMixte + coutEnrobesMixte + coutTransportMarchandisesClassique + coutDeplacementsPersonnelClassique + coutEnergieClassique; // Mixte uses classique for transport/energy/personnel

  const totalCarboneClassique = carboneBetonClassique + carboneAcierClassique + carboneCuivreClassique + carboneEnrobesClassique + carboneTransportMarchandisesClassique + carboneDeplacementsPersonnelClassique + carboneEnergieClassique + carboneEnginsClassique;
  const totalCarboneEco = carboneBetonEco + carboneAcierEco + carboneCuivreEco + carboneEnrobesEco + carboneTransportMarchandisesEco + carboneDeplacementsPersonnelEco + carboneEnergieEco + carboneEnginsEco;
  const totalCarboneMixte = carboneBetonMixte + carboneAcierMixte + carboneCuivreMixte + carboneEnrobesMixte + carboneTransportMarchandisesClassique + carboneDeplacementsPersonnelClassique + carboneEnergieClassique + carboneEnginsClassique;

  // Savings & Extra Costs
  const surcout = totalCoutEco - totalCoutClassique;
  const economieTCO2 = totalCarboneClassique - totalCarboneEco;
  const economieEuros = economieTCO2 * state.prixTonneCarbone;
  const coutGlobalEcoAjuste = totalCoutEco - economieEuros;
  const amortissement = (surcout > 0 && economieEuros > 0 && state.dureeDeVie > 0) ? surcout / (economieEuros / state.dureeDeVie) : -1;

  const surcoutMixte = totalCoutMixte - totalCoutClassique;
  const economieTCO2Mixte = totalCarboneClassique - totalCarboneMixte;
  const economieEurosMixte = economieTCO2Mixte * state.prixTonneCarbone;
  const coutGlobalMixteAjuste = totalCoutMixte - economieEurosMixte;
  const amortissementMixte = (surcoutMixte > 0 && economieEurosMixte > 0 && state.dureeDeVie > 0) ? surcoutMixte / (economieEurosMixte / state.dureeDeVie) : -1;
  
  return {
    cout: {
      totalClassique: totalCoutClassique,
      totalEco: totalCoutEco,
      totalMixte: totalCoutMixte,
      surcout,
      surcoutMixte,
      coutGlobalEcoAjuste,
      coutGlobalMixteAjuste,
      breakdown: {
        beton: calculateBreakdown(coutBetonClassique, coutBetonEco, coutBetonMixte),
        acier: calculateBreakdown(coutAcierClassique, coutAcierEco, coutAcierMixte),
        cuivre: calculateBreakdown(coutCuivreClassique, coutCuivreEco, coutCuivreMixte),
        enrobes: calculateBreakdown(coutEnrobesClassique, coutEnrobesEco, coutEnrobesMixte),
        transportMarchandises: calculateBreakdown(coutTransportMarchandisesClassique, coutTransportMarchandisesEco, coutTransportMarchandisesClassique),
        deplacementsPersonnel: calculateBreakdown(coutDeplacementsPersonnelClassique, coutDeplacementsPersonnelEco, coutDeplacementsPersonnelClassique),
        energie: calculateBreakdown(coutEnergieClassique, coutEnergieEco, coutEnergieClassique),
        engins: calculateBreakdown(coutEnginsClassique, coutEnginsEco, coutEnginsClassique),
        coutCarbone: { eco: -economieEuros, mixte: -economieEurosMixte },
      }
    },
    carbone: {
      totalClassique: totalCarboneClassique,
      totalEco: totalCarboneEco,
      totalMixte: totalCarboneMixte,
      economieTCO2,
      economieTCO2Mixte,
      economieEuros,
      economieEurosMixte,
      breakdown: {
        beton: calculateBreakdown(carboneBetonClassique, carboneBetonEco, carboneBetonMixte),
        acier: calculateBreakdown(carboneAcierClassique, carboneAcierEco, carboneAcierMixte),
        cuivre: calculateBreakdown(carboneCuivreClassique, carboneCuivreEco, carboneCuivreMixte),
        enrobes: calculateBreakdown(carboneEnrobesClassique, carboneEnrobesEco, carboneEnrobesMixte),
        transportMarchandises: calculateBreakdown(carboneTransportMarchandisesClassique, carboneTransportMarchandisesEco, carboneTransportMarchandisesClassique),
        deplacementsPersonnel: calculateBreakdown(carboneDeplacementsPersonnelClassique, carboneDeplacementsPersonnelEco, carboneDeplacementsPersonnelClassique),
        energie: calculateBreakdown(carboneEnergieClassique, carboneEnergieEco, carboneEnergieClassique),
        engins: { classique: carboneEnginsClassique, eco: carboneEnginsEco },
      }
    },
    amortissement,
    amortissementMixte,
  };
}
