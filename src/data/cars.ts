import { CarModelDef, CrateDefinition, Rarity, CarSet } from '../types';

export const RARITY_CONFIG: Record<Rarity, { label: string; color: string; bgGradient: string; glow: string }> = {
  Common: {
    label: 'Common',
    color: '#94a3b8',
    bgGradient: 'linear-gradient(135deg, #334155, #1e293b)',
    glow: 'rgba(148, 163, 184, 0.4)'
  },
  Uncommon: {
    label: 'Uncommon',
    color: '#22c55e',
    bgGradient: 'linear-gradient(135deg, #15803d, #14532d)',
    glow: 'rgba(34, 197, 94, 0.55)'
  },
  Rare: {
    label: 'Rare',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
    glow: 'rgba(59, 130, 246, 0.7)'
  },
  Epic: {
    label: 'Epic',
    color: '#a855f7',
    bgGradient: 'linear-gradient(135deg, #7e22ce, #581c87)',
    glow: 'rgba(168, 85, 247, 0.85)'
  },
  Legendary: {
    label: 'Legendary',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #b45309, #78350f)',
    glow: 'rgba(245, 158, 11, 0.95)'
  },
  Mythic: {
    label: 'Mythic',
    color: '#ef4444',
    bgGradient: 'linear-gradient(135deg, #b91c1c, #7f1d1d)',
    glow: 'rgba(239, 68, 68, 1.0)'
  },
  Exclusive: {
    label: 'Exclusive',
    color: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, #0e7490, #164e63)',
    glow: 'rgba(6, 182, 212, 1.0)'
  }
};

export const CAR_SETS: CarSet[] = [
  { id: 'set_hatch_heroes', name: 'Hot Hatch Heroes', description: 'Pocket rockets, agile chassis and city sprinters', carIds: [], rewardCash: 25000, rewardXp: 800, rewardTitle: 'City Sprinter' },
  { id: 'set_jdm_legends', name: 'JDM Heritage', description: 'The golden age of Japanese motorsport and midnight touge', carIds: [], rewardCash: 75000, rewardXp: 2500, rewardTitle: 'Midnight Touge Legend' },
  { id: 'set_muscle_power', name: 'American V8 Thunder', description: 'Big block displacement, superchargers and quarter-mile smoke', carIds: [], rewardCash: 60000, rewardXp: 2000, rewardTitle: 'V8 Brawler' },
  { id: 'set_supercar_icons', name: 'Exotic Apex Society', description: 'European mid-engine aero, howling V10/V12 acoustics', carIds: [], rewardCash: 150000, rewardXp: 4500, rewardTitle: 'Exotic Sovereign' },
  { id: 'set_hyper_gods', name: 'Hypercar Valhalla', description: '300+ mph land missiles and engineering triumphs', carIds: [], rewardCash: 500000, rewardXp: 12000, rewardTitle: 'Crown Apex Sovereign' },
  { id: 'set_classics', name: 'Vintage Grand Prix', description: 'Timeless curves and legendary collector pedigrees', carIds: [], rewardCash: 100000, rewardXp: 3200, rewardTitle: 'Vintage Connoisseur' }
];

export const CAR_CATALOG: CarModelDef[] = [
  {
    "id": "car_pulse_gl",
    "name": "Pulse Hatch GL",
    "brand": "Kanto",
    "rarity": "Common",
    "basePrice": 2800,
    "stats": {
      "topSpeed": 172,
      "acceleration": 8.4,
      "handling": 100,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#64748b",
    "bodyType": "hatchback",
    "soundPitch": 1.258,
    "description": "Everyday commuter hero with peppy front-wheel response.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_corsa_s",
    "name": "Vanguard Echo 1.4",
    "brand": "Vanguard",
    "rarity": "Common",
    "basePrice": 2950,
    "stats": {
      "topSpeed": 168,
      "acceleration": 8.8,
      "handling": 100,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#0284c7",
    "bodyType": "hatchback",
    "soundPitch": 1.252,
    "description": "Popular compact hatchback designed for tight city alleys.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_clio_sport",
    "name": "Alpine Vitesse S",
    "brand": "Monaco",
    "rarity": "Common",
    "basePrice": 3400,
    "stats": {
      "topSpeed": 185,
      "acceleration": 7.6,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#eab308",
    "bodyType": "hatchback",
    "soundPitch": 1.2775,
    "description": "Nimble European hot hatch revered by street learners.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_fiesta_st",
    "name": "Cyclone ST Hatch",
    "brand": "Valor",
    "rarity": "Common",
    "basePrice": 3600,
    "stats": {
      "topSpeed": 192,
      "acceleration": 7.2,
      "handling": 98,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#ef4444",
    "bodyType": "hatchback",
    "soundPitch": 1.288,
    "description": "Punchy turbocharged 3-cylinder with eager turn-in.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_polo_gt",
    "name": "Autowerk Sprint GT",
    "brand": "Autowerk",
    "rarity": "Common",
    "basePrice": 3200,
    "stats": {
      "topSpeed": 180,
      "acceleration": 7.9,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#10b981",
    "bodyType": "hatchback",
    "soundPitch": 1.27,
    "description": "Solid German engineering in an ultra-reliable frame.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_swift_rs",
    "name": "Hayate RS Sport",
    "brand": "Shinsei",
    "rarity": "Common",
    "basePrice": 3100,
    "stats": {
      "topSpeed": 182,
      "acceleration": 7.8,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#f97316",
    "bodyType": "hatchback",
    "soundPitch": 1.2730000000000001,
    "description": "Featherweight curb weight delivers joyful apex handling.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_civic_eg",
    "name": "Kanto Kanjo Hatch",
    "brand": "Kanto",
    "rarity": "Common",
    "basePrice": 3800,
    "stats": {
      "topSpeed": 190,
      "acceleration": 7.4,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#a855f7",
    "bodyType": "hatchback",
    "soundPitch": 1.285,
    "description": "Loop one legend that dominated midnight highway runs.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_golf_mk4",
    "name": "Autowerk IV Trend",
    "brand": "Autowerk",
    "rarity": "Common",
    "basePrice": 3500,
    "stats": {
      "topSpeed": 188,
      "acceleration": 7.7,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#334155",
    "bodyType": "hatchback",
    "soundPitch": 1.282,
    "description": "Classic 2000s icon beloved by stance enthusiasts.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_yaris_t",
    "name": "Kanto Vitz TS",
    "brand": "Kanto",
    "rarity": "Common",
    "basePrice": 3300,
    "stats": {
      "topSpeed": 184,
      "acceleration": 7.9,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#38bdf8",
    "bodyType": "hatchback",
    "soundPitch": 1.276,
    "description": "Bulletproof engine reliability with punchy gearing.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_miata_na",
    "name": "Mazurka Spirito NA",
    "brand": "Mazurka",
    "rarity": "Common",
    "basePrice": 4200,
    "stats": {
      "topSpeed": 195,
      "acceleration": 7.1,
      "handling": 98,
      "braking": 61,
      "driftFactor": 82
    },
    "bodyColor": "#dc2626",
    "bodyType": "sports",
    "soundPitch": 1.2925,
    "description": "Pop-up headlight roadster offering pure analog rear-wheel fun.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_miata_nb",
    "name": "Mazurka Spirito NB",
    "brand": "Mazurka",
    "rarity": "Common",
    "basePrice": 4400,
    "stats": {
      "topSpeed": 198,
      "acceleration": 6.9,
      "handling": 98,
      "braking": 61,
      "driftFactor": 82
    },
    "bodyColor": "#059669",
    "bodyType": "sports",
    "soundPitch": 1.297,
    "description": "Sculpted lightweight chassis tuned for weekend canyon carves.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_sedan_crown",
    "name": "Kanto Century Crown",
    "brand": "Kanto",
    "rarity": "Common",
    "basePrice": 3900,
    "stats": {
      "topSpeed": 190,
      "acceleration": 8,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#1e293b",
    "bodyType": "sedan",
    "soundPitch": 1.285,
    "description": "Quiet executive comfort cruising with soft rear suspension."
  },
  {
    "id": "car_corolla_ae",
    "name": "Kanto Sprinter Levin",
    "brand": "Kanto",
    "rarity": "Common",
    "basePrice": 4600,
    "stats": {
      "topSpeed": 186,
      "acceleration": 7.5,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#f8fafc",
    "bodyType": "classic",
    "soundPitch": 1.279,
    "description": "Twin-cam high-revving coupe with balanced rear-drive geometry.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_integra_ls",
    "name": "Shinsei Integra LS",
    "brand": "Shinsei",
    "rarity": "Common",
    "basePrice": 4100,
    "stats": {
      "topSpeed": 194,
      "acceleration": 7.3,
      "handling": 98,
      "braking": 61,
      "driftFactor": 82
    },
    "bodyColor": "#2563eb",
    "bodyType": "sports",
    "soundPitch": 1.291,
    "description": "Sharp front-wheel grip that punches well above its class."
  },
  {
    "id": "car_prelude_si",
    "name": "Shinsei Prelude Si",
    "brand": "Shinsei",
    "rarity": "Common",
    "basePrice": 4300,
    "stats": {
      "topSpeed": 198,
      "acceleration": 7.1,
      "handling": 98,
      "braking": 61,
      "driftFactor": 82
    },
    "bodyColor": "#7c3aed",
    "bodyType": "sports",
    "soundPitch": 1.297,
    "description": "Low-slung 90s coupe with four-wheel steer legacy."
  },
  {
    "id": "car_volvo_240",
    "name": "Nordic Iron 240",
    "brand": "Nordic",
    "rarity": "Common",
    "basePrice": 3200,
    "stats": {
      "topSpeed": 170,
      "acceleration": 9.2,
      "handling": 100,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#b91c1c",
    "bodyType": "classic",
    "soundPitch": 1.255,
    "description": "Indestructible Swedish brick chassis favored by grassroots drift racers.",
    "setId": "set_classics"
  },
  {
    "id": "car_bmw_e36_compact",
    "name": "Autowerk 318 Compact",
    "brand": "Autowerk",
    "rarity": "Common",
    "basePrice": 3700,
    "stats": {
      "topSpeed": 195,
      "acceleration": 7.5,
      "handling": 98,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#0d9488",
    "bodyType": "hatchback",
    "soundPitch": 1.2925,
    "description": "Shortened wheelbase Bavarian chassis with lively oversteer."
  },
  {
    "id": "car_peugeot_206",
    "name": "Gallic Lion 206",
    "brand": "Gallic",
    "rarity": "Common",
    "basePrice": 2900,
    "stats": {
      "topSpeed": 175,
      "acceleration": 8.6,
      "handling": 100,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#9333ea",
    "bodyType": "hatchback",
    "soundPitch": 1.2625,
    "description": "Rally-heritage curved styling in an affordable city footprint.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_mini_cooper",
    "name": "Albion Cooper S Classic",
    "brand": "Albion",
    "rarity": "Common",
    "basePrice": 4500,
    "stats": {
      "topSpeed": 178,
      "acceleration": 8.1,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#15803d",
    "bodyType": "classic",
    "soundPitch": 1.267,
    "description": "Go-kart handling dynamics that conquered the Monte Carlo rally.",
    "setId": "set_classics"
  },
  {
    "id": "car_beetle_classic",
    "name": "Autowerk Käfer 1300",
    "brand": "Autowerk",
    "rarity": "Common",
    "basePrice": 3800,
    "stats": {
      "topSpeed": 145,
      "acceleration": 11.5,
      "handling": 100,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#d97706",
    "bodyType": "classic",
    "soundPitch": 1.2175,
    "description": "Air-cooled rear-engine icon with unmistakable rounded profile.",
    "setId": "set_classics"
  },
  {
    "id": "car_crown_vic",
    "name": "Valor Interceptor 4.6",
    "brand": "Valor",
    "rarity": "Common",
    "basePrice": 3500,
    "stats": {
      "topSpeed": 190,
      "acceleration": 8.5,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#1e293b",
    "bodyType": "sedan",
    "soundPitch": 1.285,
    "description": "Heavy body-on-frame American workhorse cruiser."
  },
  {
    "id": "car_caprice_classic",
    "name": "Valor Caprice Brougham",
    "brand": "Valor",
    "rarity": "Common",
    "basePrice": 3600,
    "stats": {
      "topSpeed": 185,
      "acceleration": 9,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#4b5563",
    "bodyType": "classic",
    "soundPitch": 1.2775,
    "description": "Velvet-smooth highway cruiser with cavernous cabin space.",
    "setId": "set_classics"
  },
  {
    "id": "car_subaru_legacy",
    "name": "Subsonic Legacy AWD",
    "brand": "Subsonic",
    "rarity": "Common",
    "basePrice": 4100,
    "stats": {
      "topSpeed": 196,
      "acceleration": 7.4,
      "handling": 98,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#1d4ed8",
    "bodyType": "sedan",
    "soundPitch": 1.294,
    "description": "Symmetrical all-wheel traction for all-season city driving."
  },
  {
    "id": "car_is200",
    "name": "Kanto Altezza RS",
    "brand": "Kanto",
    "rarity": "Common",
    "basePrice": 4700,
    "stats": {
      "topSpeed": 205,
      "acceleration": 7,
      "handling": 98,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#6d28d9",
    "bodyType": "sedan",
    "soundPitch": 1.3074999999999999,
    "description": "Chronograph dials, inline engine, and rear-drive poise.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_celica_gt",
    "name": "Kanto Celica Liftback",
    "brand": "Kanto",
    "rarity": "Common",
    "basePrice": 4400,
    "stats": {
      "topSpeed": 198,
      "acceleration": 7.2,
      "handling": 98,
      "braking": 61,
      "driftFactor": 82
    },
    "bodyColor": "#be123c",
    "bodyType": "sports",
    "soundPitch": 1.297,
    "description": "Streamlined aerodynamic liftback styling with crisp steering."
  },
  {
    "id": "car_alfa_147",
    "name": "Milano Quadrifoglio 147",
    "brand": "Milano",
    "rarity": "Common",
    "basePrice": 3700,
    "stats": {
      "topSpeed": 192,
      "acceleration": 7.7,
      "handling": 98,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#dc2626",
    "bodyType": "hatchback",
    "soundPitch": 1.288,
    "description": "Italian soul and spirited rev-happy engine acoustics.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_focus_zx3",
    "name": "Valor Focus Track",
    "brand": "Valor",
    "rarity": "Common",
    "basePrice": 3100,
    "stats": {
      "topSpeed": 180,
      "acceleration": 8.2,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#0284c7",
    "bodyType": "hatchback",
    "soundPitch": 1.27,
    "description": "Control blade independent rear suspension gives sublime corner balance.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_mazda_3",
    "name": "Mazurka 3 Hatchback",
    "brand": "Mazurka",
    "rarity": "Common",
    "basePrice": 3400,
    "stats": {
      "topSpeed": 188,
      "acceleration": 7.8,
      "handling": 99,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#991b1b",
    "bodyType": "hatchback",
    "soundPitch": 1.282,
    "description": "Sleek Kodo design aesthetic and intuitive gear shifter feel.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_honda_crx",
    "name": "Shinsei CRX Ballade",
    "brand": "Shinsei",
    "rarity": "Common",
    "basePrice": 4600,
    "stats": {
      "topSpeed": 194,
      "acceleration": 7.3,
      "handling": 98,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#16a34a",
    "bodyType": "classic",
    "soundPitch": 1.291,
    "description": "Ultra-light 2-seater hatch celebrated by golden-era tuners.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_datsun_b210",
    "name": "Shinsei Sunny Coupe",
    "brand": "Shinsei",
    "rarity": "Common",
    "basePrice": 3900,
    "stats": {
      "topSpeed": 165,
      "acceleration": 9.8,
      "handling": 100,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#ca8a04",
    "bodyType": "classic",
    "soundPitch": 1.2475,
    "description": "Vintage lightweight Japanese rear-wheel drive runabout.",
    "setId": "set_classics"
  },
  {
    "id": "car_fiat_500_abarth",
    "name": "Torino Scorpion 500",
    "brand": "Torino",
    "rarity": "Common",
    "basePrice": 4800,
    "stats": {
      "topSpeed": 202,
      "acceleration": 6.8,
      "handling": 98,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#f8fafc",
    "bodyType": "hatchback",
    "soundPitch": 1.303,
    "description": "Angry Italian pocket rocket with rowdy dual exhaust pop.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_suzuki_cappuccino",
    "name": "Hayate Espresso Kei",
    "brand": "Hayate",
    "rarity": "Common",
    "basePrice": 4500,
    "stats": {
      "topSpeed": 170,
      "acceleration": 8,
      "handling": 100,
      "braking": 61,
      "driftFactor": 82
    },
    "bodyColor": "#06b6d4",
    "bodyType": "sports",
    "soundPitch": 1.255,
    "description": "660cc turbocharged micro roadster delivering giant-slaying fun."
  },
  {
    "id": "car_e30_318i",
    "name": "Autowerk 3-Series E30",
    "brand": "Autowerk",
    "rarity": "Common",
    "basePrice": 4900,
    "stats": {
      "topSpeed": 196,
      "acceleration": 7.6,
      "handling": 98,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#374151",
    "bodyType": "classic",
    "soundPitch": 1.294,
    "description": "The quintessential 80s sports sedan profile with timeless lines.",
    "setId": "set_classics"
  },
  {
    "id": "car_nissan_s12",
    "name": "Shinsei Silvia Gazelle",
    "brand": "Shinsei",
    "rarity": "Common",
    "basePrice": 4700,
    "stats": {
      "topSpeed": 195,
      "acceleration": 7.4,
      "handling": 98,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#475569",
    "bodyType": "classic",
    "soundPitch": 1.2925,
    "description": "Angular notchback silhouette bridging classic vintage and drift culture.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_saab_900_turbo",
    "name": "Aero Viking 900 Turbo",
    "brand": "Nordic",
    "rarity": "Common",
    "basePrice": 4800,
    "stats": {
      "topSpeed": 200,
      "acceleration": 7.5,
      "handling": 98,
      "braking": 61,
      "driftFactor": 55
    },
    "bodyColor": "#1e3a8a",
    "bodyType": "classic",
    "soundPitch": 1.3,
    "description": "Aviation-inspired cockpit and aggressive front-biased boost rush.",
    "setId": "set_classics"
  },
  {
    "id": "car_gt86_apex",
    "name": "Apex Drift-86",
    "brand": "Kanto",
    "rarity": "Uncommon",
    "basePrice": 9500,
    "stats": {
      "topSpeed": 226,
      "acceleration": 6.2,
      "handling": 100,
      "braking": 62,
      "driftFactor": 95
    },
    "bodyColor": "#ea580c",
    "bodyType": "drift",
    "soundPitch": 1.339,
    "description": "Renowned drift icon with instantaneous weight transfer.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_mustang_fox",
    "name": "Thunderbolt 5.0 Fox",
    "brand": "Valor",
    "rarity": "Uncommon",
    "basePrice": 11000,
    "stats": {
      "topSpeed": 232,
      "acceleration": 5.6,
      "handling": 96,
      "braking": 63,
      "driftFactor": 55
    },
    "bodyColor": "#1e3a8a",
    "bodyType": "muscle",
    "soundPitch": 1.3479999999999999,
    "description": "Notchback American V8 hero of drag strips and stoplights.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_camaro_z28_3rd",
    "name": "Stallion IROC-Z",
    "brand": "Valor",
    "rarity": "Uncommon",
    "basePrice": 10800,
    "stats": {
      "topSpeed": 230,
      "acceleration": 5.8,
      "handling": 96,
      "braking": 63,
      "driftFactor": 55
    },
    "bodyColor": "#dc2626",
    "bodyType": "muscle",
    "soundPitch": 1.345,
    "description": "Ground-effects muscle coupe with low aerodynamic rumble.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_civic_type_r_ek9",
    "name": "Kanto Championship EK9",
    "brand": "Kanto",
    "rarity": "Uncommon",
    "basePrice": 14000,
    "stats": {
      "topSpeed": 235,
      "acceleration": 5.9,
      "handling": 96,
      "braking": 64,
      "driftFactor": 55
    },
    "bodyColor": "#f8fafc",
    "bodyType": "hatchback",
    "soundPitch": 1.3525,
    "description": "Hand-ported cylinder head screaming past 8,500 RPM.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_s13_240sx",
    "name": "Shinsei S13 Silvia",
    "brand": "Shinsei",
    "rarity": "Uncommon",
    "basePrice": 13500,
    "stats": {
      "topSpeed": 228,
      "acceleration": 6.1,
      "handling": 100,
      "braking": 63,
      "driftFactor": 95
    },
    "bodyColor": "#0284c7",
    "bodyType": "drift",
    "soundPitch": 1.342,
    "description": "The backbone of grassroots drift competitions globally.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_s14_kouki",
    "name": "Shinsei S14 Kouki",
    "brand": "Shinsei",
    "rarity": "Uncommon",
    "basePrice": 15500,
    "stats": {
      "topSpeed": 238,
      "acceleration": 5.7,
      "handling": 100,
      "braking": 64,
      "driftFactor": 95
    },
    "bodyColor": "#7c3aed",
    "bodyType": "drift",
    "soundPitch": 1.357,
    "description": "Aggressive face-lifted drift weapon with wide rear quarters.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_wrx_classic",
    "name": "Subsonic Impreza Turbo",
    "brand": "Subsonic",
    "rarity": "Uncommon",
    "basePrice": 14500,
    "stats": {
      "topSpeed": 240,
      "acceleration": 5.3,
      "handling": 96,
      "braking": 64,
      "driftFactor": 82
    },
    "bodyColor": "#2563eb",
    "bodyType": "sports",
    "soundPitch": 1.3599999999999999,
    "description": "Boxer rumble and rally-proven center differential grip.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_mitsubishi_evo4",
    "name": "Lancer Evolution IV",
    "brand": "Shinsei",
    "rarity": "Uncommon",
    "basePrice": 16000,
    "stats": {
      "topSpeed": 245,
      "acceleration": 5.1,
      "handling": 95,
      "braking": 64,
      "driftFactor": 82
    },
    "bodyColor": "#ffffff",
    "bodyType": "sports",
    "soundPitch": 1.3675,
    "description": "Active Yaw Control tech engineered for gravel and wet asphalt.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_golf_r32",
    "name": "Autowerk R32 4Motion",
    "brand": "Autowerk",
    "rarity": "Uncommon",
    "basePrice": 15000,
    "stats": {
      "topSpeed": 246,
      "acceleration": 5.8,
      "handling": 95,
      "braking": 64,
      "driftFactor": 55
    },
    "bodyColor": "#1e40af",
    "bodyType": "hatchback",
    "soundPitch": 1.369,
    "description": "Symphonic 3.2L VR6 roar mated to surefooted AWD.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_focus_rs_mk2",
    "name": "Valor RS Green Hell",
    "brand": "Valor",
    "rarity": "Uncommon",
    "basePrice": 16500,
    "stats": {
      "topSpeed": 250,
      "acceleration": 5.4,
      "handling": 95,
      "braking": 64,
      "driftFactor": 55
    },
    "bodyColor": "#16a34a",
    "bodyType": "hatchback",
    "soundPitch": 1.375,
    "description": "Wide-body 5-cylinder hot hatch with blistering highway pace.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_megane_rs",
    "name": "Monaco Trophy R",
    "brand": "Monaco",
    "rarity": "Uncommon",
    "basePrice": 14800,
    "stats": {
      "topSpeed": 248,
      "acceleration": 5.5,
      "handling": 95,
      "braking": 64,
      "driftFactor": 55
    },
    "bodyColor": "#facc15",
    "bodyType": "hatchback",
    "soundPitch": 1.3719999999999999,
    "description": "Ring lap-record challenger with cup chassis track damping.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_bmw_e46_330ci",
    "name": "Autowerk Clubsport 3.0",
    "brand": "Autowerk",
    "rarity": "Uncommon",
    "basePrice": 12500,
    "stats": {
      "topSpeed": 242,
      "acceleration": 6,
      "handling": 95,
      "braking": 63,
      "driftFactor": 82
    },
    "bodyColor": "#475569",
    "bodyType": "sports",
    "soundPitch": 1.363,
    "description": "Silky smooth inline-6 with perfectly balanced 50:50 chassis balance."
  },
  {
    "id": "car_audi_s3",
    "name": "Ingolstadt S-Quattro",
    "brand": "Ingolstadt",
    "rarity": "Uncommon",
    "basePrice": 13800,
    "stats": {
      "topSpeed": 245,
      "acceleration": 5.2,
      "handling": 95,
      "braking": 63,
      "driftFactor": 55
    },
    "bodyColor": "#e11d48",
    "bodyType": "hatchback",
    "soundPitch": 1.3675,
    "description": "Subtle stealth styling hiding ferocious all-weather turbo pull.",
    "setId": "set_hatch_heroes"
  },
  {
    "id": "car_dodge_charger_rt_70",
    "name": "Dominator 440 RT",
    "brand": "Valor",
    "rarity": "Uncommon",
    "basePrice": 18000,
    "stats": {
      "topSpeed": 220,
      "acceleration": 5.5,
      "handling": 97,
      "braking": 65,
      "driftFactor": 55
    },
    "bodyColor": "#b91c1c",
    "bodyType": "classic",
    "soundPitch": 1.33,
    "description": "Concealed headlights and big-block American quarter-mile heritage.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_pontiac_transam",
    "name": "Firebird Bandit Special",
    "brand": "Valor",
    "rarity": "Uncommon",
    "basePrice": 17500,
    "stats": {
      "topSpeed": 218,
      "acceleration": 5.7,
      "handling": 97,
      "braking": 64,
      "driftFactor": 55
    },
    "bodyColor": "#090d16",
    "bodyType": "classic",
    "soundPitch": 1.327,
    "description": "Iconic screaming gold eagle hood decal and T-top roof.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_chevrolet_chevelle_ss",
    "name": "Valor Chevelle SS 454",
    "brand": "Valor",
    "rarity": "Uncommon",
    "basePrice": 19000,
    "stats": {
      "topSpeed": 224,
      "acceleration": 5.3,
      "handling": 97,
      "braking": 65,
      "driftFactor": 55
    },
    "bodyColor": "#1e3a8a",
    "bodyType": "classic",
    "soundPitch": 1.336,
    "description": "The golden heavyweight of the classic American muscle car wars.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_datsun_240z",
    "name": "Shinsei Fairlady 240Z",
    "brand": "Shinsei",
    "rarity": "Uncommon",
    "basePrice": 18500,
    "stats": {
      "topSpeed": 215,
      "acceleration": 6.8,
      "handling": 97,
      "braking": 65,
      "driftFactor": 55
    },
    "bodyColor": "#ea580c",
    "bodyType": "classic",
    "soundPitch": 1.3225,
    "description": "Timeless long hood fastback silhouette that redefined sports coupes.",
    "setId": "set_classics"
  },
  {
    "id": "car_toyota_celica_gt4",
    "name": "Kanto GT-Four WRC",
    "brand": "Kanto",
    "rarity": "Uncommon",
    "basePrice": 16800,
    "stats": {
      "topSpeed": 244,
      "acceleration": 5.4,
      "handling": 95,
      "braking": 64,
      "driftFactor": 82
    },
    "bodyColor": "#ffffff",
    "bodyType": "sports",
    "soundPitch": 1.366,
    "description": "Aggressive hood vents and all-trac rally championship DNA.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_mazda_rx8",
    "name": "Mazurka Renesis RX",
    "brand": "Mazurka",
    "rarity": "Uncommon",
    "basePrice": 11500,
    "stats": {
      "topSpeed": 236,
      "acceleration": 6.2,
      "handling": 96,
      "braking": 63,
      "driftFactor": 82
    },
    "bodyColor": "#0d9488",
    "bodyType": "sports",
    "soundPitch": 1.354,
    "description": "High-revving rotary powerplant with freestyle suicide rear doors."
  },
  {
    "id": "car_nissan_350z",
    "name": "Shinsei 350 Track",
    "brand": "Shinsei",
    "rarity": "Uncommon",
    "basePrice": 13200,
    "stats": {
      "topSpeed": 248,
      "acceleration": 5.4,
      "handling": 100,
      "braking": 63,
      "driftFactor": 95
    },
    "bodyColor": "#ca8a04",
    "bodyType": "drift",
    "soundPitch": 1.3719999999999999,
    "description": "Deep V6 exhaust bark and an unbreakable rear differential.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_mercedes_190e",
    "name": "Stuttgart Evo Cosworth",
    "brand": "Stuttgart",
    "rarity": "Uncommon",
    "basePrice": 19500,
    "stats": {
      "topSpeed": 235,
      "acceleration": 6.4,
      "handling": 96,
      "braking": 65,
      "driftFactor": 55
    },
    "bodyColor": "#18181b",
    "bodyType": "classic",
    "soundPitch": 1.3525,
    "description": "Homologation touring car royalty with flared fenders and rear wing.",
    "setId": "set_classics"
  },
  {
    "id": "car_bmw_e30_m3",
    "name": "Autowerk M3 Heritage",
    "brand": "Autowerk",
    "rarity": "Uncommon",
    "basePrice": 21000,
    "stats": {
      "topSpeed": 238,
      "acceleration": 6.1,
      "handling": 96,
      "braking": 65,
      "driftFactor": 55
    },
    "bodyColor": "#dc2626",
    "bodyType": "classic",
    "soundPitch": 1.357,
    "description": "Box-flared arches and rev-happy 4-cylinder DTM championship icon.",
    "setId": "set_classics"
  },
  {
    "id": "car_jaguar_e_type",
    "name": "Coventry Series 1 Roadster",
    "brand": "Coventry",
    "rarity": "Uncommon",
    "basePrice": 22000,
    "stats": {
      "topSpeed": 228,
      "acceleration": 6.7,
      "handling": 96,
      "braking": 66,
      "driftFactor": 55
    },
    "bodyColor": "#15803d",
    "bodyType": "classic",
    "soundPitch": 1.342,
    "description": "Described by Enzo Ferrari as the most beautiful car ever crafted.",
    "setId": "set_classics"
  },
  {
    "id": "car_alfa_romeo_gtv",
    "name": "Milano Stepnose 2000",
    "brand": "Milano",
    "rarity": "Uncommon",
    "basePrice": 17000,
    "stats": {
      "topSpeed": 205,
      "acceleration": 7.4,
      "handling": 98,
      "braking": 64,
      "driftFactor": 55
    },
    "bodyColor": "#991b1b",
    "bodyType": "classic",
    "soundPitch": 1.3074999999999999,
    "description": "Twin-cam vocal brilliance wrapped in Bertone coachwork lines.",
    "setId": "set_classics"
  },
  {
    "id": "car_lancia_delta_integrale",
    "name": "Turino HF Integrale",
    "brand": "Turino",
    "rarity": "Uncommon",
    "basePrice": 23000,
    "stats": {
      "topSpeed": 235,
      "acceleration": 5.2,
      "handling": 96,
      "braking": 66,
      "driftFactor": 55
    },
    "bodyColor": "#be123c",
    "bodyType": "classic",
    "soundPitch": 1.3525,
    "description": "Six consecutive World Rally championships in one boxy frame.",
    "setId": "set_classics"
  },
  {
    "id": "car_subaru_brz_ts",
    "name": "Subsonic BRZ tS Spec",
    "brand": "Subsonic",
    "rarity": "Uncommon",
    "basePrice": 14200,
    "stats": {
      "topSpeed": 230,
      "acceleration": 6,
      "handling": 100,
      "braking": 64,
      "driftFactor": 95
    },
    "bodyColor": "#0ea5e9",
    "bodyType": "drift",
    "soundPitch": 1.345,
    "description": "Sachs suspension and Brembo package for razor precision carving."
  },
  {
    "id": "car_skyline_r32",
    "name": "Shinsei Skyline GT-R R32",
    "brand": "Shinsei",
    "rarity": "Rare",
    "basePrice": 42000,
    "stats": {
      "topSpeed": 260,
      "acceleration": 4.7,
      "handling": 94,
      "braking": 71,
      "driftFactor": 82
    },
    "bodyColor": "#475569",
    "bodyType": "sports",
    "soundPitch": 1.3900000000000001,
    "description": "The original Godzilla that went undefeated in Australian touring cars.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_skyline_r33",
    "name": "Shinsei Skyline GT-R R33",
    "brand": "Shinsei",
    "rarity": "Rare",
    "basePrice": 45000,
    "stats": {
      "topSpeed": 265,
      "acceleration": 4.6,
      "handling": 94,
      "braking": 71,
      "driftFactor": 82
    },
    "bodyColor": "#2563eb",
    "bodyType": "sports",
    "soundPitch": 1.3975,
    "description": "Sub-8 minute Nürburgring weapon with aerodynamic high-speed stability.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_toyota_supra_a80",
    "name": "Kanto Supra Twin-Turbo",
    "brand": "Kanto",
    "rarity": "Rare",
    "basePrice": 58000,
    "stats": {
      "topSpeed": 275,
      "acceleration": 4.4,
      "handling": 94,
      "braking": 75,
      "driftFactor": 82
    },
    "bodyColor": "#f8fafc",
    "bodyType": "sports",
    "soundPitch": 1.4125,
    "description": "2JZ iron block powerhouse capable of holding legendary boost levels.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_mazda_rx7_fd",
    "name": "Mazurka RX-7 Efini FD",
    "brand": "Mazurka",
    "rarity": "Rare",
    "basePrice": 54000,
    "stats": {
      "topSpeed": 265,
      "acceleration": 4.8,
      "handling": 94,
      "braking": 74,
      "driftFactor": 82
    },
    "bodyColor": "#eab308",
    "bodyType": "sports",
    "soundPitch": 1.3975,
    "description": "Twin-rotor sequential turbo magic inside a timeless aerodynamic sculpture.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_honda_nsx_na1",
    "name": "Shinsei NSX Midship V6",
    "brand": "Shinsei",
    "rarity": "Rare",
    "basePrice": 65000,
    "stats": {
      "topSpeed": 270,
      "acceleration": 4.9,
      "handling": 94,
      "braking": 76,
      "driftFactor": 55
    },
    "bodyColor": "#dc2626",
    "bodyType": "supercar",
    "soundPitch": 1.405,
    "description": "All-aluminum supercar developed with feedback from Ayrton Senna.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_bmw_m3_e46_csl",
    "name": "Autowerk M3 CSL Lightweight",
    "brand": "Autowerk",
    "rarity": "Rare",
    "basePrice": 59000,
    "stats": {
      "topSpeed": 280,
      "acceleration": 4.5,
      "handling": 93,
      "braking": 75,
      "driftFactor": 82
    },
    "bodyColor": "#94a3b8",
    "bodyType": "sports",
    "soundPitch": 1.42,
    "description": "Carbon airbox intake acoustics and pure mechanical connection."
  },
  {
    "id": "car_bmw_m5_e60_v10",
    "name": "Autowerk M5 V10 Autobahn",
    "brand": "Autowerk",
    "rarity": "Rare",
    "basePrice": 52000,
    "stats": {
      "topSpeed": 305,
      "acceleration": 4.2,
      "handling": 92,
      "braking": 73,
      "driftFactor": 55
    },
    "bodyColor": "#1e293b",
    "bodyType": "sedan",
    "soundPitch": 1.4575,
    "description": "F1-inspired screaming V10 engine hidden inside an executive executive cruiser."
  },
  {
    "id": "car_c63_amg_w204",
    "name": "Stuttgart C63 AMG 6.2 V8",
    "brand": "Stuttgart",
    "rarity": "Rare",
    "basePrice": 48000,
    "stats": {
      "topSpeed": 290,
      "acceleration": 4.3,
      "handling": 93,
      "braking": 72,
      "driftFactor": 55
    },
    "bodyColor": "#090d16",
    "bodyType": "muscle",
    "soundPitch": 1.435,
    "description": "Naturally aspirated 6.2L sledgehammer engine with violent exhaust bark.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_corvette_c6_z06",
    "name": "Valor C6 Z06 7.0L",
    "brand": "Valor",
    "rarity": "Rare",
    "basePrice": 56000,
    "stats": {
      "topSpeed": 318,
      "acceleration": 3.7,
      "handling": 91,
      "braking": 74,
      "driftFactor": 55
    },
    "bodyColor": "#f59e0b",
    "bodyType": "supercar",
    "soundPitch": 1.4769999999999999,
    "description": "Massive 427 cubic-inch V8 power in an ultra-lightweight aluminum chassis.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_dodge_viper_gts",
    "name": "Viper GTS V10 Coupe",
    "brand": "Valor",
    "rarity": "Rare",
    "basePrice": 68000,
    "stats": {
      "topSpeed": 310,
      "acceleration": 3.9,
      "handling": 91,
      "braking": 77,
      "driftFactor": 55
    },
    "bodyColor": "#1e3a8a",
    "bodyType": "supercar",
    "soundPitch": 1.4649999999999999,
    "description": "Blue with white stripes. 8.0L venomous V10 with zero electronic nannies.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_shelby_gt500_eleanor",
    "name": "Shelby GT500 Fastback 67",
    "brand": "Valor",
    "rarity": "Rare",
    "basePrice": 78000,
    "stats": {
      "topSpeed": 245,
      "acceleration": 4.8,
      "handling": 95,
      "braking": 80,
      "driftFactor": 55
    },
    "bodyColor": "#64748b",
    "bodyType": "classic",
    "soundPitch": 1.3675,
    "description": "The most desirable muscle car silhouette in cinema and collector lore.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_porsche_930_turbo",
    "name": "Kaiser 930 Turbo Widowmaker",
    "brand": "Kaiser",
    "rarity": "Rare",
    "basePrice": 75000,
    "stats": {
      "topSpeed": 275,
      "acceleration": 4.9,
      "handling": 94,
      "braking": 79,
      "driftFactor": 55
    },
    "bodyColor": "#10b981",
    "bodyType": "classic",
    "soundPitch": 1.4125,
    "description": "Whale-tail spoiler, sudden boost lag, and hair-raising rear-engine dynamics.",
    "setId": "set_classics"
  },
  {
    "id": "car_ferrari_testarossa",
    "name": "Modena Testarossa 512",
    "brand": "Modena",
    "rarity": "Rare",
    "basePrice": 82000,
    "stats": {
      "topSpeed": 290,
      "acceleration": 5.1,
      "handling": 93,
      "braking": 81,
      "driftFactor": 55
    },
    "bodyColor": "#dc2626",
    "bodyType": "classic",
    "soundPitch": 1.435,
    "description": "Side strake cheese graters and flat-12 Miami Vice 80s icon.",
    "setId": "set_classics"
  },
  {
    "id": "car_lamborghini_countach",
    "name": "Toro Countach 5000 QV",
    "brand": "Toro",
    "rarity": "Rare",
    "basePrice": 92000,
    "stats": {
      "topSpeed": 295,
      "acceleration": 4.7,
      "handling": 92,
      "braking": 83,
      "driftFactor": 55
    },
    "bodyColor": "#ffffff",
    "bodyType": "classic",
    "soundPitch": 1.4425,
    "description": "The original wedge poster car that pioneered dramatic scissor doors.",
    "setId": "set_classics"
  },
  {
    "id": "car_nissan_silvia_s15_spec_r",
    "name": "Shinsei S15 Mona Lisa",
    "brand": "Shinsei",
    "rarity": "Rare",
    "basePrice": 46000,
    "stats": {
      "topSpeed": 260,
      "acceleration": 5,
      "handling": 100,
      "braking": 72,
      "driftFactor": 95
    },
    "bodyColor": "#0284c7",
    "bodyType": "drift",
    "soundPitch": 1.3900000000000001,
    "description": "The Mona Lisa of the drift world with razor front styling and 6-speed box.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_audi_rs4_b7",
    "name": "Ingolstadt RS4 High-Rev V8",
    "brand": "Ingolstadt",
    "rarity": "Rare",
    "basePrice": 44000,
    "stats": {
      "topSpeed": 285,
      "acceleration": 4.5,
      "handling": 93,
      "braking": 71,
      "driftFactor": 55
    },
    "bodyColor": "#334155",
    "bodyType": "sedan",
    "soundPitch": 1.4275,
    "description": "8,250 RPM manual V8 estate with rear-biased Quattro magic."
  },
  {
    "id": "car_mercedes_sl65_amg",
    "name": "Stuttgart SL65 V12 BiTurbo",
    "brand": "Stuttgart",
    "rarity": "Rare",
    "basePrice": 62000,
    "stats": {
      "topSpeed": 320,
      "acceleration": 3.9,
      "handling": 91,
      "braking": 76,
      "driftFactor": 55
    },
    "bodyColor": "#71717a",
    "bodyType": "supercar",
    "soundPitch": 1.48,
    "description": "Earth-shaking 1,000 Nm of torque that evaporates rear tires at will."
  },
  {
    "id": "car_aston_martin_db9",
    "name": "Gaydon DB9 Grand Tourer",
    "brand": "Gaydon",
    "rarity": "Rare",
    "basePrice": 66000,
    "stats": {
      "topSpeed": 300,
      "acceleration": 4.4,
      "handling": 92,
      "braking": 77,
      "driftFactor": 55
    },
    "bodyColor": "#0f766e",
    "bodyType": "supercar",
    "soundPitch": 1.45,
    "description": "Hand-crafted British luxury coupe with an operatic 6.0L V12 exhaust."
  },
  {
    "id": "car_lotus_exige_cup",
    "name": "Norfolk Cup 380 Supercharged",
    "brand": "Norfolk",
    "rarity": "Rare",
    "basePrice": 51000,
    "stats": {
      "topSpeed": 285,
      "acceleration": 3.8,
      "handling": 93,
      "braking": 73,
      "driftFactor": 82
    },
    "bodyColor": "#facc15",
    "bodyType": "sports",
    "soundPitch": 1.4275,
    "description": "Simplify, then add lightness. Unassisted steering track weapon."
  },
  {
    "id": "car_alfa_romeo_8c",
    "name": "Milano 8C Competizione",
    "brand": "Milano",
    "rarity": "Rare",
    "basePrice": 88000,
    "stats": {
      "topSpeed": 295,
      "acceleration": 4.1,
      "handling": 92,
      "braking": 82,
      "driftFactor": 55
    },
    "bodyColor": "#b91c1c",
    "bodyType": "supercar",
    "soundPitch": 1.4425,
    "description": "Carbon fiber coachbuilt curves and a bespoke Maserati-tuned V8.",
    "setId": "set_classics"
  },
  {
    "id": "car_r34_vspec2",
    "name": "Shinsei Skyline R34 V-Spec II",
    "brand": "Shinsei",
    "rarity": "Epic",
    "basePrice": 165000,
    "stats": {
      "topSpeed": 285,
      "acceleration": 4.1,
      "handling": 93,
      "braking": 100,
      "driftFactor": 82
    },
    "bodyColor": "#2563eb",
    "bodyType": "sports",
    "soundPitch": 1.4275,
    "description": "Bayside Blue perfection. Carbon bonnet and MFD digital telemetry.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_porsche_gt3_997",
    "name": "Kaiser 911 GT3 RS 4.0",
    "brand": "Kaiser",
    "rarity": "Epic",
    "basePrice": 210000,
    "stats": {
      "topSpeed": 312,
      "acceleration": 3.5,
      "handling": 91,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#f8fafc",
    "bodyType": "supercar",
    "soundPitch": 1.468,
    "description": "The holy grail of naturally aspirated manual motorsport engineering.",
    "setId": "set_supercar_icons"
  },
  {
    "id": "car_ferrari_458_italia",
    "name": "Modena 458 Italia V8",
    "brand": "Modena",
    "rarity": "Epic",
    "basePrice": 235000,
    "stats": {
      "topSpeed": 325,
      "acceleration": 3.2,
      "handling": 91,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#dc2626",
    "bodyType": "supercar",
    "soundPitch": 1.4875,
    "description": "9,000 RPM screaming flat-plane crank V8 and Pininfarina aero.",
    "setId": "set_supercar_icons"
  },
  {
    "id": "car_lamborghini_gallardo_superleggera",
    "name": "Toro Superleggera LP570",
    "brand": "Toro",
    "rarity": "Epic",
    "basePrice": 195000,
    "stats": {
      "topSpeed": 325,
      "acceleration": 3.3,
      "handling": 91,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#16a34a",
    "bodyType": "supercar",
    "soundPitch": 1.4875,
    "description": "Carbon-stripped V10 with rear wing and lightweight racing buckets.",
    "setId": "set_supercar_icons"
  },
  {
    "id": "car_ford_gt_05",
    "name": "Valor Heritage GT 2005",
    "brand": "Valor",
    "rarity": "Epic",
    "basePrice": 280000,
    "stats": {
      "topSpeed": 330,
      "acceleration": 3.4,
      "handling": 90,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#0284c7",
    "bodyType": "supercar",
    "soundPitch": 1.4949999999999999,
    "description": "Supercharged 5.4L V8 tribute to the legendary 1966 Le Mans conquest.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_mercedes_sls_amg",
    "name": "Stuttgart SLS Gullwing 6.2",
    "brand": "Stuttgart",
    "rarity": "Epic",
    "basePrice": 245000,
    "stats": {
      "topSpeed": 317,
      "acceleration": 3.6,
      "handling": 91,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#94a3b8",
    "bodyType": "supercar",
    "soundPitch": 1.4755,
    "description": "Dramatic vertical gullwing doors and a hand-built dry-sump V8.",
    "setId": "set_supercar_icons"
  },
  {
    "id": "car_audi_r8_v10_plus",
    "name": "Ingolstadt R8 V10 Plus",
    "brand": "Ingolstadt",
    "rarity": "Epic",
    "basePrice": 190000,
    "stats": {
      "topSpeed": 330,
      "acceleration": 3.1,
      "handling": 90,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#eab308",
    "bodyType": "supercar",
    "soundPitch": 1.4949999999999999,
    "description": "Laser headlights, carbon sideblades, and screaming naturally aspirated power.",
    "setId": "set_supercar_icons"
  },
  {
    "id": "car_corvette_c8_z06",
    "name": "Valor C8 Z06 Flat-Plane",
    "brand": "Valor",
    "rarity": "Epic",
    "basePrice": 175000,
    "stats": {
      "topSpeed": 315,
      "acceleration": 2.6,
      "handling": 91,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#e11d48",
    "bodyType": "supercar",
    "soundPitch": 1.4725,
    "description": "American exotic with the most powerful naturally aspirated V8 in history.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_dodge_demon_170",
    "name": "Dominator SRT Demon 170",
    "brand": "Valor",
    "rarity": "Epic",
    "basePrice": 185000,
    "stats": {
      "topSpeed": 345,
      "acceleration": 1.8,
      "handling": 89,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#7c3aed",
    "bodyType": "muscle",
    "soundPitch": 1.5175,
    "description": "1,025 HP ethanol-fueled drag strip monster that pops front wheelies.",
    "setId": "set_muscle_power"
  },
  {
    "id": "car_aston_martin_vantage_v12",
    "name": "Gaydon V12 Vantage AMR",
    "brand": "Gaydon",
    "rarity": "Epic",
    "basePrice": 220000,
    "stats": {
      "topSpeed": 330,
      "acceleration": 3.4,
      "handling": 90,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#047857",
    "bodyType": "supercar",
    "soundPitch": 1.4949999999999999,
    "description": "Massive twin-turbo V12 squeezed into a compact, muscular sports chassis.",
    "setId": "set_supercar_icons"
  },
  {
    "id": "car_mclaren_675lt",
    "name": "Woking 675LT Longtail",
    "brand": "Woking",
    "rarity": "Epic",
    "basePrice": 260000,
    "stats": {
      "topSpeed": 330,
      "acceleration": 2.9,
      "handling": 90,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#ea580c",
    "bodyType": "supercar",
    "soundPitch": 1.4949999999999999,
    "description": "Active carbon airbrake, titanium exhaust, and extreme track focus.",
    "setId": "set_supercar_icons"
  },
  {
    "id": "car_lexus_lfa",
    "name": "Kanto LFA V10 Symphony",
    "brand": "Kanto",
    "rarity": "Epic",
    "basePrice": 340000,
    "stats": {
      "topSpeed": 325,
      "acceleration": 3.6,
      "handling": 91,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#ffffff",
    "bodyType": "supercar",
    "soundPitch": 1.4875,
    "description": "Yamaha-tuned exhaust acoustic masterpiece with 9,000 RPM digital tachometer.",
    "setId": "set_jdm_legends"
  },
  {
    "id": "car_ferrari_f40",
    "name": "Modena F40 Twin-Turbo 87",
    "brand": "Modena",
    "rarity": "Epic",
    "basePrice": 380000,
    "stats": {
      "topSpeed": 324,
      "acceleration": 3.8,
      "handling": 91,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#dc2626",
    "bodyType": "classic",
    "soundPitch": 1.486,
    "description": "The last supercar personally approved by Enzo Ferrari. Raw Kevlar legend.",
    "setId": "set_classics"
  },
  {
    "id": "car_jaguar_xj220",
    "name": "Coventry XJ220 Supercar",
    "brand": "Coventry",
    "rarity": "Epic",
    "basePrice": 290000,
    "stats": {
      "topSpeed": 342,
      "acceleration": 3.6,
      "handling": 89,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#334155",
    "bodyType": "classic",
    "soundPitch": 1.513,
    "description": "Sleek aluminum British missile that once held the world top speed title.",
    "setId": "set_classics"
  },
  {
    "id": "car_bugatti_veyron",
    "name": "Molsheim Veyron 16.4",
    "brand": "Molsheim",
    "rarity": "Legendary",
    "basePrice": 850000,
    "stats": {
      "topSpeed": 407,
      "acceleration": 2.5,
      "handling": 86,
      "braking": 100,
      "driftFactor": 75
    },
    "bodyColor": "#1e3a8a",
    "bodyType": "hypercar",
    "soundPitch": 1.6105,
    "description": "Quad-turbo W16 brute force that shattered the 400 km/h world record.",
    "setId": "set_hyper_gods"
  },
  {
    "id": "car_porsche_carrera_gt",
    "name": "Kaiser Carrera GT V10",
    "brand": "Kaiser",
    "rarity": "Legendary",
    "basePrice": 920000,
    "stats": {
      "topSpeed": 330,
      "acceleration": 3.5,
      "handling": 90,
      "braking": 100,
      "driftFactor": 75
    },
    "bodyColor": "#94a3b8",
    "bodyType": "hypercar",
    "soundPitch": 1.4949999999999999,
    "description": "Pure carbon monocoque, beechwood shift knob, and howling V10 engine.",
    "setId": "set_supercar_icons"
  },
  {
    "id": "car_ferrari_enzo",
    "name": "Modena Enzo F1-Tech",
    "brand": "Modena",
    "rarity": "Legendary",
    "basePrice": 980000,
    "stats": {
      "topSpeed": 350,
      "acceleration": 3.1,
      "handling": 89,
      "braking": 100,
      "driftFactor": 75
    },
    "bodyColor": "#dc2626",
    "bodyType": "hypercar",
    "soundPitch": 1.525,
    "description": "Formula 1 aerodynamics, pushrod suspension, and visceral 6.0L V12 howl.",
    "setId": "set_supercar_icons"
  },
  {
    "id": "car_mclaren_f1",
    "name": "Woking F1 Central Seater",
    "brand": "Woking",
    "rarity": "Legendary",
    "basePrice": 1400000,
    "stats": {
      "topSpeed": 386,
      "acceleration": 3.2,
      "handling": 87,
      "braking": 100,
      "driftFactor": 75
    },
    "bodyColor": "#71717a",
    "bodyType": "hypercar",
    "soundPitch": 1.579,
    "description": "Central driving position, gold leaf engine bay, and naturally aspirated perfection.",
    "setId": "set_supercar_icons"
  },
  {
    "id": "car_pagani_zonda_cinque",
    "name": "San Cesario Zonda Cinque",
    "brand": "San Cesario",
    "rarity": "Legendary",
    "basePrice": 1250000,
    "stats": {
      "topSpeed": 350,
      "acceleration": 3.2,
      "handling": 89,
      "braking": 100,
      "driftFactor": 75
    },
    "bodyColor": "#f8fafc",
    "bodyType": "hypercar",
    "soundPitch": 1.525,
    "description": "Carbo-titanium weave chassis and AMG 7.3L naturally aspirated symphony.",
    "setId": "set_hyper_gods"
  },
  {
    "id": "car_koenigsegg_ccx",
    "name": "Angelholm CCX Twin-Super",
    "brand": "Angelholm",
    "rarity": "Legendary",
    "basePrice": 1100000,
    "stats": {
      "topSpeed": 395,
      "acceleration": 3.1,
      "handling": 86,
      "braking": 100,
      "driftFactor": 75
    },
    "bodyColor": "#ea580c",
    "bodyType": "hypercar",
    "soundPitch": 1.5925,
    "description": "Dihedral synchro-helix doors and brutal twin-supercharged horsepower.",
    "setId": "set_hyper_gods"
  },
  {
    "id": "car_chiron_super_sport",
    "name": "Molsheim Chiron 300+ Edition",
    "brand": "Molsheim",
    "rarity": "Mythic",
    "basePrice": 2800000,
    "stats": {
      "topSpeed": 490,
      "acceleration": 2.2,
      "handling": 81,
      "braking": 100,
      "driftFactor": 75
    },
    "bodyColor": "#090d16",
    "bodyType": "hypercar",
    "soundPitch": 1.7349999999999999,
    "description": "Longtail carbon body that conquered the legendary 300 mph speed barrier.",
    "setId": "set_hyper_gods"
  },
  {
    "id": "car_jesko_absolut",
    "name": "Angelholm Jesko Absolut",
    "brand": "Angelholm",
    "rarity": "Mythic",
    "basePrice": 3200000,
    "stats": {
      "topSpeed": 500,
      "acceleration": 1.9,
      "handling": 80,
      "braking": 100,
      "driftFactor": 75
    },
    "bodyColor": "#f43f5e",
    "bodyType": "hypercar",
    "soundPitch": 1.75,
    "description": "Ultra-low 0.278 Cd aero with 9-speed Light Speed multi-clutch transmission.",
    "setId": "set_hyper_gods"
  },
  {
    "id": "car_ferrari_laferrari_fxxk",
    "name": "Modena FXX-K Evo Corse",
    "brand": "Modena",
    "rarity": "Mythic",
    "basePrice": 3500000,
    "stats": {
      "topSpeed": 370,
      "acceleration": 1.8,
      "handling": 88,
      "braking": 100,
      "driftFactor": 75
    },
    "bodyColor": "#b91c1c",
    "bodyType": "hypercar",
    "soundPitch": 1.5550000000000002,
    "description": "1,050 HP hybrid Corse Clienti track monster with twin rear fin stabilizers.",
    "setId": "set_hyper_gods"
  },
  {
    "id": "car_crown_celestial_v",
    "name": "Crown Celestial Phantom V",
    "brand": "Crown Heritage",
    "rarity": "Exclusive",
    "basePrice": 6500000,
    "stats": {
      "topSpeed": 515,
      "acceleration": 1.5,
      "handling": 79,
      "braking": 100,
      "driftFactor": 75
    },
    "bodyColor": "#06b6d4",
    "bodyType": "hypercar",
    "soundPitch": 1.7725,
    "description": "The CrownCards flagship masterpiece. Titanium weave with active quantum glow.",
    "setId": "set_hyper_gods"
  },
  {
    "id": "car_apex_formula_zero",
    "name": "Apex Gran Prix Zero One",
    "brand": "Apex Gran Prix",
    "rarity": "Exclusive",
    "basePrice": 5800000,
    "stats": {
      "topSpeed": 420,
      "acceleration": 1.4,
      "handling": 85,
      "braking": 100,
      "driftFactor": 55
    },
    "bodyColor": "#a855f7",
    "bodyType": "formula",
    "soundPitch": 1.63,
    "description": "Ground-effect open-wheel championship titan generating 3,000 kg of downforce."
  }
];

// Populate set carIds
CAR_SETS.forEach(s => {
  s.carIds = CAR_CATALOG.filter(c => c.setId === s.id).map(c => c.id);
});

export const CRATE_CATALOG: CrateDefinition[] = [
  {
    id: 'crate_starter',
    name: 'Starter Pack',
    price: 1000,
    description: 'Affordable entry pack with guaranteed high volume common drops.',
    accentHex: '#94a3b8',
    icon: '📦',
    odds: {
      Common: 93.0,
      Uncommon: 6.0,
      Rare: 0.9,
      Epic: 0.1,
      Legendary: 0.0,
      Mythic: 0.0,
      Exclusive: 0.0
    }
  },
  {
    id: 'crate_basic',
    name: 'Basic Pack',
    price: 5000,
    description: 'Balanced everyday pack offering decent chances at sports coupes and muscle cars.',
    accentHex: '#22c55e',
    icon: '🚗',
    odds: {
      Common: 80.0,
      Uncommon: 15.0,
      Rare: 4.0,
      Epic: 0.8,
      Legendary: 0.2,
      Mythic: 0.0,
      Exclusive: 0.0
    }
  },
  {
    id: 'crate_tuner',
    name: 'Tuner & Drift Box',
    price: 15000,
    description: 'Boosted odds for legendary JDM, drift machines and high-revving sports icons.',
    accentHex: '#3b82f6',
    icon: '⚡',
    odds: {
      Common: 65.0,
      Uncommon: 25.0,
      Rare: 8.0,
      Epic: 1.7,
      Legendary: 0.2,
      Mythic: 0.1,
      Exclusive: 0.0
    }
  },
  {
    id: 'crate_exotic',
    name: 'Exotic Supercar Pack',
    price: 50000,
    description: 'Mid-engine exotics and aggressive track monsters with increased Rare and Epic drop chances.',
    accentHex: '#a855f7',
    icon: '💎',
    odds: {
      Common: 50.0,
      Uncommon: 30.0,
      Rare: 15.0,
      Epic: 4.0,
      Legendary: 0.7,
      Mythic: 0.3,
      Exclusive: 0.0
    }
  },
  {
    id: 'crate_prestige',
    name: 'Crown Prestige Vault',
    price: 150000,
    description: 'The pinnacle vault. High probability of Rare and Epic tiers, with exclusive access to Mythics and the Crown Celestial.',
    accentHex: '#06b6d4',
    icon: '👑',
    odds: {
      Common: 35.0,
      Uncommon: 30.0,
      Rare: 22.0,
      Epic: 9.0,
      Legendary: 2.5,
      Mythic: 1.2,
      Exclusive: 0.3
    }
  },
  {
    id: 'crate_limited_midnight',
    name: 'Limited Midnight Touge Crate',
    price: 75000,
    description: 'Limited-time special edition! Boosted odds for JDM Skyline, Supra, RX-7 and exclusive Touge paint jobs.',
    accentHex: '#ec4899',
    icon: '🔥',
    isSpecial: true,
    endsInSeconds: 86400 * 2 + 14400,
    odds: {
      Common: 40.0,
      Uncommon: 32.0,
      Rare: 18.0,
      Epic: 7.5,
      Legendary: 1.8,
      Mythic: 0.6,
      Exclusive: 0.1
    }
  }
];

export const DAILY_REWARD_ITEMS = [
  { name: 'Starter Pack', type: 'crate', crateId: 'crate_starter', color: '#94a3b8' },
  { name: '$15,000 Cash', type: 'cash', amount: 15000, color: '#3b82f6' },
  { name: '500 XP Boost', type: 'xp', amount: 500, color: '#eab308' },
  { name: 'Basic Pack', type: 'crate', crateId: 'crate_basic', color: '#22c55e' },
  { name: '$25,000 Cash', type: 'cash', amount: 25000, color: '#a855f7' },
  { name: 'Tuner Box', type: 'crate', crateId: 'crate_tuner', color: '#ec4899' },
  { name: '$75,000 Jackpot', type: 'cash', amount: 75000, color: '#f59e0b' },
  { name: 'Exotic Supercar Pack', type: 'crate', crateId: 'crate_exotic', color: '#06b6d4' }
];
