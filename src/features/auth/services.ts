import {fetcher} from '@/src/utils/fetcher';

import type {
  LoginPayload,
  LoginResponse,
} from '@/src/features/auth/types';

const API_PREFIX = '/auth';

export const login = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  return fetcher(`${API_PREFIX}/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};