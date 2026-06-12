import { defineStore } from 'pinia';
import { loginApi, registerApi, switchRoleApi } from '@/api/auth';
import type { User } from '@/types/entities';
import { UserRole } from '@/types/enums';
import { clearToken, getStoredUser, getToken, setStoredUser, setToken } from '@/utils/storage';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken(),
    user: getStoredUser() as User | null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    isInstructor: (state) => state.user?.role === UserRole.INSTRUCTOR || state.user?.role === UserRole.ADMIN,
  },
  actions: {
    bootstrap() {
      this.token = getToken();
      this.user = getStoredUser();
    },
    async login(payload: { phone: string; password: string }) {
      const result = await loginApi(payload);
      this.token = result.accessToken;
      this.user = result.user;
      setToken(result.accessToken);
      setStoredUser(result.user);
      return result.user;
    },
    async register(payload: { name: string; phone: string; password: string; role?: UserRole }) {
      const result = await registerApi(payload);
      this.token = result.accessToken;
      this.user = result.user;
      setToken(result.accessToken);
      setStoredUser(result.user);
      return result.user;
    },
    async switchRole(role: UserRole) {
      const result = await switchRoleApi(role);
      this.token = result.accessToken;
      this.user = result.user;
      setToken(result.accessToken);
      setStoredUser(result.user);
    },
    logout() {
      this.token = null;
      this.user = null;
      clearToken();
    },
    canUse(roles: UserRole[]) {
      return Boolean(this.user && roles.includes(this.user.role));
    },
  },
});

