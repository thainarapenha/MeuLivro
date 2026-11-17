const AUTH_STORAGE_KEY = "@meuLivroAuth";
const LEGACY_AUTH_STORAGE_KEY = "@meuLivroLogin";

export function getAuthSession() {
  try {
    const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return getAuthSession()?.token || null;
}

export function saveAuthSession(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
}
