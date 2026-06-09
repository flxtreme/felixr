const PREFIX = 'felixr_';

export const setSession = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`${PREFIX}${key}`, value);
  }
};

export const getSession = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(`${PREFIX}${key}`);
  }
  return null;
};

export const removeSession = (key: string): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(`${PREFIX}${key}`);
  }
};

