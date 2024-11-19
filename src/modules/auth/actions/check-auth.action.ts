import { tesloApi } from "@/api/tesloApi";
import type { User } from "../interfaces/user.interface";
import { isAxiosError } from "axios";

interface CheckError {
  ok: false;
}

interface CheckSuccess {
  ok: true;
  user: User;
  token: string;
}

export const checkAuthAction = async (): Promise<CheckError | CheckSuccess> => {
  try {

    const localToken = localStorage.getItem('token');
    if (localToken && localToken.length < 10) {
      return {
        ok: false,
      }
    }

    const { data } = await tesloApi.get('/auth/check-status');

    return {
      ok: true,
      user: data.user,
      token: data.token,
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
      }
    }

    throw error;
  }
}
