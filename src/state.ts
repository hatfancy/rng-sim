import { PlayerCarInstance, MarketplaceListing, DropEvent, Rarity, InventoryPack } from './types';
import { CAR_CATALOG } from './data/cars';
import { AuthService } from './auth';

export interface Mission {
  id: string;
  title: string;
  desc: string;
  type: 'daily' | 'weekly';
  goal: number;
  current: number;
  rewardCash: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
}

export interface PackOpeningHistory {
  id: string;
  packName: string;
  carId: string;
  carName: string;
  rarity: Rarity;
  carValue: number;
  timestamp: number;
}

export interface PlayerState {
  cash: number;
  xp: number;
  rank: number;
  rankName: string;
  garage: PlayerCarInstance[];
  inventoryPacks: InventoryPack[];
  activeCarId: string;
  lastWheelSpin: number;
  stats: {
    cratesOpened: number;
    totalEarnedFromSales: number;
    mythicsOpened: number;
    exclusivesOpened: number;
    tradeUpsCompleted: number;
  };
  missions: Mission[];
  marketplace: MarketplaceListing[];
  history: PackOpeningHistory[];
  completedSets: string[];
  fastOpen: boolean;
  isMuted: boolean;
}

const DEFAULT_MISSIONS: Mission[] = [
  { id: 'm_open_starter', title: 'Rookie Unboxer', desc: 'Open 3 Starter Packs', type: 'daily', goal: 3, current: 0, rewardCash: 5000, rewardXp: 200, completed: false, claimed: false },
  { id: 'm_uncommon_pull', title: 'Tuner Hunter', desc: 'Pull 2 Uncommon or higher cars', type: 'daily', goal: 2, current: 0, rewardCash: 12000, rewardXp: 400, completed: false, claimed: false },
  { id: 'm_sell_cars', title: 'Pawn Star', desc: 'Instant-sell 3 duplicate cars for cash', type: 'daily', goal: 3, current: 0, rewardCash: 8000, rewardXp: 300, completed: false, claimed: false },
  { id: 'm_open_vault', title: 'Vault Cracker', desc: 'Open any Exotic or Prestige Crate', type: 'daily', goal: 1, current: 0, rewardCash: 25000, rewardXp: 600, completed: false, claimed: false },
  { id: 'm_weekly_crates', title: 'Master Collector', desc: 'Open 25 total card packs', type: 'weekly', goal: 25, current: 0, rewardCash: 60000, rewardXp: 2500, completed: false, claimed: false },
  { id: 'm_weekly_tradeup', title: 'Alchemist', desc: 'Complete 2 trade-up contracts', type: 'weekly', goal: 2, current: 0, rewardCash: 45000, rewardXp: 1800, completed: false, claimed: false },
  { id: 'm_weekly_rare', title: 'Apex Hoarder', desc: 'Collect 5 Rare or higher vehicles', type: 'weekly', goal: 5, current: 0, rewardCash: 80000, rewardXp: 3000, completed: false, claimed: false },
];

const INITIAL_MARKETPLACE: MarketplaceListing[] = [
  {
    listingId: 'mkt_1',
    sellerId: 'ai_drifter',
    sellerName: 'GhostRider_99',
    price: 8900,
    listedAt: Date.now() - 3600000 * 4,
    car: {
      instanceId: 'inst_mkt1',
      modelId: 'car_gt86_apex',
      acquiredAt: Date.now() - 86400000,
      paintColor: '#ea580c',
      finish: 'Matte',
      tintLevel: 0.6,
      customPlate: 'DRIFT-X'
    }
  },
  {
    listingId: 'mkt_2',
    sellerId: 'ai_collector',
    sellerName: 'NeonSamurai',
    price: 43000,
    listedAt: Date.now() - 3600000 * 2,
    car: {
      instanceId: 'inst_mkt2',
      modelId: 'car_skyline_r32',
      acquiredAt: Date.now() - 86400000 * 3,
      paintColor: '#475569',
      finish: 'Metallic',
      tintLevel: 0.8,
      customPlate: 'GODZILLA'
    }
  },
  {
    listingId: 'mkt_3',
    sellerId: 'ai_tuner',
    sellerName: 'TrackHawk',
    price: 198000,
    listedAt: Date.now() - 3600000 * 1,
    car: {
      instanceId: 'inst_mkt3',
      modelId: 'car_porsche_gt3_997',
      acquiredAt: Date.now() - 86400000 * 2,
      paintColor: '#f8fafc',
      finish: 'Gloss',
      tintLevel: 0.4,
      customPlate: 'RING-4.0'
    }
  }
];

export const INITIAL_RECENT_DROPS: DropEvent[] = [
  { id: 'drop_1', player: 'ApexCollector_01', carName: 'Crown Celestial Phantom V', rarity: 'Exclusive', crateName: 'Crown Prestige Vault', value: 6500000, timeAgo: '2m ago' },
  { id: 'drop_2', player: 'Vortex_Rider', carName: 'Shinsei Skyline R34 V-Spec II', rarity: 'Epic', crateName: 'Tuner & Drift Box', value: 165000, timeAgo: '4m ago' },
  { id: 'drop_3', player: 'TokyoDrift88', carName: 'Angelholm Jesko Absolut', rarity: 'Mythic', crateName: 'Exotic Supercar Pack', value: 3200000, timeAgo: '7m ago' },
  { id: 'drop_4', player: 'CyberStig', carName: 'Modena 458 Italia V8', rarity: 'Epic', crateName: 'Exotic Supercar Pack', value: 235000, timeAgo: '11m ago' },
  { id: 'drop_5', player: 'NightHawk_VIP', carName: 'Kanto Supra Twin-Turbo', rarity: 'Rare', crateName: 'Basic Pack', value: 58000, timeAgo: '14m ago' },
  { id: 'drop_6', player: 'SpeedDemon_X', carName: 'Woking F1 Central Seater', rarity: 'Legendary', crateName: 'Crown Prestige Vault', value: 1400000, timeAgo: '19m ago' }
];

const STORAGE_KEY = 'crowncards_save_v3';

export class StateManager {
  public state: PlayerState;
  private listeners: (() => void)[] = [];

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): PlayerState {
    const starterCar: PlayerCarInstance = {
      instanceId: 'starter_' + Math.random().toString(36).substring(2, 9),
      modelId: 'car_pulse_gl',
      acquiredAt: Date.now(),
      paintColor: '#64748b',
      finish: 'Gloss',
      tintLevel: 0.2,
      customPlate: 'ROOKIE-1'
    };

    return {
      cash: 25000, // Starting balance is exactly $25,000 as requested
      xp: 0,
      rank: 1,
      rankName: 'Street Rookie',
      garage: [starterCar],
      inventoryPacks: [],
      activeCarId: starterCar.instanceId,
      lastWheelSpin: 0,
      stats: {
        cratesOpened: 0,
        totalEarnedFromSales: 0,
        mythicsOpened: 0,
        exclusivesOpened: 0,
        tradeUpsCompleted: 0
      },
      missions: JSON.parse(JSON.stringify(DEFAULT_MISSIONS)),
      marketplace: JSON.parse(JSON.stringify(INITIAL_MARKETPLACE)),
      history: [],
      completedSets: [],
      fastOpen: false,
      isMuted: false
    };
  }

  private getStorageKey(): string {
    const user = AuthService.getUser();
    return user ? `crowncards_save_user_${user.id}` : 'crowncards_save_v3';
  }

  private loadState(): PlayerState {
    try {
      const saved = localStorage.getItem(this.getStorageKey());
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...this.getDefaultState(), ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse saved state, starting fresh', e);
    }
    return this.getDefaultState();
  }

  public async syncWithServer() {
    if (AuthService.isAuthenticated()) {
      const serverState = await AuthService.fetchGameState();
      if (serverState) {
        this.state = { ...this.getDefaultState(), ...serverState };
        localStorage.setItem(this.getStorageKey(), JSON.stringify(this.state));
        this.notify();
      } else {
        // First sync to server
        await AuthService.saveGameState(this.state);
      }
    }
  }

  private saveTimeout: any = null;

  public save() {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.state));
      this.notify();

      // Debounced sync to database backend
      if (AuthService.isAuthenticated()) {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
          AuthService.saveGameState(this.state);
        }, 300);
      }
    } catch (e) {
      console.error('Error saving state', e);
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public addCash(amount: number) {
    this.state.cash = Math.max(0, this.state.cash + amount);
    this.save();
  }

  public addPackToInventory(crateId: string) {
    if (!this.state.inventoryPacks) this.state.inventoryPacks = [];
    this.state.inventoryPacks.push({
      id: 'pack_' + Math.random().toString(36).substring(2, 9),
      crateId,
      addedAt: Date.now()
    });
    this.save();
  }

  public consumePackFromInventory(packId: string): string | null {
    if (!this.state.inventoryPacks) return null;
    const idx = this.state.inventoryPacks.findIndex(p => p.id === packId);
    if (idx !== -1) {
      const crateId = this.state.inventoryPacks[idx].crateId;
      this.state.inventoryPacks.splice(idx, 1);
      this.save();
      return crateId;
    }
    return null;
  }

  public addXp(amount: number) {
    this.state.xp += amount;
    const oldRank = this.state.rank;
    this.state.rank = Math.floor(Math.sqrt(this.state.xp / 100)) + 1;
    this.updateRankName();
    if (this.state.rank > oldRank) {
      const bonusCash = this.state.rank * 10000;
      this.addCash(bonusCash);
      return { rankUp: true, newRank: this.state.rank, rankName: this.state.rankName, bonusCash };
    }
    this.save();
    return { rankUp: false };
  }

  private updateRankName() {
    const ranks = [
      'Street Rookie',
      'Amateur Collector',
      'Local Enthusiast',
      'Asphalt Specialist',
      'Track Day Veteran',
      'Drift Connoisseur',
      'Pro Collector',
      'Apex Predator',
      'Supercar Elite',
      'Crown Legend'
    ];
    const idx = Math.min(ranks.length - 1, Math.floor((this.state.rank - 1) / 2));
    this.state.rankName = ranks[idx];
  }

  public getActiveCar(): { instance: PlayerCarInstance; model: any } | null {
    const instance = this.state.garage.find(c => c.instanceId === this.state.activeCarId) || this.state.garage[0];
    if (!instance) return null;
    const model = CAR_CATALOG.find(c => c.id === instance.modelId) || CAR_CATALOG[0];
    return { instance, model };
  }

  public setActiveCar(instanceId: string) {
    const exists = this.state.garage.find(c => c.instanceId === instanceId);
    if (exists) {
      this.state.activeCarId = instanceId;
      this.save();
    }
  }

  public addCarToGarage(modelId: string): PlayerCarInstance {
    const model = CAR_CATALOG.find(c => c.id === modelId) || CAR_CATALOG[0];
    const finishes: ('Gloss' | 'Matte' | 'Metallic' | 'Chrome' | 'Pearlescent')[] = ['Gloss', 'Matte', 'Metallic', 'Chrome', 'Pearlescent'];
    const chosenFinish = finishes[Math.floor(Math.random() * finishes.length)];

    const newCar: PlayerCarInstance = {
      instanceId: 'car_' + Math.random().toString(36).substring(2, 9),
      modelId: model.id,
      acquiredAt: Date.now(),
      paintColor: model.bodyColor,
      finish: chosenFinish,
      accentColor: model.accentColor,
      tintLevel: 0.3,
      customPlate: 'CRW-' + Math.floor(100 + Math.random() * 900)
    };
    this.state.garage.push(newCar);

    if (model.rarity === 'Mythic') this.state.stats.mythicsOpened++;
    if (model.rarity === 'Exclusive') this.state.stats.exclusivesOpened++;

    this.save();
    return newCar;
  }

  public sellCar(instanceId: string, sellMultiplier = 0.7): number {
    const idx = this.state.garage.findIndex(c => c.instanceId === instanceId);
    if (idx === -1 || this.state.garage.length <= 1) return 0;
    const car = this.state.garage[idx];
    const model = CAR_CATALOG.find(c => c.id === car.modelId);
    const value = Math.floor((model ? model.basePrice : 3000) * sellMultiplier);
    this.state.garage.splice(idx, 1);
    if (this.state.activeCarId === instanceId) {
      this.state.activeCarId = this.state.garage[0].instanceId;
    }
    this.state.stats.totalEarnedFromSales += value;
    this.addCash(value);
    this.progressMission('sell', 1);
    return value;
  }

  public sellDuplicates(): { count: number; totalCash: number } {
    const seen = new Set<string>();
    const toSell: string[] = [];
    let totalCash = 0;

    this.state.garage.forEach(inst => {
      if (seen.has(inst.modelId)) {
        toSell.push(inst.instanceId);
      } else {
        seen.add(inst.modelId);
      }
    });

    toSell.forEach(instId => {
      totalCash += this.sellCar(instId);
    });

    return { count: toSell.length, totalCash };
  }

  public recordDrop(packName: string, carModelId: string) {
    const model = CAR_CATALOG.find(c => c.id === carModelId);
    if (!model) return;
    this.state.history.unshift({
      id: 'hist_' + Math.random().toString(36).substring(2, 8),
      packName,
      carId: model.id,
      carName: model.name,
      rarity: model.rarity,
      carValue: model.basePrice,
      timestamp: Date.now()
    });
    if (this.state.history.length > 50) this.state.history.pop();
    this.save();
  }

  public executeTradeUp(rarity: Rarity): { success: boolean; newCar?: any } {
    const rarityOrder: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
    const currentIdx = rarityOrder.indexOf(rarity);
    if (currentIdx === -1 || currentIdx >= rarityOrder.length - 1) return { success: false };

    const matching = this.state.garage.filter(c => {
      const m = CAR_CATALOG.find(cat => cat.id === c.modelId);
      return m && m.rarity === rarity;
    });

    if (matching.length < 5) return { success: false };

    // Remove 5 cars
    for (let i = 0; i < 5; i++) {
      const removeInst = matching[i];
      const gIdx = this.state.garage.findIndex(g => g.instanceId === removeInst.instanceId);
      if (gIdx !== -1) {
        this.state.garage.splice(gIdx, 1);
      }
    }

    // Award next rarity car
    const nextRarity = rarityOrder[currentIdx + 1];
    const candidateCars = CAR_CATALOG.filter(c => c.rarity === nextRarity);
    const chosen = candidateCars[Math.floor(Math.random() * candidateCars.length)];

    this.addCarToGarage(chosen.id);
    this.state.stats.tradeUpsCompleted++;
    this.progressMission('tradeup', 1);
    this.addXp(1500);
    this.save();

    return { success: true, newCar: chosen };
  }

  public progressMission(type: string, amount: number) {
    let changed = false;
    this.state.missions.forEach(m => {
      if (!m.completed && m.id.includes(type)) {
        m.current = Math.min(m.goal, m.current + amount);
        if (m.current >= m.goal) {
          m.completed = true;
        }
        changed = true;
      }
    });
    if (changed) this.save();
  }

  public claimMission(missionId: string) {
    const mission = this.state.missions.find(m => m.id === missionId);
    if (mission && mission.completed && !mission.claimed) {
      mission.claimed = true;
      this.addCash(mission.rewardCash);
      this.addXp(mission.rewardXp);
      this.save();
      return true;
    }
    return false;
  }
}

export const stateManager = new StateManager();
