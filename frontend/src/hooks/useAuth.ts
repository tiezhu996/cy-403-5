import { computed } from 'vue';
import { useAuthStore } from '@/stores/user';
import type { UserRole } from '@/types/enums';

export function useAuth() {
  const auth = useAuthStore();
  const isLoggedIn = computed(() => auth.isAuthenticated);
  const currentRole = computed(() => auth.user?.role);

  return {
    auth,
    user: computed(() => auth.user),
    isLoggedIn,
    currentRole,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    switchRole: auth.switchRole,
    can: (roles: UserRole[]) => auth.canUse(roles),
  };
}

