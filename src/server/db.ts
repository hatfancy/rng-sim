import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../crowncards.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_data (
      user_id TEXT PRIMARY KEY,
      cash INTEGER NOT NULL DEFAULT 25000,
      xp INTEGER NOT NULL DEFAULT 0,
      rank INTEGER NOT NULL DEFAULT 1,
      rank_name TEXT NOT NULL DEFAULT 'Street Rookie',
      active_car_id TEXT,
      last_wheel_spin INTEGER NOT NULL DEFAULT 0,
      stats_json TEXT NOT NULL,
      garage_json TEXT NOT NULL,
      inventory_packs_json TEXT NOT NULL DEFAULT '[]',
      missions_json TEXT NOT NULL,
      history_json TEXT NOT NULL DEFAULT '[]',
      completed_sets_json TEXT NOT NULL DEFAULT '[]',
      fast_open INTEGER NOT NULL DEFAULT 0,
      is_muted INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Ensure default admin account exists
  const admin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!admin) {
    const adminId = 'admin_' + Date.now();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin', salt);
    
    db.prepare('INSERT INTO users (id, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)').run(
      adminId,
      'admin',
      hash,
      'admin',
      Date.now()
    );

    // Initial starter car for admin
    const starterCar = {
      instanceId: 'admin_car_initial',
      modelId: 'car_pulse_gl',
      acquiredAt: Date.now(),
      paintColor: '#64748b',
      finish: 'Gloss',
      accentColor: '#38bdf8',
      tintLevel: 0.2,
      customPlate: 'ADMIN-01'
    };

    const initialStats = {
      cratesOpened: 0,
      totalEarnedFromSales: 0,
      mythicsOpened: 0,
      exclusivesOpened: 0,
      tradeUpsCompleted: 0
    };

    db.prepare(`
      INSERT INTO user_data (
        user_id, cash, xp, rank, rank_name, active_car_id, last_wheel_spin,
        stats_json, garage_json, inventory_packs_json, missions_json, history_json,
        completed_sets_json, fast_open, is_muted, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      adminId,
      500000, // Admin starter cash
      0,
      1,
      'Street Rookie',
      starterCar.instanceId,
      0,
      JSON.stringify(initialStats),
      JSON.stringify([starterCar]),
      JSON.stringify([]),
      JSON.stringify([]),
      JSON.stringify([]),
      JSON.stringify([]),
      0,
      0,
      Date.now()
    );
    console.log('[Database] Default admin account initialized: admin / admin');
  }
}

