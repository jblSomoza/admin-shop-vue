import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { checkAuthAction, loginAction, registerAction } from '../actions';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | undefined>();
  const token = ref(useLocalStorage('token', ''));
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);

  const login = async (email: string, password: string) => {
    try {
      const loginResponse = await loginAction(email, password);

      if (!loginResponse.ok) {
        logout();
        return false;
      }

      user.value = loginResponse.user;
      token.value = loginResponse.token;
      authStatus.value = AuthStatus.Authenticated;

      return true;
    } catch {
      return logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    authStatus.value = AuthStatus.NotAuthenticated;
    user.value = undefined;
    token.value = '';
    return false;
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const response = await registerAction(fullName, email, password);

      if (!response.ok) {
        logout();
        return {
          ok: false,
          message: response.message,
        };
      }

      user.value = response.user;
      token.value = response.token;
      authStatus.value = AuthStatus.Authenticated;
      return {
        ok: true,
        message: 'Usuario creado correctamente',
      };
    } catch {
      logout();
      return {
        ok: false,
        message: 'No se pudo realizar la petición',
      };
    }
  }

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResponse = await checkAuthAction();

      if (!statusResponse.ok) {
        logout();
        return false;
      }

      user.value = statusResponse.user;
      token.value = statusResponse.token;
      authStatus.value = AuthStatus.Authenticated;
      return true;
    } catch {
      logout();
      return false;
    }
  };


  return {
    user,
    token,
    authStatus,

    // Getter
    isAdmin: computed(() => user.value?.roles.includes('admin') ?? false),
    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),
    isUnauthenticated: computed(() => authStatus.value === AuthStatus.NotAuthenticated),
    userFullName: computed(() => user.value?.fullName),

    // Actions
    login,
    register,
    logout,
    checkAuthStatus,
  }
})
