import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db, initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../../dist');

initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'crowncards_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Auth middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin permission required' });
  }
  next();
}

// 1. REGISTER
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(cleanUsername);
    if (existing) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now();
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    db.prepare('INSERT INTO users (id, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)').run(
      userId,
      cleanUsername,
      passwordHash,
      'user',
      Date.now()
    );

    // Starter car
    const starterCar = {
      instanceId: 'starter_' + Math.random().toString(36).substring(2, 9),
      modelId: 'car_pulse_gl',
      acquiredAt: Date.now(),
      paintColor: '#64748b',
      finish: 'Gloss',
      accentColor: '#38bdf8',
      tintLevel: 0.2,
      customPlate: 'ROOKIE-1'
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
      userId,
      25000, // starting balance 25k as requested
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

    const token = jwt.sign({ id: userId, username: cleanUsername, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: userId, username: cleanUsername, role: 'user' }
    });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. LOGIN
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user: any = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. CURRENT USER INFO
app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const user: any = db.prepare('SELECT id, username, role, created_at FROM users WHERE id = ?').get(req.user!.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. LOAD USER GAME STATE
app.get('/api/game/state', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const data: any = db.prepare('SELECT * FROM user_data WHERE user_id = ?').get(req.user!.id);
    if (!data) return res.status(404).json({ error: 'Game data not found' });

    res.json({
      state: {
        cash: data.cash,
        xp: data.xp,
        rank: data.rank,
        rankName: data.rank_name,
        activeCarId: data.active_car_id,
        lastWheelSpin: data.last_wheel_spin,
        stats: JSON.parse(data.stats_json || '{}'),
        garage: JSON.parse(data.garage_json || '[]'),
        inventoryPacks: JSON.parse(data.inventory_packs_json || '[]'),
        missions: JSON.parse(data.missions_json || '[]'),
        history: JSON.parse(data.history_json || '[]'),
        completedSets: JSON.parse(data.completed_sets_json || '[]'),
        fastOpen: Boolean(data.fast_open),
        isMuted: Boolean(data.is_muted)
      }
    });
  } catch (err: any) {
    console.error('Load state error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. SAVE USER GAME STATE
app.post('/api/game/state', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const s = req.body;
    if (!s) return res.status(400).json({ error: 'State data required' });

    db.prepare(`
      UPDATE user_data SET
        cash = ?,
        xp = ?,
        rank = ?,
        rank_name = ?,
        active_car_id = ?,
        last_wheel_spin = ?,
        stats_json = ?,
        garage_json = ?,
        inventory_packs_json = ?,
        missions_json = ?,
        history_json = ?,
        completed_sets_json = ?,
        fast_open = ?,
        is_muted = ?,
        updated_at = ?
      WHERE user_id = ?
    `).run(
      s.cash ?? 25000,
      s.xp ?? 0,
      s.rank ?? 1,
      s.rankName ?? 'Street Rookie',
      s.activeCarId ?? '',
      s.lastWheelSpin ?? 0,
      JSON.stringify(s.stats || {}),
      JSON.stringify(s.garage || []),
      JSON.stringify(s.inventoryPacks || []),
      JSON.stringify(s.missions || []),
      JSON.stringify(s.history || []),
      JSON.stringify(s.completedSets || []),
      s.fastOpen ? 1 : 0,
      s.isMuted ? 1 : 0,
      Date.now(),
      req.user!.id
    );

    res.json({ success: true, savedAt: Date.now() });
  } catch (err: any) {
    console.error('Save state error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 6. ADMIN API ROUTES
app.get('/api/admin/users', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const users: any[] = db.prepare(`
      SELECT u.id, u.username, u.role, u.created_at,
             d.cash, d.rank, d.rank_name, d.garage_json, d.inventory_packs_json, d.updated_at
      FROM users u
      LEFT JOIN user_data d ON u.id = d.user_id
      ORDER BY u.created_at DESC
    `).all();

    const formatted = users.map(u => ({
      id: u.id,
      username: u.username,
      role: u.role,
      createdAt: u.created_at,
      updatedAt: u.updated_at,
      cash: u.cash,
      rank: u.rank,
      rankName: u.rank_name,
      carsCount: JSON.parse(u.garage_json || '[]').length,
      packsCount: JSON.parse(u.inventory_packs_json || '[]').length,
      packsList: JSON.parse(u.inventory_packs_json || '[]')
    }));

    res.json({ users: formatted });
  } catch (err: any) {
    console.error('Admin get users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin update user balance/packs
app.post('/api/admin/user/:userId/update', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { cash, addPackId, resetProgress } = req.body;

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (resetProgress) {
      const starterCar = {
        instanceId: 'starter_' + Math.random().toString(36).substring(2, 9),
        modelId: 'car_pulse_gl',
        acquiredAt: Date.now(),
        paintColor: '#64748b',
        finish: 'Gloss',
        accentColor: '#38bdf8',
        tintLevel: 0.2,
        customPlate: 'RESET-01'
      };
      db.prepare(`
        UPDATE user_data SET
          cash = 25000,
          xp = 0,
          rank = 1,
          rank_name = 'Street Rookie',
          active_car_id = ?,
          garage_json = ?,
          inventory_packs_json = '[]',
          missions_json = '[]',
          history_json = '[]',
          completed_sets_json = '[]',
          updated_at = ?
        WHERE user_id = ?
      `).run(starterCar.instanceId, JSON.stringify([starterCar]), Date.now(), userId);

      return res.json({ message: 'User progress reset successfully' });
    }

    if (typeof cash === 'number') {
      db.prepare('UPDATE user_data SET cash = ?, updated_at = ? WHERE user_id = ?').run(cash, Date.now(), userId);
    }

    if (addPackId) {
      const data: any = db.prepare('SELECT inventory_packs_json FROM user_data WHERE user_id = ?').get(userId);
      const packs = JSON.parse(data?.inventory_packs_json || '[]');
      packs.push({
        id: 'pack_' + Math.random().toString(36).substring(2, 9),
        crateId: addPackId,
        addedAt: Date.now()
      });
      db.prepare('UPDATE user_data SET inventory_packs_json = ?, updated_at = ? WHERE user_id = ?').run(
        JSON.stringify(packs),
        Date.now(),
        userId
      );
    }

    res.json({ message: 'User updated successfully' });
  } catch (err: any) {
    console.error('Admin update user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin change password for user or admin
app.post('/api/admin/change-password', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, req.user!.id);
    res.json({ message: 'Password updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static frontend files when built
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`[CrownCards API] Server running on http://localhost:${PORT}`);
});

