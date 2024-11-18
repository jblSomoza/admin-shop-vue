import { tesloApi } from "@/api/tesloApi";
import { isAxiosError } from "axios";
import type { User } from "../interfaces/user.interface";
import type { AuthResponse } from "../interfaces/auth.response";

interface RegisterError {
  ok: false,
  message: string,
}

interface RegisterSuccess {
  ok: true,
  user: User,
  token: string
}

export const registerAction = async (fullName: string, email: string, password: string): Promise<RegisterError | RegisterSuccess> => {
  try {
    const { data } = await tesloApi.post<AuthResponse>('/auth/register', {
      fullName: fullName,
      email: email,
      password: password,
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
}
