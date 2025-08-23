import type { SimulationState, BetonBasCarboneOption, AcierOption, AluminiumOption } from '@/types';

export const projectTypes = ['Travaux', 'Services', 'Fourniture'];

export const betonBasCarboneOptions: BetonBasCarboneOption[] = [
  { name: 'CEM I (ATILH)', empreinte: 0.752 },
  { name: 'CEM II/A-LL ou LL (ATILH)', empreinte: 0.640 },
  { name: 'CEM II/A-S A-M et A-V (ATILH)', empreinte: 0.619 },
  { name: 'CEM II/B-L ou LL (ATILH)', empreinte: 0.547 },
  { name: 'CEM II/B-M CEM II/B-S (ATILH)', empreinte: 0.554 },
  { name: 'CEM III/A (ATILH)', empreinte: 0.467 },
  { name: 'CEM III/A PM et ES (ATILH)', empreinte: 0.334 },
  { name: 'CEM III/B (ATILH)', empreinte: 0.316 },
  { name: 'CEM III/C (ATILH)', empreinte: 0.199 },
  { name: 'CEM V/A (S-V) (ATILH)', empreinte: 0.479 },
  { name: 'CEM VI (ECOCEM)', empreinte: 0.417 },
  { name: 'CEM IV/A-P ( VICAT)', empreinte: 0.491 },
  { name: 'MCC1 MATERRUP 5DEP Materrup)', empreinte: 0.353 },
  { name: 'Liant H\'UKR Hoffman (MIE du produit)', empreinte: 0.252 },
  { name: 'Liant HEVA Hoffmann', empreinte: 0.272 },
  { name: 'Liant H-IONA Hoffmann', empreinte: 0.172 },
  { name: 'CEM I 52,5 R (Cem\'In\'Eu)', empreinte: 0.887 },
  { name: 'CEM II/A-LL-42 5 N (Cem\'In\'Eu)', empreinte: 0.743 },
  { name: 'CEM II/A-LL 42 5 R (Cem\'In\'Eu)', empreinte: 0.758 },
  { name: 'CEM II/B-LL-32 5-R (Cem\'In\'Eu)', empreinte: 0.625 },
  { name: 'CEM II/B-M-P-LL-42 5 N (Cem\'In\'Eu)', empreinte: 0.621 },
  { name: 'CEM II/C-M P-LL-32 5 R (Cem\'In\'Eu)', empreinte: 0.506 },
  { name: 'Liant V-BCN-0133H (Vicat)', empreinte: -0.153 },
  { name: 'Liant V-BCN-2402H (Vicat)', empreinte: -0.310 },
  { name: 'Laitier ( ECOCEM)', empreinte: 0.100 },
  { name: 'CEM III/A (ECOCEM Fos/Mer)', empreinte: 0.344 },
  { name: 'CEM III/B (ECOCEM Dunkerque)', empreinte: 0.331 },
  { name: 'CEM III/C (ECOCEM Fos/Mer)', empreinte: 0.203 },
  { name: 'CEM III/C (ECOCEM Dunkerque)', empreinte: 0.209 },
  { name: 'Ciment CSS (ECOCEM)', empreinte: 0.108 },
];

export const acierOptions: AcierOption[] = [
  { name: 'Acier filière haut fourneau (BOF)', empreinte: 1.8, displayValue: '1,8 teqCO₂/t' },
  { name: 'Acier filière four à arc électrique (EAF, recyclé)', empreinte: 0.425, displayValue: '0,35 – 0,5 teqCO₂/t' },
  { name: 'Acier «XCarb» (EAF, énergie renouvelable)', empreinte: 0.3, displayValue: '0,3 teqCO₂/t' },
  { name: 'Acier rebar (armature acier pour béton armé)', empreinte: 0.225, displayValue: '0,22 – 0,23 teqCO₂/t' },
  { name: 'Acier inoxydable (four électrique)', empreinte: 0.65, displayValue: '0,5 – 0,8 teqCO₂/t' },
  { name: 'Acier DRI-EAF (Réduction Directe Fer au gaz naturel, couplée EAF)', empreinte: 1.35, displayValue: '1,10 - 1,6 teqCO₂/t' },
  { name: 'Acier H2-DRI-EAF (Réduction Fer à l\'hydrogène vert, couplée EAF)', empreinte: 0.7, displayValue: '0,7 teqCO₂/t' },
];

export const aluminiumOptions: AluminiumOption[] = [
    { name: 'Aluminium primaire production base charbon', empreinte: 20, displayValue: '20 teqCO₂/t' },
    { name: 'Aluminium primaire européen', empreinte: 7.65, displayValue: '6,7 - 8,6 teqCO₂/t' },
    { name: 'Aluminium primaire français (décarbonée)', empreinte: 4.5, displayValue: '4,5 teqCO₂/t' },
    { name: 'Aluminium bas carbone certifié Hydro REDUXA', empreinte: 4.0, displayValue: '4,0 teqCO₂/t' },
    { name: 'Aluminium recyclé', empreinte: 0.51, displayValue: '0,5 - 0,52 teqCO₂/t' },
];

export const defaultSimulationState: SimulationState = {
  projectDescription: '',
  projectType: 'Travaux',
  projectLocation: '',
  projectGpsCoordinates: '',
  
  // Quantities
  volumeBeton: 1000, // m³
  poidsAcier: 50, // tonnes
  poidsCuivre: 5, // tonnes
  poidsAluminium: 5, // tonnes
  volumeEnrobes: 500, // m³
  volumeBetonEco: 1000,
  poidsAcierEco: 50,
  poidsCuivreEco: 5,
  poidsAluminiumEco: 5,
  volumeEnrobesEco: 500,

  kmTransportMarchandises: 10000,
  kmDeplacementsPersonnel: 5000,
  kwhEnergie: 20000,
  heuresHelicoptere: 0,

  // Prices
  prixKwhDiesel: 0.25,
  prixBetonClassique: 150,
  prixBetonBasCarbone: 180,
  prixArmatureAcierClassique: 0.6,
  prixArmatureAcierEco: 0.6,
  prixAcierClassique: 865,
  prixAcierBasCarbone: 925,
  prixEnrobeChaud: 80,
  prixEnrobeFroid: 90,
  prixCuivreClassique: 9000,
  prixCuivreRecycle: 8500,
  prixAluminiumClassique: 2500,
  prixAluminiumBasCarbone: 3000,
  prixKmCamionDiesel: 1.5,
  prixKmCamionElectrique: 1.2,
  prixKmVoitureEssence: 0.5,
  prixKmVoitureElectrique: 0.3,
  prixKmAutobusEssence: 1.2,
  prixKmAutobusElectrique: 1.0,
  prixHeureHelicoptere: 1440,

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
  pctEcoAluminium: 50,
  pctEcoEnrobes: 50,
  pctEcoDeplacements: 50,

  // Low carbon concrete
  betonBasCarboneEmpreinte: betonBasCarboneOptions[0].empreinte,
  masseBetonBasCarbone: 350, // kg
  isBetonArme: false,
  masseFerraillage: 100, // kg/m3
  facteurEmissionArmatureClassique: 1.2, // kgCO2eq/kg
  facteurEmissionArmatureEco: 1.2, // kgCO2eq/kg

  // Low carbon steel
  empreinteAcierBasCarbone: acierOptions[0].empreinte,

  // Low carbon aluminium
  empreinteAluminiumBasCarbone: aluminiumOptions[0].empreinte,
};

// Carbon footprints (in T eq CO₂ / unit)
export const carbonFootprints = {
  betonClassique: 0.800, // tCO2eq/m3
  acierClassique: 1.8, // T CO2 / tonne
  cuivreClassique: 4.5, // T CO2 / tonne
  cuivreRecycle: 1.5, // T CO2 / tonne
  aluminiumClassique: 20, // T CO2 / tonne
  enrobeChaud: 0.05, // T CO2 / m³ (assuming density ~1 t/m³)
  enrobeFroid: 0.02, // T CO2 / m³ (assuming density ~1 t/m³)
  camionDiesel: 0.25 / 1000, // T CO2 / km, converting from kg to t
  camionElectrique: 0.05 / 1000, // T CO2 / km
  voitureEssence: 250 / 1000000, // 250g/km -> t/km
  voitureElectrique: 100 / 1000000, // 100g/km -> t/km
  autobusEssence: 133 / 1000000, // 133g/km -> t/km
  autobusElectrique: 80 / 1000000, // 80g/km -> t/km
  kwhDiesel: 0.7 / 1000, // T CO2 / kWh from diesel generator
  helicoptere: 0.3, // T CO2 / heure (average of 200-400kg)
};
