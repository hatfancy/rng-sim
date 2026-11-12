import fs from 'fs';

const commonCars = [
  { id: 'car_pulse_gl', name: 'Pulse Hatch GL', brand: 'Kanto', type: 'hatchback', price: 2800, color: '#64748b', speed: 172, acc: 8.4, set: 'set_hatch_heroes', desc: 'Everyday commuter hero with peppy front-wheel response.' },
  { id: 'car_corsa_s', name: 'Vanguard Echo 1.4', brand: 'Vanguard', type: 'hatchback', price: 2950, color: '#0284c7', speed: 168, acc: 8.8, set: 'set_hatch_heroes', desc: 'Popular compact hatchback designed for tight city alleys.' },
  { id: 'car_clio_sport', name: 'Alpine Vitesse S', brand: 'Monaco', type: 'hatchback', price: 3400, color: '#eab308', speed: 185, acc: 7.6, set: 'set_hatch_heroes', desc: 'Nimble European hot hatch revered by street learners.' },
  { id: 'car_fiesta_st', name: 'Cyclone ST Hatch', brand: 'Valor', type: 'hatchback', price: 3600, color: '#ef4444', speed: 192, acc: 7.2, set: 'set_hatch_heroes', desc: 'Punchy turbocharged 3-cylinder with eager turn-in.' },
  { id: 'car_polo_gt', name: 'Autowerk Sprint GT', brand: 'Autowerk', type: 'hatchback', price: 3200, color: '#10b981', speed: 180, acc: 7.9, set: 'set_hatch_heroes', desc: 'Solid German engineering in an ultra-reliable frame.' },
  { id: 'car_swift_rs', name: 'Hayate RS Sport', brand: 'Shinsei', type: 'hatchback', price: 3100, color: '#f97316', speed: 182, acc: 7.8, set: 'set_hatch_heroes', desc: 'Featherweight curb weight delivers joyful apex handling.' },
  { id: 'car_civic_eg', name: 'Kanto Kanjo Hatch', brand: 'Kanto', type: 'hatchback', price: 3800, color: '#a855f7', speed: 190, acc: 7.4, set: 'set_hatch_heroes', desc: 'Loop one legend that dominated midnight highway runs.' },
  { id: 'car_golf_mk4', name: 'Autowerk IV Trend', brand: 'Autowerk', type: 'hatchback', price: 3500, color: '#334155', speed: 188, acc: 7.7, set: 'set_hatch_heroes', desc: 'Classic 2000s icon beloved by stance enthusiasts.' },
  { id: 'car_yaris_t', name: 'Kanto Vitz TS', brand: 'Kanto', type: 'hatchback', price: 3300, color: '#38bdf8', speed: 184, acc: 7.9, set: 'set_hatch_heroes', desc: 'Bulletproof engine reliability with punchy gearing.' },
  { id: 'car_miata_na', name: 'Mazurka Spirito NA', brand: 'Mazurka', type: 'sports', price: 4200, color: '#dc2626', speed: 195, acc: 7.1, set: 'set_jdm_legends', desc: 'Pop-up headlight roadster offering pure analog rear-wheel fun.' },
  { id: 'car_miata_nb', name: 'Mazurka Spirito NB', brand: 'Mazurka', type: 'sports', price: 4400, color: '#059669', speed: 198, acc: 6.9, set: 'set_jdm_legends', desc: 'Sculpted lightweight chassis tuned for weekend canyon carves.' },
  { id: 'car_sedan_crown', name: 'Kanto Century Crown', brand: 'Kanto', type: 'sedan', price: 3900, color: '#1e293b', speed: 190, acc: 8.0, desc: 'Quiet executive comfort cruising with soft rear suspension.' },
  { id: 'car_corolla_ae', name: 'Kanto Sprinter Levin', brand: 'Kanto', type: 'classic', price: 4600, color: '#f8fafc', speed: 186, acc: 7.5, set: 'set_jdm_legends', desc: 'Twin-cam high-revving coupe with balanced rear-drive geometry.' },
  { id: 'car_integra_ls', name: 'Shinsei Integra LS', brand: 'Shinsei', type: 'sports', price: 4100, color: '#2563eb', speed: 194, acc: 7.3, desc: 'Sharp front-wheel grip that punches well above its class.' },
  { id: 'car_prelude_si', name: 'Shinsei Prelude Si', brand: 'Shinsei', type: 'sports', price: 4300, color: '#7c3aed', speed: 198, acc: 7.1, desc: 'Low-slung 90s coupe with four-wheel steer legacy.' },
  { id: 'car_volvo_240', name: 'Nordic Iron 240', brand: 'Nordic', type: 'classic', price: 3200, color: '#b91c1c', speed: 170, acc: 9.2, set: 'set_classics', desc: 'Indestructible Swedish brick chassis favored by grassroots drift racers.' },
  { id: 'car_bmw_e36_compact', name: 'Autowerk 318 Compact', brand: 'Autowerk', type: 'hatchback', price: 3700, color: '#0d9488', speed: 195, acc: 7.5, desc: 'Shortened wheelbase Bavarian chassis with lively oversteer.' },
  { id: 'car_peugeot_206', name: 'Gallic Lion 206', brand: 'Gallic', type: 'hatchback', price: 2900, color: '#9333ea', speed: 175, acc: 8.6, set: 'set_hatch_heroes', desc: 'Rally-heritage curved styling in an affordable city footprint.' },
  { id: 'car_mini_cooper', name: 'Albion Cooper S Classic', brand: 'Albion', type: 'classic', price: 4500, color: '#15803d', speed: 178, acc: 8.1, set: 'set_classics', desc: 'Go-kart handling dynamics that conquered the Monte Carlo rally.' },
  { id: 'car_beetle_classic', name: 'Autowerk Käfer 1300', brand: 'Autowerk', type: 'classic', price: 3800, color: '#d97706', speed: 145, acc: 11.5, set: 'set_classics', desc: 'Air-cooled rear-engine icon with unmistakable rounded profile.' },
  { id: 'car_crown_vic', name: 'Valor Interceptor 4.6', brand: 'Valor', type: 'sedan', price: 3500, color: '#1e293b', speed: 190, acc: 8.5, desc: 'Heavy body-on-frame American workhorse cruiser.' },
  { id: 'car_caprice_classic', name: 'Valor Caprice Brougham', brand: 'Valor', type: 'classic', price: 3600, color: '#4b5563', speed: 185, acc: 9.0, set: 'set_classics', desc: 'Velvet-smooth highway cruiser with cavernous cabin space.' },
  { id: 'car_subaru_legacy', name: 'Subsonic Legacy AWD', brand: 'Subsonic', type: 'sedan', price: 4100, color: '#1d4ed8', speed: 196, acc: 7.4, desc: 'Symmetrical all-wheel traction for all-season city driving.' },
  { id: 'car_is200', name: 'Kanto Altezza RS', brand: 'Kanto', type: 'sedan', price: 4700, color: '#6d28d9', speed: 205, acc: 7.0, set: 'set_jdm_legends', desc: 'Chronograph dials, inline engine, and rear-drive poise.' },
  { id: 'car_celica_gt', name: 'Kanto Celica Liftback', brand: 'Kanto', type: 'sports', price: 4400, color: '#be123c', speed: 198, acc: 7.2, desc: 'Streamlined aerodynamic liftback styling with crisp steering.' },
  { id: 'car_alfa_147', name: 'Milano Quadrifoglio 147', brand: 'Milano', type: 'hatchback', price: 3700, color: '#dc2626', speed: 192, acc: 7.7, set: 'set_hatch_heroes', desc: 'Italian soul and spirited rev-happy engine acoustics.' },
  { id: 'car_focus_zx3', name: 'Valor Focus Track', brand: 'Valor', type: 'hatchback', price: 3100, color: '#0284c7', speed: 180, acc: 8.2, set: 'set_hatch_heroes', desc: 'Control blade independent rear suspension gives sublime corner balance.' },
  { id: 'car_mazda_3', name: 'Mazurka 3 Hatchback', brand: 'Mazurka', type: 'hatchback', price: 3400, color: '#991b1b', speed: 188, acc: 7.8, set: 'set_hatch_heroes', desc: 'Sleek Kodo design aesthetic and intuitive gear shifter feel.' },
  { id: 'car_honda_crx', name: 'Shinsei CRX Ballade', brand: 'Shinsei', type: 'classic', price: 4600, color: '#16a34a', speed: 194, acc: 7.3, set: 'set_jdm_legends', desc: 'Ultra-light 2-seater hatch celebrated by golden-era tuners.' },
  { id: 'car_datsun_b210', name: 'Shinsei Sunny Coupe', brand: 'Shinsei', type: 'classic', price: 3900, color: '#ca8a04', speed: 165, acc: 9.8, set: 'set_classics', desc: 'Vintage lightweight Japanese rear-wheel drive runabout.' },
  { id: 'car_fiat_500_abarth', name: 'Torino Scorpion 500', brand: 'Torino', type: 'hatchback', price: 4800, color: '#f8fafc', speed: 202, acc: 6.8, set: 'set_hatch_heroes', desc: 'Angry Italian pocket rocket with rowdy dual exhaust pop.' },
  { id: 'car_suzuki_cappuccino', name: 'Hayate Espresso Kei', brand: 'Hayate', type: 'sports', price: 4500, color: '#06b6d4', speed: 170, acc: 8.0, desc: '660cc turbocharged micro roadster delivering giant-slaying fun.' },
  { id: 'car_e30_318i', name: 'Autowerk 3-Series E30', brand: 'Autowerk', type: 'classic', price: 4900, color: '#374151', speed: 196, acc: 7.6, set: 'set_classics', desc: 'The quintessential 80s sports sedan profile with timeless lines.' },
  { id: 'car_nissan_s12', name: 'Shinsei Silvia Gazelle', brand: 'Shinsei', type: 'classic', price: 4700, color: '#475569', speed: 195, acc: 7.4, set: 'set_jdm_legends', desc: 'Angular notchback silhouette bridging classic vintage and drift culture.' },
  { id: 'car_saab_900_turbo', name: 'Aero Viking 900 Turbo', brand: 'Nordic', type: 'classic', price: 4800, color: '#1e3a8a', speed: 200, acc: 7.5, set: 'set_classics', desc: 'Aviation-inspired cockpit and aggressive front-biased boost rush.' }
];

const uncommonCars = [
  { id: 'car_gt86_apex', name: 'Apex Drift-86', brand: 'Kanto', type: 'drift', price: 9500, color: '#ea580c', speed: 226, acc: 6.2, set: 'set_jdm_legends', desc: 'Renowned drift icon with instantaneous weight transfer.' },
  { id: 'car_mustang_fox', name: 'Thunderbolt 5.0 Fox', brand: 'Valor', type: 'muscle', price: 11000, color: '#1e3a8a', speed: 232, acc: 5.6, set: 'set_muscle_power', desc: 'Notchback American V8 hero of drag strips and stoplights.' },
  { id: 'car_camaro_z28_3rd', name: 'Stallion IROC-Z', brand: 'Valor', type: 'muscle', price: 10800, color: '#dc2626', speed: 230, acc: 5.8, set: 'set_muscle_power', desc: 'Ground-effects muscle coupe with low aerodynamic rumble.' },
  { id: 'car_civic_type_r_ek9', name: 'Kanto Championship EK9', brand: 'Kanto', type: 'hatchback', price: 14000, color: '#f8fafc', speed: 235, acc: 5.9, set: 'set_hatch_heroes', desc: 'Hand-ported cylinder head screaming past 8,500 RPM.' },
  { id: 'car_s13_240sx', name: 'Shinsei S13 Silvia', brand: 'Shinsei', type: 'drift', price: 13500, color: '#0284c7', speed: 228, acc: 6.1, set: 'set_jdm_legends', desc: 'The backbone of grassroots drift competitions globally.' },
  { id: 'car_s14_kouki', name: 'Shinsei S14 Kouki', brand: 'Shinsei', type: 'drift', price: 15500, color: '#7c3aed', speed: 238, acc: 5.7, set: 'set_jdm_legends', desc: 'Aggressive face-lifted drift weapon with wide rear quarters.' },
  { id: 'car_wrx_classic', name: 'Subsonic Impreza Turbo', brand: 'Subsonic', type: 'sports', price: 14500, color: '#2563eb', speed: 240, acc: 5.3, set: 'set_jdm_legends', desc: 'Boxer rumble and rally-proven center differential grip.' },
  { id: 'car_mitsubishi_evo4', name: 'Lancer Evolution IV', brand: 'Shinsei', type: 'sports', price: 16000, color: '#ffffff', speed: 245, acc: 5.1, set: 'set_jdm_legends', desc: 'Active Yaw Control tech engineered for gravel and wet asphalt.' },
  { id: 'car_golf_r32', name: 'Autowerk R32 4Motion', brand: 'Autowerk', type: 'hatchback', price: 15000, color: '#1e40af', speed: 246, acc: 5.8, set: 'set_hatch_heroes', desc: 'Symphonic 3.2L VR6 roar mated to surefooted AWD.' },
  { id: 'car_focus_rs_mk2', name: 'Valor RS Green Hell', brand: 'Valor', type: 'hatchback', price: 16500, color: '#16a34a', speed: 250, acc: 5.4, set: 'set_hatch_heroes', desc: 'Wide-body 5-cylinder hot hatch with blistering highway pace.' },
  { id: 'car_megane_rs', name: 'Monaco Trophy R', brand: 'Monaco', type: 'hatchback', price: 14800, color: '#facc15', speed: 248, acc: 5.5, set: 'set_hatch_heroes', desc: 'Ring lap-record challenger with cup chassis track damping.' },
  { id: 'car_bmw_e46_330ci', name: 'Autowerk Clubsport 3.0', brand: 'Autowerk', type: 'sports', price: 12500, color: '#475569', speed: 242, acc: 6.0, desc: 'Silky smooth inline-6 with perfectly balanced 50:50 chassis balance.' },
  { id: 'car_audi_s3', name: 'Ingolstadt S-Quattro', brand: 'Ingolstadt', type: 'hatchback', price: 13800, color: '#e11d48', speed: 245, acc: 5.2, set: 'set_hatch_heroes', desc: 'Subtle stealth styling hiding ferocious all-weather turbo pull.' },
  { id: 'car_dodge_charger_rt_70', name: 'Dominator 440 RT', brand: 'Valor', type: 'classic', price: 18000, color: '#b91c1c', speed: 220, acc: 5.5, set: 'set_muscle_power', desc: 'Concealed headlights and big-block American quarter-mile heritage.' },
  { id: 'car_pontiac_transam', name: 'Firebird Bandit Special', brand: 'Valor', type: 'classic', price: 17500, color: '#090d16', speed: 218, acc: 5.7, set: 'set_muscle_power', desc: 'Iconic screaming gold eagle hood decal and T-top roof.' },
  { id: 'car_chevrolet_chevelle_ss', name: 'Valor Chevelle SS 454', brand: 'Valor', type: 'classic', price: 19000, color: '#1e3a8a', speed: 224, acc: 5.3, set: 'set_muscle_power', desc: 'The golden heavyweight of the classic American muscle car wars.' },
  { id: 'car_datsun_240z', name: 'Shinsei Fairlady 240Z', brand: 'Shinsei', type: 'classic', price: 18500, color: '#ea580c', speed: 215, acc: 6.8, set: 'set_classics', desc: 'Timeless long hood fastback silhouette that redefined sports coupes.' },
  { id: 'car_toyota_celica_gt4', name: 'Kanto GT-Four WRC', brand: 'Kanto', type: 'sports', price: 16800, color: '#ffffff', speed: 244, acc: 5.4, set: 'set_jdm_legends', desc: 'Aggressive hood vents and all-trac rally championship DNA.' },
  { id: 'car_mazda_rx8', name: 'Mazurka Renesis RX', brand: 'Mazurka', type: 'sports', price: 11500, color: '#0d9488', speed: 236, acc: 6.2, desc: 'High-revving rotary powerplant with freestyle suicide rear doors.' },
  { id: 'car_nissan_350z', name: 'Shinsei 350 Track', brand: 'Shinsei', type: 'drift', price: 13200, color: '#ca8a04', speed: 248, acc: 5.4, set: 'set_jdm_legends', desc: 'Deep V6 exhaust bark and an unbreakable rear differential.' },
  { id: 'car_mercedes_190e', name: 'Stuttgart Evo Cosworth', brand: 'Stuttgart', type: 'classic', price: 19500, color: '#18181b', speed: 235, acc: 6.4, set: 'set_classics', desc: 'Homologation touring car royalty with flared fenders and rear wing.' },
  { id: 'car_bmw_e30_m3', name: 'Autowerk M3 Heritage', brand: 'Autowerk', type: 'classic', price: 21000, color: '#dc2626', speed: 238, acc: 6.1, set: 'set_classics', desc: 'Box-flared arches and rev-happy 4-cylinder DTM championship icon.' },
  { id: 'car_jaguar_e_type', name: 'Coventry Series 1 Roadster', brand: 'Coventry', type: 'classic', price: 22000, color: '#15803d', speed: 228, acc: 6.7, set: 'set_classics', desc: 'Described by Enzo Ferrari as the most beautiful car ever crafted.' },
  { id: 'car_alfa_romeo_gtv', name: 'Milano Stepnose 2000', brand: 'Milano', type: 'classic', price: 17000, color: '#991b1b', speed: 205, acc: 7.4, set: 'set_classics', desc: 'Twin-cam vocal brilliance wrapped in Bertone coachwork lines.' },
  { id: 'car_lancia_delta_integrale', name: 'Turino HF Integrale', brand: 'Turino', type: 'classic', price: 23000, color: '#be123c', speed: 235, acc: 5.2, set: 'set_classics', desc: 'Six consecutive World Rally championships in one boxy frame.' },
  { id: 'car_subaru_brz_ts', name: 'Subsonic BRZ tS Spec', brand: 'Subsonic', type: 'drift', price: 14200, color: '#0ea5e9', speed: 230, acc: 6.0, desc: 'Sachs suspension and Brembo package for razor precision carving.' }
];

const rareCars = [
  { id: 'car_skyline_r32', name: 'Shinsei Skyline GT-R R32', brand: 'Shinsei', type: 'sports', price: 42000, color: '#475569', speed: 260, acc: 4.7, set: 'set_jdm_legends', desc: 'The original Godzilla that went undefeated in Australian touring cars.' },
  { id: 'car_skyline_r33', name: 'Shinsei Skyline GT-R R33', brand: 'Shinsei', type: 'sports', price: 45000, color: '#2563eb', speed: 265, acc: 4.6, set: 'set_jdm_legends', desc: 'Sub-8 minute Nürburgring weapon with aerodynamic high-speed stability.' },
  { id: 'car_toyota_supra_a80', name: 'Kanto Supra Twin-Turbo', brand: 'Kanto', type: 'sports', price: 58000, color: '#f8fafc', speed: 275, acc: 4.4, set: 'set_jdm_legends', desc: '2JZ iron block powerhouse capable of holding legendary boost levels.' },
  { id: 'car_mazda_rx7_fd', name: 'Mazurka RX-7 Efini FD', brand: 'Mazurka', type: 'sports', price: 54000, color: '#eab308', speed: 265, acc: 4.8, set: 'set_jdm_legends', desc: 'Twin-rotor sequential turbo magic inside a timeless aerodynamic sculpture.' },
  { id: 'car_honda_nsx_na1', name: 'Shinsei NSX Midship V6', brand: 'Shinsei', type: 'supercar', price: 65000, color: '#dc2626', speed: 270, acc: 4.9, set: 'set_jdm_legends', desc: 'All-aluminum supercar developed with feedback from Ayrton Senna.' },
  { id: 'car_bmw_m3_e46_csl', name: 'Autowerk M3 CSL Lightweight', brand: 'Autowerk', type: 'sports', price: 59000, color: '#94a3b8', speed: 280, acc: 4.5, desc: 'Carbon airbox intake acoustics and pure mechanical connection.' },
  { id: 'car_bmw_m5_e60_v10', name: 'Autowerk M5 V10 Autobahn', brand: 'Autowerk', type: 'sedan', price: 52000, color: '#1e293b', speed: 305, acc: 4.2, desc: 'F1-inspired screaming V10 engine hidden inside an executive executive cruiser.' },
  { id: 'car_c63_amg_w204', name: 'Stuttgart C63 AMG 6.2 V8', brand: 'Stuttgart', type: 'muscle', price: 48000, color: '#090d16', speed: 290, acc: 4.3, set: 'set_muscle_power', desc: 'Naturally aspirated 6.2L sledgehammer engine with violent exhaust bark.' },
  { id: 'car_corvette_c6_z06', name: 'Valor C6 Z06 7.0L', brand: 'Valor', type: 'supercar', price: 56000, color: '#f59e0b', speed: 318, acc: 3.7, set: 'set_muscle_power', desc: 'Massive 427 cubic-inch V8 power in an ultra-lightweight aluminum chassis.' },
  { id: 'car_dodge_viper_gts', name: 'Viper GTS V10 Coupe', brand: 'Valor', type: 'supercar', price: 68000, color: '#1e3a8a', speed: 310, acc: 3.9, set: 'set_muscle_power', desc: 'Blue with white stripes. 8.0L venomous V10 with zero electronic nannies.' },
  { id: 'car_shelby_gt500_eleanor', name: 'Shelby GT500 Fastback 67', brand: 'Valor', type: 'classic', price: 78000, color: '#64748b', speed: 245, acc: 4.8, set: 'set_muscle_power', desc: 'The most desirable muscle car silhouette in cinema and collector lore.' },
  { id: 'car_porsche_930_turbo', name: 'Kaiser 930 Turbo Widowmaker', brand: 'Kaiser', type: 'classic', price: 75000, color: '#10b981', speed: 275, acc: 4.9, set: 'set_classics', desc: 'Whale-tail spoiler, sudden boost lag, and hair-raising rear-engine dynamics.' },
  { id: 'car_ferrari_testarossa', name: 'Modena Testarossa 512', brand: 'Modena', type: 'classic', price: 82000, color: '#dc2626', speed: 290, acc: 5.1, set: 'set_classics', desc: 'Side strake cheese graters and flat-12 Miami Vice 80s icon.' },
  { id: 'car_lamborghini_countach', name: 'Toro Countach 5000 QV', brand: 'Toro', type: 'classic', price: 92000, color: '#ffffff', speed: 295, acc: 4.7, set: 'set_classics', desc: 'The original wedge poster car that pioneered dramatic scissor doors.' },
  { id: 'car_nissan_silvia_s15_spec_r', name: 'Shinsei S15 Mona Lisa', brand: 'Shinsei', type: 'drift', price: 46000, color: '#0284c7', speed: 260, acc: 5.0, set: 'set_jdm_legends', desc: 'The Mona Lisa of the drift world with razor front styling and 6-speed box.' },
  { id: 'car_audi_rs4_b7', name: 'Ingolstadt RS4 High-Rev V8', brand: 'Ingolstadt', type: 'sedan', price: 44000, color: '#334155', speed: 285, acc: 4.5, desc: '8,250 RPM manual V8 estate with rear-biased Quattro magic.' },
  { id: 'car_mercedes_sl65_amg', name: 'Stuttgart SL65 V12 BiTurbo', brand: 'Stuttgart', type: 'supercar', price: 62000, color: '#71717a', speed: 320, acc: 3.9, desc: 'Earth-shaking 1,000 Nm of torque that evaporates rear tires at will.' },
  { id: 'car_aston_martin_db9', name: 'Gaydon DB9 Grand Tourer', brand: 'Gaydon', type: 'supercar', price: 66000, color: '#0f766e', speed: 300, acc: 4.4, desc: 'Hand-crafted British luxury coupe with an operatic 6.0L V12 exhaust.' },
  { id: 'car_lotus_exige_cup', name: 'Norfolk Cup 380 Supercharged', brand: 'Norfolk', type: 'sports', price: 51000, color: '#facc15', speed: 285, acc: 3.8, desc: 'Simplify, then add lightness. Unassisted steering track weapon.' },
  { id: 'car_alfa_romeo_8c', name: 'Milano 8C Competizione', brand: 'Milano', type: 'supercar', price: 88000, color: '#b91c1c', speed: 295, acc: 4.1, set: 'set_classics', desc: 'Carbon fiber coachbuilt curves and a bespoke Maserati-tuned V8.' }
];

const epicCars = [
  { id: 'car_r34_vspec2', name: 'Shinsei Skyline R34 V-Spec II', brand: 'Shinsei', type: 'sports', price: 165000, color: '#2563eb', speed: 285, acc: 4.1, set: 'set_jdm_legends', desc: 'Bayside Blue perfection. Carbon bonnet and MFD digital telemetry.' },
  { id: 'car_porsche_gt3_997', name: 'Kaiser 911 GT3 RS 4.0', brand: 'Kaiser', type: 'supercar', price: 210000, color: '#f8fafc', speed: 312, acc: 3.5, set: 'set_supercar_icons', desc: 'The holy grail of naturally aspirated manual motorsport engineering.' },
  { id: 'car_ferrari_458_italia', name: 'Modena 458 Italia V8', brand: 'Modena', type: 'supercar', price: 235000, color: '#dc2626', speed: 325, acc: 3.2, set: 'set_supercar_icons', desc: '9,000 RPM screaming flat-plane crank V8 and Pininfarina aero.' },
  { id: 'car_lamborghini_gallardo_superleggera', name: 'Toro Superleggera LP570', brand: 'Toro', type: 'supercar', price: 195000, color: '#16a34a', speed: 325, acc: 3.3, set: 'set_supercar_icons', desc: 'Carbon-stripped V10 with rear wing and lightweight racing buckets.' },
  { id: 'car_ford_gt_05', name: 'Valor Heritage GT 2005', brand: 'Valor', type: 'supercar', price: 280000, color: '#0284c7', speed: 330, acc: 3.4, set: 'set_muscle_power', desc: 'Supercharged 5.4L V8 tribute to the legendary 1966 Le Mans conquest.' },
  { id: 'car_mercedes_sls_amg', name: 'Stuttgart SLS Gullwing 6.2', brand: 'Stuttgart', type: 'supercar', price: 245000, color: '#94a3b8', speed: 317, acc: 3.6, set: 'set_supercar_icons', desc: 'Dramatic vertical gullwing doors and a hand-built dry-sump V8.' },
  { id: 'car_audi_r8_v10_plus', name: 'Ingolstadt R8 V10 Plus', brand: 'Ingolstadt', type: 'supercar', price: 190000, color: '#eab308', speed: 330, acc: 3.1, set: 'set_supercar_icons', desc: 'Laser headlights, carbon sideblades, and screaming naturally aspirated power.' },
  { id: 'car_corvette_c8_z06', name: 'Valor C8 Z06 Flat-Plane', brand: 'Valor', type: 'supercar', price: 175000, color: '#e11d48', speed: 315, acc: 2.6, set: 'set_muscle_power', desc: 'American exotic with the most powerful naturally aspirated V8 in history.' },
  { id: 'car_dodge_demon_170', name: 'Dominator SRT Demon 170', brand: 'Valor', type: 'muscle', price: 185000, color: '#7c3aed', speed: 345, acc: 1.8, set: 'set_muscle_power', desc: '1,025 HP ethanol-fueled drag strip monster that pops front wheelies.' },
  { id: 'car_aston_martin_vantage_v12', name: 'Gaydon V12 Vantage AMR', brand: 'Gaydon', type: 'supercar', price: 220000, color: '#047857', speed: 330, acc: 3.4, set: 'set_supercar_icons', desc: 'Massive twin-turbo V12 squeezed into a compact, muscular sports chassis.' },
  { id: 'car_mclaren_675lt', name: 'Woking 675LT Longtail', brand: 'Woking', type: 'supercar', price: 260000, color: '#ea580c', speed: 330, acc: 2.9, set: 'set_supercar_icons', desc: 'Active carbon airbrake, titanium exhaust, and extreme track focus.' },
  { id: 'car_lexus_lfa', name: 'Kanto LFA V10 Symphony', brand: 'Kanto', type: 'supercar', price: 340000, color: '#ffffff', speed: 325, acc: 3.6, set: 'set_jdm_legends', desc: 'Yamaha-tuned exhaust acoustic masterpiece with 9,000 RPM digital tachometer.' },
  { id: 'car_ferrari_f40', name: 'Modena F40 Twin-Turbo 87', brand: 'Modena', type: 'classic', price: 380000, color: '#dc2626', speed: 324, acc: 3.8, set: 'set_classics', desc: 'The last supercar personally approved by Enzo Ferrari. Raw Kevlar legend.' },
  { id: 'car_jaguar_xj220', name: 'Coventry XJ220 Supercar', brand: 'Coventry', type: 'classic', price: 290000, color: '#334155', speed: 342, acc: 3.6, set: 'set_classics', desc: 'Sleek aluminum British missile that once held the world top speed title.' }
];

const legendaryCars = [
  { id: 'car_bugatti_veyron', name: 'Molsheim Veyron 16.4', brand: 'Molsheim', type: 'hypercar', price: 850000, color: '#1e3a8a', speed: 407, acc: 2.5, set: 'set_hyper_gods', desc: 'Quad-turbo W16 brute force that shattered the 400 km/h world record.' },
  { id: 'car_porsche_carrera_gt', name: 'Kaiser Carrera GT V10', brand: 'Kaiser', type: 'hypercar', price: 920000, color: '#94a3b8', speed: 330, acc: 3.5, set: 'set_supercar_icons', desc: 'Pure carbon monocoque, beechwood shift knob, and howling V10 engine.' },
  { id: 'car_ferrari_enzo', name: 'Modena Enzo F1-Tech', brand: 'Modena', type: 'hypercar', price: 980000, color: '#dc2626', speed: 350, acc: 3.1, set: 'set_supercar_icons', desc: 'Formula 1 aerodynamics, pushrod suspension, and visceral 6.0L V12 howl.' },
  { id: 'car_mclaren_f1', name: 'Woking F1 Central Seater', brand: 'Woking', type: 'hypercar', price: 1400000, color: '#71717a', speed: 386, acc: 3.2, set: 'set_supercar_icons', desc: 'Central driving position, gold leaf engine bay, and naturally aspirated perfection.' },
  { id: 'car_pagani_zonda_cinque', name: 'San Cesario Zonda Cinque', brand: 'San Cesario', type: 'hypercar', price: 1250000, color: '#f8fafc', speed: 350, acc: 3.2, set: 'set_hyper_gods', desc: 'Carbo-titanium weave chassis and AMG 7.3L naturally aspirated symphony.' },
  { id: 'car_koenigsegg_ccx', name: 'Angelholm CCX Twin-Super', brand: 'Angelholm', type: 'hypercar', price: 1100000, color: '#ea580c', speed: 395, acc: 3.1, set: 'set_hyper_gods', desc: 'Dihedral synchro-helix doors and brutal twin-supercharged horsepower.' }
];

const mythicCars = [
  { id: 'car_chiron_super_sport', name: 'Molsheim Chiron 300+ Edition', brand: 'Molsheim', type: 'hypercar', price: 2800000, color: '#090d16', speed: 490, acc: 2.2, set: 'set_hyper_gods', desc: 'Longtail carbon body that conquered the legendary 300 mph speed barrier.' },
  { id: 'car_jesko_absolut', name: 'Angelholm Jesko Absolut', brand: 'Angelholm', type: 'hypercar', price: 3200000, color: '#f43f5e', speed: 500, acc: 1.9, set: 'set_hyper_gods', desc: 'Ultra-low 0.278 Cd aero with 9-speed Light Speed multi-clutch transmission.' },
  { id: 'car_ferrari_laferrari_fxxk', name: 'Modena FXX-K Evo Corse', brand: 'Modena', type: 'hypercar', price: 3500000, color: '#b91c1c', speed: 370, acc: 1.8, set: 'set_hyper_gods', desc: '1,050 HP hybrid Corse Clienti track monster with twin rear fin stabilizers.' }
];

const exclusiveCars = [
  { id: 'car_crown_celestial_v', name: 'Crown Celestial Phantom V', brand: 'Crown Heritage', type: 'hypercar', price: 6500000, color: '#06b6d4', speed: 515, acc: 1.5, set: 'set_hyper_gods', desc: 'The CrownCards flagship masterpiece. Titanium weave with active quantum glow.' },
  { id: 'car_apex_formula_zero', name: 'Apex Gran Prix Zero One', brand: 'Apex Gran Prix', type: 'formula', price: 5800000, color: '#a855f7', speed: 420, acc: 1.4, desc: 'Ground-effect open-wheel championship titan generating 3,000 kg of downforce.' }
];

const mapR = (list, r) => list.map(c => ({
  id: c.id,
  name: c.name,
  brand: c.brand,
  rarity: r,
  basePrice: c.price,
  stats: {
    topSpeed: c.speed,
    acceleration: c.acc,
    handling: Math.min(100, Math.round(50 + (300 - c.speed * 0.4) * 0.15 + (c.type === 'drift' ? 25 : 15))),
    braking: Math.min(100, Math.round(60 + (c.price / 80000) * 20)),
    driftFactor: c.type === 'drift' ? 95 : (c.type === 'sports' ? 82 : (c.type === 'hypercar' ? 75 : 55))
  },
  bodyColor: c.color,
  bodyType: c.type,
  soundPitch: 1.0 + (c.speed / 400) * 0.6,
  description: c.desc,
  setId: c.set
}));

const fullList = [
  ...mapR(commonCars, 'Common'),
  ...mapR(uncommonCars, 'Uncommon'),
  ...mapR(rareCars, 'Rare'),
  ...mapR(epicCars, 'Epic'),
  ...mapR(legendaryCars, 'Legendary'),
  ...mapR(mythicCars, 'Mythic'),
  ...mapR(exclusiveCars, 'Exclusive')
];

const fileContent = `import { CarModelDef, CrateDefinition, Rarity, CarSet } from '../types';

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

export const CAR_CATALOG: CarModelDef[] = ${JSON.stringify(fullList, null, 2)};

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
`;

fs.writeFileSync('src/data/cars.ts', fileContent, 'utf8');
console.log('cars.ts created successfully!');
