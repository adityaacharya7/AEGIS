/**
 * Project AEGIS - District Vulnerability DNA Registry
 * Comprehensive Meteorological Hindcast & Real-Time Uncertainty Knowledge Base
 * Ministry of Earth Sciences (MoES) / NCMRWF (SIH PS-26079)
 */

const DISTRICT_DATABASE = [
  {
    id: "ratnagiri",
    geo: [73.30, 16.99],
    name: "Ratnagiri",
    state: "Maharashtra",
    region: "Konkan Coastal Zone",
    primaryHazard: "rainfall",
    secondaryHazard: "cyclone",
    vulnerabilityDNA: {
      terrain: "Coastal Orographic Escarpment (Western Ghats)",
      sensitivitySeason: "Southwest Monsoon (July - August)",
      historicalBustRate: "42.8%",
      primaryFailureMode: "Mesoscale Offshore Vortex Stagnation & Orographic Lift Underestimation",
      elevationRange: "0 - 1,100 m"
    },
    leadTimes: {
      1: { nwpRain: 28, trust: 88, bustProb: 12, drift: 0.12, envelope: [22, 35], status: "high" },
      2: { nwpRain: 32, trust: 76, bustProb: 26, drift: 0.28, envelope: [25, 48], status: "med" },
      3: { nwpRain: 25, trust: 45, bustProb: 64, drift: 0.58, envelope: [60, 115], status: "low" },
      4: { nwpRain: 24, trust: 24, bustProb: 86, drift: 0.82, envelope: [110, 175], status: "crit" },
      5: { nwpRain: 18, trust: 19, bustProb: 91, drift: 0.89, envelope: [95, 185], status: "crit" },
      6: { nwpRain: 15, trust: 14, bustProb: 94, drift: 0.93, envelope: [80, 195], status: "crit" },
      7: { nwpRain: 12, trust: 11, bustProb: 96, drift: 0.95, envelope: [70, 210], status: "crit" },
      8: { nwpRain: 10, trust: 9,  bustProb: 97, drift: 0.97, envelope: [60, 220], status: "crit" },
      9: { nwpRain: 10, trust: 8,  bustProb: 98, drift: 0.98, envelope: [50, 230], status: "crit" },
      10: { nwpRain: 8,  trust: 7,  bustProb: 98, drift: 0.99, envelope: [40, 240], status: "crit" }
    },
    driftHistory: [
      { run: "T-72h", value: 38 },
      { run: "T-48h", value: 72 },
      { run: "T-24h", value: 145 },
      { run: "T-00h (Now)", value: 24 }
    ],
    shapReasons: [
      { feature: "Orographic Lifting Index (W. Ghats)", impact: "+34% Bust Risk", desc: "Sub-grid scale Ghats topography causes localized sudden cloud condensation not resolved by 4km NWP mesh." },
      { feature: "Bulk Wind Shear (850-200 hPa)", impact: "+26% Bust Risk", desc: "Strong cross-equatorial monsoon jet creates rapid shear instability over coastal Konkan." },
      { feature: "Low-Level Moisture Flux Convergence", impact: "+18% Bust Risk", desc: "Moisture trapped along shoreline exceeds NCUM boundary layer saturation threshold." },
      { feature: "Forecast Run Drift Index", impact: "+14% Bust Risk", desc: "Prediction jumped by >120mm between 12Z yesterday and 00Z today's model cycle." }
    ],
    synopticTwin: {
      title: "July 2019 Konkan Deluge Bust",
      date: "26-07-2019",
      similarity: "93%",
      summary: "NCUM predicted 35mm rain 4 days prior, but actual ground AWS recorded 214mm due to unmodeled offshore vortex stagnation.",
      errorDelta: "+179 mm"
    },
    sopPlaybook: [
      "Issue immediate Level-3 Forecast Inversion warning to Maharashtra SDMA.",
      "Pre-position NDRF Battalion 5 in Chiplun and Khed river basins.",
      "Activate coastal automatic rain gauges at 15-minute polling interval.",
      "Brief Konkan Railway authorities on landslide vulnerability along cuttings."
    ]
  },
  {
    id: "mumbai",
    geo: [72.88, 19.08],
    name: "Mumbai Suburban",
    state: "Maharashtra",
    region: "Konkan Coastal Zone",
    primaryHazard: "rainfall",
    secondaryHazard: "cyclone",
    vulnerabilityDNA: {
      terrain: "Dense Coastal Urban Estuary",
      sensitivitySeason: "Monsoon Inundation (June - July)",
      historicalBustRate: "39.4%",
      primaryFailureMode: "Urban Heat Island + Coastal Convective Convergence Underestimation",
      elevationRange: "0 - 120 m"
    },
    leadTimes: {
      1: { nwpRain: 45, trust: 85, bustProb: 15, drift: 0.15, envelope: [35, 60], status: "high" },
      2: { nwpRain: 50, trust: 72, bustProb: 30, drift: 0.32, envelope: [40, 85], status: "med" },
      3: { nwpRain: 30, trust: 48, bustProb: 62, drift: 0.54, envelope: [75, 140], status: "low" },
      4: { nwpRain: 28, trust: 28, bustProb: 82, drift: 0.78, envelope: [120, 190], status: "crit" },
      5: { nwpRain: 20, trust: 22, bustProb: 88, drift: 0.85, envelope: [100, 205], status: "crit" },
      6: { nwpRain: 18, trust: 16, bustProb: 92, drift: 0.90, envelope: [85, 215], status: "crit" },
      7: { nwpRain: 15, trust: 12, bustProb: 95, drift: 0.94, envelope: [70, 225], status: "crit" },
      8: { nwpRain: 12, trust: 10, bustProb: 97, drift: 0.96, envelope: [55, 235], status: "crit" },
      9: { nwpRain: 10, trust: 8,  bustProb: 98, drift: 0.98, envelope: [45, 245], status: "crit" },
      10: { nwpRain: 10, trust: 7,  bustProb: 98, drift: 0.99, envelope: [35, 255], status: "crit" }
    },
    driftHistory: [
      { run: "T-72h", value: 40 },
      { run: "T-48h", value: 85 },
      { run: "T-24h", value: 160 },
      { run: "T-00h (Now)", value: 28 }
    ],
    shapReasons: [
      { feature: "Offshore Trough Convergence", impact: "+31% Bust Risk", desc: "Narrow trough line along Arabian sea coast oscillates rapidly between model runs." },
      { feature: "High CAPE Instability (3,200 J/kg)", impact: "+27% Bust Risk", desc: "Extreme convective energy triggers localized intense cloudbursts uncaptured in grid averages." },
      { feature: "Tidal Phase Coupling", impact: "+16% Bust Risk", desc: "High tide synchronization with convective cells amplifies drainage backflow risk." }
    ],
    synopticTwin: {
      title: "August 2017 Urban Deluge Pattern",
      date: "29-08-2017",
      similarity: "91%",
      summary: "Model forecast indicated light showers (30mm); stationary mesoscale convective vortex caused 315mm.",
      errorDelta: "+285 mm"
    },
    sopPlaybook: [
      "Alert Municipal Corporation of Greater Mumbai (BMC) Disaster Management Cell.",
      "High tide synchronization protocol: activate 6 major pumping stations.",
      "Pre-deploy suburban railway emergency de-watering teams at Kurla & Sion."
    ]
  },
  {
    id: "wayanad",
    geo: [76.13, 11.69],
    name: "Wayanad",
    state: "Kerala",
    region: "High Ranges & Nilgiri Biosphere",
    primaryHazard: "rainfall",
    secondaryHazard: "western_disturbance",
    vulnerabilityDNA: {
      terrain: "Steep Tropical Mountain Range",
      sensitivitySeason: "Southwest Monsoon Peaks (July - August)",
      historicalBustRate: "46.2%",
      primaryFailureMode: "Cloudburst Underestimation & Slope Saturation Trigger Failure",
      elevationRange: "700 - 2,100 m"
    },
    leadTimes: {
      1: { nwpRain: 60, trust: 82, bustProb: 18, drift: 0.20, envelope: [50, 75], status: "high" },
      2: { nwpRain: 65, trust: 69, bustProb: 35, drift: 0.38, envelope: [55, 95], status: "med" },
      3: { nwpRain: 40, trust: 38, bustProb: 72, drift: 0.65, envelope: [90, 160], status: "low" },
      4: { nwpRain: 32, trust: 21, bustProb: 89, drift: 0.84, envelope: [140, 220], status: "crit" },
      5: { nwpRain: 25, trust: 17, bustProb: 92, drift: 0.88, envelope: [120, 240], status: "crit" },
      6: { nwpRain: 20, trust: 13, bustProb: 95, drift: 0.92, envelope: [100, 260], status: "crit" },
      7: { nwpRain: 18, trust: 10, bustProb: 97, drift: 0.96, envelope: [85, 275], status: "crit" },
      8: { nwpRain: 15, trust: 8,  bustProb: 98, drift: 0.97, envelope: [70, 290], status: "crit" },
      9: { nwpRain: 12, trust: 6,  bustProb: 99, drift: 0.98, envelope: [55, 305], status: "crit" },
      10: { nwpRain: 10, trust: 5,  bustProb: 99, drift: 0.99, envelope: [45, 320], status: "crit" }
    },
    driftHistory: [
      { run: "T-72h", value: 35 },
      { run: "T-48h", value: 95 },
      { run: "T-24h", value: 180 },
      { run: "T-00h (Now)", value: 32 }
    ],
    shapReasons: [
      { feature: "Orographic Wind Funneling", impact: "+38% Bust Risk", desc: "Palghat gap & Nilgiri escarpment accelerate southwest monsoon clouds into narrow valleys." },
      { feature: "Soil Moisture Antecedent Saturation", impact: "+24% Bust Risk", desc: "Catchment soil reached 94% saturation, magnifying flash flood danger even with moderate rain." },
      { feature: "Low-Level Jet Core Divergence", impact: "+20% Bust Risk", desc: "Model failed to track vertical velocity updrafts along windward slopes." }
    ],
    synopticTwin: {
      title: "July 2024 Chooralmala Landslide Cloudburst Bust",
      date: "30-07-2024",
      similarity: "95%",
      summary: "Medium-range model forecasted normal monsoon rain (40mm); localized extreme convective surge dumped over 300mm within 24 hours.",
      errorDelta: "+260 mm"
    },
    sopPlaybook: [
      "Issue urgent Red Alert for tea estate settlements in Meppadi & Chooralmala.",
      "Initiate mandatory precautionary night evacuations from landslide hazard zones.",
      "Stage SDRF search-and-rescue teams at Kalpetta base."
    ]
  },
  {
    id: "cuttack",
    geo: [85.88, 20.46],
    name: "Cuttack & Puri Coast",
    state: "Odisha",
    region: "Bay of Bengal Coastal Arc",
    primaryHazard: "cyclone",
    secondaryHazard: "rainfall",
    vulnerabilityDNA: {
      terrain: "Low-lying Deltaic Coastline",
      sensitivitySeason: "Depressions & Post-Monsoon Cyclones (Sept - Nov)",
      historicalBustRate: "37.5%",
      primaryFailureMode: "Bay of Bengal Rapid Intensification & Track Inversion",
      elevationRange: "0 - 45 m"
    },
    leadTimes: {
      1: { nwpRain: 30, trust: 87, bustProb: 13, drift: 0.14, envelope: [24, 38], status: "high" },
      2: { nwpRain: 40, trust: 74, bustProb: 28, drift: 0.30, envelope: [30, 58], status: "med" },
      3: { nwpRain: 55, trust: 52, bustProb: 55, drift: 0.50, envelope: [45, 95], status: "med" },
      4: { nwpRain: 35, trust: 32, bustProb: 76, drift: 0.72, envelope: [90, 150], status: "low" },
      5: { nwpRain: 22, trust: 25, bustProb: 84, drift: 0.80, envelope: [80, 165], status: "crit" },
      6: { nwpRain: 18, trust: 19, bustProb: 89, drift: 0.86, envelope: [70, 180], status: "crit" },
      7: { nwpRain: 15, trust: 15, bustProb: 93, drift: 0.91, envelope: [60, 195], status: "crit" },
      8: { nwpRain: 12, trust: 12, bustProb: 95, drift: 0.94, envelope: [50, 210], status: "crit" },
      9: { nwpRain: 10, trust: 10, bustProb: 96, drift: 0.96, envelope: [40, 220], status: "crit" },
      10: { nwpRain: 10, trust: 8,  bustProb: 97, drift: 0.98, envelope: [35, 230], status: "crit" }
    },
    driftHistory: [
      { run: "T-72h", value: 20 },
      { run: "T-48h", value: 65 },
      { run: "T-24h", value: 110 },
      { run: "T-00h (Now)", value: 35 }
    ],
    shapReasons: [
      { feature: "Sea Surface Temperature Anomaly (>30.5°C)", impact: "+29% Bust Risk", desc: "Warmer northern Bay of Bengal fuels rapid moisture intensification beyond GFS parameterization." },
      { feature: "Monsoon Depression Track Recurvature", impact: "+25% Bust Risk", desc: "Models historically pull system westward into MP; actual track often clings to Odisha coast." },
      { feature: "Mahanadi Basin Discharge Delay", impact: "+17% Bust Risk", desc: "Hydrological compound flooding risk unaccounted in atmospheric model." }
    ],
    synopticTwin: {
      title: "Cyclone Titli / Jawad Track Stalling Bust",
      date: "11-10-2018",
      similarity: "88%",
      summary: "Model forecast indicated weakening depression; sudden landfall moisture burst caused +140mm rainfall mismatch.",
      errorDelta: "+138 mm"
    },
    sopPlaybook: [
      "Alert Odisha State Disaster Management Authority (OSDMA).",
      "Inspect sluice gates across Mahanadi barrage network in Cuttack.",
      "Deploy coastal shelter management teams in Puri and Jagatsinghpur."
    ]
  },
  {
    id: "shimla",
    geo: [77.17, 31.10],
    name: "Shimla & Mandi",
    state: "Himachal Pradesh",
    region: "Western Himalayan Complex",
    primaryHazard: "western_disturbance",
    secondaryHazard: "rainfall",
    vulnerabilityDNA: {
      terrain: "Complex Alpine River Valley",
      sensitivitySeason: "Monsoon & Western Disturbance Overlap (July - August)",
      historicalBustRate: "48.1%",
      primaryFailureMode: "Western Disturbance + Monsoon Trough Convective Cloudburst",
      elevationRange: "1,200 - 3,800 m"
    },
    leadTimes: {
      1: { nwpRain: 35, trust: 84, bustProb: 16, drift: 0.16, envelope: [28, 45], status: "high" },
      2: { nwpRain: 45, trust: 70, bustProb: 32, drift: 0.34, envelope: [35, 70], status: "med" },
      3: { nwpRain: 30, trust: 42, bustProb: 68, drift: 0.60, envelope: [70, 130], status: "low" },
      4: { nwpRain: 22, trust: 26, bustProb: 84, drift: 0.81, envelope: [95, 170], status: "crit" },
      5: { nwpRain: 18, trust: 20, bustProb: 89, drift: 0.87, envelope: [85, 180], status: "crit" },
      6: { nwpRain: 14, trust: 15, bustProb: 93, drift: 0.91, envelope: [75, 195], status: "crit" },
      7: { nwpRain: 12, trust: 11, bustProb: 95, drift: 0.95, envelope: [65, 210], status: "crit" },
      8: { nwpRain: 10, trust: 9,  bustProb: 97, drift: 0.97, envelope: [55, 220], status: "crit" },
      9: { nwpRain: 8,  trust: 7,  bustProb: 98, drift: 0.98, envelope: [45, 230], status: "crit" },
      10: { nwpRain: 8,  trust: 6,  bustProb: 99, drift: 0.99, envelope: [35, 240], status: "crit" }
    },
    driftHistory: [
      { run: "T-72h", value: 30 },
      { run: "T-48h", value: 78 },
      { run: "T-24h", value: 135 },
      { run: "T-00h (Now)", value: 22 }
    ],
    shapReasons: [
      { feature: "Sub-Tropical Jet Trough Interaction", impact: "+36% Bust Risk", desc: "Upper-tropospheric westerly trough phase-locks with moist easterly monsoon winds." },
      { feature: "Steep Mountain Valley Confinement", impact: "+28% Bust Risk", desc: "Beas/Sutlej river gorges trap moisture, producing cloudbursts undetected in 12km models." },
      { feature: "Freezing Level Height Anomaly", impact: "+16% Bust Risk", desc: "Higher zero-degree isotherm converts snow accumulation to torrential runoff." }
    ],
    synopticTwin: {
      title: "July 2023 Beas Basin Cloudburst Bust",
      date: "09-07-2023",
      similarity: "94%",
      summary: "NCUM Day-4 forecast predicted 45mm rain; dual-system interaction dumped 280mm, devastating Kullu and Mandi.",
      errorDelta: "+235 mm"
    },
    sopPlaybook: [
      "Alert Himachal Pradesh State Emergency Operations Centre (SEOC).",
      "Issue travel advisory restricting NH-21 (Chandigarh-Manali) transport.",
      "Alert dam authorities at Bhakra and Pandoh for emergency reservoir outflow scheduling."
    ]
  },
  {
    id: "kutch",
    geo: [69.86, 23.24],
    name: "Kutch & Jamnagar",
    state: "Gujarat",
    region: "Arid Coastal Basin",
    primaryHazard: "cyclone",
    secondaryHazard: "heatwave",
    vulnerabilityDNA: {
      terrain: "Salt Marsh & Coastal Lowland",
      sensitivitySeason: "Arabian Sea Cyclones (May - June, Oct - Nov)",
      historicalBustRate: "35.2%",
      primaryFailureMode: "Cyclone Landfall Track Recurvature & Wind Speed Bust",
      elevationRange: "0 - 150 m"
    },
    leadTimes: {
      1: { nwpRain: 15, trust: 90, bustProb: 10, drift: 0.10, envelope: [10, 20], status: "high" },
      2: { nwpRain: 25, trust: 78, bustProb: 24, drift: 0.25, envelope: [18, 35], status: "med" },
      3: { nwpRain: 35, trust: 56, bustProb: 50, drift: 0.46, envelope: [25, 65], status: "med" },
      4: { nwpRain: 20, trust: 35, bustProb: 74, drift: 0.70, envelope: [65, 120], status: "low" },
      5: { nwpRain: 15, trust: 26, bustProb: 82, drift: 0.79, envelope: [55, 135], status: "crit" },
      6: { nwpRain: 12, trust: 21, bustProb: 87, drift: 0.85, envelope: [45, 150], status: "crit" },
      7: { nwpRain: 10, trust: 16, bustProb: 91, drift: 0.90, envelope: [35, 165], status: "crit" },
      8: { nwpRain: 8,  trust: 13, bustProb: 94, drift: 0.93, envelope: [25, 180], status: "crit" },
      9: { nwpRain: 6,  trust: 11, bustProb: 96, drift: 0.96, envelope: [20, 190], status: "crit" },
      10: { nwpRain: 5,  trust: 9,  bustProb: 97, drift: 0.98, envelope: [15, 200], status: "crit" }
    },
    driftHistory: [
      { run: "T-72h", value: 12 },
      { run: "T-48h", value: 45 },
      { run: "T-24h", value: 85 },
      { run: "T-00h (Now)", value: 20 }
    ],
    shapReasons: [
      { feature: "Steering Flow Ridge Anomaly", impact: "+33% Bust Risk", desc: "Anticyclonic ridge over Rajasthan determines whether cyclone hits Gujarat or curves to Pakistan." },
      { feature: "Dry Air Intrusion from Thar Desert", impact: "+24% Bust Risk", desc: "Dry continental entrainment suddenly collapses or fragments convective core." },
      { feature: "Shallow Coastal Bathymetry", impact: "+18% Bust Risk", desc: "Rann of Kutch inundation dynamics poorly modeled in hydrostatic NWP schemes." }
    ],
    synopticTwin: {
      title: "Extremely Severe Cyclone Biparjoy (2023)",
      date: "15-06-2023",
      similarity: "92%",
      summary: "Ensemble models oscillated between Karachi and Mandvi landfall with a 350km spread at Day 4 lead time.",
      errorDelta: "+115 km track drift"
    },
    sopPlaybook: [
      "Issue Special Advisory to Kandla and Mundra Port Trust.",
      "Initiate zero-casualty evacuation drills for fishing villages along Mandvi coast.",
      "Deploy 4 additional NDRF teams to Bhuj and Gandhidham."
    ]
  },
  {
    id: "barmer",
    geo: [71.39, 25.75],
    name: "Barmer & Jodhpur",
    state: "Rajasthan",
    region: "Thar Arid Zone",
    primaryHazard: "heatwave",
    secondaryHazard: "fog",
    vulnerabilityDNA: {
      terrain: "Arid Sandy Plain & Dunes",
      sensitivitySeason: "Pre-Monsoon & Heatwave (April - June)",
      historicalBustRate: "28.4%",
      primaryFailureMode: "Extreme Temperature Anomaly Underestimation (>47°C)",
      elevationRange: "100 - 300 m"
    },
    leadTimes: {
      1: { nwpRain: 0, trust: 92, bustProb: 8,  drift: 0.08, envelope: [44, 46], status: "high" },
      2: { nwpRain: 0, trust: 85, bustProb: 16, drift: 0.18, envelope: [45, 47], status: "high" },
      3: { nwpRain: 0, trust: 72, bustProb: 32, drift: 0.35, envelope: [45, 48], status: "med" },
      4: { nwpRain: 0, trust: 58, bustProb: 52, drift: 0.52, envelope: [46, 50], status: "med" },
      5: { nwpRain: 0, trust: 44, bustProb: 65, drift: 0.68, envelope: [47, 51], status: "low" },
      6: { nwpRain: 0, trust: 36, bustProb: 74, drift: 0.76, envelope: [47, 52], status: "low" },
      7: { nwpRain: 0, trust: 28, bustProb: 81, drift: 0.84, envelope: [47, 52], status: "crit" },
      8: { nwpRain: 0, trust: 22, bustProb: 86, drift: 0.89, envelope: [47, 53], status: "crit" },
      9: { nwpRain: 0, trust: 18, bustProb: 90, drift: 0.93, envelope: [47, 53], status: "crit" },
      10: { nwpRain: 0, trust: 15, bustProb: 92, drift: 0.96, envelope: [47, 54], status: "crit" }
    },
    driftHistory: [
      { run: "T-72h", value: 43 },
      { run: "T-48h", value: 45 },
      { run: "T-24h", value: 47 },
      { run: "T-00h (Now)", value: 49 }
    ],
    shapReasons: [
      { feature: "Soil Moisture Depletion Feedback", impact: "+35% Bust Risk", desc: "Sensible heat flux increases exponentially as topsoil moisture approaches zero." },
      { feature: "Subsidence Inversion Cap", impact: "+26% Bust Risk", desc: "Anticyclonic downward air motion traps surface heat dome." },
      { feature: "Albedo Radiation Balance", impact: "+18% Bust Risk", desc: "Thar sand reflection properties modified during dust storms." }
    ],
    synopticTwin: {
      title: "May 2024 Record Northwest India Heatwave",
      date: "28-05-2024",
      similarity: "90%",
      summary: "Forecast suggested 46°C; heat dome trapping caused Barmer/Churu to hit 49.8°C.",
      errorDelta: "+3.8°C Temperature Bust"
    },
    sopPlaybook: [
      "Trigger Municipal Heat Action Plan (HAP) Level Red.",
      "Adjust outdoor labour work hours (ban 11 AM - 4 PM).",
      "Deploy municipal water tankers and oral rehydration salt (ORS) kiosks."
    ]
  },
  {
    id: "patna",
    geo: [85.14, 25.61],
    name: "Patna & Gangetic Basin",
    state: "Bihar",
    region: "Middle Gangetic Plain",
    primaryHazard: "fog",
    secondaryHazard: "rainfall",
    vulnerabilityDNA: {
      terrain: "Alluvial Floodplain",
      sensitivitySeason: "Winter Fog Inversion & Monsoon Trough Shifting",
      historicalBustRate: "33.7%",
      primaryFailureMode: "Boundary Layer Radiation Fog Dissipation & Trough Inversion",
      elevationRange: "40 - 70 m"
    },
    leadTimes: {
      1: { nwpRain: 12, trust: 89, bustProb: 11, drift: 0.11, envelope: [8, 16], status: "high" },
      2: { nwpRain: 18, trust: 76, bustProb: 26, drift: 0.28, envelope: [12, 28], status: "med" },
      3: { nwpRain: 25, trust: 62, bustProb: 44, drift: 0.45, envelope: [16, 45], status: "med" },
      4: { nwpRain: 15, trust: 40, bustProb: 68, drift: 0.65, envelope: [35, 80], status: "low" },
      5: { nwpRain: 10, trust: 30, bustProb: 78, drift: 0.76, envelope: [30, 95], status: "low" },
      6: { nwpRain: 8,  trust: 24, bustProb: 84, drift: 0.83, envelope: [25, 110], status: "crit" },
      7: { nwpRain: 6,  trust: 18, bustProb: 88, drift: 0.89, envelope: [20, 125], status: "crit" },
      8: { nwpRain: 5,  trust: 14, bustProb: 92, drift: 0.93, envelope: [15, 140], status: "crit" },
      9: { nwpRain: 5,  trust: 11, bustProb: 95, drift: 0.96, envelope: [10, 150], status: "crit" },
      10: { nwpRain: 5,  trust: 8,  bustProb: 97, drift: 0.98, envelope: [10, 160], status: "crit" }
    },
    driftHistory: [
      { run: "T-72h", value: 10 },
      { run: "T-48h", value: 28 },
      { run: "T-24h", value: 60 },
      { run: "T-00h (Now)", value: 15 }
    ],
    shapReasons: [
      { feature: "Monsoon Trough Northward Axis Shift", impact: "+32% Bust Risk", desc: "Break monsoon transition shifts heavy rain belt from central plains abruptly to Nepal foothills." },
      { feature: "Aerosol Optical Depth (AOD) Feedback", impact: "+22% Bust Risk", desc: "High atmospheric aerosol concentration suppresses warm cloud droplet coalescence." },
      { feature: "Upstream Nepal Catchment Inflow", impact: "+19% Bust Risk", desc: "Transboundary river basin flooding occurs without local rainfall." }
    ],
    synopticTwin: {
      title: "Break Monsoon Foothills Surge (August 2021)",
      date: "14-08-2021",
      similarity: "87%",
      summary: "Forecast showed normal rainfall over plain; sudden trough migration northward caused severe Koshi/Gandak flooding.",
      errorDelta: "+95 mm localized shift"
    },
    sopPlaybook: [
      "Coordinate transboundary river level data with Nepal Hydrology Department.",
      "Monitor Koshi and Bagmati barrage discharge rates.",
      "Prepare flood relief centers in low-lying riparian districts."
    ]
  },
  {
    id: "chennai",
    geo: [80.27, 13.08],
    name: "Chennai & Nellore",
    state: "Tamil Nadu",
    region: "Coromandel Coastal Belt",
    primaryHazard: "rainfall",
    secondaryHazard: "cyclone",
    vulnerabilityDNA: {
      terrain: "Coastal Lagoon & Flat Plain",
      sensitivitySeason: "Northeast Monsoon (October - December)",
      historicalBustRate: "36.8%",
      primaryFailureMode: "Easterly Wave Convective Pulsing & Radar Echo Discrepancy",
      elevationRange: "0 - 30 m"
    },
    leadTimes: {
      1: { nwpRain: 20, trust: 86, bustProb: 14, drift: 0.14, envelope: [15, 28], status: "high" },
      2: { nwpRain: 28, trust: 75, bustProb: 27, drift: 0.28, envelope: [20, 42], status: "med" },
      3: { nwpRain: 35, trust: 54, bustProb: 52, drift: 0.50, envelope: [30, 75], status: "med" },
      4: { nwpRain: 22, trust: 33, bustProb: 75, drift: 0.72, envelope: [70, 135], status: "low" },
      5: { nwpRain: 18, trust: 24, bustProb: 83, drift: 0.81, envelope: [60, 150], status: "crit" },
      6: { nwpRain: 15, trust: 18, bustProb: 88, drift: 0.87, envelope: [50, 165], status: "crit" },
      7: { nwpRain: 12, trust: 14, bustProb: 92, drift: 0.92, envelope: [40, 180], status: "crit" },
      8: { nwpRain: 10, trust: 10, bustProb: 95, drift: 0.95, envelope: [30, 195], status: "crit" },
      9: { nwpRain: 8,  trust: 8,  bustProb: 97, drift: 0.97, envelope: [25, 210], status: "crit" },
      10: { nwpRain: 8,  trust: 6,  bustProb: 98, drift: 0.99, envelope: [20, 220], status: "crit" }
    },
    driftHistory: [
      { run: "T-72h", value: 18 },
      { run: "T-48h", value: 50 },
      { run: "T-24h", value: 92 },
      { run: "T-00h (Now)", value: 22 }
    ],
    shapReasons: [
      { feature: "Easterly Wave Stagnation", impact: "+30% Bust Risk", desc: "Low-pressure troughs embedded in trade easterlies slow down near shoreline." },
      { feature: "Urban Micro-Catchment Saturation", impact: "+25% Bust Risk", desc: "Impervious urban surface causes instant street inundation from even 40mm spells." },
      { feature: "Coromandel Sea Surface Warm Pool", impact: "+19% Bust Risk", desc: "High ocean heat content fuels nocturnal coastal convective cloud bands." }
    ],
    synopticTwin: {
      title: "Cyclone Michaung Track Stall (2023)",
      date: "04-12-2023",
      similarity: "89%",
      summary: "Cyclone Michaung looped 90km off Chennai coast longer than NWP track models predicted, dumping 450mm rain in 36h.",
      errorDelta: "+240 mm"
    },
    sopPlaybook: [
      "Review Chembarambakkam and Poondi reservoir discharge thresholds.",
      "Activate Greater Chennai Corporation (GCC) smart flood sensor network.",
      "Clear stormwater drains in Velachery and Madipakkam flood basins."
    ]
  }
];

// Calculate National Summary Statistics for a Given Lead Day & Optional Hazard Filter
function calculateNationalStats(leadDay = 4, hazard = null) {
  let totalTrust = 0;
  let criticalCount = 0;
  let maxDrift = 0;

  let targetList = DISTRICT_DATABASE;
  if (hazard && hazard !== "all") {
    const matching = DISTRICT_DATABASE.filter(d => d.primaryHazard === hazard || d.secondaryHazard === hazard);
    if (matching.length > 0) targetList = matching;
  }

  targetList.forEach(district => {
    const data = district.leadTimes[leadDay] || district.leadTimes[4];
    totalTrust += data.trust;
    if (data.bustProb > 70) criticalCount++;
    if (data.drift > maxDrift) maxDrift = data.drift;
  });

  return {
    meanTrust: (totalTrust / targetList.length).toFixed(1),
    criticalDistricts: criticalCount,
    maxDriftIndex: maxDrift.toFixed(2),
    totalMonitored: targetList.length,
    activeHazard: hazard || "rainfall"
  };
}
