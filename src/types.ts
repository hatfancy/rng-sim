export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Exclusive';

export interface CarStats {
  topSpeed: number; // km/h
  acceleration: number; // 0-100 time in seconds
  handling: number; // 0 - 100
  braking: number; // 0 - 100
  driftFactor: number; // 0 - 100
}

export type BodyType = 'hatchback' | 'sedan' | 'sports' | 'supercar' | 'hypercar' | 'muscle' | 'classic' | 'drift' | 'formula';

export interface CarModelDef {
  id: string;
  name: string;
  brand: string;
  rarity: Rarity;
  basePrice: number;
  stats: CarStats;
  bodyColor: string;
  accentColor?: string;
  bodyType: BodyType;
  soundPitch: number;
  description: string;
  edition?: string; // e.g. "Carbon Edition", "Midnight Spec", "Apex Gold"
  setId?: string; // e.g. "set_jdm_legends", "set_supercar_icons", etc.
}

export interface PlayerCarInstance {
  instanceId: string;
  modelId: string;
  acquiredAt: number;
  paintColor: string;
  finish?: 'Gloss' | 'Matte' | 'Metallic' | 'Chrome' | 'Pearlescent';
  accentColor?: string;
  neonColor?: string;
  tintLevel: number;
  mileage?: number;
  customPlate?: string;
}

export interface CrateDefinition {
  id: string;
  name: string;
  price: number;
  description: string;
  odds: Record<Rarity, number>; // exact percentage
  accentHex: string;
  icon: string;
  isSpecial?: boolean;
  endsInSeconds?: number;
}

export interface CarSet {
  id: string;
  name: string;
  description: string;
  carIds: string[];
  rewardCash: number;
  rewardXp: number;
  rewardTitle: string;
}

export interface MarketplaceListing {
  listingId: string;
  sellerId: string;
  sellerName: string;
  car: PlayerCarInstance;
  price: number;
  listedAt: number;
}

export interface DropEvent {
  id: string;
  player: string;
  carName: string;
  rarity: Rarity;
  crateName: string;
  value: number;
  timeAgo: string;
}

export interface InventoryPack {
  id: string;
  crateId: string;
  addedAt: number;
}

export interface AuthUser {
  id: string;
  username: string;
  role: 'user' | 'admin';
}
