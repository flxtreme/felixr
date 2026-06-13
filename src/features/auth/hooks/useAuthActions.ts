import { login } from "@/src/features/auth/services";
import { removeSession } from "@/src/utils/session";
import { useRouter } from "next/navigation";

import type { LoginPayload, LoginResponse } from "@/src/features/auth/types";

export const useAuthActions = () => {
  const router = useRouter();

  const signIn = async (payload: LoginPayload): Promise<LoginResponse> => {
    return login(payload);
  };

  const signOut = () => {
    removeSession("accessToken");
    router.replace("/login");
  };

  return {
    signIn,
    signOut,
  };
};
