export interface SimulationState {
  projectType: string;
  
  // Quantities
  volumeBeton: number;
  poidsAcier: number;
  poidsCuivre: number;
  volumeEnrobes: number;
  kmTransportMarchandises: number;
  kmDeplacementsPersonnel: number;
  kwhEnergie: number;

  // Prices
  prixKwhDiesel: number;
  prixBetonClassique: number;
  prixBetonBasCarbone: number;
  prixAcierClassique: number;
  prixAcierBasCarbone: number;
  prixEnrobeChaud: number;
  prixEnrobeFroid: number;
  prixCuivreClassique: number;
  prixCuivreRecycle: number;
  prixKmCamionDiesel: number;
  prixKmCamionElectrique: number;
  prixKmVoitureEssence: number;
  prixKmVoitureElectrique: number;
  prixKmAutobusElectrique: number;
  
  // CO2 Emissions
  co2EnginsClassique: number;
  co2EnginsEco: number;

  // Global parameters
  prixTonneCarbone: number;
  dureeDeVie: number;
  
  // Mixed percentages
  pctEcoBeton: number;
  pctEcoAcier: number;
  pctEcoCuivre: number;
  pctEcoEnrobes: number;
}

export interface Breakdown {
  classique: number;
  eco: number;
  mixte: number;
  diff: number; // eco vs classique
}

export interface CalculationResults {
  cout: {
    totalClassique: number;
    totalEco: number;
    totalMixte: number;
    surcout: number;
    surcoutMixte: number;
    coutGlobalEcoAjuste: number;
    coutGlobalMixteAjuste: number;
    breakdown: {
      beton: Breakdown;
      acier: Breakdown;
      cuivre: Breakdown;
      enrobes: Breakdown;
      transportMarchandises: Breakdown;
      deplacementsPersonnel: Breakdown;
      energie: Breakdown;
      engins: Breakdown;
      coutCarbone: Omit<Breakdown, 'mixte' | 'classique'> & { eco: number, mixte: number };
    }
  },
  carbone: {
    totalClassique: number;
    totalEco: number;
    totalMixte: number;
    economieTCO2: number;
    economieTCO2Mixte: number;
    economieEuros: number;
    economieEurosMixte: number;
    breakdown: {
      beton: Breakdown;
      acier: Breakdown;
      cuivre: Breakdown;
      enrobes: Breakdown;
      transportMarchandises: Breakdown;
      deplacementsPersonnel: Breakdown;
      energie: Breakdown;
      engins: Omit<Breakdown, 'mixte' | 'diff'>;
    }
  },
  amortissement: number;
  amortissementMixte: number;
}
