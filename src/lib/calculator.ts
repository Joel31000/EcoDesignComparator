import type { SimulationState, CalculationResults, Breakdown } from '@/types';
import { carbonFootprints } from './data';

function calculateBreakdown(classique: number, eco: number, mixte: number): Breakdown {
  return { classique, eco, mixte, diff: eco - classique };
}

// calculates the mixed value based on the percentage of eco-conception.
const calculateMixedValue = (classiqueValue: number, ecoValue: number, pctEco: number) => {
    return (classiqueValue * (1 - pctEco / 100)) + (ecoValue * (pctEco / 100));
}

export function calculate(state: SimulationState): CalculationResults {
  // Cost Calculations
  // The cost of a material depends on its type (classic/eco) and its quantity (classic/eco)
  const coutBetonClassique = state.volumeBeton * state.prixBetonClassique;
  const coutBetonEco = state.volumeBetonEco * state.prixBetonBasCarbone;
  const coutBetonMixte = calculateMixedValue(
      state.volumeBeton * state.prixBetonClassique,
      state.volumeBetonEco * state.prixBetonBasCarbone,
      state.pctEcoBeton
  );

  const coutAcierClassique = state.poidsAcier * state.prixAcierClassique;
  const coutAcierEco = state.poidsAcierEco * state.prixAcierBasCarbone;
  const coutAcierMixte = calculateMixedValue(
      state.poidsAcier * state.prixAcierClassique,
      state.poidsAcierEco * state.prixAcierBasCarbone,
      state.pctEcoAcier
  );

  const coutCuivreClassique = state.poidsCuivre * state.prixCuivreClassique;
  const coutCuivreEco = state.poidsCuivreEco * state.prixCuivreRecycle;
  const coutCuivreMixte = calculateMixedValue(
      state.poidsCuivre * state.prixCuivreClassique,
      state.poidsCuivreEco * state.prixCuivreRecycle,
      state.pctEcoCuivre
  );

  const coutEnrobesClassique = state.volumeEnrobes * state.prixEnrobeChaud;
  const coutEnrobesEco = state.volumeEnrobesEco * state.prixEnrobeFroid;
  const coutEnrobesMixte = calculateMixedValue(
      state.volumeEnrobes * state.prixEnrobeChaud,
      state.volumeEnrobesEco * state.prixEnrobeFroid,
      state.pctEcoEnrobes
  );

  const coutHelicoptere = state.heuresHelicoptere * state.prixHeureHelicoptere;

  const coutTransportMarchandisesClassique = state.kmTransportMarchandises * state.prixKmCamionDiesel + coutHelicoptere;
  const coutTransportMarchandisesEco = state.kmTransportMarchandises * state.prixKmCamionElectrique + coutHelicoptere;
  const coutTransportMarchandisesMixte = coutTransportMarchandisesClassique;

  const coutDeplacementsPersonnelClassique = state.kmDeplacementsPersonnel * state.prixKmVoitureEssence;
  const coutDeplacementsPersonnelEco = state.kmDeplacementsPersonnel * state.prixKmVoitureElectrique;
  const coutDeplacementsPersonnelMixte = calculateMixedValue(coutDeplacementsPersonnelClassique, coutDeplacementsPersonnelEco, state.pctEcoDeplacements);

  const coutEnergieClassique = state.kwhEnergie * state.prixKwhDiesel;
  const coutEnergieEco = state.kwhEnergie * state.prixKwhDiesel * 0.8; // Assuming 20% energy reduction for eco-design
  const coutEnergieMixte = coutEnergieClassique;

  const coutEnginsClassique = 0; // Cost is embedded in material prices, this is for carbon
  const coutEnginsEco = 0;
  
  // Carbon Footprint Calculations (in tonnes CO2)
  const armatureImpact = state.isBetonArme ? 0.115 : 0;

  const carboneBetonClassique = state.volumeBeton * (((state.masseBetonBasCarbone / 1000) * carbonFootprints.betonClassique) + armatureImpact);
  const carboneBetonEco = state.volumeBetonEco * (((state.masseBetonBasCarbone / 1000) * state.betonBasCarboneEmpreinte) + armatureImpact);
  const carboneBetonMixte = calculateMixedValue(carboneBetonClassique, carboneBetonEco, state.pctEcoBeton);

  const carboneAcierClassique = state.poidsAcier * carbonFootprints.acierClassique;
  const carboneAcierEco = state.poidsAcierEco * carbonFootprints.acierBasCarbone;
  const carboneAcierMixte = calculateMixedValue(
      state.poidsAcier * carbonFootprints.acierClassique,
      state.poidsAcierEco * carbonFootprints.acierBasCarbone,
      state.pctEcoAcier
  );

  const carboneCuivreClassique = state.poidsCuivre * carbonFootprints.cuivreClassique;
  const carboneCuivreEco = state.poidsCuivreEco * carbonFootprints.cuivreRecycle;
  const carboneCuivreMixte = calculateMixedValue(
      state.poidsCuivre * carbonFootprints.cuivreClassique,
      state.poidsCuivreEco * carbonFootprints.cuivreRecycle,
      state.pctEcoCuivre
  );

  const carboneEnrobesClassique = state.volumeEnrobes * carbonFootprints.enrobeChaud;
  const carboneEnrobesEco = state.volumeEnrobesEco * carbonFootprints.enrobeFroid;
  const carboneEnrobesMixte = calculateMixedValue(
      state.volumeEnrobes * carbonFootprints.enrobeChaud,
      state.volumeEnrobesEco * carbonFootprints.enrobeFroid,
      state.pctEcoEnrobes
  );

  const carboneHelicoptere = state.heuresHelicoptere * carbonFootprints.helicoptere;

  const carboneTransportMarchandisesClassique = state.kmTransportMarchandises * carbonFootprints.camionDiesel + carboneHelicoptere;
  const carboneTransportMarchandisesEco = state.kmTransportMarchandises * carbonFootprints.camionElectrique + carboneHelicoptere;
  const carboneTransportMarchandisesMixte = carboneTransportMarchandisesClassique;

  // Déplacements Personnel
  const carboneDeplacementsPersonnelClassique = state.kmDeplacementsPersonnel * carbonFootprints.autobusEssence;
  const carboneDeplacementsPersonnelEco = state.kmDeplacementsPersonnel * carbonFootprints.autobusElectrique;
  const carboneDeplacementsPersonnelMixte = calculateMixedValue(carboneDeplacementsPersonnelClassique, carboneDeplacementsPersonnelEco, state.pctEcoDeplacements);

  const carboneEnergieClassique = state.kwhEnergie * carbonFootprints.kwhDiesel;
  const carboneEnergieEco = state.kwhEnergie * carbonFootprints.kwhDiesel * 0.8; // Assuming 20% energy reduction
  const carboneEnergieMixte = carboneEnergieClassique;
  
  const carboneEnginsClassique = state.co2EnginsClassique;
  const carboneEnginsEco = state.co2EnginsEco;
  const carboneEnginsMixte = carboneEnginsClassique;

  // Totals
  const totalCoutClassique = coutBetonClassique + coutAcierClassique + coutCuivreClassique + coutEnrobesClassique + coutTransportMarchandisesClassique + coutDeplacementsPersonnelClassique + coutEnergieClassique;
  const totalCoutEco = coutBetonEco + coutAcierEco + coutCuivreEco + coutEnrobesEco + coutTransportMarchandisesEco + coutDeplacementsPersonnelEco + coutEnergieEco;
  const totalCoutMixte = coutBetonMixte + coutAcierMixte + coutCuivreMixte + coutEnrobesMixte + coutTransportMarchandisesMixte + coutDeplacementsPersonnelMixte + coutEnergieMixte;

  const totalCarboneClassique = carboneBetonClassique + carboneAcierClassique + carboneCuivreClassique + carboneEnrobesClassique + carboneTransportMarchandisesClassique + carboneDeplacementsPersonnelClassique + carboneEnergieClassique + carboneEnginsClassique;
  const totalCarboneEco = carboneBetonEco + carboneAcierEco + carboneCuivreEco + carboneEnrobesEco + carboneTransportMarchandisesEco + carboneDeplacementsPersonnelEco + carboneEnergieEco + carboneEnginsEco;
  const totalCarboneMixte = carboneBetonMixte + carboneAcierMixte + carboneCuivreMixte + carboneEnrobesMixte + carboneTransportMarchandisesMixte + carboneDeplacementsPersonnelMixte + carboneEnergieMixte + carboneEnginsMixte;

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
        transportMarchandises: calculateBreakdown(coutTransportMarchandisesClassique, coutTransportMarchandisesEco, coutTransportMarchandisesMixte),
        deplacementsPersonnel: calculateBreakdown(coutDeplacementsPersonnelClassique, coutDeplacementsPersonnelEco, coutDeplacementsPersonnelMixte),
        energie: calculateBreakdown(coutEnergieClassique, coutEnergieEco, coutEnergieMixte),
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
        transportMarchandises: calculateBreakdown(carboneTransportMarchandisesClassique, carboneTransportMarchandisesEco, carboneTransportMarchandisesMixte),
        deplacementsPersonnel: calculateBreakdown(carboneDeplacementsPersonnelClassique, carboneDeplacementsPersonnelEco, carboneDeplacementsPersonnelMixte),
        energie: calculateBreakdown(carboneEnergieClassique, carboneEnergieEco, carboneEnergieMixte),
        engins: { classique: carboneEnginsClassique, eco: carboneEnginsEco, mixte: carboneEnginsMixte },
      }
    },
    amortissement,
    amortissementMixte,
  };
}

    
