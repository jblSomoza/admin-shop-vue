import { isAxiosError } from "axios";

import { tesloApi } from "@/api/tesloApi";
import type { AuthResponse } from "../interfaces/auth.response";
import type { User } from "../interfaces/user.interface";

interface LoginError {
  ok: false,
  message: string,
}

interface LoginSuccess {
  ok: true,
  user: User,
  token: string
}

export const loginAction = async (email: string, password: string): Promise<LoginError | LoginSuccess> => {
  try {
    const { data } = await tesloApi.post<AuthResponse>('/auth/login', {
      email,
      password
    });

    return {
      ok: true,
      user: data.user,
      token: data.token,
    }

  } catch (error) {
    if (isAxiosError(error) && error.status === 401) {
      return {
        ok: false,
        message: 'Usuario o contraseña incorrecta',
      }
    }

    throw new Error('No se pudo realizar la petición');
  }
};
