import { CAR_CATALOG, CRATE_CATALOG, RARITY_CONFIG, DAILY_REWARD_ITEMS, CAR_SETS } from './data/cars';
import { stateManager, INITIAL_RECENT_DROPS } from './state';
import { Rarity, CarModelDef, CrateDefinition } from './types';
import { soundEngine } from './sound';
import { AuthService } from './auth';
import confetti from 'canvas-confetti';

export class UIManager {
  private activeTab: string = 'packs';
  private onCarChangeCallback?: (modelId: string, isReveal?: boolean) => void;

  // Search & Filter state for Inventory
  private invSearch: string = '';
  private invRarityFilter: string = 'ALL';
  private invSortBy: 'value_desc' | 'value_asc' | 'rarity' | 'newest' = 'value_desc';

  // Roulette Animation State
  private isOpeningAnimation: boolean = false;
  private skipAnimationRequested: boolean = false;

  constructor(onCarChange?: (modelId: string, isReveal?: boolean) => void) {
    this.onCarChangeCallback = onCarChange;
    
    // Check authentication first
    AuthService.init();
    this.setupAuthUI();

    this.renderFrontPacks();
    this.renderRecentDropsTicker();
    this.bindGlobalHUDButtons();
    this.renderHUD();

    stateManager.subscribe(() => {
      this.renderHUD();
      this.renderFrontPacks();
    });

    // Start limited crate countdown ticker
    setInterval(() => {
      this.updateSpecialTimers();
    }, 1000);

    // Initial server sync
    if (AuthService.isAuthenticated()) {
      stateManager.syncWithServer().then(() => {
        this.renderHUD();
        this.renderFrontPacks();
        if (this.onCarChangeCallback) {
          const active = stateManager.getActiveCar();
          if (active) this.onCarChangeCallback(active.model.id);
        }
      });
    }
  }

  // --- AUTHENTICATION & LOGIN UI ---
  private setupAuthUI() {
    const overlay = document.getElementById('auth-modal-overlay');
    const tabLogin = document.getElementById('tab-btn-login');
    const tabRegister = document.getElementById('tab-btn-register');
    const submitBtn = document.getElementById('btn-auth-submit');
    const form = document.getElementById('auth-form');
    const usernameInput = document.getElementById('auth-username') as HTMLInputElement;
    const passwordInput = document.getElementById('auth-password') as HTMLInputElement;
    const errorBox = document.getElementById('auth-error-msg');

    let mode: 'login' | 'register' = 'login';

    const setMode = (m: 'login' | 'register') => {
      mode = m;
      if (errorBox) errorBox.style.display = 'none';
      if (m === 'login') {
        if (tabLogin) {
          tabLogin.style.background = '#38bdf8';
          tabLogin.style.color = '#0f172a';
        }
        if (tabRegister) {
          tabRegister.style.background = 'transparent';
          tabRegister.style.color = '#94a3b8';
        }
        if (submitBtn) submitBtn.textContent = 'LOG IN';
      } else {
        if (tabRegister) {
          tabRegister.style.background = '#38bdf8';
          tabRegister.style.color = '#0f172a';
        }
        if (tabLogin) {
          tabLogin.style.background = 'transparent';
          tabLogin.style.color = '#94a3b8';
        }
        if (submitBtn) submitBtn.textContent = 'CREATE ACCOUNT';
      }
    };

    tabLogin?.addEventListener('click', () => setMode('login'));
    tabRegister?.addEventListener('click', () => setMode('register'));

    const handleAuthSubmit = async () => {
      const u = usernameInput?.value.trim();
      const p = passwordInput?.value;
      if (!u || !p) {
        if (errorBox) {
          errorBox.textContent = 'Please fill in both username and password';
          errorBox.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.textContent = 'Processing...';
        (submitBtn as HTMLButtonElement).disabled = true;
      }

      const res = mode === 'login' ? await AuthService.login(u, p) : await AuthService.register(u, p);

      if (submitBtn) {
        (submitBtn as HTMLButtonElement).disabled = false;
        submitBtn.textContent = mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT';
      }

      if (res.success && res.user) {
        if (overlay) overlay.style.display = 'none';
        soundEngine.playCashEarned();
        confetti({ particleCount: 70, spread: 60 });
        
        // Load user's data from database
        await stateManager.syncWithServer();
        this.renderHUD();
        this.renderFrontPacks();
        if (this.onCarChangeCallback) {
          const active = stateManager.getActiveCar();
          if (active) this.onCarChangeCallback(active.model.id);
        }
      } else {
        if (errorBox) {
          errorBox.textContent = res.error || 'Authentication error';
          errorBox.style.display = 'block';
        }
      }
    };

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      handleAuthSubmit();
    });

    document.getElementById('btn-hud-logout')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Are you sure you want to log out? Your progress is securely saved.')) {
        AuthService.logout();
      }
    });

    document.getElementById('btn-user-profile')?.addEventListener('click', () => {
      const user = AuthService.getUser();
      if (!user) return;
      alert(`👤 Logged in as: ${user.username}\nRole: ${user.role.toUpperCase()}\nUser ID: ${user.id}`);
    });

    // Check if user is already logged in
    if (!AuthService.isAuthenticated()) {
      if (overlay) overlay.style.display = 'flex';
    } else {
      if (overlay) overlay.style.display = 'none';
    }
  }

  private bindGlobalHUDButtons() {
    // Sidebar toggle and close listeners
    const sidebar = document.getElementById('app-sidebar');
    const toggleSidebar = () => {
      sidebar?.classList.toggle('collapsed');
      soundEngine.playTick();
    };

    document.getElementById('sidebar-toggle-btn')?.addEventListener('click', toggleSidebar);
    document.getElementById('btn-close-sidebar')?.addEventListener('click', () => {
      sidebar?.classList.add('collapsed');
    });

    // Top Navigation Bar clicks
    const topNavBar = document.getElementById('top-nav-bar');
    if (topNavBar) {
      topNavBar.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest('.top-nav-btn') as HTMLElement;
        if (target && target.dataset.tab) {
          const tab = target.dataset.tab;
          if (tab === 'packs') {
            this.closeModal();
            this.setActiveNavTab('packs');
          } else {
            this.openModal(tab);
          }
        }
      });
    }

    // Sidebar Menu item clicks
    document.querySelectorAll('.side-nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = (e.currentTarget as HTMLElement);
        const tab = target.dataset.tab;
        if (tab) {
          sidebar?.classList.add('collapsed');
          if (tab === 'packs') {
            this.closeModal();
            this.setActiveNavTab('packs');
          } else {
            this.openModal(tab);
          }
        }
      });
    });

    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).id === 'modal-overlay') {
        this.closeModal();
      }
    });

    document.getElementById('btn-close-modal')?.addEventListener('click', () => {
      this.closeModal();
    });

    // Settings listeners (Fast Open & Audio Mute)
    document.getElementById('toggle-fast-open')?.addEventListener('click', () => {
      stateManager.state.fastOpen = !stateManager.state.fastOpen;
      stateManager.save();
      this.updateSettingsPills();
    });

    document.getElementById('toggle-mute')?.addEventListener('click', () => {
      stateManager.state.isMuted = !stateManager.state.isMuted;
      stateManager.save();
      this.updateSettingsPills();
    });

    this.updateSettingsPills();

    // ---- CHEAT MENU ----
    const cheatOverlay = document.getElementById('cheat-overlay')!;
    const openCheat  = () => { cheatOverlay.style.display = 'flex'; };
    const closeCheat = () => { cheatOverlay.style.display = 'none'; };

    document.getElementById('btn-cheat-menu')?.addEventListener('click', openCheat);
    document.getElementById('cheat-close')?.addEventListener('click', closeCheat);
    cheatOverlay?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement) === cheatOverlay) closeCheat();
    });

    // Custom amount
    document.getElementById('cheat-custom-btn')?.addEventListener('click', () => {
      const inp = document.getElementById('cheat-custom-input') as HTMLInputElement;
      const amount = Math.max(1, parseInt(inp.value) || 0);
      stateManager.addCash(amount);
      soundEngine.playCashEarned();
      confetti({ particleCount: 80, spread: 70 });
      this.renderHUD();
    });

    // Quick presets
    document.querySelectorAll('.cheat-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const amount = parseInt((e.currentTarget as HTMLElement).dataset.amount || '0');
        stateManager.addCash(amount);
        soundEngine.playCashEarned();
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
        this.renderHUD();
      });
    });

    // Max XP / rank
    document.getElementById('cheat-max-xp')?.addEventListener('click', () => {
      stateManager.addXp(500000);
      soundEngine.playCashEarned();
      confetti({ particleCount: 100, spread: 80 });
      this.renderHUD();
    });

    // Complete all missions
    document.getElementById('cheat-complete-missions')?.addEventListener('click', () => {
      stateManager.state.missions.forEach(m => {
        m.current = m.goal;
        m.completed = true;
      });
      stateManager.save();
      this.renderHUD();
      alert('✅ All missions marked complete — open Missions to claim rewards!');
    });

    // Reset save
    document.getElementById('cheat-reset')?.addEventListener('click', () => {
      if (confirm('⚠️ This will wipe ALL progress and start fresh. Are you sure?')) {
        localStorage.removeItem('crowncards_save_v3');
        location.reload();
      }
    });
  }

  private updateSettingsPills() {
    const fastBtn = document.getElementById('toggle-fast-open');
    if (fastBtn) {
      fastBtn.textContent = stateManager.state.fastOpen ? '⚡ Fast Open: ON' : '⚡ Fast Open: OFF';
      fastBtn.style.color = stateManager.state.fastOpen ? '#4ade80' : '#94a3b8';
      fastBtn.style.borderColor = stateManager.state.fastOpen ? '#22c55e' : 'rgba(255,255,255,0.15)';
    }

    const muteBtn = document.getElementById('toggle-mute');
    if (muteBtn) {
      muteBtn.textContent = stateManager.state.isMuted ? '🔇 Audio: MUTED' : '🔊 Audio: ON';
      muteBtn.style.color = stateManager.state.isMuted ? '#f87171' : '#38bdf8';
    }
  }

  private setActiveNavTab(tab: string) {
    this.activeTab = tab;
    document.querySelectorAll('.top-nav-btn').forEach(btn => {
      const bTab = (btn as HTMLElement).dataset.tab;
      if (bTab === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('.side-nav-item').forEach(btn => {
      const bTab = (btn as HTMLElement).dataset.tab;
      if (bTab === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  public renderHUD() {
    const s = stateManager.state;
    const user = AuthService.getUser();

    // User display in HUD
    const hudUser = document.getElementById('hud-username');
    const hudRole = document.getElementById('hud-user-role');
    const sideAdminBtn = document.getElementById('side-admin-btn');

    if (hudUser) hudUser.textContent = user ? user.username : 'Guest';
    if (hudRole) hudRole.textContent = user ? user.role.toUpperCase() : 'OFFLINE';

    if (sideAdminBtn) {
      sideAdminBtn.style.display = AuthService.isAdmin() ? 'flex' : 'none';
    }

    const cashEl = document.getElementById('hud-cash');
    if (cashEl) cashEl.textContent = '$' + s.cash.toLocaleString();

    const xpEl = document.getElementById('hud-rank');
    if (xpEl) xpEl.textContent = `Lv.${s.rank} - ${s.rankName}`;

    const countEl = document.getElementById('hud-car-count');
    if (countEl) countEl.textContent = s.garage.length.toString();

    const totalValue = s.garage.reduce((sum, item) => {
      const model = CAR_CATALOG.find(c => c.id === item.modelId);
      return sum + (model ? model.basePrice : 3000);
    }, 0);

    const valEl = document.getElementById('hud-inv-value');
    if (valEl) valEl.textContent = '$' + totalValue.toLocaleString();

    // Unique collection completion percentage
    const uniqueIds = new Set(s.garage.map(g => g.modelId));
    const pct = ((uniqueIds.size / CAR_CATALOG.length) * 100).toFixed(1);
    const pctEl = document.getElementById('hud-collection-pct');
    if (pctEl) pctEl.textContent = `${pct}% (${uniqueIds.size}/${CAR_CATALOG.length})`;
  }

  // --- RECENT DROPS TICKER ---
  private renderRecentDropsTicker() {
    const ticker = document.getElementById('recent-drops-track');
    if (!ticker) return;

    ticker.innerHTML = INITIAL_RECENT_DROPS.map(drop => {
      const cfg = RARITY_CONFIG[drop.rarity];
      return `
        <div class="drop-pill" style="border-left: 3px solid ${cfg.color};">
          <span style="color: #94a3b8; font-size: 11px;">${drop.player}</span>
          <span style="color: ${cfg.color}; font-weight: 800;">${drop.carName}</span>
          <span style="color: #4ade80; font-weight: 700;">$${drop.value.toLocaleString()}</span>
          <span style="color: #64748b; font-size: 10px;">(${drop.crateName})</span>
        </div>
      `;
    }).join('');
  }

  // --- FRONT PACKS STORE ---
  public renderFrontPacks() {
    const container = document.getElementById('front-packs-grid');
    if (!container) return;

    container.innerHTML = CRATE_CATALOG.map(crate => {
      const oddsHtml = Object.entries(crate.odds)
        .filter(([_, rate]) => Number(rate) > 0)
        .map(([rarity, rate]) => {
          const cfg = RARITY_CONFIG[rarity as Rarity];
          return `
            <div class="odds-row">
              <span class="odds-rarity" style="color: ${cfg.color};">${rarity}</span>
              <span class="odds-val">${rate}%</span>
            </div>
          `;
        }).join('');

      return `
        <div class="pack-card ${crate.isSpecial ? 'pack-special' : ''}" style="border: 2px solid ${crate.accentHex};">
          ${crate.isSpecial ? `
            <div style="position: absolute; top: 12px; right: 14px; background: linear-gradient(135deg, #ec4899, #f43f5e); color: white; font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 8px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 12px rgba(236,72,153,0.4);">
              LIMITED TIME EVENT
            </div>
          ` : ''}

          <div>
            <div class="pack-header">
              <span class="pack-icon">${crate.icon}</span>
              <div>
                <h3 class="pack-name">${crate.name}</h3>
                <span style="font-size: 11px; color: ${crate.accentHex}; font-weight: 700; text-transform: uppercase;">
                  ${crate.isSpecial ? 'Boosted Touge Odds' : '100% Certified Odds'}
                </span>
              </div>
            </div>

            <p class="pack-desc">${crate.description}</p>

            ${crate.isSpecial ? `
              <div style="background: rgba(236, 72, 153, 0.15); border: 1px solid rgba(236, 72, 153, 0.3); border-radius: 10px; padding: 8px 12px; margin-bottom: 12px; font-size: 12px; color: #f472b6; font-weight: 700; display: flex; justify-content: space-between;">
                <span>Ends In:</span>
                <span class="timer-countdown" data-ends="182400">48h 12m 30s</span>
              </div>
            ` : ''}

            <div class="odds-container">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div class="odds-title" style="margin-bottom: 0;">Drop Probabilities</div>
                <button class="btn-inspect-pack" data-id="${crate.id}" style="background: none; border: none; color: #38bdf8; font-size: 11px; font-weight: 700; cursor: pointer; text-decoration: underline;">
                  View Loot Pool 🔍
                </button>
              </div>
              ${oddsHtml}
            </div>
          </div>

          <div class="pack-footer">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <div class="pack-price">$${crate.price.toLocaleString()}</div>
              <div style="font-size: 11px; color: #94a3b8;">per crate</div>
            </div>

            <!-- Large Attractive OPEN PACK button & Multi-Open Options -->
            <button class="btn-buy-pack btn-open-pack-hero" data-id="${crate.id}" data-count="1" style="
              width: 100%;
              padding: 14px;
              background: linear-gradient(135deg, ${crate.accentHex}, #ffffff22);
              color: #0f172a;
              font-weight: 900;
              font-size: 16px;
              letter-spacing: 1px;
              border-radius: 12px;
              border: 2px solid rgba(255, 255, 255, 0.4);
              cursor: pointer;
              box-shadow: 0 4px 20px ${crate.accentHex}66;
              transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            ">
              ✨ OPEN PACK ✨
            </button>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-top: 6px;">
              <button class="btn-buy-pack btn-multi" data-id="${crate.id}" data-count="3" title="Open 3 for $${(crate.price * 3).toLocaleString()}">
                3x ($${(crate.price * 3).toLocaleString()})
              </button>
              <button class="btn-buy-pack btn-multi" data-id="${crate.id}" data-count="5" title="Open 5 for $${(crate.price * 5).toLocaleString()}">
                5x ($${(crate.price * 5).toLocaleString()})
              </button>
              <button class="btn-buy-pack btn-multi" data-id="${crate.id}" data-count="10" title="Open 10 for $${(crate.price * 10).toLocaleString()}">
                10x ($${(crate.price * 10).toLocaleString()})
              </button>
            </div>
            <button class="btn-buy-pack" data-id="${crate.id}" data-action="store" style="margin-top: 6px; padding: 7px; background: rgba(30,41,59,0.9); border: 1px dashed ${crate.accentHex}; color: #38bdf8; font-size: 11px; font-weight: 800; border-radius: 8px; cursor: pointer;">
              💼 BUY & SAVE PACK TO VAULT
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.btn-buy-pack').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const crateId = (e.currentTarget as HTMLElement).dataset.id;
        const count = parseInt((e.currentTarget as HTMLElement).dataset.count || '1');
        const action = (e.currentTarget as HTMLElement).dataset.action || 'open';
        if (crateId) {
          if (action === 'store') {
            this.handleStorePack(crateId);
          } else {
            this.handleOpenPack(crateId, count);
          }
        }
      });
    });

    container.querySelectorAll('.btn-inspect-pack').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const crateId = (e.currentTarget as HTMLElement).dataset.id;
        if (crateId) this.showPackLootPoolModal(crateId);
      });
    });
  }

  private updateSpecialTimers() {
    document.querySelectorAll('.timer-countdown').forEach(el => {
      let sec = parseInt(el.getAttribute('data-ends') || '182400') - 1;
      if (sec < 0) sec = 0;
      el.setAttribute('data-ends', sec.toString());
      const hours = Math.floor(sec / 3600);
      const mins = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      el.textContent = `${hours}h ${mins}m ${s}s`;
    });
  }

  private showPackLootPoolModal(crateId: string) {
    const crate = CRATE_CATALOG.find(c => c.id === crateId);
    if (!crate) return;

    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    if (!overlay || !container || !title) return;

    title.textContent = `🔍 Loot Pool: ${crate.name}`;

    // Filter which rarities exist in this crate
    const activeRarities = Object.entries(crate.odds)
      .filter(([_, rate]) => Number(rate) > 0)
      .map(([r]) => r);

    const eligibleCars = CAR_CATALOG.filter(c => activeRarities.includes(c.rarity));

    container.innerHTML = `
      <div style="margin-bottom: 18px; color: #94a3b8; font-size: 14px;">
        Every car in this crate's drop pool is 100% obtainable based on the certified probability table.
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px;">
        ${eligibleCars.map(car => {
          const cfg = RARITY_CONFIG[car.rarity];
          return `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid ${cfg.color}; border-radius: 12px; padding: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; background: ${cfg.color}; color: #0f172a;">${car.rarity}</span>
                <span style="font-size: 13px; font-weight: 800; color: #4ade80;">$${car.basePrice.toLocaleString()}</span>
              </div>
              <h4 style="font-size: 15px; font-weight: 800; color: #f8fafc; margin-bottom: 2px;">${car.name}</h4>
              <p style="font-size: 12px; color: #94a3b8;">${car.brand} &bull; ${car.bodyType}</p>
            </div>
          `;
        }).join('')}
      </div>
    `;

    overlay.style.display = 'flex';
  }

  private handleStorePack(crateId: string) {
    const crate = CRATE_CATALOG.find(c => c.id === crateId);
    if (!crate) return;
    if (stateManager.state.cash < crate.price) {
      alert(`Insufficient virtual funds! Storing this pack requires $${crate.price.toLocaleString()}`);
      return;
    }
    stateManager.addCash(-crate.price);
    stateManager.addPackToInventory(crate.id);
    soundEngine.playCashEarned();
    confetti({ particleCount: 50, spread: 50 });
    alert(`📦 ${crate.name} successfully purchased and stored in your Stored Packs Vault!`);
    this.renderHUD();
  }

  // --- PACK PURCHASE & DRAW SYSTEM ---
  private handleOpenPack(crateId: string, count: number = 1) {
    const crate = CRATE_CATALOG.find(c => c.id === crateId);
    if (!crate) return;

    const totalCost = crate.price * count;
    if (stateManager.state.cash < totalCost) {
      alert(`Insufficient virtual cash! Opening ${count}x requires $${totalCost.toLocaleString()}`);
      return;
    }

    stateManager.addCash(-totalCost);
    stateManager.state.stats.cratesOpened += count;
    stateManager.progressMission('open_starter', count);
    stateManager.progressMission('open_vault', count);
    stateManager.progressMission('weekly_crates', count);

    // Roll random car results using genuine mathematical probabilities
    const rolledCars: CarModelDef[] = [];
    for (let i = 0; i < count; i++) {
      rolledCars.push(this.rollRandomCar(crate));
    }

    if (stateManager.state.fastOpen) {
      // Instant reveal
      this.displayMultiRevealSummary(crate, rolledCars);
    } else if (count === 1) {
      // Show interactive 3D Pack Slider selection stage first!
      this.showInteractivePackSlider(crate, rolledCars[0]);
    } else {
      // Multi-pack fast unboxing sequence
      this.startMultiPackOpeningAnimation(crate, rolledCars);
    }
  }

  private rollRandomCar(crate: CrateDefinition): CarModelDef {
    const rand = Math.random() * 100;
    let accumulated = 0;
    let selectedRarity: Rarity = 'Common';

    for (const [r, chance] of Object.entries(crate.odds)) {
      accumulated += Number(chance);
      if (rand <= accumulated) {
        selectedRarity = r as Rarity;
        break;
      }
    }

    const pool = CAR_CATALOG.filter(c => c.rarity === selectedRarity);
    const chosen = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : CAR_CATALOG[0];

    // Record drop event in history
    stateManager.recordDrop(crate.name, chosen.id);

    if (['Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Exclusive'].includes(chosen.rarity)) {
      stateManager.progressMission('uncommon_pull', 1);
    }
    if (['Rare', 'Epic', 'Legendary', 'Mythic', 'Exclusive'].includes(chosen.rarity)) {
      stateManager.progressMission('weekly_rare', 1);
    }

    return chosen;
  }

  // --- INTERACTIVE PACK PICKER SLIDER STAGE ---
  private showInteractivePackSlider(crate: CrateDefinition, winningCar: CarModelDef) {
    this.isOpeningAnimation = true;
    const screen = document.getElementById('reveal-screen');
    if (!screen) return;

    soundEngine.playCrateOpen();

    // Generate 5 mystery crates with subtle weight/aura differences
    const auraQualities = [
      { id: 0, label: 'Heavyweight Spec', aura: '98% Density', hint: 'Feels weighted with steel chassis', glow: '#38bdf8' },
      { id: 1, label: 'Twin-Turbocharged', aura: 'High Frequency', hint: 'Audible high-rev resonance inside', glow: '#f59e0b' },
      { id: 2, label: 'Apex Specimen', aura: 'Extreme Flux', hint: 'Unstable magnetic aura detected', glow: '#ec4899' },
      { id: 3, label: 'Midnight Grail', aura: 'Ethereal Aura', hint: 'Cold titanium casing with purple glow', glow: '#a855f7' },
      { id: 4, label: 'Precision Tuned', aura: 'Clean Acoustics', hint: 'Balanced curb weight and clean seal', glow: '#22c55e' }
    ];

    screen.innerHTML = `
      <div id="slider-selection-screen" style="
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: radial-gradient(circle at center, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.99) 100%);
        backdrop-filter: blur(20px);
        z-index: 200; display: flex; flex-direction: column; align-items: center; justify-content: center;
        overflow: hidden; padding: 20px;
      ">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px; z-index: 10;">
          <div style="
            display: inline-block; padding: 6px 18px; border-radius: 20px;
            background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8;
            color: #38bdf8; font-size: 11px; font-weight: 800; letter-spacing: 1.5px;
            text-transform: uppercase; margin-bottom: 8px;
          ">
            CHOOSE YOUR LUCKY CRATE
          </div>
          <h2 style="font-size: 32px; font-weight: 900; color: #f8fafc; letter-spacing: -0.5px; margin-bottom: 4px;">
            ${crate.name} Pack Selection
          </h2>
          <p style="font-size: 14px; color: #94a3b8; max-width: 520px; margin: 0 auto;">
            Slide through the batch of freshly minted packs. Inspect each pack's unique resonance aura, then choose which one to tear open!
          </p>
        </div>

        <!-- Slider Carousel Container -->
        <div style="
          position: relative; width: 100%; max-width: 900px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        ">
          <!-- Left Arrow -->
          <button id="btn-slide-left" style="
            position: absolute; left: 0; z-index: 20;
            background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(255,255,255,0.2);
            color: #f8fafc; font-size: 26px; width: 48px; height: 48px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5); transition: all 0.2s;
          ">&#10094;</button>

          <!-- Slider Strip -->
          <div id="slider-cards-wrapper" style="
            display: flex; gap: 20px; overflow-x: auto; scroll-behavior: smooth;
            padding: 24px 60px; scrollbar-width: none;
          ">
            ${auraQualities.map((item, idx) => `
              <div class="slider-pack-card ${idx === 2 ? 'selected-pack-card' : ''}" data-idx="${idx}" style="
                flex: 0 0 230px;
                background: linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
                border: 2px solid ${idx === 2 ? item.glow : 'rgba(255,255,255,0.1)'};
                border-radius: 20px; padding: 22px 18px; text-align: center;
                cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: ${idx === 2 ? `0 12px 35px ${item.glow}55` : '0 8px 25px rgba(0,0,0,0.4)'};
                transform: ${idx === 2 ? 'scale(1.08) translateY(-6px)' : 'scale(0.96)'};
                position: relative; overflow: hidden;
              ">
                <div style="font-size: 10px; font-weight: 800; color: ${item.glow}; text-transform: uppercase; margin-bottom: 8px;">
                  Pack #${idx + 1} &bull; ${item.label}
                </div>
                <div class="shaking-crate" style="font-size: 64px; filter: drop-shadow(0 0 25px ${item.glow}); margin-bottom: 12px;">
                  ${crate.icon}
                </div>
                <div style="font-size: 15px; font-weight: 800; color: #f8fafc; margin-bottom: 4px;">
                  ${item.aura}
                </div>
                <div style="font-size: 11px; color: #94a3b8; line-height: 1.4; margin-bottom: 16px; min-height: 32px;">
                  "${item.hint}"
                </div>
                <button class="btn-select-this-pack" style="
                  width: 100%; padding: 10px;
                  background: ${idx === 2 ? item.glow : 'rgba(255,255,255,0.08)'};
                  color: ${idx === 2 ? '#0f172a' : '#cbd5e1'};
                  font-weight: 900; font-size: 12px; border: none; border-radius: 10px;
                  cursor: pointer; letter-spacing: 0.5px;
                ">
                  ${idx === 2 ? '★ SELECTED ★' : 'SELECT PACK'}
                </button>
              </div>
            `).join('')}
          </div>

          <!-- Right Arrow -->
          <button id="btn-slide-right" style="
            position: absolute; right: 0; z-index: 20;
            background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(255,255,255,0.2);
            color: #f8fafc; font-size: 26px; width: 48px; height: 48px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5); transition: all 0.2s;
          ">&#10095;</button>
        </div>

        <!-- Big Confirmation Open Button -->
        <button id="btn-confirm-chosen-pack" style="
          padding: 16px 48px;
          background: linear-gradient(135deg, ${crate.accentHex}, #38bdf8);
          color: #0f172a; font-weight: 900; font-size: 17px; letter-spacing: 1.5px;
          border-radius: 14px; border: none; cursor: pointer;
          box-shadow: 0 6px 25px ${crate.accentHex}77;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        ">
          💥 RIP OPEN SELECTED PACK 💥
        </button>
      </div>
    `;

    screen.style.display = 'block';

    const wrapper = document.getElementById('slider-cards-wrapper');
    const cards = screen.querySelectorAll('.slider-pack-card');
    let selectedIndex = 2;

    const updateSelection = (idx: number) => {
      selectedIndex = idx;
      cards.forEach((c, i) => {
        const item = auraQualities[i];
        const btn = c.querySelector('.btn-select-this-pack') as HTMLButtonElement;
        if (i === idx) {
          (c as HTMLElement).style.border = `2px solid ${item.glow}`;
          (c as HTMLElement).style.boxShadow = `0 12px 35px ${item.glow}55`;
          (c as HTMLElement).style.transform = 'scale(1.08) translateY(-6px)';
          if (btn) {
            btn.style.background = item.glow;
            btn.style.color = '#0f172a';
            btn.textContent = '★ SELECTED ★';
          }
        } else {
          (c as HTMLElement).style.border = '2px solid rgba(255,255,255,0.1)';
          (c as HTMLElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
          (c as HTMLElement).style.transform = 'scale(0.96)';
          if (btn) {
            btn.style.background = 'rgba(255,255,255,0.08)';
            btn.style.color = '#cbd5e1';
            btn.textContent = 'SELECT PACK';
          }
        }
      });
      soundEngine.playTick();
    };

    cards.forEach((card, idx) => {
      card.addEventListener('click', () => updateSelection(idx));
    });

    document.getElementById('btn-slide-left')?.addEventListener('click', () => {
      if (wrapper) wrapper.scrollBy({ left: -240, behavior: 'smooth' });
      if (selectedIndex > 0) updateSelection(selectedIndex - 1);
    });

    document.getElementById('btn-slide-right')?.addEventListener('click', () => {
      if (wrapper) wrapper.scrollBy({ left: 240, behavior: 'smooth' });
      if (selectedIndex < auraQualities.length - 1) updateSelection(selectedIndex + 1);
    });

    document.getElementById('btn-confirm-chosen-pack')?.addEventListener('click', () => {
      this.startRouletteOpeningAnimation(crate, winningCar);
    });
  }

  // --- FULL CINEMATIC EXPLODING CRATE & 3D CAR REVEAL ANIMATION ---
  private startRouletteOpeningAnimation(crate: CrateDefinition, winningCar: CarModelDef) {
    this.isOpeningAnimation = true;
    this.skipAnimationRequested = false;

    const screen = document.getElementById('reveal-screen');
    if (!screen) return;

    soundEngine.playShaking();

    screen.innerHTML = `
      <div id="cinematic-stage" style="
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: radial-gradient(circle at center, rgba(15, 23, 42, 0.92) 0%, rgba(2, 6, 23, 0.98) 100%);
        z-index: 200; display: flex; flex-direction: column; align-items: center; justify-content: center;
        overflow: hidden;
      ">
        <!-- Dramatic energy ring behind pack -->
        <div id="pack-energy-ring" style="
          position: absolute; width: 340px; height: 340px; border-radius: 50%;
          border: 4px dashed ${crate.accentHex};
          box-shadow: 0 0 60px ${crate.accentHex}88;
          animation: spinRing 4s linear infinite;
          opacity: 0.7;
        "></div>

        <!-- 3D Crate Box in Centre -->
        <div id="opening-crate-container" style="
          position: relative; text-align: center; z-index: 10;
          transition: all 0.3s ease;
        ">
          <div id="the-pack-box" class="shaking-crate" style="
            font-size: 110px;
            filter: drop-shadow(0 0 45px ${crate.accentHex});
            cursor: pointer;
            user-select: none;
            transition: transform 0.2s;
          ">
            ${crate.icon}
          </div>

          <div id="pack-status-text" style="
            font-size: 24px; font-weight: 900; color: #f8fafc; margin-top: 18px;
            text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 20px ${crate.accentHex};
          ">
            ${crate.name}
          </div>
          <div id="pack-sub-text" style="font-size: 13px; color: ${crate.accentHex}; font-weight: 700; margin-top: 6px;">
            CHARGING ENERGY...
          </div>
        </div>

        <!-- Skip Button -->
        <button id="btn-skip-anim" style="
          position: absolute; bottom: 40px;
          background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.25);
          color: #f8fafc; padding: 12px 32px; border-radius: 24px;
          font-weight: 800; font-size: 14px; cursor: pointer;
          backdrop-filter: blur(10px); transition: all 0.2s;
          letter-spacing: 1px; z-index: 20;
        ">
          SKIP ANIMATION ⏩
        </button>
      </div>

      <style>
        @keyframes spinRing {
          0% { transform: scale(0.9) rotate(0deg); }
          50% { transform: scale(1.1) rotate(180deg); }
          100% { transform: scale(0.9) rotate(360deg); }
        }
      </style>
    `;

    screen.style.display = 'block';

    const packBox = document.getElementById('the-pack-box');
    const statusText = document.getElementById('pack-status-text');
    const subText = document.getElementById('pack-sub-text');
    const energyRing = document.getElementById('pack-energy-ring');
    const skipBtn = document.getElementById('btn-skip-anim');

    let skipped = false;
    const doSkip = () => {
      if (skipped) return;
      skipped = true;
      this.isOpeningAnimation = false;
      this.showDramaticCarReveal(crate, winningCar);
    };

    skipBtn?.addEventListener('click', doSkip);

    // Sequence Stage 1: Initial Shaking (0 to 1.8s)
    let shakeAudioInterval = setInterval(() => {
      if (skipped) return clearInterval(shakeAudioInterval);
      soundEngine.playShaking();
    }, 280);

    // Sequence Stage 2: Intense Violent Shaking & Glowing Sparks (1.8s to 3.2s)
    setTimeout(() => {
      if (skipped) return;
      if (packBox) {
        packBox.classList.remove('shaking-crate');
        packBox.classList.add('violent-shaking');
      }
      if (statusText) statusText.textContent = 'UNSTABLE ENERGY BURST!';
      if (subText) subText.textContent = 'GET READY FOR THE REVEAL...';
      if (energyRing) {
        energyRing.style.boxShadow = `0 0 120px ${crate.accentHex}`;
        energyRing.style.borderColor = '#ffffff';
      }
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.5 } });
    }, 1800);

    // Sequence Stage 3: Dramatic Pause & Explosion (3.2s)
    setTimeout(() => {
      if (skipped) return;
      clearInterval(shakeAudioInterval);
      if (packBox) {
        packBox.classList.remove('violent-shaking');
        packBox.classList.add('crate-explode');
      }
      if (statusText) statusText.style.display = 'none';
      if (subText) subText.style.display = 'none';
      if (energyRing) energyRing.style.display = 'none';

      soundEngine.playExplosion();
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 },
        colors: [crate.accentHex, '#ffffff', '#facc15', '#ec4899']
      });
    }, 3200);

    // Sequence Stage 4: Reveal 3D Car inside (3.8s)
    setTimeout(() => {
      if (skipped) return;
      this.isOpeningAnimation = false;
      this.showDramaticCarReveal(crate, winningCar);
    }, 3800);
  }

  // --- MULTI-PACK UNBOXING SEQUENCE ---
  private startMultiPackOpeningAnimation(crate: CrateDefinition, rolledCars: CarModelDef[]) {
    soundEngine.playCrateOpen();
    const screen = document.getElementById('reveal-screen');
    if (!screen) return;

    screen.innerHTML = `
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at center, #0f172a 0%, #020617 100%); z-index: 200; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px;">
        <h2 style="font-size: 28px; font-weight: 900; color: #f8fafc; margin-bottom: 8px;">Unboxing ${rolledCars.length}x ${crate.name}...</h2>
        <div style="display: flex; gap: 16px; margin-bottom: 24px;">
          ${Array(rolledCars.length).fill(0).map((_, idx) => `
            <div class="shaking-crate" style="font-size: 48px; animation-delay: ${idx * 0.1}s;">${crate.icon}</div>
          `).join('')}
        </div>
        <button id="btn-skip-multi" style="background: #38bdf8; color: #0f172a; padding: 12px 28px; font-weight: 800; border-radius: 12px; border: none; cursor: pointer;">
          REVEAL ALL ITEMS ⚡
        </button>
      </div>
    `;
    screen.style.display = 'block';

    const proceed = () => {
      this.displayMultiRevealSummary(crate, rolledCars);
    };

    document.getElementById('btn-skip-multi')?.addEventListener('click', proceed);
    setTimeout(proceed, 1800);
  }

  // --- MULTI REVEAL SUMMARY WITH KEEP ALL / SELL ALL ---
  private displayMultiRevealSummary(crate: CrateDefinition, rolledCars: CarModelDef[]) {
    const screen = document.getElementById('reveal-screen');
    if (!screen) return;

    soundEngine.playCashEarned();
    confetti({ particleCount: 100, spread: 80 });

    const totalInstantSell = rolledCars.reduce((sum, c) => sum + Math.floor(c.basePrice * 0.7), 0);
    const totalVal = rolledCars.reduce((sum, c) => sum + c.basePrice, 0);

    screen.innerHTML = `
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(2, 6, 23, 0.96); backdrop-filter: blur(16px); z-index: 200; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; overflow-y: auto;">
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 32px; font-weight: 900; color: #f8fafc; margin-bottom: 4px;">Pulls Summary (${rolledCars.length} Cars)</h2>
          <p style="font-size: 14px; color: #94a3b8;">Total Loot Value: <strong style="color: #4ade80;">$${totalVal.toLocaleString()}</strong></p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; max-width: 980px; width: 100%; margin-bottom: 28px; max-height: 52vh; overflow-y: auto; padding: 8px;">
          ${rolledCars.map(car => {
            const cfg = RARITY_CONFIG[car.rarity];
            return `
              <div style="background: rgba(30, 41, 59, 0.8); border: 2px solid ${cfg.color}; border-radius: 14px; padding: 14px; text-align: center; box-shadow: 0 6px 18px rgba(0,0,0,0.5);">
                <div style="font-size: 10px; font-weight: 800; color: ${cfg.color}; text-transform: uppercase; margin-bottom: 6px;">${car.rarity}</div>
                <div style="width: 26px; height: 26px; border-radius: 50%; background: ${car.bodyColor}; margin: 0 auto 8px auto; border: 2px solid rgba(255,255,255,0.4);"></div>
                <h4 style="font-size: 14px; font-weight: 800; color: #f8fafc; margin-bottom: 4px; line-height: 1.2;">${car.name}</h4>
                <div style="font-size: 13px; font-weight: 800; color: #4ade80; font-family: 'Rajdhani', sans-serif;">$${car.basePrice.toLocaleString()}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Choice: Keep All or Instant Sell All -->
        <div style="display: flex; gap: 16px; max-width: 580px; width: 100%;">
          <button id="btn-keep-all" style="flex: 1; padding: 16px; background: #22c55e; color: #0f172a; font-weight: 900; font-size: 16px; border: none; border-radius: 12px; cursor: pointer;">
            KEEP ALL IN INVENTORY 🚗
          </button>
          <button id="btn-sell-all" style="flex: 1; padding: 16px; background: #ef4444; color: #ffffff; font-weight: 900; font-size: 16px; border: none; border-radius: 12px; cursor: pointer;">
            SELL ALL (+$${totalInstantSell.toLocaleString()}) 💰
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-keep-all')?.addEventListener('click', () => {
      rolledCars.forEach(c => stateManager.addCarToGarage(c.id));
      screen.style.display = 'none';
      soundEngine.playCashEarned();
      this.renderHUD();
      this.renderFrontPacks();
    });

    document.getElementById('btn-sell-all')?.addEventListener('click', () => {
      stateManager.addCash(totalInstantSell);
      stateManager.state.stats.totalEarnedFromSales += totalInstantSell;
      stateManager.save();
      screen.style.display = 'none';
      soundEngine.playCashEarned();
      this.renderHUD();
      this.renderFrontPacks();
    });
  }

  // --- DRAMATIC CAR REVEAL (WITH RARITY-SPECIFIC VISUAL & AUDIO EFFECTS) ---
  private showDramaticCarReveal(crate: CrateDefinition, car: CarModelDef) {
    const screen = document.getElementById('reveal-screen');
    if (!screen) return;

    const rConfig = RARITY_CONFIG[car.rarity];
    const instantSellPrice = Math.floor(car.basePrice * 0.7);

    // Check if player already owns this model
    const isDuplicate = stateManager.state.garage.some(c => c.modelId === car.id);

    // Play rarity-specific audio
    soundEngine.playReveal(car.rarity);

    // Trigger true 3D car rising & entrance animation
    if (this.onCarChangeCallback) {
      this.onCarChangeCallback(car.id, true);
    }

    // Rarity effects setup
    let effectHtml = '';
    let particleCount = 60;

    if (car.rarity === 'Exclusive') {
      particleCount = 200;
      effectHtml = `
        <div style="position: absolute; width: 650px; height: 650px; background: radial-gradient(circle, rgba(6,182,212,0.85), transparent 70%); border-radius: 50%; filter: blur(65px); animation: pulseExclusive 1.5s infinite alternate;"></div>
        <div style="position: absolute; font-size: 220px; opacity: 0.12; color: #06b6d4; font-weight: 900; pointer-events: none;">👑</div>
      `;
    } else if (car.rarity === 'Mythic') {
      particleCount = 160;
      effectHtml = `
        <div style="position: absolute; width: 580px; height: 580px; background: radial-gradient(circle, rgba(239,68,68,0.75), transparent 70%); border-radius: 50%; filter: blur(55px); animation: pulseMythic 1.8s infinite alternate;"></div>
      `;
    } else if (car.rarity === 'Legendary') {
      particleCount = 130;
      effectHtml = `
        <div style="position: absolute; width: 520px; height: 520px; background: radial-gradient(circle, rgba(245,158,11,0.7), transparent 70%); border-radius: 50%; filter: blur(45px); animation: pulse 2s infinite alternate;"></div>
      `;
    } else if (car.rarity === 'Epic') {
      particleCount = 95;
      effectHtml = `
        <div style="position: absolute; width: 460px; height: 460px; background: radial-gradient(circle, rgba(168,85,247,0.6), transparent 70%); border-radius: 50%; filter: blur(40px);"></div>
      `;
    } else if (car.rarity === 'Rare') {
      effectHtml = `
        <div style="position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(59,130,246,0.5), transparent 70%); border-radius: 50%; filter: blur(35px);"></div>
      `;
    } else if (car.rarity === 'Uncommon') {
      effectHtml = `
        <div style="position: absolute; width: 350px; height: 350px; background: radial-gradient(circle, rgba(34,197,94,0.4), transparent 70%); border-radius: 50%; filter: blur(30px);"></div>
      `;
    }

    confetti({ particleCount, spread: 80, origin: { y: 0.45 } });

    screen.innerHTML = `
      <div style="
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: radial-gradient(circle at center, rgba(15,23,42,0.4) 0%, rgba(2,6,23,0.85) 100%);
        display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
        padding-bottom: 30px; z-index: 200; overflow: hidden;
      ">
        ${effectHtml}

        <!-- Duplicate Alert Notification -->
        ${isDuplicate ? `
          <div style="
            position: absolute; top: 30px;
            background: rgba(234, 179, 8, 0.18); border: 2px solid #eab308;
            color: #facc15; font-size: 13px; font-weight: 800;
            padding: 8px 20px; border-radius: 30px; letter-spacing: 1px;
            text-transform: uppercase; box-shadow: 0 0 25px rgba(234, 179, 8, 0.4);
            animation: pulse 1s infinite alternate; z-index: 25;
          ">
            ⚠️ DUPLICATE VEHICLE DETECTED
          </div>
        ` : ''}

        <div style="z-index: 10; text-align: center; max-width: 580px; width: 92%; padding: 18px; background: rgba(15, 23, 42, 0.88); border: 2px solid ${rConfig.color}; border-radius: 24px; box-shadow: 0 16px 50px rgba(0,0,0,0.85); backdrop-filter: blur(14px);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="display: inline-block; padding: 5px 16px; border-radius: 14px; background: ${rConfig.color}; color: #0f172a; font-weight: 900; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; box-shadow: 0 0 18px ${rConfig.glow};">
              ${car.rarity}
            </div>
            <div style="font-size: 13px; color: #94a3b8; text-transform: capitalize; font-weight: 700;">
              ${car.brand} &bull; ${car.bodyType}
            </div>
          </div>

          <h1 style="font-size: 32px; font-weight: 900; color: #ffffff; margin-bottom: 4px; letter-spacing: -0.5px;">${car.name}</h1>
          <p style="font-size: 13px; color: #94a3b8; margin-bottom: 14px; line-height: 1.4;">${car.description}</p>

          <!-- Valuation & Stats Grid -->
          <div style="background: rgba(30, 41, 59, 0.7); border-radius: 14px; padding: 14px; margin-bottom: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
              <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 800;">Estimated Value</span>
              <span style="font-size: 30px; font-weight: 900; color: #4ade80; font-family: 'Rajdhani', sans-serif;">$${car.basePrice.toLocaleString()}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center; font-size: 11px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px;">
              <div>
                <div style="color: #94a3b8; font-weight: 700;">SPEED</div>
                <div style="color: #f8fafc; font-weight: 900; font-size: 13px;">${car.stats.topSpeed} km/h</div>
              </div>
              <div>
                <div style="color: #94a3b8; font-weight: 700;">0-100</div>
                <div style="color: #f8fafc; font-weight: 900; font-size: 13px;">${car.stats.acceleration}s</div>
              </div>
              <div>
                <div style="color: #94a3b8; font-weight: 700;">HANDLING</div>
                <div style="color: #38bdf8; font-weight: 900; font-size: 13px;">${car.stats.handling}/100</div>
              </div>
              <div>
                <div style="color: #94a3b8; font-weight: 700;">BRAKING</div>
                <div style="color: #a855f7; font-weight: 900; font-size: 13px;">${car.stats.braking}/100</div>
              </div>
            </div>
          </div>

          <!-- Buttons: ADD TO GARAGE & Instant Sell -->
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button id="btn-keep-car" style="flex: 2; padding: 14px 20px; background: linear-gradient(135deg, #22c55e, #16a34a); color: #0f172a; font-weight: 900; font-size: 15px; border: none; border-radius: 12px; cursor: pointer; transition: transform 0.15s ease; box-shadow: 0 4px 18px rgba(34, 197, 94, 0.4);">
              🚗 ADD TO GARAGE
            </button>
            <button id="btn-sell-car" style="flex: 1; padding: 14px 16px; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #f87171; font-weight: 800; font-size: 13px; border-radius: 12px; cursor: pointer; transition: transform 0.15s ease;">
              SELL (+$${instantSellPrice.toLocaleString()})
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-keep-car')?.addEventListener('click', () => {
      stateManager.addCarToGarage(car.id);
      screen.style.display = 'none';
      soundEngine.playCashEarned();
      this.renderHUD();
      this.renderFrontPacks();
    });

    document.getElementById('btn-sell-car')?.addEventListener('click', () => {
      stateManager.addCash(instantSellPrice);
      stateManager.state.stats.totalEarnedFromSales += instantSellPrice;
      stateManager.save();
      screen.style.display = 'none';
      soundEngine.playCashEarned();
      this.renderHUD();
      this.renderFrontPacks();
    });
  }

  // --- MODAL CONTROLLER ---
  public openModal(tab: string) {
    this.setActiveNavTab(tab);
    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    if (!overlay || !container || !title) return;

    overlay.style.display = 'flex';

    if (tab === 'garage') {
      title.textContent = '🏎️ Car Collection & Inventory';
      this.renderInventory(container);
    } else if (tab === 'vault') {
      title.textContent = '💼 Stored & Unopened Packs';
      this.renderStoredPacks(container);
    } else if (tab === 'fusion') {
      title.textContent = '🔮 Pack Alchemy & Fusion Chamber';
      this.renderPackFusion(container);
    } else if (tab === 'match3') {
      title.textContent = '🎰 3-Card Match & Click Challenge';
      this.renderMatch3(container);
    } else if (tab === 'sets') {
      title.textContent = '📦 Collectible Car Sets & Badges';
      this.renderSets(container);
    } else if (tab === 'tradeup') {
      title.textContent = '🔄 Trade-Up Contracts';
      this.renderTradeUp(container);
    } else if (tab === 'history') {
      title.textContent = '📜 Unboxing History & Best Pulls';
      this.renderHistory(container);
    } else if (tab === 'marketplace') {
      title.textContent = '🏪 Player Car Marketplace (P2P)';
      this.renderMarketplace(container);
    } else if (tab === 'wheel') {
      title.textContent = '🎡 Daily Crown Reward Wheel';
      this.renderWheel(container);
    } else if (tab === 'missions') {
      title.textContent = '🎯 Collector Missions & XP';
      this.renderMissions(container);
    } else if (tab === 'leaderboard') {
      title.textContent = '🏆 City Collector Leaderboard';
      this.renderLeaderboard(container);
    } else if (tab === 'admin') {
      title.textContent = '⚡ Administrator Control Panel';
      this.renderAdminPanel(container);
    }
  }

  public closeModal() {
    this.setActiveNavTab('packs');
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  // --- INVENTORY TAB WITH SEARCH, FILTERS, SORTS & DUPLICATE SELLER ---
  private renderInventory(container: HTMLElement) {
    const s = stateManager.state;
    const totalVal = s.garage.reduce((sum, item) => {
      const model = CAR_CATALOG.find(c => c.id === item.modelId);
      return sum + (model ? model.basePrice : 3000);
    }, 0);

    // Apply search & filters
    let filtered = s.garage.filter(inst => {
      const model = CAR_CATALOG.find(c => c.id === inst.modelId);
      if (!model) return false;
      const matchesSearch = model.name.toLowerCase().includes(this.invSearch.toLowerCase()) ||
                            model.brand.toLowerCase().includes(this.invSearch.toLowerCase());
      const matchesRarity = this.invRarityFilter === 'ALL' || model.rarity === this.invRarityFilter;
      return matchesSearch && matchesRarity;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const mA = CAR_CATALOG.find(c => c.id === a.modelId);
      const mB = CAR_CATALOG.find(c => c.id === b.modelId);
      if (!mA || !mB) return 0;

      if (this.invSortBy === 'value_desc') return mB.basePrice - mA.basePrice;
      if (this.invSortBy === 'value_asc') return mA.basePrice - mB.basePrice;
      if (this.invSortBy === 'newest') return b.acquiredAt - a.acquiredAt;
      if (this.invSortBy === 'rarity') {
        const order: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Exclusive'];
        return order.indexOf(mB.rarity) - order.indexOf(mA.rarity);
      }
      return 0;
    });

    container.innerHTML = `
      <!-- Portfolio Header & Duplicate Seller -->
      <div style="background: rgba(15, 23, 42, 0.7); padding: 18px 24px; border-radius: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.08);">
        <div>
          <h3 style="font-size: 20px; font-weight: 900; color: #f8fafc; margin-bottom: 4px;">Collection Portfolio</h3>
          <p style="font-size: 13px; color: #94a3b8;">${s.garage.length} cars owned &bull; ${new Set(s.garage.map(g => g.modelId)).size} unique models collected.</p>
        </div>
        <div style="display: flex; gap: 14px; align-items: center;">
          <button id="btn-sell-dupes" style="padding: 10px 18px; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #f87171; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer;">
            SELL ALL DUPLICATES 💰
          </button>
          <div style="text-align: right; background: rgba(15, 23, 42, 0.6); padding: 8px 16px; border-radius: 10px;">
            <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Portfolio Value</div>
            <div style="font-size: 24px; font-weight: 900; color: #4ade80; font-family: 'Rajdhani', sans-serif;">$${totalVal.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <!-- Filters & Sort Bar -->
      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; align-items: center;">
        <input type="text" id="inv-search-input" placeholder="Search by car name or brand..." value="${this.invSearch}" style="flex: 1; min-width: 220px; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 10px 16px; color: #f8fafc; font-size: 14px;">
        
        <select id="inv-rarity-select" style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 10px 16px; color: #f8fafc; font-size: 14px; font-weight: 700;">
          <option value="ALL" ${this.invRarityFilter === 'ALL' ? 'selected' : ''}>All Rarities</option>
          <option value="Common" ${this.invRarityFilter === 'Common' ? 'selected' : ''}>Common</option>
          <option value="Uncommon" ${this.invRarityFilter === 'Uncommon' ? 'selected' : ''}>Uncommon</option>
          <option value="Rare" ${this.invRarityFilter === 'Rare' ? 'selected' : ''}>Rare</option>
          <option value="Epic" ${this.invRarityFilter === 'Epic' ? 'selected' : ''}>Epic</option>
          <option value="Legendary" ${this.invRarityFilter === 'Legendary' ? 'selected' : ''}>Legendary</option>
          <option value="Mythic" ${this.invRarityFilter === 'Mythic' ? 'selected' : ''}>Mythic</option>
          <option value="Exclusive" ${this.invRarityFilter === 'Exclusive' ? 'selected' : ''}>Exclusive</option>
        </select>

        <select id="inv-sort-select" style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 10px 16px; color: #f8fafc; font-size: 14px; font-weight: 700;">
          <option value="value_desc" ${this.invSortBy === 'value_desc' ? 'selected' : ''}>Price: High to Low</option>
          <option value="value_asc" ${this.invSortBy === 'value_asc' ? 'selected' : ''}>Price: Low to High</option>
          <option value="rarity" ${this.invSortBy === 'rarity' ? 'selected' : ''}>Rarity Tier</option>
          <option value="newest" ${this.invSortBy === 'newest' ? 'selected' : ''}>Newest Added</option>
        </select>
      </div>

      <!-- Cars Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">
        ${filtered.map(inst => {
          const model = CAR_CATALOG.find(c => c.id === inst.modelId) || CAR_CATALOG[0];
          const rConfig = RARITY_CONFIG[model.rarity as Rarity];
          const isShowcased = inst.instanceId === s.activeCarId;
          const sellVal = Math.floor(model.basePrice * 0.7);

          return `
            <div class="car-inv-card" style="border: 2px solid ${isShowcased ? '#38bdf8' : rConfig.color};">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="display: inline-block; padding: 2px 8px; border-radius: 6px; background: ${rConfig.color}; color: #0f172a; font-weight: 800; font-size: 10px; text-transform: uppercase;">
                    ${model.rarity}
                  </span>
                  ${isShowcased ? `<span style="font-size: 10px; font-weight: 800; color: #38bdf8; background: rgba(56,189,248,0.15); padding: 2px 8px; border-radius: 6px; border: 1px solid #38bdf8;">SHOWCASED</span>` : ''}
                </div>
                <h4 style="font-size: 17px; font-weight: 800; color: #f8fafc; margin-bottom: 2px;">${model.name}</h4>
                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">Finish: <strong style="color: #cbd5e1;">${inst.finish || 'Gloss'}</strong> &bull; Color: <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${inst.paintColor}; vertical-align: middle;"></span></p>

                <div style="background: rgba(15, 23, 42, 0.65); padding: 10px 14px; border-radius: 10px; margin-bottom: 12px;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Collector Value</div>
                  <div style="font-size: 20px; font-weight: 900; color: #4ade80; font-family: 'Rajdhani', sans-serif;">$${model.basePrice.toLocaleString()}</div>
                </div>
              </div>

              <div style="display: flex; gap: 8px;">
                <button class="showcase-car-btn" data-id="${inst.instanceId}" data-model="${model.id}" style="flex: 1; padding: 9px; background: ${isShowcased ? 'rgba(56, 189, 248, 0.2)' : '#38bdf8'}; color: ${isShowcased ? '#38bdf8' : '#0f172a'}; font-weight: 700; border: ${isShowcased ? '1px solid #38bdf8' : 'none'}; border-radius: 8px; cursor: pointer;">
                  ${isShowcased ? 'SHOWCASED' : 'INSPECT 3D'}
                </button>
                <button class="sell-inv-car-btn" data-id="${inst.instanceId}" style="padding: 9px 12px; background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid #ef4444; font-weight: 700; border-radius: 8px; cursor: pointer;">
                  SELL ($${sellVal.toLocaleString()})
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Search and filter listeners
    document.getElementById('inv-search-input')?.addEventListener('input', (e) => {
      this.invSearch = (e.target as HTMLInputElement).value;
      this.renderInventory(container);
    });

    document.getElementById('inv-rarity-select')?.addEventListener('change', (e) => {
      this.invRarityFilter = (e.target as HTMLSelectElement).value;
      this.renderInventory(container);
    });

    document.getElementById('inv-sort-select')?.addEventListener('change', (e) => {
      this.invSortBy = (e.target as HTMLSelectElement).value as any;
      this.renderInventory(container);
    });

    document.getElementById('btn-sell-dupes')?.addEventListener('click', () => {
      const res = stateManager.sellDuplicates();
      if (res.count > 0) {
        soundEngine.playCashEarned();
        confetti({ particleCount: 60 });
        alert(`Sold ${res.count} duplicate vehicles for +$${res.totalCash.toLocaleString()}!`);
        this.renderInventory(container);
        this.renderHUD();
      } else {
        alert('No duplicate cars found in inventory!');
      }
    });

    container.querySelectorAll('.showcase-car-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const instId = (e.currentTarget as HTMLElement).dataset.id;
        const modelId = (e.currentTarget as HTMLElement).dataset.model;
        if (instId && modelId) {
          stateManager.setActiveCar(instId);
          if (this.onCarChangeCallback) this.onCarChangeCallback(modelId);
          this.renderInventory(container);
        }
      });
    });

    container.querySelectorAll('.sell-inv-car-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const instId = (e.currentTarget as HTMLElement).dataset.id;
        if (instId) {
          const soldVal = stateManager.sellCar(instId);
          if (soldVal > 0) {
            soundEngine.playCashEarned();
            this.renderInventory(container);
            this.renderHUD();
          }
        }
      });
    });
  }

  // --- TRADE-UP CONTRACTS TAB ---
  private renderTradeUp(container: HTMLElement) {
    const s = stateManager.state;
    const tiers: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

    container.innerHTML = `
      <div style="margin-bottom: 20px; color: #94a3b8; font-size: 14px;">
        Exchange <strong>5 cars of the same rarity</strong> to forge a guaranteed random car of the <strong>next rarity tier</strong>.
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
        ${tiers.map((r, idx) => {
          const nextR = ['Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'][idx];
          const matchingCars = s.garage.filter(g => {
            const m = CAR_CATALOG.find(cat => cat.id === g.modelId);
            return m && m.rarity === r;
          });
          const canTrade = matchingCars.length >= 5;
          const cfg = RARITY_CONFIG[r];
          const nextCfg = RARITY_CONFIG[nextR as Rarity];

          return `
            <div style="background: rgba(30, 41, 59, 0.7); border: 2px solid ${cfg.color}; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <span style="font-size: 12px; font-weight: 800; color: ${cfg.color}; text-transform: uppercase;">${r} Contract</span>
                  <span style="font-size: 13px; font-weight: 800; color: ${canTrade ? '#4ade80' : '#94a3b8'};">${matchingCars.length} / 5 Eligible</span>
                </div>
                <div style="font-size: 14px; font-weight: 700; color: #f8fafc; margin-bottom: 6px;">
                  Forge: 5x ${r} ➔ 1x <span style="color: ${nextCfg.color}; font-weight: 900;">${nextR}</span>
                </div>
                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">Consumes 5 ${r} cars from your inventory and crafts a higher-tier vehicle.</p>
              </div>

              <button class="btn-tradeup" data-rarity="${r}" ${!canTrade ? 'disabled' : ''} style="width: 100%; padding: 12px; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: ${canTrade ? 'pointer' : 'not-allowed'}; background: ${canTrade ? nextCfg.color : '#475569'}; color: #0f172a; border: none;">
                ${canTrade ? `SIGN CONTRACT (UPGRADE TO ${nextR})` : `NEED ${5 - matchingCars.length} MORE CARS`}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-tradeup').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rarity = (e.currentTarget as HTMLElement).dataset.rarity as Rarity;
        if (rarity) {
          const res = stateManager.executeTradeUp(rarity);
          if (res.success && res.newCar) {
            soundEngine.playReveal(res.newCar.rarity);
            confetti({ particleCount: 100 });
            alert(`🎉 Trade-up contract successful! You crafted a ${res.newCar.rarity} ${res.newCar.name} worth $${res.newCar.basePrice.toLocaleString()}!`);
            this.renderTradeUp(container);
            this.renderHUD();
          }
        }
      });
    });
  }

  // --- CAR SETS TAB ---
  private renderSets(container: HTMLElement) {
    const s = stateManager.state;
    const ownedIds = new Set(s.garage.map(g => g.modelId));

    container.innerHTML = `
      <div style="margin-bottom: 20px; color: #94a3b8; font-size: 14px;">
        Complete collectible thematic sets to claim large cash jackpots and prestigious collector titles.
      </div>

      <div style="display: flex; flex-direction: column; gap: 18px;">
        ${CAR_SETS.map(set => {
          const ownedInSet = set.carIds.filter(id => ownedIds.has(id)).length;
          const isCompleted = ownedInSet >= set.carIds.length;
          const isClaimed = s.completedSets.includes(set.id);
          const progressPct = Math.round((ownedInSet / set.carIds.length) * 100);

          return `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid ${isCompleted ? '#38bdf8' : '#475569'}; border-radius: 16px; padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div>
                  <h3 style="font-size: 18px; font-weight: 800; color: #f8fafc;">${set.name}</h3>
                  <p style="font-size: 13px; color: #94a3b8;">${set.description}</p>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 18px; font-weight: 900; color: #4ade80;">+$${set.rewardCash.toLocaleString()}</div>
                  <div style="font-size: 12px; color: #38bdf8;">Title: "${set.rewardTitle}"</div>
                </div>
              </div>

              <!-- Progress bar -->
              <div style="background: #1e293b; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 12px;">
                <div style="background: #38bdf8; height: 100%; width: ${progressPct}%;"></div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: #cbd5e1; font-weight: 600;">${ownedInSet} / ${set.carIds.length} cars collected (${progressPct}%)</span>
                ${isCompleted ? (
                  isClaimed ? `
                    <button disabled style="padding: 6px 16px; background: #334155; color: #64748b; font-weight: 700; border: none; border-radius: 8px;">CLAIMED</button>
                  ` : `
                    <button class="btn-claim-set" data-id="${set.id}" style="padding: 8px 18px; background: #22c55e; color: #0f172a; font-weight: 800; border: none; border-radius: 8px; cursor: pointer;">
                      CLAIM SET REWARD
                    </button>
                  `
                ) : `
                  <span style="font-size: 12px; color: #64748b; font-weight: 700;">INCOMPLETE</span>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-claim-set').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const setId = (e.currentTarget as HTMLElement).dataset.id;
        const targetSet = CAR_SETS.find(cs => cs.id === setId);
        if (targetSet && !s.completedSets.includes(targetSet.id)) {
          s.completedSets.push(targetSet.id);
          stateManager.addCash(targetSet.rewardCash);
          stateManager.addXp(targetSet.rewardXp);
          soundEngine.playCashEarned();
          confetti({ particleCount: 80 });
          alert(`🎉 Reward claimed! You unlocked the title "${targetSet.rewardTitle}" and received $${targetSet.rewardCash.toLocaleString()}!`);
          this.renderSets(container);
          this.renderHUD();
        }
      });
    });
  }

  // --- UNBOXING HISTORY & BEST PULLS TAB ---
  private renderHistory(container: HTMLElement) {
    const s = stateManager.state;
    const bestPulls = [...s.history].sort((a, b) => b.carValue - a.carValue).slice(0, 5);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Top 5 Best Pulls -->
        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: #f8fafc; margin-bottom: 12px;">🌟 Biggest Pulls</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            ${bestPulls.length > 0 ? bestPulls.map(pull => {
              const cfg = RARITY_CONFIG[pull.rarity];
              return `
                <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid ${cfg.color}; border-radius: 12px; padding: 14px;">
                  <div style="font-size: 10px; font-weight: 800; color: ${cfg.color}; text-transform: uppercase; margin-bottom: 4px;">${pull.rarity}</div>
                  <h4 style="font-size: 15px; font-weight: 800; color: #f8fafc; margin-bottom: 2px;">${pull.carName}</h4>
                  <div style="font-size: 16px; font-weight: 900; color: #4ade80; font-family: 'Rajdhani', sans-serif;">$${pull.carValue.toLocaleString()}</div>
                  <div style="font-size: 10px; color: #64748b; margin-top: 4px;">From ${pull.packName}</div>
                </div>
              `;
            }).join('') : `<p style="color: #64748b; font-size: 13px;">No unboxing history yet. Open packs to record your biggest pulls!</p>`}
          </div>
        </div>

        <!-- Recent Unboxing History Table -->
        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: #f8fafc; margin-bottom: 12px;">🕒 Recent Openings</h3>
          <div style="background: rgba(15, 23, 42, 0.6); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06);">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
              <thead>
                <tr style="background: #1e293b; color: #94a3b8; font-size: 11px; text-transform: uppercase;">
                  <th style="padding: 12px 16px;">Pack</th>
                  <th style="padding: 12px 16px;">Item Pulled</th>
                  <th style="padding: 12px 16px;">Rarity</th>
                  <th style="padding: 12px 16px;">Valuation</th>
                  <th style="padding: 12px 16px;">Date</th>
                </tr>
              </thead>
              <tbody>
                ${s.history.map(row => {
                  const cfg = RARITY_CONFIG[row.rarity];
                  const d = new Date(row.timestamp);
                  return `
                    <tr style="border-bottom: 1px solid #334155;">
                      <td style="padding: 12px 16px; color: #f8fafc;">${row.packName}</td>
                      <td style="padding: 12px 16px; color: #38bdf8; font-weight: 700;">${row.carName}</td>
                      <td style="padding: 12px 16px; color: ${cfg.color}; font-weight: 800;">${row.rarity}</td>
                      <td style="padding: 12px 16px; color: #4ade80; font-weight: 800;">$${row.carValue.toLocaleString()}</td>
                      <td style="padding: 12px 16px; color: #94a3b8; font-size: 11px;">${d.toLocaleTimeString()}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // --- MARKETPLACE TAB ---
  private renderMarketplace(container: HTMLElement) {
    const list = stateManager.state.marketplace;
    container.innerHTML = `
      <div style="margin-bottom: 18px; color: #94a3b8; font-size: 14px;">
        Browse and trade verified collector cars listed by top city collectors.
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px;">
        ${list.map(item => {
          const model = CAR_CATALOG.find(c => c.id === item.car.modelId) || CAR_CATALOG[0];
          const rConfig = RARITY_CONFIG[model.rarity as Rarity];
          const canBuy = stateManager.state.cash >= item.price;

          return `
            <div class="car-inv-card" style="border: 2px solid ${rConfig.color};">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; background: ${rConfig.color}; color: #0f172a;">${model.rarity}</span>
                  <span style="font-size: 12px; color: #94a3b8;">Seller: <strong style="color: #38bdf8;">${item.sellerName}</strong></span>
                </div>
                <h3 style="font-size: 18px; font-weight: 800; color: #f8fafc; margin-bottom: 4px;">${model.name}</h3>
                <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 12px;">Market Value: <strong style="color: #4ade80;">$${model.basePrice.toLocaleString()}</strong></p>
              </div>

              <div>
                <div style="font-size: 24px; font-weight: 900; color: #38bdf8; font-family: 'Rajdhani', sans-serif; margin-bottom: 10px;">$${item.price.toLocaleString()}</div>
                <button class="buy-listing-btn" data-id="${item.listingId}" ${!canBuy ? 'disabled' : ''} style="width: 100%; padding: 12px; background: ${canBuy ? '#38bdf8' : '#475569'}; color: #0f172a; font-weight: 800; border: none; border-radius: 8px; cursor: ${canBuy ? 'pointer' : 'not-allowed'};">
                  ${canBuy ? 'BUY FOR INVENTORY' : 'INSUFFICIENT FUNDS'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelectorAll('.buy-listing-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const listId = (e.currentTarget as HTMLElement).dataset.id;
        const itemIdx = stateManager.state.marketplace.findIndex(m => m.listingId === listId);
        if (itemIdx !== -1) {
          const item = stateManager.state.marketplace[itemIdx];
          if (stateManager.state.cash >= item.price) {
            stateManager.addCash(-item.price);
            stateManager.state.garage.push(item.car);
            stateManager.state.marketplace.splice(itemIdx, 1);
            stateManager.save();
            soundEngine.playCashEarned();
            confetti({ particleCount: 60, spread: 60 });
            this.renderMarketplace(container);
            this.renderHUD();
          }
        }
      });
    });
  }

  // --- PACK FUSION CHAMBER ---
  private renderPackFusion(container: HTMLElement) {
    const packs = stateManager.state.inventoryPacks || [];
    let selectedPackIds: string[] = [];

    const render = () => {
      container.innerHTML = `
        <div style="background: rgba(168, 85, 247, 0.12); border: 1.5px solid #a855f7; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; gap: 14px; align-items: center;">
            <span style="font-size: 38px;">🔮</span>
            <div>
              <h3 style="font-size: 20px; font-weight: 900; color: #d8b4fe; margin-bottom: 4px;">Pack Fusion & Alchemy</h3>
              <p style="font-size: 13px; color: #cbd5e1; line-height: 1.4;">
                Select <strong>2 or more unopened packs</strong> from your vault to combine their essence.
                Fusion can yield a <strong>far higher tier crate</strong> (like Exotic or Prestige Vault), or an unpredictable chaotic mutation!
              </p>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h4 style="font-size: 16px; font-weight: 800; color: #f8fafc;">
            Your Stored Packs (${packs.length} available) &bull; Selected: <span style="color: #a855f7;">${selectedPackIds.length} packs</span>
          </h4>
          <button id="btn-execute-fusion" ${selectedPackIds.length < 2 ? 'disabled' : ''} style="
            padding: 12px 28px;
            background: ${selectedPackIds.length >= 2 ? 'linear-gradient(135deg, #a855f7, #ec4899)' : '#334155'};
            color: ${selectedPackIds.length >= 2 ? '#ffffff' : '#64748b'};
            font-weight: 900; font-size: 14px; letter-spacing: 0.5px;
            border: none; border-radius: 10px; cursor: ${selectedPackIds.length >= 2 ? 'pointer' : 'not-allowed'};
            box-shadow: ${selectedPackIds.length >= 2 ? '0 4px 20px rgba(168, 85, 247, 0.5)' : 'none'};
          ">
            ⚡ FUSE ${selectedPackIds.length} PACKS ⚡
          </button>
        </div>

        ${packs.length === 0 ? `
          <div style="text-align: center; padding: 40px 20px; background: rgba(15, 23, 42, 0.6); border-radius: 14px;">
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 12px;">You don't have any packs in your vault yet.</p>
            <p style="font-size: 12px; color: #64748b;">Go to the Packs Store and click "💼 BUY & SAVE PACK TO VAULT" to store crates for fusion!</p>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px;">
            ${packs.map(p => {
              const crate = CRATE_CATALOG.find(c => c.id === p.crateId) || CRATE_CATALOG[0];
              const isSelected = selectedPackIds.includes(p.id);
              return `
                <div class="fusion-pack-item" data-id="${p.id}" style="
                  background: ${isSelected ? 'rgba(168, 85, 247, 0.2)' : 'rgba(30, 41, 59, 0.7)'};
                  border: 2px solid ${isSelected ? '#a855f7' : 'rgba(255,255,255,0.1)'};
                  border-radius: 14px; padding: 16px; cursor: pointer;
                  display: flex; gap: 12px; align-items: center; justify-content: space-between;
                  transition: all 0.2s;
                ">
                  <div style="display: flex; gap: 12px; align-items: center;">
                    <span style="font-size: 32px;">${crate.icon}</span>
                    <div>
                      <h4 style="font-size: 15px; font-weight: 800; color: #f8fafc;">${crate.name}</h4>
                      <span style="font-size: 11px; color: ${crate.accentHex}; font-weight: 700;">$${crate.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div style="
                    width: 22px; height: 22px; border-radius: 50%;
                    border: 2px solid ${isSelected ? '#a855f7' : '#64748b'};
                    background: ${isSelected ? '#a855f7' : 'transparent'};
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-size: 12px; font-weight: 900;
                  ">
                    ${isSelected ? '✓' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      `;

      container.querySelectorAll('.fusion-pack-item').forEach(el => {
        el.addEventListener('click', (e) => {
          const packId = (e.currentTarget as HTMLElement).dataset.id;
          if (!packId) return;
          if (selectedPackIds.includes(packId)) {
            selectedPackIds = selectedPackIds.filter(id => id !== packId);
          } else {
            selectedPackIds.push(packId);
          }
          render();
        });
      });

      document.getElementById('btn-execute-fusion')?.addEventListener('click', () => {
        if (selectedPackIds.length < 2) return;
        
        // Remove chosen packs from inventory
        selectedPackIds.forEach(id => {
          stateManager.consumePackFromInventory(id);
        });

        // Determine fusion outcome based on number of packs fused
        const roll = Math.random() * 100;
        let resultantCrateId = 'crate_tuner';

        if (selectedPackIds.length >= 4) {
          if (roll < 45) resultantCrateId = 'crate_prestige';
          else if (roll < 80) resultantCrateId = 'crate_limited_midnight';
          else resultantCrateId = 'crate_exotic';
        } else if (selectedPackIds.length === 3) {
          if (roll < 30) resultantCrateId = 'crate_prestige';
          else if (roll < 70) resultantCrateId = 'crate_exotic';
          else resultantCrateId = 'crate_tuner';
        } else {
          // 2 packs
          if (roll < 20) resultantCrateId = 'crate_exotic';
          else if (roll < 65) resultantCrateId = 'crate_tuner';
          else if (roll < 85) resultantCrateId = 'crate_basic';
          else resultantCrateId = 'crate_starter'; // mutated down
        }

        stateManager.addPackToInventory(resultantCrateId);
        soundEngine.playExplosion();
        confetti({ particleCount: 120, spread: 90, colors: ['#a855f7', '#ec4899', '#38bdf8'] });

        const outcomeCrate = CRATE_CATALOG.find(c => c.id === resultantCrateId) || CRATE_CATALOG[0];
        alert(`🔮 FUSION COMPLETE!\n\nCombined ${selectedPackIds.length} packs into: ${outcomeCrate.name}!\nSaved to your Stored Packs Vault.`);
        
        selectedPackIds = [];
        this.renderHUD();
        render();
      });
    };

    render();
  }

  // --- 3-CARD MATCH & CLICK CHALLENGE ---
  private matchWager: number = 5000;
  private matchCards: { id: number; car: CarModelDef; revealed: boolean }[] = [];
  private matchStatus: 'idle' | 'playing' | 'won' | 'lost' = 'idle';

  private renderMatch3(container: HTMLElement) {
    const minWager = 1000;
    const maxWager = 250000;

    const minPayout = Math.floor(this.matchWager * 0.4);
    const maxPayout = Math.floor(this.matchWager * 6.5);

    container.innerHTML = `
      <div style="background: rgba(245, 158, 11, 0.12); border: 1.5px solid #f59e0b; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div>
            <h3 style="font-size: 20px; font-weight: 900; color: #fcd34d; margin-bottom: 4px;">🎰 3-Card Match & Click Challenge</h3>
            <p style="font-size: 13px; color: #cbd5e1; max-width: 580px; line-height: 1.4;">
              Click cards to reveal hidden cars. <strong>Match 3 cars of the same rarity</strong> to instantly win that vehicle for your garage plus a massive cash prize!
            </p>
          </div>

          <!-- WAGER (+ / -) ADJUSTER -->
          <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255,255,255,0.15); border-radius: 14px; padding: 12px 18px; text-align: center;">
            <div style="font-size: 10px; color: #94a3b8; font-weight: 800; text-transform: uppercase; margin-bottom: 6px;">Entry Wager</div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <button id="btn-wager-minus" style="width: 32px; height: 32px; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #f87171; border-radius: 8px; font-weight: 900; font-size: 18px; cursor: pointer;">-</button>
              <span id="match-wager-display" style="font-size: 22px; font-weight: 900; color: #4ade80; font-family: 'Rajdhani', sans-serif; min-width: 90px;">$${this.matchWager.toLocaleString()}</span>
              <button id="btn-wager-plus" style="width: 32px; height: 32px; background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #4ade80; border-radius: 8px; font-weight: 900; font-size: 18px; cursor: pointer;">+</button>
            </div>
            <div style="font-size: 10px; color: #94a3b8; margin-top: 6px;">
              Min Payout: <span style="color:#cbd5e1;">$${minPayout.toLocaleString()}</span> &bull; Max: <span style="color:#facc15; font-weight:800;">$${maxPayout.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Play / Start Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div id="match-game-instruction" style="font-size: 14px; font-weight: 700; color: #38bdf8;">
          ${this.matchStatus === 'playing' ? '👉 Click on unopened cards to find 3 matching rarities!' : 'Press START MATCH to begin your round.'}
        </div>
        <button id="btn-start-match-round" style="
          padding: 12px 32px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #0f172a; font-weight: 900; font-size: 15px; border: none; border-radius: 10px;
          cursor: pointer; box-shadow: 0 4px 18px rgba(245, 158, 11, 0.4);
        ">
          ${this.matchStatus === 'playing' ? 'RESTART ROUND' : `START MATCH ($${this.matchWager.toLocaleString()})`}
        </button>
      </div>

      <!-- 3x3 Card Grid (9 Cards) -->
      <div id="match-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; max-width: 640px; margin: 0 auto;">
        ${this.matchCards.length > 0 ? this.matchCards.map((c, i) => {
          const cfg = RARITY_CONFIG[c.car.rarity];
          return `
            <div class="match-card-item" data-idx="${i}" style="
              height: 140px; border-radius: 14px;
              background: ${c.revealed ? 'rgba(30, 41, 59, 0.95)' : 'linear-gradient(135deg, #1e293b, #0f172a)'};
              border: 2px solid ${c.revealed ? cfg.color : '#334155'};
              box-shadow: ${c.revealed ? `0 0 25px ${cfg.glow}` : '0 4px 15px rgba(0,0,0,0.5)'};
              display: flex; flex-direction: column; align-items: center; justify-content: center;
              cursor: ${c.revealed ? 'default' : 'pointer'};
              transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
              text-align: center; padding: 12px;
            ">
              ${c.revealed ? `
                <span style="font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 6px; background: ${cfg.color}; color: #0f172a; text-transform: uppercase; margin-bottom: 6px;">
                  ${c.car.rarity}
                </span>
                <div style="font-size: 14px; font-weight: 800; color: #f8fafc; line-height: 1.2; margin-bottom: 4px;">
                  ${c.car.name}
                </div>
                <div style="font-size: 12px; font-weight: 800; color: #4ade80; font-family: 'Rajdhani', sans-serif;">
                  $${c.car.basePrice.toLocaleString()}
                </div>
              ` : `
                <div style="font-size: 38px; color: #f59e0b; opacity: 0.8;">👑</div>
                <div style="font-size: 11px; font-weight: 800; color: #94a3b8; margin-top: 6px; letter-spacing: 1px;">CLICK TO REVEAL</div>
              `}
            </div>
          `;
        }).join('') : `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b; font-size: 14px;">
            Set your wager and hit START MATCH to deal 9 mystery cards!
          </div>
        `}
      </div>
    `;

    // Wager adjustment
    document.getElementById('btn-wager-minus')?.addEventListener('click', () => {
      this.matchWager = Math.max(minWager, this.matchWager - 2500);
      this.renderMatch3(container);
    });

    document.getElementById('btn-wager-plus')?.addEventListener('click', () => {
      this.matchWager = Math.min(maxWager, this.matchWager + 2500);
      this.renderMatch3(container);
    });

    // Start round
    document.getElementById('btn-start-match-round')?.addEventListener('click', () => {
      if (stateManager.state.cash < this.matchWager) {
        alert(`Insufficient virtual cash! Wager requires $${this.matchWager.toLocaleString()}`);
        return;
      }

      stateManager.addCash(-this.matchWager);
      this.matchStatus = 'playing';

      // Pick a target winning rarity (weighted by wager)
      const rarities: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
      const targetRarity = this.matchWager >= 50000 ? (Math.random() < 0.4 ? 'Legendary' : 'Epic') : (Math.random() < 0.5 ? 'Rare' : 'Uncommon');
      
      const targetCars = CAR_CATALOG.filter(c => c.rarity === targetRarity);
      const otherCars = CAR_CATALOG.filter(c => c.rarity !== targetRarity);

      // Create 9 cards with guarantee of at least 3 matching target cars
      const cardsList: { id: number; car: CarModelDef; revealed: boolean }[] = [];
      for (let i = 0; i < 3; i++) {
        cardsList.push({
          id: i,
          car: targetCars[Math.floor(Math.random() * targetCars.length)],
          revealed: false
        });
      }
      for (let i = 3; i < 9; i++) {
        cardsList.push({
          id: i,
          car: otherCars[Math.floor(Math.random() * otherCars.length)],
          revealed: false
        });
      }

      // Shuffle
      this.matchCards = cardsList.sort(() => Math.random() - 0.5);
      soundEngine.playCrateOpen();
      this.renderHUD();
      this.renderMatch3(container);
    });

    // Handle card clicks
    container.querySelectorAll('.match-card-item').forEach(cardEl => {
      cardEl.addEventListener('click', (e) => {
        if (this.matchStatus !== 'playing') return;
        const idx = parseInt((e.currentTarget as HTMLElement).dataset.idx || '0');
        if (this.matchCards[idx].revealed) return;

        this.matchCards[idx].revealed = true;
        soundEngine.playTick();

        // Check if 3 matching rarities revealed
        const revealedRarities: Record<string, CarModelDef[]> = {};
        this.matchCards.filter(c => c.revealed).forEach(c => {
          if (!revealedRarities[c.car.rarity]) revealedRarities[c.car.rarity] = [];
          revealedRarities[c.car.rarity].push(c.car);
        });

        let winningMatch: { rarity: string; car: CarModelDef } | null = null;
        for (const [r, list] of Object.entries(revealedRarities)) {
          if (list.length >= 3) {
            winningMatch = { rarity: r, car: list[0] };
            break;
          }
        }

        if (winningMatch) {
          this.matchStatus = 'won';
          // Reward: give player the matched car + calculated cash payout
          const bonusCash = Math.floor(this.matchWager * (winningMatch.rarity === 'Legendary' ? 6.5 : winningMatch.rarity === 'Epic' ? 4.0 : 2.0));
          stateManager.addCarToGarage(winningMatch.car.id);
          stateManager.addCash(bonusCash);

          soundEngine.playReveal(winningMatch.car.rarity as Rarity);
          confetti({ particleCount: 150, spread: 100 });

          // Reveal all remaining
          this.matchCards.forEach(c => c.revealed = true);
          this.renderMatch3(container);
          this.renderHUD();
          setTimeout(() => {
            alert(`🎉 MATCH 3 WINNER!\n\nYou matched 3 ${winningMatch.rarity} cards!\n\n🏆 Won Vehicle: ${winningMatch.car.name}\n💰 Cash Payout: +$${bonusCash.toLocaleString()}!`);
          }, 300);
          return;
        }

        // Check if all cards revealed without matching
        if (this.matchCards.every(c => c.revealed)) {
          this.matchStatus = 'lost';
          alert('Round ended! No 3 identical rarities matched.');
        }

        this.renderMatch3(container);
      });
    });
  }

  // --- DAILY WHEEL TAB ---
  private renderWheel(container: HTMLElement) {
    container.innerHTML = `
      <div style="text-align: center; max-width: 480px; margin: 0 auto;">
        <p style="font-size: 14px; color: #94a3b8; margin-bottom: 20px;">
          Spin daily for free virtual money, card packs, and XP bonuses!
        </p>

        <div style="position: relative; width: 300px; height: 300px; margin: 0 auto 24px auto;">
          <canvas id="wheel-canvas" width="300" height="300" style="border-radius: 50%; box-shadow: 0 0 25px rgba(56, 189, 248, 0.3);"></canvas>
          <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 24px solid #ef4444; z-index: 5;"></div>
        </div>

        <button id="btn-spin-wheel" style="padding: 14px 36px; font-size: 16px; font-weight: 800; background: #38bdf8; color: #0f172a; border: none; border-radius: 10px; cursor: pointer;">
          SPIN DAILY WHEEL
        </button>
      </div>
    `;

    this.drawWheelCanvas();

    document.getElementById('btn-spin-wheel')?.addEventListener('click', () => {
      this.spinWheelAnimation();
    });
  }

  private drawWheelCanvas(rotation = 0) {
    const canvas = document.getElementById('wheel-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numSlices = DAILY_REWARD_ITEMS.length;
    const arc = (2 * Math.PI) / numSlices;
    const radius = 150;

    ctx.clearRect(0, 0, 300, 300);
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(rotation);

    DAILY_REWARD_ITEMS.forEach((item, i) => {
      const angle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = item.color;
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + arc);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(item.name, radius - 15, 4);
      ctx.restore();
    });

    ctx.restore();
  }

  private spinWheelAnimation() {
    const canvas = document.getElementById('wheel-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    let currentRotation = 0;
    const totalRotation = Math.PI * 2 * 5 + Math.random() * Math.PI * 2;
    const duration = 3500;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      currentRotation = totalRotation * ease;
      this.drawWheelCanvas(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const norm = (currentRotation % (Math.PI * 2));
        const arc = (Math.PI * 2) / DAILY_REWARD_ITEMS.length;
        const sliceIdx = Math.floor((Math.PI * 2 - (norm % (Math.PI * 2))) / arc) % DAILY_REWARD_ITEMS.length;
        const prize = DAILY_REWARD_ITEMS[sliceIdx];

        soundEngine.playCashEarned();
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.55 } });

        if (prize.type === 'cash') {
          stateManager.addCash(prize.amount || 25000);
        } else if (prize.type === 'xp') {
          stateManager.addXp(prize.amount || 500);
        } else if (prize.type === 'crate') {
          stateManager.addCash(15000);
        }

        stateManager.state.lastWheelSpin = Date.now();
        stateManager.save();
        alert(`🎉 You won: ${prize.name}! Added to your virtual balance.`);
      }
    };

    requestAnimationFrame(animate);
  }

  // --- MISSIONS TAB ---
  private renderMissions(container: HTMLElement) {
    const s = stateManager.state;
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${s.missions.map(m => {
          const progressPercent = Math.min(100, (m.current / m.goal) * 100);

          return `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
              <div style="flex: 1; margin-right: 16px;">
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${m.type === 'daily' ? '#38bdf8' : '#a855f7'}; color: #0f172a; text-transform: uppercase;">${m.type}</span>
                  <h4 style="font-size: 16px; font-weight: 700; color: #f8fafc;">${m.title}</h4>
                </div>
                <p style="font-size: 13px; color: #94a3b8; margin-bottom: 8px;">${m.desc}</p>
                <div style="background: #1e293b; height: 6px; border-radius: 3px; overflow: hidden; width: 100%;">
                  <div style="background: #38bdf8; height: 100%; width: ${progressPercent}%;"></div>
                </div>
              </div>

              <div style="text-align: right; min-width: 140px;">
                <div style="font-size: 14px; font-weight: 800; color: #4ade80; margin-bottom: 2px;">+$${m.rewardCash.toLocaleString()}</div>
                <div style="font-size: 12px; color: #38bdf8; margin-bottom: 8px;">+${m.rewardXp} XP</div>
                ${m.completed ? (
                  m.claimed ? `
                    <button disabled style="padding: 6px 14px; background: #334155; color: #64748b; font-size: 12px; font-weight: 700; border: none; border-radius: 6px;">
                      CLAIMED
                    </button>
                  ` : `
                    <button class="claim-mission-btn" data-id="${m.id}" style="padding: 6px 14px; background: #22c55e; color: #0f172a; font-size: 12px; font-weight: 800; border: none; border-radius: 6px; cursor: pointer;">
                      CLAIM REWARD
                    </button>
                  `
                ) : `
                  <span style="font-size: 12px; color: #64748b; font-weight: 600;">${m.current} / ${m.goal}</span>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelectorAll('.claim-mission-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mId = (e.currentTarget as HTMLElement).dataset.id;
        if (mId && stateManager.claimMission(mId)) {
          soundEngine.playCashEarned();
          confetti({ particleCount: 50, spread: 60 });
          this.renderMissions(container);
          this.renderHUD();
        }
      });
    });
  }

  // --- LEADERBOARD TAB ---
  private renderLeaderboard(container: HTMLElement) {
    const totalVal = stateManager.state.garage.reduce((sum, item) => {
      const model = CAR_CATALOG.find(c => c.id === item.modelId);
      return sum + (model ? model.basePrice : 3000);
    }, 0);

    const fakeLeaders = [
      { rank: 1, name: 'CrownKing_VIP', garageVal: '$18,450,000', carsCount: 38, car: 'Crown Celestial Phantom V' },
      { rank: 2, name: 'DriftPhantom99', garageVal: '$9,200,000', carsCount: 29, car: 'Angelholm Jesko Absolut' },
      { rank: 3, name: 'ApexStig', garageVal: '$6,800,000', carsCount: 24, car: 'Apex Gran Prix Zero One' },
      { rank: 4, name: 'TokyoGhoul_X', garageVal: '$4,150,000', carsCount: 19, car: 'Molsheim Chiron 300+ Edition' },
      { rank: 5, name: 'Player (You)', garageVal: '$' + totalVal.toLocaleString(), carsCount: stateManager.state.garage.length, car: stateManager.getActiveCar()?.model.name || 'Pulse Hatch GL' }
    ];

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06);">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
          <thead>
            <tr style="background: #1e293b; color: #94a3b8; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 14px 18px;"># Rank</th>
              <th style="padding: 14px 18px;">Driver</th>
              <th style="padding: 14px 18px;">Crown Grail</th>
              <th style="padding: 14px 18px;">Cars Owned</th>
              <th style="padding: 14px 18px;">Collection Value</th>
            </tr>
          </thead>
          <tbody>
            ${fakeLeaders.map(row => `
              <tr style="border-bottom: 1px solid #334155; ${row.name.includes('You') ? 'background: rgba(56, 189, 248, 0.12); font-weight: 700;' : ''}">
                <td style="padding: 14px 18px; color: ${row.rank === 1 ? '#facc15' : '#f8fafc'}; font-weight: 800;">${row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : row.rank}</td>
                <td style="padding: 14px 18px; color: #f8fafc;">${row.name}</td>
                <td style="padding: 14px 18px; color: #38bdf8;">${row.car}</td>
                <td style="padding: 14px 18px; color: #cbd5e1;">${row.carsCount}</td>
                <td style="padding: 14px 18px; color: #4ade80; font-weight: 700;">${row.garageVal}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --- STORED PACKS VAULT TAB ---
  private renderStoredPacks(container: HTMLElement) {
    const packs = stateManager.state.inventoryPacks || [];

    if (packs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 54px; margin-bottom: 14px;">💼</div>
          <h3 style="font-size: 20px; font-weight: 800; color: #f8fafc; margin-bottom: 8px;">Your Pack Vault is Empty</h3>
          <p style="font-size: 14px; color: #94a3b8; max-width: 440px; margin: 0 auto 20px auto;">
            You can purchase packs and choose "Buy & Save Pack to Vault" on the store page to save them for opening later!
          </p>
          <button id="btn-vault-goto-store" style="padding: 12px 24px; background: #38bdf8; color: #0f172a; font-weight: 900; border-radius: 10px; border: none; cursor: pointer;">
            GO TO PACKS STORE 📦
          </button>
        </div>
      `;
      document.getElementById('btn-vault-goto-store')?.addEventListener('click', () => {
        this.closeModal();
      });
      return;
    }

    container.innerHTML = `
      <div style="margin-bottom: 20px; color: #94a3b8; font-size: 14px;">
        You have <strong>${packs.length} unopened packs</strong> securely saved in your personal account vault. Open them anytime!
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px;">
        ${packs.map(p => {
          const crate = CRATE_CATALOG.find(c => c.id === p.crateId) || CRATE_CATALOG[0];
          return `
            <div style="background: rgba(30, 41, 59, 0.75); border: 2px solid ${crate.accentHex}; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
                  <span style="font-size: 38px;">${crate.icon}</span>
                  <div>
                    <h4 style="font-size: 17px; font-weight: 800; color: #f8fafc;">${crate.name}</h4>
                    <span style="font-size: 11px; color: ${crate.accentHex}; font-weight: 700;">STORED IN VAULT</span>
                  </div>
                </div>
                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">${crate.description}</p>
              </div>
              <button class="btn-open-stored-pack" data-packid="${p.id}" data-crateid="${crate.id}" style="width: 100%; padding: 12px; background: ${crate.accentHex}; color: #0f172a; font-weight: 900; font-size: 14px; border: none; border-radius: 10px; cursor: pointer;">
                OPEN PACK NOW 🎁
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-open-stored-pack').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const packId = (e.currentTarget as HTMLElement).dataset.packid;
        const crateId = (e.currentTarget as HTMLElement).dataset.crateid;
        if (packId && crateId) {
          stateManager.consumePackFromInventory(packId);
          this.closeModal();
          const crate = CRATE_CATALOG.find(c => c.id === crateId);
          if (crate) {
            const rolled = this.rollRandomCar(crate);
            this.startRouletteOpeningAnimation(crate, rolled);
          }
        }
      });
    });
  }

  // --- ADMIN CONTROL PANEL TAB ---
  private async renderAdminPanel(container: HTMLElement) {
    if (!AuthService.isAdmin()) {
      container.innerHTML = `<div style="color: #ef4444; font-weight: 700;">Access Denied. Administrator role required.</div>`;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 16px; background: rgba(236, 72, 153, 0.1); border: 1px solid rgba(236, 72, 153, 0.3); border-radius: 14px;">
        <div>
          <h3 style="font-size: 18px; font-weight: 900; color: #f472b6;">👑 Superuser Admin Console</h3>
          <p style="font-size: 12px; color: #cbd5e1;">Manage registered accounts, inspect saved wallets & packs, and modify user balances permanently in SQLite database.</p>
        </div>
        <button id="btn-admin-refresh" style="padding: 8px 16px; background: #ec4899; color: white; font-weight: 800; border-radius: 8px; border: none; cursor: pointer;">
          Refresh User List 🔄
        </button>
      </div>

      <div style="margin-bottom: 24px; padding: 16px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px;">
        <h4 style="font-size: 15px; font-weight: 800; color: #f8fafc; margin-bottom: 8px;">🔐 Change Admin Password (Recommended for Production)</h4>
        <div style="display: flex; gap: 10px; max-width: 450px;">
          <input type="password" id="admin-new-password" placeholder="Enter new password" style="flex: 1; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 8px 12px; color: white;">
          <button id="btn-admin-save-password" style="padding: 8px 16px; background: #22c55e; color: #0f172a; font-weight: 800; border-radius: 8px; border: none; cursor: pointer;">
            Update
          </button>
        </div>
      </div>

      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06);">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
          <thead>
            <tr style="background: #1e293b; color: #94a3b8; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 14px;">User</th>
              <th style="padding: 14px;">Role</th>
              <th style="padding: 14px;">Saved Balance</th>
              <th style="padding: 14px;">Owned Cars</th>
              <th style="padding: 14px;">Stored Packs</th>
              <th style="padding: 14px;">Actions</th>
            </tr>
          </thead>
          <tbody id="admin-user-tbody">
            <tr><td colspan="6" style="padding: 24px; text-align: center; color: #94a3b8;">Loading user database...</td></tr>
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('btn-admin-save-password')?.addEventListener('click', async () => {
      const inp = document.getElementById('admin-new-password') as HTMLInputElement;
      if (!inp || !inp.value) return;
      const ok = await AuthService.adminChangePassword(inp.value);
      if (ok) {
        alert('✅ Admin password successfully updated in database!');
        inp.value = '';
      } else {
        alert('❌ Failed to update password');
      }
    });

    const loadUsers = async () => {
      const tbody = document.getElementById('admin-user-tbody');
      if (!tbody) return;
      const users = await AuthService.adminGetUsers();
      if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="padding: 20px; text-align: center; color: #94a3b8;">No registered users found.</td></tr>`;
        return;
      }

      tbody.innerHTML = users.map(u => `
        <tr style="border-bottom: 1px solid #334155;">
          <td style="padding: 14px; font-weight: 700; color: #f8fafc;">
            ${u.username}
            ${u.username === 'admin' ? '<span style="font-size: 9px; background: #ec4899; color: white; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">ADMIN</span>' : ''}
          </td>
          <td style="padding: 14px; color: ${u.role === 'admin' ? '#f472b6' : '#94a3b8'}; text-transform: uppercase; font-size: 11px; font-weight: 700;">${u.role}</td>
          <td style="padding: 14px; font-weight: 800; color: #4ade80; font-family: 'Rajdhani', sans-serif; font-size: 16px;">$${(u.cash || 0).toLocaleString()}</td>
          <td style="padding: 14px; color: #cbd5e1;">${u.carsCount || 0} cars</td>
          <td style="padding: 14px; color: #38bdf8;">${u.packsCount || 0} packs</td>
          <td style="padding: 14px;">
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="btn-admin-give-cash" data-id="${u.id}" data-cash="${u.cash || 0}" style="padding: 5px 10px; background: rgba(74, 222, 128, 0.2); border: 1px solid #4ade80; color: #4ade80; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                💵 Edit Money
              </button>
              <button class="btn-admin-give-pack" data-id="${u.id}" style="padding: 5px 10px; background: rgba(56, 189, 248, 0.2); border: 1px solid #38bdf8; color: #38bdf8; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                🎁 Grant Pack
              </button>
              <button class="btn-admin-reset-user" data-id="${u.id}" data-user="${u.username}" style="padding: 5px 10px; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #f87171; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                Reset
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      // Bind admin actions
      tbody.querySelectorAll('.btn-admin-give-cash').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const userId = (e.currentTarget as HTMLElement).dataset.id;
          const currentCash = parseInt((e.currentTarget as HTMLElement).dataset.cash || '0');
          const input = prompt(`Enter new cash balance for user:`, currentCash.toString());
          if (input !== null && userId) {
            const newCash = parseInt(input) || 0;
            await AuthService.adminUpdateUser(userId, { cash: newCash });
            alert('Balance updated!');
            loadUsers();
          }
        });
      });

      tbody.querySelectorAll('.btn-admin-give-pack').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const userId = (e.currentTarget as HTMLElement).dataset.id;
          const packChoice = prompt(`Enter Pack ID to grant:\n- crate_starter\n- crate_basic\n- crate_tuner\n- crate_exotic\n- crate_prestige\n- crate_midnight_special`, 'crate_prestige');
          if (packChoice && userId) {
            await AuthService.adminUpdateUser(userId, { addPackId: packChoice });
            alert(`Granted ${packChoice} to user!`);
            loadUsers();
          }
        });
      });

      tbody.querySelectorAll('.btn-admin-reset-user').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const userId = (e.currentTarget as HTMLElement).dataset.id;
          const uname = (e.currentTarget as HTMLElement).dataset.user;
          if (confirm(`Are you sure you want to completely reset ${uname}'s money and packs?`)) {
            await AuthService.adminUpdateUser(userId!, { resetProgress: true });
            alert('User reset to starting defaults.');
            loadUsers();
          }
        });
      });
    };

    document.getElementById('btn-admin-refresh')?.addEventListener('click', loadUsers);
    await loadUsers();
  }
}
