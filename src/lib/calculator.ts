import type { SimulationState, CalculationResults, Breakdown } from '@/types';
import { carbonFootprints } from './data';

function calculateBreakdown(classique: number, eco: number): Breakdown {
  return { classique, eco, diff: eco - classique };
}

export function calculate(state: SimulationState): CalculationResults {
  // Cost Calculations
  const coutBetonClassique = state.volumeBeton * state.prixBetonClassique;
  const coutBetonEco = state.volumeBeton * state.prixBetonBasCarbone;

  const coutAcierClassique = state.poidsAcier * state.prixAcierClassique;
  const coutAcierEco = state.poidsAcier * state.prixAcierBasCarbone;

  const coutCuivreClassique = state.poidsCuivre * state.prixCuivreClassique;
  const coutCuivreEco = state.poidsCuivre * state.prixCuivreRecycle;

  const coutEnrobesClassique = state.volumeEnrobes * state.prixEnrobeChaud;
  const coutEnrobesEco = state.volumeEnrobes * state.prixEnrobeFroid;

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

  const carboneAcierClassique = state.poidsAcier * carbonFootprints.acierClassique;
  const carboneAcierEco = state.poidsAcier * carbonFootprints.acierBasCarbone;

  const carboneCuivreClassique = state.poidsCuivre * carbonFootprints.cuivreClassique;
  const carboneCuivreEco = state.poidsCuivre * carbonFootprints.cuivreRecycle;

  const carboneEnrobesClassique = state.volumeEnrobes * carbonFootprints.enrobeChaud;
  const carboneEnrobesEco = state.volumeEnrobes * carbonFootprints.enrobeFroid;

  const carboneTransportMarchandisesClassique = state.kmTransportMarchandises * carbonFootprints.camionDiesel;
  const carboneTransportMarchandisesEco = state.kmTransportMarchandises * carbonFootprints.camionElectrique;

  const carboneDeplacementsPersonnelClassique = state.kmDeplacementsPersonnel * carbonFootprints.voitureEssence;
  const carboneDeplacementsPersonnelEco = state.kmDeplacementsPersonnel * carbonFootprints.voitureElectrique;

  const carboneEnergieClassique = state.kwhEnergie * carbonFootprints.kwhDiesel;
  const carboneEnergieEco = state.kwhEnergie * carbonFootprints.kwhDiesel * 0.8; // Assuming 20% energy reduction
  
  const carboneEnginsClassique = state.co2EnginsClassique;
  const carboneEnginsEco = state.co2EnginsEco;

  // Totals
  const totalCoutClassique = coutBetonClassique + coutAcierClassique + coutCuivreClassique + coutEnrobesClassique + coutTransportMarchandisesClassique + coutDeplacementsPersonnelClassique + coutEnergieClassique;
  const totalCoutEco = coutBetonEco + coutAcierEco + coutCuivreEco + coutEnrobesEco + coutTransportMarchandisesEco + coutDeplacementsPersonnelEco + coutEnergieEco;

  const totalCarboneClassique = carboneBetonClassique + carboneAcierClassique + carboneCuivreClassique + carboneEnrobesClassique + carboneTransportMarchandisesClassique + carboneDeplacementsPersonnelClassique + carboneEnergieClassique + carboneEnginsClassique;
  const totalCarboneEco = carboneBetonEco + carboneAcierEco + carboneCuivreEco + carboneEnrobesEco + carboneTransportMarchandisesEco + carboneDeplacementsPersonnelEco + carboneEnergieEco + carboneEnginsEco;

  // Savings & Extra Costs
  const surcout = totalCoutEco - totalCoutClassique;
  const economieTCO2 = totalCarboneClassique - totalCarboneEco;
  const economieEuros = economieTCO2 * state.prixTonneCarbone;
  
  const coutGlobalEcoAjuste = totalCoutEco - economieEuros;
  
  // This was using `totalClassique` before it was defined.
  // const surcoutAjuste = coutGlobalEcoAjuste - totalClassique;

  const amortissement = (surcout > 0 && economieEuros > 0 && state.dureeDeVie > 0) ? surcout / (economieEuros / state.dureeDeVie) : 0;
  
  return {
    cout: {
      totalClassique: totalCoutClassique,
      totalEco: totalCoutEco,
      surcout,
      coutGlobalEcoAjuste,
      breakdown: {
        beton: calculateBreakdown(coutBetonClassique, coutBetonEco),
        acier: calculateBreakdown(coutAcierClassique, coutAcierEco),
        cuivre: calculateBreakdown(coutCuivreClassique, coutCuivreEco),
        enrobes: calculateBreakdown(coutEnrobesClassique, coutEnrobesEco),
        transportMarchandises: calculateBreakdown(coutTransportMarchandisesClassique, coutTransportMarchandisesEco),
        deplacementsPersonnel: calculateBreakdown(coutDeplacementsPersonnelClassique, coutDeplacementsPersonnelEco),
        energie: calculateBreakdown(coutEnergieClassique, coutEnergieEco),
        engins: calculateBreakdown(coutEnginsClassique, coutEnginsEco),
        coutCarbone: calculateBreakdown(0, -economieEuros),
      }
    },
    carbone: {
      totalClassique: totalCarboneClassique,
      totalEco: totalCarboneEco,
      economieTCO2,
      economieEuros,
      breakdown: {
        beton: calculateBreakdown(carboneBetonClassique, carboneBetonEco),
        acier: calculateBreakdown(carboneAcierClassique, carboneAcierEco),
        cuivre: calculateBreakdown(carboneCuivreClassique, carboneCuivreEco),
        enrobes: calculateBreakdown(carboneEnrobesClassique, carboneEnrobesEco),
        transportMarchandises: calculateBreakdown(carboneTransportMarchandisesClassique, carboneTransportMarchandisesEco),
        deplacementsPersonnel: calculateBreakdown(carboneDeplacementsPersonnelClassique, carboneDeplacementsPersonnelEco),
        energie: calculateBreakdown(carboneEnergieClassique, carboneEnergieEco),
        engins: calculateBreakdown(carboneEnginsClassique, carboneEnginsEco),
      }
    },
    amortissement,
  };
}
