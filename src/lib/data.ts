import type { SimulationState } from '@/types';

export const projectTypes = ['Travaux', 'Services', 'Fourniture'];

export const defaultSimulationState: SimulationState = {
  projectType: 'Travaux',
  
  // Quantities
  volumeBeton: 1000, // m³
  poidsAcier: 50, // tonnes
  poidsCuivre: 5, // tonnes
  volumeEnrobes: 500, // m³
  kmTransportMarchandises: 10000,
  kmDeplacementsPersonnel: 5000,
  kwhEnergie: 20000,

  // Prices
  prixKwhDiesel: 0.25,
  prixBetonClassique: 150,
  prixBetonBasCarbone: 180,
  prixAcierClassique: 865,
  prixAcierBasCarbone: 925,
  prixEnrobeChaud: 80,
  prixEnrobeFroid: 90,
  prixCuivreClassique: 9000,
  prixCuivreRecycle: 8500, // Typically recycled is cheaper or similar
  prixKmCamionDiesel: 1.5,
  prixKmCamionElectrique: 1.2,
  prixKmVoitureEssence: 0.5,
  prixKmVoitureElectrique: 0.3,
  prixKmAutobusElectrique: 1.0,

  // CO2 Emissions (in tonnes CO2)
  co2EnginsClassique: 10,
  co2EnginsEco: 5,

  // Global parameters
  prixTonneCarbone: 100,
  dureeDeVie: 50,

  // Mixed percentages
  pctEcoBeton: 50,
  pctEcoAcier: 50,
  pctEcoCuivre: 50,
  pctEcoEnrobes: 50,
};

// Carbon footprints (in T eq CO₂ / unit)
export const carbonFootprints = {
  betonClassique: 0.150, // T CO2 / m³ - average value
  betonBasCarbone: 0.075, // T CO2 / m³
  acierClassique: 1.8, // T CO2 / tonne
  acierBasCarbone: 0.4, // T CO2 / tonne
  cuivreClassique: 4.5, // T CO2 / tonne
  cuivreRecycle: 1.5, // T CO2 / tonne (recycled copper has lower footprint)
  enrobeChaud: 0.05, // T CO2 / m³ (assuming density ~1 t/m³)
  enrobeFroid: 0.02, // T CO2 / m³ (assuming density ~1 t/m³)
  camionDiesel: 0.25 / 1000, // T CO2 / km, converting from kg to t
  camionElectrique: 0.05 / 1000, // T CO2 / km
  voitureEssence: 0.18 / 1000, // T CO2 / km
  voitureElectrique: 0.02 / 1000, // T CO2 / km
  autobusElectrique: 0.03 / 1000, // T CO2 / km
  kwhDiesel: 0.7 / 1000, // T CO2 / kWh from diesel generator
};
