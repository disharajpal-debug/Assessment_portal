const AUTH_STORAGE_KEY = "auth";

export const setAuth = (data) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
};

export const getStoredAuth = () => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getAuth = () => {
  return getStoredAuth()?.user || null;
};

export const getAccessToken = () => {
  return getStoredAuth()?.access || null;
};

export const getRefreshToken = () => {
  return getStoredAuth()?.refresh || null;
};

export const updateAccessToken = (accessToken) => {
  const auth = getStoredAuth();
  if (!auth) return;
  setAuth({ ...auth, access: accessToken });
};

export const logout = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
