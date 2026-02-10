const LOCK_KEY = "pokedex_integrity_lock";

export function getIntegrityLock() {
  try {
    const raw = localStorage.getItem(LOCK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.pokemonName) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setIntegrityLock(pokemonName) {
  localStorage.setItem(
    LOCK_KEY,
    JSON.stringify({
      pokemonName,
      createdAt: new Date().toISOString(),
      active: true,
    })
  );
}

export function clearIntegrityLock() {
  localStorage.removeItem(LOCK_KEY);
}
