import { AuthUser } from './types';

const API_BASE = '/api';
const TOKEN_KEY = 'crowncards_auth_token';
const USER_KEY = 'crowncards_auth_user';

export class AuthService {
  private static currentUser: AuthUser | null = null;
  private static token: string | null = null;

  public static init(): { token: string | null; user: AuthUser | null } {
    this.token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
      } catch (e) {
        this.currentUser = null;
      }
    }
    return { token: this.token, user: this.currentUser };
  }

  public static getUser(): AuthUser | null {
    if (!this.currentUser) {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          this.currentUser = JSON.parse(userStr);
        } catch {
          this.currentUser = null;
        }
      }
    }
    return this.currentUser;
  }

  public static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  public static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public static isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }

  public static async register(username: string, password: string):Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create account' };
      }
      this.token = data.token;
      this.currentUser = data.user;
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: 'Cannot connect to authentication server. Is the backend running?' };
    }
  }

  public static async login(username: string, password: string): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
      this.token = data.token;
      this.currentUser = data.user;
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: 'Cannot connect to server. Is the backend running?' };
    }
  }

  public static logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  public static async fetchGameState(): Promise<any | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/game/state`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        this.logout();
        return null;
      }
      const data = await res.json();
      return data.state;
    } catch (e) {
      console.warn('Failed to fetch remote state, falling back to cached state:', e);
      return null;
    }
  }

  public static async saveGameState(state: any): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/game/state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(state)
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to sync state to server:', e);
      return false;
    }
  }

  // Admin APIs
  public static async adminGetUsers(): Promise<any[]> {
    const token = this.getToken();
    if (!token) return [];
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.users || [];
    } catch (e) {
      console.error('Admin get users error:', e);
      return [];
    }
  }

  public static async adminUpdateUser(userId: string, payload: { cash?: number; addPackId?: string; resetProgress?: boolean }): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/admin/user/${userId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch (e) {
      console.error('Admin update user error:', e);
      return false;
    }
  }

  public static async adminChangePassword(newPassword: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }
}

