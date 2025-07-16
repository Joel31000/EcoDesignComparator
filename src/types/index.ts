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
}

export interface Breakdown {
  classique: number;
  eco: number;
  diff: number;
}

export interface CalculationResults {
  cout: {
    totalClassique: number;
    totalEco: number;
    surcout: number;
    coutGlobalEcoAjuste: number;
    breakdown: {
      beton: Breakdown;
      acier: Breakdown;
      cuivre: Breakdown;
      enrobes: Breakdown;
      transportMarchandises: Breakdown;
      deplacementsPersonnel: Breakdown;
      energie: Breakdown;
      engins: Breakdown;
      coutCarbone: Breakdown;
    }
  },
  carbone: {
    totalClassique: number;
    totalEco: number;
    economieTCO2: number;
    economieEuros: number;
    breakdown: {
      beton: Breakdown;
      acier: Breakdown;
      cuivre: Breakdown;
      enrobes: Breakdown;
      transportMarchandises: Breakdown;
      deplacementsPersonnel: Breakdown;
      energie: Breakdown;
      engins: Breakdown;
    }
  },
  amortissement: number;
}
